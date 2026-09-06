import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDirectionFocus,
  buildRunAdvice,
  createRunAnalysisSession,
  finishRunAnalysis,
  observeRunAnalysisEvent,
} from '../src/run-analysis.js';

function emit(session, type, detail = {}) {
  observeRunAnalysisEvent(session, { type, detail });
}

test('direction analysis counts real strike directions, parries, STEP evades and hits', () => {
  const session = createRunAnalysisSession();
  emit(session, 'stage-start', { stage: 2, enemyId: 'wandering-ronin', enemyName: 'Wandering Ronin' });

  emit(session, 'strike', { direction: 'top' });
  emit(session, 'parry', { direction: 'top' });
  emit(session, 'counter', { direction: 'bottom', damage: 2 });

  emit(session, 'strike', { direction: 'left' });
  emit(session, 'player-hit', { direction: 'left', damage: 1 });

  emit(session, 'strike', { direction: 'left' });
  emit(session, 'backstep-evade', { direction: 'left' });
  emit(session, 'counter', { direction: 'right', damage: 1 });
  emit(session, 'enemy-defeated', { enemyId: 'wandering-ronin', stage: 2 });

  const report = finishRunAnalysis(session, { won: true, score: 1200 });
  const focus = buildDirectionFocus(report.stages[0]);
  assert.ok(focus);
  assert.equal(focus.weakDirection, 'left');
  assert.equal(focus.weakAccuracyPct, 50);

  const top = focus.rows.find((row) => row.direction === 'top');
  const left = focus.rows.find((row) => row.direction === 'left');
  assert.deepEqual(
    { faced: top.faced, defended: top.defended, hits: top.hits, pct: top.accuracyPct },
    { faced: 1, defended: 1, hits: 0, pct: 100 },
  );
  assert.deepEqual(
    { faced: left.faced, defended: left.defended, parries: left.parries, evades: left.evades, hits: left.hits, pct: left.accuracyPct },
    { faced: 2, defended: 1, parries: 0, evades: 1, hits: 1, pct: 50 },
  );

  const advice = buildRunAdvice(report);
  assert.equal(advice.focusStage, 2);
  assert.equal(advice.directionFocus?.weakDirection, 'left');
});

test('direction analysis stays absent until an actual strike direction is observed', () => {
  const session = createRunAnalysisSession();
  emit(session, 'stage-start', { stage: 1, enemyId: 'ashigaru-scout', enemyName: 'Ashigaru Scout' });
  emit(session, 'enemy-defeated', { enemyId: 'ashigaru-scout', stage: 1 });
  const report = finishRunAnalysis(session, { won: true, score: 400 });

  assert.equal(buildDirectionFocus(report.stages[0]), null);
  assert.equal(buildRunAdvice(report).directionFocus, null);
});
