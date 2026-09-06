import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { enemyParryRecoilFrame } from '../src/enemy-parry-recoil.js';

const recovery = (overrides = {}) => {
  const { attack = {}, ...state } = overrides;
  return {
    phase: 'recovery',
    phaseProgress: 0.12,
    ...state,
    attack: {
      direction: 'right',
      parried: true,
      perfect: false,
      guardBroken: false,
      counterUsed: false,
      ...attack,
    },
  };
};

test('parry recoil activates only in the pre-counter recovery window', () => {
  const live = enemyParryRecoilFrame(recovery());
  assert.equal(live.active, true);
  assert.ok(live.retreat > 0.04);
  assert.ok(live.lateral < 0);

  assert.equal(enemyParryRecoilFrame(recovery({ phase: 'telegraph' })).active, false);
  assert.equal(enemyParryRecoilFrame(recovery({ phase: 'strike' })).active, false);
  assert.equal(enemyParryRecoilFrame(recovery({ phaseProgress: 0.9 })).active, false);
  assert.equal(enemyParryRecoilFrame(recovery({ attack: { counterUsed: true } })).active, false);
});

test('perfect and guard-break reactions escalate without changing the phase envelope', () => {
  const normal = enemyParryRecoilFrame(recovery());
  const perfect = enemyParryRecoilFrame(recovery({ attack: { perfect: true } }));
  const broken = enemyParryRecoilFrame(recovery({ attack: { perfect: true, guardBroken: true } }));
  assert.ok(perfect.retreat > normal.retreat);
  assert.ok(broken.retreat > perfect.retreat);
  assert.ok(broken.retreat < 0.21);
  assert.ok(Math.abs(broken.yaw) < 12);
  assert.ok(Math.abs(broken.roll) < 10);
  assert.ok(broken.drop < 0.08);
});

test('horizontal attack directions mirror only the whole-body reaction', () => {
  const right = enemyParryRecoilFrame(recovery({ attack: { direction: 'right' } }));
  const left = enemyParryRecoilFrame(recovery({ attack: { direction: 'left' } }));
  assert.ok(right.lateral < 0 && left.lateral > 0);
  assert.equal(Math.abs(right.lateral), Math.abs(left.lateral));
  assert.equal(right.yaw, -left.yaw);
  assert.equal(right.roll, -left.roll);
});

test('reaction is presentation-only and contains no persistence, transport or timer APIs', async () => {
  const source = await readFile(new URL('../src/enemy-parry-recoil.js', import.meta.url), 'utf8');
  for (const forbidden of ['localStorage', 'sessionStorage', 'indexedDB', 'fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket', 'setTimeout', 'setInterval', 'requestAnimationFrame']) {
    assert.equal(source.includes(forbidden), false, `unexpected ${forbidden}`);
  }
});
