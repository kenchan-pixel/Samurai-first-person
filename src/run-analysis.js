import { CombatEngine } from './game-core.js';

const installed = Symbol.for('blade-reversal.run-analysis-v1');
const sessions = new WeakMap();

const ENEMY_LABELS = Object.freeze({
  'ashigaru-scout': '足輕',
  'wandering-ronin': '浪人',
  'oni-guard': '鬼武者',
  'crimson-shogun': '赤將軍',
});

const DIRECTION_META = Object.freeze([
  Object.freeze({ direction: 'top', symbol: '↑', label: '上方', shortLabel: '上' }),
  Object.freeze({ direction: 'right', symbol: '→', label: '右方', shortLabel: '右' }),
  Object.freeze({ direction: 'bottom', symbol: '↓', label: '下方', shortLabel: '下' }),
  Object.freeze({ direction: 'left', symbol: '←', label: '左方', shortLabel: '左' }),
]);

function createDirectionReads() {
  return Object.fromEntries(DIRECTION_META.map(({ direction }) => [
    direction,
    { faced: 0, defended: 0, parries: 0, evades: 0, hits: 0 },
  ]));
}

function directionRead(stage, direction) {
  return stage?.directionReads?.[direction] ?? null;
}

function recordIncomingDirection(stage, direction) {
  const read = directionRead(stage, direction);
  if (read) read.faced += 1;
}

function recordDefendedDirection(stage, direction, type) {
  const read = directionRead(stage, direction);
  if (!read) return;
  read.defended += 1;
  if (type === 'parry') read.parries += 1;
  if (type === 'evade') read.evades += 1;
}

function recordHitDirection(stage, direction) {
  const read = directionRead(stage, direction);
  if (read) read.hits += 1;
}

function createStageRecord(detail = {}) {
  return {
    stage: Math.max(1, Number(detail.stage) || 1),
    enemyId: detail.enemyId || 'unknown',
    enemyName: detail.enemyName || 'Unknown',
    parryAttempts: 0,
    parries: 0,
    perfectParries: 0,
    guardBreaks: 0,
    counterOpenings: 0,
    counters: 0,
    counterDamage: 0,
    missedCounters: 0,
    attackMisses: 0,
    stepAttempts: 0,
    stepSuccesses: 0,
    perfectSteps: 0,
    hitsTaken: 0,
    damageTaken: 0,
    damageDealt: 0,
    directionReads: createDirectionReads(),
    cleared: false,
  };
}

export function createRunAnalysisSession() {
  return {
    currentStage: null,
    pendingCounterStage: null,
    stages: [],
  };
}

function stageFor(session, stageNumber = session?.currentStage) {
  if (!session || !Number.isFinite(stageNumber)) return null;
  return session.stages.find((stage) => stage.stage === stageNumber) || null;
}

function activeStage(session) {
  return stageFor(session);
}

function startStage(session, detail) {
  const stageNumber = Math.max(1, Number(detail?.stage) || session.stages.length + 1);
  let stage = stageFor(session, stageNumber);
  if (!stage) {
    stage = createStageRecord({ ...detail, stage: stageNumber });
    session.stages.push(stage);
  }
  session.currentStage = stageNumber;
  session.pendingCounterStage = null;
  return stage;
}

function openCounterWindow(session, stage) {
  if (!session || !stage) return;
  stage.counterOpenings += 1;
  session.pendingCounterStage = stage.stage;
}

function closeCounterWindow(session, missed = false) {
  if (!session || !Number.isFinite(session.pendingCounterStage)) return;
  const stage = stageFor(session, session.pendingCounterStage);
  if (missed && stage) stage.missedCounters += 1;
  session.pendingCounterStage = null;
}

function discardCounterWindow(session) {
  if (!session || !Number.isFinite(session.pendingCounterStage)) return;
  const stage = stageFor(session, session.pendingCounterStage);
  if (stage && stage.counterOpenings > 0) stage.counterOpenings -= 1;
  session.pendingCounterStage = null;
}

export function observeRunAnalysisEvent(session, event) {
  if (!session || !event?.type) return session;
  const detail = event.detail ?? {};

  if (event.type === 'stage-start') {
    startStage(session, detail);
    return session;
  }

  const stage = activeStage(session);
  if (!stage) return session;

  if (event.type === 'telegraph') {
    closeCounterWindow(session, true);
  } else if (event.type === 'strike') {
    recordIncomingDirection(stage, detail.direction);
  } else if (event.type === 'parry-miss') {
    stage.parryAttempts += 1;
  } else if (event.type === 'parry' || event.type === 'perfect-parry') {
    stage.parryAttempts += 1;
    stage.parries += 1;
    recordDefendedDirection(stage, detail.direction, 'parry');
    if (event.type === 'perfect-parry') stage.perfectParries += 1;
    openCounterWindow(session, stage);
  } else if (event.type === 'enemy-guard-break') {
    stage.guardBreaks += 1;
  } else if (event.type === 'backstep-evade') {
    stage.stepAttempts += 1;
    stage.stepSuccesses += 1;
    recordDefendedDirection(stage, detail.direction, 'evade');
    openCounterWindow(session, stage);
  } else if (event.type === 'footwork-miss') {
    stage.stepAttempts += 1;
  } else if (event.type === 'perfect-step-riposte') {
    stage.perfectSteps += 1;
    stage.damageDealt += Math.max(0, Number(detail.damage) || 0);
  } else if (event.type === 'perfect-riposte') {
    stage.damageDealt += Math.max(0, Number(detail.damage) || 0);
  } else if (event.type === 'counter') {
    const damage = Math.max(0, Number(detail.damage) || 0);
    stage.counters += 1;
    stage.counterDamage += damage;
    stage.damageDealt += damage;
    closeCounterWindow(session, false);
  } else if (event.type === 'attack-miss') {
    stage.attackMisses += 1;
  } else if (event.type === 'player-hit') {
    stage.hitsTaken += 1;
    stage.damageTaken += Math.max(0, Number(detail.damage) || 0);
    recordHitDirection(stage, detail.direction);
  } else if (event.type === 'boss-phase') {
    discardCounterWindow(session);
  } else if (event.type === 'enemy-defeated') {
    stage.cleared = true;
    discardCounterWindow(session);
  }

  return session;
}

function finishDirectionReads(directionReads = {}) {
  return Object.freeze(Object.fromEntries(DIRECTION_META.map(({ direction }) => {
    const read = directionReads?.[direction] ?? {};
    return [direction, Object.freeze({
      faced: Math.max(0, Number(read.faced) || 0),
      defended: Math.max(0, Number(read.defended) || 0),
      parries: Math.max(0, Number(read.parries) || 0),
      evades: Math.max(0, Number(read.evades) || 0),
      hits: Math.max(0, Number(read.hits) || 0),
    })];
  })));
}

function finishStage(stage) {
  const accuracy = stage.parryAttempts > 0 ? stage.parries / stage.parryAttempts : 0;
  const stepRate = stage.stepAttempts > 0 ? stage.stepSuccesses / stage.stepAttempts : 0;
  return Object.freeze({
    ...stage,
    directionReads: finishDirectionReads(stage.directionReads),
    accuracy,
    stepRate,
  });
}

export function finishRunAnalysis(session, { won = false, score = 0 } = {}) {
  const safe = session ?? createRunAnalysisSession();
  const stages = Object.freeze(safe.stages.map(finishStage));
  return Object.freeze({
    won: Boolean(won),
    score: Math.max(0, Math.round(Number(score) || 0)),
    stageReached: stages.length ? Math.max(...stages.map((stage) => stage.stage)) : 0,
    stages,
  });
}

function weaknessScore(stage, won) {
  const accuracyPenalty = stage.parryAttempts > 0 ? (1 - stage.accuracy) * 4 : stage.hitsTaken > 0 ? 3 : 0;
  const unclearedPenalty = !won && !stage.cleared ? 5 : 0;
  return unclearedPenalty + stage.hitsTaken * 2 + stage.missedCounters * 1.6 + stage.attackMisses * 0.6 + accuracyPenalty;
}

function stageLabel(stage) {
  const enemy = ENEMY_LABELS[stage.enemyId] || stage.enemyName || '敵人';
  return `第${stage.stage}關 · ${enemy}`;
}

export function buildDirectionFocus(stage) {
  if (!stage) return null;
  const rows = DIRECTION_META.map((meta, index) => {
    const read = stage.directionReads?.[meta.direction] ?? {};
    const defended = Math.max(0, Number(read.defended) || 0);
    const hits = Math.max(0, Number(read.hits) || 0);
    const resolved = defended + hits;
    const faced = Math.max(Math.max(0, Number(read.faced) || 0), resolved);
    const accuracyPct = faced > 0 ? Math.round((defended / faced) * 100) : null;
    return {
      ...meta,
      index,
      faced,
      defended,
      parries: Math.max(0, Number(read.parries) || 0),
      evades: Math.max(0, Number(read.evades) || 0),
      hits,
      accuracyPct,
    };
  });
  const seen = rows.filter((row) => row.faced > 0);
  if (!seen.length) return null;
  const weakest = [...seen].sort((a, b) =>
    (a.accuracyPct ?? 101) - (b.accuracyPct ?? 101) ||
    b.hits - a.hits ||
    b.faced - a.faced ||
    a.index - b.index,
  )[0];
  const frozenRows = Object.freeze(rows.map(({ index, ...row }) => Object.freeze({
    ...row,
    weak: row.direction === weakest.direction,
  })));
  return Object.freeze({
    weakDirection: weakest.direction,
    weakLabel: weakest.label,
    weakAccuracyPct: weakest.accuracyPct,
    rows: frozenRows,
  });
}

export function buildRunAdvice(report) {
  const stages = Array.isArray(report?.stages) ? report.stages : [];
  if (!stages.length) {
    return Object.freeze({
      focusLabel: '今局',
      tip: '完成一場決鬥後會在呢度整理格擋、反擊、STEP 同受擊表現。',
      stageRows: Object.freeze([]),
      directionFocus: null,
    });
  }

  const focus = report.won
    ? [...stages].sort((a, b) => weaknessScore(b, true) - weaknessScore(a, true))[0]
    : stages[stages.length - 1];

  const missedRatio = focus.counterOpenings > 0 ? focus.missedCounters / focus.counterOpenings : 0;
  const averageCounterDamage = focus.counters > 0 ? focus.counterDamage / focus.counters : 0;
  let tip;

  if (focus.missedCounters >= 2 || (focus.missedCounters >= 1 && missedRatio >= 0.34)) {
    tip = `你有 ${focus.missedCounters} 次反擊空隙冇用；格擋／STEP 成功後即掃屏。`;
  } else if (focus.enemyId === 'wandering-ronin' && focus.parryAttempts > 0 && focus.accuracy < 0.6) {
    tip = '浪人會假動作：唔好跟第一下，等最後刀路定型先點相應邊緣。';
  } else if (focus.stepAttempts >= 2 && focus.stepRate < 0.5) {
    tip = 'STEP 只避到短／中距離刀；見追步或重擊，改用方向格擋。';
  } else if (focus.hitsTaken >= 3) {
    tip = '受擊偏多：先穩定讀刀同格擋，反擊只喺成功防守後出手。';
  } else if (focus.counters > 0 && averageCounterDamage < 1.8) {
    tip = '反擊命中但傷害偏低：試向來刀相反方向掃，通常可多 1 傷害。';
  } else if (focus.parries >= 2 && focus.perfectParries === 0) {
    tip = '格擋已經穩定；下一步收窄時機，爭取 Perfect Parry 快速破勢。';
  } else {
    tip = report.won
      ? '整體節奏穩定；下一局可挑戰更多 Perfect Parry／Perfect STEP。'
      : '先保持防守節奏：讀刀 → 成功格擋／STEP → 再掃屏反擊。';
  }

  const stageRows = Object.freeze(stages.map((stage) => Object.freeze({
    stage: stage.stage,
    label: stageLabel(stage),
    cleared: stage.cleared,
    accuracyPct: stage.parryAttempts > 0 ? Math.round(stage.accuracy * 100) : null,
    hitsTaken: stage.hitsTaken,
    counters: stage.counters,
    counterOpenings: stage.counterOpenings,
    stepSuccesses: stage.stepSuccesses,
    stepAttempts: stage.stepAttempts,
  })));

  return Object.freeze({
    focusStage: focus.stage,
    focusLabel: stageLabel(focus),
    tip,
    stageRows,
    directionFocus: buildDirectionFocus(focus),
  });
}

function installStyles() {
  if (document.querySelector('style[data-run-analysis]')) return;
  const style = document.createElement('style');
  style.dataset.runAnalysis = 'true';
  style.textContent = `
    .result-analysis{width:min(100%,330px);margin:12px auto 0;padding:10px;border:1px solid rgba(228,182,107,.2);border-radius:14px;background:rgba(7,8,11,.42);text-align:left}
    .result-analysis[hidden],.result-analysis__directions[hidden]{display:none}
    .result-analysis__head,.result-analysis__directions-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
    .result-analysis__head span,.result-analysis__directions-head span{font-size:10px;font-weight:850;letter-spacing:.12em;color:rgba(237,210,174,.66)}
    .result-analysis__head strong,.result-analysis__directions-head strong{font-size:12px;color:#f2dfbd;text-align:right}
    .result-analysis__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:8px}
    .result-analysis__stage{min-width:0;padding:7px 8px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(255,255,255,.025)}
    .result-analysis__stage strong,.result-analysis__stage span{display:block}
    .result-analysis__stage strong{font-size:11px;color:rgba(248,239,224,.9)}
    .result-analysis__stage span{margin-top:3px;font-size:10.5px;line-height:1.3;color:rgba(236,230,219,.66)}
    .result-analysis__directions{margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.07)}
    .result-analysis__directions-head strong{font-size:10.5px;color:rgba(255,214,160,.9)}
    .result-analysis__direction-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;margin-top:6px}
    .result-analysis__direction{min-width:0;padding:5px 3px;border:1px solid rgba(255,255,255,.07);border-radius:8px;background:rgba(255,255,255,.02);text-align:center}
    .result-analysis__direction strong,.result-analysis__direction span{display:block}
    .result-analysis__direction strong{font-size:10px;color:rgba(248,239,224,.86)}
    .result-analysis__direction span{margin-top:2px;font-size:8.5px;color:rgba(236,230,219,.58)}
    .result-analysis__direction.is-weak{border-color:rgba(255,132,105,.38);background:rgba(139,43,36,.12)}
    .result-analysis__direction.is-weak strong{color:#ffd0bd}
    .result-analysis__tip{margin:8px 0 0!important;font-size:11.5px!important;line-height:1.4!important;color:rgba(245,227,196,.82)!important}
    .modal__content--result h2{font-size:clamp(34px,11vw,52px)}
    .modal__content--result>#result-summary{margin-top:10px;font-size:11px;line-height:1.4}
    .modal__content--result .result-score{margin-top:12px}
    .modal__content--result .primary-button{margin-top:14px}
    @media(max-width:360px){.result-analysis{padding:9px}.result-analysis__head strong{font-size:11.5px}.result-analysis__stage{padding:6px 7px}.result-analysis__direction{padding:4px 2px}}
  `;
  document.head.append(style);
}

function ensurePanel() {
  const summary = document.querySelector('#result-summary');
  if (!summary?.parentElement) return null;
  let panel = document.querySelector('#result-analysis');
  if (!panel) {
    panel = document.createElement('section');
    panel.id = 'result-analysis';
    panel.className = 'result-analysis';
    panel.hidden = true;
    panel.setAttribute('aria-label', '今局戰鬥分析');
    panel.innerHTML = '<div class="result-analysis__head"><span>今局分析</span><strong data-analysis-focus></strong></div><div class="result-analysis__grid" data-analysis-grid></div><div class="result-analysis__directions" data-analysis-directions hidden><div class="result-analysis__directions-head"><span>四向防守</span><strong data-analysis-direction-focus></strong></div><div class="result-analysis__direction-grid" data-analysis-direction-grid></div></div><p class="result-analysis__tip" data-analysis-tip></p>';
    summary.insertAdjacentElement('afterend', panel);
  }
  return panel;
}

function renderRunAnalysis(report) {
  installStyles();
  const panel = ensurePanel();
  if (!panel) return;
  const advice = buildRunAdvice(report);
  const focus = panel.querySelector('[data-analysis-focus]');
  const grid = panel.querySelector('[data-analysis-grid]');
  const tip = panel.querySelector('[data-analysis-tip]');
  const directions = panel.querySelector('[data-analysis-directions]');
  const directionFocus = panel.querySelector('[data-analysis-direction-focus]');
  const directionGrid = panel.querySelector('[data-analysis-direction-grid]');
  if (!focus || !grid || !tip) return;

  focus.textContent = advice.focusLabel;
  grid.replaceChildren();
  for (const row of advice.stageRows) {
    const card = document.createElement('article');
    card.className = 'result-analysis__stage';
    const title = document.createElement('strong');
    title.textContent = `${row.label}${row.cleared ? ' ✓' : ''}`;
    const line1 = document.createElement('span');
    line1.textContent = `格擋 ${row.accuracyPct === null ? '—' : `${row.accuracyPct}%`} · 受擊 ${row.hitsTaken}`;
    const line2 = document.createElement('span');
    line2.textContent = `反擊 ${row.counters}/${row.counterOpenings} · STEP ${row.stepSuccesses}/${row.stepAttempts}`;
    card.append(title, line1, line2);
    grid.append(card);
  }

  const showDirections = Boolean(advice.directionFocus && advice.stageRows.length <= 4 && directions && directionFocus && directionGrid);
  if (directions) directions.hidden = !showDirections;
  if (showDirections) {
    directionFocus.textContent = `${advice.directionFocus.weakLabel} · ${advice.directionFocus.weakAccuracyPct}%`;
    directionGrid.replaceChildren();
    for (const row of advice.directionFocus.rows) {
      const cell = document.createElement('div');
      cell.className = `result-analysis__direction${row.weak ? ' is-weak' : ''}`;
      const title = document.createElement('strong');
      title.textContent = `${row.symbol} ${row.shortLabel}`;
      const value = document.createElement('span');
      value.textContent = row.faced > 0 ? `防 ${row.defended}/${row.faced}` : '—';
      cell.append(title, value);
      directionGrid.append(cell);
    }
    document.documentElement.dataset.runAnalysisWeakDirection = advice.directionFocus.weakDirection;
  } else {
    if (directionGrid) directionGrid.replaceChildren();
    delete document.documentElement.dataset.runAnalysisWeakDirection;
  }

  tip.textContent = advice.tip;
  panel.hidden = false;
  document.documentElement.dataset.runAnalysisRendered = 'true';
}

export function installRunAnalysis(Engine = CombatEngine) {
  if (typeof document === 'undefined' || !Engine?.prototype || Engine.prototype[installed]) return;
  const originalStart = Engine.prototype.start;
  const originalDrainEvents = Engine.prototype.drainEvents;
  Object.defineProperty(Engine.prototype, installed, { value: true });

  Engine.prototype.start = function runAnalysisStart(now = 0) {
    sessions.set(this, createRunAnalysisSession());
    return originalStart.call(this, now);
  };

  Engine.prototype.drainEvents = function runAnalysisDrainEvents() {
    const events = originalDrainEvents.call(this);
    const session = sessions.get(this);
    if (!session) return events;

    for (const event of events) {
      observeRunAnalysisEvent(session, event);
      if (event.type === 'victory' || event.type === 'defeat') {
        const report = finishRunAnalysis(session, {
          won: event.type === 'victory',
          score: event.detail?.score,
        });
        queueMicrotask(() => renderRunAnalysis(report));
      }
    }
    return events;
  };

  installStyles();
  ensurePanel();
  document.documentElement.dataset.runAnalysisReady = 'true';
}

if (typeof document !== 'undefined') installRunAnalysis();
