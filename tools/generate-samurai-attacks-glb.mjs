import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const defaultOut = resolve(here, '../public/assets/samurai-attacks-v1.glb');
const isCli = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const cliOutPath = isCli && process.argv[2] ? resolve(process.argv[2]) : defaultOut;
const rad = (degrees) => degrees * Math.PI / 180;
const quat = (xd = 0, yd = 0, zd = 0) => {
  const [x, y, z] = [rad(xd), rad(yd), rad(zd)];
  const [cx, sx, cy, sy, cz, sz] = [Math.cos(x / 2), Math.sin(x / 2), Math.cos(y / 2), Math.sin(y / 2), Math.cos(z / 2), Math.sin(z / 2)];
  return [sx * cy * cz + cx * sy * sz, cx * sy * cz - sx * cy * sz, cx * cy * sz + sx * sy * cz, cx * cy * cz - sx * sy * sz];
};
const qmul = (a, b) => {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
};
const qnormalize = (q) => {
  const length = Math.hypot(...q) || 1;
  return q.map((value) => value / length);
};
const qinverse = (q) => {
  const [x, y, z, w] = qnormalize(q);
  return [-x, -y, -z, w];
};
const normalizeAxis = (axis) => {
  const length = Math.hypot(...axis) || 1;
  return axis.map((value) => value / length);
};
const mixAxis = (a, b, t) => normalizeAxis(a.map((value, index) => value + (b[index] - value) * t));
const quatFromUp = (axis) => {
  const [x, y, z] = normalizeAxis(axis);
  if (y < -0.999) return [1, 0, 0, 0];
  return qnormalize([z, 0, -x, 1 + y]);
};

const jointSpecs = [
  ['Root', null, [0, 0, 0]], ['Hips', 'Root', [0, 0.92, 0]], ['Spine', 'Hips', [0, 0.38, 0]], ['Chest', 'Spine', [0, 0.42, 0]],
  ['Neck', 'Chest', [0, 0.53, 0]], ['Head', 'Neck', [0, 0.22, 0]],
  ['UpperArmL', 'Chest', [-0.43, 0.26, 0]], ['ForearmL', 'UpperArmL', [0, -0.37, 0]], ['HandL', 'ForearmL', [0, -0.34, 0]],
  ['UpperArmR', 'Chest', [0.43, 0.26, 0]], ['ForearmR', 'UpperArmR', [0, -0.37, 0]], ['HandR', 'ForearmR', [0, -0.34, 0]], ['Sword', 'HandR', [0, -0.10, 0]],
  ['ThighL', 'Hips', [-0.18, -0.20, 0]], ['ShinL', 'ThighL', [0, -0.44, 0]], ['FootL', 'ShinL', [0, -0.36, 0.10]],
  ['ThighR', 'Hips', [0.18, -0.20, 0]], ['ShinR', 'ThighR', [0, -0.44, 0]], ['FootR', 'ShinR', [0, -0.36, 0.10]],
];
const jointIndex = Object.fromEntries(jointSpecs.map(([name], index) => [name, index]));

const chunks = [];
const views = [];
const accessors = [];
let byteLength = 0;
const align4 = () => {
  const pad = (4 - (byteLength % 4)) % 4;
  if (pad) { chunks.push(Buffer.alloc(pad)); byteLength += pad; }
};
const addView = (data) => {
  align4();
  const byteOffset = byteLength;
  chunks.push(data);
  byteLength += data.length;
  align4();
  views.push({ buffer: 0, byteOffset, byteLength: data.length });
  return views.length - 1;
};
const packFloats = (values) => {
  const buffer = Buffer.alloc(values.length * 4);
  values.forEach((value, index) => buffer.writeFloatLE(value, index * 4));
  return buffer;
};
const addAccessor = (values, type, count, min, max) => {
  const accessor = { bufferView: addView(packFloats(values)), componentType: 5126, count, type };
  if (min) accessor.min = min;
  if (max) accessor.max = max;
  accessors.push(accessor);
  return accessors.length - 1;
};

const neutral = Object.freeze({
  hips: [0, 0.92, 0],
  spine: [0, 0, 0], chest: [-1, 0, 0], head: [0, 0, 0],
  upperArmR: [-22, 0, -18], forearmR: [-20, 0, 6], handR: [0, 0, 0],
  upperArmL: [-18, 0, 18], forearmL: [-18, 0, -5], handL: [0, 0, 0],
  sword: [0, 0, -18],
});
const frame = (time, pose = {}) => ({ time, ...neutral, ...pose });
const guardFrames = [frame(0), frame(1)];

// Vertical cuts keep the same combat phase timing and six-keyframe budget as the
// lateral attacks, but use a small cross-body coil/release so the two-handed rig
// follows the katana instead of reading like a planar arm hinge. The bottom cut also
// rises from a loaded stance progressively rather than popping the hips at contact.
const attacks = {
  AttackTop: [
    frame(0),
    frame(0.30, { hips: [-0.025, 0.90, 0.075], spine: [-8, -5, -2], chest: [-17, -10, -5], head: [6, 6, 2], upperArmR: [-111, -12, -27], forearmR: [-69, 8, 19], handR: [-8, 0, -12], upperArmL: [-100, 10, 27], forearmL: [-66, -7, -16], handL: [-5, 0, 10], sword: [0, 0, -102] }),
    frame(0.50, { hips: [-0.01, 0.925, -0.035], spine: [0, -2, 0], chest: [1, -3, 1], head: [1, 2, 0], upperArmR: [-69, -2, -7], forearmR: [-42, 4, 12], handR: [-3, 0, -4], upperArmL: [-64, 3, 10], forearmL: [-40, -4, -9], handL: [-2, 0, 4], sword: [0, 0, -42] }),
    frame(0.68, { hips: [0.018, 0.945, -0.15], spine: [9, 4, 2], chest: [16, 8, 5], head: [-4, -5, -1], upperArmR: [-25, 10, 24], forearmR: [-15, 2, 5], handR: [5, 0, 8], upperArmL: [-29, -8, -23], forearmL: [-19, -2, 4], handL: [4, 0, -8], sword: [0, 0, 15] }),
    frame(0.84, { hips: [0.03, 0.93, -0.105], spine: [8, 7, 4], chest: [14, 13, 9], head: [-3, -8, -2], upperArmR: [8, 14, 46], forearmR: [-7, 1, 2], handR: [8, 0, 14], upperArmL: [-1, -12, -39], forearmL: [-10, -1, 2], handL: [6, 0, -12], sword: [0, 0, 74] }),
    frame(1),
  ],
  AttackRight: [
    frame(0),
    frame(0.30, { hips: [0.05, 0.91, 0.06], spine: [-4, -16, -7], chest: [-6, -30, -12], head: [2, 14, 4], upperArmR: [-72, -22, -70], forearmR: [-48, 12, 20], handR: [0, -10, -18], upperArmL: [-58, 18, -54], forearmL: [-46, -10, -12], handL: [0, 8, 12], sword: [8, -10, -72] }),
    frame(0.50, { hips: [-0.02, 0.93, -0.04], spine: [2, 0, 0], chest: [4, 4, 3], head: [0, 0, 0], upperArmR: [-42, 2, -22], forearmR: [-30, 5, 10], handR: [0, -3, -6], upperArmL: [-36, -2, -16], forearmL: [-30, -4, -5], handL: [0, 2, 5], sword: [4, -2, -24] }),
    frame(0.68, { hips: [-0.09, 0.94, -0.15], spine: [7, 18, 8], chest: [10, 34, 16], head: [-2, -17, -4], upperArmR: [-12, 26, 34], forearmR: [-13, 8, 7], handR: [0, 8, 10], upperArmL: [-18, -22, -32], forearmL: [-16, -8, 5], handL: [0, -7, -8], sword: [-3, 8, 14] }),
    frame(0.84, { hips: [-0.11, 0.93, -0.09], spine: [5, 13, 7], chest: [8, 23, 13], head: [-1, -10, -3], upperArmR: [3, 18, 48], forearmR: [-7, 4, 2], handR: [0, 6, 11], upperArmL: [-3, -16, -44], forearmL: [-9, -5, 2], handL: [0, -5, -10], sword: [-2, 5, 62] }),
    frame(1),
  ],
  AttackBottom: [
    frame(0),
    frame(0.30, { hips: [-0.035, 0.82, 0.055], spine: [10, -6, 4], chest: [15, -12, 9], head: [-5, 7, -2], upperArmR: [5, -10, 38], forearmR: [-14, 6, 20], handR: [8, 0, 18], upperArmL: [1, 9, -32], forearmL: [-16, -5, -17], handL: [7, 0, -14], sword: [0, 0, 96] }),
    frame(0.50, { hips: [-0.015, 0.86, -0.04], spine: [5, -3, 2], chest: [7, -6, 4], head: [-2, 4, -1], upperArmR: [-30, -4, 16], forearmR: [-25, 3, 13], handR: [4, 0, 10], upperArmL: [-28, 4, -15], forearmL: [-24, -3, -9], handL: [4, 0, -8], sword: [0, 0, 55] }),
    frame(0.68, { hips: [0.015, 0.92, -0.15], spine: [-5, 4, -2], chest: [-10, 8, -7], head: [4, -5, 2], upperArmR: [-72, 10, -12], forearmR: [-44, 2, 9], handR: [-4, 0, -8], upperArmL: [-66, -8, 14], forearmL: [-42, -2, -8], handL: [-4, 0, 8], sword: [0, 0, -22] }),
    frame(0.84, { hips: [0.03, 0.945, -0.10], spine: [-8, 7, -4], chest: [-14, 13, -10], head: [4, -8, 2], upperArmR: [-98, 15, -24], forearmR: [-62, 2, 14], handR: [-7, 0, -12], upperArmL: [-90, -12, 25], forearmL: [-58, -2, -13], handL: [-6, 0, 11], sword: [0, 0, -88] }),
    frame(1),
  ],
  AttackLeft: [
    frame(0),
    frame(0.30, { hips: [-0.05, 0.91, 0.06], spine: [-4, 16, 7], chest: [-6, 30, 12], head: [2, -14, -4], upperArmR: [-72, 22, 70], forearmR: [-48, -12, -20], handR: [0, 10, 18], upperArmL: [-58, -18, 54], forearmL: [-46, 10, 12], handL: [0, -8, -12], sword: [-8, 10, 72] }),
    frame(0.50, { hips: [0.02, 0.93, -0.04], spine: [2, 0, 0], chest: [4, -4, -3], head: [0, 0, 0], upperArmR: [-42, -2, 22], forearmR: [-30, -5, -10], handR: [0, 3, 6], upperArmL: [-36, 2, 16], forearmL: [-30, 4, 5], handL: [0, -2, -5], sword: [-4, 2, 24] }),
    frame(0.68, { hips: [0.09, 0.94, -0.15], spine: [7, -18, -8], chest: [10, -34, -16], head: [-2, 17, 4], upperArmR: [-12, -26, -34], forearmR: [-13, -8, -7], handR: [0, -8, -10], upperArmL: [-18, 22, 32], forearmL: [-16, 8, -5], handL: [0, 7, 8], sword: [3, -8, -14] }),
    frame(0.84, { hips: [0.11, 0.93, -0.09], spine: [5, -13, -7], chest: [8, -23, -13], head: [-1, 10, 3], upperArmR: [3, -18, -48], forearmR: [-7, -4, -2], handR: [0, -6, -11], upperArmL: [-3, 16, 44], forearmL: [-9, 5, -2], handL: [0, 5, 10], sword: [2, -5, -62] }),
    frame(1),
  ],
};

// Pack-local AttackRight/AttackLeft labels describe the opponent rig's authored side.
// The production renderer mirrors those horizontal indices at the presentation boundary
// so CombatEngine RIGHT/LEFT remain defined in the player's screen space.
const bladePaths = Object.freeze({
  AttackTop: Object.freeze({ wind: [0.14, 0.985, 0.105], contact: [0.02, -0.10, 0.995], follow: [-0.15, -0.80, 0.58] }),
  AttackRight: Object.freeze({ wind: [0.90, 0.42, 0.12], contact: [0.06, -0.08, 0.995], follow: [-0.79, -0.20, 0.58] }),
  AttackBottom: Object.freeze({ wind: [-0.16, -0.965, 0.205], contact: [0.02, 0.16, 0.987], follow: [0.18, 0.80, 0.57] }),
  AttackLeft: Object.freeze({ wind: [-0.90, 0.42, 0.12], contact: [-0.06, -0.08, 0.995], follow: [0.79, -0.20, 0.58] }),
});
const PLAYER_GUARD_AXIS = Object.freeze([0.00, 0.10, 0.995]);
const swordGripQuat = qnormalize(quat(...neutral.sword));
const upstreamWorldQuat = (pose) => [pose.spine, pose.chest, pose.upperArmR, pose.forearmR]
  .reduce((world, euler) => qmul(world, quat(...euler)), [0, 0, 0, 1]);
const playerGuardQuat = quatFromUp(PLAYER_GUARD_AXIS);
const targetWorldQuats = (name, frameCount) => {
  if (name === 'Guard') return Array.from({ length: frameCount }, () => playerGuardQuat);
  const path = bladePaths[name];
  return [
    playerGuardQuat,
    quatFromUp(path.wind),
    quatFromUp(mixAxis(path.wind, path.contact, 0.55)),
    quatFromUp(path.contact),
    quatFromUp(path.follow),
    playerGuardQuat,
  ];
};
const solvedHandQuat = (pose, targetWorldQuat) => qnormalize(
  qmul(qmul(qinverse(upstreamWorldQuat(pose)), targetWorldQuat), qinverse(swordGripQuat)),
);

const channelMap = Object.freeze({
  hips: ['Hips', 'translation'],
  spine: ['Spine', 'rotation'],
  chest: ['Chest', 'rotation'],
  head: ['Head', 'rotation'],
  upperArmR: ['UpperArmR', 'rotation'],
  forearmR: ['ForearmR', 'rotation'],
  handR: ['HandR', 'rotation'],
  upperArmL: ['UpperArmL', 'rotation'],
  forearmL: ['ForearmL', 'rotation'],
  handL: ['HandL', 'rotation'],
  sword: ['Sword', 'rotation'],
});
const animationFrames = Object.freeze({ Guard: guardFrames, ...attacks });
const animations = [];
for (const [name, frames] of Object.entries(animationFrames)) {
  const samplers = [];
  const channels = [];
  const worldTargets = targetWorldQuats(name, frames.length);
  for (const [key, [joint, path]] of Object.entries(channelMap)) {
    const times = frames.map(({ time }) => time);
    const values = frames.flatMap((pose, index) => {
      if (path !== 'rotation') return pose[key];
      if (key === 'handR') return solvedHandQuat(pose, worldTargets[index]);
      if (key === 'sword') return swordGripQuat;
      return quat(...pose[key]);
    });
    const input = addAccessor(times, 'SCALAR', times.length, [times[0]], [times.at(-1)]);
    const output = addAccessor(values, path === 'rotation' ? 'VEC4' : 'VEC3', times.length);
    const sampler = samplers.length;
    samplers.push({ input, output, interpolation: 'LINEAR' });
    channels.push({ sampler, target: { node: jointIndex[joint], path } });
  }
  animations.push({ name, samplers, channels });
}

const nodes = jointSpecs.map(([name, , translation]) => ({ name, translation: [...translation] }));
for (let i = 0; i < jointSpecs.length; i += 1) {
  const children = [];
  for (let j = 0; j < jointSpecs.length; j += 1) if (jointSpecs[j][1] === jointSpecs[i][0]) children.push(j);
  if (children.length) nodes[i].children = children;
}

align4();
const bin = Buffer.concat(chunks);
const gltf = {
  asset: { version: '2.0', generator: 'Samurai-first-person authored directional attack pack v5 vertical-cut continuity', copyright: 'Original project animation asset; see docs/ASSET_PROVENANCE.md' },
  scene: 0,
  scenes: [{ name: 'SamuraiAttackRig', nodes: [jointIndex.Root] }],
  nodes,
  animations,
  buffers: [{ byteLength: bin.length }],
  bufferViews: views,
  accessors,
};
let json = Buffer.from(JSON.stringify(gltf));
while (json.length % 4) json = Buffer.concat([json, Buffer.from(' ')]);
const total = 12 + 8 + json.length + 8 + bin.length;
const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(total, 8);
const jsonHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(json.length, 0);
jsonHeader.writeUInt32LE(0x4e4f534a, 4);
const binHeader = Buffer.alloc(8);
binHeader.writeUInt32LE(bin.length, 0);
binHeader.writeUInt32LE(0x004e4942, 4);
const glb = Buffer.concat([header, jsonHeader, json, binHeader, bin]);
if (glb.readUInt32LE(0) !== 0x46546c67 || glb.readUInt32LE(4) !== 2 || glb.readUInt32LE(8) !== glb.length) throw new Error('Attack GLB self-validation failed');

export const SAMURAI_GUARD_CLIP = 'Guard';
export const SAMURAI_ATTACK_CLIPS = Object.freeze(Object.keys(attacks));
export const SAMURAI_ATTACK_PACK_CLIPS = Object.freeze([SAMURAI_GUARD_CLIP, ...SAMURAI_ATTACK_CLIPS]);
export const SAMURAI_ATTACK_GRIP = 'handr-locked-v1';
export const SAMURAI_ATTACK_GUARD = 'player-facing-tip-v1';
export const SAMURAI_ATTACK_GUARD_AXIS = Object.freeze([...normalizeAxis(PLAYER_GUARD_AXIS)]);
export function generateSamuraiAttacksGlb(outPath = defaultOut) {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, glb);
  return {
    path: outPath,
    bytes: glb.length,
    clips: [...SAMURAI_ATTACK_PACK_CLIPS],
    attackClips: [...SAMURAI_ATTACK_CLIPS],
    joints: jointSpecs.length,
    grip: SAMURAI_ATTACK_GRIP,
    guard: SAMURAI_ATTACK_GUARD,
    guardAxis: [...SAMURAI_ATTACK_GUARD_AXIS],
  };
}

if (isCli) {
  const info = generateSamuraiAttacksGlb(cliOutPath);
  console.log(`generated ${info.path} (${info.bytes} bytes, ${info.joints} joints, ${info.clips.length} clips, ${info.grip}, ${info.guard})`);
}
