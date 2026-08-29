import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  generateSamuraiAttacksGlb,
  SAMURAI_GUARD_CLIP,
  SAMURAI_ATTACK_CLIPS,
  SAMURAI_ATTACK_PACK_CLIPS,
  SAMURAI_ATTACK_GRIP,
  SAMURAI_ATTACK_GUARD,
  SAMURAI_ATTACK_GUARD_AXIS,
} from '../tools/generate-samurai-attacks-glb.mjs';
import {
  authoredAttackProgress,
  authoredAttackTransitionSeconds,
  AUTHORED_GUARD_CLIP,
  AUTHORED_ATTACK_CLIPS,
  AUTHORED_PACK_CLIPS,
} from '../src/authored-enemy-attacks.js';

function parseGlbJson(buffer) {
  assert.equal(buffer.readUInt32LE(0), 0x46546c67);
  assert.equal(buffer.readUInt32LE(4), 2);
  assert.equal(buffer.readUInt32LE(8), buffer.length);
  const jsonLength = buffer.readUInt32LE(12);
  assert.equal(buffer.readUInt32LE(16), 0x4e4f534a);
  return JSON.parse(buffer.subarray(20, 20 + jsonLength).toString('utf8').trim());
}

function assertNear(actual, expected, epsilon = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= epsilon, `expected ${actual} to be within ${epsilon} of ${expected}`);
}

test('authored pack emits one player-facing Guard plus four original attack clips on the shared 19-joint rig', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'samurai-attacks-'));
  try {
    const out = join(dir, 'samurai-attacks-v1.glb');
    const info = generateSamuraiAttacksGlb(out);
    const gltf = parseGlbJson(await readFile(out));
    assert.equal(SAMURAI_GUARD_CLIP, 'Guard');
    assert.equal(SAMURAI_GUARD_CLIP, AUTHORED_GUARD_CLIP);
    assert.deepEqual(info.attackClips, ['AttackTop', 'AttackRight', 'AttackBottom', 'AttackLeft']);
    assert.deepEqual(info.attackClips, SAMURAI_ATTACK_CLIPS);
    assert.deepEqual(info.attackClips, AUTHORED_ATTACK_CLIPS);
    assert.deepEqual(info.clips, ['Guard', 'AttackTop', 'AttackRight', 'AttackBottom', 'AttackLeft']);
    assert.deepEqual(info.clips, SAMURAI_ATTACK_PACK_CLIPS);
    assert.deepEqual(info.clips, AUTHORED_PACK_CLIPS);
    assert.equal(info.joints, 19);
    assert.equal(info.grip, 'handr-locked-v1');
    assert.equal(info.grip, SAMURAI_ATTACK_GRIP);
    assert.equal(info.guard, 'player-facing-tip-v1');
    assert.equal(info.guard, SAMURAI_ATTACK_GUARD);
    assert.ok(info.guardAxis[2] > 0.98 && Math.abs(info.guardAxis[0]) < 0.01 && Math.abs(info.guardAxis[1]) < 0.12, `guard axis is not player-facing: ${info.guardAxis.join(',')}`);
    assert.deepEqual(info.guardAxis, [...SAMURAI_ATTACK_GUARD_AXIS]);
    assert.ok(info.bytes > 10_000 && info.bytes < 64_000, `unexpected attack-pack size ${info.bytes}`);
    assert.equal(gltf.meshes, undefined, 'attack pack must remain animation-only');
    assert.equal(gltf.nodes.length, 19);
    assert.equal(gltf.nodes.find((node) => node.name === 'HandR')?.children?.some((index) => gltf.nodes[index]?.name === 'Sword'), true, 'Sword must remain parented directly under HandR');
    assert.deepEqual(gltf.animations.map((animation) => animation.name), info.clips);
    for (const animation of gltf.animations) {
      assert.ok(animation.channels.length >= 10, `${animation.name} did not animate the connected body/arms/hands/sword chain`);
      assert.equal(animation.samplers.length, animation.channels.length);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('authored clip timeline stays continuous across telegraph, strike and recovery', () => {
  assertNear(authoredAttackProgress('telegraph', 0), 0);
  assertNear(authoredAttackProgress('telegraph', 1), 0.34);
  assertNear(authoredAttackProgress('strike', 0), 0.34);
  assertNear(authoredAttackProgress('strike', 1), 0.84);
  assertNear(authoredAttackProgress('recovery', 0), 0.84);
  assertNear(authoredAttackProgress('recovery', 1), 1);
  assertNear(authoredAttackProgress('strike', 1), authoredAttackProgress('recovery', 0));
});

test('telegraph direction changes commit directly to the new authored guard while neutral Guard entry is immediate', () => {
  assert.equal(authoredAttackTransitionSeconds('telegraph', null, 'AttackTop'), 0.055);
  assert.equal(authoredAttackTransitionSeconds('telegraph', 'Guard', 'AttackTop'), 0.055);
  assert.equal(authoredAttackTransitionSeconds('telegraph', 'AttackRight', 'AttackLeft'), 0);
  assert.equal(authoredAttackTransitionSeconds('telegraph', 'AttackTop', 'AttackRight'), 0);
  assert.equal(authoredAttackTransitionSeconds('gap', 'AttackTop', 'Guard'), 0);
  assert.equal(authoredAttackTransitionSeconds('strike', 'AttackRight', 'AttackLeft'), 0.025);
});
