import { CombatEngine, Direction } from './game-core.js';

const patched = Symbol.for('blade-reversal.mobile-combat-readability');
const viewPatched = Symbol.for('blade-reversal.mobile-combat-readability-view');
const QUIET_PROMPTS = new Set(['READ THE BLADE', 'TRACK THE BLADE', 'DUEL BEGINS']);
const CLASH_ORIGINS = Object.freeze({
  [Direction.TOP]: { x: 50, y: 34, angle: -18 },
  [Direction.RIGHT]: { x: 65, y: 48, angle: 72 },
  [Direction.BOTTOM]: { x: 50, y: 65, angle: 18 },
  [Direction.LEFT]: { x: 35, y: 48, angle: -72 },
});
const FOOTWORK_SHORT = [
  ['EVADE', '閃避成功 · 反擊'],
  ['追步斬', '追步斬 · 格擋'],
  ['太遲', '太遲 · 改用格擋'],
  ['等刀落', '未到時機'],
];

function smootherstep(value) {
  const x = Math.max(0, Math.min(1, Number(value) || 0));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function installSwordEchoes(view) {
  if (!view?.characterReady?.then) return;
  view.characterReady.then(() => {
    if (!view.skinnedSword || !view.skinnedReadTrail || view.mobileSwingEchoes?.length) return;
    view.mobileSwingEchoes = [10, 20].map((offset, index) => {
      const echo = view.skinnedReadTrail.clone();
      echo.name = `SkinnedBladeSwingEcho${index + 1}`;
      echo.enabled = false;
      echo.setLocalEulerAngles(0, 0, offset);
      const scale = index === 0 ? 0.88 : 0.72;
      const base = echo.getLocalScale();
      echo.setLocalScale(base.x * scale, base.y * (1 + index * 0.04), base.z);
      view.skinnedSword.addChild(echo);
      return echo;
    });
    document.documentElement.dataset.enemySwingEchoes = String(view.mobileSwingEchoes.length);
  }).catch(() => {});
}

export function installMobileCombatReadabilityView(view) {
  if (!view || view[viewPatched]) return view;
  Object.defineProperty(view, viewPatched, { value: true });
  installSwordEchoes(view);

  const originalSyncSkinnedAnimation = view.syncSkinnedAnimation?.bind(view);
  if (originalSyncSkinnedAnimation) {
    view.syncSkinnedAnimation = (snapshot, directionIndex) => {
      const strike = snapshot?.phase === 'strike';
      const adjusted = strike
        ? { ...snapshot, phaseProgress: smootherstep(snapshot.phaseProgress) }
        : snapshot;
      originalSyncSkinnedAnimation(adjusted, directionIndex);

      if (!strike || !view.skinnedModel) {
        for (const echo of view.mobileSwingEchoes || []) echo.enabled = false;
        return;
      }

      const p = smootherstep(snapshot.phaseProgress);
      const whip = Math.sin(Math.PI * p);
      const side = directionIndex === 1 ? 1 : directionIndex === 3 ? -1 : 0;
      const euler = view.skinnedModel.getLocalEulerAngles();
      view.skinnedModel.setLocalEulerAngles(
        euler.x + whip * 3.5,
        euler.y + side * whip * 7.5,
        euler.z + side * whip * 4.5,
      );

      if (view.skinnedReadTrail?.enabled) {
        view.skinnedReadTrail.setLocalScale(0.16 + whip * 0.10, 1.48 + whip * 0.42, 0.06 + whip * 0.025);
        const sign = directionIndex === 3 ? -1 : 1;
        for (const [index, echo] of (view.mobileSwingEchoes || []).entries()) {
          echo.enabled = true;
          echo.setLocalEulerAngles(0, 0, sign * (10 + index * 11));
        }
      }
    };
  }

  document.documentElement.dataset.enemySwingCurve = 'smootherstep-whip-v1';
  return view;
}

function ensureStyles() {
  if (document.querySelector('style[data-mobile-combat-readability]')) return;
  const style = document.createElement('style');
  style.dataset.mobileCombatReadability = 'true';
  style.textContent = `
    .combat-prompt{top:calc(var(--safe-top) + 72px);transition:opacity .12s ease,transform .12s ease}
    .combat-prompt strong{font-size:clamp(14px,4.2vw,18px);letter-spacing:.16em}
    .combat-prompt span{display:none}
    .combat-prompt.mobile-prompt--quiet{opacity:0;transform:translateX(-50%) translateY(-5px)}
    .direction-indicator{min-width:82px;padding:10px 14px;border-radius:16px;background:rgba(7,8,11,.54)}
    .direction-indicator__arrow{font-size:32px}
    .direction-indicator span:last-child{font-size:10px;font-weight:760}
    .zone span{opacity:0!important}
    .hud__eyebrow{font-size:9px}
    .hud__minor{font-size:10px}
    .health-row{font-size:9px}
    .hud__stage strong{font-size:14px}
    .hud__stage span{font-size:9px}
    .gesture-hint{display:none}
    .phase-label{font-size:10px}

    .footwork-step{left:auto!important;right:calc(var(--safe-right) + 8px)!important;bottom:calc(var(--safe-bottom) + 36px)!important;width:64px!important;height:64px!important;transform:none!important;font-size:9px!important;opacity:.68!important}
    .footwork-step span{font-size:8px!important}
    .footwork-step:active,.footwork-step.is-active{transform:scale(.94)!important;opacity:1!important}
    .footwork-range{left:auto!important;right:calc(var(--safe-right) + 10px)!important;bottom:calc(var(--safe-bottom) + 106px)!important;transform:none!important;font-size:8px!important}
    .footwork-feedback{left:auto!important;right:calc(var(--safe-right) + 6px)!important;bottom:calc(var(--safe-bottom) + 142px)!important;width:128px!important;min-width:0!important;transform:translateY(5px)!important;font-size:9px!important;line-height:1.25!important}
    .footwork-feedback.is-visible{transform:translateY(0)!important}

    .mobile-clash-layer{position:absolute;inset:0;z-index:6;overflow:hidden;pointer-events:none;contain:layout paint}
    .mobile-clash{position:absolute;inset:0;pointer-events:none;--clash-x:50%;--clash-y:48%;--clash-angle:0deg}
    .mobile-clash__wash{position:absolute;inset:0;background:radial-gradient(circle at var(--clash-x) var(--clash-y),rgba(255,250,231,.94) 0,rgba(255,205,112,.34) 8%,rgba(108,167,255,.12) 24%,transparent 52%);opacity:0;mix-blend-mode:screen;animation:mobile-clash-wash 220ms ease-out forwards}
    .mobile-clash__burst{position:absolute;left:var(--clash-x);top:var(--clash-y);width:88px;height:88px;border:3px solid rgba(255,239,193,.96);border-radius:50%;box-shadow:0 0 18px rgba(255,206,101,.78),inset 0 0 18px rgba(255,255,255,.28);transform:translate(-50%,-50%) scale(.18);opacity:0;animation:mobile-clash-burst 360ms cubic-bezier(.12,.76,.18,1) forwards}
    .mobile-clash__blade{position:absolute;left:var(--clash-x);top:var(--clash-y);width:min(33vw,150px);height:4px;border-radius:99px;background:linear-gradient(90deg,transparent,#fff7dd 22%,#ffc260 64%,transparent);box-shadow:0 0 14px rgba(255,192,84,.9);transform-origin:50% 50%;opacity:0;animation:mobile-clash-blade 260ms cubic-bezier(.12,.78,.2,1) forwards}
    .mobile-clash__blade--a{transform:translate(-50%,-50%) rotate(var(--clash-angle)) scaleX(.2)}
    .mobile-clash__blade--b{transform:translate(-50%,-50%) rotate(calc(var(--clash-angle) + 92deg)) scaleX(.2)}
    .mobile-clash--perfect .mobile-clash__wash{animation-duration:280ms;background:radial-gradient(circle at var(--clash-x) var(--clash-y),#fff 0,rgba(199,230,255,.72) 7%,rgba(104,174,255,.24) 24%,transparent 58%)}
    .mobile-clash--perfect .mobile-clash__burst{width:112px;height:112px;border-color:#e7f5ff;box-shadow:0 0 28px rgba(144,204,255,.88),inset 0 0 24px rgba(255,255,255,.5)}
    .mobile-clash--perfect .mobile-clash__blade{height:5px;box-shadow:0 0 18px rgba(181,224,255,.95)}
    @keyframes mobile-clash-wash{0%{opacity:.9}18%{opacity:.72}100%{opacity:0}}
    @keyframes mobile-clash-burst{0%{opacity:1;transform:translate(-50%,-50%) scale(.18)}55%{opacity:.92}100%{opacity:0;transform:translate(-50%,-50%) scale(1.45)}}
    @keyframes mobile-clash-blade{0%{opacity:0}18%{opacity:1}100%{opacity:0;filter:blur(.8px)}}
    @media (max-width:360px){
      .footwork-step{right:calc(var(--safe-right) + 4px)!important;bottom:calc(var(--safe-bottom) + 34px)!important;width:60px!important;height:60px!important}
      .footwork-range{right:calc(var(--safe-right) + 6px)!important;bottom:calc(var(--safe-bottom) + 99px)!important}
      .footwork-feedback{right:calc(var(--safe-right) + 4px)!important;bottom:calc(var(--safe-bottom) + 132px)!important;width:118px!important}
    }
    @media (prefers-reduced-motion:reduce){
      .mobile-clash__blade{display:none}
      .mobile-clash__burst{animation-duration:170ms}
      .mobile-clash__wash{animation-duration:140ms}
    }
  `;
  document.head.append(style);
}

function ensureClashLayer() {
  const root = document.querySelector('#app');
  if (!root) return null;
  let layer = root.querySelector('#mobile-clash-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'mobile-clash-layer';
    layer.className = 'mobile-clash-layer';
    layer.setAttribute('aria-hidden', 'true');
    root.append(layer);
  }
  return layer;
}

function renderClash(event) {
  if (!event || !['parry', 'perfect-parry'].includes(event.type)) return;
  const layer = ensureClashLayer();
  if (!layer) return;
  const perfect = event.type === 'perfect-parry';
  const origin = CLASH_ORIGINS[event.detail?.direction] || { x: 50, y: 48, angle: -35 };
  const clash = document.createElement('div');
  clash.className = `mobile-clash mobile-clash--${perfect ? 'perfect' : 'parry'}`;
  clash.style.setProperty('--clash-x', `${origin.x}%`);
  clash.style.setProperty('--clash-y', `${origin.y}%`);
  clash.style.setProperty('--clash-angle', `${origin.angle}deg`);
  clash.innerHTML = '<span class="mobile-clash__wash"></span><span class="mobile-clash__burst"></span><span class="mobile-clash__blade mobile-clash__blade--a"></span><span class="mobile-clash__blade mobile-clash__blade--b"></span>';
  layer.append(clash);
  while (layer.children.length > 2) layer.firstElementChild?.remove();
  document.documentElement.dataset.mobileParryLast = perfect ? 'perfect' : 'parry';
  setTimeout(() => clash.remove(), 460);
}

function installPromptReduction() {
  const prompt = document.querySelector('#combat-prompt');
  const title = document.querySelector('#prompt-title');
  if (!prompt || !title) return;
  const sync = () => prompt.classList.toggle('mobile-prompt--quiet', QUIET_PROMPTS.has(title.textContent?.trim()));
  sync();
  new MutationObserver(sync).observe(title, { childList: true, characterData: true, subtree: true });
}

function installFootworkCopyReduction() {
  const bind = (feedback) => {
    if (!feedback || feedback.dataset.mobileCopyBound === 'true') return;
    feedback.dataset.mobileCopyBound = 'true';
    const sync = () => {
      const text = feedback.textContent || '';
      const replacement = FOOTWORK_SHORT.find(([prefix]) => text.startsWith(prefix))?.[1];
      if (replacement && replacement !== text) feedback.textContent = replacement;
    };
    new MutationObserver(sync).observe(feedback, { childList: true, characterData: true, subtree: true });
  };

  const existing = document.querySelector('#footwork-feedback');
  if (existing) {
    bind(existing);
    return;
  }

  const root = document.querySelector('#app') || document.documentElement;
  const observer = new MutationObserver(() => {
    const feedback = document.querySelector('#footwork-feedback');
    if (!feedback) return;
    observer.disconnect();
    bind(feedback);
  });
  observer.observe(root, { childList: true, subtree: true });
}

export function installMobileCombatReadability(Engine = CombatEngine) {
  if (typeof document === 'undefined' || Engine.prototype[patched]) return;
  ensureStyles();
  ensureClashLayer();
  installPromptReduction();
  installFootworkCopyReduction();

  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, patched, { value: true });
  Engine.prototype.drainEvents = function mobileReadabilityDrainEvents() {
    const events = originalDrainEvents.call(this);
    for (const event of events) renderClash(event);
    return events;
  };

  document.documentElement.dataset.mobileCombatReadability = 'iphone-pass-v1';
}

if (typeof document !== 'undefined') installMobileCombatReadability();
