import { markBetaReadinessItem } from './beta-readiness.js';

const root = document.documentElement;
const result = document.querySelector('#result-screen');
let settleFrame = 0;

function isDirectPractice(mode) {
  const value = String(mode || '');
  return value === 'practice' || value.endsWith('-practice');
}

function reconcileDirectPracticeResult() {
  settleFrame = 0;
  if (!result?.classList.contains('modal--visible')) return;
  if (!isDirectPractice(root.dataset.runMode)) return;

  // A direct-practice terminal is itself a valid first-duel receipt. Re-marking
  // `duel` is Set-idempotent, but it deliberately re-renders the canonical
  // Closed Beta next action after all terminal/practice microtasks have settled.
  // This avoids a stale campaign target without inventing repeat-practice progress.
  markBetaReadinessItem('duel');
  root.dataset.betaReadinessPracticeReconcile = 'settled';
}

function scheduleReconcile() {
  if (settleFrame || typeof requestAnimationFrame !== 'function') return;
  settleFrame = requestAnimationFrame(reconcileDirectPracticeResult);
}

if (root && result && typeof MutationObserver === 'function') {
  const observer = new MutationObserver(scheduleReconcile);
  observer.observe(root, {
    attributes: true,
    attributeFilter: ['data-run-mode', 'data-practice-progress-state'],
  });
  observer.observe(result, { attributes: true, attributeFilter: ['class'] });
  root.dataset.betaReadinessPracticeReconcileReady = 'true';
}
