import { CombatEngine } from './game-core.js';
import { CHALLENGE_ACTIVE } from './challenge-mode.js';

const installed = Symbol.for('blade-reversal.challenge-tactic-reflection-v1');
const states = new WeakMap();

function stateFor(engine) {
  let state = states.get(engine);
  if (!state) {
    state = { active: false, records: [] };
    states.set(engine, state);
  }
  return state;
}

function choiceMark(choice) {
  return choice === 'blood-vow' ? '誓' : choice === 'recover' ? '息' : '';
}

function settleNextWave(state, stage, result) {
  const targetStage = Math.max(1, Math.floor(Number(stage) || 0));
  for (let index = state.records.length - 1; index >= 0; index -= 1) {
    const record = state.records[index];
    if (record.nextStage === targetStage && !record.result) {
      record.result = result;
      return record;
    }
  }
  return null;
}

function recordPlayerHit(state, stage) {
  const targetStage = Math.max(1, Math.floor(Number(stage) || 0));
  for (let index = state.records.length - 1; index >= 0; index -= 1) {
    const record = state.records[index];
    if (record.nextStage === targetStage && !record.result) {
      record.hitEvents += 1;
      return;
    }
  }
}

export function summariseChallengeTacticReflection(records = []) {
  const outcomes = [];
  for (const item of Array.isArray(records) ? records : []) {
    const checkpoint = Math.floor(Number(item?.checkpoint) || 0);
    const nextStage = Math.floor(Number(item?.nextStage) || 0);
    const choice = item?.choice;
    const result = item?.result;
    if (![2, 4, 6].includes(checkpoint) || nextStage !== checkpoint + 1) continue;
    if (choice !== 'recover' && choice !== 'blood-vow') continue;
    if (result !== 'cleared' && result !== 'defeat') continue;
    outcomes.push({
      checkpoint,
      choice,
      nextStage,
      hitEvents: Math.max(0, Math.floor(Number(item?.hitEvents) || 0)),
      result,
    });
  }
  return {
    resolved: outcomes.length,
    hitless: outcomes.filter((item) => item.result === 'cleared' && item.hitEvents === 0).length,
    hitEvents: outcomes.reduce((total, item) => total + item.hitEvents, 0),
    outcomes,
  };
}

export function formatChallengeTacticReflection(summary = {}) {
  const outcomes = Array.isArray(summary?.outcomes) ? summary.outcomes : [];
  if (outcomes.length === 0) return '';
  const tokens = outcomes.map((item) => {
    const mark = choiceMark(item.choice);
    if (!mark) return '';
    if (item.result === 'defeat') {
      return `${item.checkpoint}${mark}→${item.nextStage}敗${item.hitEvents > 0 ? `（受擊${item.hitEvents}）` : ''}`;
    }
    return `${item.checkpoint}${mark}→${item.nextStage}${item.hitEvents > 0 ? `受擊${item.hitEvents}` : '無傷'}`;
  }).filter(Boolean);
  return tokens.length > 0 ? `戰策後果 · ${tokens.join(' · ')}` : '';
}

function ensureUi() {
  if (typeof document === 'undefined') return null;
  if (!document.querySelector('style[data-challenge-tactic-reflection]')) {
    const style = document.createElement('style');
    style.dataset.challengeTacticReflection = 'true';
    style.textContent = `
      .challenge-result.challenge-result--tactic-reflection{flex-wrap:wrap}
      .challenge-tactic-reflection{flex:0 0 100%;margin-top:-2px;color:rgba(220,231,206,.68);font-size:8.5px;line-height:1.15;text-align:left;letter-spacing:.02em;pointer-events:none}
      .challenge-tactic-reflection[hidden]{display:none}
      @media(max-width:360px) and (max-height:620px){.challenge-tactic-reflection{font-size:8px;line-height:1.08}}
    `;
    document.head.append(style);
  }
  const result = document.querySelector('#challenge-result');
  if (!result) return null;
  let node = result.querySelector('[data-challenge-tactic-reflection]');
  if (!node) {
    node = document.createElement('small');
    node.className = 'challenge-tactic-reflection';
    node.dataset.challengeTacticReflection = 'true';
    node.hidden = true;
    result.append(node);
  }
  return { result, node };
}

function clearUi() {
  if (typeof document === 'undefined') return;
  const ui = ensureUi();
  if (ui) {
    ui.node.hidden = true;
    ui.node.textContent = '';
    ui.result.classList.remove('challenge-result--tactic-reflection');
  }
  const root = document.documentElement;
  root.dataset.challengeTacticReflection = '';
  root.dataset.challengeTacticReflectionCount = '0';
}

function renderUi(summary) {
  if (typeof document === 'undefined') return;
  const text = formatChallengeTacticReflection(summary);
  if (!text) {
    clearUi();
    return;
  }
  const ui = ensureUi();
  if (!ui) return;
  ui.node.textContent = text;
  ui.node.hidden = false;
  ui.result.classList.add('challenge-result--tactic-reflection');
  const root = document.documentElement;
  root.dataset.challengeTacticReflection = text;
  root.dataset.challengeTacticReflectionCount = String(summary.resolved || 0);
}

export function installChallengeTacticReflection(Engine = CombatEngine) {
  if (!Engine?.prototype || Engine.prototype[installed]) return;
  const originalStart = Engine.prototype.start;
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.start = function challengeTacticReflectionStart(now = 0) {
    const result = originalStart.call(this, now);
    const state = stateFor(this);
    state.active = Boolean(this[CHALLENGE_ACTIVE]);
    state.records = [];
    clearUi();
    return result;
  };

  Engine.prototype.drainEvents = function challengeTacticReflectionDrainEvents() {
    const events = originalDrainEvents.call(this);
    const state = stateFor(this);
    const active = Boolean(this[CHALLENGE_ACTIVE]);
    if (!active) {
      if (state.active || state.records.length > 0) {
        state.active = false;
        state.records = [];
        clearUi();
      }
      return events;
    }

    state.active = true;
    for (const event of events) {
      if (event.type === 'challenge-tactic') {
        const checkpoint = Math.floor(Number(event.detail?.checkpoint) || 0);
        const choice = event.detail?.choice;
        if ([2, 4, 6].includes(checkpoint) && (choice === 'recover' || choice === 'blood-vow')) {
          state.records = state.records.filter((record) => record.checkpoint !== checkpoint);
          state.records.push({ checkpoint, choice, nextStage: checkpoint + 1, hitEvents: 0, result: null });
        }
      } else if (event.type === 'player-hit') {
        recordPlayerHit(state, this.enemyIndex + 1);
      } else if (event.type === 'enemy-defeated') {
        const stage = Math.max(1, Math.floor(Number(event.detail?.stage) || this.enemyIndex + 1));
        settleNextWave(state, stage, 'cleared');
      } else if (event.type === 'defeat') {
        settleNextWave(state, this.enemyIndex + 1, 'defeat');
        const summary = summariseChallengeTacticReflection(state.records);
        event.detail = { ...(event.detail || {}), challengeTacticReflection: summary };
        queueMicrotask(() => renderUi(summary));
      } else if (event.type === 'victory') {
        const summary = summariseChallengeTacticReflection(state.records);
        event.detail = { ...(event.detail || {}), challengeTacticReflection: summary };
        queueMicrotask(() => renderUi(summary));
      }
    }
    return events;
  };

  ensureUi();
  clearUi();
}

if (typeof document !== 'undefined') installChallengeTacticReflection();
