import {
  requestPractice,
  requestRoninPractice,
  requestOniPractice,
  requestShogunPractice,
} from './practice-mode.js';

const MODE_FOR_STAGE = Object.freeze({
  2: Object.freeze({ label: '練浪人', mode: 'ronin-practice', request: requestRoninPractice }),
  3: Object.freeze({ label: '練鬼', mode: 'oni-practice', request: requestOniPractice }),
  4: Object.freeze({ label: '練將軍', mode: 'shogun-practice', request: requestShogunPractice }),
});

let activeTraining = null;

export function recommendationFromFocusLabel(focusLabel = '') {
  const match = String(focusLabel).match(/第\s*(\d+)\s*關/);
  const stage = match ? Number(match[1]) : 0;
  if (!Number.isInteger(stage) || stage < 1 || stage > 4) return null;
  if (stage === 1) {
    return Object.freeze({
      stage,
      focusLabel: String(focusLabel).trim() || '第1關 · 足輕',
      actionLabel: '重練第一關',
      practiceMode: null,
    });
  }
  const route = MODE_FOR_STAGE[stage];
  if (!route) return null;
  return Object.freeze({
    stage,
    focusLabel: String(focusLabel).trim(),
    actionLabel: route.label,
    practiceMode: route.mode,
  });
}

function installStyles() {
  if (typeof document === 'undefined' || document.querySelector('style[data-training-recommendation]')) return;
  const style = document.createElement('style');
  style.dataset.trainingRecommendation = 'true';
  style.textContent = `
    .training-recommendation{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:8px;margin-top:8px;padding-top:8px;border-top:1px solid rgba(228,182,107,.14)}
    .training-recommendation[hidden]{display:none}
    .training-recommendation__copy{min-width:0}
    .training-recommendation__copy strong,.training-recommendation__copy span{display:block}
    .training-recommendation__copy strong{font-size:10px;letter-spacing:.1em;color:rgba(237,210,174,.68)}
    .training-recommendation__copy span{margin-top:2px;font-size:10.5px;line-height:1.3;color:rgba(245,237,224,.78)}
    .training-recommendation__button{min-width:88px;min-height:44px;padding:7px 10px;border:1px solid rgba(228,182,107,.35);border-radius:11px;background:rgba(228,182,107,.1);color:#f3dfbd;font-size:10px;font-weight:850;cursor:pointer}
    .training-recommendation__button:active{transform:translateY(1px)}
    @media(max-width:360px){.training-recommendation{gap:6px}.training-recommendation__button{min-width:82px;padding-inline:8px}}
  `;
  document.head.append(style);
}

function ensureUi() {
  if (typeof document === 'undefined') return null;
  const analysis = document.querySelector('#result-analysis');
  if (!analysis) return null;
  let panel = analysis.querySelector('#training-recommendation');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'training-recommendation';
    panel.className = 'training-recommendation';
    panel.hidden = true;
    panel.setAttribute('aria-live', 'polite');
    panel.innerHTML = '<div class="training-recommendation__copy"><strong data-training-title>師範建議</strong><span data-training-copy></span></div><button class="training-recommendation__button" data-training-action type="button"></button>';
    analysis.append(panel);
  }
  return panel;
}

function hideUi() {
  const panel = document.querySelector('#training-recommendation');
  if (panel) panel.hidden = true;
}

function resultVisible() {
  const result = document.querySelector('#result-screen');
  return Boolean(result?.classList.contains('modal--visible'));
}

function renderCampaignRecommendation(recommendation) {
  const panel = ensureUi();
  if (!panel || !recommendation) return;
  const title = panel.querySelector('[data-training-title]');
  const copy = panel.querySelector('[data-training-copy]');
  const button = panel.querySelector('[data-training-action]');
  if (!title || !copy || !button) return;
  title.textContent = '師範建議 · 弱點再練';
  copy.textContent = `${recommendation.focusLabel} · 由今局分析直接轉入專項練習`;
  button.textContent = recommendation.actionLabel;
  button.dataset.trainingStage = String(recommendation.stage);
  panel.hidden = false;
  document.documentElement.dataset.trainingRecommendationStage = String(recommendation.stage);
  document.documentElement.dataset.trainingRecommendationState = 'recommended';
}

function renderTrainingComplete(recommendation) {
  const panel = ensureUi();
  if (!panel || !recommendation) return;
  const title = panel.querySelector('[data-training-title]');
  const copy = panel.querySelector('[data-training-copy]');
  const button = panel.querySelector('[data-training-action]');
  if (!title || !copy || !button) return;
  title.textContent = '師範專項 · 完成一輪';
  copy.textContent = `${recommendation.focusLabel} 已完成；可再練一次，或者用下方按鈕返回完整主線。`;
  button.textContent = '再練一次';
  button.dataset.trainingStage = String(recommendation.stage);
  panel.hidden = false;
  document.documentElement.dataset.trainingRecommendationState = 'practice-complete';
}

function launchRecommendation(recommendation) {
  if (!recommendation) return;
  document.documentElement.dataset.trainingRecommendationLaunched = String(recommendation.stage);
  hideUi();

  if (recommendation.stage === 1) {
    activeTraining = null;
    requestPractice(null);
    document.querySelector('#restart-button')?.click();
    return;
  }

  const route = MODE_FOR_STAGE[recommendation.stage];
  if (!route) return;
  activeTraining = recommendation;
  route.request(true);
  document.querySelector('#restart-button')?.click();
}

function syncFromAnalysis() {
  if (typeof document === 'undefined') return;
  if (!resultVisible()) {
    hideUi();
    return;
  }

  const mode = document.documentElement.dataset.runMode || 'campaign';
  const focusLabel = document.querySelector('[data-analysis-focus]')?.textContent?.trim() || '';
  if (!focusLabel) {
    hideUi();
    return;
  }

  if (mode === 'campaign') {
    activeTraining = null;
    renderCampaignRecommendation(recommendationFromFocusLabel(focusLabel));
    return;
  }

  if (activeTraining && mode === activeTraining.practiceMode) {
    renderTrainingComplete(activeTraining);
    return;
  }

  hideUi();
  document.documentElement.dataset.trainingRecommendationState = 'hidden';
}

function install() {
  installStyles();
  const panel = ensureUi();
  const action = panel?.querySelector('[data-training-action]');
  if (action && action.dataset.trainingBound !== 'true') {
    action.dataset.trainingBound = 'true';
    action.addEventListener('click', () => {
      const stage = Number(action.dataset.trainingStage || 0);
      if (activeTraining && stage === activeTraining.stage && document.documentElement.dataset.trainingRecommendationState === 'practice-complete') {
        hideUi();
        document.querySelector('#restart-button')?.click();
        return;
      }
      const focusLabel = document.querySelector('[data-analysis-focus]')?.textContent?.trim() || '';
      launchRecommendation(recommendationFromFocusLabel(focusLabel));
    });
  }

  const focus = document.querySelector('[data-analysis-focus]');
  if (focus) new MutationObserver(syncFromAnalysis).observe(focus, { childList: true, subtree: true, characterData: true });
  new MutationObserver(syncFromAnalysis).observe(document.documentElement, { attributes: true, attributeFilter: ['data-run-mode'] });

  for (const selector of ['#start-button', '#challenge-button', '#daily-challenge-button', '#practice-ronin-button', '#practice-oni-button', '#practice-shogun-button', '#practice-blood-moon-button', '#ronin-practice-campaign', '#challenge-campaign-button']) {
    const node = document.querySelector(selector);
    node?.addEventListener('click', () => {
      activeTraining = null;
      hideUi();
    }, { capture: true });
  }

  document.documentElement.dataset.trainingRecommendationReady = 'true';
}

if (typeof document !== 'undefined') install();
