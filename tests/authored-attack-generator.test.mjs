import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateSamuraiAttacksGlb, SAMURAI_ATTACK_CLIPS } from '../tools/generate-samurai-attacks-glb.mjs';
import { authoredAttackProgress, AUTHORED_ATTACK_CLIPS } from '../src/authored-enemy-attacks.js';

function parseGlbJson(buffer) {
  assert.equal(buffer.readUInt32LE(0), 0x46546c67);
  assert.equal(buffer.readUInt32LE(4), 2);
  assert.equal(buffer.readUInt32LE(8), buffer.length);
  const jsonLength = buffer.readUInt32LE(12);
  assert.equal(buffer.readUInt32LE(16), 0x4e4f534a);
  return JSON.parse(buffer.subarray(20, 20 + jsonLength).toString('utf8').trim());
}

test('directional attack generator emits four original animation-only clips on the shared 19-joint rig', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'samurai-attacks-'));
  try {
    const out = join(dir, 'samurai-attacks-v1.glb');
    const info = generateSamuraiAttacksGlb(out);
    const gltf = parseGlbJson(await readFile(out));
    assert.deepEqual(info.clips, ['AttackTop', 'AttackRight', 'AttackBottom', 'AttackLeft']);
    assert.deepEqual(info.clips, SAMURAI_ATTACK_CLIPS);
    assert.deepEqual(info.clips, AUTHORED_ATTACK_CLIPS);
    assert.equal(info.joints, 19);
    assert.ok(info.bytes > 10_000 && info.bytes < 64_000, `unexpected attack-pack size ${info.bytes}`);
    assert.equal(gltf.meshes, undefined, 'attack pack must remain animation-only');
    assert.equal(gltf.nodes.length, 19);
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
  assert.equal(authoredAttackProgress('telegraph', 0), 0);
  assert.equal(authoredAttackProgress('telegraph', 1), 0.34);
  assert.equal(authoredAttackProgress('strike', 0), 0.34);
  assert.equal(authoredAttackProgress('strike', 1), 0.84);
  assert.equal(authoredAttackProgress('recovery', 0), 0.84);
  assert.equal(authoredAttackProgress('recovery', 1), 1);
});
