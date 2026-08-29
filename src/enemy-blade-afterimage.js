import * as pc from 'playcanvas';

const installed = Symbol.for('blade-reversal.enemy-blade-afterimage-v1');
const BLADE_LENGTH = 1.78;
const GHOST_COUNT = 4;
const SAMPLE_COUNT = GHOST_COUNT + 1;
const SAMPLE_STEP = 0.055;
const GHOST_OPACITY = Object.freeze([0.18, 0.13, 0.09, 0.055]);
const GHOST_THICKNESS = Object.freeze([0.072, 0.062, 0.053, 0.045]);

const clamp01 = (value) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

function makeGhostMaterial(index) {
  const material = new pc.StandardMaterial();
  material.diffuse = new pc.Color(0.95, 0.34, 0.08);
  material.emissive = new pc.Color(0.72, 0.12, 0.015);
  material.opacity = GHOST_OPACITY[index] ?? 0.05;
  material.blendType = pc.BLEND_ADDITIVE;
  material.depthWrite = false;
  material.useMetalness = false;
  material.gloss = 0.25;
  material.update();
  return material;
}

function makeGhost(view, index) {
  const entity = new pc.Entity(`EnemyBladeAfterimage${index + 1}`);
  entity.addComponent('render', { type: 'box', castShadows: false, receiveShadows: false });
  entity.render.material = makeGhostMaterial(index);
  entity.enabled = false;
  view.app.root.addChild(entity);
  return entity;
}

function setQuat(target, source) {
  target.set(source.x, source.y, source.z, source.w);
}

export function installEnemyBladeAfterimage(view) {
  if (!view || view[installed]) return view;
  Object.defineProperty(view, installed, { value: true });

  const reducedMotion = Boolean(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  const smokeContract = typeof location !== 'undefined'
    && new URLSearchParams(location.search).get('browser-smoke') === 'renderer-motion';
  const ghosts = Array.from({ length: GHOST_COUNT }, (_, index) => makeGhost(view, index));
  const samples = Array.from({ length: SAMPLE_COUNT }, () => ({
    center: new pc.Vec3(),
    rotation: new pc.Quat(),
    length: BLADE_LENGTH,
    valid: false,
  }));
  const localUp = new pc.Vec3(0, 1, 0);
  const bladeAxis = new pc.Vec3();
  const bladeCenter = new pc.Vec3();
  const lastCenter = new pc.Vec3();

  let hasLastSample = false;
  let lastSampleProgress = -1;
  let strikeSampleCount = 0;
  let lastPhase = 'ready';
  let lastDirection = -1;

  const hideGhosts = () => {
    for (const ghost of ghosts) ghost.enabled = false;
  };

  const clearSamples = () => {
    for (const sample of samples) sample.valid = false;
    hasLastSample = false;
    lastSampleProgress = -1;
    strikeSampleCount = 0;
    hideGhosts();
  };

  const recordSample = (sword, progress) => {
    const swordRotation = sword.getRotation();
    bladeAxis.set(0, 0, 0);
    swordRotation.transformVector(localUp, bladeAxis);
    bladeAxis.normalize();
    const swordScaleY = Math.max(0.7, Number(sword.getLocalScale().y) || 1);
    const length = BLADE_LENGTH * swordScaleY;
    bladeCenter.copy(sword.getPosition());
    bladeCenter.x += bladeAxis.x * length * 0.5;
    bladeCenter.y += bladeAxis.y * length * 0.5;
    bladeCenter.z += bladeAxis.z * length * 0.5;

    if (hasLastSample) {
      const dx = bladeCenter.x - lastCenter.x;
      const dy = bladeCenter.y - lastCenter.y;
      const dz = bladeCenter.z - lastCenter.z;
      const moved = dx * dx + dy * dy + dz * dz > 0.0025;
      if (!moved && progress - lastSampleProgress < SAMPLE_STEP && progress < 0.985) return false;
    }

    for (let index = samples.length - 1; index > 0; index -= 1) {
      const previous = samples[index - 1];
      const sample = samples[index];
      sample.valid = previous.valid;
      if (!previous.valid) continue;
      sample.center.copy(previous.center);
      setQuat(sample.rotation, previous.rotation);
      sample.length = previous.length;
    }

    const current = samples[0];
    current.valid = true;
    current.center.copy(bladeCenter);
    setQuat(current.rotation, swordRotation);
    current.length = length;
    lastCenter.copy(bladeCenter);
    lastSampleProgress = progress;
    hasLastSample = true;
    strikeSampleCount += 1;
    return true;
  };

  const renderGhosts = (limit = GHOST_COUNT) => {
    let active = 0;
    for (let index = 0; index < ghosts.length; index += 1) {
      const ghost = ghosts[index];
      const sample = samples[index + 1];
      if (index >= limit || !sample?.valid) {
        ghost.enabled = false;
        continue;
      }
      ghost.enabled = true;
      ghost.setPosition(sample.center.x, sample.center.y, sample.center.z);
      ghost.setRotation(sample.rotation);
      ghost.setLocalScale(GHOST_THICKNESS[index], sample.length, 0.028);
      active += 1;
    }
    return active;
  };

  view.enemyBladeAfterimageState = {
    ready: true,
    activeGhosts: 0,
    phase: 'ready',
    reducedMotion,
  };
  document.documentElement.dataset.enemyBladeAfterimage = 'actual-sword-full-blade-v1';
  document.documentElement.dataset.enemyBladeAfterimageMotion = reducedMotion ? 'reduced' : 'full';

  const originalDraw = view.draw.bind(view);
  view.draw = (snapshot, now, meta = {}) => {
    const result = originalDraw(snapshot, now, meta);
    const phase = snapshot?.phase || 'ready';
    const direction = Math.max(0, Math.min(3, meta?.attackDirectionIndex | 0));
    const progress = clamp01(snapshot?.phaseProgress);
    const sword = view.skinnedSword;

    if (reducedMotion || !sword) {
      clearSamples();
      view.enemyBladeAfterimageState = { ready: Boolean(sword), activeGhosts: 0, phase, reducedMotion };
      lastPhase = phase;
      lastDirection = direction;
      return result;
    }

    if (phase === 'strike') {
      if (lastPhase !== 'strike' || direction !== lastDirection || progress + 0.01 < lastSampleProgress) clearSamples();
      recordSample(sword, progress);
      const activeGhosts = renderGhosts();
      view.enemyBladeAfterimageState = { ready: true, activeGhosts, phase, reducedMotion };
      // The renderer contract intentionally samples synthetic RIGHT/LEFT/BOTTOM poses at
      // the same strike timestamp. Validate historical accumulation only after three
      // sequential samples of one direction, so those diagnostic direction switches do
      // not masquerade as a gameplay trail failure.
      if (smokeContract && strikeSampleCount >= 3 && progress >= 0.45 && activeGhosts < 2) {
        throw new Error(`Actual-sword afterimage contract produced only ${activeGhosts} historical blade poses at strike progress ${progress.toFixed(3)}`);
      }
    } else if (phase === 'recovery' && lastPhase === 'strike' && progress < 0.18) {
      const activeGhosts = renderGhosts(2);
      view.enemyBladeAfterimageState = { ready: true, activeGhosts, phase, reducedMotion };
    } else {
      clearSamples();
      view.enemyBladeAfterimageState = { ready: true, activeGhosts: 0, phase, reducedMotion };
    }

    lastPhase = phase;
    lastDirection = direction;
    return result;
  };

  return view;
}
