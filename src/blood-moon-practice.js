import { CombatEngine } from './game-core.js';
import {
  BOSS_ID,
  activateBossPhaseTwoPractice,
  installBossEncounter,
} from './boss-encounter.js';
import {
  armPracticeLaunch,
  installDuelPractice,
  requestShogunPractice,
} from './practice-mode.js';

export const BLOOD_MOON_PRACTICE_MODE = 'blood-moon-practice';

const installed = Symbol.for('blade-reversal.blood-moon-practice-v1');
const states = new WeakMap();
let bloodMoonSelected = false;
let bloodMoonLaunchArmed = false;

function renderMode(active, terminal = false) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.bloodMoonPracticeActive = String(Boolean(active));
  if (!active) {
    delete root.dataset.bloodMoonPracticePhase;
    delete root.dataset.bloodMoonPracticeEnemyHp;
    delete root.dataset.bloodMoonPracticeStartScore;
    return;
  }
  root.dataset.runMode = BLOOD_MOON_PRACTICE_MODE;
  if (terminal) {
    const restart = document.querySelector('#restart-button');
    if (restart) restart.textContent = '再戰血月';
  }
}

function publishStartReceipt(engine) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.bloodMoonPracticePhase = '2';
  root.dataset.bloodMoonPracticeEnemyHp = String(engine.enemyHp);
  root.dataset.bloodMoonPracticeStartScore = String(engine.score);
}

function annotatePendingEvents(engine) {
  const state = states.get(engine);
  if (!state?.active || !Array.isArray(engine?.events)) return;
  for (const event of engine.events) {
    if (!event || typeof event !== 'object') continue;
    if (
      event.type === 'stage-start' ||
      event.type === 'boss-phase' ||
      event.type === 'victory' ||
      event.type === 'defeat'
    ) {
      event.detail = {
        ...(event.detail || {}),
        practice: true,
        practiceEnemyId: BOSS_ID,
        practiceStage: 4,
        practiceMode: BLOOD_MOON_PRACTICE_MODE,
      };
    }
  }
}

function markStartLayout() {
  if (typeof document === 'undefined' || typeof requestAnimationFrame !== 'function') return;
  requestAnimationFrame(() => {
    const content = document.querySelector('#start-screen .modal__content');
    const row = document.querySelector('#practice-row');
    const buttons = [...(row?.querySelectorAll('.practice-button') || [])];
    const fits = Boolean(content && row && buttons.length >= 6) && [content, row, ...buttons].every((node) => {
      const rect = node.getBoundingClientRect();
      return (
        rect.left >= -0.5 &&
        rect.right <= window.innerWidth + 0.5 &&
        rect.top >= -0.5 &&
        rect.bottom <= window.innerHeight + 0.5
      );
    });
    const result = fits ? 'pass' : 'fail';
    document.documentElement.dataset.bloodMoonPracticeStartLayout = result;
    document.documentElement.dataset.practiceStartLayout = result;
  });
}

function installStyles() {
  if (typeof document === 'undefined' || document.querySelector('style[data-blood-moon-practice]')) return;
  const style = document.createElement('style');
  style.dataset.bloodMoonPractice = 'true';
  style.textContent = `
    .practice-row{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important}
    .practice-row .practice-button span,.practice-row .practice-button small{font-size:7.2px!important}
    .practice-button--blood-moon{border-color:rgba(255,106,84,.42)!important;background:rgba(108,22,28,.24)!important;color:#ffd8cf!important}
    .practice-button--blood-moon span{color:rgba(255,196,181,.68)!important}
    @media(max-width:360px) and (max-height:620px){.practice-row{gap:4px!important}.practice-row .practice-button{min-height:31px!important;padding:4px 4px!important;font-size:9px!important}.practice-row .practice-button span,.practice-row .practice-button small{font-size:6.7px!important}}
  `;
  document.head.append(style);
}

function installUi() {
  if (typeof document === 'undefined') return;
  installStyles();
  const row = document.querySelector('#practice-row');
  const shogun = document.querySelector('#practice-shogun-button');
  const start = document.querySelector('#start-button');
  if (!row || !shogun || !start) {
    document.documentElement.dataset.bloodMoonPracticeReady = 'false';
    markStartLayout();
    return;
  }

  let button = document.querySelector('#practice-blood-moon-button');
  if (!button) {
    button = document.createElement('button');
    button.id = 'practice-blood-moon-button';
    button.type = 'button';
    button.className = 'practice-button practice-button--blood-moon';
    button.innerHTML = '練血月<span>將軍 · PHASE II</span>';
    button.setAttribute('aria-label', '直接練習赤將軍 Blood Moon 第二階段');
    shogun.insertAdjacentElement('afterend', button);
  }
  row.setAttribute('aria-label', '指定決鬥、血月、連戰及今日陣');

  const clearBloodMoon = () => {
    if (bloodMoonLaunchArmed) {
      bloodMoonLaunchArmed = false;
      return;
    }
    requestBloodMoonPractice(false);
  };
  for (const selector of [
    '#start-button',
    '#practice-ronin-button',
    '#practice-oni-button',
    '#challenge-button',
    '#daily-challenge-button',
    '#ronin-practice-campaign',
    '#challenge-campaign-button',
  ]) {
    const node = document.querySelector(selector);
    if (node && node.dataset.bloodMoonResetBound !== 'true') {
      node.dataset.bloodMoonResetBound = 'true';
      node.addEventListener('click', clearBloodMoon, { capture: true });
    }
  }

  if (shogun.dataset.bloodMoonResetBound !== 'true') {
    shogun.dataset.bloodMoonResetBound = 'true';
    shogun.addEventListener('click', clearBloodMoon, { capture: true });
  }

  if (button.dataset.bloodMoonBound !== 'true') {
    button.dataset.bloodMoonBound = 'true';
    button.addEventListener('click', () => {
      requestBloodMoonPractice(true);
      armPracticeLaunch(BOSS_ID);
      bloodMoonLaunchArmed = true;
      start.click();
    });
  }

  document.documentElement.dataset.bloodMoonPracticeReady = 'true';
  markStartLayout();
}

export function requestBloodMoonPractice(enabled = true) {
  bloodMoonSelected = Boolean(enabled);
  requestShogunPractice(bloodMoonSelected);
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.nextBloodMoonPractice = bloodMoonSelected ? 'blood-moon' : 'off';
  }
  return bloodMoonSelected;
}

export function activateBloodMoonPractice(engine, now = 0) {
  const practiceStart = Array.isArray(engine?.events)
    ? engine.events.find(
        (event) =>
          event?.type === 'stage-start' &&
          event.detail?.practice === true &&
          event.detail?.enemyId === BOSS_ID,
      )
    : null;
  if (!practiceStart || !activateBossPhaseTwoPractice(engine, now)) {
    states.set(engine, { active: false });
    return { accepted: false, reason: 'blood-moon-practice-requires-shogun-practice' };
  }

  states.set(engine, { active: true, stage: 4 });
  annotatePendingEvents(engine);
  renderMode(true, false);
  publishStartReceipt(engine);
  return {
    accepted: true,
    enemyId: BOSS_ID,
    stage: 4,
    phase: 2,
    enemyHp: engine.enemyHp,
    mode: BLOOD_MOON_PRACTICE_MODE,
  };
}

export function installBloodMoonPractice(Engine = CombatEngine) {
  installBossEncounter(Engine);
  installDuelPractice(Engine);
  if (!Engine?.prototype || Engine.prototype[installed]) {
    if (typeof document !== 'undefined') installUi();
    return;
  }

  const originalStart = Engine.prototype.start;
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.start = function bloodMoonPracticeStart(now = 0) {
    const shouldActivate = bloodMoonSelected;
    const result = originalStart.call(this, now);
    if (shouldActivate) {
      activateBloodMoonPractice(this, now);
    } else {
      states.set(this, { active: false });
      renderMode(false, false);
    }
    return result;
  };

  Engine.prototype.drainEvents = function bloodMoonPracticeDrainEvents() {
    annotatePendingEvents(this);
    const events = originalDrainEvents.call(this);
    const active = Boolean(states.get(this)?.active);
    if (active && events.some((event) => event.type === 'victory' || event.type === 'defeat')) {
      queueMicrotask(() => renderMode(true, true));
    }
    return events;
  };

  if (typeof document !== 'undefined') installUi();
}

if (typeof document !== 'undefined') installBloodMoonPractice();
