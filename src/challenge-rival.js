import { CombatEngine } from './game-core.js';
import {
  CHALLENGE_ACTIVE,
  CHALLENGE_STAGE_COUNT,
  normaliseChallengeWaveScores,
  readChallengeBest,
} from './challenge-mode.js';

const installed = Symbol.for('blade-reversal.challenge-rival-v1');
const states = new WeakMap();

function stateFor(engine) {
  let state = states.get(engine);
  if (!state) {
    state = {
      active: false,
      terminal: false,
      previousBest: null,
      waveScores: [],
      lastStage: 0,
      lastDelta: null,
    };
    states.set(engine, state);
  }
  return state;
}

function boundedScore(value) {
  return Math.max(0, Math.round(Number(value) || 0));
}

function formatScore(value) {
  return boundedScore(value).toString().padStart(6, '0');
}

function formatDelta(value) {
  const delta = Math.round(Number(value) || 0);
  const sign = delta >= 0 ? '+' : '−';
  return `${sign}${Math.abs(delta).toString().padStart(5, '0')}`;
}

export function compareChallengePace(currentScore, bestScore) {
  const current = boundedScore(currentScore);
  const best = boundedScore(bestScore);
  return {
    current,
    best,
    delta: current - best,
    ahead: current >= best,
  };
}

function ensureStyles() {
  if (typeof document === 'undefined' || document.querySelector('style[data-challenge-rival]')) return;
  const style = document.createElement('style');
  style.dataset.challengeRival = 'true';
  style.textContent = `
    .challenge-rival{
      position:absolute;
      z-index:7;
      top:calc(var(--safe-top) + 68px);
      right:max(8px,var(--safe-right));
      width:max-content;
      max-width:132px;
      padding:5px 7px 6px;
      border:1px solid rgba(150,188,213,.24);
      border-radius:10px;
      background:rgba(13,23,29,.58);
      box-shadow:0 6px 18px rgba(0,0,0,.22);
      text-align:right;
      pointer-events:none;
      backdrop-filter:blur(5px);
    }
    .challenge-rival[hidden]{display:none}
    .challenge-rival strong{
      display:block;
      color:#c9dfeb;
      font-size:8.5px;
      line-height:1.05;
      letter-spacing:.06em;
      white-space:nowrap;
    }
    .challenge-rival span{
      display:block;
      margin-top:3px;
      color:rgba(222,235,240,.68);
      font-size:6.75px;
      line-height:1.15;
    }
    .challenge-rival[data-pace="ahead"]{border-color:rgba(125,201,161,.3);background:rgba(13,40,29,.56)}
    .challenge-rival[data-pace="behind"]{border-color:rgba(210,126,111,.3);background:rgba(49,24,22,.56)}
    @media(max-width:360px){
      .challenge-rival{top:calc(var(--safe-top) + 66px);max-width:120px;padding:4px 6px 5px}
      .challenge-rival strong{font-size:8px}
      .challenge-rival span{font-size:6.5px}
    }
  `;
  document.head.append(style);
}

function ensureUi() {
  if (typeof document === 'undefined') return null;
  ensureStyles();
  let panel = document.querySelector('#challenge-rival');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'challenge-rival';
    panel.className = 'challenge-rival';
    panel.hidden = true;
    panel.setAttribute('aria-live', 'polite');
    panel.setAttribute('aria-label', '連戰宿敵步速');
    panel.innerHTML = '<strong data-challenge-rival-title>宿敵</strong><span data-challenge-rival-copy>等待連戰</span>';
    (document.querySelector('#app') || document.body).append(panel);
  }
  return panel;
}

function renderHidden(state = null) {
  if (typeof document === 'undefined') return;
  const panel = ensureUi();
  if (panel) {
    panel.hidden = true;
    delete panel.dataset.pace;
  }
  const root = document.documentElement;
  root.dataset.challengeRivalActive = 'false';
  root.dataset.challengeRivalStage = '';
  root.dataset.challengeRivalDelta = '';
  if (!state?.active) root.dataset.challengeRivalHasSplits = 'false';
}

function renderStart(state) {
  if (typeof document === 'undefined' || !state?.active) return;
  const panel = ensureUi();
  if (!panel) return;
  const title = panel.querySelector('[data-challenge-rival-title]');
  const copy = panel.querySelector('[data-challenge-rival-copy]');
  const best = state.previousBest;
  const hasSplits = Array.isArray(best?.waveScores) && best.waveScores.length > 0;

  panel.hidden = false;
  delete panel.dataset.pace;
  if (best) {
    if (title) title.textContent = `宿敵 PB ${best.wavesCleared}/${CHALLENGE_STAGE_COUNT}`;
    if (copy) copy.textContent = hasSplits
      ? `總分 ${formatScore(best.score)} · 過關即對比`
      : `總分 ${formatScore(best.score)} · 新 BEST 建分段`;
  } else {
    if (title) title.textContent = '宿敵 · 首輪建立';
    if (copy) copy.textContent = '每關記錄今輪累積分數';
  }

  const root = document.documentElement;
  root.dataset.challengeRivalActive = 'true';
  root.dataset.challengeRivalHasSplits = String(hasSplits);
  root.dataset.challengeRivalStage = '0';
  root.dataset.challengeRivalDelta = '';
}

function renderStage(state, stage, score) {
  if (typeof document === 'undefined' || !state?.active) return;
  const panel = ensureUi();
  if (!panel) return;
  const title = panel.querySelector('[data-challenge-rival-title]');
  const copy = panel.querySelector('[data-challenge-rival-copy]');
  const bestSplit = state.previousBest?.waveScores?.[stage - 1];
  const current = boundedScore(score);

  panel.hidden = false;
  if (Number.isFinite(bestSplit)) {
    const pace = compareChallengePace(current, bestSplit);
    state.lastDelta = pace.delta;
    panel.dataset.pace = pace.ahead ? 'ahead' : 'behind';
    if (title) title.textContent = `宿敵 第${stage}關 · ${formatDelta(pace.delta)}`;
    if (copy) copy.textContent = `今輪 ${formatScore(pace.current)} · PB ${formatScore(pace.best)}`;
  } else {
    state.lastDelta = null;
    delete panel.dataset.pace;
    if (title) title.textContent = `宿敵 第${stage}關 · ${formatScore(current)}`;
    if (copy) copy.textContent = state.previousBest
      ? `PB ${state.previousBest.wavesCleared}/${CHALLENGE_STAGE_COUNT} · ${formatScore(state.previousBest.score)}`
      : '本輪建立首個分段紀錄';
  }

  const root = document.documentElement;
  root.dataset.challengeRivalStage = String(stage);
  root.dataset.challengeRivalDelta = Number.isFinite(state.lastDelta) ? String(state.lastDelta) : '';
}

function captureWaveScore(engine, state, stage, score = engine.score) {
  const safeStage = Math.max(1, Math.min(CHALLENGE_STAGE_COUNT, Math.floor(Number(stage) || 1)));
  const safeScore = boundedScore(score);
  state.waveScores[safeStage - 1] = safeScore;
  state.lastStage = Math.max(state.lastStage, safeStage);
  renderStage(state, safeStage, safeScore);
}

function attachTerminalSplits(engine, state, event) {
  const wavesCleared = Math.max(0, Math.min(CHALLENGE_STAGE_COUNT, Number(event.detail?.wavesCleared) || state.lastStage));
  if (event.type === 'victory' && wavesCleared === CHALLENGE_STAGE_COUNT) {
    captureWaveScore(engine, state, CHALLENGE_STAGE_COUNT, engine.score);
  }
  const waveScores = normaliseChallengeWaveScores(state.waveScores, wavesCleared);
  event.detail = {
    ...(event.detail || {}),
    challengeWaveScores: waveScores || undefined,
  };
  state.terminal = true;
  renderHidden(state);
}

export function installChallengeRival(Engine = CombatEngine) {
  if (!Engine?.prototype || Engine.prototype[installed]) return;
  const originalStart = Engine.prototype.start;
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.start = function challengeRivalStart(now = 0) {
    const result = originalStart.call(this, now);
    const state = stateFor(this);
    state.active = Boolean(this[CHALLENGE_ACTIVE]);
    state.terminal = false;
    state.previousBest = state.active ? readChallengeBest() : null;
    state.waveScores = [];
    state.lastStage = 0;
    state.lastDelta = null;
    if (state.active) renderStart(state);
    else renderHidden(state);
    return result;
  };

  Engine.prototype.drainEvents = function challengeRivalDrainEvents() {
    const events = originalDrainEvents.call(this);
    const state = stateFor(this);
    const active = Boolean(this[CHALLENGE_ACTIVE]);

    if (!active) {
      if (state.active || state.terminal) {
        state.active = false;
        state.terminal = false;
        state.previousBest = null;
        state.waveScores = [];
        state.lastStage = 0;
        state.lastDelta = null;
        renderHidden(state);
      }
      return events;
    }

    state.active = true;
    for (const event of events) {
      if (event.type === 'enemy-defeated') {
        const stage = Math.max(1, Number(event.detail?.stage) || this.enemyIndex + 1);
        captureWaveScore(this, state, stage, this.score);
      } else if (event.type === 'challenge-tactic') {
        const checkpoint = Math.max(1, Number(event.detail?.checkpoint) || state.lastStage);
        captureWaveScore(this, state, checkpoint, event.detail?.score ?? this.score);
      } else if (event.type === 'victory' || event.type === 'defeat') {
        attachTerminalSplits(this, state, event);
      }
    }
    return events;
  };

  ensureUi();
}

if (typeof document !== 'undefined') installChallengeRival();
