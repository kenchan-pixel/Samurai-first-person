import { CombatEngine } from './game-core.js';

const PREF_KEY = 'blade-reversal-guided-duel-v1';
const patched = Symbol.for('blade-reversal.onboarding-coach');
const sessions = new WeakMap();
let guideEnabled = true;
let coachTimer = null;
let actionCueTimer = null;

const GUIDE_CARDS = Object.freeze([
  {
    title: '① 格擋 → 反擊',
    body: '敵刀真正落下時，點擊同一方向嘅畫面邊緣。格擋成功只係打開反擊窗口；正常情況要再掃屏先會造成傷害。',
  },
  {
    title: '② 完美格擋',
    body: '喺攻擊最早一小段時間準確格擋：敵勢加得更快，並會自動補 1 刀。自動補刀後，同一個空隙仍然可以再掃屏一次。',
  },
  {
    title: '③ 掃屏方向有分別',
    body: '反擊時任何方向都可以命中；如果向敵人來刀嘅相反方向掃，會多 1 點傷害。',
  },
  {
    title: '④ 敵勢 / 破勢',
    body: '格擋會累積敵勢，完美格擋累積更多。敵勢滿會破勢，反擊窗口更長，而且下一次手動反擊額外 +2 傷害。',
  },
  {
    title: '⑤ STEP 後撤',
    body: 'STEP 只可喺攻擊早段使用，唔使判方向，但只係後撤一格。短／中距離斬可能落空；長距離或重擊會追到。成功避開後仍要掃屏反擊。',
  },
  {
    title: '第二關 · Ronin',
    body: '會有假動作：起手方向未必係最後方向。唔好見第一下就點，等刀路最後確認先格擋。',
    accent: true,
  },
]);

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
  } else if (event.type === 'counter' && !detail.automatic && next.mode === 'basics') {
    next.steps.counter = true;
    next.completed = next.steps.read && next.steps.parry && next.steps.counter;
    next.visible = true;
    if (next.completed) {
      next.mode = 'complete';
      next.headline = '首戰教學完成';
      next.hint = '完美格擋加快破勢；之後主要靠睇動作判斷';
    }
  } else if (event.type === 'enemy-defeated' && next.stage === 1 && !next.completed) {
    const learnedCoreLoop = next.steps.read && next.steps.parry && next.steps.counter;
    next.completed = learnedCoreLoop;
    if (learnedCoreLoop) {
      next.mode = 'complete';
      next.visible = true;
      next.headline = '第一關完成';
      next.hint = '記住：讀刀 → 格擋 → 反擊；連續格擋會破勢';
    } else {
      next.mode = null;
      next.visible = false;
      next.headline = '第一關完成';
      next.hint = '未完成格擋練習；下次首戰會繼續引導';
    }
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

export function guideCueForEvent(event) {
  if (!event?.type) return null;
  const detail = event.detail || {};
  if (event.type === 'stage-start' && Number(detail.stage) === 2) {
    return { title: 'RONIN · 假動作', detail: '等最後刀路先格擋', kind: 'stage', duration: 1700 };
  }
  if (event.type === 'parry') {
    return { title: '格擋成功', detail: '依家掃屏反擊', kind: 'opening', duration: 900 };
  }
  if (event.type === 'perfect-parry') {
    return { title: '完美格擋', detail: '自動補刀後仲可再掃', kind: 'opening', duration: 1000 };
  }
  if (event.type === 'perfect-riposte') {
    return { title: '自動補刀 -1', detail: '仲有一次掃屏反擊', kind: 'opening', duration: 1050 };
  }
  if (event.type === 'backstep-evade') {
    return { title: 'STEP 成功', detail: '短斬落空 · 掃屏反擊', kind: 'opening', duration: 950 };
  }
  if (event.type === 'enemy-guard-break') {
    return { title: '破勢', detail: '掃屏反擊 +2', kind: 'opening', duration: 1050 };
  }
  if (['stage-clear', 'victory', 'defeat', 'player-hit'].includes(event.type)) {
    return { hide: true };
  }
  if (event.type === 'counter' && !detail.automatic) {
    return { hide: true };
  }
  return null;
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

    .combat-guide-button{position:absolute;z-index:24;top:calc(var(--safe-top) + 6px);right:calc(var(--safe-right) + 6px);min-width:58px;min-height:42px;padding:0 12px;border:1px solid rgba(239,196,129,.3);border-radius:12px;background:rgba(8,9,12,.72);color:#ffe0a6;font-size:13px;font-weight:850;letter-spacing:.06em;box-shadow:0 8px 24px rgba(0,0,0,.24);backdrop-filter:blur(8px);cursor:pointer}
    .combat-guide-button:active{transform:scale(.97)}
    .combat-guide-sheet{position:absolute;z-index:29;inset:0;overflow-y:auto;overscroll-behavior:contain;touch-action:pan-y;padding:calc(var(--safe-top) + 16px) calc(var(--safe-right) + 14px) calc(var(--safe-bottom) + 28px) calc(var(--safe-left) + 14px);background:linear-gradient(180deg,rgba(7,8,11,.985),rgba(18,12,12,.985));color:#f6efe5}
    .combat-guide-sheet[hidden]{display:none}
    .combat-guide__inner{width:min(100%,430px);margin:0 auto}
    .combat-guide__head{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:12px;margin:-4px -2px 12px;padding:4px 2px 10px;background:linear-gradient(180deg,rgba(7,8,11,.99) 72%,transparent)}
    .combat-guide__head p{margin:0;color:rgba(239,196,129,.72);font-size:10px;font-weight:850;letter-spacing:.16em}
    .combat-guide__head h2{margin:4px 0 0;font:600 clamp(28px,9vw,40px)/1 Georgia,"Times New Roman",serif}
    .combat-guide__close{width:46px;height:46px;flex:0 0 46px;border:1px solid rgba(255,255,255,.16);border-radius:50%;background:rgba(255,255,255,.05);font-size:24px;line-height:1;cursor:pointer}
    .combat-guide__loop{margin:0 0 12px;padding:12px 14px;border:1px solid rgba(126,174,255,.26);border-radius:14px;background:rgba(88,128,194,.08);color:#e6efff;font-size:14px;font-weight:800;line-height:1.45;text-align:center}
    .combat-guide__cards{display:grid;gap:9px}
    .combat-guide-card{padding:13px 14px;border:1px solid rgba(255,239,215,.13);border-radius:14px;background:rgba(255,255,255,.035)}
    .combat-guide-card--accent{border-color:rgba(239,196,129,.32);background:rgba(181,65,45,.09)}
    .combat-guide-card strong{display:block;font-size:14px;line-height:1.25;color:#fff4df}
    .combat-guide-card span{display:block;margin-top:6px;color:rgba(239,232,220,.72);font-size:12.5px;line-height:1.55}
    .combat-guide__note{margin:13px 2px 0;color:rgba(239,232,220,.48);font-size:11px;line-height:1.5;text-align:center}

    .combat-action-cue{position:absolute;z-index:10;left:50%;bottom:calc(var(--safe-bottom) + 112px);width:min(68vw,250px);transform:translate(-50%,7px);padding:9px 12px;border:1px solid rgba(126,174,255,.28);border-radius:13px;background:rgba(7,8,12,.76);box-shadow:0 10px 26px rgba(0,0,0,.25);backdrop-filter:blur(8px);text-align:center;pointer-events:none;opacity:0;transition:opacity .12s ease,transform .12s ease;text-shadow:0 2px 10px #000}
    .combat-action-cue[hidden]{display:none}
    .combat-action-cue.is-visible{opacity:1;transform:translate(-50%,0)}
    .combat-action-cue strong{display:block;color:#fff4df;font-size:15px;line-height:1.15;letter-spacing:.04em}
    .combat-action-cue span{display:block;margin-top:3px;color:#cfe0ff;font-size:12px;line-height:1.25}
    .combat-action-cue[data-kind="stage"]{border-color:rgba(239,196,129,.32)}
    .combat-action-cue[data-kind="stage"] span{color:#ffe0a6}

    @media (max-width:360px){
      .coach-panel{width:154px;padding:8px 9px}.coach__hint{font-size:7.5px}
      .combat-guide-sheet{padding-left:calc(var(--safe-left) + 10px);padding-right:calc(var(--safe-right) + 10px)}
      .combat-guide-card{padding:11px 12px}.combat-guide-card strong{font-size:13.5px}.combat-guide-card span{font-size:12px}
      .combat-action-cue{bottom:calc(var(--safe-bottom) + 104px);width:min(72vw,230px)}
    }
    @media (prefers-reduced-motion:reduce){
      .coach-panel,.combat-action-cue{transition:none}.combat-guide-button:active{transform:none}
    }
  `;
  document.head.append(style);
}

function installUi() {
  const app = document.querySelector('#app');
  const startScreen = document.querySelector('#start-screen');
  const startButton = document.querySelector('#start-button');
  if (!app || !startScreen || !startButton) {
    return { panel: null, toggle: null, guideButton: null, guideSheet: null, actionCue: null };
  }

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

  let guideButton = document.querySelector('#combat-guide-button');
  if (!guideButton) {
    guideButton = document.createElement('button');
    guideButton.id = 'combat-guide-button';
    guideButton.className = 'combat-guide-button';
    guideButton.type = 'button';
    guideButton.textContent = '玩法';
    guideButton.setAttribute('aria-controls', 'combat-guide-sheet');
    guideButton.setAttribute('aria-expanded', 'false');
    startScreen.append(guideButton);
  }

  let guideSheet = document.querySelector('#combat-guide-sheet');
  if (!guideSheet) {
    guideSheet = document.createElement('section');
    guideSheet.id = 'combat-guide-sheet';
    guideSheet.className = 'combat-guide-sheet';
    guideSheet.hidden = true;
    guideSheet.setAttribute('aria-label', '玩法說明');
    guideSheet.innerHTML = `
      <div class="combat-guide__inner">
        <header class="combat-guide__head">
          <div><p>COMBAT GUIDE</p><h2>玩法說明</h2></div>
          <button class="combat-guide__close" type="button" aria-label="關閉玩法說明">×</button>
        </header>
        <div class="combat-guide__loop">讀刀 → 同方向點邊緣格擋 → 掃屏反擊</div>
        <div class="combat-guide__cards">
          ${GUIDE_CARDS.map((card) => `<article class="combat-guide-card${card.accent ? ' combat-guide-card--accent' : ''}"><strong>${card.title}</strong><span>${card.body}</span></article>`).join('')}
        </div>
        <p class="combat-guide__note">實戰畫面只保留短暫關鍵提示，避免再用大量細字遮住刀路。</p>
      </div>`;
    app.append(guideSheet);
  }

  let actionCue = document.querySelector('#combat-action-cue');
  if (!actionCue) {
    actionCue = document.createElement('div');
    actionCue.id = 'combat-action-cue';
    actionCue.className = 'combat-action-cue';
    actionCue.hidden = true;
    actionCue.setAttribute('aria-live', 'polite');
    actionCue.innerHTML = '<strong></strong><span></span>';
    app.append(actionCue);
  }

  const closeGuide = () => {
    guideSheet.hidden = true;
    guideButton.setAttribute('aria-expanded', 'false');
  };
  const openGuide = () => {
    guideSheet.hidden = false;
    guideSheet.scrollTop = 0;
    guideButton.setAttribute('aria-expanded', 'true');
  };

  guideButton.addEventListener('click', openGuide);
  guideSheet.querySelector('.combat-guide__close')?.addEventListener('click', closeGuide);
  guideSheet.addEventListener('click', (event) => {
    if (event.target === guideSheet) closeGuide();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !guideSheet.hidden) closeGuide();
  });

  return { panel, toggle, guideButton, guideSheet, actionCue };
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

function renderActionCue(actionCue, profile) {
  if (!actionCue || !profile) return;
  if (actionCueTimer !== null) {
    clearTimeout(actionCueTimer);
    actionCueTimer = null;
  }
  if (profile.hide) {
    actionCue.classList.remove('is-visible');
    actionCue.hidden = true;
    return;
  }

  actionCue.hidden = false;
  actionCue.dataset.kind = profile.kind || 'opening';
  actionCue.querySelector('strong').textContent = profile.title;
  actionCue.querySelector('span').textContent = profile.detail;
  requestAnimationFrame(() => actionCue.classList.add('is-visible'));
  actionCueTimer = window.setTimeout(() => {
    actionCue.classList.remove('is-visible');
    actionCueTimer = window.setTimeout(() => {
      actionCue.hidden = true;
      actionCueTimer = null;
    }, 140);
  }, profile.duration || 900);
}

export function installOnboardingCoach() {
  if (typeof document === 'undefined' || CombatEngine.prototype[patched]) return;

  guideEnabled = readPreference();
  const { panel, toggle, guideButton, guideSheet, actionCue } = installUi();
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
    if (actionCueTimer !== null) {
      clearTimeout(actionCueTimer);
      actionCueTimer = null;
    }
    if (panel) panel.hidden = true;
    if (actionCue) {
      actionCue.classList.remove('is-visible');
      actionCue.hidden = true;
    }
    return originalStart.call(this, now);
  };

  CombatEngine.prototype.drainEvents = function onboardingDrainEvents() {
    const events = originalDrainEvents.call(this);
    let state = sessions.get(this);
    if (!state) return events;

    for (const event of events) {
      renderActionCue(actionCue, guideCueForEvent(event));
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
  document.documentElement.dataset.gameplayGuideReady = String(Boolean(guideButton && guideSheet && actionCue));
}

if (typeof document !== 'undefined') installOnboardingCoach();
