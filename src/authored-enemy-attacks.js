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
  view.authoredAttackState = { ready: false, clip: 'base-animation-fallback', phase: 'ready', progress: 0, directionIndex: 0 };
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

    // Keep the established root-direction pose, read trail and Parry reaction. The new
    // pack replaces only the normal telegraph -> strike -> recovery skeletal track,
    // avoiding any per-frame direct joint mutation like the rejected Run 52 approach.
    originalSync(state, direction);
    const genericClip = phaseClip(phase);
    const useAuthored = view.authoredAttackClipsReady
      && ['telegraph', 'strike', 'recovery'].includes(phase)
      && view.skinnedModel?.anim?.baseLayer;

    if (!useAuthored) {
      view.authoredAttackActiveClip = null;
      view.authoredAttackState = {
        ready: view.authoredAttackClipsReady,
        clip: view.characterClip,
        phase,
        progress: clamp01(state?.phaseProgress),
        directionIndex: direction,
      };
      return;
    }

    const clip = AUTHORED_ATTACK_CLIPS[direction];
    const progress = authoredAttackProgress(phase, state?.phaseProgress);
    const layer = view.skinnedModel.anim.baseLayer;
    if (clip !== view.authoredAttackActiveClip || layer.activeState !== clip) {
      const blend = phase === 'telegraph' ? 0.055 : 0.025;
      layer.transition(clip, blend, progress);
      view.authoredAttackActiveClip = clip;
    }
    if (layer.activeState === clip && Number.isFinite(layer.activeStateDuration)) {
      layer.activeStateCurrentTime = Math.max(0, Math.min(layer.activeStateDuration, progress * layer.activeStateDuration));
    }

    // Preserve the compatibility label used by the existing renderer contract while
    // exposing the real authored clip independently for diagnostics/review.
    view.characterClip = genericClip;
    view.authoredAttackState = { ready: true, clip, phase, progress, directionIndex: direction };
    document.documentElement.dataset.authoredAttackClip = clip;
    document.documentElement.dataset.authoredAttackPhase = phase;
  };

  return view;
}
