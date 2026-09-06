import test from 'node:test';
import assert from 'node:assert/strict';
import { recommendationFromFocusLabel } from '../src/training-recommendation.js';

test('training recommendation maps campaign analysis focus to the existing practice routes', () => {
  assert.deepEqual(recommendationFromFocusLabel('第1關 · 足輕'), {
    stage: 1,
    focusLabel: '第1關 · 足輕',
    actionLabel: '重練第一關',
    practiceMode: null,
  });
  assert.deepEqual(recommendationFromFocusLabel('第2關 · 浪人'), {
    stage: 2,
    focusLabel: '第2關 · 浪人',
    actionLabel: '練浪人',
    practiceMode: 'ronin-practice',
  });
  assert.deepEqual(recommendationFromFocusLabel('第3關 · 鬼武者'), {
    stage: 3,
    focusLabel: '第3關 · 鬼武者',
    actionLabel: '練鬼',
    practiceMode: 'oni-practice',
  });
  assert.deepEqual(recommendationFromFocusLabel('第4關 · 赤將軍'), {
    stage: 4,
    focusLabel: '第4關 · 赤將軍',
    actionLabel: '練將軍',
    practiceMode: 'shogun-practice',
  });
  assert.equal(recommendationFromFocusLabel('今局'), null);
  assert.equal(recommendationFromFocusLabel('第8關 · 赤將軍'), null);
});
