import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { enemyCounterReactionFrame } from '../src/enemy-counter-reaction.js';

const counterState = (overrides = {}) => {
  const { attack = {}, ...state } = overrides;
  return {
    phase: 'recovery',
    enemyHp: 4,
    ...state,
    attack: {
      direction: 'right',
      parried: true,
      perfect: false,
      guardBroken: false,
      counterUsed: true,
      ...attack,
    },
  };
};

const meta = (playerDirectionIndex = 1, hitAge = 0.12) => ({ playerDirectionIndex, hitAge });

test('manual counter reaction is bounded to an accepted counter impact window', () => {
  const live = enemyCounterReactionFrame(counterState(), meta());
  assert.equal(live.active, true);
  assert.ok(live.retreat > 0.05);

  assert.equal(enemyCounterReactionFrame(counterState({ attack: { counterUsed: false } }), meta()).active, false);
  assert.equal(enemyCounterReactionFrame(counterState({ phase: 'telegraph' }), meta()).active, false);
  assert.equal(enemyCounterReactionFrame(counterState(), meta(1, -0.1)).active, false);
  assert.equal(enemyCounterReactionFrame(counterState(), meta(1, 1)).active, false);
  assert.equal(enemyCounterReactionFrame(counterState(), { hitAge: 0.12 }).active, false);
});

test('horizontal swipe direction mirrors the whole-body counter response', () => {
  const right = enemyCounterReactionFrame(counterState(), meta(1));
  const left = enemyCounterReactionFrame(counterState(), meta(3));
  assert.ok(right.lateral > 0 && left.lateral < 0);
  assert.equal(Math.abs(right.lateral), Math.abs(left.lateral));
  assert.equal(right.yaw, -left.yaw);
  assert.equal(right.roll, -left.roll);
});

test('top and bottom counters produce distinct vertical body reads', () => {
  const top = enemyCounterReactionFrame(counterState(), meta(0));
  const bottom = enemyCounterReactionFrame(counterState(), meta(2));
  assert.ok(top.lift > 0 && top.drop === 0);
  assert.equal(bottom.lift, 0);
  assert.ok(bottom.drop > 0.025);
  assert.ok(top.pitch < 0 && bottom.pitch > 0);
});

test('guard break and final blow escalate the same bounded impact envelope', () => {
  const normal = enemyCounterReactionFrame(counterState(), meta());
  const broken = enemyCounterReactionFrame(counterState({ attack: { guardBroken: true } }), meta());
  const finisher = enemyCounterReactionFrame(counterState({ phase: 'stage-clear', enemyHp: 0, attack: { guardBroken: true } }), meta());
  assert.ok(broken.retreat > normal.retreat);
  assert.ok(finisher.retreat > broken.retreat);
  assert.ok(finisher.retreat < 0.18);
  assert.ok(Math.abs(finisher.yaw) < 12);
  assert.ok(Math.abs(finisher.roll) < 11);
  assert.ok(finisher.drop < 0.09);
});

test('reaction is presentation-only and contains no persistence, transport or timer APIs', async () => {
  const source = await readFile(new URL('../src/enemy-counter-reaction.js', import.meta.url), 'utf8');
  for (const forbidden of ['localStorage', 'sessionStorage', 'indexedDB', 'fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket', 'setTimeout', 'setInterval', 'requestAnimationFrame']) {
    assert.equal(source.includes(forbidden), false, `unexpected ${forbidden}`);
  }
});
