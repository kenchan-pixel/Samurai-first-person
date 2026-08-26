import { CombatEngine } from './game-core.js';
import { BOSS_ID, installBossEncounter } from './boss-encounter.js';

installBossEncounter();

const app = document.querySelector('#app');
const patched = Symbol.for('blade-reversal.boss-overlay');

function installAtmosphere() {
  if (!app || app.querySelector('.boss-atmosphere')) return null;

  const style = document.createElement('style');
  style.textContent = `
    .boss-atmosphere{position:absolute;inset:0;z-index:3;pointer-events:none;overflow:hidden;opacity:0;transition:opacity .6s ease}
    .app[data-boss-active="true"] .boss-atmosphere{opacity:1}
    .boss-moon{position:absolute;left:50%;top:8%;width:min(34vw,180px);aspect-ratio:1;border-radius:50%;transform:translateX(-50%);background:radial-gradient(circle at 42% 38%,rgba(255,231,184,.92) 0 9%,rgba(240,97,71,.78) 34%,rgba(95,8,18,.28) 68%,transparent 72%);box-shadow:0 0 46px rgba(255,66,45,.18);filter:saturate(.9);opacity:.48;transition:opacity .45s,transform .45s,filter .45s}
    .app[data-boss-phase="2"] .boss-moon{opacity:.9;transform:translateX(-50%) scale(1.12);filter:saturate(1.35);box-shadow:0 0 68px rgba(255,57,35,.34)}
    .boss-ember{position:absolute;left:calc(5% + var(--i) * 7.6%);bottom:-8%;width:3px;height:3px;border-radius:50%;background:rgba(255,146,75,.92);box-shadow:0 0 7px rgba(255,75,32,.7);opacity:.12;animation:boss-ember-rise calc(2.5s + var(--i) * .08s) linear infinite;animation-delay:calc(var(--i) * -.21s)}
    .app[data-boss-phase="2"] .boss-ember{opacity:.62}
    .boss-phase-banner{position:absolute;left:50%;top:29%;z-index:7;transform:translate(-50%,-50%) scale(.92);min-width:230px;padding:10px 18px;text-align:center;border-top:1px solid rgba(255,190,124,.7);border-bottom:1px solid rgba(255,190,124,.7);background:linear-gradient(90deg,transparent,rgba(46,4,10,.82),transparent);font:700 clamp(12px,3.8vw,16px)/1.25 system-ui,sans-serif;letter-spacing:.18em;color:#ffd5a1;text-shadow:0 0 15px rgba(255,58,36,.85);opacity:0}
    .boss-phase-banner.is-visible{animation:boss-phase-reveal 1.05s ease both}
    @keyframes boss-ember-rise{0%{transform:translate3d(0,0,0) scale(.65)}50%{transform:translate3d(calc((var(--i) - 6) * 1px),-45vh,0) scale(1)}100%{transform:translate3d(calc((6 - var(--i)) * 1.4px),-92vh,0) scale(.3);opacity:0}}
    @keyframes boss-phase-reveal{0%{opacity:0;transform:translate(-50%,-50%) scale(.82);filter:blur(3px)}16%,68%{opacity:1;transform:translate(-50%,-50%) scale(1);filter:blur(0)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.08);filter:blur(1px)}}
    @media (prefers-reduced-motion:reduce){.boss-ember{animation:none}.boss-moon{transition:none}.boss-phase-banner.is-visible{animation:none;opacity:1}}
  `;
  document.head.append(style);

  const layer = document.createElement('div');
  layer.className = 'boss-atmosphere';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = '<div class="boss-moon"></div><div class="boss-phase-banner">PHASE II · BLOOD MOON</div>';
  for (let i = 0; i < 12; i += 1) {
    const ember = document.createElement('i');
    ember.className = 'boss-ember';
    ember.style.setProperty('--i', String(i));
    layer.append(ember);
  }
  app.append(layer);
  return layer;
}

const atmosphere = installAtmosphere();
const banner = atmosphere?.querySelector('.boss-phase-banner') ?? null;
let phaseBannerTimer = null;
let bossDeactivateTimer = null;

function clearBossDeactivate() {
  if (bossDeactivateTimer === null) return;
  clearTimeout(bossDeactivateTimer);
  bossDeactivateTimer = null;
}

function hidePhaseBanner() {
  if (phaseBannerTimer !== null) {
    clearTimeout(phaseBannerTimer);
    phaseBannerTimer = null;
  }
  banner?.classList.remove('is-visible');
}

function setBossActive(active, phase = 1) {
  if (!app) return;
  if (active) {
    app.dataset.bossActive = 'true';
    app.dataset.bossPhase = String(phase);
  } else {
    delete app.dataset.bossActive;
    delete app.dataset.bossPhase;
  }
}

function revealPhaseTwo() {
  if (!banner) return;
  hidePhaseBanner();
  void banner.offsetWidth;
  banner.classList.add('is-visible');
  phaseBannerTimer = window.setTimeout(() => {
    banner.classList.remove('is-visible');
    phaseBannerTimer = null;
  }, 1150);
}

if (!CombatEngine.prototype[patched]) {
  const originalDrainEvents = CombatEngine.prototype.drainEvents;
  Object.defineProperty(CombatEngine.prototype, patched, { value: true });

  CombatEngine.prototype.drainEvents = function bossOverlayDrainEvents() {
    const events = originalDrainEvents.call(this);
    for (const event of events) {
      if (event.type === 'stage-start' && event.detail?.enemyId === BOSS_ID) {
        clearBossDeactivate();
        hidePhaseBanner();
        setBossActive(true, 1);
      } else if (event.type === 'boss-phase') {
        clearBossDeactivate();
        setBossActive(true, 2);
        revealPhaseTwo();
      } else if (event.type === 'enemy-defeated' && event.detail?.enemyId === BOSS_ID) {
        hidePhaseBanner();
        clearBossDeactivate();
        bossDeactivateTimer = window.setTimeout(() => {
          setBossActive(false);
          bossDeactivateTimer = null;
        }, 900);
      } else if (event.type === 'reset' || event.type === 'defeat') {
        clearBossDeactivate();
        hidePhaseBanner();
        setBossActive(false);
      }
    }
    return events;
  };
}

document.documentElement.dataset.bossReady = 'true';
