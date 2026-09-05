import { CombatEngine } from './game-core.js';

const patched = Symbol.for('blade-reversal.perfect-technique-cue-v1');

export function perfectTechniqueCueForEvent(event) {
  if (!event?.type) return null;
  const detail = event.detail || {};

  if (event.type === 'perfect-parry') {
    return {
      kind: 'perfect-parry',
      title: 'PERFECT PARRY',
      detail: '正面截刀 · 敵勢大增 · 自動返刀',
    };
  }

  if (event.type === 'counter' && detail.perfectStep) {
    if (detail.bossPhase === 2) {
      return {
        kind: 'perfect-step',
        title: 'PERFECT STEP',
        detail: '閃身補刀 · BLOOD MOON 先行',
      };
    }
    if (detail.defeated || Number(detail.enemyHp) <= 0) {
      return {
        kind: 'perfect-step',
        title: 'PERFECT STEP',
        detail: '閃身補刀 · 擊倒',
      };
    }
    return {
      kind: 'perfect-step',
      title: 'PERFECT STEP',
      detail: '側身避刃 · 無敵勢 · 仲可掃屏',
    };
  }

  return null;
}

export function installPerfectTechniqueCueStyles() {
  if (typeof document === 'undefined' || document.querySelector('style[data-perfect-technique-cue]')) return;
  const style = document.createElement('style');
  style.dataset.perfectTechniqueCue = 'true';
  style.textContent = `
    .combat-action-cue[data-kind="perfect-parry"],.combat-action-cue[data-kind="perfect-step"]{overflow:hidden;isolation:isolate}
    .combat-action-cue[data-kind="perfect-parry"]{border-color:rgba(148,210,255,.58);background:radial-gradient(circle at 50% 0%,rgba(131,203,255,.20),transparent 58%),rgba(7,10,16,.84);box-shadow:0 0 0 1px rgba(214,239,255,.05),0 0 28px rgba(91,172,255,.18),0 10px 26px rgba(0,0,0,.27)}
    .combat-action-cue[data-kind="perfect-parry"]::before{content:'破';position:absolute;left:10px;top:50%;transform:translateY(-50%) rotate(-8deg);font:700 34px/1 Georgia,"Times New Roman",serif;color:rgba(183,225,255,.12);z-index:-1}
    .combat-action-cue[data-kind="perfect-parry"] strong{color:#eef8ff;letter-spacing:.075em;text-shadow:0 0 12px rgba(148,210,255,.42)}
    .combat-action-cue[data-kind="perfect-parry"] span{color:#cfe8ff}
    .combat-action-cue[data-kind="perfect-step"]{border-color:rgba(150,226,178,.52);background:linear-gradient(105deg,rgba(89,176,133,.18),transparent 34%,rgba(7,12,12,.86) 58%),rgba(7,12,12,.84);box-shadow:0 0 0 1px rgba(210,255,226,.04),0 0 26px rgba(96,213,145,.14),0 10px 26px rgba(0,0,0,.27)}
    .combat-action-cue[data-kind="perfect-step"]::before{content:'閃';position:absolute;right:9px;top:50%;transform:translateY(-50%) skewX(-12deg);font:700 31px/1 Georgia,"Times New Roman",serif;color:rgba(174,244,199,.11);z-index:-1}
    .combat-action-cue[data-kind="perfect-step"]::after{content:'';position:absolute;left:-12%;top:48%;width:34%;height:1px;background:linear-gradient(90deg,transparent,rgba(177,255,206,.52),transparent);transform:skewX(-24deg);opacity:.75;z-index:-1}
    .combat-action-cue[data-kind="perfect-step"] strong{color:#ebfff2;letter-spacing:.075em;text-shadow:0 0 12px rgba(139,236,174,.35)}
    .combat-action-cue[data-kind="perfect-step"] span{color:#ccefd8}
    @media(prefers-reduced-motion:reduce){.combat-action-cue[data-kind="perfect-step"]::after{display:none}}
  `;
  document.head.append(style);
}

export function applyPerfectTechniqueCue(cue, profile) {
  if (!cue || !profile) return false;
  const title = cue.querySelector('strong');
  const body = cue.querySelector('span');
  if (!title || !body) return false;

  cue.dataset.kind = profile.kind;
  title.textContent = profile.title;
  body.textContent = profile.detail;
  cue.hidden = false;
  cue.classList.add('is-visible');
  document.documentElement.dataset.perfectTechniqueLast = profile.kind;
  return true;
}

export function installPerfectTechniqueCue(Engine = CombatEngine) {
  if (typeof document === 'undefined' || !Engine?.prototype || Engine.prototype[patched]) return;
  installPerfectTechniqueCueStyles();
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, patched, { value: true });

  Engine.prototype.drainEvents = function perfectTechniqueDrainEvents() {
    const events = originalDrainEvents.call(this);
    let profile = null;
    for (const event of events) {
      const candidate = perfectTechniqueCueForEvent(event);
      if (candidate) profile = candidate;
    }
    if (profile) applyPerfectTechniqueCue(document.querySelector('#combat-action-cue'), profile);
    return events;
  };

  document.documentElement.dataset.perfectTechniqueCueReady = 'true';
}

if (typeof document !== 'undefined') installPerfectTechniqueCue();
