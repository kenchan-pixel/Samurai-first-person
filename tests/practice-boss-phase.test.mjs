import test from 'node:test';
import assert from 'node:assert/strict';

import { CombatEngine, Direction } from '../src/game-core.js';
import { BOSS_ID, BOSS_PHASE_TWO, installBossEncounter } from '../src/boss-encounter.js';
import { installDuelPractice, requestShogunPractice } from '../src/practice-mode.js';

test('Shogun practice preserves the production Blood Moon phase transition before ending the duel', () => {
  class PracticeBossEngine extends CombatEngine {}
  installBossEncounter(PracticeBossEngine);
  installDuelPractice(PracticeBossEngine);
  requestShogunPractice(true);

  const combat = new PracticeBossEngine();
  combat.start(0);
  assert.equal(combat.enemy.id, BOSS_ID);
  assert.equal(combat.enemyIndex + 1, 4);

  combat.events.length = 0;
  combat.enemyHp = 7;
  combat.phase = 'recovery';
  combat.phaseStartedAt = 10;
  combat.phaseEndsAt = 710;
  combat.currentAttack = {
    direction: Direction.TOP,
    displayedDirection: Direction.TOP,
    damage: 1,
    parried: true,
    perfect: false,
    counterUsed: false,
    guardBroken: false,
    strikeStartedAt: 0,
  };

  const counter = combat.attemptAttack(Direction.TOP, 20);
  assert.equal(counter.accepted, true);
  assert.equal(counter.damage, 1);
  assert.equal(counter.bossPhase, 2);
  assert.equal(combat.enemyHp, 6);
  assert.equal(combat.enemy, BOSS_PHASE_TWO);
  assert.equal(combat.phase, 'gap');
  assert.equal(combat.enemyIndex + 1, 4);
  assert.ok(combat.drainEvents().some((event) => event.type === 'boss-phase' && event.detail.phase === 2));

  combat.enemyHp = 0;
  combat.phase = 'stage-clear';
  combat.phaseStartedAt = 40;
  combat.phaseEndsAt = 50;
  combat.update(50);
  assert.equal(combat.phase, 'victory');
  const victory = combat.drainEvents().find((event) => event.type === 'victory');
  assert.equal(victory?.detail.practice, true);
  assert.equal(victory?.detail.practiceEnemyId, BOSS_ID);
  assert.equal(victory?.detail.practiceStage, 4);
});
