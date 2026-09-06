import { CombatEngine, Direction, ENEMIES } from './game-core.js';
import { View } from './renderer.js';

const root = document.documentElement;
const canvas = document.createElement('canvas');
canvas.width = 320;
canvas.height = 568;
canvas.setAttribute('aria-hidden', 'true');
Object.assign(canvas.style, { position: 'fixed', left: '-10000px', top: '0', width: '320px', height: '568px', pointerEvents: 'none' });
document.body.append(canvas);
let view;
const assert = (condition, message) => { if (!condition) throw new Error(message); };

function draw(state, now) {
  view.draw(state, now, { attackDirectionIndex: 0, playerAction: 0, playerDirectionIndex: 0, hitAge: 999, shake: 0 });
  const impl = view.impl;
  const frame = { ...(impl.enemyPosturePresenceState || {}) };
  const recoil = { ...(impl.enemyParryRecoilState || {}) };
  const enemy = impl.enemy?.getLocalPosition?.();
  const character = impl.skinnedModel?.getLocalEulerAngles?.();
  const trajectory = impl.bladeTrajectoryState || {};
  return {
    frame,
    recoil,
    enemyX: Number(enemy?.x), enemyY: Number(enemy?.y), enemyZ: Number(enemy?.z),
    characterPitch: Number(character?.x), characterYaw: Number(character?.y), characterRoll: Number(character?.z),
    swordParent: impl.skinnedSword?.parent?.name || '', gripLocked: trajectory.gripLocked === true,
    orientationDeltaDeg: Number(trajectory.orientationDeltaDeg) || 0,
  };
}

try {
  assert(innerWidth === 320 && innerHeight === 568, `Posture renderer gate requires 320x568 viewport, got ${innerWidth}x${innerHeight}`);
  view = new View(canvas);
  assert(view.backend === 'playcanvas', 'Posture renderer gate did not stay on PlayCanvas');
  const characterReady = await view.impl.characterReady;
  assert(characterReady && view.impl.skinnedModel, 'Posture renderer gate could not load the skinned samurai');
  await view.impl.bladeTrajectoryReady;
  assert(view.impl.skinnedSword?.parent?.name === 'HandR', 'Enemy Sword is not directly parented to HandR');

  const engine = new CombatEngine({ enemies: [ENEMIES[2]] });
  engine.start(0);
  const seed = engine.snapshot(0);
  const gap = { ...seed, phase: 'gap', phaseProgress: 0.42, attack: null, enemyPostureMax: 5 };
  const neutral = draw({ ...gap, enemyPosture: 0 }, 2000);
  const pressured = draw({ ...gap, enemyPosture: 4 }, 2000);
  assert(!neutral.frame.active && neutral.frame.ratio === 0, 'Neutral guard unexpectedly received posture pressure offsets');
  assert(!neutral.recoil.active && !pressured.recoil.active, 'Parry recoil leaked into neutral/high-posture gap');
  assert(pressured.frame.active && pressured.frame.ratio > 0.79, 'High posture did not activate pressured guard presence');
  assert(pressured.enemyZ < neutral.enemyZ - 0.035, 'High posture did not visibly retreat the whole enemy');
  assert(pressured.enemyY < neutral.enemyY - 0.015, 'High posture did not visibly lower the whole enemy stance');
  assert(pressured.characterPitch > neutral.characterPitch + 1.0, 'High posture did not visibly load the skinned whole-body guard');
  assert(pressured.swordParent === 'HandR' && !pressured.gripLocked && pressured.orientationDeltaDeg < 0.25, 'Posture presence broke neutral Sword/HandR hierarchy or activated authored attack grip outside an Attack* phase');
  assert([pressured.enemyX, pressured.enemyY, pressured.enemyZ, pressured.characterPitch, pressured.characterRoll].every(Number.isFinite), 'Posture pressure produced a non-finite transform');

  const telegraphAttack = { direction: Direction.RIGHT, displayedDirection: Direction.RIGHT, heavy: false, parried: true, perfect: true, counterUsed: false, guardBroken: true };
  const telegraph = draw({ ...gap, phase: 'telegraph', phaseProgress: 0.55, enemyPosture: 5, attack: telegraphAttack }, 2300);
  assert(!telegraph.frame.active && telegraph.frame.retreat === 0 && telegraph.frame.pitch === 0, 'Posture presence leaked into live telegraph blade reading');
  assert(!telegraph.recoil.active && telegraph.recoil.retreat === 0, 'Parry recoil leaked into live telegraph blade reading');
  assert(telegraph.swordParent === 'HandR' && telegraph.gripLocked && telegraph.orientationDeltaDeg < 0.25, 'Telegraph suppression broke authored blade grip');

  const baseRecoveryAttack = { direction: Direction.RIGHT, displayedDirection: Direction.RIGHT, heavy: false, parried: false, perfect: false, counterUsed: false, guardBroken: false };
  const baseRecovery = draw({ ...gap, phase: 'recovery', phaseProgress: 0.12, enemyPosture: 2, attack: baseRecoveryAttack }, 2450);
  const normalParry = draw({ ...gap, phase: 'recovery', phaseProgress: 0.12, enemyPosture: 2, attack: { ...baseRecoveryAttack, parried: true } }, 2450);
  const perfectParry = draw({ ...gap, phase: 'recovery', phaseProgress: 0.12, enemyPosture: 2, attack: { ...baseRecoveryAttack, parried: true, perfect: true } }, 2450);
  assert(!baseRecovery.recoil.active && normalParry.recoil.active, 'Normal parry did not create a recovery recoil reaction');
  assert(normalParry.enemyZ < baseRecovery.enemyZ - 0.035, 'Normal parry recoil did not visibly move the whole enemy back');
  assert(Math.abs(normalParry.enemyX - baseRecovery.enemyX) > 0.015, 'Directional parry recoil did not visibly move the enemy off-axis');
  assert(perfectParry.recoil.retreat > normalParry.recoil.retreat, 'Perfect Parry recoil was not stronger than normal parry recoil');
  assert(perfectParry.enemyZ < normalParry.enemyZ - 0.012, 'Perfect Parry did not produce a stronger rendered retreat');
  assert(normalParry.swordParent === 'HandR' && normalParry.gripLocked && normalParry.orientationDeltaDeg < 0.25, 'Parry recoil broke authored blade grip');

  const brokenAttack = { ...baseRecoveryAttack, direction: Direction.TOP, displayedDirection: Direction.TOP, parried: true, perfect: true, guardBroken: true };
  const broken = draw({ ...gap, phase: 'recovery', phaseProgress: 0.18, enemyPosture: 5, attack: brokenAttack }, 2600);
  assert(broken.frame.active && broken.frame.guardBroken, 'Guard-break recovery did not activate the stronger posture read');
  assert(broken.recoil.active && broken.recoil.guardBroken, 'Guard-break recovery did not activate the stronger parry recoil');
  assert(broken.frame.retreat > pressured.frame.retreat, 'Guard-break recovery was not stronger than a high pressured gap');
  assert(broken.recoil.retreat > perfectParry.recoil.retreat, 'Guard-break recoil was not stronger than Perfect Parry recoil');
  assert(broken.frame.retreat < 0.15 && broken.frame.drop < 0.06 && broken.frame.pitch < 8, 'Guard-break posture presentation exceeded bounded whole-model offsets');
  assert(broken.recoil.retreat < 0.21 && broken.recoil.drop < 0.08 && Math.abs(broken.recoil.yaw) < 12, 'Guard-break parry recoil exceeded bounded whole-model offsets');
  assert([broken.enemyX, broken.enemyY, broken.enemyZ, broken.characterPitch, broken.characterYaw, broken.characterRoll].every(Number.isFinite), 'Composed guard-break reaction produced a non-finite transform');
  assert(broken.swordParent === 'HandR' && broken.gripLocked && broken.orientationDeltaDeg < 0.25, 'Guard-break body reaction broke authored blade grip');

  const settled = draw({ ...gap, phase: 'recovery', phaseProgress: 0.82, enemyPosture: 2, attack: { ...baseRecoveryAttack, parried: true, perfect: true } }, 2800);
  assert(!settled.recoil.active && settled.recoil.retreat === 0 && settled.recoil.lateral === 0, 'Parry recoil did not settle before late recovery');

  root.dataset.enemyPostureRendererIntegration = 'pass';
  root.dataset.enemyPostureRendererViewport = '320x568';
  root.dataset.enemyPostureRendererSequence = 'neutral-pressure-telegraph-suppressed-parry-perfect-guard-break-settle';
  root.dataset.enemyPostureRendererBlade = 'handr-grip-locked';
  root.dataset.enemyParryRecoilRenderer = 'normal-perfect-break';
} catch (error) {
  console.error('PlayCanvas enemy-posture renderer contract smoke failed', error);
  root.dataset.enemyPostureRendererIntegration = 'fail';
  root.dataset.enemyPostureRendererError = String(error?.message || error).slice(0, 220);
} finally {
  try { view?.impl?.app?.destroy?.(); } catch {}
  canvas.remove();
}
