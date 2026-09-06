import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AUTHORED_FEINT_BLEND_SECONDS,
  authoredAttackProgress,
  authoredAttackTransitionSeconds,
} from '../src/authored-enemy-attacks.js';

test('authored feint switches use a bounded full-rig crossfade', () => {
  assert.equal(AUTHORED_FEINT_BLEND_SECONDS, 0.05);
  assert.equal(
    authoredAttackTransitionSeconds('telegraph', 'AttackLeft', 'AttackRight'),
    AUTHORED_FEINT_BLEND_SECONDS,
  );
  assert.equal(
    authoredAttackTransitionSeconds('telegraph', 'AttackBottom', 'AttackTop'),
    AUTHORED_FEINT_BLEND_SECONDS,
  );
});

test('feint crossfade does not change authored timing progress or non-feint transitions', () => {
  assert.equal(authoredAttackProgress('telegraph', 0.62), 0.62 * 0.34);
  assert.equal(authoredAttackTransitionSeconds('telegraph', 'Guard', 'AttackTop'), 0.055);
  assert.equal(authoredAttackTransitionSeconds('strike', 'AttackLeft', 'AttackRight'), 0.025);
  assert.equal(authoredAttackTransitionSeconds('recovery', 'AttackTop', 'Guard'), 0);
});
