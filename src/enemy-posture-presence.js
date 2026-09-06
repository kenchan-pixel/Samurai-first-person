const installed = Symbol.for('blade-reversal.enemy-posture-presence-v1');

const clamp01 = (value) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

function smoother(value) {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
}

export function enemyPosturePresenceFrame(state, now = 0, out = {}) {
  const max = Number(state?.enemyPostureMax);
  const posture = Number(state?.enemyPosture);
  const ratio = Number.isFinite(max) && max > 0 ? clamp01(posture / max) : 0;
  const phase = state?.phase ?? 'ready';
  const phaseProgress = clamp01(state?.phaseProgress);
  const guardBroken = state?.attack?.guardBroken === true || ratio >= 0.999;
  const readablePhase = phase === 'gap' || phase === 'recovery';

  out.active = ratio > 0 && readablePhase;
  out.phase = phase;
  out.ratio = ratio;
  out.guardBroken = guardBroken;
  out.retreat = 0;
  out.drop = 0;
  out.sway = 0;
  out.pitch = 0;
  out.roll = 0;

  if (!out.active) return out;

  const pressure = smoother(ratio);
  const recoveryWeight = phase === 'recovery' ? (1 - smoother(phaseProgress) * 0.34) : 0.72;
  const breakBoost = guardBroken ? 1.45 : 1;
  const cadence = Math.sin((Number.isFinite(now) ? now : 0) * 0.0085);

  out.retreat = pressure * recoveryWeight * 0.095 * breakBoost;
  out.drop = pressure * recoveryWeight * 0.034 * breakBoost;
  out.sway = cadence * pressure * recoveryWeight * 0.026 * breakBoost;
  out.pitch = pressure * recoveryWeight * (guardBroken ? 5.2 : 2.8);
  out.roll = cadence * pressure * recoveryWeight * (guardBroken ? 2.8 : 1.5);
  return out;
}

export function installEnemyPosturePresence(view) {
  if (!view || view[installed] || typeof view.draw !== 'function') return view;
  Object.defineProperty(view, installed, { value: true });

  const originalDraw = view.draw.bind(view);
  view.enemyPosturePresenceState = enemyPosturePresenceFrame(null, 0, {});

  view.draw = (state, now, meta = {}) => {
    const result = originalDraw(state, now, meta);
    const frame = enemyPosturePresenceFrame(state, now, view.enemyPosturePresenceState);

    if (frame.active) {
      const enemy = view.enemy;
      if (enemy?.getLocalPosition && enemy?.setLocalPosition) {
        const pos = enemy.getLocalPosition();
        enemy.setLocalPosition(pos.x + frame.sway, pos.y - frame.drop, pos.z - frame.retreat);
      }

      const character = view.skinnedModel;
      if (character?.getLocalEulerAngles && character?.setLocalEulerAngles) {
        const euler = character.getLocalEulerAngles();
        character.setLocalEulerAngles(euler.x + frame.pitch, euler.y, euler.z + frame.roll);
      }
    }

    if (typeof document !== 'undefined') {
      document.documentElement.dataset.enemyPosturePresence = frame.active ? 'pressured-guard-v1' : 'neutral';
      document.documentElement.dataset.enemyPosturePresencePhase = frame.phase;
      document.documentElement.dataset.enemyPosturePresenceRatio = frame.ratio.toFixed(2);
    }
    return result;
  };

  if (typeof document !== 'undefined') document.documentElement.dataset.enemyPosturePresenceReady = 'true';
  return view;
}
