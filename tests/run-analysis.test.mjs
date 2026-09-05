import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildRunAdvice,
  buildRunKeyMoment,
  createRunAnalysisSession,
  finishRunAnalysis,
  observeRunAnalysisEvent,
} from '../src/run-analysis.js';

test('run analysis keeps stage-local combat data and identifies a Ronin read problem', () => {
  const session = createRunAnalysisSession();

  observeRunAnalysisEvent(session, {
    type: 'stage-start',
    detail: { stage: 1, enemyId: 'ashigaru-scout', enemyName: 'Ashigaru Scout' },
  });
  observeRunAnalysisEvent(session, { type: 'parry', detail: { direction: 'top' } });
  observeRunAnalysisEvent(session, { type: 'counter', detail: { damage: 2 } });
  observeRunAnalysisEvent(session, { type: 'enemy-defeated', detail: { stage: 1 } });

  observeRunAnalysisEvent(session, {
    type: 'stage-start',
    detail: { stage: 2, enemyId: 'wandering-ronin', enemyName: 'Wandering Ronin' },
  });
  observeRunAnalysisEvent(session, { type: 'parry-miss', detail: { reason: 'wrong-direction' } });
  observeRunAnalysisEvent(session, { type: 'parry-miss', detail: { reason: 'wrong-direction' } });
  observeRunAnalysisEvent(session, { type: 'parry', detail: { direction: 'right' } });
  observeRunAnalysisEvent(session, { type: 'counter', detail: { damage: 1 } });
  observeRunAnalysisEvent(session, { type: 'player-hit', detail: { damage: 1 } });

  const report = finishRunAnalysis(session, { won: false, score: 1965 });
  const advice = buildRunAdvice(report);

  assert.equal(report.stageReached, 2);
  assert.equal(report.stages[0].cleared, true);
  assert.equal(report.stages[1].accuracy, 1 / 3);
  assert.equal(advice.focusStage, 2);
  assert.match(advice.focusLabel, /第2關/);
  assert.match(advice.tip, /最後刀路/);
});

test('run analysis counts unused counter openings and STEP outcomes without remote persistence', () => {
  const session = createRunAnalysisSession();
  observeRunAnalysisEvent(session, {
    type: 'stage-start',
    detail: { stage: 1, enemyId: 'ashigaru-scout', enemyName: 'Ashigaru Scout' },
  });

  observeRunAnalysisEvent(session, { type: 'perfect-parry', detail: {} });
  observeRunAnalysisEvent(session, { type: 'perfect-riposte', detail: { damage: 1 } });
  observeRunAnalysisEvent(session, { type: 'telegraph', detail: {} });
  observeRunAnalysisEvent(session, { type: 'backstep-evade', detail: {} });
  observeRunAnalysisEvent(session, { type: 'perfect-step-riposte', detail: { damage: 1 } });
  observeRunAnalysisEvent(session, { type: 'footwork-miss', detail: { reason: 'tracked' } });
  observeRunAnalysisEvent(session, { type: 'counter', detail: { damage: 2 } });

  const report = finishRunAnalysis(session, { won: false, score: 900 });
  const stage = report.stages[0];
  const advice = buildRunAdvice(report);

  assert.equal(stage.counterOpenings, 2);
  assert.equal(stage.missedCounters, 1);
  assert.equal(stage.stepAttempts, 2);
  assert.equal(stage.stepSuccesses, 1);
  assert.equal(stage.perfectSteps, 1);
  assert.equal(stage.damageDealt, 4);
  assert.equal(stage.counterDamage, 2);
  assert.match(advice.tip, /反擊空隙/);
});

test('automatic ripostes do not inflate manual counter damage coaching', () => {
  const session = createRunAnalysisSession();
  observeRunAnalysisEvent(session, {
    type: 'stage-start',
    detail: { stage: 1, enemyId: 'ashigaru-scout', enemyName: 'Ashigaru Scout' },
  });

  observeRunAnalysisEvent(session, { type: 'perfect-parry', detail: {} });
  observeRunAnalysisEvent(session, { type: 'perfect-riposte', detail: { damage: 1 } });
  observeRunAnalysisEvent(session, { type: 'perfect-step-riposte', detail: { damage: 1 } });
  observeRunAnalysisEvent(session, { type: 'counter', detail: { damage: 1 } });

  const report = finishRunAnalysis(session, { won: false, score: 700 });
  const stage = report.stages[0];
  const advice = buildRunAdvice(report);

  assert.equal(stage.counters, 1);
  assert.equal(stage.counterDamage, 1);
  assert.equal(stage.damageDealt, 3);
  assert.match(advice.tip, /相反方向掃/);
});

test('automatic riposte closures do not count unavailable manual counter openings', () => {
  const phaseSession = createRunAnalysisSession();
  observeRunAnalysisEvent(phaseSession, {
    type: 'stage-start',
    detail: { stage: 4, enemyId: 'crimson-shogun', enemyName: 'Crimson Shogun' },
  });
  observeRunAnalysisEvent(phaseSession, { type: 'perfect-parry', detail: {} });
  observeRunAnalysisEvent(phaseSession, { type: 'perfect-riposte', detail: { damage: 1 } });
  observeRunAnalysisEvent(phaseSession, { type: 'boss-phase', detail: { phase: 2 } });

  const phaseReport = finishRunAnalysis(phaseSession, { won: false, score: 1200 });
  const phaseAdvice = buildRunAdvice(phaseReport);
  assert.equal(phaseReport.stages[0].counterOpenings, 0);
  assert.equal(phaseReport.stages[0].counters, 0);
  assert.equal(phaseAdvice.stageRows[0].counterOpenings, 0);
  assert.equal(phaseAdvice.stageRows[0].counters, 0);

  const defeatSession = createRunAnalysisSession();
  observeRunAnalysisEvent(defeatSession, {
    type: 'stage-start',
    detail: { stage: 1, enemyId: 'ashigaru-scout', enemyName: 'Ashigaru Scout' },
  });
  observeRunAnalysisEvent(defeatSession, { type: 'backstep-evade', detail: {} });
  observeRunAnalysisEvent(defeatSession, {
    type: 'perfect-step-riposte',
    detail: { damage: 1, defeated: true, openingClosed: true },
  });
  observeRunAnalysisEvent(defeatSession, { type: 'enemy-defeated', detail: { stage: 1 } });

  const defeatReport = finishRunAnalysis(defeatSession, { won: true, score: 1500 });
  const defeatAdvice = buildRunAdvice(defeatReport);
  assert.equal(defeatReport.stages[0].counterOpenings, 0);
  assert.equal(defeatReport.stages[0].counters, 0);
  assert.equal(defeatAdvice.stageRows[0].counterOpenings, 0);
  assert.equal(defeatAdvice.stageRows[0].counters, 0);
});

test('key moment highlights the strongest truthful campaign stage and keeps defeat facts bounded', () => {
  const win = createRunAnalysisSession();
  observeRunAnalysisEvent(win, { type: 'stage-start', detail: { stage: 1, enemyId: 'ashigaru-scout', enemyName: 'Ashigaru Scout' } });
  observeRunAnalysisEvent(win, { type: 'perfect-parry', detail: { direction: 'top' } });
  observeRunAnalysisEvent(win, { type: 'enemy-guard-break', detail: {} });
  observeRunAnalysisEvent(win, { type: 'counter', detail: { damage: 3 } });
  observeRunAnalysisEvent(win, { type: 'enemy-defeated', detail: { stage: 1 } });
  observeRunAnalysisEvent(win, { type: 'stage-start', detail: { stage: 2, enemyId: 'wandering-ronin', enemyName: 'Wandering Ronin' } });
  observeRunAnalysisEvent(win, { type: 'parry', detail: { direction: 'left' } });
  observeRunAnalysisEvent(win, { type: 'counter', detail: { damage: 1 } });
  observeRunAnalysisEvent(win, { type: 'player-hit', detail: { direction: 'right', damage: 1 } });
  observeRunAnalysisEvent(win, { type: 'enemy-defeated', detail: { stage: 2 } });

  const winMoment = buildRunKeyMoment(finishRunAnalysis(win, { won: true, score: 1800 }));
  assert.equal(winMoment.stage, 1);
  assert.match(winMoment.copy, /關鍵一刻/);
  assert.match(winMoment.copy, /破勢1/);
  assert.match(winMoment.copy, /完美1/);

  const defeat = createRunAnalysisSession();
  observeRunAnalysisEvent(defeat, { type: 'stage-start', detail: { stage: 1, enemyId: 'ashigaru-scout', enemyName: 'Ashigaru Scout' } });
  observeRunAnalysisEvent(defeat, { type: 'parry', detail: { direction: 'top' } });
  observeRunAnalysisEvent(defeat, { type: 'telegraph', detail: {} });
  observeRunAnalysisEvent(defeat, { type: 'player-hit', detail: { direction: 'left', damage: 1 } });
  observeRunAnalysisEvent(defeat, { type: 'player-hit', detail: { direction: 'right', damage: 1 } });
  const defeatMoment = buildRunKeyMoment(finishRunAnalysis(defeat, { won: false, score: 300 }));
  assert.equal(defeatMoment.stage, 1);
  assert.match(defeatMoment.copy, /受擊2/);
  assert.match(defeatMoment.copy, /漏反1/);
});

test('key moment stays out of direct practice and eight-wave challenge terminals', () => {
  const session = createRunAnalysisSession();
  for (let stage = 1; stage <= 8; stage += 1) {
    observeRunAnalysisEvent(session, { type: 'stage-start', detail: { stage, enemyId: `pressure-${stage}`, enemyName: `Pressure ${stage}` } });
    observeRunAnalysisEvent(session, { type: 'enemy-defeated', detail: { stage } });
  }
  const report = finishRunAnalysis(session, { won: true, score: 2200 });
  assert.equal(buildRunKeyMoment(report), null);

  const practice = createRunAnalysisSession();
  observeRunAnalysisEvent(practice, { type: 'stage-start', detail: { stage: 2, enemyId: 'wandering-ronin', enemyName: 'Wandering Ronin' } });
  observeRunAnalysisEvent(practice, { type: 'enemy-defeated', detail: { stage: 2 } });
  assert.equal(buildRunKeyMoment(finishRunAnalysis(practice, { won: true, score: 800 }), { practice: true }), null);
});
