import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatEngine, Direction } from '../src/game-core.js';
import '../src/perfect-riposte.js';

function startFirstStrike(engine) {
  engine.start(0);
  engine.drainEvents();
  engine.update(1550);
  engine.update(2430);
  assert.equal(engine.phase, 'strike');
}

test('perfect parry auto-ripostes for one damage and preserves manual swipe follow-up without stacking the legacy perfect bonus', () => {
  const engine = new CombatEngine();
  startFirstStrike(engine);
  const hpBefore = engine.enemyHp;

  const parry = engine.attemptParry(Direction.TOP, 2430);
  assert.equal(parry.accepted, true);
  assert.equal(parry.perfect, true);
  assert.equal(parry.autoRiposte, true);
  assert.equal(engine.enemyHp, hpBefore - 1);
  assert.equal(engine.currentAttack.counterUsed, false);

  const events = engine.drainEvents();
  const automatic = events.find((event) => event.type === 'counter' && event.detail?.automatic);
  assert.ok(automatic);
  assert.equal(automatic.detail.damage, 1);

  const manual = engine.attemptAttack(Direction.BOTTOM, 2480);
  assert.equal(manual.accepted, true);
  assert.equal(manual.damage, 2);
  assert.equal(engine.enemyHp, hpBefore - 3);
});

test('normal parry remains manual and receives no automatic riposte', () => {
  const engine = new CombatEngine();
  startFirstStrike(engine);
  const hpBefore = engine.enemyHp;

  const parry = engine.attemptParry(Direction.TOP, 2550);
  assert.equal(parry.accepted, true);
  assert.equal(parry.perfect, false);
  assert.equal(parry.autoRiposte, undefined);
  assert.equal(engine.enemyHp, hpBefore);
  assert.equal(engine.drainEvents().some((event) => event.type === 'counter' && event.detail?.automatic), false);

  const manual = engine.attemptAttack(Direction.BOTTOM, 2590);
  assert.equal(manual.accepted, true);
  assert.equal(manual.damage, 2);
  assert.equal(engine.enemyHp, hpBefore - 2);
});
