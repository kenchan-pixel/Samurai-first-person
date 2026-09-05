import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  BLOOD_MOON_READ_PROFILE,
  DUEL_READ_PROFILES,
  duelPracticeFocusForStageStart,
  duelReadProfileForEnemy,
} from '../src/duel-read-profile.js';
import {
  buildPracticeFocusCoach,
  buildPracticeSnapshot,
} from '../src/practice-progress.js';

test('duel read profiles cover the four approved campaign archetypes', () => {
  assert.equal(duelReadProfileForEnemy('ashigaru-scout'), DUEL_READ_PROFILES['ashigaru-scout']);
  assert.equal(duelReadProfileForEnemy('wandering-ronin')?.id, 'ronin');
  assert.equal(duelReadProfileForEnemy('oni-guard')?.id, 'oni');
  assert.equal(duelReadProfileForEnemy('crimson-shogun')?.id, 'shogun');
  assert.equal(duelReadProfileForEnemy('unknown-enemy'), null);
});

test('direct Blood Moon practice gets a distinct truthful pressure profile', () => {
  const profile = duelReadProfileForEnemy('crimson-shogun', { bloodMoon: true });
  assert.equal(profile, BLOOD_MOON_READ_PROFILE);
  assert.match(profile.tell, /節奏更緊/);
  assert.match(profile.tell, /假動作/);
  assert.match(profile.tell, /重斬/);
  assert.match(profile.response, /最後變向/);
});

test('same-route practice retry carries the prior weak direction into stage intro', () => {
  const root = {
    dataset: {
      practiceProgressRoute: 'enemy:wandering-ronin',
      practiceProgressFocusState: 'target',
      practiceProgressFocusDirection: 'right',
    },
  };
  const focus = duelPracticeFocusForStageStart({
    practice: true,
    enemyId: 'wandering-ronin',
  }, root);

  assert.equal(focus?.state, 'target');
  assert.equal(focus?.direction, 'right');
  assert.equal(focus?.label, '右方');
  assert.match(focus?.text || '', /今局修行 · 右方/);
  assert.match(focus?.text || '', /先守穩再反擊/);
});

test('practice retry focus is route-isolated and never leaks into campaign', () => {
  const root = {
    dataset: {
      practiceProgressRoute: 'enemy:wandering-ronin',
      practiceProgressFocusState: 'target',
      practiceProgressFocusDirection: 'top',
    },
  };

  assert.equal(duelPracticeFocusForStageStart({ practice: true, enemyId: 'oni-guard' }, root), null);
  assert.equal(duelPracticeFocusForStageStart({ practice: false, enemyId: 'wandering-ronin' }, root), null);
});

test('all-observed-clean practice never claims four directions when some directions were unseen', () => {
  const snapshot = buildPracticeSnapshot({
    stages: [{
      hitsTaken: 0,
      counterOpenings: 2,
      counters: 2,
      directionReads: {
        top: { faced: 1, defended: 1, hits: 0 },
        right: { faced: 0, defended: 0, hits: 0 },
        bottom: { faced: 0, defended: 0, hits: 0 },
        left: { faced: 1, defended: 1, hits: 0 },
      },
    }],
  });
  const coach = buildPracticeFocusCoach(null, snapshot);
  assert.equal(coach?.allObservedPerfect, true);

  const root = {
    dataset: {
      practiceProgressRoute: 'mode:blood-moon-practice',
      practiceProgressFocusState: coach?.allObservedPerfect ? 'clear' : 'target',
      practiceProgressFocusDirection: coach?.nextDirection || '',
    },
  };
  const focus = duelPracticeFocusForStageStart({
    practice: true,
    practiceMode: 'blood-moon-practice',
    practiceEnemyId: 'crimson-shogun',
  }, root);

  assert.equal(focus?.state, 'clear');
  assert.equal(focus?.direction, null);
  assert.match(focus?.text || '', /已見刀路守穩/);
  assert.doesNotMatch(focus?.text || '', /四向守穩/);
  assert.match(focus?.text || '', /Perfect/);
});

test('duel read profile stays presentation-only with no storage or network transport', async () => {
  const source = await readFile(new URL('../src/duel-read-profile.js', import.meta.url), 'utf8');
  for (const forbidden of ['localStorage', 'sessionStorage', 'indexedDB', 'fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket']) {
    assert.equal(source.includes(forbidden), false, `unexpected duel-read persistence/transport token: ${forbidden}`);
  }
  assert.match(source, /event\.type === 'stage-start'/);
  assert.match(source, /event\.type === 'telegraph'/);
  assert.match(source, /challengeActive === 'true'/);
  assert.match(source, /practiceProgressRoute/);
});
