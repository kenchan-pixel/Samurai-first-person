import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatEngine, ENEMIES } from '../src/game-core.js';
import { BOSS_ID, BOSS_PHASE_ONE } from '../src/boss-encounter.js';
import {
  CHALLENGE_STAGE_COUNT,
  createChallengeEnemies,
  installChallengeMode,
  isBetterChallengeResult,
  requestChallenge,
} from '../src/challenge-mode.js';

test('challenge roster is a bounded eight-duel ladder ending at the real Shogun', () => {
  const roster = createChallengeEnemies();
  assert.equal(roster.length, CHALLENGE_STAGE_COUNT);
  assert.deepEqual(roster.slice(0, 3).map((enemy) => enemy.id), ENEMIES.map((enemy) => enemy.id));
  assert.equal(roster.at(-1).id, BOSS_ID);
  assert.equal(roster[3].id, ENEMIES[0].id);
  assert.ok(roster[3].maxHp > ENEMIES[0].maxHp);
  assert.ok(roster[6].gapMs < ENEMIES[1].gapMs);
  assert.ok(roster[6].attacks[0].telegraphMs < ENEMIES[1].attacks[0].telegraphMs);
  assert.equal(ENEMIES.length, 3);
});

test('challenge best prioritizes progress before score', () => {
  const sixWave = { won: false, wavesCleared: 6, score: 9000 };
  const sevenWave = { won: false, wavesCleared: 7, score: 1000 };
  assert.equal(isBetterChallengeResult(sevenWave, sixWave), true);
  assert.equal(isBetterChallengeResult(sixWave, sevenWave), false);
  assert.equal(isBetterChallengeResult({ won: true, wavesCleared: 8, score: 4000 }, { won: true, wavesCleared: 8, score: 3500 }), true);
  assert.equal(isBetterChallengeResult({ won: true, wavesCleared: 8, score: 3000 }, { won: true, wavesCleared: 8, score: 3500 }), false);
});

test('challenge mode swaps in eight stages and restores the original campaign roster', () => {
  installChallengeMode(CombatEngine);
  const baseline = [...ENEMIES, BOSS_PHASE_ONE];
  const combat = new CombatEngine({ enemies: baseline });

  requestChallenge(true);
  combat.start(100);
  assert.equal(combat.snapshot(100).stageCount, CHALLENGE_STAGE_COUNT);
  assert.equal(combat.enemies.at(-1).id, BOSS_ID);

  combat.enemyIndex = CHALLENGE_STAGE_COUNT - 1;
  combat.enemyHp = 0;
  combat.phase = 'stage-clear';
  combat.phaseStartedAt = 200;
  combat.phaseEndsAt = 300;
  combat.events.push({ type: 'enemy-defeated', detail: { enemyId: BOSS_ID, stage: CHALLENGE_STAGE_COUNT } });
  combat.update(300);
  const terminal = combat.drainEvents().find((event) => event.type === 'victory');
  assert.equal(terminal?.detail?.challenge, true);
  assert.equal(terminal?.detail?.wavesCleared, CHALLENGE_STAGE_COUNT);

  requestChallenge(false);
  combat.start(400);
  assert.equal(combat.snapshot(400).stageCount, baseline.length);
  assert.deepEqual(combat.enemies.map((enemy) => enemy.id), baseline.map((enemy) => enemy.id));
});
