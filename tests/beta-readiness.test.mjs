import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  BETA_READINESS_ITEMS,
  BETA_READINESS_PRIVACY,
  betaReadinessNextTestAction,
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

test('result next-test action closes the canonical duel → repeat practice → feedback loop through existing controls', () => {
  assert.deepEqual(betaReadinessNextTestAction({
    completed: ['duel'],
    runMode: 'campaign',
    resultVisible: true,
  }), {
    visible: true,
    id: 'repeat-practice',
    label: '下一步 · 修行',
    ariaLabel: 'Closed Beta 下一步：開始浪人修行，之後再練同一對手一次',
    targetId: 'practice-ronin-button',
    done: false,
  });

  assert.deepEqual(betaReadinessNextTestAction({
    completed: ['duel'],
    runMode: 'ronin-practice',
    resultVisible: true,
  }), {
    visible: true,
    id: 'repeat-practice',
    label: '下一步 · 再練',
    ariaLabel: 'Closed Beta 下一步：再練同一對手一次，完成修行進度比較',
    targetId: 'restart-button',
    done: false,
  });

  assert.deepEqual(betaReadinessNextTestAction({
    completed: ['duel', 'repeat-practice'],
    runMode: 'shogun-practice',
    resultVisible: true,
  }), {
    visible: true,
    id: 'feedback',
    label: '下一步 · 回報',
    ariaLabel: 'Closed Beta 下一步：用今局結果開啟體驗意見或錯誤回報',
    targetId: 'result-feedback-button',
    done: false,
  });

  assert.deepEqual(betaReadinessNextTestAction({
    completed: ['duel', 'repeat-practice', 'feedback'],
    runMode: 'campaign',
    resultVisible: true,
  }), {
    visible: true,
    id: 'done',
    label: '封測 3/3 ✓',
    ariaLabel: 'Closed Beta 本次封測流程已完成 3 / 3',
    targetId: null,
    done: true,
  });
});

test('next-test action stays out of hidden results and challenge routes', () => {
  assert.equal(betaReadinessNextTestAction({ completed: ['duel'], resultVisible: false }).visible, false);
  assert.equal(betaReadinessNextTestAction({ completed: ['duel'], runMode: 'challenge', resultVisible: true }).visible, false);
  assert.equal(betaReadinessNextTestAction({ completed: ['duel'], runMode: 'daily-challenge', resultVisible: true }).visible, false);
});

test('Closed Beta readiness module introduces no persistence or network transport', async () => {
  const source = await readFile(new URL('../src/beta-readiness.js', import.meta.url), 'utf8');
  for (const forbidden of ['localStorage', 'sessionStorage', 'fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket']) {
    assert.equal(source.includes(forbidden), false, `unexpected release-prep transport/storage token: ${forbidden}`);
  }
  assert.match(source, /practiceProgressState === 'comparison'/);
  assert.match(source, /resultFeedbackLast === 'shared'/);
  assert.match(source, /resultFeedbackLast === 'copied'/);
  assert.match(source, /practice-ronin-button/);
  assert.match(source, /result-feedback-button/);
  assert.match(source, /min-height:44px/);
  assert.match(source, /modal--visible/);
});
