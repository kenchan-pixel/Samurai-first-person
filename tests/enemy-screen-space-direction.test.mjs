import test from 'node:test';
import assert from 'node:assert/strict';
import { ENEMY_DIRECTION_SEMANTICS, enemyDirectionIndexFromPlayerIndex } from '../src/enemy-screen-space-direction.js';

test('enemy horizontal presentation mirrors opponent-local sides into player screen-space semantics', () => {
  assert.equal(ENEMY_DIRECTION_SEMANTICS, 'player-screen-travel-v1');
  assert.equal(enemyDirectionIndexFromPlayerIndex(0), 0);
  assert.equal(enemyDirectionIndexFromPlayerIndex(1), 3);
  assert.equal(enemyDirectionIndexFromPlayerIndex(2), 2);
  assert.equal(enemyDirectionIndexFromPlayerIndex(3), 1);
});
