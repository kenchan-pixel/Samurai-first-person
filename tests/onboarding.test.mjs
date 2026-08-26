import test from 'node:test';
import assert from 'node:assert/strict';
import { applyCoachEvent, createCoachProgress } from '../src/onboarding-coach.js';

test('guided first duel progresses from read to parry to counter', () => {
  let state = createCoachProgress(true);
  state = applyCoachEvent(state, { type: 'stage-start', detail: { stage: 1, enemyId: 'ashigaru-scout' } });
  assert.equal(state.mode, 'basics');
  assert.equal(state.visible, true);

  state = applyCoachEvent(state, { type: 'telegraph', detail: { feint: false } });
  assert.equal(state.steps.read, false);
  state = applyCoachEvent(state, { type: 'strike', detail: { direction: 'top' } });
  assert.equal(state.steps.read, true);

  state = applyCoachEvent(state, { type: 'parry', detail: { enemyPosture: 1, enemyPostureMax: 3 } });
  assert.equal(state.steps.parry, true);
  assert.match(state.hint, /敵勢 1\/3/);

  state = applyCoachEvent(state, { type: 'counter', detail: { damage: 2 } });
  assert.equal(state.steps.counter, true);
  assert.equal(state.completed, true);
  assert.equal(state.mode, 'complete');
});

test('coach gives adaptive miss guidance and a boss phase reset cue', () => {
  let state = createCoachProgress(true);
  state = applyCoachEvent(state, { type: 'stage-start', detail: { stage: 1, enemyId: 'ashigaru-scout' } });
  state = applyCoachEvent(state, { type: 'parry-miss', detail: { reason: 'wrong-direction' } });
  assert.match(state.hint, /方向錯誤/);

  state = applyCoachEvent(state, { type: 'stage-start', detail: { stage: 4, enemyId: 'crimson-shogun' } });
  assert.equal(state.mode, 'boss');
  assert.match(state.hint, /半血後/);

  state = applyCoachEvent(state, { type: 'boss-phase', detail: { phase: 2 } });
  assert.match(state.headline, /PHASE II/);
  assert.match(state.hint, /舊節奏已失效/);
});

test('disabled coach remains inert', () => {
  const state = createCoachProgress(false);
  const next = applyCoachEvent(state, { type: 'stage-start', detail: { stage: 1 } });
  assert.equal(next.visible, false);
  assert.equal(next.mode, null);
});
