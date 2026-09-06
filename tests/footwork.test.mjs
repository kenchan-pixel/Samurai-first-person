import test from 'node:test';
import assert from 'node:assert/strict';

import { CombatEngine, Direction } from '../src/game-core.js';
import { installFootwork } from '../src/footwork.js';
import { installPerfectStep, perfectStepWindowMs } from '../src/perfect-step.js';

installFootwork(CombatEngine);
installPerfectStep(CombatEngine);

function makeEnemy({
  id = 'ashigaru-scout',
  heavy = false,
  damage = 1,
  maxHp = 4,
} = {}) {
  return {
    id,
    name: 'Footwork Target',
    title: 'Footwork Yard',
    maxHp,
    postureMax: 4,
    gapMs: 100,
    recoveryMs: 300,
    perfectWindowMs: 45,
    attacks: [
      {
        direction: Direction.TOP,
        telegraphMs: 100,
        strikeMs: 120,
        damage,
        heavy,
      },
    ],
  };
}

test('ordinary STEP remains an evade-only opening outside the narrower Perfect STEP window', () => {
  const combat = new CombatEngine({ enemies: [makeEnemy()] });
  combat.start(0);
  combat.update(1550);

  const telegraph = combat.snapshot(1550);
  assert.equal(telegraph.phase, 'telegraph');
  assert.equal(telegraph.enemyDistance, 0);
  assert.equal(telegraph.attack.reachDistance, 0);
  assert.equal(telegraph.attack.distanceFrom, 1);
  assert.equal(telegraph.attack.distanceTo, 0);

  combat.update(1650);
  assert.equal(combat.phase, 'strike');
  assert.equal(perfectStepWindowMs(combat.currentAttack), 48);

  const evade = combat.attemptBackstep(1715);
  assert.equal(evade.accepted, true);
  assert.equal(evade.evaded, true);
  assert.equal(evade.perfectStep, false);
  assert.equal(combat.enemyHp, 4);
  assert.equal(combat.phase, 'recovery');
  assert.equal(combat.snapshot(1715).enemyDistance, 1);

  const counter = combat.attemptAttack(Direction.BOTTOM, 1720);
  assert.equal(counter.accepted, true);
  assert.equal(counter.evaded, true);
  assert.equal(counter.damage, 2);
  assert.equal(combat.enemyHp, 2);
  assert.equal(combat.snapshot(1720).enemyDistance, 0);

  const events = combat.drainEvents();
  assert.ok(events.some((event) => event.type === 'enemy-footwork'));
  assert.ok(events.some((event) => event.type === 'backstep-evade'));
  assert.ok(events.some((event) => event.type === 'counter' && event.detail.evaded === true && !event.detail.automatic));
  assert.equal(events.some((event) => event.type === 'counter' && event.detail.perfectStep), false);
});

test('Perfect STEP auto-ripostes for one damage without posture and keeps the manual swipe opening', () => {
  const combat = new CombatEngine({ enemies: [makeEnemy()] });
  combat.start(0);
  combat.update(1550);
  combat.update(1650);
  combat.drainEvents();

  const postureBefore = combat.enemyPosture;
  const evade = combat.attemptBackstep(1660);
  assert.equal(evade.accepted, true);
  assert.equal(evade.evaded, true);
  assert.equal(evade.perfectStep, true);
  assert.equal(evade.autoRiposte, true);
  assert.equal(evade.autoRiposteDamage, 1);
  assert.equal(combat.enemyHp, 3);
  assert.equal(combat.enemyPosture, postureBefore);
  assert.equal(combat.phase, 'recovery');

  const autoEvents = combat.drainEvents();
  assert.ok(autoEvents.some((event) => event.type === 'counter' && event.detail.automatic && event.detail.perfectStep && event.detail.damage === 1));

  const manual = combat.attemptAttack(Direction.BOTTOM, 1670);
  assert.equal(manual.accepted, true);
  assert.equal(manual.evaded, true);
  assert.equal(manual.damage, 2);
  assert.equal(combat.enemyHp, 1);
});

test('long heavy strike tracks a backstep even inside the Perfect STEP timing window', () => {
  const combat = new CombatEngine({
    enemies: [makeEnemy({ id: 'oni-guard', heavy: true, damage: 2 })],
    playerMaxHp: 5,
  });
  combat.start(0);
  combat.update(1550);

  const telegraph = combat.snapshot(1550);
  assert.equal(telegraph.enemyDistance, 2);
  assert.equal(telegraph.attack.reachDistance, 2);

  combat.update(1650);
  const backstep = combat.attemptBackstep(1660);
  assert.equal(backstep.accepted, false);
  assert.equal(backstep.reason, 'tracked');
  assert.equal(combat.phase, 'strike');

  combat.update(1770);
  assert.equal(combat.playerHp, 3);
  assert.equal(combat.phase, 'recovery');
  const events = combat.drainEvents();
  assert.ok(events.some((event) => event.type === 'footwork-miss' && event.detail.reason === 'tracked'));
  assert.equal(events.some((event) => event.type === 'counter' && event.detail.perfectStep), false);
});

test('backstep outside strike timing does not create a free opening', () => {
  const combat = new CombatEngine({ enemies: [makeEnemy()] });
  combat.start(0);
  combat.update(1550);
  const before = combat.snapshot(1550).enemyDistance;

  const early = combat.attemptBackstep(1580);
  assert.deepEqual(early, { accepted: false, reason: 'wrong-time' });
  assert.equal(combat.phase, 'telegraph');
  assert.equal(combat.snapshot(1580).enemyDistance, before);
});
