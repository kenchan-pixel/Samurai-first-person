import test from 'node:test';
import assert from 'node:assert/strict';
import { Direction } from '../src/game-core.js';
import { impactOrigin, impactProfile } from '../src/impact-fx.js';

test('impact profiles map combat events to bounded visible effects', () => {
  assert.deepEqual(impactProfile({ type: 'parry', detail: { direction: Direction.LEFT } }), {
    kind: 'parry',
    direction: Direction.LEFT,
    intensity: 0.95,
    sparks: 6,
    slash: false,
  });

  const perfect = impactProfile({ type: 'perfect-parry', detail: { direction: Direction.TOP } });
  assert.equal(perfect?.kind, 'perfect');
  assert.ok(perfect.intensity > 1);
  assert.ok(perfect.sparks >= 8);

  const counter = impactProfile({ type: 'counter', detail: { direction: Direction.RIGHT, damage: 3 } });
  assert.equal(counter?.kind, 'slash');
  assert.equal(counter?.slash, true);
  assert.equal(counter?.direction, Direction.RIGHT);

  const brokenCounter = impactProfile({
    type: 'counter',
    detail: { direction: Direction.BOTTOM, damage: 5, guardBroken: true },
  });
  assert.equal(brokenCounter?.kind, 'break');
  assert.ok(brokenCounter.intensity > counter.intensity);

  const damage = impactProfile({
    type: 'player-hit',
    detail: { direction: Direction.TOP, damage: 3, guardBroken: true },
  });
  assert.equal(damage?.kind, 'damage');
  assert.ok(damage.intensity >= 1.5);

  assert.equal(impactProfile({ type: 'telegraph', detail: {} }), null);
});

test('impact origins retain directional physicality', () => {
  const top = impactOrigin(Direction.TOP);
  const right = impactOrigin(Direction.RIGHT);
  const bottom = impactOrigin(Direction.BOTTOM);
  const left = impactOrigin(Direction.LEFT);

  assert.ok(top.y < bottom.y);
  assert.ok(left.x < right.x);
  assert.equal(top.x, bottom.x);
  assert.equal(left.y, right.y);
  assert.deepEqual(impactOrigin('unknown'), { x: 50, y: 48, angle: -35 });
});
