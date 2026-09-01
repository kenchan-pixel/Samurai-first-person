import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import {
  CONTROL_HAND_STORAGE_KEY,
  ControlHand,
  normalizeControlHand,
  oppositeControlHand,
} from '../src/control-handedness.js';

test('control handedness defaults safely to right and mirrors deterministically', () => {
  assert.equal(CONTROL_HAND_STORAGE_KEY, 'blade-reversal-control-hand-v1');
  assert.equal(normalizeControlHand(undefined), ControlHand.RIGHT);
  assert.equal(normalizeControlHand('unexpected'), ControlHand.RIGHT);
  assert.equal(normalizeControlHand(ControlHand.LEFT), ControlHand.LEFT);
  assert.equal(oppositeControlHand(ControlHand.RIGHT), ControlHand.LEFT);
  assert.equal(oppositeControlHand(ControlHand.LEFT), ControlHand.RIGHT);
});

test('production entry loads persistent handedness and mirrors only the STEP cluster', async () => {
  const [index, source] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/control-handedness.js', import.meta.url), 'utf8'),
  ]);
  const footworkIndex = index.indexOf('./src/footwork.js');
  const handednessIndex = index.indexOf('./src/control-handedness.js');
  const mainIndex = index.indexOf('./src/main.js');
  assert.ok(footworkIndex >= 0 && handednessIndex > footworkIndex && mainIndex > handednessIndex);
  assert.match(source, /data-control-hand="left"\] \.footwork-step/);
  assert.match(source, /data-control-hand="left"\] \.footwork-range/);
  assert.match(source, /data-control-hand="left"\] \.footwork-feedback/);
  assert.doesNotMatch(source, /directionFrom|attemptParry|directionFromSwipe/);
});
