import test from 'node:test';
import assert from 'node:assert/strict';

import { Direction } from '../src/game-core.js';
import {
  PausableCombatClock,
  directionFromErgonomicTap,
  pauseRectIsTopRightHudSafe,
  rectIsNeutralForErgonomicTap,
} from '../src/combat-ux.js';

test('portrait top parry reaches into the thumb-friendly upper-middle zone without swallowing centre', () => {
  assert.equal(directionFromErgonomicTap(160, 205, 320, 568), Direction.TOP);
  assert.equal(directionFromErgonomicTap(160, 285, 320, 568), null);
  assert.equal(directionFromErgonomicTap(8, 205, 320, 568), Direction.LEFT);
  assert.equal(directionFromErgonomicTap(312, 205, 320, 568), Direction.RIGHT);
  assert.equal(directionFromErgonomicTap(160, 560, 320, 568), Direction.BOTTOM);
});

test('pause control uses the top-right HUD corner while adjacent top and right parry targets remain live', () => {
  const pauseRect = { left: 264, top: 54, right: 308, bottom: 98 };
  assert.equal(pauseRectIsTopRightHudSafe(pauseRect, 320, 568), true);
  assert.equal(rectIsNeutralForErgonomicTap(pauseRect, 320, 568), false);
  assert.equal(directionFromErgonomicTap(256, 76, 320, 568), Direction.TOP);
  assert.equal(directionFromErgonomicTap(286, 106, 320, 568), Direction.RIGHT);
  assert.equal(pauseRectIsTopRightHudSafe({ left: 138, top: 355, right: 182, bottom: 399 }, 320, 568), false);
});

test('landscape keeps the original symmetric edge depth', () => {
  assert.equal(directionFromErgonomicTap(284, 80, 568, 320), Direction.TOP);
  assert.equal(directionFromErgonomicTap(284, 120, 568, 320), null);
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
