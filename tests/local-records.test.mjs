import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  formatLocalPersonalRecords,
  localRecordNextStep,
  readLocalPersonalRecords,
} from '../src/local-records.js';

function storageFrom(entries = {}) {
  const values = new Map(Object.entries(entries));
  return {
    getItem(key) { return values.get(key) ?? null; },
    setItem() { throw new Error('local records must stay read-only'); },
  };
}

test('local personal records reuse and normalise existing campaign/challenge bests', () => {
  const storage = storageFrom({
    'blade-reversal-mastery-v1': JSON.stringify({ grade: 'A', masteryPoints: 82.4, score: 4200.2 }),
    'blade-reversal-challenge-v1': JSON.stringify({ won: false, wavesCleared: 5.8, score: 6800.1 }),
  });
  const records = readLocalPersonalRecords(storage);
  assert.deepEqual(records.campaign, { grade: 'A', masteryPoints: 82, score: 4200 });
  assert.deepEqual(records.challenge, { won: false, wavesCleared: 5, score: 6800 });
  assert.deepEqual(formatLocalPersonalRecords(records), {
    campaign: 'A級 · MASTERY 82 · 004200',
    challenge: '連戰 5/8 · 006800',
    next: '下一步：重練卡住你嘅對手，再挑戰連戰 6/8。',
  });
});

test('local record next step stays bounded to existing local progress', () => {
  assert.match(localRecordNextStep({ campaign: null, challenge: null }), /完整主線/);
  assert.match(localRecordNextStep({ campaign: { masteryPoints: 60 }, challenge: null }), /指定修行/);
  assert.match(localRecordNextStep({ campaign: { masteryPoints: 78 }, challenge: null }), /試一次連戰/);
  assert.match(localRecordNextStep({ campaign: { masteryPoints: 90 }, challenge: { wavesCleared: 8 } }), /刷新主線或連戰分數/);
});

test('local records module guards storage acquisition and has no write/network transport', async () => {
  const source = await readFile(new URL('../src/local-records.js', import.meta.url), 'utf8');
  assert.equal(/storage\s*=\s*globalThis\.localStorage/.test(source), false, 'localStorage must not be resolved in a default parameter');
  assert.match(source, /try\s*\{\s*return globalThis\.localStorage \?\? null;\s*\}\s*catch\s*\{/s);
  for (const forbidden of ['setItem(', 'fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket']) {
    assert.equal(source.includes(forbidden), false, `unexpected local-record write/transport token: ${forbidden}`);
  }
});
