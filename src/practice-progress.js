import { CombatEngine } from './game-core.js';
import {
  buildDirectionFocus,
  createRunAnalysisSession,
  finishRunAnalysis,
  observeRunAnalysisEvent,
} from './run-analysis.js';

const installed = Symbol.for('blade-reversal.practice-progress-v1');
const sessions = new WeakMap();
const routeHistory = new Map();

function clampPct(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function practiceRouteKey(detail = {}) {
  if (detail.practiceMode) return `mode:${detail.practiceMode}`;
  if (detail.practiceEnemyId) return `enemy:${detail.practiceEnemyId}`;
  return null;
}

function snapshotDirectionFocus(stage) {
  const focus = buildDirectionFocus(stage);
  if (!focus) return null;
  return Object.freeze({
    weakDirection: focus.weakDirection,
    weakLabel: focus.weakLabel,
    weakAccuracyPct: focus.weakAccuracyPct,
    rows: Object.freeze(focus.rows.map((row) => Object.freeze({
      direction: row.direction,
      label: row.label,
      symbol: row.symbol,
      faced: row.faced,
      defended: row.defended,
      accuracyPct: row.accuracyPct,
    }))),
  });
}

export function buildPracticeSnapshot(report) {
  const stages = Array.isArray(report?.stages) ? report.stages : [];
  const stage = stages[stages.length - 1];
  if (!stage) return null;

  const directionRows = Object.values(stage.directionReads || {});
  const faced = directionRows.reduce((sum, row) => sum + Math.max(0, Number(row?.faced) || 0), 0);
  const defended = directionRows.reduce((sum, row) => sum + Math.max(0, Number(row?.defended) || 0), 0);
  const defensePct = faced > 0 ? clampPct((defended / faced) * 100) : null;
  const counterOpenings = Math.max(0, Number(stage.counterOpenings) || 0);
  const counters = Math.max(0, Number(stage.counters) || 0);
  const counterPct = counterOpenings > 0 ? clampPct((counters / counterOpenings) * 100) : null;

  return Object.freeze({
    defensePct,
    hitsTaken: Math.max(0, Number(stage.hitsTaken) || 0),
    counterPct,
    directionFocus: snapshotDirectionFocus(stage),
  });
}

function signed(value, suffix = '') {
  if (!Number.isFinite(value)) return `—${suffix}`;
  if (value === 0) return `±0${suffix}`;
  return `${value > 0 ? '+' : '−'}${Math.abs(value)}${suffix}`;
}

function compareMetric(previous, current, lowerIsBetter = false) {
  if (!Number.isFinite(previous) || !Number.isFinite(current)) {
    return Object.freeze({ delta: null, quality: 0 });
  }
  const delta = current - previous;
  const quality = Math.sign(lowerIsBetter ? -delta : delta);
  return Object.freeze({ delta, quality });
}

export function comparePracticeSnapshots(previous, current) {
  if (!previous || !current) return null;
  const defense = compareMetric(previous.defensePct, current.defensePct);
  const hits = compareMetric(previous.hitsTaken, current.hitsTaken, true);
  const counter = compareMetric(previous.counterPct, current.counterPct);
  const quality = [defense.quality, hits.quality, counter.quality].reduce((sum, value) => sum + value, 0);
  const status = quality > 0 ? '有進步' : quality < 0 ? '再磨一局' : '大致持平';

  return Object.freeze({
    status,
    defenseDelta: defense.delta,
    hitsDelta: hits.delta,
    counterDelta: counter.delta,
    text: `比上次：防守 ${signed(defense.delta, '%')} · 受擊 ${signed(hits.delta)} · 反擊 ${signed(counter.delta, '%')}`,
  });
}

function focusRow(snapshot, direction) {
  return snapshot?.directionFocus?.rows?.find((row) => row.direction === direction) || null;
}

function pct(value) {
  return Number.isFinite(value) ? `${value}%` : '—';
}

export function buildPracticeFocusCoach(previous, current) {
  const focus = current?.directionFocus;
  if (!focus) return null;

  const nextRow = focusRow(current, focus.weakDirection);
  const observed = focus.rows.filter((row) => row.faced > 0);
  const allObservedPerfect = observed.length > 0 && observed.every((row) => row.accuracyPct === 100);

  let trackedDirection = null;
  let trackedDelta = null;
  let trackedText = '';
  const previousDirection = previous?.directionFocus?.weakDirection;
  if (previousDirection) {
    trackedDirection = previousDirection;
    const previousRow = focusRow(previous, previousDirection);
    const currentRow = focusRow(current, previousDirection);
    const label = previousRow?.label || previous?.directionFocus?.weakLabel || previousDirection;
    if (previousRow?.faced > 0 && currentRow?.faced > 0) {
      trackedDelta = Number.isFinite(previousRow.accuracyPct) && Number.isFinite(currentRow.accuracyPct)
        ? currentRow.accuracyPct - previousRow.accuracyPct
        : null;
      trackedText = `上局${label} ${pct(previousRow.accuracyPct)}→${pct(currentRow.accuracyPct)}（${signed(trackedDelta, '%')}）`;
    } else {
      trackedText = `上局${label}今局未再遇到`;
    }
  }

  const nextText = allObservedPerfect
    ? '今局遇到刀路全守住｜下一局保持節奏，試收窄 Perfect 時機'
    : `下局目標：${focus.weakLabel} ${pct(focus.weakAccuracyPct)}（防 ${nextRow?.defended ?? 0}/${nextRow?.faced ?? 0}）｜先守穩再反擊`;

  return Object.freeze({
    nextDirection: focus.weakDirection,
    nextLabel: focus.weakLabel,
    nextAccuracyPct: focus.weakAccuracyPct,
    trackedDirection,
    trackedDelta,
    allObservedPerfect,
    text: [trackedText, nextText].filter(Boolean).join(' · '),
  });
}

function installStyles() {
  if (document.querySelector('style[data-practice-progress-style]')) return;
  const style = document.createElement('style');
  style.dataset.practiceProgressStyle = 'true';
  style.textContent = `
    .result-analysis__practice-progress{margin-top:8px;padding:7px 8px;border:1px solid rgba(129,193,154,.2);border-radius:9px;background:rgba(57,106,75,.09)}
    .result-analysis__practice-progress[hidden],.result-analysis__practice-focus[hidden]{display:none}
    .result-analysis__practice-progress strong,.result-analysis__practice-progress span{display:block}
    .result-analysis__practice-progress strong{font-size:10px;letter-spacing:.08em;color:rgba(184,229,198,.9)}
    .result-analysis__practice-progress span{margin-top:2px;font-size:10px;line-height:1.3;color:rgba(237,235,224,.72)}
    .result-analysis__practice-focus{margin-top:4px!important;padding-top:4px;border-top:1px solid rgba(184,229,198,.12);color:rgba(220,238,224,.82)!important}
    @media(max-width:360px){.result-analysis__practice-progress{padding:6px 7px}.result-analysis__practice-progress span{font-size:9.5px}.result-analysis__practice-focus{font-size:9px!important}}
  `;
  document.head.append(style);
}

function ensureProgressNode() {
  const panel = document.querySelector('#result-analysis');
  if (!panel) return null;
  let node = panel.querySelector('[data-practice-progress-row]');
  if (!node) {
    node = document.createElement('div');
    node.className = 'result-analysis__practice-progress';
    node.dataset.practiceProgressRow = 'true';
    node.hidden = true;
    node.innerHTML = '<strong data-practice-progress-title></strong><span data-practice-progress-copy></span><span class="result-analysis__practice-focus" data-practice-progress-focus></span>';
    const tip = panel.querySelector('[data-analysis-tip]');
    if (tip) tip.insertAdjacentElement('beforebegin', node);
    else panel.append(node);
  }
  return node;
}

function hideProgress() {
  const node = document.querySelector('#result-analysis [data-practice-progress-row]');
  if (node) node.hidden = true;
  delete document.documentElement.dataset.practiceProgressState;
  delete document.documentElement.dataset.practiceProgressRoute;
  delete document.documentElement.dataset.practiceProgressFocusDirection;
  delete document.documentElement.dataset.practiceProgressTrackedDirection;
  delete document.documentElement.dataset.practiceProgressFocusState;
}

function renderProgress(routeKey, report) {
  installStyles();
  const node = ensureProgressNode();
  const snapshot = buildPracticeSnapshot(report);
  if (!node || !routeKey || !snapshot) {
    hideProgress();
    return;
  }

  const title = node.querySelector('[data-practice-progress-title]');
  const copy = node.querySelector('[data-practice-progress-copy]');
  const focusCopy = node.querySelector('[data-practice-progress-focus]');
  const previous = routeHistory.get(routeKey) || null;
  const comparison = comparePracticeSnapshots(previous, snapshot);
  const coach = buildPracticeFocusCoach(previous, snapshot);

  if (comparison) {
    title.textContent = `修行進度 · ${comparison.status}`;
    copy.textContent = comparison.text;
    document.documentElement.dataset.practiceProgressState = 'comparison';
  } else {
    title.textContent = '修行進度';
    copy.textContent = '再戰同一對手一次，就會比較今局與上局的防守、受擊及反擊。';
    document.documentElement.dataset.practiceProgressState = 'first';
  }

  if (focusCopy) {
    focusCopy.textContent = coach?.text || '';
    focusCopy.hidden = !coach;
  }
  if (coach) {
    document.documentElement.dataset.practiceProgressFocusDirection = coach.nextDirection;
    document.documentElement.dataset.practiceProgressFocusState = coach.allObservedPerfect ? 'clear' : 'target';
    if (coach.trackedDirection) {
      document.documentElement.dataset.practiceProgressTrackedDirection = coach.trackedDirection;
    } else {
      delete document.documentElement.dataset.practiceProgressTrackedDirection;
    }
  } else {
    delete document.documentElement.dataset.practiceProgressFocusDirection;
    delete document.documentElement.dataset.practiceProgressTrackedDirection;
    delete document.documentElement.dataset.practiceProgressFocusState;
  }

  routeHistory.set(routeKey, snapshot);
  node.hidden = false;
  document.documentElement.dataset.practiceProgressRoute = routeKey;
}

export function installPracticeProgress(Engine = CombatEngine) {
  if (typeof document === 'undefined' || !Engine?.prototype || Engine.prototype[installed]) return;
  const originalStart = Engine.prototype.start;
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.start = function practiceProgressStart(now = 0) {
    sessions.set(this, createRunAnalysisSession());
    return originalStart.call(this, now);
  };

  Engine.prototype.drainEvents = function practiceProgressDrainEvents() {
    const events = originalDrainEvents.call(this);
    const session = sessions.get(this);
    if (!session) return events;

    for (const event of events) {
      observeRunAnalysisEvent(session, event);
      if (event.type !== 'victory' && event.type !== 'defeat') continue;
      const routeKey = event.detail?.practice ? practiceRouteKey(event.detail) : null;
      if (!routeKey) {
        queueMicrotask(hideProgress);
        continue;
      }
      const report = finishRunAnalysis(session, {
        won: event.type === 'victory',
        score: event.detail?.score,
      });
      queueMicrotask(() => renderProgress(routeKey, report));
    }

    return events;
  };

  installStyles();
  ensureProgressNode();
  document.documentElement.dataset.practiceProgressReady = 'true';
}

if (typeof document !== 'undefined') installPracticeProgress();
