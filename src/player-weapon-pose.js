const clamp01 = (value) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

const BASE = Object.freeze({
  forearmRPosition: Object.freeze([0.18, -0.48, 0.11]),
  forearmLPosition: Object.freeze([-0.17, -0.58, 0.14]),
  handRPosition: Object.freeze([0.075, -0.13, 0.045]),
  handLPosition: Object.freeze([-0.07, -0.29, 0.055]),
  cuffRPosition: Object.freeze([0.12, -0.30, 0.075]),
  cuffLPosition: Object.freeze([-0.12, -0.45, 0.09]),
  forearmREuler: Object.freeze([-8, 0, -22]),
  forearmLEuler: Object.freeze([-12, 0, 19]),
  handREuler: Object.freeze([0, 0, -10]),
  handLEuler: Object.freeze([0, 0, 10]),
  cuffREuler: Object.freeze([0, 0, -16]),
  cuffLEuler: Object.freeze([0, 0, 16]),
});

const TOP_PARRY_FRAME_X = -0.22;
const RIGHT_PARRY_FRAME_X = -0.52;
const BOTTOM_PARRY_FRAME_X = -0.52;
const BOTTOM_PARRY_FRAME_Y = 0.10;
const BOTTOM_PARRY_ROLL = -26;
const BOTTOM_PARRY_RIGHT_SUPPORT_TUCK_X = -0.14;
const BOTTOM_PARRY_RIGHT_FOREARM_ROLL = 28;
const BOTTOM_COUNTER_FRAME_X = -0.30;
const BOTTOM_COUNTER_FRAME_Y = 0.10;
const add3 = (base, x = 0, y = 0, z = 0) => [base[0] + x, base[1] + y, base[2] + z];

export function normalizePlayerDirectionIndex(value) {
  const direction = Number.isFinite(value) ? Math.trunc(value) : 0;
  return direction >= 0 && direction <= 3 ? direction : 0;
}

function playerRigFramingOffset(action, direction, pulse) {
  if (pulse <= 0) return [0, 0, 0];
  if ((action === 1 || action === 2) && direction === 0) {
    return [TOP_PARRY_FRAME_X * pulse, 0, 0];
  }
  if ((action === 1 || action === 2) && direction === 1) {
    return [RIGHT_PARRY_FRAME_X * pulse, 0, 0];
  }
  if ((action === 1 || action === 2) && direction === 2) {
    return [BOTTOM_PARRY_FRAME_X * pulse, BOTTOM_PARRY_FRAME_Y * pulse, 0];
  }
  if (action === 3 && direction === 2) {
    return [BOTTOM_COUNTER_FRAME_X * pulse, BOTTOM_COUNTER_FRAME_Y * pulse, 0];
  }
  return [0, 0, 0];
}

function playerRigEulerOffset(action, direction, pulse) {
  if ((action === 1 || action === 2) && direction === 2 && pulse > 0) {
    return [0, 0, BOTTOM_PARRY_ROLL * pulse];
  }
  return [0, 0, 0];
}

export function playerWeaponPose(action = 0, directionIndex = 0, progress = 1) {
  const safeAction = Number.isFinite(action) ? Math.trunc(action) : 0;
  const direction = normalizePlayerDirectionIndex(directionIndex);
  const p = clamp01(progress);
  const pulse = safeAction && p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0;
  const attack = safeAction === 3;
  const perfect = safeAction === 2;
  const strength = pulse * (perfect ? 1.08 : 1);
  const side = direction === 1 ? 1 : direction === 3 ? -1 : 0;
  const vertical = direction === 0 ? 1 : direction === 2 ? -1 : 0;
  const bottomParry = (safeAction === 1 || safeAction === 2) && direction === 2;
  const bottomParryRightSupportTuck = bottomParry ? BOTTOM_PARRY_RIGHT_SUPPORT_TUCK_X * pulse : 0;
  const bottomParryRightForearmRoll = bottomParry ? BOTTOM_PARRY_RIGHT_FOREARM_ROLL * pulse : 0;

  // The complete player katana rig owns the large directional blade motion. These
  // offsets keep the visible two-hand support compact around the handle. At BOTTOM
  // parry the dominant/right support tucks toward the handle centre and the long
  // forearm splays across the grip rather than standing through the blade lane.
  const lateral = side * strength * (attack ? 0.035 : 0.045);
  const lift = vertical * strength * (attack ? 0.025 : 0.055);
  const depth = -strength * (attack ? 0.018 : 0.012);
  const yaw = side * strength * (attack ? 12 : 16);
  const pitch = vertical * strength * (attack ? 5 : 8);
  const roll = side * strength * (attack ? 8 : 10);

  const attackR = attack ? 18 * pulse : 9 * pulse;
  const attackL = attack ? 13 * pulse : 7 * pulse;
  const attackRollR = attack ? -18 * pulse : -8 * pulse;
  const attackRollL = attack ? 14 * pulse : 7 * pulse;

  return {
    action: safeAction,
    direction,
    progress: p,
    pulse,
    rigFramingOffset: playerRigFramingOffset(safeAction, direction, pulse),
    rigEulerOffset: playerRigEulerOffset(safeAction, direction, pulse),
    forearmRPosition: add3(BASE.forearmRPosition, lateral + bottomParryRightSupportTuck, lift, depth),
    forearmLPosition: add3(BASE.forearmLPosition, lateral * 0.88, lift * 0.90, depth * 0.85),
    handRPosition: add3(BASE.handRPosition, lateral * 0.72 + bottomParryRightSupportTuck, lift * 0.78, depth * 0.72),
    handLPosition: add3(BASE.handLPosition, lateral * 0.68, lift * 0.74, depth * 0.68),
    cuffRPosition: add3(BASE.cuffRPosition, lateral * 0.84 + bottomParryRightSupportTuck, lift * 0.86, depth * 0.80),
    cuffLPosition: add3(BASE.cuffLPosition, lateral * 0.80, lift * 0.82, depth * 0.76),
    forearmREuler: add3(BASE.forearmREuler, attackR + pitch, yaw, attackRollR - roll + bottomParryRightForearmRoll),
    forearmLEuler: add3(BASE.forearmLEuler, attackL + pitch * 0.86, yaw * 0.88, attackRollL - roll * 0.72),
    handREuler: add3(BASE.handREuler, 5 * pulse + pitch * 0.55, yaw * 0.70, (attack ? -12 : -6) * pulse - roll * 0.70),
    handLEuler: add3(BASE.handLEuler, 4 * pulse + pitch * 0.50, yaw * 0.66, (attack ? 10 : 5) * pulse - roll * 0.58),
    cuffREuler: add3(BASE.cuffREuler, pitch * 0.45, yaw * 0.62, -roll * 0.62),
    cuffLEuler: add3(BASE.cuffLEuler, pitch * 0.42, yaw * 0.58, -roll * 0.52),
  };
}

export const PLAYER_WEAPON_BASE_POSE = BASE;
