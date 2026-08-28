import assert from 'node:assert/strict';
import test from 'node:test';
import { STRIKE_CONTACT, enemyAttackChoreographyFrame, enemyAttackDescriptor } from '../src/enemy-attack-choreography.js';

const near = (a, b, eps = 1e-7) => Math.abs(a - b) <= eps;
const near3 = (a, b, eps = 1e-7) => a.every((value, i) => near(value, b[i], eps));

test('four attacks expose distinct physical blade reads toward player plane', () => {
  const attacks = [0, 1, 2, 3].map(enemyAttackDescriptor);
  assert.equal(new Set(attacks.map((attack) => attack.id)).size, 4);
  for (const attack of attacks) assert.ok(attack.blade.contact[2] > 0.94);
  assert.ok(attacks[0].blade.wind[1] > 0.95 && attacks[0].blade.follow[1] < -0.85);
  assert.ok(attacks[2].blade.wind[1] < -0.90 && attacks[2].blade.follow[1] > 0.90);
  assert.ok(attacks[1].blade.wind[0] > 0.80 && attacks[1].blade.follow[0] < -0.85);
  assert.ok(attacks[3].blade.wind[0] < -0.80 && attacks[3].blade.follow[0] > 0.85);
});

test('rising cut starts low then drives body and hands upward through contact', () => {
  const low = enemyAttackChoreographyFrame('telegraph', 1, 2);
  const contact = enemyAttackChoreographyFrame('strike', STRIKE_CONTACT, 2);
  const follow = enemyAttackChoreographyFrame('strike', 1, 2);
  assert.equal(low.id, 'rising-cut');
  assert.ok(low.modelY < -0.14);
  assert.ok(contact.modelY > low.modelY + 0.08);
  assert.ok(follow.modelY > contact.modelY);
  assert.ok(low.joints.UpperArmR[0] > 20);
  assert.ok(contact.joints.UpperArmR[0] < -18);
  assert.ok(follow.blade.follow[1] > 0.9);
});

test('side cuts mirror their body and blade commitments', () => {
  const right = enemyAttackChoreographyFrame('strike', STRIKE_CONTACT, 1);
  const left = enemyAttackChoreographyFrame('strike', STRIKE_CONTACT, 3);
  assert.ok(near(right.blade.wind[0], -left.blade.wind[0]));
  assert.ok(near(right.blade.follow[0], -left.blade.follow[0]));
  assert.ok(near(right.joints.Chest[1], -left.joints.Chest[1]));
  assert.ok(near(right.joints.Chest[2], -left.joints.Chest[2]));
});

test('phase boundaries preserve the same joint pose without visual snapping', () => {
  for (let direction = 0; direction < 4; direction += 1) {
    const wind = enemyAttackChoreographyFrame('telegraph', 1, direction);
    const strikeStart = enemyAttackChoreographyFrame('strike', 0, direction);
    const strikeEnd = enemyAttackChoreographyFrame('strike', 1, direction);
    const recoveryStart = enemyAttackChoreographyFrame('recovery', 0, direction);
    for (const joint of Object.keys(wind.joints)) {
      assert.ok(near3(wind.joints[joint], strikeStart.joints[joint]));
      assert.ok(near3(strikeEnd.joints[joint], recoveryStart.joints[joint]));
    }
    assert.ok(near(wind.modelY, strikeStart.modelY));
    assert.ok(near(strikeEnd.modelY, recoveryStart.modelY));
  }
});
