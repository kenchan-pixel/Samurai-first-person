import { CombatEngine } from './game-core.js';

export const RONIN_PRACTICE_ID = 'wandering-ronin';
export const SHOGUN_PRACTICE_ID = 'crimson-shogun';

const installed = Symbol.for('blade-reversal.duel-practice-v2');
const states = new WeakMap();
let requestedMode = 'campaign';
let practiceLaunchArmed = false;

function modeForEnemy(enemyId) {
  if (enemyId === RONIN_PRACTICE_ID) return 'ronin-practice';
  if (enemyId === SHOGUN_PRACTICE_ID) return 'shogun-practice';
  return 'campaign';
}

function enemyForMode(mode) {
  if (mode === 'ronin-practice') return RONIN_PRACTICE_ID;
  if (mode === 'shogun-practice') return SHOGUN_PRACTICE_ID;
  return null;
}

function retryLabel(enemyId) {
  return enemyId === SHOGUN_PRACTICE_ID ? '再戰將軍' : '再練浪人';
}

function practiceState(engine) {
  return engine && typeof engine === 'object'
    ? states.get(engine) || { active: false, enemyId: null, stage: null }
    : { active: false, enemyId: null, stage: null };
}

export function requestPractice(enemyId = null) {
  requestedMode = modeForEnemy(enemyId);
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.nextRunMode = requestedMode;
  }
  return requestedMode;
}

export function requestRoninPractice(enabled = true) {
  return requestPractice(enabled ? RONIN_PRACTICE_ID : null);
}

export function requestShogunPractice(enabled = true) {
  return requestPractice(enabled ? SHOGUN_PRACTICE_ID : null);
}

export function activatePractice(engine, enemyId, now = 0) {
  const index = Array.isArray(engine?.enemies)
    ? engine.enemies.findIndex((enemy) => enemy?.id === enemyId)
    : -1;
  if (index < 0 || !Number.isFinite(now)) {
    if (engine && typeof engine === 'object') states.set(engine, { active: false, enemyId: null, stage: null });
    return { accepted: false, reason: 'practice-enemy-missing' };
  }

  engine.enemyIndex = index;
  engine.enemyHp = engine.enemy.maxHp;
  engine.enemyPosture = 0;
  engine.playerPosture = 0;
  engine.attackCursor = 0;
  engine.currentAttack = null;
  engine.phase = 'stage-intro';
  engine.phaseStartedAt = now;
  engine.phaseEndsAt = now + 1550;
  engine.events.length = 0;
  engine.events.push({
    type: 'stage-start',
    detail: {
      stage: index + 1,
      enemyId: engine.enemy.id,
      enemyName: engine.enemy.name,
      practice: true,
    },
  });
  states.set(engine, { active: true, enemyId: engine.enemy.id, stage: index + 1 });
  return { accepted: true, stage: index + 1, enemyId: engine.enemy.id };
}

export function activateRoninPractice(engine, now = 0) {
  return activatePractice(engine, RONIN_PRACTICE_ID, now);
}

export function activateShogunPractice(engine, now = 0) {
  return activatePractice(engine, SHOGUN_PRACTICE_ID, now);
}

export function completePracticeIfDue(engine, now) {
  const state = practiceState(engine);
  if (
    !state.active ||
    !Number.isFinite(now) ||
    engine?.phase !== 'stage-clear' ||
    !Number.isFinite(engine.phaseEndsAt) ||
    now < engine.phaseEndsAt
  ) {
    return false;
  }

  const completedAt = engine.phaseEndsAt;
  engine.phase = 'victory';
  engine.phaseStartedAt = completedAt;
  engine.phaseEndsAt = Infinity;
  engine.events.push({
    type: 'victory',
    detail: {
      score: engine.score,
      playerHp: engine.playerHp,
      practice: true,
      practiceEnemyId: state.enemyId,
      practiceStage: state.stage,
    },
  });
  states.set(engine, { ...state, completed: true });
  return true;
}

export function completeRoninPracticeIfDue(engine, now) {
  return completePracticeIfDue(engine, now);
}

function markPracticeDefeat(engine) {
  const state = practiceState(engine);
  if (!state.active || !Array.isArray(engine?.events)) return;
  for (const event of engine.events) {
    if (event?.type === 'defeat') {
      event.detail = {
        ...(event.detail || {}),
        practice: true,
        practiceEnemyId: state.enemyId,
        practiceStage: state.stage,
      };
    }
  }
}

function installStyles() {
  if (typeof document === 'undefined' || document.querySelector('style[data-duel-practice]')) return;
  const style = document.createElement('style');
  style.dataset.duelPractice = 'true';
  style.textContent = `
    .practice-row{width:min(100%,300px);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin:8px auto 0}
    .practice-button,.ronin-practice-campaign{min-height:38px;padding:7px 8px;border:1px solid rgba(126,174,255,.28);border-radius:11px;background:rgba(88,116,169,.09);color:#dce8ff;font-size:10px;font-weight:800;letter-spacing:.035em;cursor:pointer}
    .practice-button span{display:block;margin-top:2px;color:rgba(229,235,245,.54);font-size:7.8px;font-weight:650;letter-spacing:0}
    .practice-button:active,.ronin-practice-campaign:active{transform:translateY(1px)}
    .ronin-practice-campaign{width:min(100%,280px);margin:8px auto 0}
    .ronin-practice-campaign[hidden]{display:none}
    @media(max-width:360px) and (max-height:620px){#start-screen .crest{width:54px;height:54px;margin-bottom:11px;font-size:25px}#start-screen .modal__content>p:not(.modal__eyebrow){margin-top:12px;line-height:1.45}.control-demo{margin-top:14px}.primary-button{margin-top:14px}.practice-row{margin-top:6px;gap:5px}.practice-button{min-height:34px;padding:5px 6px;font-size:9.5px}.coach-toggle{margin-top:6px}.modal small{margin-top:8px}}
  `;
  document.head.append(style);
}

function renderModeUi(state, terminal = false) {
  if (typeof document === 'undefined') return;
  const restart = document.querySelector('#restart-button');
  const campaign = document.querySelector('#ronin-practice-campaign');
  const active = Boolean(state?.active);
  if (restart) restart.textContent = active && terminal ? retryLabel(state.enemyId) : '重新挑戰';
  if (campaign) campaign.hidden = !(active && terminal);
  document.documentElement.dataset.runMode = active ? modeForEnemy(state.enemyId) : 'campaign';
}

function markStartLayout() {
  if (typeof document === 'undefined') return;
  requestAnimationFrame(() => {
    const content = document.querySelector('#start-screen .modal__content');
    const row = document.querySelector('#practice-row');
    const ronin = document.querySelector('#practice-ronin-button');
    const shogun = document.querySelector('#practice-shogun-button');
    if (!content || !row || !ronin || !shogun) return;
    const rects = [content, row, ronin, shogun].map((node) => node.getBoundingClientRect());
    const fits = rects.every(
      (rect) =>
        rect.left >= 0 &&
        rect.right <= window.innerWidth &&
        rect.top >= 0 &&
        rect.bottom <= window.innerHeight,
    );
    document.documentElement.dataset.practiceStartLayout = fits ? 'pass' : 'fail';
  });
}

function installUi() {
  if (typeof document === 'undefined') return;
  installStyles();
  const startButton = document.querySelector('#start-button');
  const restartButton = document.querySelector('#restart-button');
  const resultContent = restartButton?.parentElement;

  if (startButton && !document.querySelector('#practice-row')) {
    const row = document.createElement('div');
    row.id = 'practice-row';
    row.className = 'practice-row';
    row.setAttribute('aria-label', '指定決鬥練習');
    row.innerHTML =
      '<button id="practice-ronin-button" class="practice-button" type="button">練浪人<span>第二關 · 假動作</span></button>' +
      '<button id="practice-shogun-button" class="practice-button" type="button">練將軍<span>第四關 · BLOOD MOON</span></button>';
    startButton.after(row);

    const launchPractice = (enemyId) => {
      requestPractice(enemyId);
      practiceLaunchArmed = true;
      startButton.click();
    };
    row.querySelector('#practice-ronin-button')?.addEventListener('click', () => launchPractice(RONIN_PRACTICE_ID));
    row.querySelector('#practice-shogun-button')?.addEventListener('click', () => launchPractice(SHOGUN_PRACTICE_ID));
  }

  startButton?.addEventListener('click', () => {
    if (practiceLaunchArmed) {
      practiceLaunchArmed = false;
      return;
    }
    requestPractice(null);
  });

  if (resultContent && !document.querySelector('#ronin-practice-campaign')) {
    const button = document.createElement('button');
    button.id = 'ronin-practice-campaign';
    button.className = 'ronin-practice-campaign';
    button.type = 'button';
    button.hidden = true;
    button.textContent = '開始完整主線';
    restartButton.insertAdjacentElement('afterend', button);
    button.addEventListener('click', () => {
      requestPractice(null);
      restartButton.click();
    });
  }

  const practiceUiReady =
    Boolean(document.querySelector('#practice-ronin-button')) &&
    Boolean(document.querySelector('#practice-shogun-button'));
  document.documentElement.dataset.practiceModeUi = String(practiceUiReady);
  markStartLayout();
}

export function installDuelPractice(Engine = CombatEngine) {
  if (!Engine?.prototype || Engine.prototype[installed]) {
    if (typeof document !== 'undefined') installUi();
    return;
  }

  const originalStart = Engine.prototype.start;
  const originalUpdate = Engine.prototype.update;
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.start = function duelPracticeStart(now = 0) {
    const result = originalStart.call(this, now);
    const enemyId = enemyForMode(requestedMode);
    if (enemyId) {
      const activated = activatePractice(this, enemyId, now);
      renderModeUi(activated.accepted ? practiceState(this) : null, false);
    } else {
      states.set(this, { active: false, enemyId: null, stage: null });
      renderModeUi(null, false);
    }
    return result;
  };

  Engine.prototype.update = function duelPracticeUpdate(now) {
    if (completePracticeIfDue(this, now)) return;
    const result = originalUpdate.call(this, now);
    markPracticeDefeat(this);
    return result;
  };

  Engine.prototype.drainEvents = function duelPracticeDrainEvents() {
    const events = originalDrainEvents.call(this);
    const state = practiceState(this);
    if (state.active && events.some((event) => event.type === 'victory' || event.type === 'defeat')) {
      queueMicrotask(() => renderModeUi(state, true));
    }
    return events;
  };

  if (typeof document !== 'undefined') {
    installUi();
    document.documentElement.dataset.practiceModeReady = 'true';
  }
}

export function installRoninPractice(Engine = CombatEngine) {
  return installDuelPractice(Engine);
}

if (typeof document !== 'undefined') installDuelPractice();
