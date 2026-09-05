import { CombatEngine } from './game-core.js';
import {
  CHALLENGE_ACTIVE,
  CHALLENGE_STAGE_COUNT,
  createChallengeEnemies,
} from './challenge-mode.js';

export const DAILY_CHALLENGE_ACTIVE = Symbol.for('blade-reversal.daily-challenge-active-v1');
export const DAILY_CHALLENGE_VERSION = 1;

const installed = Symbol.for('blade-reversal.daily-challenge-v1');
const states = new WeakMap();
let requestedDaily = false;
let requestedDateKey = null;
let dailyProxyClick = false;
let dailyLaunchArmed = false;

const ROMAN = Object.freeze(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']);

function pad2(value) {
  return String(value).padStart(2, '0');
}

export function dailyChallengeDateKey(value = new Date()) {
  if (typeof value === 'string') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new TypeError('Daily challenge date key must be YYYY-MM-DD.');
    return value;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new TypeError('Daily challenge requires a valid date.');
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function dailyChallengeSeed(dateKey) {
  const key = dailyChallengeDateKey(dateKey);
  let hash = 2166136261;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function nextSeed(seed) {
  return (Math.imul(seed >>> 0, 1664525) + 1013904223) >>> 0;
}

function permutation(size, seed) {
  const values = Array.from({ length: size }, (_, index) => index);
  let state = seed >>> 0;
  for (let index = values.length - 1; index > 0; index -= 1) {
    state = nextSeed(state);
    const pick = state % (index + 1);
    [values[index], values[pick]] = [values[pick], values[index]];
  }
  return values;
}

function rotateAttacks(attacks, seed) {
  if (!Array.isArray(attacks) || attacks.length < 2) return Object.freeze([...(attacks || [])]);
  const offset = seed % attacks.length;
  if (offset === 0) return Object.freeze([...attacks]);
  return Object.freeze([...attacks.slice(offset), ...attacks.slice(0, offset)]);
}

function dailyEnemy(enemy, stageNumber, seed) {
  const suffix = String(enemy.title || enemy.name || 'Trial').split('·').at(-1)?.trim() || enemy.name;
  return Object.freeze({
    ...enemy,
    title: `今日陣 ${ROMAN[stageNumber - 1] || stageNumber} · ${suffix}`,
    attacks: rotateAttacks(enemy.attacks, seed),
  });
}

export function createDailyChallengeEnemies(dateKey = dailyChallengeDateKey()) {
  const key = dailyChallengeDateKey(dateKey);
  const base = createChallengeEnemies();
  if (base.length !== CHALLENGE_STAGE_COUNT) return base;

  const seed = dailyChallengeSeed(key);
  const pressurePool = base.slice(3, 6);
  const order = permutation(pressurePool.length, seed);
  const pressure = order.map((index, offset) => {
    const stageNumber = 4 + offset;
    const enemySeed = nextSeed(seed + stageNumber * 97 + index * 31);
    return dailyEnemy(pressurePool[index], stageNumber, enemySeed);
  });
  const master = dailyEnemy(base[6], 7, nextSeed(seed ^ 0x7f4a7c15));

  // Keep the outer roster mutable: the existing boss adapter may replace the
  // final enemy definition during Blood Moon. Individual daily variants stay frozen.
  return [
    ...base.slice(0, 3),
    ...pressure,
    master,
    base[7],
  ];
}

function formatShortDate(dateKey) {
  const key = dailyChallengeDateKey(dateKey);
  return `${key.slice(5, 7)}/${key.slice(8, 10)}`;
}

function ensureStyles() {
  if (typeof document === 'undefined' || document.querySelector('style[data-daily-challenge]')) return;
  const style = document.createElement('style');
  style.dataset.dailyChallenge = 'true';
  style.textContent = `
    .practice-row{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:4px!important}
    .practice-row .practice-button{padding-inline:3px!important}
    .practice-row .practice-button span,.practice-row .practice-button small{font-size:6.6px!important;white-space:nowrap}
    .practice-button--daily{border-color:rgba(126,202,180,.38)!important;background:rgba(29,86,73,.2)!important;color:#ccefe4!important}
    .practice-button--daily strong{display:block;font-size:9px;letter-spacing:.08em;white-space:nowrap}
    .daily-challenge-banner{position:absolute;z-index:7;top:calc(var(--safe-top) + 66px);left:50%;width:max-content;max-width:72vw;padding:5px 9px;transform:translateX(-50%);border:1px solid rgba(126,202,180,.26);border-radius:999px;background:rgba(14,42,36,.7);box-shadow:0 6px 18px rgba(0,0,0,.22);color:#d8f6ee;font-size:8px;font-weight:800;letter-spacing:.05em;pointer-events:none;backdrop-filter:blur(5px)}
    .daily-challenge-banner[hidden]{display:none}
    @media(max-width:360px){.practice-row .practice-button{font-size:8.5px!important}.practice-button--daily strong{font-size:8.5px}.daily-challenge-banner{top:calc(var(--safe-top) + 64px);font-size:7.5px;padding:4px 8px}}
  `;
  document.head.append(style);
}

function ensureUi() {
  if (typeof document === 'undefined') return null;
  ensureStyles();
  const row = document.querySelector('#practice-row');
  const challengeButton = document.querySelector('#challenge-button');
  const startButton = document.querySelector('#start-button');
  if (!row || !challengeButton || !startButton) return null;

  let dailyButton = document.querySelector('#daily-challenge-button');
  if (!dailyButton) {
    dailyButton = document.createElement('button');
    dailyButton.id = 'daily-challenge-button';
    dailyButton.type = 'button';
    dailyButton.className = 'practice-button practice-button--daily';
    dailyButton.innerHTML = '<strong>今日陣</strong><small>每日固定刀序</small>';
    dailyButton.setAttribute('aria-label', '開始今日固定刀序連戰');
    row.append(dailyButton);
  }
  row.setAttribute('aria-label', '指定決鬥、連戰及今日陣');

  let banner = document.querySelector('#daily-challenge-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'daily-challenge-banner';
    banner.className = 'daily-challenge-banner';
    banner.hidden = true;
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', '今日陣狀態');
    (document.querySelector('#app') || document.body).append(banner);
  }

  return { row, challengeButton, startButton, dailyButton, banner };
}

function renderDailyState(active, dateKey = null) {
  if (typeof document === 'undefined') return;
  const ui = ensureUi();
  const root = document.documentElement;
  root.dataset.dailyChallengeActive = String(Boolean(active));
  if (!active) {
    delete root.dataset.dailyChallengeKey;
    if (ui?.banner) ui.banner.hidden = true;
    return;
  }
  const key = dailyChallengeDateKey(dateKey || requestedDateKey || new Date());
  root.dataset.dailyChallengeKey = key;
  if (ui?.banner) {
    ui.banner.textContent = `今日陣 ${formatShortDate(key)} · 今日刀序已鎖定`;
    ui.banner.hidden = false;
  }
}

function markStartLayout() {
  if (typeof document === 'undefined' || typeof requestAnimationFrame !== 'function') return;
  requestAnimationFrame(() => {
    const content = document.querySelector('#start-screen .modal__content');
    const row = document.querySelector('#practice-row');
    const buttons = [...(row?.querySelectorAll('.practice-button') || [])];
    if (!content || !row || buttons.length < 5) return;
    const fits = [content, row, ...buttons].every((node) => {
      const rect = node.getBoundingClientRect();
      return rect.left >= -0.5 && rect.right <= innerWidth + 0.5 && rect.top >= -0.5 && rect.bottom <= innerHeight + 0.5;
    });
    document.documentElement.dataset.dailyChallengeStartLayout = fits ? 'pass' : 'fail';
  });
}

export function requestDailyChallenge(enabled = true, dateKey = undefined) {
  requestedDaily = Boolean(enabled);
  requestedDateKey = requestedDaily ? dailyChallengeDateKey(dateKey ?? new Date()) : null;
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.nextChallengeVariant = requestedDaily ? 'daily' : 'standard';
  }
  return requestedDaily;
}

export function installDailyChallenge(Engine = CombatEngine) {
  if (!Engine?.prototype || Engine.prototype[installed]) return;
  const originalStart = Engine.prototype.start;
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.start = function dailyChallengeStart(now = 0) {
    const result = originalStart.call(this, now);
    const active = Boolean(this[CHALLENGE_ACTIVE] && requestedDaily);
    const dateKey = active ? dailyChallengeDateKey(requestedDateKey || new Date()) : null;
    this[DAILY_CHALLENGE_ACTIVE] = active;
    states.set(this, { active, dateKey, stage: 1 });

    if (active) {
      const dailyRoster = createDailyChallengeEnemies(dateKey);
      if (dailyRoster.length === this.enemies.length && dailyRoster[0]?.id === this.enemy?.id) {
        this.enemies = dailyRoster;
      }
    }
    renderDailyState(active, dateKey);
    return result;
  };

  Engine.prototype.drainEvents = function dailyChallengeDrainEvents() {
    const events = originalDrainEvents.call(this);
    const state = states.get(this);
    if (!state?.active) return events;

    for (const event of events) {
      if (event.type === 'stage-start') {
        state.stage = Math.max(1, Number(event.detail?.stage) || state.stage);
        event.detail = { ...(event.detail || {}), dailyChallenge: true, dailyChallengeKey: state.dateKey };
      }
      if (event.type === 'telegraph' && state.stage === 1) {
        const ui = ensureUi();
        if (ui?.banner) ui.banner.hidden = true;
      }
      if (event.type === 'victory' || event.type === 'defeat') {
        event.detail = { ...(event.detail || {}), dailyChallenge: true, dailyChallengeKey: state.dateKey };
        if (typeof document !== 'undefined') {
          const key = state.dateKey;
          queueMicrotask(() => {
            const progress = document.querySelector('[data-challenge-progress]');
            if (progress && progress.dataset.dailySummary !== 'true') {
              progress.dataset.dailySummary = 'true';
              progress.textContent = `${progress.textContent} · 今日陣 ${formatShortDate(key)}`;
            }
            renderDailyState(false);
          });
        }
      }
    }
    return events;
  };
}

function installDailyUi() {
  if (typeof document === 'undefined') return;
  const ui = ensureUi();
  if (!ui) return;

  if (ui.challengeButton.dataset.dailyResetBound !== 'true') {
    ui.challengeButton.dataset.dailyResetBound = 'true';
    ui.challengeButton.addEventListener('click', () => {
      if (!dailyProxyClick) requestDailyChallenge(false);
    }, { capture: true });
  }

  if (ui.startButton.dataset.dailyResetBound !== 'true') {
    ui.startButton.dataset.dailyResetBound = 'true';
    ui.startButton.addEventListener('click', () => {
      if (dailyLaunchArmed) {
        dailyLaunchArmed = false;
        return;
      }
      requestDailyChallenge(false);
    }, { capture: true });
  }

  if (ui.dailyButton.dataset.dailyBound !== 'true') {
    ui.dailyButton.dataset.dailyBound = 'true';
    ui.dailyButton.addEventListener('click', () => {
      requestDailyChallenge(true);
      dailyLaunchArmed = true;
      dailyProxyClick = true;
      ui.challengeButton.click();
      dailyProxyClick = false;
    });
  }

  const campaignButton = document.querySelector('#challenge-campaign-button');
  if (campaignButton && campaignButton.dataset.dailyResetBound !== 'true') {
    campaignButton.dataset.dailyResetBound = 'true';
    campaignButton.addEventListener('click', () => requestDailyChallenge(false), { capture: true });
  }

  document.querySelector('#practice-ronin-button')?.addEventListener('click', () => requestDailyChallenge(false), { capture: true });
  document.querySelector('#practice-oni-button')?.addEventListener('click', () => requestDailyChallenge(false), { capture: true });
  document.querySelector('#practice-shogun-button')?.addEventListener('click', () => requestDailyChallenge(false), { capture: true });

  document.documentElement.dataset.dailyChallengeReady = 'true';
  markStartLayout();
}

if (typeof document !== 'undefined') {
  installDailyChallenge();
  installDailyUi();
}
