import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { enemyPosturePresenceFrame } from '../src/enemy-posture-presence.js';

const gap = (posture, max = 5) => ({ phase: 'gap', phaseProgress: 0.4, enemyPosture: posture, enemyPostureMax: max, attack: null });

test('enemy posture presence stays neutral without posture pressure', () => {
  const frame = enemyPosturePresenceFrame(gap(0), 1000, {});
  assert.equal(frame.active, false);
  assert.equal(frame.ratio, 0);
  assert.equal(frame.retreat, 0);
  assert.equal(frame.drop, 0);
});

test('higher posture produces a stronger bounded physical retreat', () => {
  const low = enemyPosturePresenceFrame(gap(2), 1000, {});
  const high = enemyPosturePresenceFrame(gap(4), 1000, {});
  assert.equal(low.active, true);
  assert.equal(high.active, true);
  assert.ok(high.retreat > low.retreat && high.drop > low.drop && high.pitch > low.pitch);
  assert.ok(high.retreat < 0.15 && high.drop < 0.06 && high.pitch < 5);
});

test('guard break reads stronger during recovery but remains bounded', () => {
  const pressured = enemyPosturePresenceFrame({ phase: 'recovery', phaseProgress: 0.2, enemyPosture: 4, enemyPostureMax: 5, attack: { guardBroken: false } }, 1200, {});
  const broken = enemyPosturePresenceFrame({ phase: 'recovery', phaseProgress: 0.2, enemyPosture: 5, enemyPostureMax: 5, attack: { guardBroken: true } }, 1200, {});
  assert.ok(broken.retreat > pressured.retreat);
  assert.ok(broken.pitch > pressured.pitch);
  assert.ok(broken.retreat < 0.15 && broken.drop < 0.06 && broken.pitch < 8);
});

test('live telegraph and strike suppress posture offsets to protect blade direction reads', () => {
  for (const phase of ['telegraph', 'strike']) {
    const frame = enemyPosturePresenceFrame({ phase, phaseProgress: 0.5, enemyPosture: 5, enemyPostureMax: 5, attack: { guardBroken: true } }, 1400, {});
    assert.equal(frame.active, false);
    assert.equal(frame.retreat, 0);
    assert.equal(frame.drop, 0);
    assert.equal(frame.pitch, 0);
    assert.equal(frame.roll, 0);
  }
});

test('posture presence is presentation-only and adds no storage or transport path', async () => {
  const source = await readFile(new URL('../src/enemy-posture-presence.js', import.meta.url), 'utf8');
  for (const forbidden of ['localStorage', 'sessionStorage', 'indexedDB', 'fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket']) {
    assert.equal(source.includes(forbidden), false, `unexpected persistence/transport reference: ${forbidden}`);
  }
  assert.equal(source.includes('enemyPosture ='), false);
  assert.equal(source.includes('enemyPostureMax ='), false);
});
