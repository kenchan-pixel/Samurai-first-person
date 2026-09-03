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
    .beta-readiness-list{display:grid;gap:8px;margin:0;padding:0;list-style:none}
    .beta-readiness-list li{padding:9px 10px;border:1px solid rgba(126,174,255,.16);border-radius:11px;background:rgba(126,174,255,.055)}
    .beta-readiness-list strong,.beta-readiness-list span{display:block}
    .beta-readiness-list strong{font-size:11px;color:#e5edfb}
    .beta-readiness-list span{margin-top:3px;font-size:10px;line-height:1.4;color:rgba(229,237,250,.64)}
    .beta-readiness-privacy{padding:9px 10px;border:1px solid rgba(129,193,154,.18);border-radius:11px;background:rgba(57,106,75,.08)}
    .beta-readiness-close{
      min-height:44px;margin-top:auto;border:1px solid rgba(255,255,255,.16);border-radius:11px;background:rgba(255,255,255,.055);
      color:#f4f6fa;font:inherit;font-size:12px;font-weight:850;cursor:pointer;
    }
    @media(max-width:360px) and (max-height:620px){
      .beta-readiness-panel{gap:8px;padding:12px}.beta-readiness-panel h3{font-size:18px}
      .beta-readiness-list{gap:6px}.beta-readiness-list li{padding:7px 8px}.beta-readiness-list span{font-size:9.5px}
      .beta-readiness-privacy{padding:7px 8px}.beta-readiness-panel p{font-size:10px}
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
    button.textContent = '封測資訊';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', '查看 Closed Beta 封測資訊');
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
      <ol class="beta-readiness-list" aria-label="建議封測流程">
        ${BETA_READINESS_ITEMS.map((item, index) => `<li data-beta-readiness-item="${item.id}"><strong>${index + 1}. ${item.title}</strong><span>${item.copy}</span></li>`).join('')}
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
  documentRef.documentElement.dataset.betaReadinessReady = 'true';
  return ui;
}

if (typeof document !== 'undefined') installBetaReadiness();
