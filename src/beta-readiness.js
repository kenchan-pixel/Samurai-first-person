export const BETA_READINESS_ITEMS = Object.freeze([
  Object.freeze({
    id: 'duel',
    title: '先打一局',
    copy: '先玩主線或一場指定修行，確認四向格擋、STEP、反擊同結果頁都正常。',
  }),
  Object.freeze({
    id: 'repeat-practice',
    title: '再練同一對手',
    copy: '同一對手連續修行兩次，結果頁會用「修行進度」比較防守、受擊同反擊。',
  }),
  Object.freeze({
    id: 'feedback',
    title: '有問題就回報',
    copy: '結果頁按「回報」，寫低體驗或錯誤，再由系統分享或複製文字自行傳送。',
  }),
]);

export const BETA_READINESS_PRIVACY =
  '呢個 Preview 仍係 Closed Beta 準備版。遊戲唔會自動上傳回報，亦冇登入、雲端排行榜或背景遙測。';

const validItemIds = new Set(BETA_READINESS_ITEMS.map((item) => item.id));
const sessionCompleted = new Set();
let observer = null;

export function betaReadinessProgress(completed = []) {
  const completedIds = BETA_READINESS_ITEMS
    .map((item) => item.id)
    .filter((id) => completed?.has?.(id) || completed?.includes?.(id));
  return Object.freeze({
    completedIds: Object.freeze(completedIds),
    completed: completedIds.length,
    total: BETA_READINESS_ITEMS.length,
    done: completedIds.length === BETA_READINESS_ITEMS.length,
  });
}

function renderSessionProgress(documentRef = globalThis.document) {
  if (!documentRef) return betaReadinessProgress(sessionCompleted);
  const progress = betaReadinessProgress(sessionCompleted);
  const button = documentRef.querySelector?.('#beta-readiness-button');
  const progressText = documentRef.querySelector?.('#beta-readiness-panel [data-beta-readiness-progress]');
  const progressHint = documentRef.querySelector?.('[data-beta-readiness-progress-hint]');

  if (button) {
    button.textContent = progress.done ? '封測完成' : `封測 ${progress.completed}/${progress.total}`;
    button.setAttribute('aria-label', progress.done
      ? 'Closed Beta 本次封測流程已完成，查看封測資訊'
      : `查看 Closed Beta 封測資訊，本次已完成 ${progress.completed} / ${progress.total}`);
  }
  if (progressText) progressText.textContent = progress.done
    ? `本次封測 ${progress.completed}/${progress.total} · 完成`
    : `本次封測 ${progress.completed}/${progress.total}`;
  if (progressHint) progressHint.textContent = progress.done
    ? '今次基本封測流程已走完；如仲有手感或錯誤問題，可以繼續用結果頁「回報」。'
    : '只記今次開頁進度 · 重新整理會重設 · 不上傳';

  for (const item of BETA_READINESS_ITEMS) {
    const row = documentRef.querySelector?.(`[data-beta-readiness-item="${item.id}"]`);
    if (!row) continue;
    const complete = sessionCompleted.has(item.id);
    row.dataset.betaReadinessComplete = complete ? 'true' : 'false';
    row.setAttribute('aria-label', `${complete ? '已完成' : '未完成'}：${item.title}`);
  }

  if (documentRef.documentElement) {
    documentRef.documentElement.dataset.betaReadinessProgress = `${progress.completed}/${progress.total}`;
    documentRef.documentElement.dataset.betaReadinessComplete = String(progress.done);
  }
  return progress;
}

export function markBetaReadinessItem(id, documentRef = globalThis.document) {
  if (!validItemIds.has(id)) return betaReadinessProgress(sessionCompleted);
  sessionCompleted.add(id);
  return renderSessionProgress(documentRef);
}

function observeSessionProgress(documentRef) {
  if (observer || typeof MutationObserver !== 'function') return;
  const root = documentRef?.documentElement;
  const result = documentRef?.querySelector?.('#result-screen');
  if (!root) return;

  // Session receipts are transition-based. A result that is already visible when
  // this tracker installs belongs to pre-existing DOM state and must not backfill 1/3.
  let resultVisible = Boolean(result?.classList?.contains('modal--visible'));
  observer = new MutationObserver((records = []) => {
    for (const record of records) {
      if (record.target === result && record.attributeName === 'class') {
        const nextVisible = Boolean(result?.classList?.contains('modal--visible'));
        if (!resultVisible && nextVisible) markBetaReadinessItem('duel', documentRef);
        resultVisible = nextVisible;
        continue;
      }
      if (record.target !== root) continue;
      if (record.attributeName === 'data-practice-progress-state' && root.dataset.practiceProgressState === 'comparison') {
        markBetaReadinessItem('repeat-practice', documentRef);
      }
      if (
        record.attributeName === 'data-result-feedback-last' &&
        (root.dataset.resultFeedbackLast === 'shared' || root.dataset.resultFeedbackLast === 'copied')
      ) {
        markBetaReadinessItem('feedback', documentRef);
      }
    }
  });
  observer.observe(root, {
    attributes: true,
    attributeFilter: ['data-practice-progress-state', 'data-result-feedback-last'],
  });
  if (result) observer.observe(result, { attributes: true, attributeFilter: ['class'] });
}

function ensureStyles(documentRef) {
  if (!documentRef?.head || documentRef.querySelector('style[data-beta-readiness-style]')) return;
  const style = documentRef.createElement('style');
  style.dataset.betaReadinessStyle = 'true';
  style.textContent = `
    .beta-readiness-button{
      position:absolute;z-index:4;top:calc(var(--safe-top) + 4px);left:calc(var(--safe-left) + 4px);
      min-width:82px;min-height:44px;padding:0 12px;border:1px solid rgba(126,174,255,.3);border-radius:999px;
      background:rgba(14,18,26,.78);box-shadow:0 8px 24px rgba(0,0,0,.28);color:rgba(222,232,251,.9);
      font-size:10px;font-weight:850;letter-spacing:.08em;cursor:pointer;backdrop-filter:blur(8px);-webkit-tap-highlight-color:transparent;
    }
    .beta-readiness-button:active{transform:translateY(1px)}
    .beta-readiness-panel{
      position:absolute;z-index:8;left:calc(var(--safe-left) + 10px);right:calc(var(--safe-right) + 10px);
      top:calc(var(--safe-top) + 54px);bottom:calc(var(--safe-bottom) + 10px);display:flex;flex-direction:column;
      gap:10px;padding:14px;border:1px solid rgba(126,174,255,.26);border-radius:16px;background:rgba(9,12,18,.975);
      box-shadow:0 18px 50px rgba(0,0,0,.52);overflow:auto;color:#eef4ff;text-align:left;
    }
    .beta-readiness-panel[hidden]{display:none!important}
    .beta-readiness-panel__eyebrow{margin:0;color:rgba(170,200,248,.66);font-size:9px;font-weight:850;letter-spacing:.16em}
    .beta-readiness-panel h3{margin:0;font-size:20px;letter-spacing:.03em}
    .beta-readiness-panel p{margin:0;font-size:11px;line-height:1.5;color:rgba(231,237,247,.72)}
    .beta-readiness-session{padding:9px 10px;border:1px solid rgba(126,174,255,.2);border-radius:11px;background:rgba(126,174,255,.07)}
    .beta-readiness-session strong,.beta-readiness-session span{display:block}
    .beta-readiness-session strong{font-size:11px;color:#eaf2ff}.beta-readiness-session span{margin-top:3px;font-size:9px;line-height:1.35;color:rgba(222,232,248,.6)}
    .beta-readiness-list{display:grid;gap:8px;margin:0;padding:0;list-style:none}
    .beta-readiness-list li{padding:9px 10px;border:1px solid rgba(126,174,255,.16);border-radius:11px;background:rgba(126,174,255,.055)}
    .beta-readiness-list li[data-beta-readiness-complete="true"]{border-color:rgba(129,193,154,.3);background:rgba(57,106,75,.1)}
    .beta-readiness-list strong,.beta-readiness-list span{display:block}
    .beta-readiness-list strong{font-size:11px;color:#e5edfb}.beta-readiness-list strong::before{content:'○';display:inline-block;width:18px;color:rgba(170,200,248,.75)}
    .beta-readiness-list li[data-beta-readiness-complete="true"] strong::before{content:'✓';color:#9fd8b2}
    .beta-readiness-list span{margin-top:3px;font-size:10px;line-height:1.4;color:rgba(229,237,250,.64)}
    .beta-readiness-privacy{padding:9px 10px;border:1px solid rgba(129,193,154,.18);border-radius:11px;background:rgba(57,106,75,.08)}
    .beta-readiness-close{
      min-height:44px;margin-top:auto;border:1px solid rgba(255,255,255,.16);border-radius:11px;background:rgba(255,255,255,.055);
      color:#f4f6fa;font:inherit;font-size:12px;font-weight:850;cursor:pointer;
    }
    @media(max-width:360px) and (max-height:620px){
      .beta-readiness-panel{gap:7px;padding:11px}.beta-readiness-panel h3{font-size:18px}
      .beta-readiness-session{padding:7px 8px}.beta-readiness-list{gap:5px}.beta-readiness-list li{padding:6px 8px}.beta-readiness-list span{font-size:9px}
      .beta-readiness-privacy{padding:6px 8px}.beta-readiness-panel p{font-size:9.5px}
    }
  `;
  documentRef.head.append(style);
}

function ensureUi(documentRef) {
  const screen = documentRef?.querySelector?.('#start-screen');
  if (!screen) return null;

  let button = documentRef.querySelector('#beta-readiness-button');
  if (!button) {
    button = documentRef.createElement('button');
    button.id = 'beta-readiness-button';
    button.type = 'button';
    button.className = 'beta-readiness-button';
    button.textContent = '封測 0/3';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', '查看 Closed Beta 封測資訊，本次已完成 0 / 3');
    screen.append(button);
  }

  let panel = documentRef.querySelector('#beta-readiness-panel');
  if (!panel) {
    panel = documentRef.createElement('section');
    panel.id = 'beta-readiness-panel';
    panel.className = 'beta-readiness-panel';
    panel.hidden = true;
    panel.setAttribute('aria-label', 'Closed Beta v0.5 測試指南');
    panel.innerHTML = `
      <p class="beta-readiness-panel__eyebrow">RELEASE PREP</p>
      <h3>Closed Beta v0.5 測試指南</h3>
      <p>今版先集中驗證實戰手感、重複修行同回報流程；唔需要建立帳戶。</p>
      <div class="beta-readiness-session" aria-live="polite">
        <strong data-beta-readiness-progress>本次封測 0/${BETA_READINESS_ITEMS.length}</strong>
        <span data-beta-readiness-progress-hint>只記今次開頁進度 · 重新整理會重設 · 不上傳</span>
      </div>
      <ol class="beta-readiness-list" aria-label="建議封測流程">
        ${BETA_READINESS_ITEMS.map((item, index) => `<li data-beta-readiness-item="${item.id}" data-beta-readiness-complete="false"><strong>${index + 1}. ${item.title}</strong><span>${item.copy}</span></li>`).join('')}
      </ol>
      <p class="beta-readiness-privacy" data-beta-readiness-privacy>${BETA_READINESS_PRIVACY}</p>
      <button class="beta-readiness-close" type="button" data-beta-readiness-close>知道</button>
    `;
    screen.append(panel);
  }

  return { button, panel, close: panel.querySelector('[data-beta-readiness-close]') };
}

function setOpen(ui, open) {
  ui.panel.hidden = !open;
  ui.button.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.documentElement.dataset.betaReadinessOpen = open ? 'true' : 'false';
}

export function installBetaReadiness(documentRef = globalThis.document) {
  if (!documentRef) return null;
  ensureStyles(documentRef);
  const ui = ensureUi(documentRef);
  if (!ui) return null;
  if (ui.button.dataset.betaReadinessBound !== 'true') {
    ui.button.dataset.betaReadinessBound = 'true';
    ui.button.addEventListener('click', () => setOpen(ui, ui.panel.hidden));
    ui.close?.addEventListener('click', () => setOpen(ui, false));
  }
  renderSessionProgress(documentRef);
  observeSessionProgress(documentRef);
  documentRef.documentElement.dataset.betaReadinessReady = 'true';
  return ui;
}

if (typeof document !== 'undefined') installBetaReadiness();
