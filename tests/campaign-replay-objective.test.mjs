import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  buildCampaignReplayObjective,
  evaluateCampaignReplayObjective,
  formatCampaignReplayLine,
} from '../src/campaign-replay-objective-model.js';

function report({ won = false, stageReached = 1, stages = [] } = {}) {
  return { won, stageReached, stages };
}

test('campaign replay objective turns a defeat into one bounded progression target', () => {
  const first = report({ won: false, stageReached: 1, stages: [{ stage: 1, hitsTaken: 2 }] });
  const objective = buildCampaignReplayObjective(first);
  assert.deepEqual(objective, { id: 'reach-stage', value: 2, label: '打入第2關' });

  const retry = report({
    won: false,
    stageReached: 2,
    stages: [{ stage: 1 }, { stage: 2, hitsTaken: 1 }],
  });
  const outcome = evaluateCampaignReplayObjective(objective, retry);
  assert.equal(outcome.achieved, true);
  assert.equal(formatCampaignReplayLine(outcome, buildCampaignReplayObjective(retry)), '✓ 打入第2關 · 下一步 打入第3關');
});

test('failed replay objective stays truthful and does not invent progress', () => {
  const objective = { id: 'reach-stage', value: 3, label: '打入第3關' };
  const retry = report({ won: false, stageReached: 2, stages: [{ stage: 1 }, { stage: 2 }] });
  const outcome = evaluateCampaignReplayObjective(objective, retry);
  assert.equal(outcome.achieved, false);
  assert.equal(formatCampaignReplayLine(outcome, objective), '未達 · 打入第3關 · 再戰');
});

test('campaign win objectives stay measurable from authoritative report facts', () => {
  const hitReport = report({ won: true, stageReached: 4, stages: [{ hitsTaken: 2 }, { hitsTaken: 1 }] });
  const hitObjective = buildCampaignReplayObjective(hitReport);
  assert.deepEqual(hitObjective, { id: 'max-hits', value: 2, label: '全程受擊 ≤ 2' });
  assert.equal(evaluateCampaignReplayObjective(hitObjective, report({ won: true, stageReached: 4, stages: [{ hitsTaken: 1 }] })).achieved, true);

  const cleanReport = report({ won: true, stageReached: 4, stages: [{ hitsTaken: 0, missedCounters: 0, perfectParries: 1, perfectSteps: 1 }] });
  const perfectObjective = buildCampaignReplayObjective(cleanReport);
  assert.deepEqual(perfectObjective, { id: 'perfect-count', value: 3, label: 'Perfect ≥ 3' });
  assert.equal(evaluateCampaignReplayObjective(perfectObjective, report({ won: true, stageReached: 4, stages: [{ perfectParries: 2, perfectSteps: 1 }] })).achieved, true);
});

test('campaign replay adapter stays session-only with no storage or remote transport APIs', async () => {
  const source = await readFile(new URL('../src/campaign-replay-objective.js', import.meta.url), 'utf8');
  for (const forbidden of ['localStorage', 'sessionStorage', 'indexedDB', 'fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket']) {
    assert.equal(source.includes(forbidden), false, `unexpected ${forbidden} in campaign replay adapter`);
  }
});
