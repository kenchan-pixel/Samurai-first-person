import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { CombatEngine, Direction } from '../src/game-core.js';
import {
  BOSS_ID,
  BOSS_PHASE_ONE,
  BOSS_PHASE_TWO,
  installBossEncounter,
} from '../src/boss-encounter.js';

installBossEncounter();

test('campaign appends a fourth boss without removing the three baseline enemies', () => {
  const combat = new CombatEngine();
  combat.start(0);
  assert.equal(combat.enemies.length, 4);
  assert.equal(combat.enemies.at(-1).id, BOSS_ID);
  assert.equal(combat.snapshot(0).stageCount, 4);
});

test('boss enters phase two below half health with a reset pressure state and new attack set', () => {
  const combat = new CombatEngine({ enemies: [BOSS_PHASE_ONE] });
  combat.start(0);
  combat.enemyHp = 7;
  combat.enemyPosture = 4;
  combat.phase = 'recovery';
  combat.currentAttack = {
    direction: Direction.TOP,
    parried: true,
    perfect: false,
    counterUsed: false,
    guardBroken: false,
  };

  const result = combat.attemptAttack(Direction.BOTTOM, 2000);
  assert.equal(result.accepted, true);
  assert.equal(result.bossPhase, 2);
  assert.equal(combat.enemyHp, 5);
  assert.equal(combat.enemy.title, BOSS_PHASE_TWO.title);
  assert.equal(combat.enemy.postureMax, 7);
  assert.equal(combat.enemyPosture, 0);
  assert.equal(combat.phase, 'gap');
  assert.equal(combat.phaseEndsAt, 3100);
  assert.ok(combat.drainEvents().some((event) => event.type === 'boss-phase' && event.detail.phase === 2));

  combat.start(5000);
  assert.equal(combat.enemy.title, BOSS_PHASE_ONE.title);
  assert.equal(combat.enemy.postureMax, 6);
});

test('real app document loads the boss encounter before main runtime', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const bossIndex = html.indexOf('./src/boss-overlay.js');
  const mainIndex = html.indexOf('./src/main.js');
  assert.ok(bossIndex >= 0, 'boss overlay module must be wired into the real app');
  assert.ok(mainIndex > bossIndex, 'boss encounter must install before main creates CombatEngine');
});
