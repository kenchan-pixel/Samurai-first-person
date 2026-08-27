import { CombatEngine, oppositeDirection } from './game-core.js';
import { installFootwork } from './footwork.js';
import { maybeAdvanceBossPhase } from './boss-encounter.js';

const installed = Symbol.for('blade-reversal.perfect-step-v1');
let cueTimer = null;

export function perfectStepWindowMs(attack) {
  const strikeMs = Math.max(1, Number(attack?.strikeMs) || 180);
  return Math.max(48, Math.min(68, Math.round(strikeMs * 0.32)));
}

function installGuideCard() {
  if (typeof document === 'undefined') return;
  const cards = document.querySelector('.combat-guide__cards');
  if (cards && !cards.querySelector('[data-perfect-step-guide]')) {
    const card = document.createElement('article');
    card.className = 'combat-guide-card combat-guide-card--accent';
    card.dataset.perfectStepGuide = 'true';
    card.innerHTML = '<strong>⑥ PERFECT STEP</strong><span>STEP 成功仲有兩級：普通 STEP 只係避刀；喺更窄嘅最早時機避過短／中距離斬會觸發 PERFECT STEP，自動補 1 刀但唔增加敵勢，之後仍可再掃屏一次。長距離／重擊照樣會追到。</span>';
    cards.append(card);
  }
  document.documentElement.dataset.perfectStepGuide = String(Boolean(cards?.querySelector('[data-perfect-step-guide]')));
}

function presentPerfectStep(detail) {
  if (typeof document === 'undefined') return;
  const feedback = document.querySelector('#footwork-feedback');
  if (feedback) feedback.textContent = 'PERFECT STEP · 自動補刀 -1';

  const cue = document.querySelector('#combat-action-cue');
  if (cue) {
    if (cueTimer !== null) clearTimeout(cueTimer);
    cue.hidden = false;
    cue.dataset.kind = 'opening';
    const title = cue.querySelector('strong');
    const body = cue.querySelector('span');
    if (title) title.textContent = 'PERFECT STEP';
    if (body) body.textContent = `自動補刀 -${detail?.damage || 1} · 無敵勢 · 仲可掃屏`;
    cue.classList.add('is-visible');
    cueTimer = window.setTimeout(() => {
      cue.classList.remove('is-visible');
      cueTimer = window.setTimeout(() => {
        cue.hidden = true;
        cueTimer = null;
      }, 140);
    }, 1050);
  }

  document.documentElement.dataset.perfectStepLast = 'riposte';
}

export function installPerfectStep(Engine = CombatEngine) {
  if (!Engine?.prototype || Engine.prototype[installed]) {
    if (typeof document !== 'undefined') installGuideCard();
    return;
  }

  installFootwork(Engine);
  const originalAttemptBackstep = Engine.prototype.attemptBackstep;
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.attemptBackstep = function perfectStepBackstep(now) {
    const attack = this.currentAttack;
    const strikeStartedAt = Number(attack?.strikeStartedAt || this.phaseStartedAt);
    const elapsed = Number.isFinite(now) && Number.isFinite(strikeStartedAt)
      ? Math.max(0, now - strikeStartedAt)
      : Infinity;
    const windowMs = perfectStepWindowMs(attack);
    const result = originalAttemptBackstep.call(this, now);

    if (!result?.accepted || !result.evaded || !attack) return result;
    const perfectStep = elapsed <= windowMs;
    if (!perfectStep || attack.perfectStepUsed) {
      return { ...result, perfectStep: false, perfectStepWindowMs: windowMs };
    }

    attack.perfectStepUsed = true;
    const damage = 1;
    this.enemyHp = Math.max(0, this.enemyHp - damage);
    this.score += damage * 120;
    const direction = oppositeDirection(attack.direction) || attack.direction;
    this.events.push({
      type: 'perfect-step-riposte',
      detail: {
        direction,
        damage,
        automatic: true,
        perfectStep: true,
        evaded: true,
        enemyHp: this.enemyHp,
        maxEnemyHp: this.enemy.maxHp,
      },
    });

    const bossPhase = maybeAdvanceBossPhase(this, now) ? 2 : undefined;
    if (!bossPhase && this.enemyHp <= 0) {
      this.phase = 'stage-clear';
      this.phaseStartedAt = now;
      this.phaseEndsAt = now + 1450;
      this.events.push({ type: 'enemy-defeated', detail: { enemyId: this.enemy.id, stage: this.enemyIndex + 1 } });
    }

    return {
      ...result,
      perfectStep: true,
      perfectStepWindowMs: windowMs,
      autoRiposte: true,
      autoRiposteDamage: damage,
      bossPhase,
      defeated: this.enemyHp <= 0,
    };
  };

  Engine.prototype.drainEvents = function perfectStepDrainEvents() {
    const events = originalDrainEvents.call(this);
    return events.map((event) => {
      if (event?.type !== 'perfect-step-riposte') return event;
      presentPerfectStep(event.detail);
      return {
        type: 'counter',
        detail: {
          ...event.detail,
          automatic: true,
          perfectStep: true,
          evaded: true,
        },
      };
    });
  };

  if (typeof document !== 'undefined') {
    installGuideCard();
    document.documentElement.dataset.perfectStepReady = 'true';
  }
}

installPerfectStep();
