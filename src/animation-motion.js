const MOTION_KEYS = Object.freeze([
  'wind',
  'swing',
  'impact',
  'follow',
  'settle',
  'read',
  'trail',
  'sword',
]);

const clamp01 = (value) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

export function motionPhaseForSnapshot(snapshot) {
  const phase = snapshot?.phase ?? 'ready';
  return phase === 'recovery' && snapshot?.attack?.parried === true
    ? 'recovery-interrupted'
    : phase;
}

export function smoother(value) {
  const x = clamp01(value);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

export function enemyMotionFrame(phase, progress, out = {}) {
  const interruptedRecovery = phase === 'recovery-interrupted';
  const motionPhase = interruptedRecovery ? 'recovery' : phase;
  const p = clamp01(progress);
  out.phase = motionPhase;
  out.interruptedRecovery = interruptedRecovery;
  for (const key of MOTION_KEYS) out[key] = 0;

  if (motionPhase === 'telegraph') {
    const wind = smoother(p / 0.82);
    out.wind = wind;
    out.read = smoother((p - 0.18) / 0.62);
    out.sword = -wind;
    return out;
  }

  if (motionPhase === 'strike') {
    out.wind = 1 - smoother(p / 0.24);
    out.swing = smoother(p / 0.76);
    out.impact = Math.max(0, 1 - Math.abs(p - 0.56) / 0.16);
    out.follow = smoother((p - 0.44) / 0.5);
    out.trail = Math.sin(Math.PI * clamp01((p - 0.06) / 0.9));
    out.sword = -1 + 2 * smoother(p);
    return out;
  }

  if (motionPhase === 'recovery') {
    const settle = smoother(p);
    out.follow = 1 - settle;
    out.settle = settle;
    out.sword = 1 - settle;
    return out;
  }

  out.settle = 1;
  return out;
}

function copyMotionFrame(target, out) {
  for (const key of MOTION_KEYS) {
    out[key] = Number.isFinite(target?.[key]) ? target[key] : 0;
  }
  out.phase = target?.phase ?? 'ready';
  out.interruptedRecovery = target?.interruptedRecovery === true;
  return out;
}

function recoveryPoseGap(current, target) {
  return Math.max(
    Math.abs((target?.sword ?? 0) - (current?.sword ?? 0)),
    Math.abs((target?.follow ?? 0) - (current?.follow ?? 0)),
    Math.abs((target?.wind ?? 0) - (current?.wind ?? 0)),
  );
}

export function smoothMotionFrame(current, target, frameMs, responseMs = 72, out = current) {
  const fromPhase = current?.phase;
  const toPhase = target?.phase;
  const interruptedRecovery = target?.interruptedRecovery === true
    && fromPhase === 'strike'
    && toPhase === 'recovery';

  // Normal elapsed-time motion already has continuous boundary poses, so track
  // it exactly. Only an explicitly signalled parry interruption is damped;
  // a dropped frame followed by natural recovery must catch up immediately.
  if (!interruptedRecovery || recoveryPoseGap(current, target) < 0.22) {
    return copyMotionFrame(target, out);
  }

  const dt = Math.max(0, Math.min(50, Number.isFinite(frameMs) ? frameMs : 16.67));
  const response = Math.max(1, responseMs);
  const alpha = 1 - Math.exp(-dt / response);

  for (const key of MOTION_KEYS) {
    const from = Number.isFinite(current?.[key]) ? current[key] : 0;
    const to = Number.isFinite(target?.[key]) ? target[key] : 0;
    out[key] = from + (to - from) * alpha;
  }
  out.phase = fromPhase;
  out.interruptedRecovery = true;
  return out;
}

export function adaptiveRenderScale({
  current,
  min = 1,
  max = 1.6,
  frameEmaMs,
} = {}) {
  const lo = Math.max(0.75, Number.isFinite(min) ? min : 1);
  const hi = Math.max(lo, Number.isFinite(max) ? max : 1.6);
  const value = Math.max(lo, Math.min(hi, Number.isFinite(current) ? current : hi));
  const frame = Number.isFinite(frameEmaMs) ? frameEmaMs : 16.67;

  if (frame > 19.2) return Math.max(lo, Math.round((value - 0.1) * 20) / 20);
  if (frame < 17.0) return Math.min(hi, Math.round((value + 0.05) * 20) / 20);
  return value;
}

export { MOTION_KEYS };
