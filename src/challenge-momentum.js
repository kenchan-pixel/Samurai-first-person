import { CombatEngine } from './game-core.js';
import { CHALLENGE_ACTIVE } from './challenge-mode.js';

export const CHALLENGE_MOMENTUM_MAX = 2;
export const CHALLENGE_FULL_HP_SCORE_BONUS = 300;

const installed = Symbol.for('blade-reversal.challenge-momentum-v1');
const states = new WeakMap();

function stateFor(engine) {
  let state = states.get(engine);
  if (!state) {
    state = {
      active: false,
      momentum: 0,
      cleanWaves: 0,
      rallies: 0,
      hitThisWave: false,
    };
    states.set(engine, state);
  }
  return state;
}

export function resolveChallengeMomentum({
  momentum = 0,
  hitThisWave = false,
  playerHp = 0,
  playerMaxHp = 0,
  score = 0,
} = {}) {
  const boundedMomentum = Math.max(0, Math.min(CHALLENGE_MOMENTUM_MAX, Math.round(Number(momentum) || 0)));
  const hp = Math.max(0, Number(playerHp) || 0);
  const maxHp = Math.max(hp, Number(playerMaxHp) || 0);
  const currentScore = Math.max(0, Math.round(Number(score) || 0));

  if (hitThisWave) {
    return {
      clean: false,
      momentum: 0,
      reward: null,
      amount: 0,
      playerHp: hp,
      score: currentScore,
    };
  }

  const nextMomentum = boundedMomentum + 1;
  if (nextMomentum < CHALLENGE_MOMENTUM_MAX) {
    return {
      clean: true,
      momentum: nextMomentum,
      reward: null,
      amount: 0,
      playerHp: hp,
      score: currentScore,
    };
  }

  if (hp < maxHp) {
    const healedHp = Math.min(maxHp, hp + 1);
    return {
      clean: true,
      momentum: 0,
      reward: 'heal',
      amount: healedHp - hp,
      playerHp: healedHp,
      score: currentScore,
    };
  }

  return {
    clean: true,
    momentum: 0,
    reward: 'score',
    amount: CHALLENGE_FULL_HP_SCORE_BONUS,
    playerHp: hp,
    score: currentScore + CHALLENGE_FULL_HP_SCORE_BONUS,
  };
}

function ensureStyles() {
  if (typeof document === 'undefined' || document.querySelector('style[data-challenge-momentum]')) return;
  const style = document.createElement('style');
  style.dataset.challengeMomentum = 'true';
  style.textContent = `
    .challenge-momentum{
      position:absolute;
      z-index:7;
      top:calc(var(--safe-top) + 42px);
      left:50%;
      width:max-content;
      max-width:58vw;
      padding:4px 8px 5px;
      transform:translateX(-50%);
      border:1px solid rgba(228,182,107,.28);
      border-radius:999px;
      background:rgba(28,20,13,.58);
      box-shadow:0 6px 18px rgba(0,0,0,.24);
      text-align:center;
      pointer-events:none;
      backdrop-filter:blur(5px);
    }
    .challenge-momentum[hidden]{display:none}
    .challenge-momentum strong{
      display:block;
      color:#f1d59f;
      font-size:8.5px;
      line-height:1;
      letter-spacing:.08em;
      white-space:nowrap;
    }
    .challenge-momentum span{
      display:block;
      margin-top:3px;
      color:rgba(244,232,210,.68);
      font-size:7px;
      line-height:1.08;
      white-space:nowrap;
    }
    @media(max-width:360px){
      .challenge-momentum{top:calc(var(--safe-top) + 40px);max-width:62vw;padding:4px 7px}
      .challenge-momentum strong{font-size:8px}
      .challenge-momentum span{font-size:6.75px}
    }
  `;
  document.head.append(style);
}

function ensureUi() {
  if (typeof document === 'undefined') return null;
  ensureStyles();

  let panel = document.querySelector('#challenge-momentum');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'challenge-momentum';
    panel.className = 'challenge-momentum';
    panel.hidden = true;
    panel.setAttribute('aria-live', 'polite');
    panel.setAttribute('aria-label', '連戰氣勢');
    panel.innerHTML = '<strong data-challenge-momentum-pips>氣勢 ◇◇</strong><span data-challenge-momentum-copy>連續兩關無傷觸發不屈</span>';
    (document.querySelector('#app') || document.body).append(panel);
  }

  const challengeButton = document.querySelector('#challenge-button small');
  if (challengeButton) challengeButton.textContent = '八關 · 無傷聚氣';
  return panel;
}

function renderMomentum(state, copy = '連續兩關無傷觸發不屈') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const panel = ensureUi();
  const active = Boolean(state?.active);

  root.dataset.challengeMomentum = String(active ? state.momentum : 0);
  root.dataset.challengeRallies = String(active ? state.rallies : 0);
  root.dataset.challengeCleanWaves = String(active ? state.cleanWaves : 0);
  if (!panel) return;

  panel.hidden = !active;
  if (!active) return;

  const filled = '◆'.repeat(state.momentum);
  const empty = '◇'.repeat(Math.max(0, CHALLENGE_MOMENTUM_MAX - state.momentum));
  const pips = panel.querySelector('[data-challenge-momentum-pips]');
  const message = panel.querySelector('[data-challenge-momentum-copy]');
  if (pips) pips.textContent = `氣勢 ${filled}${empty}`;
  if (message) message.textContent = copy;
}

function applyWaveClear(engine, state) {
  const resolved = resolveChallengeMomentum({
    momentum: state.momentum,
    hitThisWave: state.hitThisWave,
    playerHp: engine.playerHp,
    playerMaxHp: engine.playerMaxHp,
    score: engine.score,
  });

  state.momentum = resolved.momentum;
  if (resolved.clean) state.cleanWaves += 1;
  if (resolved.reward) state.rallies += 1;
  engine.playerHp = resolved.playerHp;
  engine.score = resolved.score;

  if (!resolved.clean) {
    renderMomentum(state, '受創過關 · 下一關重新聚氣');
    return null;
  }

  if (resolved.reward === 'heal') {
    renderMomentum(state, `不屈 · 回復 ${resolved.amount} 生命`);
  } else if (resolved.reward === 'score') {
    renderMomentum(state, `不屈 · 滿血 +${resolved.amount} 分`);
  } else {
    renderMomentum(state, '無傷過關 · 再一關觸發不屈');
  }

  if (!resolved.reward) return null;
  return {
    type: 'challenge-rally',
    detail: {
      reward: resolved.reward,
      amount: resolved.amount,
      playerHp: engine.playerHp,
      score: engine.score,
      cleanWaves: state.cleanWaves,
      rallies: state.rallies,
    },
  };
}

function appendTerminalSummary(state) {
  if (typeof document === 'undefined') return;
  const rallies = state.rallies;
  const cleanWaves = state.cleanWaves;
  queueMicrotask(() => {
    const progress = document.querySelector('[data-challenge-progress]');
    if (progress && progress.dataset.momentumSummary !== 'true') {
      progress.dataset.momentumSummary = 'true';
      progress.textContent = `${progress.textContent} · 不屈×${rallies}`;
    }
    const panel = document.querySelector('#challenge-momentum');
    if (panel) panel.hidden = true;
    document.documentElement.dataset.challengeMomentumSummary = `${cleanWaves}:${rallies}`;
  });
}

export function installChallengeMomentum(Engine = CombatEngine) {
  if (!Engine?.prototype || Engine.prototype[installed]) return;
  const originalStart = Engine.prototype.start;
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.start = function challengeMomentumStart(now = 0) {
    const result = originalStart.call(this, now);
    const state = stateFor(this);
    state.active = Boolean(this[CHALLENGE_ACTIVE]);
    state.momentum = 0;
    state.cleanWaves = 0;
    state.rallies = 0;
    state.hitThisWave = false;
    renderMomentum(state);
    return result;
  };

  Engine.prototype.drainEvents = function challengeMomentumDrainEvents() {
    const events = originalDrainEvents.call(this);
    const state = stateFor(this);
    const active = Boolean(this[CHALLENGE_ACTIVE]);

    if (!active) {
      if (state.active) {
        state.active = false;
        state.momentum = 0;
        state.cleanWaves = 0;
        state.rallies = 0;
        state.hitThisWave = false;
        renderMomentum(state);
      }
      return events;
    }

    state.active = true;
    const extraEvents = [];

    for (const event of events) {
      if (event.type === 'stage-start') {
        state.hitThisWave = false;
      } else if (event.type === 'player-hit') {
        if (!state.hitThisWave) {
          state.hitThisWave = true;
          state.momentum = 0;
          renderMomentum(state, '受創 · 氣勢中斷');
        }
      } else if (event.type === 'enemy-defeated') {
        const rally = applyWaveClear(this, state);
        if (rally) extraEvents.push(rally);
      } else if (event.type === 'victory' || event.type === 'defeat') {
        event.detail = {
          ...(event.detail || {}),
          challengeCleanWaves: state.cleanWaves,
          challengeRallies: state.rallies,
        };
        appendTerminalSummary(state);
      }
    }

    return extraEvents.length ? [...events, ...extraEvents] : events;
  };

  ensureUi();
}

if (typeof document !== 'undefined') {
  installChallengeMomentum();
}
