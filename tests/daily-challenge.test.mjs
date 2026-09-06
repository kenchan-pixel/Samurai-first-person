import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatEngine, ENEMIES } from '../src/game-core.js';
import { BOSS_ID, BOSS_PHASE_ONE } from '../src/boss-encounter.js';
import {
  CHALLENGE_STAGE_COUNT,
  createChallengeEnemies,
  installChallengeMode,
  requestChallenge,
} from '../src/challenge-mode.js';
import {
  DAILY_CHALLENGE_ACTIVE,
  createDailyChallengeEnemies,
  dailyChallengeDateKey,
  dailyChallengeSeed,
  installDailyChallenge,
  requestDailyChallenge,
} from '../src/daily-challenge.js';

function attackFingerprint(attacks) {
  return attacks
    .map((attack) => [
      attack.direction,
      attack.feintFrom || '',
      attack.telegraphMs,
      attack.strikeMs,
      attack.damage,
      Boolean(attack.heavy),
    ].join(':'))
    .sort();
}

test('今日陣 is deterministic and preserves the existing challenge rule values', () => {
  const key = '2026-09-01';
  const first = createDailyChallengeEnemies(key);
  const second = createDailyChallengeEnemies(key);
  const base = createChallengeEnemies();

  assert.equal(first.length, CHALLENGE_STAGE_COUNT);
  assert.equal(dailyChallengeDateKey(key), key);
  assert.equal(dailyChallengeSeed(key), dailyChallengeSeed(key));
  assert.deepEqual(first.map((enemy) => enemy.name), second.map((enemy) => enemy.name));
  assert.deepEqual(first.map((enemy) => enemy.attacks.map((attack) => attack.direction)), second.map((enemy) => enemy.attacks.map((attack) => attack.direction)));
  assert.deepEqual(first.slice(0, 3).map((enemy) => enemy.id), ENEMIES.map((enemy) => enemy.id));
  assert.equal(first.at(-1).id, BOSS_ID);
  assert.equal(first[6].id, base[6].id);
  assert.equal(first[6].name, base[6].name);
  assert.deepEqual(
    [...first.slice(3, 6).map((enemy) => enemy.name)].sort(),
    [...base.slice(3, 6).map((enemy) => enemy.name)].sort(),
  );

  for (let stage = 3; stage <= 6; stage += 1) {
    const actual = first[stage];
    const source = base.slice(3, 7).find((enemy) => enemy.id === actual.id && enemy.name === actual.name);
    assert.ok(source, `missing source pressure enemy for stage ${stage + 1}`);
    assert.equal(actual.maxHp, source.maxHp);
    assert.equal(actual.postureMax, source.postureMax);
    assert.equal(actual.gapMs, source.gapMs);
    assert.equal(actual.recoveryMs, source.recoveryMs);
    assert.equal(actual.perfectWindowMs, source.perfectWindowMs);
    assert.deepEqual(attackFingerprint(actual.attacks), attackFingerprint(source.attacks));
    assert.match(actual.title, /^今日陣 /);
  }
});

test('今日陣 composes only over challenge and restores standard challenge/campaign', () => {
  installChallengeMode(CombatEngine);
  installDailyChallenge(CombatEngine);
  const baseline = [...ENEMIES, BOSS_PHASE_ONE];
  const combat = new CombatEngine({ enemies: baseline });

  requestChallenge(true);
  requestDailyChallenge(true, '2026-09-01');
  combat.start(100);
  assert.equal(combat[DAILY_CHALLENGE_ACTIVE], true);
  assert.equal(combat.snapshot(100).stageCount, CHALLENGE_STAGE_COUNT);
  assert.deepEqual(
    combat.enemies.map((enemy) => enemy.name),
    createDailyChallengeEnemies('2026-09-01').map((enemy) => enemy.name),
  );
  assert.equal(combat.enemies.at(-1).id, BOSS_ID);

  requestDailyChallenge(false);
  requestChallenge(true);
  combat.start(200);
  assert.equal(combat[DAILY_CHALLENGE_ACTIVE], false);
  assert.deepEqual(combat.enemies.map((enemy) => enemy.name), createChallengeEnemies().map((enemy) => enemy.name));

  requestChallenge(false);
  combat.start(300);
  assert.equal(combat.snapshot(300).stageCount, baseline.length);
  assert.deepEqual(combat.enemies.map((enemy) => enemy.id), baseline.map((enemy) => enemy.id));
});
