import { CombatEngine } from './game-core.js';
import { CHALLENGE_ACTIVE } from './challenge-mode.js';

export const CHALLENGE_TACTIC_CHECKPOINTS = Object.freeze([2, 4, 6]);
export const CHALLENGE_TACTIC_SCORE_BONUS = 350;

const installed = Symbol.for('blade-reversal.challenge-tactics-v1');
const states = new WeakMap();
let pendingEngine = null;

function stateFor(engine) {
  let state = states.get(engine);
  if (!state) {
    state = {
      active: false,
      pending: false,
      resumePending: false,
      checkpoint: 0,
      remainingMs: 0,
      lastNow: 0,
      choicesMade: 0,
      lastChoice: null,
    };
    states.set(engine, state);
  }
  return state;
}

export function resolveChallengeTactic({
  choice,
  playerHp = 0,
  playerMaxHp = 0,
  score = 0,
} = {}) {
  const hp = Math.max(0, Number(playerHp) || 0);
  const maxHp = Math.max(hp, Number(playerMaxHp) || 0);
  const currentScore = Math.max(0, Math.round(Number(score) || 0));

  if (choice === 'recover') {
    const nextHp = Math.min(maxHp, hp + 1);
    return {
      accepted: true,
      choice,
      hpDelta: nextHp - hp,
      scoreDelta: 0,
      playerHp: nextHp,
      score: currentScore,
    };
  }

  if (choice === 'blood-vow') {
    if (hp <= 1) {
      return {
        accepted: false,
        choice,
        reason: 'last-hp',
        hpDelta: 0,
        scoreDelta: 0,
        playerHp: hp,
        score: currentScore,
      };
    }
    return {
      accepted: true,
      choice,
      hpDelta: -1,
      scoreDelta: CHALLENGE_TACTIC_SCORE_BONUS,
      playerHp: hp - 1,
      score: currentScore + CHALLENGE_TACTIC_SCORE_BONUS,
    };
  }

  return {
    accepted: false,
    choice: null,
    reason: 'invalid-choice',
    hpDelta: 0,
    scoreDelta: 0,
    playerHp: hp,
    score: currentScore,
  };
}

function ensureStyles() {
  if (typeof document === 'undefined' || document.querySelector('style[data-challenge-tactics]')) return;
  const style = document.createElement('style');
  style.dataset.challengeTactics = 'true';
  style.textContent = `
    .challenge-tactic{
      position:absolute;
      z-index:18;
      inset:0;
      display:grid;
      place-items:center;
      padding:calc(var(--safe-top) + 58px) max(14px,var(--safe-right)) calc(var(--safe-bottom) + 18px) max(14px,var(--safe-left));
      background:linear-gradient(180deg,rgba(5,7,9,.18),rgba(5,7,9,.72));
      pointer-events:auto;
    }
    .challenge-tactic[hidden]{display:none}
    .challenge-tactic__card{
      width:min(100%,310px);
      padding:14px;
      border:1px solid rgba(228,182,107,.32);
      border-radius:16px;
      background:rgba(20,18,15,.92);
      box-shadow:0 18px 48px rgba(0,0,0,.42);
      backdrop-filter:blur(9px);
    }
    .challenge-tactic__eyebrow{margin:0;color:#dcae67;font-size:9px;letter-spacing:.13em;text-align:center}
    .challenge-tactic__card h3{margin:5px 0 3px;color:#f4ead7;font-size:20px;line-height:1.05;text-align:center}
    .challenge-tactic__status{margin:0 0 10px;color:rgba(244,232,210,.68);font-size:10px;text-align:center}
    .challenge-tactic__choices{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .challenge-tactic__choice{
      min-height:58px;
      padding:9px 7px;
      border:1px solid rgba(255,255,255,.15);
      border-radius:12px;
      background:rgba(255,255,255,.05);
      color:#f4ead7;
      font:inherit;
      touch-action:manipulation;
    }
    .challenge-tactic__choice strong{display:block;font-size:13px;letter-spacing:.06em}
    .challenge-tactic__choice small{display:block;margin-top:4px;color:rgba(244,232,210,.66);font-size:9px;line-height:1.18}
    .challenge-tactic__choice--risk{border-color:rgba(209,88,70,.42);background:rgba(112,38,30,.18)}
    .challenge-tactic__choice:disabled{opacity:.36}
    .challenge-tactic__hint{margin:9px 0 0;color:rgba(244,232,210,.48);font-size:8px;line-height:1.3;text-align:center}
    @media(max-width:360px) and (max-height:620px){
      .challenge-tactic{padding-top:calc(var(--safe-top) + 48px);padding-bottom:calc(var(--safe-bottom) + 12px)}
      .challenge-tactic__card{padding:11px}
      .challenge-tactic__card h3{font-size:18px}
      .challenge-tactic__choice{min-height:52px;padding:7px 6px}
    }
  `;
  document.head.append(style);
}

function ensureUi() {
  if (typeof document === 'undefined') return null;
  ensureStyles();
  let panel = document.querySelector('#challenge-tactic');
  if (!panel) {
    panel = document.createElement('section');
    panel.id = 'challenge-tactic';
    panel.className = 'challenge-tactic';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'challenge-tactic-title');
    panel.innerHTML = `
      <div class="challenge-tactic__card">
        <p class="challenge-tactic__eyebrow">連戰 · 戰前抉擇</p>
        <h3 id="challenge-tactic-title">收刀一息</h3>
        <p class="challenge-tactic__status" data-challenge-tactic-status></p>
        <div class="challenge-tactic__choices">
          <button class="challenge-tactic__choice" type="button" data-challenge-tactic="recover">
            <strong>整息</strong><small data-challenge-tactic-recover>回復 1 生命</small>
          </button>
          <button class="challenge-tactic__choice challenge-tactic__choice--risk" type="button" data-challenge-tactic="blood-vow">
            <strong>血誓</strong><small>+350 分 · -1 生命</small>
          </button>
        </div>
        <p class="challenge-tactic__hint">只影響今次連戰 · 主線與敵人規則不變</p>
      </div>`;
    (document.querySelector('#app') || document.body).append(panel);
    panel.addEventListener('click', (event) => {
      const button = event.target?.closest?.('[data-challenge-tactic]');
      if (!button || button.disabled || !pendingEngine) return;
      chooseChallengeTactic(pendingEngine, button.dataset.challengeTactic);
    });
  }
  const challengeCopy = document.querySelector('#challenge-button small');
  if (challengeCopy) challengeCopy.textContent = '八關 · 聚氣＋抉擇';
  return panel;
}

function renderHidden(state = null) {
  if (typeof document === 'undefined') return;
  const panel = ensureUi();
  if (panel) panel.hidden = true;
  const root = document.documentElement;
  root.dataset.challengeTacticPending = 'false';
  if (!state?.active) root.dataset.challengeTacticCheckpoint = '';
}

function renderChoice(engine, state) {
  if (typeof document === 'undefined') return;
  const panel = ensureUi();
  if (!panel) return;
  const hp = Math.max(0, Number(engine.playerHp) || 0);
  const maxHp = Math.max(hp, Number(engine.playerMaxHp) || 0);
  const score = Math.max(0, Math.round(Number(engine.score) || 0));
  const status = panel.querySelector('[data-challenge-tactic-status]');
  const recoverCopy = panel.querySelector('[data-challenge-tactic-recover]');
  const risk = panel.querySelector('[data-challenge-tactic="blood-vow"]');
  if (status) status.textContent = `第 ${state.checkpoint} 關突破 · 生命 ${hp}/${maxHp} · ${String(score).padStart(6, '0')}`;
  if (recoverCopy) recoverCopy.textContent = hp < maxHp ? '回復 1 生命' : '保持滿血 · 安全續戰';
  if (risk) {
    risk.disabled = hp <= 1;
    risk.setAttribute('aria-disabled', String(hp <= 1));
  }
  panel.hidden = false;
  const root = document.documentElement;
  root.dataset.challengeTacticPending = 'true';
  root.dataset.challengeTacticCheckpoint = String(state.checkpoint);
  root.dataset.challengeTacticChoices = String(state.choicesMade);
}

function openCheckpoint(engine, state, stage) {
  if (state.pending || state.resumePending || !CHALLENGE_TACTIC_CHECKPOINTS.includes(stage)) return;
  const phaseStartedAt = Number.isFinite(engine.phaseStartedAt) ? engine.phaseStartedAt : 0;
  const observedNow = Math.max(phaseStartedAt, Number.isFinite(state.lastNow) ? state.lastNow : phaseStartedAt);
  state.pending = true;
  state.resumePending = false;
  state.checkpoint = stage;
  state.remainingMs = Number.isFinite(engine.phaseEndsAt)
    ? Math.max(0, engine.phaseEndsAt - observedNow)
    : 0;
  engine.phaseEndsAt = Infinity;
  pendingEngine = engine;
  renderChoice(engine, state);
}

export function chooseChallengeTactic(engine, choice) {
  const state = states.get(engine);
  if (!state?.active || !state.pending) return { accepted: false, reason: 'no-pending-choice' };
  const resolved = resolveChallengeTactic({
    choice,
    playerHp: engine.playerHp,
    playerMaxHp: engine.playerMaxHp,
    score: engine.score,
  });
  if (!resolved.accepted) return resolved;

  engine.playerHp = resolved.playerHp;
  engine.score = resolved.score;
  state.pending = false;
  state.resumePending = true;
  state.choicesMade += 1;
  state.lastChoice = resolved.choice;
  if (pendingEngine === engine) pendingEngine = null;
  renderHidden(state);

  if (Array.isArray(engine.events)) {
    engine.events.push({
      type: 'challenge-tactic',
      detail: {
        choice: resolved.choice,
        checkpoint: state.checkpoint,
        hpDelta: resolved.hpDelta,
        scoreDelta: resolved.scoreDelta,
        playerHp: engine.playerHp,
        score: engine.score,
        choicesMade: state.choicesMade,
      },
    });
  }

  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.dataset.challengeTacticLast = resolved.choice;
    root.dataset.challengeTacticChoices = String(state.choicesMade);
  }
  return resolved;
}

export function installChallengeTactics(Engine = CombatEngine) {
  if (!Engine?.prototype || Engine.prototype[installed]) return;
  const originalStart = Engine.prototype.start;
  const originalUpdate = Engine.prototype.update;
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.start = function challengeTacticsStart(now = 0) {
    const result = originalStart.call(this, now);
    const state = stateFor(this);
    state.active = Boolean(this[CHALLENGE_ACTIVE]);
    state.pending = false;
    state.resumePending = false;
    state.checkpoint = 0;
    state.remainingMs = 0;
    state.lastNow = Number.isFinite(now) ? now : 0;
    state.choicesMade = 0;
    state.lastChoice = null;
    if (pendingEngine === this) pendingEngine = null;
    renderHidden(state);
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.challengeTacticChoices = '0';
      document.documentElement.dataset.challengeTacticLast = '';
    }
    return result;
  };

  Engine.prototype.update = function challengeTacticsUpdate(now) {
    const state = stateFor(this);
    if (state.resumePending && Number.isFinite(now)) {
      const remainingMs = Math.max(0, Number(state.remainingMs) || 0);
      this.phaseStartedAt = now;
      this.phaseEndsAt = now + remainingMs;
      state.resumePending = false;
      state.remainingMs = 0;
    }
    if (Number.isFinite(now)) state.lastNow = now;
    return originalUpdate.call(this, now);
  };

  Engine.prototype.drainEvents = function challengeTacticsDrainEvents() {
    const events = originalDrainEvents.call(this);
    const state = stateFor(this);
    const active = Boolean(this[CHALLENGE_ACTIVE]);

    if (!active) {
      if (state.active || state.pending || state.resumePending) {
        state.active = false;
        state.pending = false;
        state.resumePending = false;
        state.remainingMs = 0;
        if (pendingEngine === this) pendingEngine = null;
        renderHidden(state);
      }
      return events;
    }

    state.active = true;
    for (const event of events) {
      if (event.type === 'enemy-defeated') {
        const stage = Math.max(1, Number(event.detail?.stage) || this.enemyIndex + 1);
        openCheckpoint(this, state, stage);
      } else if (event.type === 'victory' || event.type === 'defeat') {
        state.pending = false;
        state.resumePending = false;
        state.remainingMs = 0;
        if (pendingEngine === this) pendingEngine = null;
        renderHidden(state);
        event.detail = {
          ...(event.detail || {}),
          challengeTacticChoices: state.choicesMade,
        };
      }
    }
    return events;
  };

  ensureUi();
}

if (typeof document !== 'undefined') installChallengeTactics();
