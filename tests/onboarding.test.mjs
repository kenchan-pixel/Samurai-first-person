import test from 'node:test';
import assert from 'node:assert/strict';
import { applyCoachEvent, createCoachProgress, guideCueForEvent } from '../src/onboarding-coach.js';

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

test('stage clear without a demonstrated parry does not complete Guided Duel', () => {
  let state = createCoachProgress(true);
  state = applyCoachEvent(state, { type: 'stage-start', detail: { stage: 1, enemyId: 'ashigaru-scout' } });
  state = applyCoachEvent(state, { type: 'strike', detail: { direction: 'top' } });
  state = applyCoachEvent(state, { type: 'counter', detail: { damage: 2, evaded: true } });
  assert.equal(state.steps.read, true);
  assert.equal(state.steps.parry, false);
  assert.equal(state.steps.counter, true);
  assert.equal(state.completed, false);

  state = applyCoachEvent(state, { type: 'enemy-defeated', detail: { stage: 1, enemyId: 'ashigaru-scout' } });
  assert.equal(state.completed, false);
  assert.equal(state.mode, null);
  assert.equal(state.visible, false);
  assert.match(state.hint, /下次首戰會繼續引導/);
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

test('gameplay clarity cues expose hidden follow-up rules without changing combat', () => {
  assert.deepEqual(guideCueForEvent({ type: 'stage-start', detail: { stage: 2 } }), {
    title: 'RONIN · 假動作',
    detail: '等最後刀路先格擋',
    kind: 'stage',
    duration: 1700,
  });
  assert.match(guideCueForEvent({ type: 'parry', detail: {} }).detail, /掃屏反擊/);
  assert.match(guideCueForEvent({ type: 'perfect-riposte', detail: { automatic: true } }).detail, /掃屏反擊/);
  assert.match(guideCueForEvent({ type: 'backstep-evade', detail: {} }).detail, /掃屏反擊/);
  assert.match(guideCueForEvent({ type: 'enemy-guard-break', detail: {} }).detail, /\+2/);
  assert.equal(guideCueForEvent({ type: 'counter', detail: { automatic: false } }).hide, true);
});
