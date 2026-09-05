import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CombatEngine, ENEMIES } from '../src/game-core.js';
import { installChallengeMode, requestChallenge } from '../src/challenge-mode.js';
import { installChallengeTactics, chooseChallengeTactic } from '../src/challenge-tactics.js';
import {
  formatChallengeTacticReflection,
  installChallengeTacticReflection,
  summariseChallengeTacticReflection,
} from '../src/challenge-tactic-reflection.js';

test('戰策後果 summarises only resolved immediate next-wave outcomes', () => {
  const summary = summariseChallengeTacticReflection([
    { checkpoint: 2, choice: 'blood-vow', nextStage: 3, hitEvents: 0, result: 'cleared' },
    { checkpoint: 4, choice: 'recover', nextStage: 5, hitEvents: 1, result: 'cleared' },
    { checkpoint: 6, choice: 'blood-vow', nextStage: 7, hitEvents: 2, result: 'defeat' },
    { checkpoint: 8, choice: 'recover', nextStage: 9, hitEvents: 0, result: 'cleared' },
    { checkpoint: 4, choice: 'recover', nextStage: 5, hitEvents: 9, result: null },
  ]);

  assert.deepEqual(summary, {
    resolved: 3,
    hitless: 1,
    hitEvents: 3,
    outcomes: [
      { checkpoint: 2, choice: 'blood-vow', nextStage: 3, hitEvents: 0, result: 'cleared' },
      { checkpoint: 4, choice: 'recover', nextStage: 5, hitEvents: 1, result: 'cleared' },
      { checkpoint: 6, choice: 'blood-vow', nextStage: 7, hitEvents: 2, result: 'defeat' },
    ],
  });
  assert.equal(
    formatChallengeTacticReflection(summary),
    '戰策後果 · 2誓→3無傷 · 4息→5受擊1 · 6誓→7敗（受擊2）',
  );
  assert.equal(formatChallengeTacticReflection(summariseChallengeTacticReflection([])), '');
});

test('composed challenge events bind a choice to only its immediate following wave', async () => {
  installChallengeMode(CombatEngine);
  installChallengeTactics(CombatEngine);
  installChallengeTacticReflection(CombatEngine);
  requestChallenge(true);

  const engine = new CombatEngine({ enemies: ENEMIES });
  engine.start(0);
  engine.drainEvents();

  engine.enemyIndex = 1;
  engine.enemyHp = 0;
  engine.phase = 'stage-clear';
  engine.phaseStartedAt = 100;
  engine.phaseEndsAt = 200;
  engine.events.push({ type: 'enemy-defeated', detail: { enemyId: engine.enemy.id, stage: 2 } });
  engine.drainEvents();
  assert.equal(chooseChallengeTactic(engine, 'blood-vow').accepted, true);

  engine.update(1000);
  engine.update(engine.phaseEndsAt);
  engine.drainEvents();
  assert.equal(engine.enemyIndex, 2);

  engine.events.push({ type: 'player-hit', detail: { damage: 1, playerHp: engine.playerHp } });
  engine.events.push({ type: 'enemy-defeated', detail: { enemyId: engine.enemy.id, stage: 3 } });
  engine.drainEvents();

  engine.events.push({ type: 'defeat', detail: { score: engine.score } });
  const defeat = engine.drainEvents().find((event) => event.type === 'defeat');
  assert.deepEqual(defeat?.detail?.challengeTacticReflection, {
    resolved: 1,
    hitless: 0,
    hitEvents: 1,
    outcomes: [
      { checkpoint: 2, choice: 'blood-vow', nextStage: 3, hitEvents: 1, result: 'cleared' },
    ],
  });

  requestChallenge(false);
});

test('reflection module stays session-only and transport-free', async () => {
  const source = await readFile(new URL('../src/challenge-tactic-reflection.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB/);
  assert.doesNotMatch(source, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/);
  assert.match(source, /event\.type === 'challenge-tactic'/);
  assert.match(source, /event\.type === 'player-hit'/);
  assert.match(source, /event\.type === 'enemy-defeated'/);
  assert.match(source, /CHALLENGE_ACTIVE/);
});
