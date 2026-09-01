import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatEngine, ENEMIES } from '../src/game-core.js';
import { BOSS_PHASE_ONE } from '../src/boss-encounter.js';
import {
  CHALLENGE_STORAGE_KEY,
  installChallengeMode,
  persistChallengeResult,
  requestChallenge,
} from '../src/challenge-mode.js';
import {
  CHALLENGE_FULL_HP_SCORE_BONUS,
  installChallengeMomentum,
} from '../src/challenge-momentum.js';

function forceChallengeStageClear(combat, now) {
  const stage = combat.enemyIndex + 1;
  const enemyId = combat.enemy.id;
  combat.enemyHp = 0;
  combat.phase = 'stage-clear';
  combat.phaseStartedAt = now;
  combat.phaseEndsAt = now;
  combat.events.push({ type: 'enemy-defeated', detail: { enemyId, stage } });
  combat.update(now);
  return combat.drainEvents();
}

function memoryStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
  };
}

test('final-wave full-health rally is authoritative in victory and persisted challenge best', () => {
  installChallengeMode(CombatEngine);
  installChallengeMomentum(CombatEngine);

  const combat = new CombatEngine({ enemies: [...ENEMIES, BOSS_PHASE_ONE] });
  requestChallenge(true);
  combat.start(0);
  combat.drainEvents();

  let now = 1;
  for (let stage = 1; stage < 8; stage += 1) {
    forceChallengeStageClear(combat, now);
    now += 1;
  }

  assert.equal(combat.playerHp, combat.playerMaxHp, 'final rally scenario must remain at full health');
  const scoreBeforeFinal = combat.score;
  const finalEvents = forceChallengeStageClear(combat, now);
  const finalRally = finalEvents.find((event) => event.type === 'challenge-rally');
  const victory = finalEvents.find((event) => event.type === 'victory');

  assert.equal(finalRally?.detail?.reward, 'score');
  assert.equal(finalRally?.detail?.amount, CHALLENGE_FULL_HP_SCORE_BONUS);
  assert.equal(combat.score, scoreBeforeFinal + CHALLENGE_FULL_HP_SCORE_BONUS);
  assert.equal(victory?.detail?.challenge, true);
  assert.equal(victory?.detail?.wavesCleared, 8);
  assert.equal(victory?.detail?.score, combat.score, 'victory must expose the post-rally authoritative score');

  const storage = memoryStorage();
  const persisted = persistChallengeResult({
    won: true,
    wavesCleared: victory.detail.wavesCleared,
    score: victory.detail.score,
  }, storage);
  const stored = JSON.parse(storage.getItem(CHALLENGE_STORAGE_KEY));

  assert.equal(persisted.score, combat.score);
  assert.equal(stored.score, combat.score, 'challenge best must include the final +300 rally');
});
