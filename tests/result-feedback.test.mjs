import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  buildBetaFeedbackPayload,
  deliverBetaFeedback,
} from '../src/result-feedback.js';

test('buildBetaFeedbackPayload makes a structured bug report from visible result data and strips query/hash', () => {
  const payload = buildBetaFeedbackPayload({
    kind: 'bug',
    topic: 'step',
    note: '下段 STEP 附近有時按唔到',
    eyebrow: 'ONI PRACTICE · MASTERY 82',
    title: 'A 級 · 修行完成',
    summary: '格擋 80% · 完美 3/7 · 受擊 2',
    score: '002400',
    url: 'https://example.test/?browser-smoke=feedback#debug',
  });

  assert.equal(payload.title, 'Blade Reversal｜刃返｜錯誤回報');
  assert.match(payload.text, /錯誤回報/);
  assert.match(payload.text, /範圍：STEP/);
  assert.match(payload.text, /A 級 · 修行完成/);
  assert.match(payload.text, /得分：002400/);
  assert.match(payload.text, /下段 STEP 附近有時按唔到/);
  assert.equal(payload.url, 'https://example.test/');
});

test('feedback topic is opt-in and unknown values are omitted', () => {
  assert.doesNotMatch(buildBetaFeedbackPayload({ topic: '' }).text, /範圍：/);
  assert.doesNotMatch(buildBetaFeedbackPayload({ topic: 'network' }).text, /範圍：/);
  assert.match(buildBetaFeedbackPayload({ topic: 'blade' }).text, /範圍：刀路/);
});

test('feedback notes are bounded before export', () => {
  const payload = buildBetaFeedbackPayload({ note: 'a'.repeat(900) });
  const note = payload.text.split('玩家補充：')[1];
  assert.equal(note.length, 800);
});

test('deliverBetaFeedback prefers explicit native share', async () => {
  let shared = null;
  let copied = false;
  const payload = buildBetaFeedbackPayload({ kind: 'feedback', note: '幾好玩' });
  const result = await deliverBetaFeedback(payload, {
    navigatorRef: {
      share: async (value) => { shared = value; },
      clipboard: { writeText: async () => { copied = true; } },
    },
  });

  assert.equal(result, 'shared');
  assert.deepEqual(shared, payload);
  assert.equal(copied, false);
});

test('deliverBetaFeedback falls back to local clipboard and cancellation remains a no-op', async () => {
  let copied = '';
  const payload = buildBetaFeedbackPayload({ kind: 'bug', note: 'test', url: 'https://example.test/' });
  const fallback = await deliverBetaFeedback(payload, {
    navigatorRef: {
      share: async () => { throw new TypeError('unsupported'); },
      clipboard: { writeText: async (value) => { copied = value; } },
    },
  });
  assert.equal(fallback, 'copied');
  assert.match(copied, /錯誤回報/);
  assert.match(copied, /https:\/\/example\.test\//);

  let cancellationCopied = false;
  const error = new Error('cancelled');
  error.name = 'AbortError';
  const cancelled = await deliverBetaFeedback(payload, {
    navigatorRef: {
      share: async () => { throw error; },
      clipboard: { writeText: async () => { cancellationCopied = true; } },
    },
  });
  assert.equal(cancelled, 'cancelled');
  assert.equal(cancellationCopied, false);
});

test('feedback module has no automatic upload transport or persistence', async () => {
  const source = await readFile(new URL('../src/result-feedback.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /XMLHttpRequest|sendBeacon|WebSocket/);
  assert.doesNotMatch(source, /localStorage|sessionStorage/);
});
