const APP_TITLE = 'Blade Reversal｜刃返';
const REPORT_BUTTON_ID = 'result-feedback-button';
const PANEL_ID = 'result-feedback-panel';
const STATUS_ID = 'result-feedback-status';
const NOTE_LIMIT = 800;

function compactText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function compactNote(value) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, NOTE_LIMIT);
}

function cleanUrl(value) {
  try {
    const url = new URL(String(value || ''));
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return '';
  }
}

export function buildBetaFeedbackPayload({
  kind = 'feedback',
  note = '',
  eyebrow = '',
  title = '',
  summary = '',
  score = '',
  challengeProgress = '',
  url = '',
} = {}) {
  const reportKind = kind === 'bug' ? '錯誤回報' : '體驗意見';
  const resultTitle = compactText(title) || '決鬥結果';
  const resultEyebrow = compactText(eyebrow);
  const resultSummary = compactText(summary);
  const resultScore = compactText(score);
  const progress = compactText(challengeProgress);
  const playerNote = compactNote(note);
  const lines = [`刃返 Closed Beta｜${reportKind}`, `結果：${resultTitle}`];

  if (resultEyebrow && !resultEyebrow.includes(resultTitle)) lines.push(`模式：${resultEyebrow}`);
  if (progress) lines.push(`進度：${progress}`);
  if (resultScore) lines.push(`得分：${resultScore}`);
  if (resultSummary) lines.push(`摘要：${resultSummary}`);
  if (playerNote) lines.push(`玩家補充：${playerNote}`);

  return {
    title: `${APP_TITLE}｜${reportKind}`,
    text: lines.join('\n'),
    url: cleanUrl(url),
  };
}

export function collectBetaFeedbackPayload(
  { kind = 'feedback', note = '' } = {},
  documentRef = globalThis.document,
  locationRef = globalThis.location,
) {
  const text = (selector) => compactText(documentRef?.querySelector?.(selector)?.textContent);
  return buildBetaFeedbackPayload({
    kind,
    note,
    eyebrow: text('#result-eyebrow'),
    title: text('#result-title'),
    summary: text('#result-summary'),
    score: text('#result-score'),
    challengeProgress: text('#challenge-result [data-challenge-progress]'),
    url: locationRef?.href || '',
  });
}

function clipboardText(payload) {
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

export async function deliverBetaFeedback(
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
    }
  }

  const text = clipboardText(payload);
  if (typeof navigatorRef?.clipboard?.writeText === 'function') {
    try {
      await navigatorRef.clipboard.writeText(text);
      return 'copied';
    } catch {
      // Fall through to the legacy local copy path.
    }
  }

  return (await legacyCopy(text, documentRef)) ? 'copied' : 'unavailable';
}

function ensureStyles(documentRef) {
  if (!documentRef?.head || documentRef.querySelector('style[data-result-feedback-style]')) return;
  const style = documentRef.createElement('style');
  style.dataset.resultFeedbackStyle = 'true';
  style.textContent = `
    .result-feedback-button{
      position:absolute;z-index:3;top:calc(var(--safe-top) + 4px);left:calc(var(--safe-left) + 4px);
      min-width:58px;min-height:44px;margin:0;padding:0 11px;border:1px solid rgba(239,196,129,.28);
      border-radius:999px;background:rgba(15,13,13,.7);box-shadow:0 8px 24px rgba(0,0,0,.28);
      color:rgba(247,235,216,.86);font-size:11px;font-weight:800;letter-spacing:.08em;cursor:pointer;
      backdrop-filter:blur(8px);-webkit-tap-highlight-color:transparent;
    }
    .result-feedback-button:active{transform:translateY(1px)}
    .result-feedback-panel{
      position:absolute;z-index:7;left:calc(var(--safe-left) + 10px);right:calc(var(--safe-right) + 10px);
      top:calc(var(--safe-top) + 54px);bottom:calc(var(--safe-bottom) + 10px);display:flex;flex-direction:column;
      gap:10px;padding:14px;border:1px solid rgba(239,196,129,.28);border-radius:16px;background:rgba(10,10,12,.97);
      box-shadow:0 18px 50px rgba(0,0,0,.5);overflow:auto;color:#f5ead8;text-align:left;
    }
    .result-feedback-panel[hidden]{display:none!important}
    .result-feedback-panel h3{margin:0;font-size:18px;letter-spacing:.04em}
    .result-feedback-panel p{margin:0;font-size:12px;line-height:1.5;color:rgba(245,234,216,.76)}
    .result-feedback-kinds{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .result-feedback-kind,.result-feedback-close,.result-feedback-send{
      min-height:44px;border:1px solid rgba(239,196,129,.25);border-radius:10px;background:rgba(255,255,255,.05);
      color:#f5ead8;font:inherit;font-weight:800;cursor:pointer;
    }
    .result-feedback-kind[aria-pressed="true"]{border-color:rgba(228,182,107,.75);background:rgba(228,182,107,.14);color:#f1d59f}
    .result-feedback-panel textarea{
      width:100%;min-height:96px;max-height:150px;box-sizing:border-box;resize:vertical;padding:10px 11px;
      border:1px solid rgba(239,196,129,.22);border-radius:10px;background:rgba(255,255,255,.055);color:#fff;
      font:inherit;font-size:14px;line-height:1.45;outline:none;
    }
    .result-feedback-actions{display:grid;grid-template-columns:.8fr 1.2fr;gap:8px;margin-top:auto}
    .result-feedback-send{background:linear-gradient(180deg,rgba(177,119,54,.55),rgba(109,69,31,.7));border-color:rgba(239,196,129,.55)}
    .result-feedback-status{min-height:18px;font-size:11px;color:#f1d59f}
  `;
  documentRef.head.append(style);
}

function ensureUi(documentRef) {
  const content = documentRef?.querySelector?.('#result-screen .modal__content--result');
  if (!content) return null;

  let button = documentRef.querySelector(`#${REPORT_BUTTON_ID}`);
  if (!button) {
    button = documentRef.createElement('button');
    button.id = REPORT_BUTTON_ID;
    button.type = 'button';
    button.className = 'result-feedback-button';
    button.textContent = '回報';
    button.setAttribute('aria-label', '提供體驗意見或錯誤回報');
    button.setAttribute('aria-expanded', 'false');
    content.append(button);
  }

  let panel = documentRef.querySelector(`#${PANEL_ID}`);
  if (!panel) {
    panel = documentRef.createElement('section');
    panel.id = PANEL_ID;
    panel.className = 'result-feedback-panel';
    panel.hidden = true;
    panel.dataset.feedbackKind = 'feedback';
    panel.setAttribute('aria-label', 'Closed Beta 回報');
    panel.innerHTML = `
      <h3>Closed Beta 回報</h3>
      <p data-feedback-privacy>遊戲不會自動上傳資料。按「分享回報」只會開啟系統分享；不支援時會複製文字，由你自行傳送。</p>
      <div class="result-feedback-kinds" role="group" aria-label="回報類型">
        <button class="result-feedback-kind" type="button" data-feedback-kind="feedback" aria-pressed="true">體驗意見</button>
        <button class="result-feedback-kind" type="button" data-feedback-kind="bug" aria-pressed="false">錯誤回報</button>
      </div>
      <textarea maxlength="${NOTE_LIMIT}" data-feedback-note placeholder="發生咩事？邊一段最難用／最唔自然？"></textarea>
      <div id="${STATUS_ID}" class="result-feedback-status" role="status" aria-live="polite"></div>
      <div class="result-feedback-actions">
        <button class="result-feedback-close" type="button" data-feedback-close>關閉</button>
        <button class="result-feedback-send" type="button" data-feedback-send>分享回報</button>
      </div>
    `;
    content.append(panel);
  }

  return {
    button,
    panel,
    kinds: [...panel.querySelectorAll('[data-feedback-kind]')],
    note: panel.querySelector('[data-feedback-note]'),
    send: panel.querySelector('[data-feedback-send]'),
    close: panel.querySelector('[data-feedback-close]'),
    status: panel.querySelector(`#${STATUS_ID}`),
  };
}

function setKind(ui, kind) {
  const nextKind = kind === 'bug' ? 'bug' : 'feedback';
  ui.panel.dataset.feedbackKind = nextKind;
  for (const button of ui.kinds) {
    button.setAttribute('aria-pressed', button.dataset.feedbackKind === nextKind ? 'true' : 'false');
  }
}

function setOpen(ui, open) {
  ui.panel.hidden = !open;
  ui.button.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) ui.note?.focus?.();
}

function install() {
  if (typeof document === 'undefined') return;
  ensureStyles(document);
  const ui = ensureUi(document);
  if (!ui) return;

  ui.button.addEventListener('click', () => setOpen(ui, ui.panel.hidden));
  ui.close?.addEventListener('click', () => setOpen(ui, false));
  for (const kindButton of ui.kinds) {
    kindButton.addEventListener('click', () => setKind(ui, kindButton.dataset.feedbackKind));
  }

  ui.send?.addEventListener('click', async () => {
    if (ui.send.disabled) return;
    ui.send.disabled = true;
    ui.status.textContent = '';
    const payload = collectBetaFeedbackPayload({
      kind: ui.panel.dataset.feedbackKind,
      note: ui.note?.value || '',
    }, document, location);
    const result = await deliverBetaFeedback(payload);
    const labels = {
      shared: '已開啟系統分享',
      copied: '已複製回報文字，可貼到你選擇的訊息或電郵',
      cancelled: '已取消分享',
      unavailable: '此瀏覽器未能分享或複製',
    };
    ui.status.textContent = labels[result] || labels.unavailable;
    document.documentElement.dataset.resultFeedbackLast = result;
    ui.send.disabled = false;
  });

  document.documentElement.dataset.resultFeedbackReady = 'true';
}

install();
