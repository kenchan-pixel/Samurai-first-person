import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatEngine } from '../src/game-core.js';
import {
  BOSS_PHASE_TWO,
  BOSS_PHASE_TWO_HP,
} from '../src/boss-encounter.js';
import {
  BLOOD_MOON_PRACTICE_MODE,
  installBloodMoonPractice,
  requestBloodMoonPractice,
} from '../src/blood-moon-practice.js';

installBloodMoonPractice();

test('Blood Moon practice enters the real Shogun Phase II profile without transition score', () => {
  requestBloodMoonPractice(true);
  const combat = new CombatEngine();
  combat.start(100);
  const snapshot = combat.snapshot(100);
  const events = combat.drainEvents();
  const stageStart = events.find((event) => event.type === 'stage-start');
  const phase = events.find((event) => event.type === 'boss-phase');

  assert.equal(snapshot.stage, 4);
  assert.equal(snapshot.enemy, BOSS_PHASE_TWO);
  assert.equal(snapshot.enemyHp, BOSS_PHASE_TWO_HP);
  assert.equal(snapshot.enemyPostureMax, 7);
  assert.equal(snapshot.enemy.perfectWindowMs, 58);
  assert.equal(snapshot.phase, 'stage-intro');
  assert.equal(snapshot.score, 0);
  assert.equal(stageStart?.detail.practice, true);
  assert.equal(stageStart?.detail.practiceMode, BLOOD_MOON_PRACTICE_MODE);
  assert.equal(phase?.detail.phase, 2);
  assert.equal(phase?.detail.directPractice, true);
  assert.equal(phase?.detail.practiceMode, BLOOD_MOON_PRACTICE_MODE);
  requestBloodMoonPractice(false);
});

test('Blood Moon practice terminates after Phase II and preserves its practice identity', () => {
  requestBloodMoonPractice(true);
  const combat = new CombatEngine();
  combat.start(100);
  combat.drainEvents();

  combat.enemyHp = 0;
  combat.phase = 'stage-clear';
  combat.phaseStartedAt = 200;
  combat.phaseEndsAt = 400;
  combat.events.push({
    type: 'enemy-defeated',
    detail: { enemyId: 'crimson-shogun', stage: 4 },
  });

  combat.update(400);
  const events = combat.drainEvents();
  const victory = events.find((event) => event.type === 'victory');

  assert.equal(combat.phase, 'victory');
  assert.equal(victory?.detail.practice, true);
  assert.equal(victory?.detail.practiceEnemyId, 'crimson-shogun');
  assert.equal(victory?.detail.practiceStage, 4);
  assert.equal(victory?.detail.practiceMode, BLOOD_MOON_PRACTICE_MODE);
  requestBloodMoonPractice(false);
});
