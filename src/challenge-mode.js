import { CombatEngine, ENEMIES } from './game-core.js';
import { BOSS_ID, BOSS_PHASE_ONE } from './boss-encounter.js';
import { requestPractice } from './practice-mode.js';

export const CHALLENGE_ACTIVE = Symbol.for('blade-reversal.challenge-active-v1');
export const CHALLENGE_STORAGE_KEY = 'blade-reversal-challenge-v1';
export const CHALLENGE_STAGE_COUNT = 8;

const installed = Symbol.for('blade-reversal.challenge-mode-v1');
const states = new WeakMap();
let requestedChallenge = false;
let challengeLaunchArmed = false;

function boundedMs(value, floor) {
  return Math.max(floor, Math.round(value));
}

function pressureEnemy(base, spec) {
  const attacks = Object.freeze(base.attacks.map((attack) => Object.freeze({
    ...attack,
    telegraphMs: boundedMs(attack.telegraphMs * spec.telegraphScale, 320),
    strikeMs: boundedMs(attack.strikeMs * spec.strikeScale, 120),
  })));

  return Object.freeze({
    ...base,
    name: spec.name,
    title: spec.title,
    maxHp: spec.maxHp,
    postureMax: spec.postureMax,
    gapMs: boundedMs(base.gapMs * spec.gapScale, 300),
    recoveryMs: boundedMs(base.recoveryMs * spec.recoveryScale, 520),
    perfectWindowMs: boundedMs(base.perfectWindowMs * spec.perfectScale, 58),
    attacks,
  });
}

const [ASHIGARU, RONIN, ONI] = ENEMIES;
const CHALLENGE_ROSTER = Object.freeze([
  ASHIGARU,
  RONIN,
  ONI,
  pressureEnemy(ASHIGARU, {
    name: 'Ashigaru Vanguard',
    title: 'Trial IV · Reed Storm',
    maxHp: 4,
    postureMax: 4,
    gapScale: 0.9,
    recoveryScale: 0.92,
    perfectScale: 0.94,
    telegraphScale: 0.92,
    strikeScale: 0.96,
  }),
  pressureEnemy(RONIN, {
    name: 'Moonlit Ronin',
    title: 'Trial V · False Moon',
    maxHp: 6,
    postureMax: 5,
    gapScale: 0.86,
    recoveryScale: 0.9,
    perfectScale: 0.92,
    telegraphScale: 0.9,
    strikeScale: 0.94,
  }),
  pressureEnemy(ONI, {
    name: 'Oni Executioner',
    title: 'Trial VI · Iron Gate',
    maxHp: 9,
    postureMax: 6,
    gapScale: 0.84,
    recoveryScale: 0.88,
    perfectScale: 0.9,
    telegraphScale: 0.88,
    strikeScale: 0.93,
  }),
  pressureEnemy(RONIN, {
    name: 'Ronin Master',
    title: 'Trial VII · Last Feint',
    maxHp: 7,
    postureMax: 6,
    gapScale: 0.76,
    recoveryScale: 0.82,
    perfectScale: 0.86,
    telegraphScale: 0.82,
    strikeScale: 0.9,
  }),
  BOSS_PHASE_ONE,
]);

export function createChallengeEnemies() {
  return [...CHALLENGE_ROSTER];
}

export function isBetterChallengeResult(next, previous) {
  if (!next) return false;
  if (!previous) return true;
  const nextCleared = Math.max(0, Number(next.wavesCleared) || 0);
  const previousCleared = Math.max(0, Number(previous.wavesCleared) || 0);
  if (nextCleared !== previousCleared) return nextCleared > previousCleared;
  if (Boolean(next.won) !== Boolean(previous.won)) return Boolean(next.won);
  return Math.max(0, Number(next.score) || 0) > Math.max(0, Number(previous.score) || 0);
}

export function normaliseChallengeWaveScores(value, wavesCleared = CHALLENGE_STAGE_COUNT) {
  if (!Array.isArray(value)) return null;
  const cleared = Math.max(0, Math.min(CHALLENGE_STAGE_COUNT, Math.floor(Number(wavesCleared) || 0)));
  const count = Math.min(cleared, value.length);
  if (count <= 0) return null;

  const scores = [];
  let previous = 0;
  for (let index = 0; index < count; index += 1) {
    const numeric = Number(value[index]);
    if (!Number.isFinite(numeric) || numeric < 0) return null;
    const score = Math.max(0, Math.round(numeric));
    if (index > 0 && score < previous) return null;
    scores.push(score);
    previous = score;
  }
  return scores;
}

export function readChallengeBest(storage = undefined) {
  try {
    const target = storage ?? globalThis.localStorage;
    const value = JSON.parse(target?.getItem?.(CHALLENGE_STORAGE_KEY) || 'null');
    if (!value || !Number.isFinite(value.score) || !Number.isFinite(value.wavesCleared)) return null;
    const best = {
      won: Boolean(value.won),
      wavesCleared: Math.max(0, Math.min(CHALLENGE_STAGE_COUNT, Math.floor(Number(value.wavesCleared) || 0))),
      score: Math.max(0, Math.round(Number(value.score) || 0)),
    };
    const waveScores = normaliseChallengeWaveScores(value.waveScores, best.wavesCleared);
    if (waveScores) best.waveScores = waveScores;
    return best;
  } catch {
    return null;
  }
}

function writeBest(result, storage = undefined) {
  try {
    const target = storage ?? globalThis.localStorage;
    const wavesCleared = Math.max(0, Math.min(CHALLENGE_STAGE_COUNT, Math.floor(Number(result.wavesCleared) || 0)));
    const best = {
      won: Boolean(result.won),
      wavesCleared,
      score: Math.max(0, Math.round(Number(result.score) || 0)),
    };
    const waveScores = normaliseChallengeWaveScores(result.waveScores, wavesCleared);
    if (waveScores) best.waveScores = waveScores;
    target?.setItem?.(CHALLENGE_STORAGE_KEY, JSON.stringify(best));
  } catch {
    // Challenge remains fully playable if local storage is unavailable.
  }
}

export function persistChallengeResult(result, storage = undefined) {
  const previousBest = readChallengeBest(storage);
  const better = isBetterChallengeResult(result, previousBest);
  if (better) writeBest(result, storage);
  return better ? result : previousBest;
}

function formatScore(value) {
  return Math.max(0, Math.round(Number(value) || 0)).toString().padStart(6, '0');
}

function ensureStyles() {
  if (document.querySelector('style[data-challenge-mode]')) return;
  const style = document.createElement('style');
  style.dataset.challengeMode = 'true';
  style.textContent = `
    .practice-row{grid-template-columns:repeat(3,minmax(0,1fr))!important}
    .practice-button--challenge{border-color:rgba(214,170,93,.38);background:rgba(94,58,24,.22);color:#f2d8a7}
    .practice-button--challenge strong{letter-spacing:.08em}
    .challenge-result{width:min(100%,330px);margin:7px auto 0;padding:7px 9px;border:1px solid rgba(228,182,107,.24);border-radius:11px;background:rgba(57,31,12,.25);display:flex;align-items:center;justify-content:space-between;gap:8px;text-align:left}
    .challenge-result[hidden]{display:none}
    .challenge-result strong{font-size:10.5px;letter-spacing:.08em;color:#f1d59f}
    .challenge-result span{font-size:10px;color:rgba(244,232,210,.7);text-align:right}
    .challenge-campaign-button{margin-top:7px!important;background:rgba(255,255,255,.035)!important;border-color:rgba(255,255,255,.14)!important;color:rgba(244,240,231,.8)!important}
    .challenge-campaign-button[hidden]{display:none}
    html[data-run-mode="challenge"] .result-analysis{margin-top:6px;padding:6px}
    html[data-run-mode="challenge"] .result-analysis__grid{gap:4px;margin-top:5px}
    html[data-run-mode="challenge"] .result-analysis__stage{padding:4px 5px}
    html[data-run-mode="challenge"] .result-analysis__stage strong{font-size:10px}
    html[data-run-mode="challenge"] .result-analysis__stage span{margin-top:1px;font-size:9px;line-height:1.2}
    html[data-run-mode="challenge"] .result-analysis__tip{margin-top:5px!important;font-size:10px!important;line-height:1.25!important}
    html[data-run-mode="challenge"] .modal__content--result h2{font-size:32px}
    html[data-run-mode="challenge"] .modal__content--result>#result-summary{margin-top:5px;font-size:10px;line-height:1.25}
    html[data-run-mode="challenge"] .modal__content--result .result-score{margin-top:6px}
    html[data-run-mode="challenge"] .modal__content--result .primary-button{margin-top:7px}
    @media(max-width:360px){.practice-button{padding-inline:4px!important}.practice-button strong{font-size:9.25px!important}.practice-button small{font-size:8px!important}.challenge-result{padding:6px 8px}}
    @media(max-width:360px) and (max-height:620px){
      html[data-run-mode="challenge"] .modal__content--result h2{margin-top:5px;font-size:28px;line-height:1}
      html[data-run-mode="challenge"] .modal__content--result>#result-summary{margin-top:4px;font-size:9.5px;line-height:1.2}
      html[data-run-mode="challenge"] .modal__content--result .result-score{margin-top:4px}
      html[data-run-mode="challenge"] .modal__content--result .result-score strong{font-size:20px}
      html[data-run-mode="challenge"] .result-analysis{margin-top:4px;padding:5px}
      html[data-run-mode="challenge"] .result-analysis__head strong{font-size:9.5px}
      html[data-run-mode="challenge"] .result-analysis__grid{gap:3px;margin-top:4px}
      html[data-run-mode="challenge"] .result-analysis__stage{padding:3px 4px}
      html[data-run-mode="challenge"] .result-analysis__stage strong{font-size:9px}
      html[data-run-mode="challenge"] .result-analysis__stage span{font-size:8px;line-height:1.1}
      html[data-run-mode="challenge"] .result-analysis__tip{margin-top:4px!important;font-size:9px!important;line-height:1.15!important}
      html[data-run-mode="challenge"] .challenge-result{margin-top:4px;padding:4px 7px}
      html[data-run-mode="challenge"] .challenge-result strong{font-size:9.5px}
      html[data-run-mode="challenge"] .challenge-result span{font-size:9px}
      html[data-run-mode="challenge"] .modal__content--result .primary-button{min-height:36px;margin-top:4px!important;font-size:11px}
    }
  `;
  document.head.append(style);
}

function ensureUi() {
  const row = document.querySelector('#practice-row');
  const startButton = document.querySelector('#start-button');
  const restartButton = document.querySelector('#restart-button');
  if (!row || !startButton || !restartButton) return null;

  let challengeButton = document.querySelector('#challenge-button');
  if (!challengeButton) {
    challengeButton = document.createElement('button');
    challengeButton.id = 'challenge-button';
    challengeButton.type = 'button';
    challengeButton.className = 'practice-button practice-button--challenge';
    challengeButton.innerHTML = '<strong>連戰試煉</strong><small>八關 · 壓力遞增</small>';
    challengeButton.setAttribute('aria-label', '開始八關連戰試煉');
    row.append(challengeButton);
  }
  row.setAttribute('aria-label', '指定決鬥及連戰模式');

  let result = document.querySelector('#challenge-result');
  if (!result) {
    result = document.createElement('div');
    result.id = 'challenge-result';
    result.className = 'challenge-result';
    result.hidden = true;
    result.innerHTML = '<strong data-challenge-progress></strong><span data-challenge-best></span>';
    restartButton.insertAdjacentElement('beforebegin', result);
  }

  let campaignButton = document.querySelector('#challenge-campaign-button');
  if (!campaignButton) {
    campaignButton = document.createElement('button');
    campaignButton.id = 'challenge-campaign-button';
    campaignButton.type = 'button';
    campaignButton.className = 'primary-button challenge-campaign-button';
    campaignButton.textContent = '開始完整主線';
    campaignButton.hidden = true;
    restartButton.insertAdjacentElement('afterend', campaignButton);
  }

  return { row, startButton, restartButton, challengeButton, result, campaignButton };
}

function renderModeUi(state, terminal = false) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const ui = ensureUi();
  const active = Boolean(state?.active);
  root.dataset.challengeActive = active ? 'true' : 'false';
  if (active) {
    root.dataset.runMode = 'challenge';
    root.dataset.challengeStageCount = String(CHALLENGE_STAGE_COUNT);
  }
  if (!ui) return;
  ui.restartButton.textContent = active && terminal ? '再戰連陣' : '重新挑戰';
  ui.result.hidden = !(active && terminal);
  ui.campaignButton.hidden = !(active && terminal);
}

function renderChallengeResult(state, detail = {}) {
  if (typeof document === 'undefined' || !state?.active) return;
  const ui = ensureUi();
  if (!ui) return;

  const wavesCleared = Math.min(CHALLENGE_STAGE_COUNT, Math.max(0, state.wavesCleared));
  const result = {
    won: Boolean(detail.won),
    wavesCleared,
    score: Math.max(0, Math.round(Number(detail.score) || 0)),
  };
  const waveScores = normaliseChallengeWaveScores(detail.waveScores, wavesCleared);
  if (waveScores) result.waveScores = waveScores;
  const best = persistChallengeResult(result);

  const progress = ui.result.querySelector('[data-challenge-progress]');
  const bestNode = ui.result.querySelector('[data-challenge-best]');
  if (progress) progress.textContent = result.won ? `連戰 ${CHALLENGE_STAGE_COUNT}/${CHALLENGE_STAGE_COUNT} · 制霸` : `連戰 ${result.wavesCleared}/${CHALLENGE_STAGE_COUNT}`;
  if (bestNode) bestNode.textContent = best ? `BEST ${best.wavesCleared}/${CHALLENGE_STAGE_COUNT} · ${formatScore(best.score)}` : `SCORE ${formatScore(result.score)}`;

  ui.result.hidden = false;
  ui.campaignButton.hidden = false;
  ui.restartButton.textContent = '再戰連陣';
  document.documentElement.dataset.challengeResult = result.won ? 'victory' : 'defeat';
}

function markStartLayout() {
  if (typeof requestAnimationFrame !== 'function') return;
  requestAnimationFrame(() => {
    const content = document.querySelector('#start-screen .modal__content');
    const row = document.querySelector('#practice-row');
    const buttons = [...(row?.querySelectorAll('.practice-button') || [])];
    if (!content || !row || buttons.length < 3) return;
    const nodes = [content, row, ...buttons];
    const fits = nodes.every((node) => {
      const rect = node.getBoundingClientRect();
      return rect.left >= -0.5 && rect.right <= innerWidth + 0.5 && rect.top >= -0.5 && rect.bottom <= innerHeight + 0.5;
    });
    const result = fits ? 'pass' : 'fail';
    document.documentElement.dataset.challengeStartLayout = result;
    document.documentElement.dataset.practiceStartLayout = result;
  });
}

export function requestChallenge(enabled = true) {
  requestedChallenge = Boolean(enabled);
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.nextRunMode = requestedChallenge ? 'challenge' : 'campaign';
  }
}

export function installChallengeMode(Engine = CombatEngine) {
  if (!Engine?.prototype || Engine.prototype[installed]) return;
  const originalStart = Engine.prototype.start;
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.start = function challengeStart(now = 0) {
    let state = states.get(this);
    if (!state) {
      state = { active: false, baselineEnemies: [...this.enemies], stage: 1, wavesCleared: 0 };
      states.set(this, state);
    }

    if (requestedChallenge) {
      if (!state.active) state.baselineEnemies = [...this.enemies];
      this.enemies = createChallengeEnemies();
    } else if (state.active) {
      this.enemies = [...state.baselineEnemies];
    }

    this[CHALLENGE_ACTIVE] = requestedChallenge;
    state.active = requestedChallenge;
    state.stage = 1;
    state.wavesCleared = 0;
    const result = originalStart.call(this, now);
    renderModeUi(state, false);
    return result;
  };

  Engine.prototype.drainEvents = function challengeDrainEvents() {
    const events = originalDrainEvents.call(this);
    const state = states.get(this);
    if (!state?.active) return events;

    for (const event of events) {
      if (event.type === 'stage-start') {
        state.stage = Math.max(1, Number(event.detail?.stage) || state.stage);
      } else if (event.type === 'enemy-defeated') {
        state.wavesCleared = Math.max(state.wavesCleared, Math.max(1, Number(event.detail?.stage) || state.stage));
      } else if (event.type === 'victory' || event.type === 'defeat') {
        const won = event.type === 'victory';
        if (won) state.wavesCleared = CHALLENGE_STAGE_COUNT;
        event.detail = {
          ...(event.detail || {}),
          challenge: true,
          challengeStage: state.stage,
          wavesCleared: state.wavesCleared,
        };
        const terminalEvent = event;
        queueMicrotask(() => {
          renderModeUi(state, true);
          renderChallengeResult(state, {
            won,
            score: terminalEvent.detail?.score,
            waveScores: terminalEvent.detail?.challengeWaveScores,
          });
        });
      }
    }
    return events;
  };
}

function installChallengeUi() {
  if (typeof document === 'undefined') return;
  ensureStyles();
  const ui = ensureUi();
  if (!ui) return;

  if (ui.challengeButton.dataset.challengeBound !== 'true') {
    ui.challengeButton.dataset.challengeBound = 'true';
    ui.challengeButton.addEventListener('click', () => {
      requestPractice(null);
      requestChallenge(true);
      challengeLaunchArmed = true;
      ui.startButton.click();
    });
  }

  if (ui.startButton.dataset.challengeResetBound !== 'true') {
    ui.startButton.dataset.challengeResetBound = 'true';
    ui.startButton.addEventListener('click', () => {
      if (challengeLaunchArmed) {
        challengeLaunchArmed = false;
        return;
      }
      requestChallenge(false);
    });
  }

  if (ui.campaignButton.dataset.challengeCampaignBound !== 'true') {
    ui.campaignButton.dataset.challengeCampaignBound = 'true';
    ui.campaignButton.addEventListener('click', () => {
      requestChallenge(false);
      requestPractice(null);
      ui.restartButton.click();
    });
  }

  renderModeUi({ active: false }, false);
  document.documentElement.dataset.challengeModeReady = 'true';
  markStartLayout();
}

if (typeof document !== 'undefined') {
  installChallengeMode();
  installChallengeUi();
}

export { BOSS_ID };