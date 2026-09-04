import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatEngine, ENEMIES } from '../src/game-core.js';
import {
  AttackRhythm,
  attackRhythmFrame,
  attackRhythmProfile,
} from '../src/attack-rhythm.js';

const assertNear = (actual, expected, epsilon = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= epsilon, `expected ${actual} ≈ ${expected}`);
};

test('attack rhythm reads the exact current authoritative attack timing without changing it', () => {
  const engine = new CombatEngine();
  engine.start(0);
  engine.update(1550);
  const snapshot = engine.snapshot(2150);
  assert.equal(snapshot.attack.telegraphMs, 880);
  assert.equal(snapshot.attack.strikeMs, 330);
  assert.equal(engine.currentAttack.telegraphMs, 880);
  assert.equal(engine.currentAttack.strikeMs, 330);
  assert.equal(attackRhythmProfile(snapshot.attack), AttackRhythm.MEASURED);
});

test('existing timing families map to measured, standard, quick and heavy presentation', () => {
  assert.equal(attackRhythmProfile({ telegraphMs: 880, strikeMs: 330 }), AttackRhythm.MEASURED);
  assert.equal(attackRhythmProfile({ telegraphMs: 560, strikeMs: 225 }), AttackRhythm.STANDARD);
  assert.equal(attackRhythmProfile({ telegraphMs: 455, strikeMs: 180 }), AttackRhythm.QUICK);
  assert.equal(attackRhythmProfile({ telegraphMs: 900, strikeMs: 195, heavy: true }), AttackRhythm.HEAVY);
  assert.equal(attackRhythmProfile(null), AttackRhythm.STANDARD);
});

test('measured and quick profiles create distinct bounded motion while standard/heavy stay neutral here', () => {
  const measured = attackRhythmFrame({ phase: 'telegraph', phaseProgress: 0.7, attack: { telegraphMs: 880, strikeMs: 330 } });
  assert.equal(measured.profile, AttackRhythm.MEASURED);
  assert.ok(measured.load > 0.8);
  assert.ok(measured.bodyY < -0.025 && measured.bodyY > -0.05);
  assert.ok(measured.bodyZ < -0.025 && measured.bodyZ > -0.05);
  assert.ok(measured.trailLengthGain > 0.05 && measured.trailLengthGain < 0.12);

  const quick = attackRhythmFrame({ phase: 'strike', phaseProgress: 0.4, attack: { telegraphMs: 455, strikeMs: 180 } });
  assert.equal(quick.profile, AttackRhythm.QUICK);
  assert.ok(quick.drive > 0.95);
  assert.ok(quick.bodyZ > 0.075 && quick.bodyZ < 0.12);
  assert.ok(quick.trailLengthGain > 0.20 && quick.trailLengthGain < 0.31);

  for (const attack of [
    { telegraphMs: 560, strikeMs: 225 },
    { telegraphMs: 900, strikeMs: 195, heavy: true },
  ]) {
    const frame = attackRhythmFrame({ phase: 'strike', phaseProgress: 0.5, attack });
    assertNear(frame.bodyY, 0);
    assertNear(frame.bodyZ, 0);
    assertNear(frame.bodyPitch, 0);
    assertNear(frame.trailWidthGain, 0);
    assertNear(frame.trailLengthGain, 0);
  }
});

test('quick recovery settles toward neutral instead of leaving a permanent root offset', () => {
  const early = attackRhythmFrame({ phase: 'recovery', phaseProgress: 0.15, attack: { telegraphMs: 420, strikeMs: 140 } });
  const late = attackRhythmFrame({ phase: 'recovery', phaseProgress: 0.95, attack: { telegraphMs: 420, strikeMs: 140 } });
  assert.ok(early.follow > late.follow);
  assert.ok(Math.abs(early.bodyZ) > Math.abs(late.bodyZ));
  assert.ok(Math.abs(early.bodyPitch) > Math.abs(late.bodyPitch));
});

test('baseline enemy timing still exposes all four rhythm families without rewriting attack definitions', () => {
  const profiles = new Set(ENEMIES.flatMap((enemy) => enemy.attacks.map(attackRhythmProfile)));
  assert.ok(profiles.has(AttackRhythm.MEASURED));
  assert.ok(profiles.has(AttackRhythm.STANDARD));
  assert.ok(profiles.has(AttackRhythm.QUICK));
  assert.ok(profiles.has(AttackRhythm.HEAVY));
});
