import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHALLENGE_STORAGE_KEY,
  normaliseChallengeWaveScores,
  persistChallengeResult,
  readChallengeBest,
} from '../src/challenge-mode.js';
import { compareChallengePace } from '../src/challenge-rival.js';

function memoryStorage(initial = null) {
  const values = new Map();
  if (initial !== null) values.set(CHALLENGE_STORAGE_KEY, JSON.stringify(initial));
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
  };
}

test('challenge rival pace reports signed cumulative score delta', () => {
  assert.deepEqual(compareChallengePace(1250, 1000), {
    current: 1250,
    best: 1000,
    delta: 250,
    ahead: true,
  });
  assert.deepEqual(compareChallengePace(850, 1000), {
    current: 850,
    best: 1000,
    delta: -150,
    ahead: false,
  });
});

test('challenge best remains backward compatible when legacy records have no wave splits', () => {
  const storage = memoryStorage({ won: true, wavesCleared: 8, score: 4200 });
  assert.deepEqual(readChallengeBest(storage), {
    won: true,
    wavesCleared: 8,
    score: 4200,
  });
});

test('better challenge results persist monotonic per-wave rival splits in the existing best key', () => {
  const storage = memoryStorage({ won: false, wavesCleared: 5, score: 1500 });
  const result = {
    won: true,
    wavesCleared: 8,
    score: 3600,
    waveScores: [180, 420, 800, 1260, 1710, 2210, 2800, 3600],
  };

  persistChallengeResult(result, storage);
  assert.deepEqual(readChallengeBest(storage), result);
  assert.deepEqual(JSON.parse(storage.getItem(CHALLENGE_STORAGE_KEY)), result);
});

test('malformed or descending wave splits are rejected without invalidating the challenge best', () => {
  assert.equal(normaliseChallengeWaveScores([100, 90, 200], 3), null);
  const storage = memoryStorage();
  persistChallengeResult({
    won: true,
    wavesCleared: 8,
    score: 2500,
    waveScores: [100, 200, 300, 400, 500, 600, 700, 650],
  }, storage);
  assert.deepEqual(readChallengeBest(storage), {
    won: true,
    wavesCleared: 8,
    score: 2500,
  });
});
