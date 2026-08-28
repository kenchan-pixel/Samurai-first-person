import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatEngine, ENEMIES } from '../src/game-core.js';
import { BOSS_PHASE_ONE } from '../src/boss-encounter.js';
import {
  RONIN_PRACTICE_ID,
  SHOGUN_PRACTICE_ID,
  activateRoninPractice,
  activateShogunPractice,
  completePracticeIfDue,
  completeRoninPracticeIfDue,
} from '../src/practice-mode.js';

test('Ronin practice starts on the real Stage 2 enemy without changing its combat profile', () => {
  const combat = new CombatEngine();
  combat.start(0);

  const roninBefore = combat.enemies.find((enemy) => enemy.id === RONIN_PRACTICE_ID);
  const result = activateRoninPractice(combat, 100);
  const snapshot = combat.snapshot(100);
  const events = combat.drainEvents();

  assert.equal(result.accepted, true);
  assert.equal(snapshot.stage, 2);
  assert.equal(snapshot.enemy.id, RONIN_PRACTICE_ID);
  assert.equal(snapshot.enemy, roninBefore);
  assert.equal(snapshot.enemyHp, roninBefore.maxHp);
  assert.equal(snapshot.phase, 'stage-intro');
  assert.equal(snapshot.score, 0);
  assert.deepEqual(events.map((event) => event.type), ['stage-start']);
  assert.equal(events[0].detail.stage, 2);
  assert.equal(events[0].detail.practice, true);
});

test('Ronin practice ends after Stage 2 instead of advancing into the campaign', () => {
  const combat = new CombatEngine();
  combat.start(0);
  activateRoninPractice(combat, 100);
  combat.drainEvents();

  combat.enemyHp = 0;
  combat.phase = 'stage-clear';
  combat.phaseStartedAt = 200;
  combat.phaseEndsAt = 400;
  combat.events.push({
    type: 'enemy-defeated',
    detail: { enemyId: RONIN_PRACTICE_ID, stage: 2 },
  });

  assert.equal(completeRoninPracticeIfDue(combat, 399), false);
  assert.equal(combat.enemyIndex, 1);
  assert.equal(completeRoninPracticeIfDue(combat, 400), true);
  assert.equal(combat.enemyIndex, 1);
  assert.equal(combat.phase, 'victory');

  const events = combat.drainEvents();
  const victory = events.find((event) => event.type === 'victory');
  assert.equal(victory?.detail.practice, true);
  assert.equal(victory?.detail.practiceEnemyId, RONIN_PRACTICE_ID);
  assert.equal(victory?.detail.practiceStage, 2);
});

test('Shogun practice starts on the real Stage 4 Phase I enemy definition', () => {
  const combat = new CombatEngine({ enemies: [...ENEMIES, BOSS_PHASE_ONE] });
  combat.start(0);

  const shogunBefore = combat.enemies.find((enemy) => enemy.id === SHOGUN_PRACTICE_ID);
  const result = activateShogunPractice(combat, 100);
  const snapshot = combat.snapshot(100);
  const events = combat.drainEvents();

  assert.equal(result.accepted, true);
  assert.equal(snapshot.stage, 4);
  assert.equal(snapshot.enemy.id, SHOGUN_PRACTICE_ID);
  assert.equal(snapshot.enemy, shogunBefore);
  assert.equal(snapshot.enemyHp, 12);
  assert.equal(snapshot.enemyPostureMax, 6);
  assert.equal(snapshot.phase, 'stage-intro');
  assert.deepEqual(events.map((event) => event.type), ['stage-start']);
  assert.equal(events[0].detail.stage, 4);
  assert.equal(events[0].detail.practice, true);
});

test('Shogun practice ends after Stage 4 and identifies the practiced boss', () => {
  const combat = new CombatEngine({ enemies: [...ENEMIES, BOSS_PHASE_ONE] });
  combat.start(0);
  activateShogunPractice(combat, 100);
  combat.drainEvents();

  combat.enemyHp = 0;
  combat.phase = 'stage-clear';
  combat.phaseStartedAt = 200;
  combat.phaseEndsAt = 400;
  combat.events.push({
    type: 'enemy-defeated',
    detail: { enemyId: SHOGUN_PRACTICE_ID, stage: 4 },
  });

  assert.equal(completePracticeIfDue(combat, 399), false);
  assert.equal(combat.enemyIndex, 3);
  assert.equal(completePracticeIfDue(combat, 400), true);
  assert.equal(combat.enemyIndex, 3);
  assert.equal(combat.phase, 'victory');

  const events = combat.drainEvents();
  const victory = events.find((event) => event.type === 'victory');
  assert.equal(victory?.detail.practice, true);
  assert.equal(victory?.detail.practiceEnemyId, SHOGUN_PRACTICE_ID);
  assert.equal(victory?.detail.practiceStage, 4);
});
