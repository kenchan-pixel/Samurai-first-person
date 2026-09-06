const installed = Symbol.for('blade-reversal.enemy-counter-reaction-v1');

const clamp01 = (value) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

function smoother(value) {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
}

function counterDirection(index) {
  if (index === 1) return 'right';
  if (index === 3) return 'left';
  if (index === 0) return 'top';
  if (index === 2) return 'bottom';
  return null;
}

/**
 * Presentation-only body response for an accepted manual counter.
 * `meta.hitAge` is the existing normalized counter-impact age from main.js;
 * this adapter owns no gameplay clock or combat state.
 */
export function enemyCounterReactionFrame(state, meta = {}, out = {}) {
  const hitAge = Number(meta?.hitAge);
  const phase = state?.phase ?? 'ready';
  const attack = state?.attack ?? null;
  const counterUsed = attack?.counterUsed === true;
  const direction = counterDirection(Number(meta?.playerDirectionIndex));
  const defeated = phase === 'stage-clear' && Number(state?.enemyHp) <= 0;
  const activePhase = phase === 'recovery' || phase === 'stage-clear';
  const active = counterUsed && direction !== null && activePhase && Number.isFinite(hitAge) && hitAge >= 0 && hitAge < 1;

  out.active = active;
  out.phase = phase;
  out.progress = Number.isFinite(hitAge) ? clamp01(hitAge) : 1;
  out.direction = direction;
  out.perfect = attack?.perfect === true;
  out.guardBroken = attack?.guardBroken === true;
  out.defeated = defeated;
  out.retreat = 0;
  out.lateral = 0;
  out.lift = 0;
  out.drop = 0;
  out.pitch = 0;
  out.yaw = 0;
  out.roll = 0;

  if (!active) return out;

  const settle = 1 - smoother(hitAge);
  const tier = defeated ? 1.58 : out.guardBroken ? 1.34 : out.perfect ? 1.14 : 1;
  const lateralSign = direction === 'right' ? 1 : direction === 'left' ? -1 : 0;
  const isTop = direction === 'top';
  const isBottom = direction === 'bottom';

  out.retreat = 0.088 * tier * settle;
  out.lateral = lateralSign * 0.052 * tier * settle;
  out.lift = (isTop ? 0.030 : 0) * tier * settle;
  out.drop = ((isBottom ? 0.042 : lateralSign ? 0.014 : 0) + (defeated ? 0.018 : 0)) * tier * settle;
  out.pitch = (isTop ? -4.6 : isBottom ? 5.5 : 2.1) * tier * settle;
  out.yaw = lateralSign * 7.2 * tier * settle;
  out.roll = -lateralSign * 6.2 * tier * settle;
  return out;
}

export function installEnemyCounterReaction(view) {
  if (!view || view[installed] || typeof view.draw !== 'function') return view;
  Object.defineProperty(view, installed, { value: true });

  const originalDraw = view.draw.bind(view);
  view.enemyCounterReactionState = enemyCounterReactionFrame(null, {}, {});

  view.draw = (state, now, meta = {}) => {
    const result = originalDraw(state, now, meta);
    const frame = enemyCounterReactionFrame(state, meta, view.enemyCounterReactionState);

    if (frame.active) {
      const enemy = view.enemy;
      if (enemy?.getLocalPosition && enemy?.setLocalPosition) {
        const pos = enemy.getLocalPosition();
        enemy.setLocalPosition(
          pos.x + frame.lateral,
          pos.y + frame.lift - frame.drop,
          pos.z - frame.retreat,
        );
      }

      const character = view.skinnedModel;
      if (character?.getLocalEulerAngles && character?.setLocalEulerAngles) {
        const euler = character.getLocalEulerAngles();
        character.setLocalEulerAngles(euler.x + frame.pitch, euler.y + frame.yaw, euler.z + frame.roll);
      }
    }

    if (typeof document !== 'undefined') {
      document.documentElement.dataset.enemyCounterReaction = frame.active
        ? frame.defeated ? 'finisher' : frame.guardBroken ? 'guard-break' : frame.perfect ? 'perfect' : 'counter'
        : 'neutral';
      document.documentElement.dataset.enemyCounterReactionProgress = frame.progress.toFixed(2);
    }
    return result;
  };

  if (typeof document !== 'undefined') document.documentElement.dataset.enemyCounterReactionReady = 'true';
  return view;
}
