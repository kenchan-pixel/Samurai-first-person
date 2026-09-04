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

test('all four directions return cleanly to the base grip at action completion', () => {
  for (let direction = 0; direction < 4; direction += 1) {
    const pose = playerWeaponPose(1, direction, 1);
    assert.deepEqual(pose.handRPosition, [...PLAYER_WEAPON_BASE_POSE.handRPosition]);
    assert.deepEqual(pose.handLPosition, [...PLAYER_WEAPON_BASE_POSE.handLPosition]);
    assert.deepEqual(pose.forearmRPosition, [...PLAYER_WEAPON_BASE_POSE.forearmRPosition]);
    assertFiniteBoundedPose(pose);
  }
});
