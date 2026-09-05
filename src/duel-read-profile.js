import { CombatEngine } from './game-core.js';

const installed = Symbol.for('blade-reversal.duel-read-profile-v1');
const CHALLENGE_ACTIVE = Symbol.for('blade-reversal.challenge-active-v1');
const PRACTICE_DIRECTION_LABELS = Object.freeze({
  top: '上方',
  right: '右方',
  bottom: '下方',
  left: '左方',
});

export const DUEL_READ_PROFILES = Object.freeze({
  'ashigaru-scout': Object.freeze({
    id: 'ashigaru',
    glyph: '直',
    title: '直斬試探',
    tell: '節奏較穩 · 四向基本刀路',
    response: '先睇刀身起點，刀路確定先格擋',
  }),
  'wandering-ronin': Object.freeze({
    id: 'ronin',
    glyph: '詐',
    title: '假動作',
    tell: '第一下起手可能只係誘導',
    response: '等最後方向先落手，唔好追第一下',
  }),
  'oni-guard': Object.freeze({
    id: 'oni',
    glyph: '重',
    title: '重斬壓迫',
    tell: '慢起手後急落 · 重擊會追距',
    response: '遠距都唔代表安全，守住落刀一刻',
  }),
  'crimson-shogun': Object.freeze({
    id: 'shogun',
    glyph: '將',
    title: '快慢交錯',
    tell: '重斬同假動作會連住出',
    response: '先守節奏，唔好預判下一刀',
  }),
});

export const BLOOD_MOON_READ_PROFILE = Object.freeze({
  id: 'blood-moon',
  glyph: '月',
  title: '血月壓迫',
  tell: '節奏更緊 · 假動作同重斬混合',
  response: '只跟眼前刀路，留意最後變向',
});

export function duelReadProfileForEnemy(enemyId, { bloodMoon = false } = {}) {
  if (bloodMoon && enemyId === 'crimson-shogun') return BLOOD_MOON_READ_PROFILE;
  return DUEL_READ_PROFILES[String(enemyId || '')] || null;
}

function practiceRouteKey(detail = {}) {
  if (!detail?.practice) return null;
  if (detail.practiceMode) return `mode:${detail.practiceMode}`;
  const enemyId = detail.practiceEnemyId || detail.enemyId;
  return enemyId ? `enemy:${enemyId}` : null;
}

export function duelPracticeFocusForStageStart(detail = {}, root = globalThis.document?.documentElement) {
  const routeKey = practiceRouteKey(detail);
  if (!routeKey || !root?.dataset || root.dataset.practiceProgressRoute !== routeKey) return null;

  const state = root.dataset.practiceProgressFocusState;
  if (state === 'clear') {
    return Object.freeze({
      state: 'clear',
      direction: null,
      label: '已見刀路',
      text: '今局修行 · 已見刀路守穩 · 挑戰 Perfect',
    });
  }

  if (state !== 'target') return null;
  const direction = root.dataset.practiceProgressFocusDirection;
  const label = PRACTICE_DIRECTION_LABELS[direction];
  if (!label) return null;
  return Object.freeze({
    state: 'target',
    direction,
    label,
    text: `今局修行 · ${label} · 先守穩再反擊`,
  });
}

function duelReadProfileSuppressedForRoot(root) {
  return (
    root?.dataset?.challengeActive === 'true' ||
    root?.dataset?.nextRunMode === 'challenge'
  );
}

export function duelReadProfileSuppressedForRun(engine, root = globalThis.document?.documentElement) {
  return engine?.[CHALLENGE_ACTIVE] === true || duelReadProfileSuppressedForRoot(root);
}

function ensureStyles(documentRef) {
  if (!documentRef?.head || documentRef.querySelector('style[data-duel-read-profile]')) return;
  const style = documentRef.createElement('style');
  style.dataset.duelReadProfile = 'true';
  style.textContent = `
    .duel-read-profile{
      position:absolute;z-index:7;top:calc(var(--safe-top) + 114px);left:50%;width:min(76vw,246px);
      display:grid;grid-template-columns:38px minmax(0,1fr);gap:8px;align-items:center;padding:8px 10px;
      transform:translateX(-50%);border:1px solid rgba(228,182,107,.25);border-radius:13px;
      background:linear-gradient(110deg,rgba(70,42,19,.78),rgba(9,11,15,.88) 58%);box-shadow:0 10px 28px rgba(0,0,0,.35);
      color:#f5ead8;pointer-events:none;backdrop-filter:blur(6px);text-align:left;
    }
    .duel-read-profile[hidden]{display:none!important}
    .duel-read-profile__glyph{display:grid;place-items:center;width:34px;height:34px;border:1px solid rgba(228,182,107,.35);border-radius:50%;color:#f3cf91;font:800 18px/1 Georgia,"Times New Roman",serif;background:rgba(228,182,107,.08)}
    .duel-read-profile__copy{min-width:0}.duel-read-profile__copy strong,.duel-read-profile__copy span{display:block}
    .duel-read-profile__copy strong{font-size:10.5px;letter-spacing:.08em;color:#f6e8cf}
    .duel-read-profile__tell{margin-top:2px;font-size:9px;line-height:1.25;color:rgba(246,235,216,.72)}
    .duel-read-profile__response{margin-top:3px;font-size:8.5px;line-height:1.25;color:rgba(176,205,245,.78)}
    .duel-read-profile__practice{margin-top:4px;padding-top:4px;border-top:1px solid rgba(184,229,198,.16);font-size:8px;line-height:1.25;color:rgba(195,232,204,.88)}
    .duel-read-profile__practice[hidden]{display:none!important}
    @media(max-width:360px){.duel-read-profile{top:calc(var(--safe-top) + 110px);width:min(78vw,238px);padding:7px 9px}.duel-read-profile__tell{font-size:8.5px}.duel-read-profile__response{font-size:8px}.duel-read-profile__practice{font-size:7.7px}}
  `;
  documentRef.head.append(style);
}

function ensureUi(documentRef) {
  const host = documentRef?.querySelector?.('#app') || documentRef?.body;
  if (!host) return null;
  ensureStyles(documentRef);
  let card = documentRef.querySelector('#duel-read-profile');
  if (!card) {
    card = documentRef.createElement('aside');
    card.id = 'duel-read-profile';
    card.className = 'duel-read-profile';
    card.hidden = true;
    card.setAttribute('aria-live', 'polite');
    card.setAttribute('aria-label', '今場敵式提示');
    card.innerHTML = '<div class="duel-read-profile__glyph" data-duel-read-glyph></div><div class="duel-read-profile__copy"><strong data-duel-read-title></strong><span class="duel-read-profile__tell" data-duel-read-tell></span><span class="duel-read-profile__response" data-duel-read-response></span><span class="duel-read-profile__practice" data-duel-read-practice hidden></span></div>';
    host.append(card);
  }
  return card;
}

function hideProfile(documentRef) {
  const card = documentRef?.querySelector?.('#duel-read-profile');
  if (card) card.hidden = true;
  const root = documentRef?.documentElement;
  if (root) {
    root.dataset.duelReadProfileState = 'hidden';
    delete root.dataset.duelReadPracticeFocusState;
    delete root.dataset.duelReadPracticeFocusDirection;
  }
}

export function renderDuelReadProfile(profile, documentRef = globalThis.document, practiceFocus = null) {
  if (!profile || !documentRef) {
    hideProfile(documentRef);
    return false;
  }
  const root = documentRef.documentElement;
  if (duelReadProfileSuppressedForRoot(root)) {
    hideProfile(documentRef);
    return false;
  }
  const card = ensureUi(documentRef);
  if (!card) return false;
  card.querySelector('[data-duel-read-glyph]').textContent = profile.glyph;
  card.querySelector('[data-duel-read-title]').textContent = `敵式 · ${profile.title}`;
  card.querySelector('[data-duel-read-tell]').textContent = profile.tell;
  card.querySelector('[data-duel-read-response]').textContent = `應對 · ${profile.response}`;
  const practiceNode = card.querySelector('[data-duel-read-practice]');
  if (practiceNode) {
    practiceNode.textContent = practiceFocus?.text || '';
    practiceNode.hidden = !practiceFocus;
  }
  card.dataset.profile = profile.id;
  if (practiceFocus) card.dataset.practiceFocus = practiceFocus.state === 'clear' ? 'clear' : practiceFocus.direction;
  else delete card.dataset.practiceFocus;
  card.hidden = false;
  if (root) {
    root.dataset.duelReadProfile = profile.id;
    root.dataset.duelReadProfileState = 'visible';
    if (practiceFocus) {
      root.dataset.duelReadPracticeFocusState = practiceFocus.state;
      if (practiceFocus.direction) root.dataset.duelReadPracticeFocusDirection = practiceFocus.direction;
      else delete root.dataset.duelReadPracticeFocusDirection;
    } else {
      delete root.dataset.duelReadPracticeFocusState;
      delete root.dataset.duelReadPracticeFocusDirection;
    }
  }
  return true;
}

export function installDuelReadProfile(Engine = CombatEngine, documentRef = globalThis.document) {
  if (!documentRef || !Engine?.prototype || Engine.prototype[installed]) return;
  ensureUi(documentRef);
  const originalStart = Engine.prototype.start;
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.start = function duelReadProfileStart(now = 0) {
    const result = originalStart.call(this, now);
    if (duelReadProfileSuppressedForRun(this, documentRef.documentElement)) {
      hideProfile(documentRef);
    }
    return result;
  };

  Engine.prototype.drainEvents = function duelReadProfileDrainEvents() {
    const events = originalDrainEvents.call(this);
    const challengeRun = duelReadProfileSuppressedForRun(this, documentRef.documentElement);
    for (const event of events) {
      if (challengeRun && (event.type === 'stage-start' || event.type === 'boss-phase')) {
        hideProfile(documentRef);
        continue;
      }
      if (event.type === 'stage-start') {
        renderDuelReadProfile(
          duelReadProfileForEnemy(event.detail?.enemyId),
          documentRef,
          duelPracticeFocusForStageStart(event.detail, documentRef.documentElement),
        );
      } else if (
        event.type === 'boss-phase' &&
        Number(event.detail?.phase) === 2 &&
        this.phase === 'stage-intro'
      ) {
        renderDuelReadProfile(
          duelReadProfileForEnemy('crimson-shogun', { bloodMoon: true }),
          documentRef,
          duelPracticeFocusForStageStart(event.detail, documentRef.documentElement),
        );
      } else if (event.type === 'telegraph' || event.type === 'victory' || event.type === 'defeat' || event.type === 'reset') {
        hideProfile(documentRef);
      }
    }
    return events;
  };

  documentRef.documentElement.dataset.duelReadProfileReady = 'true';
}

if (typeof document !== 'undefined') installDuelReadProfile();
