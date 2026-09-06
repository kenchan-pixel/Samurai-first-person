const APP_TITLE = 'Blade Reversal｜刃返';
const SHARE_BUTTON_ID = 'result-share-button';
const SHARE_STATUS_ID = 'result-share-status';
let feedbackTimer = null;

function compactText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function cleanShareUrl(value) {
  try {
    const url = new URL(String(value || ''));
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return '';
  }
}

export function buildResultSharePayload({
  eyebrow = '',
  title = '',
  summary = '',
  score = '',
  challengeProgress = '',
  url = '',
} = {}) {
  const resultTitle = compactText(title) || '決鬥結果';
  const resultEyebrow = compactText(eyebrow);
  const resultSummary = compactText(summary);
  const resultScore = compactText(score);
  const progress = compactText(challengeProgress);
  const lines = [`刃返｜${resultTitle}`];

  if (resultEyebrow && !resultEyebrow.includes(resultTitle)) lines.push(resultEyebrow);
  if (progress) lines.push(progress);
  if (resultScore) lines.push(`得分 ${resultScore}`);
  if (resultSummary) lines.push(resultSummary);
  lines.push('你敢接刀嗎？');

  return {
    title: APP_TITLE,
    text: lines.join('\n'),
    url: cleanShareUrl(url),
  };
}

export function collectResultSharePayload(
  documentRef = globalThis.document,
  locationRef = globalThis.location,
) {
  const text = (selector) => compactText(documentRef?.querySelector?.(selector)?.textContent);
  return buildResultSharePayload({
    eyebrow: text('#result-eyebrow'),
    title: text('#result-title'),
    summary: text('#result-summary'),
    score: text('#result-score'),
    challengeProgress: text('#challenge-result [data-challenge-progress]'),
    url: locationRef?.href || '',
  });
}

function shareClipboardText(payload) {
  return [payload.text, payload.url].filter(Boolean).join('\n');
}

async function legacyCopy(text, documentRef) {
  if (!documentRef?.createElement || typeof documentRef.execCommand !== 'function') return false;
  const textarea = documentRef.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  documentRef.body?.append(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = Boolean(documentRef.execCommand('copy'));
  } finally {
    textarea.remove();
  }
  return copied;
}

export async function deliverResultShare(
  payload,
  {
    navigatorRef = globalThis.navigator,
    documentRef = globalThis.document,
  } = {},
) {
  if (typeof navigatorRef?.share === 'function') {
    try {
      await navigatorRef.share(payload);
      return 'shared';
    } catch (error) {
      if (error?.name === 'AbortError') return 'cancelled';
      // Some browsers expose navigator.share but reject unsupported payloads.
      // Fall through to the local clipboard path instead of turning that into a dead end.
    }
  }

  const copyText = shareClipboardText(payload);
  if (typeof navigatorRef?.clipboard?.writeText === 'function') {
    try {
      await navigatorRef.clipboard.writeText(copyText);
      return 'copied';
    } catch {
      // Fall through to the legacy selection path when clipboard permission is unavailable.
    }
  }

  return (await legacyCopy(copyText, documentRef)) ? 'copied' : 'unavailable';
}

function ensureStyles(documentRef) {
  if (!documentRef?.head || documentRef.querySelector('style[data-result-share]')) return;
  const style = documentRef.createElement('style');
  style.dataset.resultShare = 'true';
  style.textContent = `
    .result-share-button{
      position:absolute;z-index:3;top:calc(var(--safe-top) + 4px);right:calc(var(--safe-right) + 4px);
      min-width:58px;min-height:44px;margin:0;padding:0 11px;border:1px solid rgba(239,196,129,.28);
      border-radius:999px;background:rgba(15,13,13,.7);box-shadow:0 8px 24px rgba(0,0,0,.28);
      color:rgba(247,235,216,.86);font-size:11px;font-weight:800;letter-spacing:.08em;cursor:pointer;
      backdrop-filter:blur(8px);-webkit-tap-highlight-color:transparent;
    }
    .result-share-button:active{transform:translateY(1px)}
    .result-share-button[data-share-state="shared"],.result-share-button[data-share-state="copied"]{border-color:rgba(228,182,107,.56);color:#f1d59f}
    .result-share-button[data-share-state="unavailable"]{border-color:rgba(219,91,72,.46);color:rgba(255,210,200,.9)}
    .result-share-status{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
  `;
  documentRef.head.append(style);
}

function ensureUi(documentRef) {
  const content = documentRef?.querySelector?.('#result-screen .modal__content--result');
  if (!content) return null;

  let button = documentRef.querySelector(`#${SHARE_BUTTON_ID}`);
  if (!button) {
    button = documentRef.createElement('button');
    button.id = SHARE_BUTTON_ID;
    button.type = 'button';
    button.className = 'result-share-button';
    button.textContent = '分享';
    button.setAttribute('aria-label', '分享今次戰績');
    content.append(button);
  }

  let status = documentRef.querySelector(`#${SHARE_STATUS_ID}`);
  if (!status) {
    status = documentRef.createElement('span');
    status.id = SHARE_STATUS_ID;
    status.className = 'result-share-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    content.append(status);
  }

  return { button, status };
}

function renderFeedback(ui, result) {
  if (!ui) return;
  const labels = {
    shared: ['已分享', '戰績已分享'],
    copied: ['已複製', '戰績已複製，可貼到訊息分享'],
    cancelled: ['分享', '已取消分享'],
    unavailable: ['未能分享', '此瀏覽器未能分享或複製戰績'],
  };
  const [label, announcement] = labels[result] || labels.unavailable;
  ui.button.dataset.shareState = result;
  ui.button.textContent = label;
  ui.status.textContent = announcement;
  document.documentElement.dataset.resultShareLast = result;

  if (feedbackTimer) clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => {
    ui.button.textContent = '分享';
    ui.button.dataset.shareState = 'ready';
  }, 1600);
}

function install() {
  if (typeof document === 'undefined') return;
  ensureStyles(document);
  const ui = ensureUi(document);
  if (!ui) return;

  ui.button.dataset.shareState = 'ready';
  ui.button.addEventListener('click', async () => {
    if (ui.button.disabled) return;
    ui.button.disabled = true;
    const payload = collectResultSharePayload(document, location);
    const result = await deliverResultShare(payload);
    renderFeedback(ui, result);
    ui.button.disabled = false;
  });

  document.documentElement.dataset.resultShareReady = 'true';
}

install();
