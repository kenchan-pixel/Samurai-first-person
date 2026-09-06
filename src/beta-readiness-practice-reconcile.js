import { markBetaReadinessItem } from './beta-readiness.js';

const root = document.documentElement;
const result = document.querySelector('#result-screen');
const restart = document.querySelector('#restart-button');

const RETRY_LABEL_BY_MODE = Object.freeze({
  'ronin-practice': '再練浪人',
  'oni-practice': '再戰鬼武者',
  'shogun-practice': '再戰將軍',
});

function isDirectPractice(mode) {
  const value = String(mode || '');
  return value === 'practice' || value.endsWith('-practice');
}

function reconcileDirectPracticeResult() {
  const mode = root?.dataset?.runMode || '';
  const visible = Boolean(result?.classList.contains('modal--visible'));
  const progressState = root?.dataset?.practiceProgressState || 'unset';
  const retryLabel = restart?.textContent?.trim() || '';
  const expectedRetryLabel = RETRY_LABEL_BY_MODE[mode] || '';

  if (root) {
    root.dataset.betaReadinessPracticeReconcileSnapshot = [
      `mode=${mode || 'unset'}`,
      `result=${visible ? 'visible' : 'hidden'}`,
      `practice=${progressState}`,
      `retry=${retryLabel || 'unset'}`,
      `expectedRetry=${expectedRetryLabel || 'unset'}`,
    ].join('|');
  }

  if (
    !visible ||
    !isDirectPractice(mode) ||
    !expectedRetryLabel ||
    retryLabel !== expectedRetryLabel
  ) {
    return;
  }

  // `practice-mode` owns this exact same-opponent retry label and writes it only
  // for a real direct-practice terminal. Re-render only the already-valid duel
  // item; repeat-practice still requires practiceProgressState=comparison.
  markBetaReadinessItem('duel');
  root.dataset.betaReadinessPracticeReconcile = 'terminal-retry-match';
}

if (root && result && restart && typeof MutationObserver === 'function') {
  const observer = new MutationObserver(reconcileDirectPracticeResult);
  observer.observe(root, { attributes: true, attributeFilter: ['data-run-mode'] });
  observer.observe(result, { attributes: true, attributeFilter: ['class'] });
  observer.observe(restart, { childList: true, subtree: true, characterData: true });
  root.dataset.betaReadinessPracticeReconcileReady = 'true';
}
