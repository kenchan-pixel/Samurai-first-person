import test from 'node:test';
import assert from 'node:assert/strict';
import { bossSignatureFrame } from '../src/boss-signature-motion.js';

const boss = (overrides = {}) => ({
  enemy: { id: 'crimson-shogun', title: 'Stormbreak Throne' },
  phase: 'telegraph',
  phaseProgress: 0.75,
  attack: { heavy: true },
  ...overrides,
});

test('non-boss states stay neutral', () => {
  assert.deepEqual(bossSignatureFrame({ enemy: { id: 'wandering-ronin' } }, 1), {
    active: false,
    phase: 0,
    crouch: 0,
    forward: 0,
    pitch: 0,
    yaw: 0,
    roll: 0,
    enemyScale: 1,
    swordScale: 1,
    trailScale: 1,
  });
});

test('phase one gives the Shogun a deliberate heavy telegraph without changing rules', () => {
  const frame = bossSignatureFrame(boss(), 0);
  assert.equal(frame.active, true);
  assert.equal(frame.phase, 1);
  assert.equal(frame.enemyScale, 1);
  assert.ok(frame.crouch > 0);
  assert.ok(frame.forward > 0);
  assert.ok(frame.pitch > 0);
  assert.ok(frame.swordScale > 1);
});

test('Blood Moon is visibly more committed than phase one', () => {
  const phaseOne = bossSignatureFrame(boss(), 1);
  const phaseTwo = bossSignatureFrame(boss({ enemy: { id: 'crimson-shogun', title: 'Stormbreak Throne · Blood Moon' } }), 1);
  assert.equal(phaseTwo.phase, 2);
  assert.ok(phaseTwo.crouch > phaseOne.crouch);
  assert.ok(phaseTwo.forward > phaseOne.forward);
  assert.ok(Math.abs(phaseTwo.yaw) > Math.abs(phaseOne.yaw));
  assert.ok(phaseTwo.enemyScale > phaseOne.enemyScale);
  assert.ok(phaseTwo.trailScale > phaseOne.trailScale);
});

test('left and right signatures mirror their lateral body commitment', () => {
  const right = bossSignatureFrame(boss(), 1);
  const left = bossSignatureFrame(boss(), 3);
  assert.equal(right.yaw, -left.yaw);
  assert.equal(right.roll, -left.roll);
});

test('recovery releases the forward pressure rather than adding a new attack cue', () => {
  const frame = bossSignatureFrame(boss({ phase: 'recovery', phaseProgress: 0.25, attack: { heavy: false } }), 0);
  assert.ok(frame.forward <= 0);
  assert.equal(frame.yaw, 0);
  assert.equal(frame.roll, 0);
});
