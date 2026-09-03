import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { BETA_READINESS_ITEMS, BETA_READINESS_PRIVACY } from '../src/beta-readiness.js';

test('Closed Beta readiness guide keeps a bounded three-step tester flow', () => {
  assert.deepEqual(BETA_READINESS_ITEMS.map((item) => item.id), ['duel', 'repeat-practice', 'feedback']);
  assert.match(BETA_READINESS_ITEMS[0].copy, /四向格擋/);
  assert.match(BETA_READINESS_ITEMS[1].copy, /修行進度/);
  assert.match(BETA_READINESS_ITEMS[2].copy, /回報/);
  assert.match(BETA_READINESS_PRIVACY, /唔會自動上傳/);
  assert.match(BETA_READINESS_PRIVACY, /冇登入/);
  assert.match(BETA_READINESS_PRIVACY, /背景遙測/);
});

test('Closed Beta readiness module introduces no persistence or network transport', async () => {
  const source = await readFile(new URL('../src/beta-readiness.js', import.meta.url), 'utf8');
  for (const forbidden of ['localStorage', 'sessionStorage', 'fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket']) {
    assert.equal(source.includes(forbidden), false, `unexpected release-prep transport/storage token: ${forbidden}`);
  }
});
