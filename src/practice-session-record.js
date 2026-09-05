import { CombatEngine } from './game-core.js';
import { buildPracticeSnapshot } from './practice-progress.js';
import {
  createRunAnalysisSession,
  finishRunAnalysis,
  observeRunAnalysisEvent,
} from './run-analysis.js';

const installed = Symbol.for('blade-reversal.practice-session-record-v1');
const sessions = new WeakMap();
const routeRecords = new Map();

function practiceRouteKey(detail = {}) {
  if (detail.practiceMode) return `mode:${detail.practiceMode}`;
  if (detail.practiceEnemyId) return `enemy:${detail.practiceEnemyId}`;
  return null;
}

function bestMax(previous, current) {
  if (!Number.isFinite(current)) return Number.isFinite(previous) ? previous : null;
  if (!Number.isFinite(previous)) return current;
  return Math.max(previous, current);
}

function bestMin(previous, current) {
  if (!Number.isFinite(current)) return Number.isFinite(previous) ? previous : null;
  if (!Number.isFinite(previous)) return current;
  return Math.min(previous, current);
}

export function updatePracticeSessionRecord(previous, current) {
  if (!current) return previous || null;
  const prior = previous || null;
  const refreshed = [];

  if (prior) {
    if (Number.isFinite(current.defensePct) && (!Number.isFinite(prior.bestDefensePct) || current.defensePct > prior.bestDefensePct)) refreshed.push('防守');
    if (Number.isFinite(current.hitsTaken) && (!Number.isFinite(prior.fewestHitsTaken) || current.hitsTaken < prior.fewestHitsTaken)) refreshed.push('受擊');
    if (Number.isFinite(current.counterPct) && (!Number.isFinite(prior.bestCounterPct) || current.counterPct > prior.bestCounterPct)) refreshed.push('反擊');
  }

  return Object.freeze({
    attempts: Math.max(0, Number(prior?.attempts) || 0) + 1,
    bestDefensePct: bestMax(prior?.bestDefensePct, current.defensePct),
    fewestHitsTaken: bestMin(prior?.fewestHitsTaken, current.hitsTaken),
    bestCounterPct: bestMax(prior?.bestCounterPct, current.counterPct),
    refreshed: Object.freeze(refreshed),
  });
}

function pct(value) {
  return Number.isFinite(value) ? `${value}%` : '—';
}

function count(value) {
  return Number.isFinite(value) ? String(value) : '—';
}

export function formatPracticeSessionRecord(record) {
  if (!record) return '';
  const refresh = record.refreshed?.length ? `｜今局刷新 ${record.refreshed.join('、')}` : '';
  return `本次修行 · ${record.attempts}局｜最佳 防守 ${pct(record.bestDefensePct)} · 受擊 ${count(record.fewestHitsTaken)} · 反擊 ${pct(record.bestCounterPct)}${refresh}`;
}

function installStyles() {
  if (document.querySelector('style[data-practice-session-record-style]')) return;
  const style = document.createElement('style');
  style.dataset.practiceSessionRecordStyle = 'true';
  style.textContent = `
    .result-analysis__practice-session-record{display:block;margin-top:3px!important;color:rgba(239,218,166,.78)!important;pointer-events:none}
    .result-analysis__practice-session-record[hidden]{display:none}
    @media(max-width:360px){.result-analysis__practice-session-record{font-size:9px!important;line-height:1.28!important}}
  `;
  document.head.append(style);
}

function ensureRecordNode() {
  const progress = document.querySelector('#result-analysis [data-practice-progress-row]');
  if (!progress) return null;
  let node = progress.querySelector('[data-practice-session-record]');
  if (!node) {
    node = document.createElement('span');
    node.className = 'result-analysis__practice-session-record';
    node.dataset.practiceSessionRecord = 'true';
    node.hidden = true;
    const focus = progress.querySelector('[data-practice-progress-focus]');
    if (focus) focus.insertAdjacentElement('beforebegin', node);
    else progress.append(node);
  }
  return node;
}

function hideRecord() {
  const node = document.querySelector('#result-analysis [data-practice-session-record]');
  if (node) node.hidden = true;
  delete document.documentElement.dataset.practiceSessionRecordRoute;
  delete document.documentElement.dataset.practiceSessionRecordAttempts;
  delete document.documentElement.dataset.practiceSessionRecordRefreshed;
}

function renderRecord(routeKey, report) {
  installStyles();
  const node = ensureRecordNode();
  const snapshot = buildPracticeSnapshot(report);
  if (!node || !routeKey || !snapshot) {
    hideRecord();
    return;
  }

  const record = updatePracticeSessionRecord(routeRecords.get(routeKey) || null, snapshot);
  routeRecords.set(routeKey, record);
  node.textContent = formatPracticeSessionRecord(record);
  node.hidden = false;
  document.documentElement.dataset.practiceSessionRecordRoute = routeKey;
  document.documentElement.dataset.practiceSessionRecordAttempts = String(record.attempts);
  document.documentElement.dataset.practiceSessionRecordRefreshed = record.refreshed.join(',') || 'none';
}

export function installPracticeSessionRecord(Engine = CombatEngine) {
  if (typeof document === 'undefined' || !Engine?.prototype || Engine.prototype[installed]) return;
  const originalStart = Engine.prototype.start;
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.start = function practiceSessionRecordStart(now = 0) {
    sessions.set(this, createRunAnalysisSession());
    return originalStart.call(this, now);
  };

  Engine.prototype.drainEvents = function practiceSessionRecordDrainEvents() {
    const events = originalDrainEvents.call(this);
    const session = sessions.get(this);
    if (!session) return events;

    for (const event of events) {
      observeRunAnalysisEvent(session, event);
      if (event.type !== 'victory' && event.type !== 'defeat') continue;
      const routeKey = event.detail?.practice ? practiceRouteKey(event.detail) : null;
      if (!routeKey) {
        queueMicrotask(hideRecord);
        continue;
      }
      const report = finishRunAnalysis(session, {
        won: event.type === 'victory',
        score: event.detail?.score,
      });
      queueMicrotask(() => renderRecord(routeKey, report));
    }

    return events;
  };

  installStyles();
  ensureRecordNode();
  document.documentElement.dataset.practiceSessionRecordReady = 'true';
}

if (typeof document !== 'undefined') installPracticeSessionRecord();
