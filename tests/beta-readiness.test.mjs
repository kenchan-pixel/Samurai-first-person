import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  BETA_READINESS_ITEMS,
  BETA_READINESS_PRIVACY,
  betaReadinessProgress,
} from '../src/beta-readiness.js';

test('Closed Beta readiness guide keeps a bounded three-step tester flow', () => {
  assert.deepEqual(BETA_READINESS_ITEMS.map((item) => item.id), ['duel', 'repeat-practice', 'feedback']);
  assert.match(BETA_READINESS_ITEMS[0].copy, /四向格擋/);
  assert.match(BETA_READINESS_ITEMS[1].copy, /修行進度/);
  assert.match(BETA_READINESS_ITEMS[2].copy, /回報/);
  assert.match(BETA_READINESS_PRIVACY, /唔會自動上傳/);
  assert.match(BETA_READINESS_PRIVACY, /冇登入/);
  assert.match(BETA_READINESS_PRIVACY, /背景遙測/);
});

test('session progress counts only the canonical tester steps', () => {
  assert.deepEqual(betaReadinessProgress([]), {
    completedIds: [], completed: 0, total: 3, done: false,
  });
  assert.deepEqual(betaReadinessProgress(new Set(['duel', 'feedback', 'unknown'])), {
    completedIds: ['duel', 'feedback'], completed: 2, total: 3, done: false,
  });
  assert.equal(betaReadinessProgress(['duel', 'repeat-practice', 'feedback']).done, true);
});

test('Closed Beta readiness module introduces no persistence or network transport', async () => {
  const source = await readFile(new URL('../src/beta-readiness.js', import.meta.url), 'utf8');
  for (const forbidden of ['localStorage', 'sessionStorage', 'fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket']) {
    assert.equal(source.includes(forbidden), false, `unexpected release-prep transport/storage token: ${forbidden}`);
  }
  assert.match(source, /practiceProgressState === 'comparison'/);
  assert.match(source, /resultFeedbackLast === 'shared'/);
  assert.match(source, /resultFeedbackLast === 'copied'/);
  assert.match(source, /modal--visible/);
});
