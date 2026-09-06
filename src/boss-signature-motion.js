export const BOSS_SIGNATURE_ID = 'crimson-shogun';

const clamp01 = (value) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
const smooth = (value) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

export function bossSignatureFrame(state = {}, directionIndex = 0) {
  if (state?.enemy?.id !== BOSS_SIGNATURE_ID) {
    return {
      active: false,
      phase: 0,
      crouch: 0,
      forward: 0,
      pitch: 0,
      yaw: 0,
      roll: 0,
      enemyScale: 1,
      swordScale: 1,
      trailScale: 1,
    };
  }

  const phase = String(state.enemy?.title || '').includes('Blood Moon') ? 2 : 1;
  const progress = clamp01(state.phaseProgress);
  const telegraph = state.phase === 'telegraph' ? smooth(progress) : 0;
  const strike = state.phase === 'strike' ? Math.sin(Math.PI * progress) : 0;
  const recovery = state.phase === 'recovery' || state.phase === 'recovery-interrupted'
    ? 1 - smooth(progress)
    : 0;
  const heavy = state.attack?.heavy ? 1 : 0;
  const side = directionIndex === 1 ? -1 : directionIndex === 3 ? 1 : 0;
  const phaseBoost = phase === 2 ? 1.35 : 1;
  const commitment = Math.max(telegraph * (0.78 + heavy * 0.22), strike);

  return {
    active: true,
    phase,
    crouch: (phase === 2 ? 0.035 : 0.008) + telegraph * (phase === 2 ? 0.035 : 0.014) + strike * (phase === 2 ? 0.028 : 0.010),
    forward: telegraph * (phase === 2 ? 0.055 : 0.018) + strike * (phase === 2 ? 0.115 : 0.045) - recovery * 0.018,
    pitch: telegraph * (heavy ? 5.5 : 3.0) * phaseBoost - strike * (phase === 2 ? 8.5 : 4.5),
    yaw: side === 0 ? 0 : side * commitment * (phase === 2 ? 13 : 7),
    roll: side === 0 ? 0 : -side * commitment * (phase === 2 ? 9 : 5),
    enemyScale: phase === 2 ? 1.035 : 1,
    swordScale: phase === 2 ? 1.065 : 1 + heavy * 0.018,
    trailScale: phase === 2 ? 1.22 : 1 + heavy * 0.06,
  };
}
