const installed = Symbol.for('blade-reversal.enemy-parry-recoil-v1');

const clamp01 = (value) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

function smoother(value) {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
}

function directionVector(direction) {
  if (direction === 'right') return -1;
  if (direction === 'left') return 1;
  return 0;
}

/**
 * Presentation-only reaction after an authoritative parry has already opened recovery.
 * It never owns a clock: recovery phaseProgress is the only envelope input.
 */
export function enemyParryRecoilFrame(state, out = {}) {
  const phase = state?.phase ?? 'ready';
  const phaseProgress = clamp01(state?.phaseProgress);
  const attack = state?.attack ?? null;
  const parried = attack?.parried === true;
  const counterUsed = attack?.counterUsed === true;
  const perfect = attack?.perfect === true;
  const guardBroken = attack?.guardBroken === true;
  const reactionWindow = 0.68;
  const active = phase === 'recovery' && parried && !counterUsed && phaseProgress < reactionWindow;

  out.active = active;
  out.phase = phase;
  out.progress = phaseProgress;
  out.perfect = perfect;
  out.guardBroken = guardBroken;
  out.direction = attack?.direction ?? null;
  out.retreat = 0;
  out.lateral = 0;
  out.drop = 0;
  out.pitch = 0;
  out.yaw = 0;
  out.roll = 0;

  if (!active) return out;

  const settle = 1 - smoother(phaseProgress / reactionWindow);
  const tier = guardBroken ? 1.65 : perfect ? 1.3 : 1;
  const lateralSign = directionVector(attack?.direction);
  const verticalAttack = attack?.direction === 'top' || attack?.direction === 'bottom';
  const lowerCut = attack?.direction === 'bottom';

  out.retreat = 0.075 * tier * settle;
  out.lateral = lateralSign * 0.038 * tier * settle;
  out.drop = (guardBroken ? 0.030 : 0.014) * tier * settle;
  out.pitch = (verticalAttack ? (lowerCut ? -2.2 : 3.1) : 1.8) * tier * settle;
  out.yaw = lateralSign * 5.4 * tier * settle;
  out.roll = -lateralSign * 4.2 * tier * settle;
  return out;
}

export function installEnemyParryRecoil(view) {
  if (!view || view[installed] || typeof view.draw !== 'function') return view;
  Object.defineProperty(view, installed, { value: true });

  const originalDraw = view.draw.bind(view);
  view.enemyParryRecoilState = enemyParryRecoilFrame(null, {});

  view.draw = (state, now, meta = {}) => {
    const result = originalDraw(state, now, meta);
    const frame = enemyParryRecoilFrame(state, view.enemyParryRecoilState);

    if (frame.active) {
      const enemy = view.enemy;
      if (enemy?.getLocalPosition && enemy?.setLocalPosition) {
        const pos = enemy.getLocalPosition();
        enemy.setLocalPosition(pos.x + frame.lateral, pos.y - frame.drop, pos.z - frame.retreat);
      }

      const character = view.skinnedModel;
      if (character?.getLocalEulerAngles && character?.setLocalEulerAngles) {
        const euler = character.getLocalEulerAngles();
        character.setLocalEulerAngles(euler.x + frame.pitch, euler.y + frame.yaw, euler.z + frame.roll);
      }
    }

    if (typeof document !== 'undefined') {
      document.documentElement.dataset.enemyParryRecoil = frame.active
        ? frame.guardBroken ? 'guard-break' : frame.perfect ? 'perfect' : 'parry'
        : 'neutral';
      document.documentElement.dataset.enemyParryRecoilProgress = frame.progress.toFixed(2);
    }
    return result;
  };

  if (typeof document !== 'undefined') document.documentElement.dataset.enemyParryRecoilReady = 'true';
  return view;
}
