import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildPracticeFocusCoach,
  buildPracticeSnapshot,
  buildPracticeTargetOutcome,
  comparePracticeSnapshots,
} from '../src/practice-progress.js';

test('practice progress snapshot uses authoritative directional defense and manual counter conversion', () => {
  const snapshot = buildPracticeSnapshot({
    stages: [{
      hitsTaken: 2,
      counterOpenings: 4,
      counters: 3,
      directionReads: {
        top: { faced: 2, defended: 2, hits: 0 },
        right: { faced: 1, defended: 0, hits: 1 },
        bottom: { faced: 1, defended: 1, hits: 0 },
        left: { faced: 0, defended: 0, hits: 0 },
      },
    }],
  });

  assert.equal(snapshot.defensePct, 75);
  assert.equal(snapshot.hitsTaken, 2);
  assert.equal(snapshot.counterPct, 75);
  assert.equal(snapshot.directionFocus.weakDirection, 'right');
  assert.equal(snapshot.directionFocus.weakLabel, '右方');
  assert.equal(snapshot.directionFocus.weakAccuracyPct, 0);
  assert.deepEqual(
    snapshot.directionFocus.rows.map(({ direction, faced, defended, accuracyPct }) => ({
      direction,
      faced,
      defended,
      accuracyPct,
    })),
    [
      { direction: 'top', faced: 2, defended: 2, accuracyPct: 100 },
      { direction: 'right', faced: 1, defended: 0, accuracyPct: 0 },
      { direction: 'bottom', faced: 1, defended: 1, accuracyPct: 100 },
      { direction: 'left', faced: 0, defended: 0, accuracyPct: null },
    ],
  );
});

test('practice progress comparison rewards better defense, fewer hits and stronger counter conversion', () => {
  const comparison = comparePracticeSnapshots(
    { defensePct: 50, hitsTaken: 2, counterPct: 50 },
    { defensePct: 75, hitsTaken: 1, counterPct: 100 },
  );

  assert.equal(comparison.status, '有進步');
  assert.equal(comparison.defenseDelta, 25);
  assert.equal(comparison.hitsDelta, -1);
  assert.equal(comparison.counterDelta, 50);
  assert.match(comparison.text, /防守 \+25%/);
  assert.match(comparison.text, /受擊 −1/);
  assert.match(comparison.text, /反擊 \+50%/);
});

test('practice progress comparison can flag a worse repeat without inventing unavailable percentages', () => {
  const comparison = comparePracticeSnapshots(
    { defensePct: 80, hitsTaken: 0, counterPct: null },
    { defensePct: 60, hitsTaken: 2, counterPct: null },
  );

  assert.equal(comparison.status, '再磨一局');
  assert.equal(comparison.defenseDelta, -20);
  assert.equal(comparison.hitsDelta, 2);
  assert.equal(comparison.counterDelta, null);
  assert.match(comparison.text, /反擊 —%/);
});

test('practice focus coach turns the weakest observed direction into a next-run target', () => {
  const current = buildPracticeSnapshot({
    stages: [{
      hitsTaken: 1,
      counterOpenings: 1,
      counters: 1,
      directionReads: {
        top: { faced: 1, defended: 0, hits: 1 },
        right: { faced: 0, defended: 0, hits: 0 },
        bottom: { faced: 0, defended: 0, hits: 0 },
        left: { faced: 1, defended: 1, hits: 0 },
      },
    }],
  });
  const coach = buildPracticeFocusCoach(null, current);

  assert.equal(coach.nextDirection, 'top');
  assert.equal(coach.nextAccuracyPct, 0);
  assert.equal(coach.trackedDirection, null);
  assert.equal(coach.targetOutcome, null);
  assert.equal(coach.allObservedPerfect, false);
  assert.match(coach.text, /下局目標：上方 0%/);
  assert.match(coach.text, /防 0\/1/);
});

test('practice target outcome grades only the directional target actually carried into the retry', () => {
  const previous = buildPracticeSnapshot({
    stages: [{
      hitsTaken: 2,
      counterOpenings: 1,
      counters: 0,
      directionReads: {
        top: { faced: 2, defended: 0, hits: 2 },
        right: { faced: 1, defended: 1, hits: 0 },
        bottom: { faced: 0, defended: 0, hits: 0 },
        left: { faced: 0, defended: 0, hits: 0 },
      },
    }],
  });
  const improved = buildPracticeSnapshot({
    stages: [{
      hitsTaken: 1,
      counterOpenings: 2,
      counters: 1,
      directionReads: {
        top: { faced: 2, defended: 1, hits: 1 },
        right: { faced: 1, defended: 1, hits: 0 },
        bottom: { faced: 0, defended: 0, hits: 0 },
        left: { faced: 0, defended: 0, hits: 0 },
      },
    }],
  });
  const mastered = buildPracticeSnapshot({
    stages: [{
      hitsTaken: 0,
      counterOpenings: 2,
      counters: 2,
      directionReads: {
        top: { faced: 2, defended: 2, hits: 0 },
        right: { faced: 1, defended: 1, hits: 0 },
        bottom: { faced: 0, defended: 0, hits: 0 },
        left: { faced: 0, defended: 0, hits: 0 },
      },
    }],
  });
  const unseen = buildPracticeSnapshot({
    stages: [{
      hitsTaken: 0,
      counterOpenings: 1,
      counters: 1,
      directionReads: {
        top: { faced: 0, defended: 0, hits: 0 },
        right: { faced: 1, defended: 1, hits: 0 },
        bottom: { faced: 0, defended: 0, hits: 0 },
        left: { faced: 0, defended: 0, hits: 0 },
      },
    }],
  });

  const improvedOutcome = buildPracticeTargetOutcome(previous, improved);
  const masteredOutcome = buildPracticeTargetOutcome(previous, mastered);
  const unseenOutcome = buildPracticeTargetOutcome(previous, unseen);

  assert.equal(improvedOutcome.state, 'improved');
  assert.equal(improvedOutcome.direction, 'top');
  assert.equal(improvedOutcome.delta, 50);
  assert.match(improvedOutcome.text, /上局目標 · 上方 · 進步 0%→50%/);
  assert.equal(masteredOutcome.state, 'mastered');
  assert.equal(masteredOutcome.delta, 100);
  assert.match(masteredOutcome.text, /上局目標 · 上方 · 達成 0%→100%/);
  assert.equal(unseenOutcome.state, 'unseen');
  assert.equal(unseenOutcome.delta, null);
  assert.match(unseenOutcome.text, /上局目標 · 上方 · 今局未再遇到/);
});

test('practice target outcome does not invent a directional target after an all-observed-clean Perfect challenge', () => {
  const previous = buildPracticeSnapshot({
    stages: [{
      hitsTaken: 0,
      counterOpenings: 2,
      counters: 2,
      directionReads: {
        top: { faced: 1, defended: 1, hits: 0 },
        right: { faced: 0, defended: 0, hits: 0 },
        bottom: { faced: 0, defended: 0, hits: 0 },
        left: { faced: 1, defended: 1, hits: 0 },
      },
    }],
  });
  const current = buildPracticeSnapshot({
    stages: [{
      hitsTaken: 0,
      counterOpenings: 1,
      counters: 1,
      directionReads: {
        top: { faced: 1, defended: 1, hits: 0 },
        right: { faced: 0, defended: 0, hits: 0 },
        bottom: { faced: 0, defended: 0, hits: 0 },
        left: { faced: 0, defended: 0, hits: 0 },
      },
    }],
  });

  assert.equal(buildPracticeTargetOutcome(previous, current), null);
});

test('practice focus coach tracks the prior weak direction and recognizes a clean repeat', () => {
  const previous = buildPracticeSnapshot({
    stages: [{
      hitsTaken: 1,
      counterOpenings: 1,
      counters: 1,
      directionReads: {
        top: { faced: 1, defended: 0, hits: 1 },
        right: { faced: 0, defended: 0, hits: 0 },
        bottom: { faced: 0, defended: 0, hits: 0 },
        left: { faced: 1, defended: 1, hits: 0 },
      },
    }],
  });
  const current = buildPracticeSnapshot({
    stages: [{
      hitsTaken: 0,
      counterOpenings: 2,
      counters: 2,
      directionReads: {
        top: { faced: 1, defended: 1, hits: 0 },
        right: { faced: 0, defended: 0, hits: 0 },
        bottom: { faced: 0, defended: 0, hits: 0 },
        left: { faced: 1, defended: 1, hits: 0 },
      },
    }],
  });
  const coach = buildPracticeFocusCoach(previous, current);

  assert.equal(coach.trackedDirection, 'top');
  assert.equal(coach.trackedDelta, 100);
  assert.equal(coach.targetOutcome.state, 'mastered');
  assert.equal(coach.allObservedPerfect, true);
  assert.match(coach.text, /上局目標 · 上方 · 達成 0%→100%/);
  assert.match(coach.text, /今局遇到刀路全守住/);
});
