import { CombatEngine } from './game-core.js';

const PREF_KEY = 'blade-reversal-guided-duel-v1';
const patched = Symbol.for('blade-reversal.onboarding-coach');
const sessions = new WeakMap();
let guideEnabled = true;
let coachTimer = null;

function copySteps(steps) {
  return { read: Boolean(steps?.read), parry: Boolean(steps?.parry), counter: Boolean(steps?.counter) };
}

export function createCoachProgress(enabled = true) {
  return {
    enabled: Boolean(enabled),
    stage: 0,
    mode: null,
    visible: false,
    completed: false,
    masteryTip: false,
    headline: '先讀刀，再出手',
    hint: '留意敵人最後刀路',
    steps: { read: false, parry: false, counter: false },
  };
}

export function applyCoachEvent(previous, event) {
  const next = {
    ...previous,
    steps: copySteps(previous?.steps),
  };
  if (!next.enabled || !event?.type) return next;

  const detail = event.detail || {};

  if (event.type === 'stage-start') {
    next.stage = Number(detail.stage) || next.stage;
    if (next.stage === 1) {
      next.mode = 'basics';
      next.visible = true;
      next.completed = false;
      next.headline = '① 讀刀路';
      next.hint = '先睇起手，等最後方向先格擋';
      next.steps = { read: false, parry: false, counter: false };
    } else if (detail.enemyId === 'crimson-shogun') {
      next.mode = 'boss';
      next.visible = true;
      next.headline = 'BOSS · 重新讀節奏';
      next.hint = '半血後攻勢會改變；唔好照舊節奏出手';
    } else {
      next.mode = null;
      next.visible = false;
    }
    return next;
  }

  if (event.type === 'telegraph' && next.mode === 'basics') {
    next.visible = true;
    next.headline = '① 讀刀路';
    next.hint = detail.feint ? '可能有假動作；以最後刀路為準' : '先睇起手，唔好太早點';
  } else if (event.type === 'feint' && next.mode === 'basics') {
    next.visible = true;
    next.headline = '假動作';
    next.hint = '方向改咗；重新判斷最後刀路';
  } else if (event.type === 'strike' && next.mode === 'basics') {
    next.steps.read = true;
    next.visible = true;
    next.headline = '② 格擋';
    next.hint = '而家點相應畫面邊緣';
  } else if (event.type === 'parry-miss' && next.mode === 'basics') {
    next.visible = true;
    next.headline = '再試一次';
    next.hint = detail.reason === 'wrong-direction' ? '方向錯誤；跟最後刀路格擋' : '時機太早／太遲；等刀落先點';
  } else if ((event.type === 'parry' || event.type === 'perfect-parry') && next.mode === 'basics') {
    next.steps.parry = true;
    next.visible = true;
    next.headline = '③ 反擊';
    const posture = Number.isFinite(detail.enemyPosture) && Number.isFinite(detail.enemyPostureMax)
      ? `敵勢 ${detail.enemyPosture}/${detail.enemyPostureMax} · `
      : '';
    next.hint = `${posture}${event.type === 'perfect-parry' ? '完美格擋！' : '格擋成功 · '}掃屏斬擊空隙`;
  } else if (event.type === 'enemy-guard-break' && next.mode === 'basics') {
    next.visible = true;
    next.headline = '架勢崩潰';
    next.hint = '連續格擋會破勢；今次反擊有 +2 傷害';
  } else if (event.type === 'counter' && next.mode === 'basics') {
    next.steps.counter = true;
    next.completed = next.steps.read && next.steps.parry && next.steps.counter;
    next.visible = true;
    if (next.completed) {
      next.mode = 'complete';
      next.headline = '首戰教學完成';
      next.hint = '完美格擋加快破勢；之後主要靠睇動作判斷';
    }
  } else if (event.type === 'enemy-defeated' && next.stage === 1 && !next.completed) {
    next.completed = true;
    next.mode = 'complete';
    next.visible = true;
    next.headline = '第一關完成';
    next.hint = '記住：讀刀 → 格擋 → 反擊；連續格擋會破勢';
  } else if (event.type === 'boss-phase') {
    next.mode = 'boss';
    next.visible = true;
    next.headline = 'PHASE II · 節奏轉換';
    next.hint = '舊節奏已失效；先觀察一輪再出手';
  } else if (event.type === 'victory') {
    next.visible = false;
    next.masteryTip = true;
  } else if (event.type === 'defeat' || event.type === 'reset') {
    next.visible = false;
  }

  return next;
}

function readPreference() {
  try {
    const value = localStorage.getItem(PREF_KEY);
    return value !== 'off' && value !== 'completed';
  } catch {
    return true;
  }
}

function writePreference(value) {
  try {
    localStorage.setItem(PREF_KEY, value);
  } catch {
    // The coach remains usable for this page even when storage is unavailable.
  }
}

function installStyle() {
  if (document.querySelector('style[data-onboarding-coach]')) return;
  const style = document.createElement('style');
  style.dataset.onboardingCoach = 'true';
  style.textContent = `
    .coach-panel{position:absolute;z-index:8;left:var(--safe-left);bottom:calc(var(--safe-bottom) + 38px);width:min(49vw,176px);padding:9px 10px 10px;border:1px solid rgba(228,182,107,.28);border-radius:12px;background:linear-gradient(150deg,rgba(10,11,15,.82),rgba(32,19,17,.68));box-shadow:0 10px 28px rgba(0,0,0,.26);backdrop-filter:blur(8px);pointer-events:none;text-shadow:0 2px 10px #000;transition:opacity .18s ease,transform .18s ease}
    .coach-panel[hidden]{display:none}
    .coach-panel.is-complete{border-color:rgba(126,205,154,.42)}
    .coach__label{font-size:7px;font-weight:850;letter-spacing:.16em;color:rgba(239,196,129,.68)}
    .coach__title{display:block;margin-top:3px;font-size:10px;line-height:1.2;letter-spacing:.04em;color:#fff4df}
    .coach__hint{display:block;margin-top:4px;font-size:8px;line-height:1.35;color:rgba(245,236,220,.66)}
    .coach__steps{display:flex;gap:4px;margin-top:7px}
    .coach-step{flex:1;min-width:0;padding:4px 2px;border:1px solid rgba(255,255,255,.08);border-radius:7px;text-align:center;font-size:7px;color:rgba(240,235,226,.38);background:rgba(255,255,255,.025)}
    .coach-step.is-active{color:#ffe0a6;border-color:rgba(228,182,107,.34);background:rgba(228,182,107,.08)}
    .coach-step.is-done{color:rgba(194,236,205,.82);border-color:rgba(126,205,154,.25)}
    .coach-toggle{display:block;width:min(100%,280px);min-height:34px;margin:9px auto 0;padding:6px 12px;border:1px solid rgba(239,196,129,.22);border-radius:10px;background:rgba(255,255,255,.035);color:rgba(245,236,220,.72);font-size:9px;font-weight:750;letter-spacing:.05em;cursor:pointer}
    .coach-toggle[aria-pressed="true"]{border-color:rgba(126,174,255,.35);color:#dce8ff;background:rgba(90,130,200,.08)}
    @media (max-width:360px){.coach-panel{width:154px;padding:8px 9px}.coach__hint{font-size:7.5px}}
    @media (prefers-reduced-motion:reduce){.coach-panel{transition:none}}
  `;
  document.head.append(style);
}

function installUi() {
  const app = document.querySelector('#app');
  const startButton = document.querySelector('#start-button');
  if (!app || !startButton) return { panel: null, toggle: null };

  installStyle();

  let panel = document.querySelector('#onboarding-coach');
  if (!panel) {
    panel = document.createElement('section');
    panel.id = 'onboarding-coach';
    panel.className = 'coach-panel';
    panel.hidden = true;
    panel.setAttribute('aria-live', 'polite');
    panel.innerHTML = `
      <span class="coach__label">GUIDED DUEL</span>
      <strong class="coach__title">先讀刀，再出手</strong>
      <span class="coach__hint">留意敵人最後刀路</span>
      <div class="coach__steps" aria-label="教學進度">
        <span class="coach-step" data-step="read">讀刀</span>
        <span class="coach-step" data-step="parry">格擋</span>
        <span class="coach-step" data-step="counter">反擊</span>
      </div>`;
    app.append(panel);
  }

  let toggle = document.querySelector('#coach-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.id = 'coach-toggle';
    toggle.className = 'coach-toggle';
    toggle.type = 'button';
    startButton.after(toggle);
  }

  return { panel, toggle };
}

function updateToggle(toggle) {
  if (!toggle) return;
  toggle.setAttribute('aria-pressed', String(guideEnabled));
  toggle.textContent = guideEnabled ? '新手首戰引導：開' : '新手首戰引導：關';
}

function activeStep(state) {
  if (!state.steps.read) return 'read';
  if (!state.steps.parry) return 'parry';
  if (!state.steps.counter) return 'counter';
  return null;
}

function renderCoach(panel, state) {
  if (!panel) return;
  panel.hidden = !state.visible;
  panel.classList.toggle('is-complete', state.mode === 'complete');
  panel.dataset.mode = state.mode || '';
  panel.dataset.completed = String(Boolean(state.completed));
  panel.dataset.coachStepRead = state.steps.read ? 'done' : 'todo';
  panel.dataset.coachStepParry = state.steps.parry ? 'done' : 'todo';
  panel.dataset.coachStepCounter = state.steps.counter ? 'done' : 'todo';
  panel.querySelector('.coach__label').textContent = state.mode === 'boss' ? 'BOSS LESSON' : 'GUIDED DUEL';
  panel.querySelector('.coach__title').textContent = state.headline;
  panel.querySelector('.coach__hint').textContent = state.hint;

  const active = activeStep(state);
  for (const step of panel.querySelectorAll('.coach-step')) {
    const key = step.dataset.step;
    step.classList.toggle('is-done', state.steps[key]);
    step.classList.toggle('is-active', key === active && state.mode === 'basics');
    step.hidden = state.mode === 'boss';
  }

  if (coachTimer !== null) {
    clearTimeout(coachTimer);
    coachTimer = null;
  }
  const transient = state.mode === 'complete' ? 1800 : state.mode === 'boss' ? 1650 : 0;
  if (state.visible && transient) {
    coachTimer = window.setTimeout(() => {
      panel.hidden = true;
      coachTimer = null;
    }, transient);
  }
}

export function installOnboardingCoach() {
  if (typeof document === 'undefined' || CombatEngine.prototype[patched]) return;

  guideEnabled = readPreference();
  const { panel, toggle } = installUi();
  updateToggle(toggle);

  toggle?.addEventListener('click', () => {
    guideEnabled = !guideEnabled;
    writePreference(guideEnabled ? 'on' : 'off');
    updateToggle(toggle);
  });

  const originalStart = CombatEngine.prototype.start;
  const originalDrainEvents = CombatEngine.prototype.drainEvents;
  Object.defineProperty(CombatEngine.prototype, patched, { value: true });

  CombatEngine.prototype.start = function onboardingStart(now = 0) {
    sessions.set(this, createCoachProgress(guideEnabled));
    if (coachTimer !== null) {
      clearTimeout(coachTimer);
      coachTimer = null;
    }
    if (panel) panel.hidden = true;
    return originalStart.call(this, now);
  };

  CombatEngine.prototype.drainEvents = function onboardingDrainEvents() {
    const events = originalDrainEvents.call(this);
    let state = sessions.get(this);
    if (!state) return events;

    for (const event of events) {
      const wasCompleted = state.completed;
      state = applyCoachEvent(state, event);
      if (!wasCompleted && state.completed) {
        writePreference('completed');
        guideEnabled = false;
        updateToggle(toggle);
      }
      renderCoach(panel, state);
    }
    sessions.set(this, state);
    return events;
  };

  document.documentElement.dataset.onboardingReady = 'true';
}

if (typeof document !== 'undefined') installOnboardingCoach();
