import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CombatEngine,
  Direction,
  directionFromSwipe,
  directionFromTap,
  oppositeDirection,
} from '../src/game-core.js';

test('tap edge zones map to four guard directions and centre remains neutral', () => {
  assert.equal(directionFromTap(50, 5, 100, 200), Direction.TOP);
  assert.equal(directionFromTap(99, 100, 100, 200), Direction.RIGHT);
  assert.equal(directionFromTap(50, 199, 100, 200), Direction.BOTTOM);
  assert.equal(directionFromTap(1, 100, 100, 200), Direction.LEFT);
  assert.equal(directionFromTap(50, 100, 100, 200), null);
});

test('swipe uses dominant axis and minimum distance', () => {
  assert.equal(directionFromSwipe(80, 12), Direction.RIGHT);
  assert.equal(directionFromSwipe(-80, 12), Direction.LEFT);
  assert.equal(directionFromSwipe(8, -90), Direction.TOP);
  assert.equal(directionFromSwipe(8, 90), Direction.BOTTOM);
  assert.equal(directionFromSwipe(10, 8), null);
});

test('opposite direction supports meaningful counter-slash direction', () => {
  assert.equal(oppositeDirection(Direction.TOP), Direction.BOTTOM);
  assert.equal(oppositeDirection(Direction.RIGHT), Direction.LEFT);
  assert.equal(oppositeDirection(Direction.BOTTOM), Direction.TOP);
  assert.equal(oppositeDirection(Direction.LEFT), Direction.RIGHT);
});

test('matching strike direction parries and opens one counter window', () => {
  const enemy = {
    id: 'test-enemy', name: 'Test Enemy', title: 'Test Stage', maxHp: 4,
    gapMs: 100, recoveryMs: 500, perfectWindowMs: 60,
    attacks: [{ direction: Direction.TOP, telegraphMs: 100, strikeMs: 100, damage: 1 }],
  };
  const combat = new CombatEngine({ enemies: [enemy] });
  combat.start(0);
  combat.update(1550);
  assert.equal(combat.phase, 'telegraph');
  combat.update(1650);
  assert.equal(combat.phase, 'strike');
  const parry = combat.attemptParry(Direction.TOP, 1670);
  assert.deepEqual(parry, { accepted: true, perfect: true });
  assert.equal(combat.phase, 'recovery');
  const counter = combat.attemptAttack(Direction.BOTTOM, 1700);
  assert.equal(counter.accepted, true);
  assert.equal(counter.damage, 3);
  assert.equal(combat.enemyHp, 1);
  assert.equal(combat.attemptAttack(Direction.LEFT, 1720).reason, 'already-used');
});

test('near-contact telegraph tap buffers a normal parry without becoming Perfect', () => {
  const enemy = {
    id: 'buffer-target', name: 'Buffer Target', title: 'Test Stage', maxHp: 4,
    gapMs: 100, recoveryMs: 500, perfectWindowMs: 60,
    attacks: [{ direction: Direction.TOP, telegraphMs: 200, strikeMs: 100, damage: 1 }],
  };
  const combat = new CombatEngine({ enemies: [enemy] });
  combat.start(0);
  combat.update(1550);
  assert.equal(combat.phase, 'telegraph');

  const buffered = combat.attemptParry(Direction.TOP, 1680);
  assert.deepEqual(buffered, { accepted: true, perfect: false, buffered: true });
  assert.equal(combat.phase, 'telegraph');
  assert.equal(combat.drainEvents().some((event) => event.type === 'parry'), false);

  combat.update(1750);
  assert.equal(combat.phase, 'recovery');
  assert.equal(combat.currentAttack.perfect, false);
  assert.equal(combat.enemyPosture, 1);
  assert.equal(combat.score, 100);
  const events = combat.drainEvents();
  assert.ok(events.some((event) => event.type === 'strike'));
  assert.ok(events.some((event) => event.type === 'parry'));
  assert.equal(events.some((event) => event.type === 'perfect-parry'), false);

  const counter = combat.attemptAttack(Direction.BOTTOM, 1760);
  assert.equal(counter.accepted, true);
  assert.equal(counter.damage, 2);
});

test('telegraph taps before the bounded lead buffer remain wrong-time misses', () => {
  const enemy = {
    id: 'buffer-target', name: 'Buffer Target', title: 'Test Stage', maxHp: 4,
    gapMs: 100, recoveryMs: 500, perfectWindowMs: 60,
    attacks: [{ direction: Direction.TOP, telegraphMs: 200, strikeMs: 100, damage: 1 }],
  };
  const combat = new CombatEngine({ enemies: [enemy] });
  combat.start(0);
  combat.update(1550);

  const early = combat.attemptParry(Direction.TOP, 1670);
  assert.deepEqual(early, { accepted: false, reason: 'wrong-time' });
  assert.equal(combat.phase, 'telegraph');
  const miss = combat.drainEvents().find((event) => event.type === 'parry-miss');
  assert.equal(miss?.detail?.reason, 'wrong-time');
});

test('late telegraph buffer waits for a resolved feint and still rejects wrong direction', () => {
  const enemy = {
    id: 'feint-buffer-target', name: 'Feint Buffer Target', title: 'Test Stage', maxHp: 4,
    gapMs: 100, recoveryMs: 500, perfectWindowMs: 60,
    attacks: [{
      direction: Direction.RIGHT,
      feintFrom: Direction.LEFT,
      feintAt: 0.7,
      telegraphMs: 200,
      strikeMs: 100,
      damage: 1,
    }],
  };
  const combat = new CombatEngine({ enemies: [enemy] });
  combat.start(0);
  combat.update(1550);

  const unresolved = combat.attemptParry(Direction.RIGHT, 1680);
  assert.deepEqual(unresolved, { accepted: false, reason: 'wrong-time' });

  combat.update(1695);
  assert.equal(combat.snapshot(1695).attack.displayedDirection, Direction.RIGHT);
  const wrong = combat.attemptParry(Direction.LEFT, 1696);
  assert.deepEqual(wrong, { accepted: false, reason: 'wrong-direction' });
  const buffered = combat.attemptParry(Direction.RIGHT, 1697);
  assert.deepEqual(buffered, { accepted: true, perfect: false, buffered: true });

  combat.update(1750);
  assert.equal(combat.phase, 'recovery');
  assert.equal(combat.currentAttack.perfect, false);
});

test('wrong direction does not parry and unanswered strike damages player', () => {
  const enemy = {
    id: 'test-enemy', name: 'Test Enemy', title: 'Test Stage', maxHp: 2,
    gapMs: 100, recoveryMs: 300, perfectWindowMs: 50,
    attacks: [{ direction: Direction.LEFT, telegraphMs: 100, strikeMs: 100, damage: 2 }],
  };
  const combat = new CombatEngine({ enemies: [enemy], playerMaxHp: 5 });
  combat.start(0);
  combat.update(1550);
  combat.update(1650);
  const parry = combat.attemptParry(Direction.RIGHT, 1670);
  assert.equal(parry.accepted, false);
  assert.equal(parry.reason, 'wrong-direction');
  combat.update(1750);
  assert.equal(combat.playerHp, 3);
  assert.equal(combat.phase, 'recovery');
  assert.equal(combat.attemptAttack(Direction.RIGHT, 1760).reason, 'no-parry-opening');
});

test('feint changes displayed direction before the strike', () => {
  const enemy = {
    id: 'feint-enemy', name: 'Feint Enemy', title: 'Test Stage', maxHp: 2,
    gapMs: 100, recoveryMs: 300, perfectWindowMs: 50,
    attacks: [{ direction: Direction.RIGHT, feintFrom: Direction.LEFT, feintAt: 0.5, telegraphMs: 200, strikeMs: 100, damage: 1 }],
  };
  const combat = new CombatEngine({ enemies: [enemy] });
  combat.start(0);
  combat.update(1550);
  assert.equal(combat.snapshot(1550).attack.displayedDirection, Direction.LEFT);
  combat.update(1655);
  assert.equal(combat.snapshot(1655).attack.displayedDirection, Direction.RIGHT);
});

test('three stages advance sequentially to victory', () => {
  const enemies = ['one', 'two', 'three'].map((id) => ({
    id, name: id, title: id, maxHp: 1, gapMs: 10, recoveryMs: 20, perfectWindowMs: 50,
    attacks: [{ direction: Direction.TOP, telegraphMs: 10, strikeMs: 10, damage: 1 }],
  }));
  const combat = new CombatEngine({ enemies });
  let now = 0;
  combat.start(now);
  for (let stage = 0; stage < enemies.length; stage += 1) {
    now += 1550;
    combat.update(now);
    now += 10;
    combat.update(now);
    assert.equal(combat.phase, 'strike');
    assert.equal(combat.attemptParry(Direction.TOP, now + 1).accepted, true);
    assert.equal(combat.attemptAttack(Direction.BOTTOM, now + 2).defeated, true);
    now += 1452;
    combat.update(now);
  }
  assert.equal(combat.phase, 'victory');
  assert.equal(combat.enemyIndex, 2);
});

test('lethal enemy strike reaches defeat and keeps health at zero', () => {
  const enemy = {
    id: 'executioner', name: 'Executioner', title: 'Test Stage', maxHp: 2,
    gapMs: 10, recoveryMs: 10, perfectWindowMs: 20,
    attacks: [{ direction: Direction.TOP, telegraphMs: 10, strikeMs: 10, damage: 5 }],
  };
  const combat = new CombatEngine({ enemies: [enemy], playerMaxHp: 5 });
  combat.start(0);
  combat.update(1550);
  combat.update(1560);
  combat.update(1570);
  assert.equal(combat.phase, 'defeat');
  assert.equal(combat.playerHp, 0);
});

test('parry pressure breaks enemy posture and empowers the next counter', () => {
  const enemy = {
    id: 'posture-target', name: 'Posture Target', title: 'Test Stage', maxHp: 12, postureMax: 3,
    gapMs: 100, recoveryMs: 300, perfectWindowMs: 20,
    attacks: [{ direction: Direction.TOP, telegraphMs: 100, strikeMs: 120, damage: 1 }],
  };
  const combat = new CombatEngine({ enemies: [enemy] });
  combat.start(0);
  combat.update(1550);
  combat.update(1650);
  combat.attemptParry(Direction.TOP, 1660);
  assert.equal(combat.snapshot(1660).enemyPosture, 2);
  combat.attemptAttack(Direction.BOTTOM, 1670);
  combat.update(1960);
  combat.update(2060);
  combat.update(2160);
  const parry = combat.attemptParry(Direction.TOP, 2200);
  assert.equal(parry.perfect, false);
  const broken = combat.snapshot(2200);
  assert.equal(broken.enemyPosture, 3);
  assert.equal(broken.attack.guardBroken, true);
  const counter = combat.attemptAttack(Direction.BOTTOM, 2210);
  assert.equal(counter.damage, 4);
  assert.equal(combat.snapshot(2210).enemyPosture, 0);
  const events = combat.drainEvents();
  assert.ok(events.some((event) => event.type === 'enemy-guard-break'));
});

test('taking repeated hits builds player posture and guard break adds one damage then resets posture', () => {
  const enemy = {
    id: 'pressure-enemy', name: 'Pressure Enemy', title: 'Test Stage', maxHp: 5,
    gapMs: 100, recoveryMs: 300, perfectWindowMs: 20,
    attacks: [{ direction: Direction.LEFT, telegraphMs: 100, strikeMs: 100, damage: 1 }],
  };
  const combat = new CombatEngine({ enemies: [enemy], playerMaxHp: 5, playerPostureMax: 2 });
  combat.start(0);
  combat.update(1550);
  combat.update(1650);
  combat.update(1750);
  assert.equal(combat.playerHp, 4);
  assert.equal(combat.snapshot(1750).playerPosture, 1);
  combat.update(1966);
  combat.update(2066);
  combat.update(2166);
  combat.update(2266);
  assert.equal(combat.playerHp, 2);
  assert.equal(combat.snapshot(2266).playerPosture, 0);
  const hitEvents = combat.drainEvents().filter((event) => event.type === 'player-hit');
  assert.equal(hitEvents.at(-1).detail.guardBroken, true);
  assert.equal(hitEvents.at(-1).detail.damage, 2);
});
