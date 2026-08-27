import { CombatEngine, Direction } from './game-core.js';

const patched = Symbol.for('blade-reversal.impact-fx');
const directionData = Object.freeze({
  [Direction.TOP]: Object.freeze({ x: 50, y: 34, angle: -90 }),
  [Direction.RIGHT]: Object.freeze({ x: 66, y: 49, angle: 0 }),
  [Direction.BOTTOM]: Object.freeze({ x: 50, y: 66, angle: 90 }),
  [Direction.LEFT]: Object.freeze({ x: 34, y: 49, angle: 180 }),
});

export function impactOrigin(direction) {
  return directionData[direction] ?? { x: 50, y: 48, angle: -35 };
}

export function impactProfile(event) {
  if (!event || typeof event.type !== 'string') return null;
  const detail = event.detail ?? {};
  const direction = detail.direction ?? null;

  if (event.type === 'perfect-parry') {
    return { kind: 'perfect', direction, intensity: 1.35, sparks: 10, slash: false };
  }
  if (event.type === 'parry') {
    return { kind: 'parry', direction, intensity: 0.95, sparks: 6, slash: false };
  }
  if (event.type === 'enemy-guard-break') {
    return { kind: 'break', direction: null, intensity: 1.45, sparks: 12, slash: false };
  }
  if (event.type === 'counter') {
    return {
      kind: detail.guardBroken ? 'break' : 'slash',
      direction,
      intensity: detail.guardBroken ? 1.5 : Math.min(1.35, 0.9 + (Number(detail.damage) || 1) * 0.12),
      sparks: detail.guardBroken ? 12 : 8,
      slash: true,
    };
  }
  if (event.type === 'player-hit') {
    return {
      kind: 'damage',
      direction,
      intensity: detail.guardBroken ? 1.55 : 1.15,
      sparks: detail.guardBroken ? 10 : 7,
      slash: false,
    };
  }
  return null;
}

function ensureStyles() {
  if (document.querySelector('#impact-fx-styles')) return;
  const style = document.createElement('style');
  style.id = 'impact-fx-styles';
  style.textContent = `
.impact-fx-layer{position:absolute;inset:0;z-index:6;overflow:hidden;pointer-events:none;contain:layout paint;}
.impact-fx{position:absolute;left:var(--impact-x);top:var(--impact-y);width:0;height:0;pointer-events:none;filter:drop-shadow(0 0 8px rgba(255,210,132,.45));}
.impact-fx__ring{position:absolute;left:0;top:0;width:34px;height:34px;border:2px solid rgba(255,235,189,.9);border-radius:50%;transform:translate(-50%,-50%) scale(.18);opacity:0;animation:impact-ring 420ms cubic-bezier(.16,.8,.2,1) forwards;}
.impact-fx__core{position:absolute;left:0;top:0;width:14px;height:14px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,#fff 0,#ffe3a3 28%,rgba(255,132,62,.55) 58%,transparent 74%);mix-blend-mode:screen;animation:impact-core 240ms ease-out forwards;}
.impact-fx__slash{position:absolute;left:0;top:0;width:min(42vw,190px);height:3px;transform-origin:0 50%;transform:rotate(var(--impact-angle)) translate(-12%,0) scaleX(.18);border-radius:99px;background:linear-gradient(90deg,transparent,rgba(255,244,214,.95) 32%,rgba(255,150,72,.7) 64%,transparent);box-shadow:0 0 12px rgba(255,137,66,.55);opacity:0;animation:impact-slash 330ms cubic-bezier(.2,.76,.24,1) forwards;}
.impact-fx__spark{position:absolute;left:0;top:0;width:var(--spark-length);height:2px;transform-origin:0 50%;transform:rotate(var(--spark-angle)) translateX(5px) scaleX(.2);border-radius:99px;background:linear-gradient(90deg,#fff7d9,#ffc061 62%,transparent);box-shadow:0 0 5px rgba(255,178,76,.65);opacity:0;animation:impact-spark var(--spark-time) cubic-bezier(.1,.75,.15,1) forwards;}
.impact-fx--perfect .impact-fx__ring,.impact-fx--break .impact-fx__ring{width:54px;height:54px;border-width:3px;box-shadow:0 0 24px rgba(255,202,95,.35);}
.impact-fx--perfect .impact-fx__core{width:18px;height:18px;background:radial-gradient(circle,#fff 0,#dff4ff 30%,rgba(123,191,255,.72) 58%,transparent 76%);}
.impact-fx--damage{filter:drop-shadow(0 0 8px rgba(255,63,42,.5));}
.impact-fx--damage .impact-fx__ring{border-color:rgba(255,103,78,.88);}
.impact-fx--damage .impact-fx__core{background:radial-gradient(circle,#fff0e7 0,#ff654d 34%,rgba(116,0,0,.58) 66%,transparent 78%);}
.impact-fx--damage .impact-fx__spark{background:linear-gradient(90deg,#ffd0c5,#ff5b45 62%,transparent);box-shadow:0 0 5px rgba(255,69,48,.6);}
@keyframes impact-ring{0%{opacity:.98;transform:translate(-50%,-50%) scale(.18)}45%{opacity:.9}100%{opacity:0;transform:translate(-50%,-50%) scale(var(--impact-ring-scale))}}
@keyframes impact-core{0%{opacity:1;transform:translate(-50%,-50%) scale(.35)}100%{opacity:0;transform:translate(-50%,-50%) scale(var(--impact-core-scale))}}
@keyframes impact-slash{0%{opacity:0;transform:rotate(var(--impact-angle)) translate(-12%,0) scaleX(.18)}20%{opacity:1}100%{opacity:0;transform:rotate(var(--impact-angle)) translate(-12%,0) scaleX(var(--impact-slash-scale))}}
@keyframes impact-spark{0%{opacity:0;transform:rotate(var(--spark-angle)) translateX(5px) scaleX(.2)}18%{opacity:1}100%{opacity:0;transform:rotate(var(--spark-angle)) translateX(var(--spark-distance)) scaleX(1)}}
@media (prefers-reduced-motion:reduce){.impact-fx__spark,.impact-fx__slash{display:none}.impact-fx__ring{animation-duration:170ms}.impact-fx__core{animation-duration:130ms}}
`;
  document.head.append(style);
}

function createLayer(root) {
  let layer = root.querySelector('#impact-fx-layer');
  if (layer) return layer;
  layer = document.createElement('div');
  layer.id = 'impact-fx-layer';
  layer.className = 'impact-fx-layer';
  layer.setAttribute('aria-hidden', 'true');
  root.append(layer);
  return layer;
}

function renderImpact(layer, event) {
  const profile = impactProfile(event);
  if (!profile) return false;

  const origin = impactOrigin(profile.direction);
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const burst = document.createElement('div');
  burst.className = `impact-fx impact-fx--${profile.kind}`;
  burst.style.setProperty('--impact-x', `${origin.x}%`);
  burst.style.setProperty('--impact-y', `${origin.y}%`);
  burst.style.setProperty('--impact-angle', `${origin.angle}deg`);
  burst.style.setProperty('--impact-ring-scale', String(1.15 * profile.intensity));
  burst.style.setProperty('--impact-core-scale', String(2.2 * profile.intensity));
  burst.style.setProperty('--impact-slash-scale', String(0.9 * profile.intensity));
  burst.dataset.kind = profile.kind;

  const core = document.createElement('span');
  core.className = 'impact-fx__core';
  burst.append(core);

  const ring = document.createElement('span');
  ring.className = 'impact-fx__ring';
  burst.append(ring);

  if (profile.slash && !reduced) {
    const slash = document.createElement('span');
    slash.className = 'impact-fx__slash';
    burst.append(slash);
  }

  const sparkCount = reduced ? 0 : profile.sparks;
  for (let i = 0; i < sparkCount; i += 1) {
    const spark = document.createElement('span');
    spark.className = 'impact-fx__spark';
    const angle = origin.angle - 76 + ((i * 152.5) % 152);
    const distance = 24 + ((i * 13) % 38) * profile.intensity;
    const length = 10 + ((i * 7) % 16);
    spark.style.setProperty('--spark-angle', `${angle}deg`);
    spark.style.setProperty('--spark-distance', `${distance}px`);
    spark.style.setProperty('--spark-length', `${length}px`);
    spark.style.setProperty('--spark-time', `${300 + (i % 4) * 36}ms`);
    burst.append(spark);
  }

  layer.append(burst);
  while (layer.children.length > 3) layer.firstElementChild?.remove();
  document.documentElement.dataset.impactLast = profile.kind;
  setTimeout(() => burst.remove(), reduced ? 220 : 520);
  return true;
}

export function installImpactFx(Engine = CombatEngine, root = typeof document === 'undefined' ? null : document.querySelector('#app')) {
  if (!root || Engine.prototype[patched]) return root?.querySelector('#impact-fx-layer') ?? null;
  ensureStyles();
  const layer = createLayer(root);
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, patched, { value: true });

  Engine.prototype.drainEvents = function impactDrainEvents() {
    const events = originalDrainEvents.call(this);
    for (const event of events) renderImpact(layer, event);
    return events;
  };

  document.documentElement.dataset.impactReady = 'true';
  return layer;
}

if (typeof document !== 'undefined') installImpactFx();
