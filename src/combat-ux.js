import { Direction } from './game-core.js';

export class PausableCombatClock {
  constructor(realNow = 0) {
    this.reset(realNow);
    this.paused = true;
  }

  reset(realNow = 0) {
    const safeNow = Number.isFinite(realNow) ? realNow : 0;
    this.now = safeNow;
    this.lastRealNow = safeNow;
    this.paused = false;
    return this.now;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  tick(realNow) {
    const safeNow = Number.isFinite(realNow) ? realNow : this.lastRealNow;
    const elapsed = Math.max(0, safeNow - this.lastRealNow);
    this.lastRealNow = safeNow;
    if (!this.paused) this.now += elapsed;
    return { now: this.now, frameDt: Math.min(50, elapsed) };
  }
}

export function directionFromErgonomicTap(x, y, width, height, edgeRatio = 0.28, portraitTopRatio = 0.42) {
  if (![x, y, width, height].every(Number.isFinite) || width <= 0 || height <= 0) return null;

  const side = Math.max(0.18, Math.min(0.36, edgeRatio));
  const topRatio = height > width ? Math.max(side, Math.min(0.48, portraitTopRatio)) : side;
  const left = width * side;
  const right = width * (1 - side);
  const top = height * topRatio;
  const bottom = height * (1 - side);
  const candidates = [];

  if (x <= left) candidates.push([Direction.LEFT, x / Math.max(left, 1)]);
  if (x >= right) candidates.push([Direction.RIGHT, (width - x) / Math.max(width - right, 1)]);
  if (y <= top) candidates.push([Direction.TOP, y / Math.max(top, 1)]);
  if (y >= bottom) candidates.push([Direction.BOTTOM, (height - y) / Math.max(height - bottom, 1)]);

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a[1] - b[1]);
  return candidates[0][0];
}

export function rectIsNeutralForErgonomicTap(rect, width, height) {
  if (!rect || ![rect.left, rect.top, rect.right, rect.bottom, width, height].every(Number.isFinite)) return false;
  if (rect.left < 0 || rect.top < 0 || rect.right > width || rect.bottom > height || rect.right <= rect.left || rect.bottom <= rect.top) return false;

  const inset = Math.min(2, Math.max(0.5, Math.min(rect.right - rect.left, rect.bottom - rect.top) * 0.04));
  const points = [
    [rect.left + inset, rect.top + inset],
    [rect.right - inset, rect.top + inset],
    [rect.left + inset, rect.bottom - inset],
    [rect.right - inset, rect.bottom - inset],
    [(rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2],
  ];
  return points.every(([x, y]) => directionFromErgonomicTap(x, y, width, height) === null);
}

function installStyles() {
  if (document.querySelector('style[data-combat-ux]')) return;
  const style = document.createElement('style');
  style.dataset.combatUx = 'true';
  style.textContent = `
    .combat-prompt,.footer-hud{display:none!important}
    .zone span,.hud__stage>span{display:none!important}
    .zone--top{height:42%!important;left:28%!important;right:28%!important;padding:0!important}
    html[data-readability-mode="on"] .direction-indicator{opacity:0!important;visibility:hidden!important}
    .pause-button{position:absolute;z-index:26;left:50%;bottom:calc(28% + 10px);width:44px;height:44px;padding:0;transform:translateX(-50%);border:1px solid rgba(255,255,255,.13);border-radius:13px;background:rgba(7,8,11,.46);color:rgba(248,241,231,.74);font-size:17px;font-weight:900;line-height:1;backdrop-filter:blur(6px);box-shadow:0 5px 18px rgba(0,0,0,.2);cursor:pointer}
    .pause-button[hidden],.pause-screen[hidden]{display:none!important}
    .pause-button:active{transform:translateX(-50%) scale(.96)}
    .pause-screen{position:absolute;z-index:28;inset:0;display:grid;place-items:center;padding:calc(var(--safe-top) + 18px) calc(var(--safe-right) + 18px) calc(var(--safe-bottom) + 18px) calc(var(--safe-left) + 18px);background:rgba(5,6,9,.88);backdrop-filter:blur(10px)}
    .pause-card{width:min(100%,330px);padding:24px 18px 20px;border:1px solid rgba(239,196,129,.22);border-radius:18px;background:linear-gradient(160deg,rgba(31,25,24,.96),rgba(9,10,13,.98));box-shadow:0 18px 50px rgba(0,0,0,.42);text-align:center}
    .pause-card__eyebrow{margin:0;color:rgba(239,196,129,.64);font-size:9px;font-weight:850;letter-spacing:.18em}
    .pause-card h2{margin:7px 0 18px;font:600 38px/1 Georgia,"Times New Roman",serif}
    .pause-actions{display:grid;gap:8px}
    .pause-actions button{min-height:46px;border:1px solid rgba(255,255,255,.14);border-radius:12px;background:rgba(255,255,255,.045);font-size:12px;font-weight:800;letter-spacing:.04em;cursor:pointer}
    .pause-actions button:first-child{border-color:rgba(239,196,129,.34);background:rgba(150,55,42,.34)}
    .pause-actions button:active{transform:translateY(1px)}
    .pause-card__note{margin:13px 0 0;color:rgba(236,230,219,.48);font-size:8px;line-height:1.45}
    @media(max-width:360px){.pause-card{padding:20px 14px 16px}.pause-card h2{font-size:34px}.pause-actions button{min-height:44px}}
    @media(prefers-reduced-motion:reduce){.pause-button:active{transform:translateX(-50%)}.pause-actions button:active{transform:none}}
  `;
  document.head.append(style);
}

function measurePauseInputSafety(button) {
  if (!button || button.hidden) return false;
  const rect = button.getBoundingClientRect();
  const fits = Boolean(
    rect.width > 0 &&
    rect.height > 0 &&
    rect.left >= 0 &&
    rect.top >= 0 &&
    rect.right <= window.innerWidth &&
    rect.bottom <= window.innerHeight,
  );
  const neutral = Boolean(fits && rectIsNeutralForErgonomicTap(rect, window.innerWidth, window.innerHeight));
  document.documentElement.dataset.pauseLayout = fits ? 'pass' : 'fail';
  document.documentElement.dataset.pauseInputSafe = neutral ? 'pass' : 'fail';
  return fits && neutral;
}

function bindPauseInputSafety(button) {
  if (!button || button.dataset.pauseSafetyBound === 'true') return;
  button.dataset.pauseSafetyBound = 'true';
  document.documentElement.dataset.pauseLayout = 'pending';
  document.documentElement.dataset.pauseInputSafe = 'pending';

  let frame = 0;
  const refresh = () => {
    if (button.hidden) return;
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = 0;
      measurePauseInputSafety(button);
    });
  };

  const observer = new MutationObserver((records) => {
    if (records.some((record) => record.attributeName === 'hidden')) refresh();
  });
  observer.observe(button, { attributes: true, attributeFilter: ['hidden'] });
  window.addEventListener('resize', refresh, { passive: true });
  refresh();
}

export function installCombatUx() {
  if (typeof document === 'undefined') return;
  installStyles();
  const app = document.querySelector('#app');
  if (!app) return;

  if (!document.querySelector('#pause-button')) {
    const button = document.createElement('button');
    button.id = 'pause-button';
    button.className = 'pause-button';
    button.type = 'button';
    button.hidden = true;
    button.setAttribute('aria-label', '暫停');
    button.setAttribute('aria-controls', 'pause-screen');
    button.textContent = 'Ⅱ';
    app.append(button);
  }

  if (!document.querySelector('#pause-screen')) {
    const screen = document.createElement('section');
    screen.id = 'pause-screen';
    screen.className = 'pause-screen';
    screen.hidden = true;
    screen.setAttribute('role', 'dialog');
    screen.setAttribute('aria-modal', 'true');
    screen.setAttribute('aria-label', '暫停選單');
    screen.innerHTML = `
      <div class="pause-card">
        <p class="pause-card__eyebrow">PAUSED</p>
        <h2>暫停</h2>
        <div class="pause-actions">
          <button id="pause-resume-button" type="button">繼續</button>
          <button id="pause-guide-button" type="button">玩法</button>
          <button id="pause-restart-button" type="button">重新開始</button>
          <button id="pause-home-button" type="button">返回主頁</button>
        </div>
        <p class="pause-card__note">暫停期間戰鬥時間會凍結；玩法頁關閉後仍保持暫停。</p>
      </div>`;
    app.append(screen);
  }

  bindPauseInputSafety(document.querySelector('#pause-button'));
  document.documentElement.dataset.combatUxReady = 'true';
}

if (typeof location !== 'undefined' && new URLSearchParams(location.search).get('browser-smoke') === 'combat-ux') {
  setTimeout(() => {
    import('./combat-ux-contract-smoke.js').catch((error) => {
      console.error(error);
      document.documentElement.dataset.combatUxBrowser = 'fail';
      document.documentElement.dataset.combatUxBrowserError = error?.message || String(error);
    });
  }, 0);
}
