import test from 'node:test';
import assert from 'node:assert/strict';
import { PLAYER_WEAPON_BASE_POSE, playerWeaponPose } from '../src/player-weapon-pose.js';

const mid = 0.5;

function assertFiniteBoundedPose(pose) {
  for (const [key, values] of Object.entries(pose)) {
    if (!Array.isArray(values)) continue;
    for (const value of values) {
      assert.equal(Number.isFinite(value), true, `${key} contains a non-finite value`);
      if (key.endsWith('Position')) assert.ok(Math.abs(value) < 1, `${key} escaped the compact foreground position budget`);
      if (key.endsWith('Euler')) assert.ok(Math.abs(value) < 90, `${key} escaped the bounded joint rotation budget`);
    }
  }
}

test('neutral first-person grip returns the established two-hand base pose', () => {
  const pose = playerWeaponPose(0, 0, mid);
  assert.deepEqual(pose.forearmRPosition, [...PLAYER_WEAPON_BASE_POSE.forearmRPosition]);
  assert.deepEqual(pose.forearmLPosition, [...PLAYER_WEAPON_BASE_POSE.forearmLPosition]);
  assert.deepEqual(pose.handRPosition, [...PLAYER_WEAPON_BASE_POSE.handRPosition]);
  assert.deepEqual(pose.handLPosition, [...PLAYER_WEAPON_BASE_POSE.handLPosition]);
  assert.deepEqual(pose.rigFramingOffset, [0, 0, 0]);
  assertFiniteBoundedPose(pose);
});

test('top and bottom parries visibly brace the complete support silhouette vertically', () => {
  const top = playerWeaponPose(1, 0, mid);
  const bottom = playerWeaponPose(1, 2, mid);
  assert.ok(top.handRPosition[1] > PLAYER_WEAPON_BASE_POSE.handRPosition[1] + 0.04);
  assert.ok(top.handLPosition[1] > PLAYER_WEAPON_BASE_POSE.handLPosition[1] + 0.03);
  assert.ok(bottom.handRPosition[1] < PLAYER_WEAPON_BASE_POSE.handRPosition[1] - 0.04);
  assert.ok(bottom.handLPosition[1] < PLAYER_WEAPON_BASE_POSE.handLPosition[1] - 0.03);
  assert.ok(top.forearmREuler[0] > bottom.forearmREuler[0] + 10);
  assertFiniteBoundedPose(top);
  assertFiniteBoundedPose(bottom);
});

test('right and left parries mirror the two-hand support shift without changing direction semantics', () => {
  const right = playerWeaponPose(1, 1, mid);
  const left = playerWeaponPose(1, 3, mid);
  assert.ok(right.handRPosition[0] > PLAYER_WEAPON_BASE_POSE.handRPosition[0] + 0.025);
  assert.ok(left.handRPosition[0] < PLAYER_WEAPON_BASE_POSE.handRPosition[0] - 0.025);
  assert.ok(right.forearmREuler[1] > 10);
  assert.ok(left.forearmREuler[1] < -10);
  assert.ok(right.handREuler[1] > 7);
  assert.ok(left.handREuler[1] < -7);
  assertFiniteBoundedPose(right);
  assertFiniteBoundedPose(left);
});

test('Perfect Parry strengthens the same directional brace and counter stays bounded', () => {
  const parry = playerWeaponPose(1, 1, mid);
  const perfect = playerWeaponPose(2, 1, mid);
  const counter = playerWeaponPose(3, 3, mid);
  assert.ok(perfect.handRPosition[0] > parry.handRPosition[0]);
  assert.ok(Math.abs(perfect.forearmREuler[1]) > Math.abs(parry.forearmREuler[1]));
  assert.ok(counter.forearmREuler[0] > parry.forearmREuler[0]);
  assert.equal(counter.direction, 3);
  assertFiniteBoundedPose(perfect);
  assertFiniteBoundedPose(counter);
});

test('portrait framing is pulse-shaped and limited to top/right parry and bottom counter', () => {
  const top = playerWeaponPose(1, 0, mid);
  const perfectTop = playerWeaponPose(2, 0, mid);
  const right = playerWeaponPose(1, 1, mid);
  const perfectRight = playerWeaponPose(2, 1, mid);
  const left = playerWeaponPose(1, 3, mid);
  const bottomCounter = playerWeaponPose(3, 2, mid);
  const rightCounter = playerWeaponPose(3, 1, mid);

  assert.deepEqual(top.rigFramingOffset, [-0.22, 0, 0]);
  assert.deepEqual(perfectTop.rigFramingOffset, [-0.22, 0, 0]);
  assert.deepEqual(right.rigFramingOffset, [-0.52, 0, 0]);
  assert.deepEqual(perfectRight.rigFramingOffset, [-0.52, 0, 0]);
  assert.deepEqual(left.rigFramingOffset, [0, 0, 0]);
  assert.deepEqual(bottomCounter.rigFramingOffset, [-0.30, 0.10, 0]);
  assert.deepEqual(rightCounter.rigFramingOffset, [0, 0, 0]);
  assert.deepEqual(playerWeaponPose(1, 1, 0).rigFramingOffset, [0, 0, 0]);
  assert.ok(Math.abs(playerWeaponPose(1, 1, 1).rigFramingOffset[0]) < 1e-12);
  assert.deepEqual(playerWeaponPose(3, 2, 0).rigFramingOffset, [0, 0, 0]);
  assert.ok(Math.abs(playerWeaponPose(3, 2, 1).rigFramingOffset[0]) < 1e-12);
  assert.ok(Math.abs(playerWeaponPose(3, 2, 1).rigFramingOffset[1]) < 1e-12);
});

test('bottom counter keeps the two-hand support below the handle while the rising blade owns the lane', () => {
  const bottomCounter = playerWeaponPose(3, 2, mid);
  const rightCounter = playerWeaponPose(3, 1, mid);

  for (const key of ['forearmRPosition', 'forearmLPosition', 'handRPosition', 'handLPosition', 'cuffRPosition', 'cuffLPosition']) {
    assert.ok(
      bottomCounter[key][1] < PLAYER_WEAPON_BASE_POSE[key][1] - 0.015,
      `${key} did not preserve the bounded downward BOTTOM-counter brace`,
    );
  }
  assert.equal(rightCounter.handRPosition[1], PLAYER_WEAPON_BASE_POSE.handRPosition[1]);
  assert.equal(rightCounter.handLPosition[1], PLAYER_WEAPON_BASE_POSE.handLPosition[1]);
  assert.ok(bottomCounter.forearmLPosition[1] >= -0.68);
  assertFiniteBoundedPose(bottomCounter);
});

test('all four directions return cleanly to the base grip at action completion', () => {
  for (let direction = 0; direction < 4; direction += 1) {
    const pose = playerWeaponPose(1, direction, 1);
    assert.deepEqual(pose.handRPosition, [...PLAYER_WEAPON_BASE_POSE.handRPosition]);
    assert.deepEqual(pose.handLPosition, [...PLAYER_WEAPON_BASE_POSE.handLPosition]);
    assert.deepEqual(pose.forearmRPosition, [...PLAYER_WEAPON_BASE_POSE.forearmRPosition]);
    assert.ok(Math.abs(pose.rigFramingOffset[0]) < 1e-12);
    assert.ok(Math.abs(pose.rigFramingOffset[1]) < 1e-12);
    assert.ok(Math.abs(pose.rigFramingOffset[2]) < 1e-12);
    assertFiniteBoundedPose(pose);
  }
});
