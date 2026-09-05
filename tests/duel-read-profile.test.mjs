import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  BLOOD_MOON_READ_PROFILE,
  DUEL_READ_PROFILES,
  duelReadProfileForEnemy,
} from '../src/duel-read-profile.js';

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

test('duel read profile stays presentation-only with no storage or network transport', async () => {
  const source = await readFile(new URL('../src/duel-read-profile.js', import.meta.url), 'utf8');
  for (const forbidden of ['localStorage', 'sessionStorage', 'indexedDB', 'fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket']) {
    assert.equal(source.includes(forbidden), false, `unexpected duel-read persistence/transport token: ${forbidden}`);
  }
  assert.match(source, /event\.type === 'stage-start'/);
  assert.match(source, /event\.type === 'telegraph'/);
  assert.match(source, /challengeActive === 'true'/);
});
