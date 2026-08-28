const clamp01 = (value) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
const smooth = (value) => {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
};
const cutEase = (value) => {
  const x = clamp01(value);
  return 1 - Math.pow(1 - x, 2.45);
};
const mix = (a, b, t) => a + (b - a) * t;
const mix3 = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
const scale3 = (a, t) => [a[0] * t, a[1] * t, a[2] * t];
const ZERO3 = Object.freeze([0, 0, 0]);

export const STRIKE_CONTACT = 0.56;

const pose = (wind, contact, follow) => Object.freeze({
  wind: Object.freeze(wind),
  contact: Object.freeze(contact),
  follow: Object.freeze(follow),
});

const ATTACKS = Object.freeze([
  Object.freeze({
    id: 'overhead-cut',
    blade: pose([0.04, 0.996, 0.08], [0.00, -0.22, 0.975], [-0.08, -0.92, 0.38]),
    modelY: Object.freeze({ wind: 0.00, contact: 0.00, follow: -0.01 }),
    depthScale: 1.00,
    joints: Object.freeze({
      Chest: pose([-6, 0, 0], [12, 0, 0], [8, 0, 0]),
      UpperArmR: pose([-14, -2, -5], [20, 2, 9], [13, 2, 10]),
      ForearmR: pose([-11, 0, 8], [18, 0, -8], [10, 0, -8]),
      UpperArmL: pose([-12, 2, 5], [16, -2, -9], [10, -2, -10]),
      ForearmL: pose([-10, 0, -8], [15, 0, 8], [9, 0, 8]),
    }),
  }),
  Object.freeze({
    id: 'cross-cut-right',
    blade: pose([0.86, 0.50, 0.08], [0.10, -0.10, 0.99], [-0.92, -0.18, 0.35]),
    modelY: Object.freeze({ wind: -0.02, contact: 0.00, follow: 0.00 }),
    depthScale: 1.05,
    joints: Object.freeze({
      Chest: pose([-1, -13, -5], [7, 25, 9], [4, 17, 7]),
      UpperArmR: pose([-8, -20, -24], [18, 25, 27], [12, 17, 22]),
      ForearmR: pose([-8, -9, 15], [17, 13, -13], [10, 9, -11]),
      UpperArmL: pose([-10, -15, -18], [14, 20, 20], [9, 14, 17]),
      ForearmL: pose([-8, -7, -12], [14, 11, 11], [8, 8, 10]),
    }),
  }),
  Object.freeze({
    id: 'rising-cut',
    blade: pose([0.08, -0.97, 0.23], [0.02, 0.30, 0.953], [-0.10, 0.96, 0.26]),
    modelY: Object.freeze({ wind: -0.16, contact: -0.05, follow: 0.02 }),
    depthScale: 1.12,
    joints: Object.freeze({
      Chest: pose([15, 0, 0], [-13, 0, 0], [-7, 0, 0]),
      UpperArmR: pose([28, -4, 36], [-24, 3, -21], [-13, 2, -27]),
      ForearmR: pose([24, 0, -12], [-27, 0, 11], [-15, 0, 15]),
      UpperArmL: pose([24, 4, -32], [-20, -3, 19], [-11, -2, 24]),
      ForearmL: pose([21, 0, 11], [-23, 0, -10], [-13, 0, -14]),
    }),
  }),
  Object.freeze({
    id: 'cross-cut-left',
    blade: pose([-0.86, 0.50, 0.08], [-0.10, -0.10, 0.99], [0.92, -0.18, 0.35]),
    modelY: Object.freeze({ wind: -0.02, contact: 0.00, follow: 0.00 }),
    depthScale: 1.05,
    joints: Object.freeze({
      Chest: pose([-1, 13, 5], [7, -25, -9], [4, -17, -7]),
      UpperArmR: pose([-10, 15, 18], [14, -20, -20], [9, -14, -17]),
      ForearmR: pose([-8, 7, 12], [14, -11, -11], [8, -8, -10]),
      UpperArmL: pose([-8, 20, 24], [18, -25, -27], [12, -17, -22]),
      ForearmL: pose([-8, 9, -15], [17, -13, 13], [10, -9, 11]),
    }),
  }),
]);

function descriptor(index) {
  return ATTACKS[Math.max(0, Math.min(ATTACKS.length - 1, Number.isFinite(index) ? index | 0 : 0))];
}

function samplePose(spec, phase, progress) {
  const p = clamp01(progress);
  if (phase === 'telegraph') return scale3(spec.wind, 0.22 + smooth(p) * 0.78);
  if (phase === 'strike') {
    if (p <= STRIKE_CONTACT) return mix3(spec.wind, spec.contact, cutEase(p / STRIKE_CONTACT));
    return mix3(spec.contact, spec.follow, smooth((p - STRIKE_CONTACT) / (1 - STRIKE_CONTACT)));
  }
  if (phase === 'recovery' || phase === 'recovery-interrupted') return scale3(spec.follow, 1 - smooth(p));
  return [...ZERO3];
}

function sampleScalar(spec, phase, progress) {
  const p = clamp01(progress);
  if (phase === 'telegraph') return mix(0, spec.wind, 0.22 + smooth(p) * 0.78);
  if (phase === 'strike') {
    if (p <= STRIKE_CONTACT) return mix(spec.wind, spec.contact, cutEase(p / STRIKE_CONTACT));
    return mix(spec.contact, spec.follow, smooth((p - STRIKE_CONTACT) / (1 - STRIKE_CONTACT)));
  }
  if (phase === 'recovery' || phase === 'recovery-interrupted') return mix(spec.follow, 0, smooth(p));
  return 0;
}

export function enemyAttackDescriptor(index) {
  return descriptor(index);
}

export function enemyAttackChoreographyFrame(phase, progress, directionIndex) {
  const attack = descriptor(directionIndex);
  const joints = {};
  for (const [name, spec] of Object.entries(attack.joints)) joints[name] = samplePose(spec, phase, progress);
  return {
    id: attack.id,
    blade: attack.blade,
    joints,
    modelY: sampleScalar(attack.modelY, phase, progress),
    depthScale: attack.depthScale,
  };
}
