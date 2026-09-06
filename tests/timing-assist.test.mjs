import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CombatEngine, Direction, ENEMIES } from '../src/game-core.js';
import { timingAssistFrame } from '../src/timing-assist.js';

test('timing assist shrinks through telegraph and distinguishes perfect from normal strike timing', () => {
  const engine = new CombatEngine();
  engine.start(0);
  engine.update(1550);

  const early = timingAssistFrame(engine, 1550);
  assert.equal(early.visible, true);
  assert.equal(early.phase, 'telegraph');
  assert.equal(early.direction, Direction.TOP);

  engine.update(2200);
  const late = timingAssistFrame(engine, 2200);
  assert.equal(late.phase, 'telegraph');
  assert.ok(late.scale < early.scale, `expected shrinking ring: ${early.scale} -> ${late.scale}`);
  assert.ok(late.scale > 1);

  engine.update(2430);
  const perfect = timingAssistFrame(engine, 2430);
  assert.equal(perfect.phase, 'perfect');
  assert.equal(perfect.perfect, true);
  assert.equal(perfect.scale, 1);

  engine.update(2536);
  const normal = timingAssistFrame(engine, 2536);
  assert.equal(normal.phase, 'strike');
  assert.equal(normal.perfect, false);

  const parry = engine.attemptParry(Direction.TOP, 2536);
  assert.equal(parry.accepted, true);
  assert.equal(timingAssistFrame(engine, 2536).visible, false);
});

test('timing assist follows the authoritative displayed direction through a Ronin feint', () => {
  const engine = new CombatEngine({ enemies: [ENEMIES[1]] });
  engine.start(0);
  engine.update(1550);
  assert.equal(timingAssistFrame(engine, 1550).direction, Direction.LEFT);

  const feintTime = 1550 + Math.ceil(690 * 0.63);
  engine.update(feintTime);
  assert.equal(engine.currentAttack.feintResolved, true);
  assert.equal(timingAssistFrame(engine, feintTime).direction, Direction.RIGHT);
});

test('timing assist remains presentation-only and is wired into the production document', async () => {
  const engine = new CombatEngine();
  engine.start(0);
  engine.update(1550);
  const before = engine.snapshot(1550);
  timingAssistFrame(engine, 1800);
  const after = engine.snapshot(1550);
  assert.deepEqual(after, before);

  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /src="\.\/src\/timing-assist\.js"/);
});
