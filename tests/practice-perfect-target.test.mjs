import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildPracticeFocusCoach,
  buildPracticePerfectTargetOutcome,
  buildPracticeSnapshot,
} from '../src/practice-progress.js';

function snapshot({ perfectParries = 0, perfectSteps = 0 } = {}) {
  return buildPracticeSnapshot({
    stages: [{
      hitsTaken: 0,
      counterOpenings: 2,
      counters: 2,
      perfectParries,
      perfectSteps,
      directionReads: {
        top: { faced: 1, defended: 1, hits: 0 },
        right: { faced: 0, defended: 0, hits: 0 },
        bottom: { faced: 0, defended: 0, hits: 0 },
        left: { faced: 1, defended: 1, hits: 0 },
      },
    }],
  });
}

test('practice snapshot counts authoritative Perfect Parry and Perfect STEP events for coaching only', () => {
  const current = snapshot({ perfectParries: 2, perfectSteps: 1 });
  assert.equal(current.perfectCount, 3);
  assert.equal(current.directionFocus.rows.find((row) => row.direction === 'right').faced, 0);
});

test('all-observed-clean retry grades the actual Perfect challenge without inventing a direction', () => {
  const previous = snapshot();
  const current = snapshot({ perfectParries: 1 });
  const outcome = buildPracticePerfectTargetOutcome(previous, current);
  const coach = buildPracticeFocusCoach(previous, current);

  assert.equal(outcome.kind, 'perfect');
  assert.equal(outcome.state, 'mastered');
  assert.equal(outcome.direction, null);
  assert.equal(outcome.perfectCount, 1);
  assert.equal(outcome.text, '上局目標 · Perfect · 達成 1次');
  assert.equal(coach.targetOutcome.kind, 'perfect');
  assert.equal(coach.trackedDirection, null);
  assert.match(coach.text, /上局目標 · Perfect · 達成 1次/);
  assert.match(coach.text, /下一局保持節奏/);
});

test('Perfect challenge remains truthful when the retry has no Perfect technique', () => {
  const previous = snapshot({ perfectParries: 1 });
  const current = snapshot();
  const outcome = buildPracticePerfectTargetOutcome(previous, current);

  assert.equal(outcome.kind, 'perfect');
  assert.equal(outcome.state, 'missed');
  assert.equal(outcome.direction, null);
  assert.equal(outcome.perfectCount, 0);
  assert.equal(outcome.text, '上局目標 · Perfect · 未達成 0次');
});
