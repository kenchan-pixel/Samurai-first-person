import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CombatEngine, ENEMIES } from '../src/game-core.js';
import { BOSS_PHASE_ONE } from '../src/boss-encounter.js';
import { installChallengeMode, requestChallenge } from '../src/challenge-mode.js';
import { installChallengeMomentum } from '../src/challenge-momentum.js';
import {
  CHALLENGE_TACTIC_CHECKPOINTS,
  CHALLENGE_TACTIC_SCORE_BONUS,
  chooseChallengeTactic,
  installChallengeTactics,
  resolveChallengeTactic,
} from '../src/challenge-tactics.js';

test('challenge tactic checkpoints stay bounded to three between-wave decisions', () => {
  assert.deepEqual(CHALLENGE_TACTIC_CHECKPOINTS, [2, 4, 6]);
});

test('整息 restores at most one HP without changing score', () => {
  assert.deepEqual(resolveChallengeTactic({ choice: 'recover', playerHp: 3, playerMaxHp: 5, score: 700 }), {
    accepted: true,
    choice: 'recover',
    hpDelta: 1,
    scoreDelta: 0,
    playerHp: 4,
    score: 700,
  });
  assert.equal(resolveChallengeTactic({ choice: 'recover', playerHp: 5, playerMaxHp: 5, score: 700 }).hpDelta, 0);
});

test('血誓 trades exactly one HP for bounded challenge score and never consumes the last HP', () => {
  assert.deepEqual(resolveChallengeTactic({ choice: 'blood-vow', playerHp: 4, playerMaxHp: 5, score: 700 }), {
    accepted: true,
    choice: 'blood-vow',
    hpDelta: -1,
    scoreDelta: CHALLENGE_TACTIC_SCORE_BONUS,
    playerHp: 3,
    score: 700 + CHALLENGE_TACTIC_SCORE_BONUS,
  });
  assert.deepEqual(resolveChallengeTactic({ choice: 'blood-vow', playerHp: 1, playerMaxHp: 5, score: 700 }), {
    accepted: false,
    choice: 'blood-vow',
    reason: 'last-hp',
    hpDelta: 0,
    scoreDelta: 0,
    playerHp: 1,
    score: 700,
  });
});

test('installed tactic adapter freezes decision time and restores campaign untouched', () => {
  installChallengeMode(CombatEngine);
  installChallengeMomentum(CombatEngine);
  installChallengeTactics(CombatEngine);

  requestChallenge(true);
  const engine = new CombatEngine({ enemies: [...ENEMIES, BOSS_PHASE_ONE] });
  engine.start(0);
  engine.drainEvents();
  engine.enemyIndex = 1;
  engine.enemyHp = 0;
  engine.phase = 'stage-clear';
  engine.phaseStartedAt = 100;
  engine.phaseEndsAt = 1550;
  engine.events.push({ type: 'enemy-defeated', detail: { enemyId: engine.enemy.id, stage: 2 } });
  engine.drainEvents();
  assert.equal(engine.phaseEndsAt, Infinity, 'wave 2 should wait for a tactical decision');

  engine.update(5100);
  assert.equal(engine.phase, 'stage-clear', 'waiting five seconds at the dialog must not advance combat');
  assert.equal(engine.phaseEndsAt, Infinity, 'the stage remains parked while the choice is open');

  const beforeScore = engine.score;
  const bloodVow = chooseChallengeTactic(engine, 'blood-vow');
  assert.equal(bloodVow.accepted, true);
  assert.equal(engine.playerHp, engine.playerMaxHp - 1);
  assert.equal(engine.score, beforeScore + CHALLENGE_TACTIC_SCORE_BONUS);
  assert.equal(engine.phaseEndsAt, Infinity, 'selection waits for the next authoritative engine clock tick');

  engine.update(9000);
  assert.equal(engine.phase, 'stage-clear', 'decision time must be excluded when the stage-clear clock resumes');
  assert.equal(engine.phaseStartedAt, 9000);
  assert.equal(engine.phaseEndsAt, 10450, 'the full remaining 1450ms stage-clear delay is rebased after the wait');

  engine.update(10449);
  assert.equal(engine.phase, 'stage-clear');
  engine.update(10450);
  assert.equal(engine.phase, 'stage-intro');
  assert.equal(engine.enemyIndex, 2);
  assert.equal(engine.phaseStartedAt, 10450);
  assert.equal(engine.phaseEndsAt, 12000, 'the next opponent still receives the full 1550ms intro');
  engine.update(11999);
  assert.equal(engine.phase, 'stage-intro', 'the next telegraph cannot be fast-forwarded by decision time');

  requestChallenge(false);
  engine.start(13000);
  engine.drainEvents();
  engine.enemyIndex = 1;
  engine.phase = 'stage-clear';
  engine.phaseStartedAt = 13100;
  engine.phaseEndsAt = 13200;
  engine.events.push({ type: 'enemy-defeated', detail: { enemyId: engine.enemy.id, stage: 2 } });
  engine.drainEvents();
  assert.equal(engine.phaseEndsAt, 13200, 'campaign stage clear must not be parked');
  assert.equal(chooseChallengeTactic(engine, 'recover').accepted, false);
});

test('production script order composes tactics outside challenge momentum and before main', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const momentum = html.indexOf('./src/challenge-momentum.js');
  const tactics = html.indexOf('./src/challenge-tactics.js');
  const main = html.indexOf('./src/main.js');
  assert.ok(momentum >= 0 && tactics > momentum && main > tactics);
});
