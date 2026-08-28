import test from 'node:test';
import assert from 'node:assert/strict';

import { Direction } from '../src/game-core.js';
import { PausableCombatClock, directionFromErgonomicTap, rectIsNeutralForErgonomicTap } from '../src/combat-ux.js';

test('portrait top parry reaches into the thumb-friendly upper-middle zone without swallowing centre', () => {
  assert.equal(directionFromErgonomicTap(160, 205, 320, 568), Direction.TOP);
  assert.equal(directionFromErgonomicTap(160, 285, 320, 568), null);
  assert.equal(directionFromErgonomicTap(8, 205, 320, 568), Direction.LEFT);
  assert.equal(directionFromErgonomicTap(312, 205, 320, 568), Direction.RIGHT);
  assert.equal(directionFromErgonomicTap(160, 560, 320, 568), Direction.BOTTOM);
});

test('pause control occupies the neutral portrait band while adjacent top and right parry targets remain live', () => {
  const pauseRect = { left: 138, top: 355, right: 182, bottom: 399 };
  assert.equal(rectIsNeutralForErgonomicTap(pauseRect, 320, 568), true);
  assert.equal(directionFromErgonomicTap(160, 205, 320, 568), Direction.TOP);
  assert.equal(directionFromErgonomicTap(312, 284, 320, 568), Direction.RIGHT);
  assert.equal(directionFromErgonomicTap(160, 377, 320, 568), null);
});

test('landscape keeps the original symmetric edge depth and pause neutral-band contract', () => {
  assert.equal(directionFromErgonomicTap(284, 80, 568, 320), Direction.TOP);
  assert.equal(directionFromErgonomicTap(284, 120, 568, 320), null);
  assert.equal(rectIsNeutralForErgonomicTap({ left: 262, top: 176, right: 306, bottom: 220 }, 568, 320), true);
});

test('pausable combat clock freezes elapsed game time and never catches up after resume', () => {
  const clock = new PausableCombatClock(1000);
  clock.resume();
  assert.deepEqual(clock.tick(1100), { now: 1100, frameDt: 50 });
  clock.pause();
  assert.equal(clock.tick(2100).now, 1100);
  assert.equal(clock.tick(3100).now, 1100);
  clock.resume();
  assert.deepEqual(clock.tick(3120), { now: 1120, frameDt: 20 });
});
