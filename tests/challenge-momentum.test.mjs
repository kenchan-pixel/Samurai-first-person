import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatEngine, ENEMIES } from '../src/game-core.js';
import { BOSS_PHASE_ONE } from '../src/boss-encounter.js';
import { installChallengeMode, requestChallenge } from '../src/challenge-mode.js';
import {
  CHALLENGE_FULL_HP_SCORE_BONUS,
  CHALLENGE_MOMENTUM_MAX,
  installChallengeMomentum,
  resolveChallengeMomentum,
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

function resolveNextIncomingHit(combat) {
  let now = combat.phaseEndsAt;
  combat.update(now); // stage-intro -> telegraph
  now = combat.phaseEndsAt;
  combat.update(now); // telegraph -> strike
  const hpBefore = combat.playerHp;
  now = combat.phaseEndsAt;
  combat.update(now); // strike -> real CombatEngine player-hit
  return { now, hpBefore, events: combat.drainEvents() };
}

test('challenge momentum resolves hit, heal and full-health score rewards deterministically', () => {
  assert.equal(CHALLENGE_MOMENTUM_MAX, 2);

  const firstClean = resolveChallengeMomentum({
    momentum: 0,
    hitThisWave: false,
    playerHp: 4,
    playerMaxHp: 5,
    score: 100,
  });
  assert.deepEqual(firstClean, {
    clean: true,
    momentum: 1,
    reward: null,
    amount: 0,
    playerHp: 4,
    score: 100,
  });

  const heal = resolveChallengeMomentum({
    momentum: 1,
    hitThisWave: false,
    playerHp: 4,
    playerMaxHp: 5,
    score: 100,
  });
  assert.equal(heal.reward, 'heal');
  assert.equal(heal.amount, 1);
  assert.equal(heal.playerHp, 5);
  assert.equal(heal.momentum, 0);
  assert.equal(heal.score, 100);

  const fullHealth = resolveChallengeMomentum({
    momentum: 1,
    hitThisWave: false,
    playerHp: 5,
    playerMaxHp: 5,
    score: 100,
  });
  assert.equal(fullHealth.reward, 'score');
  assert.equal(fullHealth.amount, CHALLENGE_FULL_HP_SCORE_BONUS);
  assert.equal(fullHealth.score, 100 + CHALLENGE_FULL_HP_SCORE_BONUS);
  assert.equal(fullHealth.playerHp, 5);

  const interrupted = resolveChallengeMomentum({
    momentum: 1,
    hitThisWave: true,
    playerHp: 3,
    playerMaxHp: 5,
    score: 100,
  });
  assert.equal(interrupted.clean, false);
  assert.equal(interrupted.momentum, 0);
  assert.equal(interrupted.reward, null);
  assert.equal(interrupted.playerHp, 3);
  assert.equal(interrupted.score, 100);
});

test('real CombatEngine player-hit breaks challenge momentum before clean-wave rebuilding, while campaign stays unchanged', () => {
  installChallengeMode(CombatEngine);
  installChallengeMomentum(CombatEngine);

  const baseline = [...ENEMIES, BOSS_PHASE_ONE];
  const combat = new CombatEngine({ enemies: baseline });

  requestChallenge(true);
  combat.start(0);
  combat.drainEvents();

  let now = 1;
  let events = forceChallengeStageClear(combat, now);
  assert.equal(combat.enemyIndex, 1);
  assert.equal(events.some((event) => event.type === 'challenge-rally'), false);

  const hit = resolveNextIncomingHit(combat);
  now = hit.now;
  const playerHit = hit.events.find((event) => event.type === 'player-hit');
  assert.ok(playerHit, 'expected the real CombatEngine missed strike to emit player-hit');
  assert.ok(combat.playerHp < hit.hpBefore, 'real player-hit should reduce HP before the wave clears');

  now += 1;
  events = forceChallengeStageClear(combat, now);
  assert.equal(combat.enemyIndex, 2);
  assert.equal(events.some((event) => event.type === 'challenge-rally'), false, 'hit wave must not preserve the first clean-wave mark');

  now += 1;
  events = forceChallengeStageClear(combat, now);
  assert.equal(combat.enemyIndex, 3);
  assert.equal(events.some((event) => event.type === 'challenge-rally'), false, 'first clean wave after a hit must rebuild only to 1/2');

  now += 1;
  events = forceChallengeStageClear(combat, now);
  const rally = events.find((event) => event.type === 'challenge-rally');
  assert.equal(rally?.detail?.reward, 'heal');
  assert.equal(rally?.detail?.amount, 1);
  assert.equal(rally?.detail?.rallies, 1);
  assert.equal(rally?.detail?.cleanWaves, 3);
  assert.equal(combat.playerHp, combat.playerMaxHp);

  requestChallenge(false);
  combat.start(now + 1000);
  combat.drainEvents();
  const campaignHp = combat.playerHp;
  const campaignScore = combat.score;
  combat.events.push({ type: 'enemy-defeated', detail: { enemyId: combat.enemy.id, stage: 1 } });
  events = combat.drainEvents();

  assert.equal(events.some((event) => event.type === 'challenge-rally'), false);
  assert.equal(combat.playerHp, campaignHp);
  assert.equal(combat.score, campaignScore);
  assert.deepEqual(combat.enemies.map((enemy) => enemy.id), baseline.map((enemy) => enemy.id));
});
