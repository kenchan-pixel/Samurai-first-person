import { CombatEngine, DIRECTIONS } from './game-core.js';

const PREF_KEY = 'blade-reversal-timing-assist-v1';
const installed = Symbol.for('blade-reversal.timing-assist-v1');
const HIDDEN_FRAME = Object.freeze({ visible: false, phase: 'hidden', direction: null, scale: 1 });
let enabled = false;
let latestFrame = HIDDEN_FRAME;
let activeEngine = null;
let activeNow = 0;
let toggleElement = null;
let ringElement = null;
let markerElement = null;
let labelElement = null;
let lastRender = {
  enabled: null,
  visible: null,
  phase: null,
  direction: null,
  visualScale: null,
  logicalScale: null,
};

function clamp01(value) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

function smooth(value) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

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
    // The assist remains available for this page when storage is blocked.
  }
}

function reducedMotion() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function timingAssistFrame(engine, now) {
  if (!engine?.started || !engine.currentAttack) return HIDDEN_FRAME;
  const direction = engine.phase === 'telegraph'
    ? engine.currentAttack.displayedDirection
    : engine.currentAttack.direction;
  if (!DIRECTIONS.includes(direction)) return HIDDEN_FRAME;

  if (engine.phase === 'telegraph') {
    const progress = clamp01(engine.phaseProgress(now));
    return {
      visible: true,
      phase: 'telegraph',
      direction,
      scale: 1 + 0.62 * (1 - smooth(progress)),
      progress,
      perfect: false,
    };
  }

  if (engine.phase === 'strike') {
    const elapsed = Math.max(0, now - (engine.currentAttack.strikeStartedAt || now));
    const perfectWindow = Math.max(0, Number(engine.enemy?.perfectWindowMs) || 0);
    const perfect = elapsed <= perfectWindow;
    return {
      visible: true,
      phase: perfect ? 'perfect' : 'strike',
      direction,
      scale: 1,
      progress: clamp01(engine.phaseProgress(now)),
      perfect,
    };
  }

  return HIDDEN_FRAME;
}

function installStyles() {
  if (typeof document === 'undefined' || document.querySelector('style[data-timing-assist]')) return;
  const style = document.createElement('style');
  style.dataset.timingAssist = 'true';
  style.textContent = `
    .timing-assist-toggle{position:absolute;z-index:24;top:calc(var(--safe-top) + 54px);left:calc(var(--safe-left) + 6px);min-width:92px;min-height:38px;padding:0 9px;border:1px solid rgba(255,255,255,.18);border-radius:11px;background:rgba(8,9,12,.72);color:rgba(244,240,231,.72);font-size:9px;font-weight:850;letter-spacing:.04em;box-shadow:0 8px 22px rgba(0,0,0,.22);backdrop-filter:blur(8px);cursor:pointer}
    .timing-assist-toggle[aria-pressed="true"]{border-color:rgba(111,206,255,.58);background:rgba(19,70,92,.48);color:#dff7ff;box-shadow:0 0 20px rgba(75,195,255,.12)}
    .timing-assist-toggle:active{transform:scale(.97)}
    .timing-assist-layer{position:absolute;z-index:6;inset:0;pointer-events:none;overflow:hidden}
    .timing-assist-ring{--timing-scale:1.62;position:absolute;left:50%;top:46%;width:106px;height:106px;transform:translate(-50%,-50%);opacity:0;transition:opacity .1s ease;color:#b9eaff;filter:drop-shadow(0 0 6px rgba(105,204,255,.28))}
    .timing-assist-ring.is-visible{opacity:.92}
    .timing-assist-target,.timing-assist-sweep{position:absolute;inset:0;border-radius:50%;box-sizing:border-box}
    .timing-assist-target{border:1px solid rgba(220,244,255,.34);box-shadow:inset 0 0 10px rgba(90,194,255,.05)}
    .timing-assist-sweep{border:3px solid currentColor;transform:scale(var(--timing-scale));box-shadow:0 0 12px rgba(93,207,255,.38);will-change:transform}
    .timing-assist-marker{position:absolute;display:grid;place-items:center;width:28px;height:28px;margin:-14px;font-size:18px;font-weight:900;color:#fff;text-shadow:0 0 8px currentColor}
    .timing-assist-ring[data-direction="top"] .timing-assist-marker{left:50%;top:0}.timing-assist-ring[data-direction="right"] .timing-assist-marker{right:0;top:50%}.timing-assist-ring[data-direction="bottom"] .timing-assist-marker{left:50%;bottom:0}.timing-assist-ring[data-direction="left"] .timing-assist-marker{left:0;top:50%}
    .timing-assist-label{position:absolute;left:50%;top:100%;transform:translate(-50%,8px);min-width:44px;padding:3px 7px;border-radius:999px;background:rgba(6,9,13,.72);border:1px solid rgba(190,232,255,.22);font-size:9px;font-weight:900;line-height:1;text-align:center;white-space:nowrap;color:#dff6ff;text-shadow:0 1px 5px #000}
    .timing-assist-ring[data-phase="perfect"]{color:#fff2a2;filter:drop-shadow(0 0 9px rgba(255,225,89,.65))}.timing-assist-ring[data-phase="perfect"] .timing-assist-sweep{border-width:4px;box-shadow:0 0 16px rgba(255,225,89,.68)}.timing-assist-ring[data-phase="perfect"] .timing-assist-label{color:#fff5bd;border-color:rgba(255,225,89,.42)}
    .timing-assist-ring[data-phase="strike"]{color:#ffb0a1;filter:drop-shadow(0 0 8px rgba(255,90,65,.5))}.timing-assist-ring[data-phase="strike"] .timing-assist-label{color:#ffd8cf;border-color:rgba(255,105,80,.35)}
    @media(max-width:360px){.timing-assist-toggle{min-width:84px;min-height:36px;padding:0 8px;font-size:8.5px}.timing-assist-ring{width:96px;height:96px}}
    @media(prefers-reduced-motion:reduce){.timing-assist-toggle:active{transform:none}.timing-assist-ring{transition:none}.timing-assist-sweep{will-change:auto}}
  `;
  document.head.append(style);
}

function marker(direction) {
  return { top: '↑', right: '→', bottom: '↓', left: '←' }[direction] || '';
}

function phaseLabel(phase) {
  return { telegraph: '準備', perfect: '完美', strike: '格擋' }[phase] || '';
}

function renderFrame(frame = latestFrame, force = false) {
  if (typeof document === 'undefined') return;
  latestFrame = frame || HIDDEN_FRAME;
  const visible = Boolean(enabled && latestFrame.visible);
  const phase = visible ? latestFrame.phase : 'hidden';
  const direction = visible ? latestFrame.direction : '';
  const rawScale = visible ? Number(latestFrame.scale || 1) : 1;
  const visualScale = reducedMotion() && phase === 'telegraph' ? 1.18 : rawScale;
  const visualScaleText = String(visualScale);
  const logicalScaleText = visible ? rawScale.toFixed(3) : '1.000';

  if (toggleElement && (force || lastRender.enabled !== enabled)) {
    toggleElement.setAttribute('aria-pressed', String(enabled));
    toggleElement.textContent = `節拍提示：${enabled ? '開' : '關'}`;
  }

  if (ringElement) {
    if (force || lastRender.visible !== visible) ringElement.classList.toggle('is-visible', visible);
    if (force || lastRender.phase !== phase) {
      ringElement.dataset.phase = phase;
      if (labelElement) labelElement.textContent = phaseLabel(phase);
    }
    if (force || lastRender.direction !== direction) {
      ringElement.dataset.direction = direction;
      if (markerElement) markerElement.textContent = marker(direction);
    }
    if (force || lastRender.visualScale !== visualScaleText) {
      ringElement.style.setProperty('--timing-scale', visualScaleText);
    }
  }

  const root = document.documentElement;
  if (force || lastRender.enabled !== enabled) root.dataset.timingAssist = enabled ? 'on' : 'off';
  if (force || lastRender.phase !== phase) root.dataset.timingAssistPhase = visible ? latestFrame.phase : 'hidden';
  if (force || lastRender.direction !== direction) root.dataset.timingAssistDirection = visible ? latestFrame.direction : 'none';
  if (force || lastRender.logicalScale !== logicalScaleText) root.dataset.timingAssistScale = logicalScaleText;

  lastRender = {
    enabled,
    visible,
    phase,
    direction,
    visualScale: visualScaleText,
    logicalScale: logicalScaleText,
  };
}

function markStartLayout() {
  if (typeof document === 'undefined') return;
  requestAnimationFrame(() => {
    if (!toggleElement) return;
    const rect = toggleElement.getBoundingClientRect();
    const fits = rect.left >= 0 && rect.top >= 0 && rect.right <= window.innerWidth && rect.bottom <= window.innerHeight;
    document.documentElement.dataset.timingAssistStartLayout = fits ? 'pass' : 'fail';
  });
}

function syncEngine(engine, now) {
  activeEngine = engine;
  activeNow = Number.isFinite(now) ? now : 0;
  if (!enabled) return;
  latestFrame = timingAssistFrame(engine, activeNow);
  renderFrame(latestFrame);
}

function installUi() {
  if (typeof document === 'undefined') return;
  const app = document.querySelector('#app');
  const startScreen = document.querySelector('#start-screen');
  if (!app || !startScreen) return;
  installStyles();

  let layer = document.querySelector('#timing-assist-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'timing-assist-layer';
    layer.className = 'timing-assist-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = '<div id="timing-assist-ring" class="timing-assist-ring" data-phase="hidden" data-direction=""><div class="timing-assist-target"></div><div class="timing-assist-sweep"></div><span class="timing-assist-marker"></span><span class="timing-assist-label"></span></div>';
    app.append(layer);
  }

  ringElement = document.querySelector('#timing-assist-ring');
  markerElement = ringElement?.querySelector('.timing-assist-marker') || null;
  labelElement = ringElement?.querySelector('.timing-assist-label') || null;

  let toggle = document.querySelector('#timing-assist-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.id = 'timing-assist-toggle';
    toggle.className = 'timing-assist-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', '切換格擋節拍提示');
    startScreen.append(toggle);
    toggle.addEventListener('click', () => {
      enabled = !enabled;
      writePreference(enabled);
      if (enabled && activeEngine) {
        syncEngine(activeEngine, activeNow);
      } else {
        latestFrame = HIDDEN_FRAME;
        renderFrame(HIDDEN_FRAME);
      }
    });
  }
  toggleElement = toggle;

  renderFrame(HIDDEN_FRAME, true);
  markStartLayout();
}

export function installTimingAssist(Engine = CombatEngine) {
  enabled = readPreference();
  if (typeof document !== 'undefined') installUi();
  if (!Engine?.prototype || Engine.prototype[installed]) {
    if (typeof document !== 'undefined') document.documentElement.dataset.timingAssistReady = 'true';
    return;
  }

  const originalStart = Engine.prototype.start;
  const originalReset = Engine.prototype.reset;
  const originalUpdate = Engine.prototype.update;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.start = function timingAssistStart(now = 0) {
    const result = originalStart.call(this, now);
    syncEngine(this, now);
    return result;
  };
  Engine.prototype.reset = function timingAssistReset(now = 0) {
    const result = originalReset.call(this, now);
    syncEngine(this, now);
    return result;
  };
  Engine.prototype.update = function timingAssistUpdate(now) {
    const result = originalUpdate.call(this, now);
    syncEngine(this, now);
    return result;
  };

  if (typeof document !== 'undefined') document.documentElement.dataset.timingAssistReady = 'true';
}

if (typeof document !== 'undefined') installTimingAssist();
