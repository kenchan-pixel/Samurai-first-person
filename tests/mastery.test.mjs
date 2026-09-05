import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createMasterySession,
  finishMastery,
  formatMasteryTime,
  isBetterMastery,
  observeMasteryEvent,
} from '../src/mastery.js';

test('mastery tracks manual counters plus automatic riposte damage without counting auto hits as manual counters', () => {
  const session = createMasterySession(1000);
  observeMasteryEvent(session, { type: 'perfect-parry' });
  observeMasteryEvent(session, { type: 'perfect-riposte', detail: { damage: 1 } });
  observeMasteryEvent(session, { type: 'parry' });
  observeMasteryEvent(session, { type: 'parry-miss' });
  observeMasteryEvent(session, { type: 'enemy-guard-break' });
  observeMasteryEvent(session, { type: 'perfect-step-riposte', detail: { damage: 1 } });
  observeMasteryEvent(session, { type: 'counter', detail: { damage: 4 } });
  observeMasteryEvent(session, { type: 'player-hit', detail: { damage: 2 } });

  const report = finishMastery(session, { now: 61000, score: 2400, won: true });
  assert.equal(report.parryAttempts, 3);
  assert.equal(report.parries, 2);
  assert.equal(report.perfectParries, 1);
  assert.equal(report.guardBreaks, 1);
  assert.equal(report.counters, 1);
  assert.equal(report.hitsTaken, 1);
  assert.equal(report.damageTaken, 2);
  assert.equal(report.damageDealt, 6);
  assert.equal(report.elapsedMs, 60000);
});

test('clean high-skill victory earns S grade while defeat cannot', () => {
  const clean = createMasterySession(0);
  for (let i = 0; i < 6; i += 1) {
    observeMasteryEvent(clean, { type: 'perfect-parry' });
    observeMasteryEvent(clean, { type: 'counter', detail: { damage: 3 } });
  }
  observeMasteryEvent(clean, { type: 'enemy-guard-break' });
  observeMasteryEvent(clean, { type: 'enemy-guard-break' });

  const win = finishMastery(clean, { now: 55000, score: 5200, won: true });
  assert.equal(win.grade, 'S');
  assert.ok(win.masteryPoints >= 90);

  const loss = finishMastery(clean, { now: 55000, score: 5200, won: false });
  assert.equal(loss.grade, 'D');
});

test('personal best comparison prioritises mastery then score and time formatting is compact', () => {
  assert.equal(isBetterMastery({ masteryPoints: 90, score: 1000 }, { masteryPoints: 89, score: 9000 }), true);
  assert.equal(isBetterMastery({ masteryPoints: 90, score: 1200 }, { masteryPoints: 90, score: 1000 }), true);
  assert.equal(isBetterMastery({ masteryPoints: 88, score: 9999 }, { masteryPoints: 90, score: 1000 }), false);
  assert.equal(formatMasteryTime(125000), '2:05');
});
