const installed = Symbol.for('blade-reversal.authored-enemy-attacks-v1');
const ATTACK_URL = '/assets/samurai-attacks-v1.glb';
export const AUTHORED_ATTACK_CLIPS = Object.freeze(['AttackTop', 'AttackRight', 'AttackBottom', 'AttackLeft']);

const clamp01 = (value) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
const phaseClip = (phase) => phase === 'telegraph' ? 'Windup'
  : phase === 'strike' ? 'Strike'
    : phase === 'recovery' ? 'Recovery'
      : phase === 'recovery-interrupted' ? 'Parry'
        : 'Idle';

export function authoredAttackProgress(phase, phaseProgress) {
  const p = clamp01(phaseProgress);
  if (phase === 'telegraph') return p * 0.34;
  if (phase === 'strike') return 0.34 + p * 0.50;
  if (phase === 'recovery') return 0.84 + p * 0.16;
  return p;
}

export function authoredAttackTransitionSeconds(phase, previousClip, nextClip) {
  const directionalTelegraphSwitch = phase === 'telegraph'
    && previousClip !== nextClip
    && AUTHORED_ATTACK_CLIPS.includes(previousClip)
    && AUTHORED_ATTACK_CLIPS.includes(nextClip);
  if (directionalTelegraphSwitch) return 0;
  return phase === 'telegraph' ? 0.055 : 0.025;
}

function scrubAuthoredPoseNow(layer, progress) {
  if (!layer || !Number.isFinite(layer.activeStateDuration)) return false;
  const duration = Math.max(0, layer.activeStateDuration);
  const time = Math.max(0, Math.min(duration, clamp01(progress) * duration));

  // PlayCanvas 2.21.4 applies activeStateCurrentTime immediately only when the
  // layer is paused; a playing layer otherwise waits for the next animation-system
  // update. Blade trajectory samples Sword/HandR immediately after draw(), so pause
  // only this animation layer for the scrub, let the public time setter evaluate at
  // zero delta, then restore the previous playing state. This advances no game or
  // animation time and keeps all pose authority inside the authored AnimTrack.
  const wasPlaying = layer.playing;
  if (wasPlaying) layer.playing = false;
  try {
    layer.activeStateCurrentTime = time;
  } finally {
    if (wasPlaying) layer.playing = true;
  }
  return true;
}

function loadAttackPack(view, baseCharacterReady) {
  return Promise.resolve(baseCharacterReady).then((ready) => new Promise((resolve) => {
    if (!ready || !view.skinnedModel?.anim) {
      document.documentElement.dataset.authoredAttackPack = 'base-animation-fallback';
      resolve(false);
      return;
    }
    view.app.assets.loadFromUrl(ATTACK_URL, 'container', (error, asset) => {
      if (error || !asset?.resource) {
        console.warn('Authored directional attack pack unavailable; keeping base skeletal clips.', error);
        document.documentElement.dataset.authoredAttackPack = 'base-animation-fallback';
        resolve(false);
        return;
      }
      try {
        const tracks = (asset.resource.animations || []).map((animationAsset) => animationAsset?.resource).filter(Boolean);
        const byName = new Map(tracks.map((track) => [track.name, track]));
        for (const clip of AUTHORED_ATTACK_CLIPS) if (!byName.has(clip)) throw new Error(`Missing authored attack clip: ${clip}`);
        const layer = view.skinnedModel.anim.baseLayer;
        for (const clip of AUTHORED_ATTACK_CLIPS) layer.assignAnimation(clip, byName.get(clip), 1, false);
        view.authoredAttackClipNames = [...AUTHORED_ATTACK_CLIPS];
        view.authoredAttackClipsReady = true;
        document.documentElement.dataset.authoredAttackPack = 'four-direction-v1';
        document.documentElement.dataset.authoredAttackClips = AUTHORED_ATTACK_CLIPS.join(',');
        resolve(true);
      } catch (setupError) {
        console.warn('Authored directional attack pack failed to bind; keeping base skeletal clips.', setupError);
        document.documentElement.dataset.authoredAttackPack = 'base-animation-fallback';
        resolve(false);
      }
    });
  }));
}

export function installAuthoredEnemyAttacks(view) {
  if (!view || view[installed]) return view;
  Object.defineProperty(view, installed, { value: true });

  const baseCharacterReady = view.characterReady;
  view.authoredAttackClipsReady = false;
  view.authoredAttackClipNames = [];
  view.authoredAttackActiveClip = null;
  view.authoredAttackState = { ready: false, clip: 'base-animation-fallback', phase: 'ready', progress: 0, directionIndex: 0, poseSynchronized: false };
  document.documentElement.dataset.authoredAttackPack = 'loading';
  view.authoredAttackReady = loadAttackPack(view, baseCharacterReady);
  // The authored pack is part of the production skinned-character contract. Existing
  // browser smoke already fails closed when characterReady is false, so a missing or
  // malformed attack pack cannot silently pass CI while falling back to old motion.
  view.characterReady = Promise.all([Promise.resolve(baseCharacterReady), view.authoredAttackReady])
    .then(([baseReady, authoredReady]) => Boolean(baseReady && authoredReady));

  const originalSync = view.syncSkinnedAnimation.bind(view);
  view.syncSkinnedAnimation = (state, directionIndex) => {
    const phase = state?.phase || 'ready';
    const direction = Math.max(0, Math.min(3, directionIndex | 0));
    const genericClip = phaseClip(phase);
    const useAuthored = view.authoredAttackClipsReady
      && ['telegraph', 'strike', 'recovery'].includes(phase)
      && view.skinnedModel?.anim?.baseLayer;

    // Keep the established root-direction pose and read-trail work from the base view,
    // but do not let its generic Windup/Strike/Recovery state transition interrupt the
    // currently active directional Attack* track. Setting the compatibility label first
    // makes originalSync skip its animation transition while still updating those safe
    // renderer-level transforms. This avoids the Run 55 generic->Attack* double blend.
    if (useAuthored) view.characterClip = genericClip;
    originalSync(state, direction);

    if (!useAuthored) {
      view.authoredAttackActiveClip = null;
      view.authoredAttackState = {
        ready: view.authoredAttackClipsReady,
        clip: view.characterClip,
        phase,
        progress: clamp01(state?.phaseProgress),
        directionIndex: direction,
        poseSynchronized: false,
      };
      return;
    }

    const clip = AUTHORED_ATTACK_CLIPS[direction];
    const progress = authoredAttackProgress(phase, state?.phaseProgress);
    const layer = view.skinnedModel.anim.baseLayer;
    if (clip !== view.authoredAttackActiveClip || layer.activeState !== clip) {
      const previousClip = AUTHORED_ATTACK_CLIPS.includes(layer.activeState)
        ? layer.activeState
        : view.authoredAttackActiveClip;
      // A telegraph direction change is already the authoritative read shown to the
      // player. Crossfading from the previous Attack* briefly leaves the blade on the
      // old side, so commit authored->authored feint switches immediately. Initial
      // Idle/base -> Attack* entry keeps the short blend, and normal phase continuity
      // never transitions because the clip remains unchanged.
      const blend = authoredAttackTransitionSeconds(phase, previousClip, clip);
      layer.transition(clip, blend, progress);
      view.authoredAttackActiveClip = clip;
    }

    const poseSynchronized = layer.activeState === clip && scrubAuthoredPoseNow(layer, progress);

    // Preserve the compatibility label used by the existing renderer contract while
    // exposing the real authored clip independently for diagnostics/review.
    view.characterClip = genericClip;
    view.authoredAttackState = { ready: true, clip, phase, progress, directionIndex: direction, poseSynchronized };
    document.documentElement.dataset.authoredAttackClip = clip;
    document.documentElement.dataset.authoredAttackPhase = phase;
    document.documentElement.dataset.authoredAttackPoseSync = poseSynchronized ? 'same-draw-v1' : 'deferred';
  };

  return view;
}
