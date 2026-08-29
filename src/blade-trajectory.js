import * as pc from 'playcanvas';

const installed = Symbol.for('blade-reversal.blade-trajectory-v3');
const BLADE_LENGTH = 1.78;
const PARRY_PLANE_Z = 2.25;
const MAX_TRAIL_SEGMENTS = 6;
const STRIKE_CONTACT = 0.62;
const GRIP_DEPTH_ASSIST_MAX = 1.10;

// Fallback world-space blade axes. The authored Attack* clips own the Sword bone during
// normal telegraph/strike/recovery; these axes remain for primitive/base-animation and
// interrupted-recovery fallback paths only.
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

function angleBetween(a, b) {
  const from = a.clone().normalize();
  const to = b.clone().normalize();
  const dot = Math.max(-1, Math.min(1, from.dot(to)));
  return Math.acos(dot) * 180 / Math.PI;
}

function authoredGripLockActive(view, phase) {
  return view.authoredAttackClipsReady === true
    && ['telegraph', 'strike', 'recovery'].includes(phase)
    && /^Attack(Top|Right|Bottom|Left)$/.test(view.authoredAttackState?.clip || '');
}

function authoredDepthAssist(phase, progress, rawTipZ) {
  if (phase !== 'strike') return 0;
  const p = clamp01(progress);
  const commitment = p <= STRIKE_CONTACT
    ? cutEase(p / STRIKE_CONTACT)
    : 1 - 0.62 * smooth((p - STRIKE_CONTACT) / (1 - STRIKE_CONTACT));
  const shortfall = Math.max(0, PARRY_PLANE_Z + 0.08 - rawTipZ);
  return Math.min(GRIP_DEPTH_ASSIST_MAX, shortfall * commitment);
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
    gripLocked: false,
    orientationDeltaDeg: 0,
    depthAssist: 0,
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
    document.documentElement.dataset.bladeTrajectory = 'worldspace-v3-grip-lock';
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
    const gripLocked = authoredGripLockActive(view, phase);

    const modelPos = model.getLocalPosition();
    const baseDepth = active ? depthFor(phase, progress) : 0;
    model.setLocalPosition(modelPos.x, modelPos.y, baseDepth);

    if (!active) {
      hideTrail(view);
      history = [];
      lastTip = null;
      lastBladeDirection = null;
      recoveryDirection = null;
      lastPhase = phase;
      lastDirection = directionIndex;
      view.bladeTrajectoryState = {
        ...view.bladeTrajectoryState,
        phase,
        directionIndex,
        crossedPlane: false,
        trailSegments: 0,
        gripLocked: false,
        orientationDeltaDeg: 0,
        depthAssist: 0,
      };
      return;
    }

    // Sampled immediately after skeletal animation in draw(), before this adapter does
    // any fallback world-space orientation. In authored mode this Sword/HandR rotation is
    // now authoritative so the katana cannot visually detach from the animated grip.
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

    let bladeDirection = baseDirection.clone().normalize();
    let depthAssist = 0;

    if (gripLocked) {
      // Preserve authored Sword rotation. If the authored cut needs a little more camera-
      // depth to reach the established parry plane, move the complete skinned model as one
      // rigid body instead of rotating Sword away from HandR. This keeps animation authority
      // in the clip while retaining the proven player-facing contact contract.
      const rawHilt = sword.getPosition().clone();
      const rawTipZ = rawHilt.z + bladeDirection.z * BLADE_LENGTH;
      depthAssist = authoredDepthAssist(phase, progress, rawTipZ);
      if (depthAssist > 0) model.setLocalPosition(modelPos.x, modelPos.y, baseDepth + depthAssist);
    } else {
      bladeDirection = pathDirection(PATHS[directionIndex], phase, progress, baseDirection, recoveryDirection);
      sword.setRotation(quatFromUp(bladeDirection));
    }

    const hilt = sword.getPosition().clone();
    const finalDirection = sampledBladeDirection(sword);
    const actualTip = hilt.clone().add(finalDirection.clone().mulScalar(BLADE_LENGTH));
    lastTip = actualTip.clone();
    lastBladeDirection = finalDirection.clone();

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
    const orientationDeltaDeg = angleBetween(baseDirection, finalDirection);
    view.bladeTrajectoryState = {
      ready: true,
      phase,
      directionIndex,
      tipX: actualTip.x,
      tipY: actualTip.y,
      tipZ: actualTip.z,
      crossedPlane: phase === 'strike' && actualTip.z >= PARRY_PLANE_Z,
      trailSegments,
      gripLocked,
      orientationDeltaDeg,
      depthAssist,
    };
    document.documentElement.dataset.bladeGripLock = gripLocked ? 'authored-handr' : 'fallback-path';
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
