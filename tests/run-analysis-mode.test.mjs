import test from 'node:test';
import assert from 'node:assert/strict';

import {
  RUN_ANALYSIS_MODE,
  buildRunKeyMoment,
  createRunAnalysisSession,
  finishRunAnalysis,
  observeRunAnalysisEvent,
  resolveRunAnalysisMode,
} from '../src/run-analysis.js';

function earlyDefeatReport() {
  const session = createRunAnalysisSession();
  observeRunAnalysisEvent(session, {
    type: 'stage-start',
    detail: { stage: 1, enemyId: 'ashigaru-scout', enemyName: 'Ashigaru Scout' },
  });
  observeRunAnalysisEvent(session, { type: 'strike', detail: { direction: 'top' } });
  observeRunAnalysisEvent(session, { type: 'player-hit', detail: { direction: 'top', damage: 1 } });
  return finishRunAnalysis(session, { won: false, score: 250 });
}

test('run analysis resolves challenge/daily mode before practice and defaults to campaign', () => {
  assert.equal(resolveRunAnalysisMode(), RUN_ANALYSIS_MODE.CAMPAIGN);
  assert.equal(resolveRunAnalysisMode({ practice: true }), RUN_ANALYSIS_MODE.PRACTICE);
  assert.equal(resolveRunAnalysisMode({ challenge: true }), RUN_ANALYSIS_MODE.CHALLENGE);
  assert.equal(resolveRunAnalysisMode({ dailyChallenge: true }), RUN_ANALYSIS_MODE.CHALLENGE);
  assert.equal(
    resolveRunAnalysisMode({ challenge: true, practice: true }),
    RUN_ANALYSIS_MODE.CHALLENGE,
  );
});

test('campaign key moment is suppressed for an early challenge or daily defeat', () => {
  const report = earlyDefeatReport();
  const campaign = buildRunKeyMoment(report, { mode: RUN_ANALYSIS_MODE.CAMPAIGN });

  assert.ok(campaign);
  assert.match(campaign.copy, /關鍵一刻/);
  assert.equal(buildRunKeyMoment(report, { mode: RUN_ANALYSIS_MODE.CHALLENGE }), null);
  assert.equal(
    buildRunKeyMoment(report, {
      mode: resolveRunAnalysisMode({ dailyChallenge: true }),
    }),
    null,
  );
});
