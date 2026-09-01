import './run-analysis.js';
import { CombatEngine } from './game-core.js';
import {
  createMasterySession,
  finishMastery,
  formatMasteryTime,
  isBetterMastery,
  observeMasteryEvent,
} from './mastery.js';

const BEST_KEY = 'blade-reversal-mastery-v1';
const CHALLENGE_ACTIVE = Symbol.for('blade-reversal.challenge-active-v1');
const sessions = new WeakMap();
const patched = Symbol.for('blade-reversal.mastery-observer');

function readBest() {
  try {
    const value = JSON.parse(localStorage.getItem(BEST_KEY) || 'null');
    return value && Number.isFinite(value.masteryPoints) && Number.isFinite(value.score) ? value : null;
  } catch {
    return null;
  }
}

function writeBest(report) {
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify({
      masteryPoints: report.masteryPoints,
      grade: report.grade,
      score: report.score,
    }));
  } catch {
    // Storage may be disabled or unavailable; mastery grading still works.
  }
}

function formatScore(value) {
  return Math.max(0, Math.round(Number(value) || 0)).toString().padStart(6, '0');
}

function practiceLabel(enemyId) {
  if (enemyId === 'crimson-shogun') return 'SHOGUN PRACTICE';
  return 'RONIN PRACTICE';
}

function renderReport(report, { practice = false, practiceEnemyId = null, challenge = false } = {}) {
  const eyebrow = document.querySelector('#result-eyebrow');
  const title = document.querySelector('#result-title');
  const summary = document.querySelector('#result-summary');
  const score = document.querySelector('#result-score');
  if (!eyebrow || !title || !summary || !score) return;

  const isolated = practice || challenge;
  const previousBest = isolated ? null : readBest();
  const newBest = !isolated && report.won && isBetterMastery(report, previousBest);
  if (newBest) writeBest(report);
  const best = newBest ? report : previousBest;

  if (challenge) {
    eyebrow.textContent = `連戰試煉 · MASTERY ${report.masteryPoints}`;
    title.textContent = report.won ? `${report.grade} 級 · 八關制霸` : `${report.grade} 級 · 連戰終止`;
  } else if (practice) {
    eyebrow.textContent = `${practiceLabel(practiceEnemyId)} · MASTERY ${report.masteryPoints}`;
    title.textContent = report.won ? `${report.grade} 級 · 修行完成` : '修行敗北';
  } else {
    eyebrow.textContent = report.won ? `VICTORY · MASTERY ${report.masteryPoints}` : `DEFEAT · MASTERY ${report.masteryPoints}`;
    title.textContent = report.won ? `${report.grade} 級` : '敗北';
  }

  const accuracy = Math.round(report.accuracy * 100);
  const bestText = challenge
    ? ' · 連戰紀錄獨立計算'
    : practice
      ? ' · 不計個人最佳'
      : best
        ? newBest
          ? ' · 新紀錄'
          : ` · BEST ${best.grade} ${formatScore(best.score)}`
        : '';

  summary.textContent =
    `格擋 ${accuracy}% · 完美 ${report.perfectParries}/${report.parries} · ` +
    `破防 ${report.guardBreaks} · 受擊 ${report.hitsTaken} · ${formatMasteryTime(report.elapsedMs)}${bestText}`;
  score.textContent = formatScore(report.score);
}

if (!CombatEngine.prototype[patched]) {
  const originalStart = CombatEngine.prototype.start;
  const originalDrainEvents = CombatEngine.prototype.drainEvents;

  Object.defineProperty(CombatEngine.prototype, patched, { value: true });

  CombatEngine.prototype.start = function masteryStart(now = 0) {
    sessions.set(this, createMasterySession(now));
    return originalStart.call(this, now);
  };

  CombatEngine.prototype.drainEvents = function masteryDrainEvents() {
    const events = originalDrainEvents.call(this);
    const session = sessions.get(this);
    if (!session) return events;

    for (const event of events) {
      observeMasteryEvent(session, event);
      if (event.type === 'victory' || event.type === 'defeat') {
        const challenge = Boolean(this[CHALLENGE_ACTIVE]);
        const practice = !challenge && Boolean(event.detail?.practice);
        const report = finishMastery(session, {
          now: performance.now(),
          score: event.detail?.score,
          won: event.type === 'victory',
        });
        queueMicrotask(() => renderReport(report, {
          practice,
          practiceEnemyId: event.detail?.practiceEnemyId ?? null,
          challenge,
        }));
      }
    }

    return events;
  };
}

document.documentElement.dataset.masteryReady = 'true';
