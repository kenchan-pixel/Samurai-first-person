export const Direction = Object.freeze({
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
});

export const DIRECTIONS = Object.freeze(Object.values(Direction));

export const ENEMIES = Object.freeze([
  Object.freeze({
    id: 'ashigaru-scout',
    name: 'Ashigaru Scout',
    title: 'Gate of Reeds',
    maxHp: 3,
    postureMax: 3,
    gapMs: 620,
    recoveryMs: 920,
    perfectWindowMs: 105,
    colour: '#a94332',
    accent: '#ffb071',
    attacks: Object.freeze([
      Object.freeze({ direction: Direction.TOP, telegraphMs: 880, strikeMs: 330, damage: 1 }),
      Object.freeze({ direction: Direction.LEFT, telegraphMs: 790, strikeMs: 310, damage: 1 }),
      Object.freeze({ direction: Direction.RIGHT, telegraphMs: 760, strikeMs: 300, damage: 1 }),
      Object.freeze({ direction: Direction.TOP, telegraphMs: 700, strikeMs: 280, damage: 1 }),
    ]),
  }),
  Object.freeze({
    id: 'wandering-ronin',
    name: 'Wandering Ronin',
    title: 'Moonlit Courtyard',
    maxHp: 5,
    postureMax: 4,
    gapMs: 470,
    recoveryMs: 760,
    perfectWindowMs: 82,
    colour: '#384a77',
    accent: '#a9c5ff',
    attacks: Object.freeze([
      Object.freeze({ direction: Direction.RIGHT, feintFrom: Direction.LEFT, feintAt: 0.62, telegraphMs: 690, strikeMs: 250, damage: 1 }),
      Object.freeze({ direction: Direction.BOTTOM, telegraphMs: 610, strikeMs: 235, damage: 1 }),
      Object.freeze({ direction: Direction.LEFT, telegraphMs: 560, strikeMs: 225, damage: 1 }),
      Object.freeze({ direction: Direction.TOP, feintFrom: Direction.RIGHT, feintAt: 0.58, telegraphMs: 650, strikeMs: 220, damage: 1 }),
      Object.freeze({ direction: Direction.RIGHT, telegraphMs: 520, strikeMs: 210, damage: 1 }),
    ]),
  }),
  Object.freeze({
    id: 'oni-guard',
    name: 'Oni Guard',
    title: 'Ember Keep',
    maxHp: 8,
    postureMax: 5,
    gapMs: 390,
    recoveryMs: 680,
    perfectWindowMs: 68,
    colour: '#5f2225',
    accent: '#ff6e43',
    attacks: Object.freeze([
      Object.freeze({ direction: Direction.TOP, telegraphMs: 900, strikeMs: 195, damage: 2, heavy: true }),
      Object.freeze({ direction: Direction.BOTTOM, telegraphMs: 780, strikeMs: 185, damage: 2, heavy: true }),
      Object.freeze({ direction: Direction.LEFT, telegraphMs: 520, strikeMs: 205, damage: 1 }),
      Object.freeze({ direction: Direction.RIGHT, telegraphMs: 490, strikeMs: 195, damage: 1 }),
      Object.freeze({ direction: Direction.TOP, feintFrom: Direction.BOTTOM, feintAt: 0.7, telegraphMs: 760, strikeMs: 175, damage: 2, heavy: true }),
      Object.freeze({ direction: Direction.LEFT, telegraphMs: 455, strikeMs: 180, damage: 1 }),
    ]),
  }),
]);

const OPPOSITE = Object.freeze({
  [Direction.TOP]: Direction.BOTTOM,
  [Direction.RIGHT]: Direction.LEFT,
  [Direction.BOTTOM]: Direction.TOP,
  [Direction.LEFT]: Direction.RIGHT,
});

const PARRY_LEAD_BUFFER_MIN_MS = 60;
const PARRY_LEAD_BUFFER_MAX_MS = 110;

function parryLeadBufferMs(enemy) {
  const perfectWindowMs = Number(enemy?.perfectWindowMs);
  const derived = Number.isFinite(perfectWindowMs) ? Math.round(perfectWindowMs + 12) : 72;
  return Math.max(PARRY_LEAD_BUFFER_MIN_MS, Math.min(PARRY_LEAD_BUFFER_MAX_MS, derived));
}

export function oppositeDirection(direction) {
  return OPPOSITE[direction] ?? null;
}

export function directionFromTap(x, y, width, height, edgeRatio = 0.28) {
  if (![x, y, width, height].every(Number.isFinite) || width <= 0 || height <= 0) {
    return null;
  }

  const left = width * edgeRatio;
  const right = width * (1 - edgeRatio);
  const top = height * edgeRatio;
  const bottom = height * (1 - edgeRatio);

  const candidates = [];
  if (x <= left) candidates.push([Direction.LEFT, x / Math.max(left, 1)]);
  if (x >= right) candidates.push([Direction.RIGHT, (width - x) / Math.max(width - right, 1)]);
  if (y <= top) candidates.push([Direction.TOP, y / Math.max(top, 1)]);
  if (y >= bottom) candidates.push([Direction.BOTTOM, (height - y) / Math.max(height - bottom, 1)]);

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a[1] - b[1]);
  return candidates[0][0];
}

export function directionFromSwipe(dx, dy, threshold = 38) {
  if (![dx, dy].every(Number.isFinite)) return null;
  if (Math.hypot(dx, dy) < threshold) return null;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? Direction.RIGHT : Direction.LEFT;
  }
  return dy >= 0 ? Direction.BOTTOM : Direction.TOP;
}

function cloneAttack(definition) {
  return {
    ...definition,
    displayedDirection: definition.feintFrom ?? definition.direction,
    feintResolved: !definition.feintFrom,
    parried: false,
    perfect: false,
    counterUsed: false,
    guardBroken: false,
    strikeStartedAt: 0,
    bufferedParryDirection: null,
    bufferedParryCommittedAt: 0,
  };
}

export class CombatEngine {
  constructor({ enemies = ENEMIES, playerMaxHp = 5, playerPostureMax = 4 } = {}) {
    if (!Array.isArray(enemies) || enemies.length === 0) {
      throw new TypeError('CombatEngine requires at least one enemy.');
    }

    this.enemies = enemies;
    this.playerMaxHp = playerMaxHp;
    this.playerPostureMax = playerPostureMax;
    this.events = [];
    this.started = false;
    this.reset(0);
  }

  reset(now = 0) {
    this.started = false;
    this.playerHp = this.playerMaxHp;
    this.playerPosture = 0;
    this.enemyIndex = 0;
    this.enemyHp = this.enemies[0].maxHp;
    this.enemyPosture = 0;
    this.attackCursor = 0;
    this.currentAttack = null;
    this.phase = 'ready';
    this.phaseStartedAt = now;
    this.phaseEndsAt = Infinity;
    this.score = 0;
    this.combo = 0;
    this.events.length = 0;
    this.#emit('reset');
  }

  start(now = 0) {
    this.started = true;
    this.playerHp = this.playerMaxHp;
    this.playerPosture = 0;
    this.enemyIndex = 0;
    this.#startStage(0, now);
  }

  get enemy() {
    return this.enemies[this.enemyIndex];
  }

  get enemyPostureMax() {
    return Number.isFinite(this.enemy?.postureMax) && this.enemy.postureMax > 0 ? this.enemy.postureMax : 4;
  }

  update(now) {
    if (!this.started || !Number.isFinite(now)) return;

    if (this.phase === 'telegraph' && this.currentAttack?.feintFrom && !this.currentAttack.feintResolved) {
      const progress = this.phaseProgress(now);
      if (progress >= (this.currentAttack.feintAt ?? 0.62)) {
        this.currentAttack.displayedDirection = this.currentAttack.direction;
        this.currentAttack.feintResolved = true;
        this.#emit('feint', { direction: this.currentAttack.direction });
      }
    }

    let guard = 0;
    while (now >= this.phaseEndsAt && guard < 8) {
      guard += 1;
      switch (this.phase) {
        case 'stage-intro':
        case 'gap':
          this.#startTelegraph(this.phaseEndsAt);
          break;
        case 'telegraph':
          this.#startStrike(this.phaseEndsAt);
          break;
        case 'strike':
          this.#resolveMissedStrike(this.phaseEndsAt);
          break;
        case 'recovery':
          this.#finishRecovery(this.phaseEndsAt);
          break;
        case 'stage-clear':
          this.#advanceStage(this.phaseEndsAt);
          break;
        default:
          return;
      }
    }
  }

  attemptParry(direction, now) {
    if (!DIRECTIONS.includes(direction) || !Number.isFinite(now)) {
      return { accepted: false, reason: 'invalid-input' };
    }

    if (this.phase === 'telegraph' && this.currentAttack) {
      const remainingMs = this.phaseEndsAt - now;
      const withinLeadBuffer =
        remainingMs >= 0 &&
        remainingMs <= parryLeadBufferMs(this.enemy) &&
        this.currentAttack.feintResolved;

      if (!withinLeadBuffer) {
        this.combo = 0;
        this.#emit('parry-miss', { direction, reason: 'wrong-time' });
        return { accepted: false, reason: 'wrong-time' };
      }

      if (direction !== this.currentAttack.direction) {
        this.combo = 0;
        this.#emit('parry-miss', {
          direction,
          expected: this.currentAttack.direction,
          reason: 'wrong-direction',
        });
        return { accepted: false, reason: 'wrong-direction' };
      }

      if (this.currentAttack.bufferedParryDirection) {
        return { accepted: false, reason: 'already-buffered' };
      }

      this.currentAttack.bufferedParryDirection = direction;
      this.currentAttack.bufferedParryCommittedAt = now;
      return { accepted: true, perfect: false, buffered: true };
    }

    if (this.phase !== 'strike' || !this.currentAttack) {
      this.combo = 0;
      this.#emit('parry-miss', { direction, reason: 'wrong-time' });
      return { accepted: false, reason: 'wrong-time' };
    }

    if (direction !== this.currentAttack.direction) {
      this.combo = 0;
      this.#emit('parry-miss', {
        direction,
        expected: this.currentAttack.direction,
        reason: 'wrong-direction',
      });
      return { accepted: false, reason: 'wrong-direction' };
    }

    const elapsed = Math.max(0, now - this.currentAttack.strikeStartedAt);
    const buffered = Boolean(this.currentAttack.bufferedParryDirection);
    const perfect = !buffered && elapsed <= this.enemy.perfectWindowMs;
    this.currentAttack.parried = true;
    this.currentAttack.perfect = perfect;
    this.playerPosture = Math.max(0, this.playerPosture - 1);
    this.enemyPosture = Math.min(this.enemyPostureMax, this.enemyPosture + (perfect ? 2 : 1));
    this.currentAttack.guardBroken = this.enemyPosture >= this.enemyPostureMax;
    this.combo += 1;
    this.score += perfect ? 180 : 100;
    this.phase = 'recovery';
    this.phaseStartedAt = now;
    this.phaseEndsAt = now + Math.round(this.enemy.recoveryMs * (this.currentAttack.guardBroken ? 1.45 : 1));
    this.#emit(perfect ? 'perfect-parry' : 'parry', {
      direction,
      perfect,
      combo: this.combo,
      enemyPosture: this.enemyPosture,
      enemyPostureMax: this.enemyPostureMax,
    });
    if (this.currentAttack.guardBroken) {
      this.score += 250;
      this.#emit('enemy-guard-break', {
        enemyId: this.enemy.id,
        enemyPosture: this.enemyPosture,
        enemyPostureMax: this.enemyPostureMax,
      });
    }
    return { accepted: true, perfect, ...(buffered ? { buffered: true } : {}) };
  }

  attemptAttack(direction, now) {
    if (!DIRECTIONS.includes(direction) || !Number.isFinite(now)) {
      return { accepted: false, reason: 'invalid-input' };
    }

    if (this.phase !== 'recovery' || !this.currentAttack) {
      this.#emit('attack-miss', { direction, reason: 'no-opening' });
      return { accepted: false, reason: 'no-opening' };
    }

    if (!this.currentAttack.parried) {
      this.#emit('attack-miss', { direction, reason: 'no-parry-opening' });
      return { accepted: false, reason: 'no-parry-opening' };
    }

    if (this.currentAttack.counterUsed) {
      return { accepted: false, reason: 'already-used' };
    }

    this.currentAttack.counterUsed = true;
    const baseDamage = 1;
    const perfectBonus = this.currentAttack.perfect ? 1 : 0;
    const directionalBonus = direction === oppositeDirection(this.currentAttack.direction) ? 1 : 0;
    const guardBreakBonus = this.currentAttack.guardBroken ? 2 : 0;
    const damage = Math.max(1, baseDamage + perfectBonus + directionalBonus + guardBreakBonus);
    if (this.currentAttack.guardBroken) this.enemyPosture = 0;
    this.enemyHp = Math.max(0, this.enemyHp - damage);
    this.score += damage * 120 + this.combo * 15;
    this.#emit('counter', {
      direction,
      damage,
      guardBroken: this.currentAttack.guardBroken,
      enemyHp: this.enemyHp,
      maxEnemyHp: this.enemy.maxHp,
    });

    if (this.enemyHp <= 0) {
      this.phase = 'stage-clear';
      this.phaseStartedAt = now;
      this.phaseEndsAt = now + 1450;
      this.#emit('enemy-defeated', { enemyId: this.enemy.id, stage: this.enemyIndex + 1 });
    }

    return { accepted: true, damage, defeated: this.enemyHp <= 0 };
  }

  phaseProgress(now) {
    if (!Number.isFinite(this.phaseEndsAt) || this.phaseEndsAt <= this.phaseStartedAt) return 0;
    return Math.max(0, Math.min(1, (now - this.phaseStartedAt) / (this.phaseEndsAt - this.phaseStartedAt)));
  }

  snapshot(now = this.phaseStartedAt) {
    const attack = this.currentAttack
      ? {
          direction: this.currentAttack.direction,
          displayedDirection: this.currentAttack.displayedDirection,
          damage: this.currentAttack.damage,
          heavy: Boolean(this.currentAttack.heavy),
          parried: this.currentAttack.parried,
          perfect: this.currentAttack.perfect,
          counterUsed: this.currentAttack.counterUsed,
          guardBroken: this.currentAttack.guardBroken,
        }
      : null;

    return {
      started: this.started,
      phase: this.phase,
      phaseProgress: this.phaseProgress(now),
      playerHp: this.playerHp,
      playerMaxHp: this.playerMaxHp,
      playerPosture: this.playerPosture,
      playerPostureMax: this.playerPostureMax,
      enemyIndex: this.enemyIndex,
      stage: this.enemyIndex + 1,
      stageCount: this.enemies.length,
      enemy: this.enemy,
      enemyHp: this.enemyHp,
      enemyPosture: this.enemyPosture,
      enemyPostureMax: this.enemyPostureMax,
      attack,
      score: this.score,
      combo: this.combo,
    };
  }

  drainEvents() {
    return this.events.splice(0, this.events.length);
  }

  #startStage(index, now) {
    this.enemyIndex = index;
    this.enemyHp = this.enemy.maxHp;
    this.enemyPosture = 0;
    this.playerPosture = 0;
    this.attackCursor = 0;
    this.currentAttack = null;
    this.phase = 'stage-intro';
    this.phaseStartedAt = now;
    this.phaseEndsAt = now + 1550;
    this.#emit('stage-start', {
      stage: index + 1,
      enemyId: this.enemy.id,
      enemyName: this.enemy.name,
    });
  }

  #startTelegraph(now) {
    const definition = this.enemy.attacks[this.attackCursor % this.enemy.attacks.length];
    this.attackCursor += 1;
    this.currentAttack = cloneAttack(definition);
    this.phase = 'telegraph';
    this.phaseStartedAt = now;
    this.phaseEndsAt = now + definition.telegraphMs;
    this.#emit('telegraph', {
      direction: this.currentAttack.displayedDirection,
      actualDirection: definition.direction,
      feint: Boolean(definition.feintFrom),
      heavy: Boolean(definition.heavy),
    });
  }

  #startStrike(now) {
    const bufferedParryDirection = this.currentAttack.bufferedParryDirection;
    this.currentAttack.displayedDirection = this.currentAttack.direction;
    this.currentAttack.feintResolved = true;
    this.currentAttack.strikeStartedAt = now;
    this.phase = 'strike';
    this.phaseStartedAt = now;
    this.phaseEndsAt = now + this.currentAttack.strikeMs;
    this.#emit('strike', {
      direction: this.currentAttack.direction,
      damage: this.currentAttack.damage,
      heavy: Boolean(this.currentAttack.heavy),
    });
    if (bufferedParryDirection) this.attemptParry(bufferedParryDirection, now);
  }

  #resolveMissedStrike(now) {
    const postureGain = this.currentAttack.heavy ? 2 : 1;
    this.playerPosture = Math.min(this.playerPostureMax, this.playerPosture + postureGain);
    const guardBroken = this.playerPosture >= this.playerPostureMax;
    const damage = this.currentAttack.damage + (guardBroken ? 1 : 0);
    if (guardBroken) this.playerPosture = 0;
    this.playerHp = Math.max(0, this.playerHp - damage);
    this.combo = 0;
    this.#emit('player-hit', {
      damage,
      direction: this.currentAttack.direction,
      playerHp: this.playerHp,
      guardBroken,
      postureGain,
      playerPosture: this.playerPosture,
      playerPostureMax: this.playerPostureMax,
    });

    if (this.playerHp <= 0) {
      this.phase = 'defeat';
      this.phaseStartedAt = now;
      this.phaseEndsAt = Infinity;
      this.#emit('defeat', { score: this.score });
      return;
    }

    this.phase = 'recovery';
    this.phaseStartedAt = now;
    this.phaseEndsAt = now + Math.round(this.enemy.recoveryMs * 0.72);
  }

  #finishRecovery(now) {
    if (this.currentAttack?.guardBroken && !this.currentAttack.counterUsed) {
      this.enemyPosture = Math.floor(this.enemyPostureMax / 2);
    }
    this.currentAttack = null;
    this.phase = 'gap';
    this.phaseStartedAt = now;
    this.phaseEndsAt = now + this.enemy.gapMs;
  }

  #advanceStage(now) {
    if (this.enemyIndex >= this.enemies.length - 1) {
      this.phase = 'victory';
      this.phaseStartedAt = now;
      this.phaseEndsAt = Infinity;
      this.#emit('victory', { score: this.score, playerHp: this.playerHp });
      return;
    }

    this.#startStage(this.enemyIndex + 1, now);
  }

  #emit(type, detail = {}) {
    this.events.push({ type, detail });
  }
}
