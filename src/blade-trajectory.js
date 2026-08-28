import * as pc from 'playcanvas';
import { STRIKE_CONTACT, enemyAttackChoreographyFrame } from './enemy-attack-choreography.js';

const installed = Symbol.for('blade-reversal.blade-trajectory-v3');
const BLADE_LENGTH = 1.78;
const PARRY_PLANE_Z = 2.25;
const MAX_TRAIL_SEGMENTS = 6;
const GRIP_BONES = Object.freeze(['Chest', 'UpperArmR', 'ForearmR', 'UpperArmL', 'ForearmL', 'HandR']);

const clamp01 = (v) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
const smooth = (v) => {
  const x = clamp01(v);
  return x * x * (3 - 2 * x);
};
const cutEase = (v) => {
  const x = clamp01(v);
  return 1 - Math.pow(1 - x, 2.45);
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

function depthFor(phase, progress, depthScale = 1) {
  const p = clamp01(progress);
  let depth = 0;
  if (phase === 'telegraph') depth = 0.08 * smooth(p);
  else if (phase === 'strike') {
    if (p <= STRIKE_CONTACT) depth = mix(0.08, 1.02, cutEase(p / STRIKE_CONTACT));
    else depth = mix(1.02, 0.42, smooth((p - STRIKE_CONTACT) / (1 - STRIKE_CONTACT)));
  } else if (phase === 'recovery' || phase === 'recovery-interrupted') depth = 0.42 * (1 - smooth(p));
  return depth * depthScale;
}

function captureGripPose(view) {
  const pose = {};
  for (const name of GRIP_BONES) {
    const bone = view.bladeGripBones?.[name];
    if (!bone) continue;
    const euler = bone.getLocalEulerAngles();
    pose[name] = [euler.x, euler.y, euler.z];
  }
  return pose;
}

function applyGripChoreography(view, frame, basePose) {
  if (!view.bladeGripBones || !basePose) return false;
  let applied = 0;
  for (const [name, offset] of Object.entries(frame.joints || {})) {
    const bone = view.bladeGripBones[name];
    const base = basePose[name];
    if (!bone || !base) continue;
    bone.setLocalEulerAngles(base[0] + offset[0], base[1] + offset[1], base[2] + offset[2]);
    applied += 1;
  }
  return applied >= 5;
}

export function installBladeTrajectoryView(view) {
  if (!view || view[installed]) return view;
  Object.defineProperty(view, installed, { value: true });

  view.bladeWorldTrail = [];
  view.bladeGripBones = null;
  view.bladeTrajectoryState = {
    ready: false,
    phase: 'ready',
    directionIndex: 0,
    attackStyle: 'overhead-cut',
    tipX: 0,
    tipY: 0,
    tipZ: 0,
    crossedPlane: false,
    trailSegments: 0,
    gripDistance: 999,
    gripConnected: false,
    choreographyApplied: false,
  };

  let current = { phase: 'ready', progress: 0, directionIndex: 0, baseDirection: null, baseGripPose: null };
  let history = [];
  let lastPhase = 'ready';
  let lastDirection = 0;
  let lastTip = null;
  let lastBladeDirection = null;
  let recoveryDirection = null;
  let lastHistoryKey = '';
  let baseModelPosition = null;

  const ready = view.characterReady?.then?.(() => {
    if (!view.skinnedSword || !view.skinnedModel) return false;
    const bones = {};
    for (const name of GRIP_BONES) bones[name] = view.skinnedModel.findByName(name);
    if (GRIP_BONES.some((name) => !bones[name])) return false;
    view.bladeGripBones = bones;
    baseModelPosition = view.skinnedModel.getLocalPosition().clone();
    view.bladeWorldTrail = Array.from({ length: MAX_TRAIL_SEGMENTS }, (_, index) => trailEntity(view, index));
    view.bladeTrajectoryState.ready = true;
    document.documentElement.dataset.bladeTrajectory = 'worldspace-v2';
    document.documentElement.dataset.enemyAttackChoreography = 'body-grip-blade-v1';
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
    const frame = enemyAttackChoreographyFrame(phase, progress, directionIndex);
    const basePos = baseModelPosition || new pc.Vec3(0, 0, 0);
    model.setLocalPosition(
      basePos.x,
      basePos.y + (active ? frame.modelY : 0),
      basePos.z + (active ? depthFor(phase, progress, frame.depthScale) : 0),
    );

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
        attackStyle: frame.id,
        crossedPlane: false,
        trailSegments: 0,
        choreographyApplied: false,
      };
      return;
    }

    const choreographyApplied = applyGripChoreography(view, frame, current.baseGripPose);

    // Sampled immediately after skeletal animation and before this bounded
    // presentation layer aligns the hand-attached Sword to the directional cut.
    // The Sword origin remains parented to HandR; only its world orientation is
    // corrected, so the hilt follows the animated arm chain instead of floating.
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

    const bladeDirection = pathDirection(frame.blade, phase, progress, baseDirection, recoveryDirection);
    sword.setRotation(quatFromUp(bladeDirection));

    const hilt = sword.getPosition().clone();
    const hand = view.bladeGripBones?.HandR?.getPosition?.();
    const gripDistance = hand ? hilt.clone().sub(hand).length() : 999;
    const gripConnected = gripDistance <= 0.18;
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
      attackStyle: frame.id,
      tipX: actualTip.x,
      tipY: actualTip.y,
      tipZ: actualTip.z,
      crossedPlane: phase === 'strike' && actualTip.z >= PARRY_PLANE_Z,
      trailSegments,
      gripDistance,
      gripConnected,
      choreographyApplied,
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
      baseGripPose: null,
    };
    const result = originalDraw(snapshot, now, meta);
    if (view.skinnedSword) current.baseDirection = sampledBladeDirection(view.skinnedSword);
    if (view.bladeGripBones) current.baseGripPose = captureGripPose(view);
    apply();
    return result;
  };

  view.app.on('prerender', apply);
  view.bladeTrajectoryReady = ready;
  return view;
}
