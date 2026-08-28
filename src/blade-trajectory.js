import * as pc from 'playcanvas';

const installed = Symbol.for('blade-reversal.blade-trajectory-v2');
const BLADE_LENGTH = 1.78;
const PARRY_PLANE_Z = 2.25;
const MAX_TRAIL_SEGMENTS = 6;
const STRIKE_CONTACT = 0.62;

// World-space blade axes, not unreachable absolute tip positions. Positive Z points
// toward the first-person camera. Each cut begins from a readable guard, commits
// through the player-facing plane, then exits on the opposite side.
const PATHS = Object.freeze([
  Object.freeze({ wind: [0.04, 0.995, 0.09], contact: [0.00, -0.12, 0.993], follow: [-0.05, -0.82, 0.57] }),
  Object.freeze({ wind: [0.73, 0.67, 0.12], contact: [0.06, -0.08, 0.995], follow: [-0.79, -0.20, 0.58] }),
  Object.freeze({ wind: [0.00, -0.985, 0.12], contact: [0.00, 0.18, 0.984], follow: [0.05, 0.84, 0.54] }),
  Object.freeze({ wind: [-0.73, 0.67, 0.12], contact: [-0.06, -0.08, 0.995], follow: [0.79, -0.20, 0.58] }),
]);

const clamp01 = (v) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
const smooth = (v) => {
  const x = clamp01(v);
  return x * x * (3 - 2 * x);
};
const cutEase = (v) => {
  const x = clamp01(v);
  return 1 - Math.pow(1 - x, 2.35);
};
const mix = (a, b, t) => a + (b - a) * t;
const vec = (values) => new pc.Vec3(values[0], values[1], values[2]);

function mixDirection(a, b, t) {
  const from = a.clone().normalize();
  const to = b.clone().normalize();
  return new pc.Vec3(
    mix(from.x, to.x, t),
    mix(from.y, to.y, t),
    mix(from.z, to.z, t),
  ).normalize();
}

function quatFromUp(direction) {
  const d = direction.clone().normalize();
  if (d.y < -0.999) return new pc.Quat(1, 0, 0, 0);
  const q = new pc.Quat(d.z, 0, -d.x, 1 + d.y);
  return q.normalize();
}

function sampledBladeDirection(sword) {
  const direction = new pc.Vec3(0, 1, 0);
  sword.getRotation().transformVector(direction, direction);
  return direction.normalize();
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

function pathDirection(path, phase, progress, baseDirection, recoveryDirection) {
  const p = clamp01(progress);
  const wind = vec(path.wind).normalize();
  const contact = vec(path.contact).normalize();
  const follow = vec(path.follow).normalize();

  if (phase === 'telegraph') {
    return mixDirection(baseDirection, wind, 0.24 + smooth(p) * 0.76);
  }
  if (phase === 'strike') {
    if (p <= STRIKE_CONTACT) {
      return mixDirection(wind, contact, cutEase(p / STRIKE_CONTACT));
    }
    return mixDirection(contact, follow, smooth((p - STRIKE_CONTACT) / (1 - STRIKE_CONTACT)));
  }
  if (phase === 'recovery' || phase === 'recovery-interrupted') {
    return mixDirection(recoveryDirection || follow, baseDirection, smooth(p));
  }
  return baseDirection.clone().normalize();
}

function depthFor(phase, progress) {
  const p = clamp01(progress);
  if (phase === 'telegraph') return 0.08 * smooth(p);
  if (phase === 'strike') {
    if (p <= STRIKE_CONTACT) return mix(0.08, 1.02, cutEase(p / STRIKE_CONTACT));
    return mix(1.02, 0.42, smooth((p - STRIKE_CONTACT) / (1 - STRIKE_CONTACT)));
  }
  if (phase === 'recovery' || phase === 'recovery-interrupted') return 0.42 * (1 - smooth(p));
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

  let current = { phase: 'ready', progress: 0, directionIndex: 0, baseDirection: null };
  let history = [];
  let lastPhase = 'ready';
  let lastDirection = 0;
  let lastTip = null;
  let lastBladeDirection = null;
  let recoveryDirection = null;
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
      lastBladeDirection = null;
      recoveryDirection = null;
      lastPhase = phase;
      lastDirection = directionIndex;
      view.bladeTrajectoryState = { ...view.bladeTrajectoryState, phase, directionIndex, crossedPlane: false, trailSegments: 0 };
      return;
    }

    // `baseDirection` is sampled immediately after skeletal animation in draw(),
    // before this presentation layer overrides the Sword's world orientation.
    // Keeping that sample prevents the prerender pass from feeding our own
    // trajectory back into telegraph/recovery blending.
    const baseDirection = current.baseDirection?.clone() || sampledBladeDirection(sword);

    if (phase !== lastPhase || directionIndex !== lastDirection) {
      if (phase === 'recovery' || phase === 'recovery-interrupted') {
        recoveryDirection = lastBladeDirection?.clone() || baseDirection.clone();
      }
      if (phase === 'strike' || directionIndex !== lastDirection) {
        history = lastTip ? [lastTip.clone()] : [];
        lastHistoryKey = '';
      }
    }

    const bladeDirection = pathDirection(PATHS[directionIndex], phase, progress, baseDirection, recoveryDirection);
    sword.setRotation(quatFromUp(bladeDirection));

    const hilt = sword.getPosition().clone();
    const actualTip = hilt.clone().add(bladeDirection.clone().mulScalar(BLADE_LENGTH));
    lastTip = actualTip.clone();
    lastBladeDirection = bladeDirection.clone();

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
      baseDirection: null,
    };
    const result = originalDraw(snapshot, now, meta);
    if (view.skinnedSword) current.baseDirection = sampledBladeDirection(view.skinnedSword);
    apply();
    return result;
  };

  view.app.on('prerender', apply);
  view.bladeTrajectoryReady = ready;
  return view;
}
