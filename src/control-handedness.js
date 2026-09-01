export const CONTROL_HAND_STORAGE_KEY = 'blade-reversal-control-hand-v1';
export const ControlHand = Object.freeze({ RIGHT: 'right', LEFT: 'left' });

export function normalizeControlHand(value) {
  return value === ControlHand.LEFT ? ControlHand.LEFT : ControlHand.RIGHT;
}

export function oppositeControlHand(value) {
  return normalizeControlHand(value) === ControlHand.LEFT ? ControlHand.RIGHT : ControlHand.LEFT;
}

function readStoredHand(storage = globalThis.localStorage) {
  try {
    return normalizeControlHand(storage?.getItem?.(CONTROL_HAND_STORAGE_KEY));
  } catch {
    return ControlHand.RIGHT;
  }
}

function writeStoredHand(hand, storage = globalThis.localStorage) {
  try {
    storage?.setItem?.(CONTROL_HAND_STORAGE_KEY, normalizeControlHand(hand));
  } catch {
    // The setting remains usable for the current page if storage is unavailable.
  }
}

function ensureStyles() {
  if (document.querySelector('style[data-control-handedness]')) return;
  const style = document.createElement('style');
  style.dataset.controlHandedness = 'true';
  style.textContent = `
    .control-hand-toggle{position:absolute;z-index:24;top:calc(var(--safe-top) + 6px);right:calc(var(--safe-right) + 6px);min-width:92px;min-height:42px;padding:0 9px;border:1px solid rgba(255,255,255,.18);border-radius:12px;background:rgba(8,9,12,.72);color:rgba(244,240,231,.74);font-size:9.5px;font-weight:850;letter-spacing:.035em;box-shadow:0 8px 24px rgba(0,0,0,.24);backdrop-filter:blur(8px);cursor:pointer}
    .control-hand-toggle[aria-pressed="true"]{border-color:rgba(126,174,255,.55);background:rgba(46,61,101,.55);color:#e3ecff;box-shadow:0 0 20px rgba(96,146,255,.12)}
    .control-hand-toggle:active{transform:scale(.97)}
    html[data-control-hand="left"] .footwork-step{left:calc(var(--safe-left) + 8px)!important;right:auto!important;transform:none!important}
    html[data-control-hand="left"] .footwork-step:active,html[data-control-hand="left"] .footwork-step.is-active{transform:scale(.94)!important}
    html[data-control-hand="left"] .footwork-range{left:calc(var(--safe-left) + 12px)!important;right:auto!important;transform:none!important}
    html[data-control-hand="left"] .footwork-feedback{left:calc(var(--safe-left) + 8px)!important;right:auto!important;transform:translateY(5px)!important}
    html[data-control-hand="left"] .footwork-feedback.is-visible{transform:translateY(0)!important}
    @media(max-width:360px){
      .control-hand-toggle{min-width:84px;min-height:40px;padding:0 7px;font-size:9px}
      html[data-control-hand="left"] .footwork-step{left:calc(var(--safe-left) + 4px)!important}
      html[data-control-hand="left"] .footwork-range{left:calc(var(--safe-left) + 8px)!important}
      html[data-control-hand="left"] .footwork-feedback{left:calc(var(--safe-left) + 5px)!important}
    }
    @media(prefers-reduced-motion:reduce){.control-hand-toggle:active{transform:none}}
  `;
  document.head.append(style);
}

function render(hand) {
  const normalized = normalizeControlHand(hand);
  document.documentElement.dataset.controlHand = normalized;
  const toggle = document.querySelector('#control-hand-toggle');
  if (toggle) {
    toggle.textContent = normalized === ControlHand.LEFT ? 'STEP：左手側' : 'STEP：右手側';
    toggle.setAttribute('aria-pressed', normalized === ControlHand.LEFT ? 'true' : 'false');
  }
  return normalized;
}

function markStartLayout() {
  requestAnimationFrame(() => {
    const toggle = document.querySelector('#control-hand-toggle');
    if (!toggle) return;
    const rect = toggle.getBoundingClientRect();
    const fits = rect.left >= 0 && rect.top >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight;
    document.documentElement.dataset.controlHandLayout = fits ? 'pass' : 'fail';
  });
}

export function installControlHandedness({ storage = globalThis.localStorage } = {}) {
  if (typeof document === 'undefined') return ControlHand.RIGHT;
  ensureStyles();
  const startScreen = document.querySelector('#start-screen');
  if (!startScreen) return ControlHand.RIGHT;

  let toggle = document.querySelector('#control-hand-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.id = 'control-hand-toggle';
    toggle.className = 'control-hand-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', '切換 STEP 操作側');
    startScreen.append(toggle);
  }

  const initial = render(readStoredHand(storage));
  if (toggle.dataset.controlHandBound !== 'true') {
    toggle.dataset.controlHandBound = 'true';
    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const next = oppositeControlHand(document.documentElement.dataset.controlHand);
      writeStoredHand(next, storage);
      render(next);
    });
  }

  document.documentElement.dataset.controlHandedness = 'persistent-v1';
  markStartLayout();
  return initial;
}

if (typeof document !== 'undefined') installControlHandedness();
