import { CombatEngine, Direction } from './game-core.js';

export const BOSS_ID = 'crimson-shogun';
export const BOSS_PHASE_TWO_HP = 6;

export const BOSS_PHASE_ONE = Object.freeze({
  id: BOSS_ID,
  name: 'Crimson Shogun',
  title: 'Stormbreak Throne',
  maxHp: 12,
  postureMax: 6,
  gapMs: 430,
  recoveryMs: 720,
  perfectWindowMs: 72,
  colour: '#6e1820',
  accent: '#ffc45d',
  attacks: Object.freeze([
    Object.freeze({ direction: Direction.TOP, telegraphMs: 780, strikeMs: 195, damage: 2, heavy: true }),
    Object.freeze({ direction: Direction.RIGHT, feintFrom: Direction.LEFT, feintAt: 0.66, telegraphMs: 620, strikeMs: 190, damage: 1 }),
    Object.freeze({ direction: Direction.BOTTOM, telegraphMs: 660, strikeMs: 185, damage: 2, heavy: true }),
    Object.freeze({ direction: Direction.LEFT, telegraphMs: 560, strikeMs: 175, damage: 1 }),
    Object.freeze({ direction: Direction.TOP, feintFrom: Direction.RIGHT, feintAt: 0.7, telegraphMs: 690, strikeMs: 180, damage: 2, heavy: true }),
  ]),
});

export const BOSS_PHASE_TWO = Object.freeze({
  ...BOSS_PHASE_ONE,
  title: 'Stormbreak Throne · Blood Moon',
  postureMax: 7,
  gapMs: 320,
  recoveryMs: 600,
  perfectWindowMs: 58,
  accent: '#ff5b43',
  attacks: Object.freeze([
    Object.freeze({ direction: Direction.LEFT, feintFrom: Direction.TOP, feintAt: 0.72, telegraphMs: 540, strikeMs: 160, damage: 2, heavy: true }),
    Object.freeze({ direction: Direction.RIGHT, feintFrom: Direction.BOTTOM, feintAt: 0.68, telegraphMs: 500, strikeMs: 155, damage: 2, heavy: true }),
    Object.freeze({ direction: Direction.TOP, telegraphMs: 450, strikeMs: 150, damage: 1 }),
    Object.freeze({ direction: Direction.BOTTOM, telegraphMs: 620, strikeMs: 145, damage: 2, heavy: true }),
    Object.freeze({ direction: Direction.RIGHT, telegraphMs: 420, strikeMs: 140, damage: 1 }),
    Object.freeze({ direction: Direction.LEFT, telegraphMs: 400, strikeMs: 138, damage: 1 }),
  ]),
});

const installed = Symbol.for('blade-reversal.boss-encounter');
const bossState = new WeakMap();

export function installBossEncounter(Engine = CombatEngine) {
  if (Engine.prototype[installed]) return;

  const originalStart = Engine.prototype.start;
  const originalAttemptAttack = Engine.prototype.attemptAttack;

  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.start = function bossEncounterStart(now = 0) {
    const existingBoss = this.enemies.findIndex((enemy) => enemy?.id === BOSS_ID);
    const nextEnemies = [...this.enemies];
    if (existingBoss === -1) nextEnemies.push(BOSS_PHASE_ONE);
    else nextEnemies[existingBoss] = BOSS_PHASE_ONE;
    this.enemies = nextEnemies;
    bossState.set(this, { phase: 1 });
    return originalStart.call(this, now);
  };

  Engine.prototype.attemptAttack = function bossEncounterAttack(direction, now) {
    const result = originalAttemptAttack.call(this, direction, now);
    const state = bossState.get(this);
    const shouldShift =
      state?.phase === 1 &&
      this.enemy?.id === BOSS_ID &&
      result?.accepted &&
      !result.defeated &&
      this.enemyHp <= BOSS_PHASE_TWO_HP;

    if (!shouldShift) return result;

    state.phase = 2;
    const nextEnemies = [...this.enemies];
    nextEnemies[this.enemyIndex] = BOSS_PHASE_TWO;
    this.enemies = nextEnemies;
    this.enemyPosture = 0;
    this.attackCursor = 0;
    this.currentAttack = null;
    this.phase = 'gap';
    this.phaseStartedAt = now;
    this.phaseEndsAt = now + 1100;
    this.score += 300;
    this.events.push({
      type: 'boss-phase',
      detail: {
        enemyId: BOSS_ID,
        phase: 2,
        title: 'BLOOD MOON',
        enemyHp: this.enemyHp,
        maxEnemyHp: BOSS_PHASE_TWO.maxHp,
        score: this.score,
      },
    });

    return { ...result, bossPhase: 2 };
  };
}
