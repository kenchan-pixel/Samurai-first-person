import * as pc from 'playcanvas';

const installed = Symbol.for('blade-reversal.blade-trajectory-v2');
const BLADE_LENGTH = 1.78;
const PARRY_PLANE_Z = 2.25;
const MAX_TRAIL_SEGMENTS = 6;

const PATHS = Object.freeze([
  Object.freeze({ wind: [0.10, 3.20, 0.55], contact: [0.00, 1.55, 4.35], follow: [-0.10, 0.35, 2.45] }),
  Object.freeze({ wind: [1.75, 2.35, 0.55], contact: [0.62, 1.48, 4.35], follow: [-1.45, 1.02, 2.45] }),
  Object.freeze({ wind: [0.00, 0.28, 0.55], contact: [0.00, 1.08, 4.35], follow: [0.08, 2.62, 2.45] }),
  Object.freeze({ wind: [-1.75, 2.35, 0.55], contact: [-0.62, 1.48, 4.35], follow: [1.45, 1.02, 2.45] }),
]);

const clamp01 = (v) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
const smooth = (v) => {
  const x = clamp01(v);
  return x * x * (3 - 2 * x);
};
const mix = (a, b, t) => a + (b - a) * t;
const mixVec = (a, b, t) => new pc.Vec3(mix(a.x, b.x, t), mix(a.y, b.y, t), mix(a.z, b.z, t));
const vec = (values) => new pc.Vec3(values[0], values[1], values[2]);

function quatFromUp(direction) {
  const d = direction.clone().normalize();
  if (d.y < -0.999) return new pc.Quat(1, 0, 0, 0);
  const q = new pc.Quat(d.z, 0, -d.x, 1 + d.y);
  return q.normalize();
}

function trailEntity(view, index) {
  const entity = new pc.Entity(`BladeWorldTrail${index + 1}`);
  entity.addComponent('render', { type: 'box', castShadows: false, receiveShadows: false });
  entity.render.material = view.materials.bladeRead;
  entity.enabled = false;
  view.app.root.addChild(entity);
  return entity;
}

function hideTrail(view) {
  for (const segment of view.bladeWorldTrail || []) segment.enabled = false;
}

function updateTrail(view, points) {
  const segments = view.bladeWorldTrail || [];
  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    const a = points[i];
    const b = points[i + 1];
    if (!a || !b) {
      segment.enabled = false;
      continue;
    }
    const delta = b.clone().sub(a);
    const length = delta.length();
    if (length < 0.025) {
      segment.enabled = false;
      continue;
    }
    segment.enabled = true;
    segment.setPosition(a.clone().add(b).mulScalar(0.5));
    segment.setRotation(quatFromUp(delta));
    segment.setLocalScale(0.045, length, 0.028);
  }
}

function pathTip(path, phase, progress, baseTip, recoveryStart) {
  const p = smooth(progress);
  const wind = vec(path.wind);
  const contact = vec(path.contact);
  const follow = vec(path.follow);
  if (phase === 'telegraph') return mixVec(baseTip, wind, 0.28 + p * 0.72);
  if (phase === 'strike') {
    if (p <= 0.54) return mixVec(wind, contact, smooth(p / 0.54));
    return mixVec(contact, follow, smooth((p - 0.54) / 0.46));
  }
  if (phase === 'recovery' || phase === 'recovery-interrupted') {
    return mixVec(recoveryStart || follow, baseTip, p);
  }
  return baseTip;
}

function depthFor(phase, progress) {
  const p = smooth(progress);
  if (phase === 'telegraph') return 0.10 * p;
  if (phase === 'strike') {
    if (p <= 0.54) return mix(0.10, 0.96, smooth(p / 0.54));
    return mix(0.96, 0.44, smooth((p - 0.54) / 0.46));
  }
  if (phase === 'recovery' || phase === 'recovery-interrupted') return 0.44 * (1 - p);
  return 0;
}

export function installBladeTrajectoryView(view) {
  if (!view || view[installed]) return view;
  Object.defineProperty(view, installed, { value: true });

  view.bladeWorldTrail = [];
  view.bladeTrajectoryState = {
    ready: false,
    phase: 'ready',
    directionIndex: 0,
    tipX: 0,
    tipY: 0,
    tipZ: 0,
    crossedPlane: false,
    trailSegments: 0,
  };

  let current = { phase: 'ready', progress: 0, directionIndex: 0 };
  let history = [];
  let lastPhase = 'ready';
  let lastDirection = 0;
  let lastTip = null;
  let recoveryStart = null;
  let lastHistoryKey = '';

  const ready = view.characterReady?.then?.(() => {
    if (!view.skinnedSword || !view.skinnedModel) return false;
    view.bladeWorldTrail = Array.from({ length: MAX_TRAIL_SEGMENTS }, (_, index) => trailEntity(view, index));
    view.bladeTrajectoryState.ready = true;
    document.documentElement.dataset.bladeTrajectory = 'worldspace-v2';
    return true;
  }).catch(() => false);

  const apply = () => {
    const sword = view.skinnedSword;
    const model = view.skinnedModel;
    if (!sword || !model) return;

    for (const echo of view.mobileSwingEchoes || []) echo.enabled = false;

    const phase = current.phase;
    const progress = clamp01(current.progress);
    const directionIndex = Math.max(0, Math.min(3, current.directionIndex | 0));
    const active = ['telegraph', 'strike', 'recovery', 'recovery-interrupted'].includes(phase);

    const modelPos = model.getLocalPosition();
    model.setLocalPosition(modelPos.x, modelPos.y, active ? depthFor(phase, progress) : 0);

    if (!active) {
      hideTrail(view);
      history = [];
      lastTip = null;
      recoveryStart = null;
      lastPhase = phase;
      lastDirection = directionIndex;
      view.bladeTrajectoryState = { ...view.bladeTrajectoryState, phase, directionIndex, crossedPlane: false, trailSegments: 0 };
      return;
    }

    const hilt = sword.getPosition().clone();
    const baseUp = new pc.Vec3(0, 1, 0);
    sword.getRotation().transformVector(baseUp, baseUp);
    const baseTip = hilt.clone().add(baseUp.normalize().mulScalar(BLADE_LENGTH));

    if (phase !== lastPhase || directionIndex !== lastDirection) {
      if (phase === 'recovery' || phase === 'recovery-interrupted') recoveryStart = lastTip?.clone() || baseTip.clone();
      if (phase === 'strike' || directionIndex !== lastDirection) {
        history = lastTip ? [lastTip.clone()] : [];
        lastHistoryKey = '';
      }
    }

    const target = pathTip(PATHS[directionIndex], phase, progress, baseTip, recoveryStart);
    const aim = target.clone().sub(hilt);
    if (aim.lengthSq() > 0.0001) sword.setRotation(quatFromUp(aim));

    const bladeDirection = aim.lengthSq() > 0.0001 ? aim.normalize() : baseUp.normalize();
    const actualTip = hilt.clone().add(bladeDirection.mulScalar(BLADE_LENGTH));
    lastTip = actualTip.clone();

    if (phase === 'strike') {
      const key = `${directionIndex}:${progress.toFixed(4)}`;
      if (key !== lastHistoryKey) {
        const previous = history.at(-1);
        if (!previous || previous.clone().sub(actualTip).length() > 0.055) history.push(actualTip.clone());
        while (history.length > MAX_TRAIL_SEGMENTS + 1) history.shift();
        lastHistoryKey = key;
      }
      updateTrail(view, history);
    } else {
      hideTrail(view);
      if (phase === 'telegraph') history = [actualTip.clone()];
    }

    const trailSegments = (view.bladeWorldTrail || []).filter((segment) => segment.enabled).length;
    view.bladeTrajectoryState = {
      ready: true,
      phase,
      directionIndex,
      tipX: actualTip.x,
      tipY: actualTip.y,
      tipZ: actualTip.z,
      crossedPlane: phase === 'strike' && actualTip.z >= PARRY_PLANE_Z,
      trailSegments,
    };
    lastPhase = phase;
    lastDirection = directionIndex;
  };

  const originalDraw = view.draw.bind(view);
  view.draw = (snapshot, now, meta = {}) => {
    current = {
      phase: snapshot?.phase || 'ready',
      progress: snapshot?.phaseProgress || 0,
      directionIndex: meta?.attackDirectionIndex ?? 0,
    };
    const result = originalDraw(snapshot, now, meta);
    apply();
    return result;
  };

  view.app.on('prerender', apply);
  view.bladeTrajectoryReady = ready;
  return view;
}
