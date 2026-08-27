import test from 'node:test';
import assert from 'node:assert/strict';

import {
  adaptiveRenderScale,
  enemyMotionFrame,
  motionPhaseForSnapshot,
  smoothMotionFrame,
} from '../src/animation-motion.js';

test('renderer motion phase uses authoritative parry state rather than stale visual pose', () => {
  assert.equal(motionPhaseForSnapshot({ phase: 'recovery', attack: { parried: false } }), 'recovery');
  assert.equal(motionPhaseForSnapshot({ phase: 'recovery', attack: { parried: true } }), 'recovery-interrupted');
  assert.equal(motionPhaseForSnapshot({ phase: 'strike', attack: { parried: false } }), 'strike');
});

test('normal attack phase boundaries preserve sword/body pose continuity', () => {
  const teleEnd = enemyMotionFrame('telegraph', 1, {});
  const strikeStart = enemyMotionFrame('strike', 0, {});
  assert.equal(teleEnd.sword, strikeStart.sword);
  assert.equal(teleEnd.wind, strikeStart.wind);

  const strikeEnd = enemyMotionFrame('strike', 1, {});
  const recoveryStart = enemyMotionFrame('recovery', 0, {});
  assert.equal(strikeEnd.sword, recoveryStart.sword);
  assert.equal(strikeEnd.follow, recoveryStart.follow);

  const recoveryEnd = enemyMotionFrame('recovery', 1, {});
  const idle = enemyMotionFrame('gap', 0, {});
  assert.equal(recoveryEnd.sword, idle.sword);
  assert.equal(recoveryEnd.follow, idle.follow);
  assert.equal(recoveryEnd.settle, idle.settle);
});

test('strike exposes distinct swing impact and follow-through beats', () => {
  const early = enemyMotionFrame('strike', 0.18, {});
  const impact = enemyMotionFrame('strike', 0.56, {});
  const late = enemyMotionFrame('strike', 0.9, {});
  assert.ok(early.wind > 0);
  assert.ok(impact.impact > 0.95);
  assert.ok(impact.trail > 0.7);
  assert.ok(late.follow > impact.follow);
  assert.ok(late.sword > impact.sword);
});

test('normal strike frames track the exact elapsed-time pose without EMA lag', () => {
  const current = enemyMotionFrame('strike', 0.32, {});
  const target = enemyMotionFrame('strike', 0.50, {});
  smoothMotionFrame(current, target, 33.34, 82, current);
  assert.deepEqual(current, target);
});

test('normal phase boundaries do not add a second animation delay', () => {
  const current = enemyMotionFrame('telegraph', 1, {});
  const target = enemyMotionFrame('strike', 0.12, {});
  smoothMotionFrame(current, target, 16.67, 82, current);
  assert.deepEqual(current, target);
});

test('dropped-frame natural recovery catches up immediately from an early strike pose', () => {
  const current = enemyMotionFrame('strike', 0.34, {});
  const target = enemyMotionFrame('recovery', 0.08, {});
  smoothMotionFrame(current, target, 50, 82, current);
  assert.deepEqual(current, target);
});

test('explicit parry recovery from the same early strike pose remains damped', () => {
  const current = enemyMotionFrame('strike', 0.34, {});
  const target = enemyMotionFrame('recovery-interrupted', 0.08, {});
  const before = current.sword;

  assert.equal(target.phase, 'recovery');
  assert.equal(target.interruptedRecovery, true);
  smoothMotionFrame(current, target, 16.67, 82, current);
  assert.equal(current.phase, 'strike');
  assert.equal(current.interruptedRecovery, true);
  assert.ok(current.sword > before);
  assert.ok(current.sword < target.sword);

  const afterOne = current.sword;
  smoothMotionFrame(current, target, 16.67, 82, current);
  assert.ok(current.sword > afterOne);
  assert.ok(current.sword < target.sword);
});

test('natural strike end can enter recovery directly because its visible pose already matches', () => {
  const current = enemyMotionFrame('strike', 1, {});
  const target = enemyMotionFrame('recovery', 0, {});
  smoothMotionFrame(current, target, 16.67, 82, current);
  assert.deepEqual(current, target);
});

test('motion helpers reuse caller-owned output objects', () => {
  const target = {};
  assert.equal(enemyMotionFrame('telegraph', 0.5, target), target);
  const current = enemyMotionFrame('ready', 0, {});
  assert.equal(smoothMotionFrame(current, target, 16.67, 72, current), current);
});

test('adaptive render scale drops under sustained slow frames and recovers conservatively', () => {
  assert.equal(adaptiveRenderScale({ current: 1.45, min: 1, max: 1.6, frameEmaMs: 21 }), 1.35);
  assert.equal(adaptiveRenderScale({ current: 1.35, min: 1, max: 1.6, frameEmaMs: 16 }), 1.4);
  assert.equal(adaptiveRenderScale({ current: 1.35, min: 1, max: 1.6, frameEmaMs: 18 }), 1.35);
});
