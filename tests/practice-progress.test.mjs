import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildPracticeSnapshot,
  comparePracticeSnapshots,
} from '../src/practice-progress.js';

test('practice progress snapshot uses authoritative directional defense and manual counter conversion', () => {
  const snapshot = buildPracticeSnapshot({
    stages: [{
      hitsTaken: 2,
      counterOpenings: 4,
      counters: 3,
      directionReads: {
        top: { faced: 2, defended: 2 },
        right: { faced: 1, defended: 0 },
        bottom: { faced: 1, defended: 1 },
        left: { faced: 0, defended: 0 },
      },
    }],
  });

  assert.deepEqual(snapshot, {
    defensePct: 75,
    hitsTaken: 2,
    counterPct: 75,
  });
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
