import { CombatEngine, DIRECTIONS } from './game-core.js';

const PREF_KEY = 'blade-reversal-blade-readability-v1';
const installed = Symbol.for('blade-reversal.blade-readability-v1');
let enabled = false;
let activeDirection = null;
let urgent = false;

function readPreference() {
  try {
    return localStorage.getItem(PREF_KEY) === 'on';
  } catch {
    return false;
  }
}

function writePreference(value) {
  try {
    localStorage.setItem(PREF_KEY, value ? 'on' : 'off');
  } catch {
    // The accessibility mode remains usable for this page when storage is unavailable.
  }
}

function installStyles() {
  if (typeof document === 'undefined' || document.querySelector('style[data-blade-readability]')) return;
  const style = document.createElement('style');
  style.dataset.bladeReadability = 'true';
  style.textContent = `
    .blade-readability-toggle{position:absolute;z-index:24;top:calc(var(--safe-top) + 6px);left:calc(var(--safe-left) + 6px);min-width:92px;min-height:42px;padding:0 10px;border:1px solid rgba(255,255,255,.2);border-radius:12px;background:rgba(8,9,12,.72);color:rgba(244,240,231,.74);font-size:10px;font-weight:850;letter-spacing:.04em;box-shadow:0 8px 24px rgba(0,0,0,.24);backdrop-filter:blur(8px);cursor:pointer}
    .blade-readability-toggle[aria-pressed="true"]{border-color:rgba(255,226,118,.62);background:rgba(78,65,14,.5);color:#fff5ad;box-shadow:0 0 0 1px rgba(255,255,255,.08),0 0 24px rgba(255,222,77,.16)}
    .blade-readability-toggle:active{transform:scale(.97)}
    .blade-read-layer{position:absolute;z-index:7;inset:0;overflow:hidden;pointer-events:none}
    .blade-read-rail{position:absolute;opacity:0;transition:opacity .12s ease,filter .12s ease,transform .12s ease;filter:drop-shadow(0 0 7px rgba(255,236,114,.72));color:#fff6a8;text-shadow:0 1px 5px #000,0 0 8px rgba(255,235,95,.9)}
    .blade-read-rail::before{content:"";position:absolute;border-radius:999px;background:currentColor;box-shadow:0 0 8px currentColor,0 0 18px rgba(255,226,70,.55)}
    .blade-read-rail span{position:absolute;display:block;min-width:38px;padding:3px 5px;border-radius:7px;background:rgba(7,8,11,.78);border:1px solid currentColor;font-size:11px;font-weight:900;line-height:1;text-align:center;white-space:nowrap}
    .blade-read-rail[data-direction="top"]{top:calc(var(--safe-top) + 106px);left:50%;width:min(48vw,180px);height:28px;transform:translateX(-50%) translateY(-3px)}
    .blade-read-rail[data-direction="top"]::before{left:0;right:0;top:3px;height:4px}.blade-read-rail[data-direction="top"] span{top:10px;left:50%;transform:translateX(-50%)}
    .blade-read-rail[data-direction="bottom"]{bottom:calc(var(--safe-bottom) + 108px);left:50%;width:min(48vw,180px);height:28px;transform:translateX(-50%) translateY(3px)}
    .blade-read-rail[data-direction="bottom"]::before{left:0;right:0;bottom:3px;height:4px}.blade-read-rail[data-direction="bottom"] span{bottom:10px;left:50%;transform:translateX(-50%)}
    .blade-read-rail[data-direction="left"]{left:calc(var(--safe-left) + 7px);top:39%;width:42px;height:29vh;max-height:172px;transform:translateX(-3px)}
    .blade-read-rail[data-direction="left"]::before{top:0;bottom:0;left:3px;width:4px}.blade-read-rail[data-direction="left"] span{left:12px;top:50%;transform:translateY(-50%)}
    .blade-read-rail[data-direction="right"]{right:calc(var(--safe-right) + 7px);top:39%;width:42px;height:29vh;max-height:172px;transform:translateX(3px)}
    .blade-read-rail[data-direction="right"]::before{top:0;bottom:0;right:3px;width:4px}.blade-read-rail[data-direction="right"] span{right:12px;top:50%;transform:translateY(-50%)}
    .blade-read-rail.is-active{opacity:.92;transform:translate(0,0)}
    .blade-read-rail[data-direction="top"].is-active,.blade-read-rail[data-direction="bottom"].is-active{transform:translateX(-50%) translateY(0)}
    .blade-read-rail.is-urgent{color:#fff;background:transparent;filter:drop-shadow(0 0 8px rgba(255,115,74,.95));animation:blade-read-pulse .34s ease-in-out infinite alternate}
    .blade-read-rail.is-urgent::before{background:#fff;box-shadow:0 0 8px #fff,0 0 20px rgba(255,72,45,.95)}
    .blade-read-rail.is-urgent span{border-color:#ffb19b;background:rgba(67,13,9,.86);color:#fff}
    @keyframes blade-read-pulse{from{opacity:.72}to{opacity:1}}
    @media(max-width:360px){.blade-readability-toggle{min-width:84px;min-height:40px;padding:0 8px;font-size:9px}.blade-read-rail span{font-size:10px}}
    @media(prefers-reduced-motion:reduce){.blade-readability-toggle:active{transform:none}.blade-read-rail{transition:none}.blade-read-rail.is-urgent{animation:none;opacity:1}}
  `;
  document.head.append(style);
}

function railLabel(direction) {
  return {
    top: '↑ 上段',
    right: '→ 右方',
    bottom: '↓ 下段',
    left: '← 左方',
  }[direction] || '';
}

function installUi() {
  if (typeof document === 'undefined') return;
  installStyles();
  const app = document.querySelector('#app');
  const startScreen = document.querySelector('#start-screen');
  if (!app || !startScreen) return;

  let layer = document.querySelector('#blade-read-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'blade-read-layer';
    layer.className = 'blade-read-layer';
    layer.setAttribute('aria-hidden', 'true');
    for (const direction of DIRECTIONS) {
      const rail = document.createElement('div');
      rail.className = 'blade-read-rail';
      rail.dataset.direction = direction;
      rail.innerHTML = `<span>${railLabel(direction)}</span>`;
      layer.append(rail);
    }
    app.append(layer);
  }

  let toggle = document.querySelector('#blade-readability-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.id = 'blade-readability-toggle';
    toggle.className = 'blade-readability-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', '切換高對比刀路提示');
    startScreen.append(toggle);
    toggle.addEventListener('click', () => {
      enabled = !enabled;
      writePreference(enabled);
      if (!enabled) clearRead();
      render();
    });
  }
  render();
  markStartLayout();
}

function markStartLayout() {
  if (typeof document === 'undefined') return;
  requestAnimationFrame(() => {
    const toggle = document.querySelector('#blade-readability-toggle');
    if (!toggle) return;
    const rect = toggle.getBoundingClientRect();
    const fits = rect.left >= 0 && rect.top >= 0 && rect.right <= window.innerWidth && rect.bottom <= window.innerHeight;
    document.documentElement.dataset.readabilityStartLayout = fits ? 'pass' : 'fail';
  });
}

function render() {
  if (typeof document === 'undefined') return;
  const toggle = document.querySelector('#blade-readability-toggle');
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.textContent = `刀路清晰：${enabled ? '開' : '關'}`;
  }
  for (const rail of document.querySelectorAll('.blade-read-rail')) {
    const active = enabled && rail.dataset.direction === activeDirection;
    rail.classList.toggle('is-active', active);
    rail.classList.toggle('is-urgent', active && urgent);
  }
  document.documentElement.dataset.readabilityMode = enabled ? 'on' : 'off';
  document.documentElement.dataset.readabilityDirection = enabled && activeDirection ? activeDirection : 'none';
  document.documentElement.dataset.readabilityUrgent = String(Boolean(enabled && activeDirection && urgent));
}

function showRead(direction, danger = false) {
  if (!DIRECTIONS.includes(direction)) return;
  activeDirection = direction;
  urgent = Boolean(danger);
  render();
}

function clearRead() {
  activeDirection = null;
  urgent = false;
  render();
}

export function applyReadabilityEvent(event) {
  if (!event?.type) return;
  const detail = event.detail || {};
  if (event.type === 'telegraph' || event.type === 'feint') {
    showRead(detail.direction, false);
    return;
  }
  if (event.type === 'strike') {
    showRead(detail.direction, true);
    return;
  }
  if (
    event.type === 'parry' ||
    event.type === 'perfect-parry' ||
    event.type === 'player-hit' ||
    event.type === 'stage-start' ||
    event.type === 'reset' ||
    event.type === 'enemy-defeated' ||
    event.type === 'victory' ||
    event.type === 'defeat'
  ) {
    clearRead();
  }
}

export function installBladeReadability(Engine = CombatEngine) {
  enabled = readPreference();
  if (typeof document !== 'undefined') installUi();
  if (!Engine?.prototype || Engine.prototype[installed]) {
    if (typeof document !== 'undefined') document.documentElement.dataset.readabilityModeReady = 'true';
    return;
  }

  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });
  Engine.prototype.drainEvents = function bladeReadabilityDrainEvents() {
    const events = originalDrainEvents.call(this);
    for (const event of events) applyReadabilityEvent(event);
    return events;
  };

  if (typeof document !== 'undefined') document.documentElement.dataset.readabilityModeReady = 'true';
}

if (typeof document !== 'undefined') installBladeReadability();
