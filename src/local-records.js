export const LOCAL_RECORD_STORAGE_KEYS = Object.freeze({
  campaign: 'blade-reversal-mastery-v1',
  challenge: 'blade-reversal-challenge-v1',
});

const CHALLENGE_STAGE_COUNT = 8;

function resolveStorage(storage) {
  if (storage !== undefined) return storage;
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function readJson(storage, key) {
  try {
    return JSON.parse(storage?.getItem?.(key) || 'null');
  } catch {
    return null;
  }
}

function normaliseCampaign(value) {
  if (!value || !Number.isFinite(value.masteryPoints) || !Number.isFinite(value.score)) return null;
  const grade = typeof value.grade === 'string' && /^[SABCD]$/.test(value.grade) ? value.grade : 'D';
  return Object.freeze({
    grade,
    masteryPoints: Math.max(0, Math.min(100, Math.round(value.masteryPoints))),
    score: Math.max(0, Math.round(value.score)),
  });
}

function normaliseChallenge(value) {
  if (!value || !Number.isFinite(value.wavesCleared) || !Number.isFinite(value.score)) return null;
  return Object.freeze({
    won: Boolean(value.won),
    wavesCleared: Math.max(0, Math.min(CHALLENGE_STAGE_COUNT, Math.floor(value.wavesCleared))),
    score: Math.max(0, Math.round(value.score)),
  });
}

export function readLocalPersonalRecords(storage) {
  const resolvedStorage = resolveStorage(storage);
  return Object.freeze({
    campaign: normaliseCampaign(readJson(resolvedStorage, LOCAL_RECORD_STORAGE_KEYS.campaign)),
    challenge: normaliseChallenge(readJson(resolvedStorage, LOCAL_RECORD_STORAGE_KEYS.challenge)),
  });
}

export function localRecordNextStep(records) {
  const campaign = records?.campaign ?? null;
  const challenge = records?.challenge ?? null;
  if (!campaign) return '下一步：先完成一次完整主線，建立自己嘅基準。';
  if (campaign.masteryPoints < 66) return '下一步：先用指定修行磨穩防守，再刷新主線紀錄。';
  if (!challenge) return '下一步：試一次連戰，睇下壓力下可以守到第幾關。';
  if (challenge.wavesCleared < CHALLENGE_STAGE_COUNT) {
    const target = Math.min(CHALLENGE_STAGE_COUNT, challenge.wavesCleared + 1);
    return `下一步：重練卡住你嘅對手，再挑戰連戰 ${target}/${CHALLENGE_STAGE_COUNT}。`;
  }
  return '下一步：用修行進度改善弱項，再刷新主線或連戰分數。';
}

function formatScore(value) {
  return Math.max(0, Math.round(Number(value) || 0)).toString().padStart(6, '0');
}

export function formatLocalPersonalRecords(records) {
  const campaign = records?.campaign;
  const challenge = records?.challenge;
  return Object.freeze({
    campaign: campaign
      ? `${campaign.grade}級 · MASTERY ${campaign.masteryPoints} · ${formatScore(campaign.score)}`
      : '未有主線紀錄',
    challenge: challenge
      ? `連戰 ${challenge.wavesCleared}/${CHALLENGE_STAGE_COUNT}${challenge.won ? ' · 制霸' : ''} · ${formatScore(challenge.score)}`
      : '未有連戰紀錄',
    next: localRecordNextStep(records),
  });
}

function ensureStyles(documentRef) {
  if (!documentRef?.head || documentRef.querySelector('style[data-local-records-style]')) return;
  const style = documentRef.createElement('style');
  style.dataset.localRecordsStyle = 'true';
  style.textContent = `
    .local-records{padding:9px 10px;border:1px solid rgba(231,191,112,.2);border-radius:11px;background:rgba(122,84,31,.08)}
    .local-records__head{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
    .local-records__head strong{font-size:11px;color:#f3ddb0}.local-records__head span{font-size:8.5px;color:rgba(232,220,194,.52)}
    .local-records__grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:7px}
    .local-records__card{min-width:0;padding:7px;border:1px solid rgba(231,191,112,.12);border-radius:9px;background:rgba(255,255,255,.025)}
    .local-records__card b,.local-records__card span{display:block}.local-records__card b{font-size:9px;color:rgba(242,224,188,.66)}
    .local-records__card span{margin-top:3px;font-size:9.5px;line-height:1.35;color:#f5ead5;overflow-wrap:anywhere}
    .local-records__next{margin-top:7px!important;font-size:9.5px!important;line-height:1.35!important;color:rgba(239,225,197,.72)!important}
    @media(max-width:360px) and (max-height:620px){.local-records{padding:7px 8px}.local-records__grid{gap:5px;margin-top:5px}.local-records__card{padding:6px}.local-records__card span{font-size:9px}.local-records__next{margin-top:5px!important;font-size:9px!important}}
  `;
  documentRef.head.append(style);
}

function ensureUi(documentRef) {
  const panel = documentRef?.querySelector?.('#beta-readiness-panel');
  if (!panel) return null;
  let section = panel.querySelector('[data-local-records]');
  if (!section) {
    section = documentRef.createElement('section');
    section.className = 'local-records';
    section.dataset.localRecords = 'true';
    section.setAttribute('aria-label', '本機個人戰績');
    section.innerHTML = `
      <div class="local-records__head"><strong>本機戰績</strong><span>只讀 · 不上傳</span></div>
      <div class="local-records__grid">
        <div class="local-records__card"><b>主線最佳</b><span data-local-record-campaign>未有主線紀錄</span></div>
        <div class="local-records__card"><b>連戰最佳</b><span data-local-record-challenge>未有連戰紀錄</span></div>
      </div>
      <p class="local-records__next" data-local-record-next>下一步：先完成一次完整主線，建立自己嘅基準。</p>
    `;
    const privacy = panel.querySelector('[data-beta-readiness-privacy]');
    if (privacy) privacy.insertAdjacentElement('beforebegin', section);
    else panel.append(section);
  }
  return section;
}

function render(section, storage) {
  const formatted = formatLocalPersonalRecords(readLocalPersonalRecords(storage));
  const campaign = section.querySelector('[data-local-record-campaign]');
  const challenge = section.querySelector('[data-local-record-challenge]');
  const next = section.querySelector('[data-local-record-next]');
  if (campaign) campaign.textContent = formatted.campaign;
  if (challenge) challenge.textContent = formatted.challenge;
  if (next) next.textContent = formatted.next;
  return formatted;
}

export function installLocalPersonalRecords(documentRef = globalThis.document, storage) {
  if (!documentRef) return null;
  ensureStyles(documentRef);
  const section = ensureUi(documentRef);
  const button = documentRef.querySelector('#beta-readiness-button');
  if (!section || !button) return null;
  const refresh = () => render(section, storage);
  if (button.dataset.localRecordsBound !== 'true') {
    button.dataset.localRecordsBound = 'true';
    button.addEventListener('click', () => queueMicrotask(refresh));
  }
  refresh();
  documentRef.documentElement.dataset.localRecordsReady = 'true';
  return { section, refresh };
}

if (typeof document !== 'undefined') installLocalPersonalRecords();
