import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  formatPracticeSessionRecord,
  updatePracticeSessionRecord,
} from '../src/practice-session-record.js';

test('practice session record establishes one route-local baseline without claiming a refresh', () => {
  const record = updatePracticeSessionRecord(null, {
    defensePct: 50,
    hitsTaken: 2,
    counterPct: null,
  });

  assert.equal(record.attempts, 1);
  assert.equal(record.bestDefensePct, 50);
  assert.equal(record.fewestHitsTaken, 2);
  assert.equal(record.bestCounterPct, null);
  assert.deepEqual(record.refreshed, []);
  assert.equal(
    formatPracticeSessionRecord(record),
    '本次修行 · 1局｜最佳 防守 50% · 受擊 2 · 反擊 —',
  );
});

test('practice session record keeps independent metric bests and names only strict current-run refreshes', () => {
  const first = updatePracticeSessionRecord(null, {
    defensePct: 50,
    hitsTaken: 2,
    counterPct: 50,
  });
  const second = updatePracticeSessionRecord(first, {
    defensePct: 75,
    hitsTaken: 3,
    counterPct: 100,
  });
  const third = updatePracticeSessionRecord(second, {
    defensePct: 75,
    hitsTaken: 1,
    counterPct: 80,
  });

  assert.deepEqual(second.refreshed, ['防守', '反擊']);
  assert.equal(second.bestDefensePct, 75);
  assert.equal(second.fewestHitsTaken, 2);
  assert.equal(second.bestCounterPct, 100);
  assert.deepEqual(third.refreshed, ['受擊']);
  assert.equal(third.attempts, 3);
  assert.equal(third.bestDefensePct, 75);
  assert.equal(third.fewestHitsTaken, 1);
  assert.equal(third.bestCounterPct, 100);
  assert.equal(
    formatPracticeSessionRecord(third),
    '本次修行 · 3局｜最佳 防守 75% · 受擊 1 · 反擊 100%｜今局刷新 受擊',
  );
});

test('practice session record stays session-only with no storage or transport surface', async () => {
  const source = await readFile(new URL('../src/practice-session-record.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|fetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/);
});
