import { CombatEngine } from './game-core.js';

export const RONIN_PRACTICE_ID = 'wandering-ronin';

const installed = Symbol.for('blade-reversal.ronin-practice-v1');
const states = new WeakMap();
let requestedMode = 'campaign';
let practiceLaunchArmed = false;

function practiceState(engine) {
  return engine && typeof engine === 'object'
    ? states.get(engine) || { active: false, enemyId: null, stage: null }
    : { active: false, enemyId: null, stage: null };
}

export function requestRoninPractice(enabled = true) {
  requestedMode = enabled ? 'ronin-practice' : 'campaign';
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.nextRunMode = requestedMode;
  }
  return requestedMode;
}

export function activateRoninPractice(engine, now = 0) {
  const index = Array.isArray(engine?.enemies)
    ? engine.enemies.findIndex((enemy) => enemy?.id === RONIN_PRACTICE_ID)
    : -1;
  if (index < 0 || !Number.isFinite(now)) {
    if (engine && typeof engine === 'object') states.set(engine, { active: false, enemyId: null, stage: null });
    return { accepted: false, reason: 'ronin-missing' };
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

export function completeRoninPracticeIfDue(engine, now) {
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
  if (typeof document === 'undefined' || document.querySelector('style[data-ronin-practice]')) return;
  const style = document.createElement('style');
  style.dataset.roninPractice = 'true';
  style.textContent = `
    .ronin-practice-button,.ronin-practice-campaign{width:min(100%,280px);min-height:38px;margin:8px auto 0;padding:7px 12px;border:1px solid rgba(126,174,255,.28);border-radius:11px;background:rgba(88,116,169,.09);color:#dce8ff;font-size:10px;font-weight:800;letter-spacing:.05em;cursor:pointer}
    .ronin-practice-button span{display:block;margin-top:2px;color:rgba(229,235,245,.54);font-size:8px;font-weight:650;letter-spacing:.02em}
    .ronin-practice-button:active,.ronin-practice-campaign:active{transform:translateY(1px)}
    .ronin-practice-campaign[hidden]{display:none}
    @media(max-width:360px) and (max-height:620px){#start-screen .crest{width:54px;height:54px;margin-bottom:11px;font-size:25px}#start-screen .modal__content>p:not(.modal__eyebrow){margin-top:12px;line-height:1.45}.control-demo{margin-top:14px}.primary-button{margin-top:14px}.ronin-practice-button{min-height:34px;margin-top:6px}.coach-toggle{margin-top:6px}.modal small{margin-top:8px}}
  `;
  document.head.append(style);
}

function renderModeUi(active, terminal = false) {
  if (typeof document === 'undefined') return;
  const restart = document.querySelector('#restart-button');
  const campaign = document.querySelector('#ronin-practice-campaign');
  if (restart) restart.textContent = active && terminal ? '再練浪人' : '重新挑戰';
  if (campaign) campaign.hidden = !(active && terminal);
  document.documentElement.dataset.runMode = active ? 'ronin-practice' : 'campaign';
}

function markStartLayout() {
  if (typeof document === 'undefined') return;
  requestAnimationFrame(() => {
    const content = document.querySelector('#start-screen .modal__content');
    const button = document.querySelector('#practice-ronin-button');
    if (!content || !button) return;
    const contentRect = content.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const fits =
      contentRect.left >= 0 &&
      contentRect.right <= window.innerWidth &&
      contentRect.top >= 0 &&
      contentRect.bottom <= window.innerHeight &&
      buttonRect.left >= 0 &&
      buttonRect.right <= window.innerWidth &&
      buttonRect.bottom <= window.innerHeight;
    document.documentElement.dataset.practiceStartLayout = fits ? 'pass' : 'fail';
  });
}

function installUi() {
  if (typeof document === 'undefined') return;
  installStyles();
  const startButton = document.querySelector('#start-button');
  const restartButton = document.querySelector('#restart-button');
  const resultContent = restartButton?.parentElement;

  if (startButton && !document.querySelector('#practice-ronin-button')) {
    const button = document.createElement('button');
    button.id = 'practice-ronin-button';
    button.className = 'ronin-practice-button';
    button.type = 'button';
    button.innerHTML = '第二關練習<span>直接挑戰浪人 · 不計個人最佳</span>';
    startButton.after(button);
    button.addEventListener('click', () => {
      requestRoninPractice(true);
      practiceLaunchArmed = true;
      startButton.click();
    });
  }

  startButton?.addEventListener('click', () => {
    if (practiceLaunchArmed) {
      practiceLaunchArmed = false;
      return;
    }
    requestRoninPractice(false);
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
      requestRoninPractice(false);
      restartButton.click();
    });
  }

  document.documentElement.dataset.practiceModeUi = String(Boolean(document.querySelector('#practice-ronin-button')));
  markStartLayout();
}

export function installRoninPractice(Engine = CombatEngine) {
  if (!Engine?.prototype || Engine.prototype[installed]) {
    if (typeof document !== 'undefined') installUi();
    return;
  }

  const originalStart = Engine.prototype.start;
  const originalUpdate = Engine.prototype.update;
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.start = function roninPracticeStart(now = 0) {
    const result = originalStart.call(this, now);
    if (requestedMode === 'ronin-practice') {
      const activated = activateRoninPractice(this, now);
      renderModeUi(Boolean(activated.accepted), false);
    } else {
      states.set(this, { active: false, enemyId: null, stage: null });
      renderModeUi(false, false);
    }
    return result;
  };

  Engine.prototype.update = function roninPracticeUpdate(now) {
    if (completeRoninPracticeIfDue(this, now)) return;
    const result = originalUpdate.call(this, now);
    markPracticeDefeat(this);
    return result;
  };

  Engine.prototype.drainEvents = function roninPracticeDrainEvents() {
    const events = originalDrainEvents.call(this);
    const state = practiceState(this);
    if (state.active && events.some((event) => event.type === 'victory' || event.type === 'defeat')) {
      queueMicrotask(() => renderModeUi(true, true));
    }
    return events;
  };

  if (typeof document !== 'undefined') {
    installUi();
    document.documentElement.dataset.practiceModeReady = 'true';
  }
}

if (typeof document !== 'undefined') installRoninPractice();
