const installed = Symbol.for('blade-reversal.enemy-screen-space-direction-v1');

export const ENEMY_DIRECTION_SEMANTICS = 'player-screen-travel-v1';

export function enemyDirectionIndexFromPlayerIndex(directionIndex) {
  const index = Math.max(0, Math.min(3, Number.isFinite(directionIndex) ? directionIndex | 0 : 0));
  if (index === 1) return 3;
  if (index === 3) return 1;
  return index;
}

export function installEnemyScreenSpaceDirection(view) {
  if (!view || view[installed]) return view;
  Object.defineProperty(view, installed, { value: true });

  const originalDraw = view.draw.bind(view);
  view.draw = (snapshot, now, meta = {}) => originalDraw(snapshot, now, {
    ...meta,
    // CombatEngine directions and all HUD/input cues are player-screen semantics.
    // The opponent faces the player, so only the enemy presentation index mirrors
    // horizontal RIGHT/LEFT. Player katana direction remains untouched.
    attackDirectionIndex: enemyDirectionIndexFromPlayerIndex(meta?.attackDirectionIndex ?? 0),
  });

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.enemyDirectionSemantics = ENEMY_DIRECTION_SEMANTICS;
  }
  return view;
}
