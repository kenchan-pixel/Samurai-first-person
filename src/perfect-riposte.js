import { CombatEngine } from './game-core.js';
import { maybeAdvanceBossPhase } from './boss-encounter.js';

const installed = Symbol.for('blade-reversal.perfect-riposte-v1');

export function installPerfectRiposte(Engine = CombatEngine) {
  if (!Engine?.prototype || Engine.prototype[installed]) return;

  const originalAttemptParry = Engine.prototype.attemptParry;
  const originalAttemptAttack = Engine.prototype.attemptAttack;
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.attemptParry = function perfectRiposteParry(direction, now) {
    const result = originalAttemptParry.call(this, direction, now);
    const attack = this.currentAttack;
    if (!result?.accepted || !result.perfect || !attack || attack.autoRiposteUsed) return result;

    attack.autoRiposteUsed = true;
    const damage = 1;
    this.enemyHp = Math.max(0, this.enemyHp - damage);
    this.score += damage * 120;
    this.events.push({
      type: 'perfect-riposte',
      detail: {
        direction,
        damage,
        automatic: true,
        perfectRiposte: true,
        guardBroken: false,
        enemyHp: this.enemyHp,
        maxEnemyHp: this.enemy.maxHp,
      },
    });

    const bossPhase = maybeAdvanceBossPhase(this, now) ? 2 : undefined;

    if (this.enemyHp <= 0) {
      this.phase = 'stage-clear';
      this.phaseStartedAt = now;
      this.phaseEndsAt = now + 1450;
      this.events.push({ type: 'enemy-defeated', detail: { enemyId: this.enemy.id, stage: this.enemyIndex + 1 } });
    }

    return {
      ...result,
      autoRiposte: true,
      autoRiposteDamage: damage,
      bossPhase,
      defeated: this.enemyHp <= 0,
    };
  };

  Engine.prototype.attemptAttack = function perfectRiposteAttack(direction, now) {
    const attack = this.currentAttack;
    const suppressLegacyPerfectBonus = Boolean(attack?.perfect && attack.autoRiposteUsed);
    const originalPerfect = attack?.perfect;
    if (suppressLegacyPerfectBonus) attack.perfect = false;
    try {
      return originalAttemptAttack.call(this, direction, now);
    } finally {
      if (suppressLegacyPerfectBonus && this.currentAttack === attack) attack.perfect = originalPerfect;
    }
  };

  Engine.prototype.drainEvents = function perfectRiposteDrainEvents() {
    const events = originalDrainEvents.call(this);
    return events.map((event) => event?.type === 'perfect-riposte'
      ? { type: 'counter', detail: { ...event.detail, automatic: true, perfectRiposte: true } }
      : event);
  };
}

installPerfectRiposte();
