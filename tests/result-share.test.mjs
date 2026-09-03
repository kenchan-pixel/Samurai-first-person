import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildResultSharePayload,
  deliverResultShare,
} from '../src/result-share.js';

test('buildResultSharePayload keeps the visible result and strips query/hash from the shared URL', () => {
  const payload = buildResultSharePayload({
    eyebrow: '連戰試煉 · MASTERY 94',
    title: 'S 級 · 八關制霸',
    summary: '格擋 92% · 完美 7/12 · 受擊 1',
    score: '004200',
    challengeProgress: '連戰 8/8 · 制霸',
    url: 'https://example.test/?browser-smoke=result-share#debug',
  });

  assert.equal(payload.title, 'Blade Reversal｜刃返');
  assert.match(payload.text, /S 級 · 八關制霸/);
  assert.match(payload.text, /連戰 8\/8 · 制霸/);
  assert.match(payload.text, /得分 004200/);
  assert.match(payload.text, /格擋 92%/);
  assert.equal(payload.url, 'https://example.test/');
});

test('deliverResultShare prefers native share and does not touch clipboard after success', async () => {
  let shared = null;
  let copied = null;
  const payload = buildResultSharePayload({ title: 'A 級', score: '001200', url: 'https://example.test/' });
  const result = await deliverResultShare(payload, {
    navigatorRef: {
      share: async (value) => { shared = value; },
      clipboard: { writeText: async (value) => { copied = value; } },
    },
  });

  assert.equal(result, 'shared');
  assert.deepEqual(shared, payload);
  assert.equal(copied, null);
});

test('deliverResultShare falls back to clipboard after a non-cancel native-share failure', async () => {
  let copied = '';
  const payload = buildResultSharePayload({ title: 'B 級', score: '000900', url: 'https://example.test/' });
  const result = await deliverResultShare(payload, {
    navigatorRef: {
      share: async () => { throw new TypeError('share unavailable'); },
      clipboard: { writeText: async (value) => { copied = value; } },
    },
  });

  assert.equal(result, 'copied');
  assert.match(copied, /得分 000900/);
  assert.match(copied, /https:\/\/example\.test\//);
});

test('deliverResultShare treats native share cancellation as a clean no-op', async () => {
  let copied = false;
  const error = new Error('cancelled');
  error.name = 'AbortError';
  const result = await deliverResultShare(buildResultSharePayload({ title: '敗北' }), {
    navigatorRef: {
      share: async () => { throw error; },
      clipboard: { writeText: async () => { copied = true; } },
    },
  });

  assert.equal(result, 'cancelled');
  assert.equal(copied, false);
});
