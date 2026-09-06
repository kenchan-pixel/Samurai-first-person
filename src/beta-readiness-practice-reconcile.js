import { markBetaReadinessItem } from './beta-readiness.js';

const root = document.documentElement;
const result = document.querySelector('#result-screen');
const restart = document.querySelector('#restart-button');
let reconcileQueued = false;

function isDirectPractice(mode) {
  const value = String(mode || '');
  return value === 'practice' || value.endsWith('-practice');
}

function reconcileDirectPracticeResult() {
  reconcileQueued = false;
  const mode = root?.dataset?.runMode || '';
  const visible = Boolean(result?.classList.contains('modal--visible'));
  const progressState = root?.dataset?.practiceProgressState || 'unset';
  const retryLabel = restart?.textContent?.trim() || '';

  if (root) {
    root.dataset.betaReadinessPracticeReconcileSnapshot = [
      `mode=${mode || 'unset'}`,
      `result=${visible ? 'visible' : 'hidden'}`,
      `practice=${progressState}`,
      `retry=${retryLabel || 'unset'}`,
    ].join('|');
  }

  if (!visible || !isDirectPractice(mode)) return;

  // `practice-mode` owns the same-opponent retry control. Its terminal label
  // mutation is therefore an authoritative receipt that the real direct-
  // practice result has finished settling. Re-render only the already-valid
  // duel item; repeat-practice still requires practiceProgressState=comparison.
  markBetaReadinessItem('duel');
  root.dataset.betaReadinessPracticeReconcile = 'terminal-authority';
}

function scheduleReconcile() {
  if (reconcileQueued || typeof queueMicrotask !== 'function') return;
  reconcileQueued = true;
  queueMicrotask(reconcileDirectPracticeResult);
}

if (root && result && restart && typeof MutationObserver === 'function') {
  const observer = new MutationObserver(scheduleReconcile);
  observer.observe(root, {
    attributes: true,
    attributeFilter: ['data-run-mode', 'data-practice-progress-state'],
  });
  observer.observe(result, { attributes: true, attributeFilter: ['class'] });
  observer.observe(restart, { childList: true, subtree: true, characterData: true });
  root.dataset.betaReadinessPracticeReconcileReady = 'true';
}
