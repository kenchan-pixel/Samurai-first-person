import { CombatEngine } from './game-core.js';

export const FootworkDistance = Object.freeze({
  CLOSE: 0,
  MID: 1,
  FAR: 2,
});

const patched = Symbol.for('blade-reversal.footwork');
const states = new WeakMap();
const profiledEnemies = new WeakSet();
let activeEngine = null;
let uiInstalled = false;
let stepPointer = null;
let feedbackTimer = null;

const RANGE_LABELS = ['近', '中', '遠'];

function clampDistance(value) {
  return Math.max(FootworkDistance.CLOSE, Math.min(FootworkDistance.FAR, Math.round(Number(value) || 0)));
}

function profileFor(enemy, attack, index) {
  const id = enemy?.id || '';
  const heavy = Boolean(attack?.heavy);
  const side = heavy ? 0 : index % 2 === 0 ? -1 : 1;

  if (id === 'ashigaru-scout') {
    const reach = [0, 1, 0, 2][index % 4];
    return { reach, setup: reach === 2 ? 1 : reach, side };
  }

  if (id === 'wandering-ronin') {
    const reach = [1, 0, 1, 1, 0][index % 5];
    return { reach, setup: reach, side };
  }

  if (id === 'oni-guard') {
    const reach = heavy ? 2 : index % 2 === 0 ? 1 : 0;
    return { reach, setup: heavy ? 2 : reach, side };
  }

  if (id === 'crimson-shogun') {
    const reach = heavy ? 2 : 1;
    return { reach, setup: heavy ? 2 : 1, side };
  }

  const reach = heavy ? 2 : 1;
  return { reach, setup: Math.min(1, reach), side };
}

function decorateEnemy(enemy) {
  if (!enemy || typeof enemy !== 'object' || profiledEnemies.has(enemy)) return enemy;
  const attacks = Array.isArray(enemy.attacks)
    ? enemy.attacks.map((attack, index) => {
        const profile = profileFor(enemy, attack, index);
        return {
          ...attack,
          footworkReach: profile.reach,
          footworkSetupDistance: profile.setup,
          footworkSide: profile.side,
        };
      })
    : enemy.attacks;
  const clone = { ...enemy, attacks };
  profiledEnemies.add(clone);
  return clone;
}

function ensureProfiles(engine) {
  if (!Array.isArray(engine?.enemies)) return;
  engine.enemies = engine.enemies.map(decorateEnemy);
}

function stateFor(engine) {
  let state = states.get(engine);
  if (!state) {
    state = {
      distance: FootworkDistance.MID,
      seenAttack: null,
    };
    states.set(engine, state);
  }
  return state;
}

function setupAttack(engine) {
  const state = stateFor(engine);
  const attack = engine.currentAttack;
  if (!attack || state.seenAttack === attack) return;

  state.seenAttack = attack;
  const reach = clampDistance(Number.isFinite(attack.footworkReach) ? attack.footworkReach : attack.heavy ? 2 : 1);
  const from = state.distance;
  const requested = Number.isFinite(attack.footworkSetupDistance)
    ? clampDistance(attack.footworkSetupDistance)
    : Math.min(from, reach);
  const to = Math.min(requested, reach);

  state.distance = to;
  attack.reachDistance = reach;
  attack.distanceFrom = from;
  attack.distanceTo = to;
  attack.footworkSide = Number(attack.footworkSide) || 0;
  attack.backstepAttempted = false;
  attack.evaded = false;

  const telegraph = [...engine.events].reverse().find((event) => event.type === 'telegraph');
  if (telegraph?.detail) {
    telegraph.detail.reachDistance = reach;
    telegraph.detail.distanceFrom = from;
    telegraph.detail.distanceTo = to;
    telegraph.detail.footworkSide = attack.footworkSide;
  }

  engine.events.push({
    type: 'enemy-footwork',
    detail: {
      enemyId: engine.enemy?.id,
      distanceFrom: from,
      distanceTo: to,
      reachDistance: reach,
      side: attack.footworkSide,
    },
  });
}

function installStyle() {
  if (document.querySelector('style[data-footwork]')) return;
  const style = document.createElement('style');
  style.dataset.footwork = 'true';
  style.textContent = `
    .footwork-step{position:absolute;z-index:9;left:50%;bottom:calc(var(--safe-bottom) + 38px);width:66px;height:66px;transform:translateX(-50%);border:1px solid rgba(228,182,107,.28);border-radius:50%;background:radial-gradient(circle,rgba(228,182,107,.12),rgba(8,9,12,.24) 58%,rgba(8,9,12,.05));box-shadow:0 0 26px rgba(228,182,107,.08),inset 0 0 18px rgba(255,255,255,.025);display:grid;place-items:center;align-content:center;gap:1px;color:rgba(255,228,184,.72);font:800 8px/1 system-ui,sans-serif;letter-spacing:.12em;touch-action:none;opacity:.52;backdrop-filter:blur(3px);transition:opacity .12s,transform .12s,border-color .12s}
    .footwork-step[hidden]{display:none}
    .footwork-step span{font-size:7px;font-weight:650;letter-spacing:.05em;color:rgba(242,235,223,.46)}
    .footwork-step:active,.footwork-step.is-active{opacity:.95;border-color:rgba(255,216,147,.72);transform:translateX(-50%) scale(.94)}
    .footwork-range{position:absolute;z-index:8;left:50%;bottom:calc(var(--safe-bottom) + 109px);transform:translateX(-50%);padding:4px 8px;border:1px solid rgba(255,255,255,.08);border-radius:999px;background:rgba(7,8,11,.36);color:rgba(240,232,220,.52);font:700 7px/1 system-ui,sans-serif;letter-spacing:.1em;pointer-events:none;text-shadow:0 2px 9px #000}
    .footwork-range[hidden]{display:none}
    .footwork-feedback{position:absolute;z-index:10;left:50%;bottom:calc(var(--safe-bottom) + 184px);transform:translateX(-50%) translateY(5px);min-width:155px;padding:6px 10px;border-radius:10px;background:rgba(9,10,14,.58);border:1px solid rgba(228,182,107,.18);color:#ffe0a6;text-align:center;font:800 8px/1.2 system-ui,sans-serif;letter-spacing:.07em;opacity:0;pointer-events:none;transition:opacity .12s,transform .12s;text-shadow:0 2px 8px #000}
    .footwork-feedback.is-visible{opacity:1;transform:translateX(-50%) translateY(0)}
    #game-canvas.footwork-camera{transform-origin:50% 55%;will-change:transform;transition:transform 110ms cubic-bezier(.2,.8,.2,1)}
    @media (max-width:360px){.footwork-step{width:60px;height:60px;bottom:calc(var(--safe-bottom) + 34px)}.footwork-range{bottom:calc(var(--safe-bottom) + 99px)}.footwork-feedback{bottom:calc(var(--safe-bottom) + 166px)}}
    @media (prefers-reduced-motion:reduce){#game-canvas.footwork-camera{transform:none!important;transition:none}.footwork-feedback,.footwork-step{transition:none}}
  `;
  document.head.append(style);
}

function showFeedback(text, strong = false) {
  const node = document.querySelector('#footwork-feedback');
  if (!node) return;
  if (feedbackTimer !== null) clearTimeout(feedbackTimer);
  node.textContent = text;
  node.classList.add('is-visible');
  node.style.borderColor = strong ? 'rgba(126,174,255,.42)' : 'rgba(228,182,107,.18)';
  feedbackTimer = window.setTimeout(() => {
    node.classList.remove('is-visible');
    feedbackTimer = null;
  }, strong ? 720 : 520);
}

function installUi() {
  if (uiInstalled || typeof document === 'undefined') return;
  const app = document.querySelector('#app');
  const canvas = document.querySelector('#game-canvas');
  if (!app || !canvas) return;

  uiInstalled = true;
  installStyle();
  canvas.classList.add('footwork-camera');

  const step = document.createElement('button');
  step.id = 'footwork-step';
  step.className = 'footwork-step';
  step.type = 'button';
  step.hidden = true;
  step.setAttribute('aria-label', '後撤步');
  step.innerHTML = 'STEP<span>後撤</span>';

  const range = document.createElement('div');
  range.id = 'footwork-range';
  range.className = 'footwork-range';
  range.hidden = true;
  range.textContent = '距離 · 中';

  const feedback = document.createElement('div');
  feedback.id = 'footwork-feedback';
  feedback.className = 'footwork-feedback';
  feedback.setAttribute('aria-live', 'polite');

  app.append(step, range, feedback);

  const hint = document.querySelector('#gesture-hint');
  if (hint) hint.textContent = '四邊格擋 · 掃屏反擊 · STEP 後撤';
  const startSmall = document.querySelector('#start-screen small');
  if (startSmall && !startSmall.textContent.includes('STEP')) {
    startSmall.textContent += ' · STEP 可後撤避開短距離斬擊';
  }

  step.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    event.stopPropagation();
    stepPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    step.classList.add('is-active');
    step.setPointerCapture?.(event.pointerId);
  });

  step.addEventListener('pointerup', (event) => {
    event.preventDefault();
    event.stopPropagation();
    step.classList.remove('is-active');
    if (!stepPointer || stepPointer.id !== event.pointerId) {
      stepPointer = null;
      return;
    }
    const travel = Math.hypot(event.clientX - stepPointer.x, event.clientY - stepPointer.y);
    stepPointer = null;
    if (travel > 18 || !activeEngine) return;

    const outcome = activeEngine.attemptBackstep(performance.now());
    if (outcome.accepted) {
      showFeedback('EVADE · 短斬落空，掃屏反擊', true);
      navigator.vibrate?.(18);
    } else if (outcome.reason === 'tracked') {
      showFeedback('追步斬 · 距離拉唔開，改用格擋');
    } else if (outcome.reason === 'late') {
      showFeedback('太遲 · 刀已追到');
    } else {
      showFeedback('等刀落一刻先 STEP');
    }
  });

  step.addEventListener('pointercancel', () => {
    step.classList.remove('is-active');
    stepPointer = null;
  });

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const frame = () => {
    if (!activeEngine) {
      step.hidden = true;
      range.hidden = true;
      requestAnimationFrame(frame);
      return;
    }

    const snapshot = activeEngine.snapshot(performance.now());
    const active =
      snapshot.started &&
      !['ready', 'stage-intro', 'stage-clear', 'victory', 'defeat'].includes(snapshot.phase);

    step.hidden = !active;
    range.hidden = !active;
    if (active) range.textContent = `距離 · ${RANGE_LABELS[clampDistance(snapshot.enemyDistance)]}`;

    if (reducedMotion?.matches || !active) {
      canvas.style.transform = '';
    } else {
      const distance = clampDistance(snapshot.enemyDistance);
      const scale = [1.028, 1, 0.976][distance];
      const y = [4, 0, -3][distance];
      const side =
        snapshot.phase === 'telegraph'
          ? (Number(snapshot.attack?.footworkSide) || 0) * Math.sin(snapshot.phaseProgress * Math.PI) * 4
          : 0;
      canvas.style.transform = `translate3d(${side}px,${y}px,0) scale(${scale})`;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

export function installFootwork(Engine = CombatEngine) {
  if (!Engine?.prototype || Engine.prototype[patched]) {
    if (typeof document !== 'undefined') installUi();
    return;
  }

  const originalStart = Engine.prototype.start;
  const originalUpdate = Engine.prototype.update;
  const originalSnapshot = Engine.prototype.snapshot;
  const originalAttemptAttack = Engine.prototype.attemptAttack;

  Object.defineProperty(Engine.prototype, patched, { value: true });

  Engine.prototype.start = function footworkStart(now = 0) {
    states.set(this, { distance: FootworkDistance.MID, seenAttack: null });
    const result = originalStart.call(this, now);
    ensureProfiles(this);
    activeEngine = this;
    return result;
  };

  Engine.prototype.update = function footworkUpdate(now) {
    ensureProfiles(this);
    const eventStart = this.events.length;
    const result = originalUpdate.call(this, now);
    ensureProfiles(this);
    setupAttack(this);

    const state = stateFor(this);
    for (const event of this.events.slice(eventStart)) {
      if (event.type === 'stage-start') {
        state.distance = FootworkDistance.MID;
        state.seenAttack = null;
      } else if (event.type === 'player-hit') {
        state.distance = Math.min(state.distance, FootworkDistance.MID);
      }
    }
    return result;
  };

  Engine.prototype.attemptBackstep = function attemptBackstep(now) {
    const state = stateFor(this);
    const attack = this.currentAttack;
    if (!Number.isFinite(now) || this.phase !== 'strike' || !attack) {
      this.events.push({ type: 'footwork-miss', detail: { reason: 'wrong-time' } });
      return { accepted: false, reason: 'wrong-time' };
    }
    if (attack.backstepAttempted) {
      return { accepted: false, reason: 'already-used' };
    }

    const elapsed = Math.max(0, now - (attack.strikeStartedAt || this.phaseStartedAt));
    const windowMs = Math.max(82, Math.min(150, Math.round((attack.strikeMs || 180) * 0.72)));
    if (elapsed > windowMs) {
      attack.backstepAttempted = true;
      this.events.push({ type: 'footwork-miss', detail: { reason: 'late', elapsed, windowMs } });
      return { accepted: false, reason: 'late', elapsed, windowMs };
    }

    attack.backstepAttempted = true;
    const from = state.distance;
    state.distance = clampDistance(state.distance + 1);
    const reach = clampDistance(Number.isFinite(attack.reachDistance) ? attack.reachDistance : attack.heavy ? 2 : 1);

    if (state.distance <= reach) {
      this.events.push({
        type: 'footwork-miss',
        detail: {
          reason: 'tracked',
          distanceFrom: from,
          distanceTo: state.distance,
          reachDistance: reach,
        },
      });
      return {
        accepted: false,
        reason: 'tracked',
        distance: state.distance,
        reachDistance: reach,
      };
    }

    attack.evaded = true;
    attack.parried = false;
    this.combo = 0;
    this.score += 90;
    this.phase = 'recovery';
    this.phaseStartedAt = now;
    this.phaseEndsAt = now + Math.round(this.enemy.recoveryMs * 0.88);
    this.events.push({
      type: 'backstep-evade',
      detail: {
        direction: attack.direction,
        distanceFrom: from,
        distanceTo: state.distance,
        reachDistance: reach,
      },
    });

    return {
      accepted: true,
      evaded: true,
      distance: state.distance,
      reachDistance: reach,
    };
  };

  Engine.prototype.attemptAttack = function footworkCounter(direction, now) {
    const attack = this.currentAttack;
    const evaded = Boolean(attack?.evaded && this.phase === 'recovery');
    const originalParried = attack?.parried;
    if (evaded && attack) attack.parried = true;

    const eventStart = this.events.length;
    const result = originalAttemptAttack.call(this, direction, now);

    if (evaded && attack && this.currentAttack === attack) attack.parried = originalParried;
    if (evaded && result?.accepted) {
      const state = stateFor(this);
      state.distance = clampDistance(state.distance - 1);
      const counter = this.events.slice(eventStart).find((event) => event.type === 'counter');
      if (counter?.detail) counter.detail.evaded = true;
      ensureProfiles(this);
      if (result.bossPhase === 2) state.distance = FootworkDistance.MID;
      return { ...result, evaded: true };
    }
    return result;
  };

  Engine.prototype.snapshot = function footworkSnapshot(now) {
    const snapshot = originalSnapshot.call(this, now);
    const state = stateFor(this);
    const attack = this.currentAttack;
    return {
      ...snapshot,
      enemyDistance: state.distance,
      enemyDistanceLabel: RANGE_LABELS[state.distance],
      attack: snapshot.attack
        ? {
            ...snapshot.attack,
            reachDistance: clampDistance(Number.isFinite(attack?.reachDistance) ? attack.reachDistance : attack?.heavy ? 2 : 1),
            distanceFrom: clampDistance(Number.isFinite(attack?.distanceFrom) ? attack.distanceFrom : state.distance),
            distanceTo: clampDistance(Number.isFinite(attack?.distanceTo) ? attack.distanceTo : state.distance),
            footworkSide: Number(attack?.footworkSide) || 0,
            evaded: Boolean(attack?.evaded),
          }
        : null,
    };
  };

  if (typeof document !== 'undefined') {
    installUi();
    document.documentElement.dataset.footworkReady = 'true';
  }
}

if (typeof document !== 'undefined') installFootwork();
