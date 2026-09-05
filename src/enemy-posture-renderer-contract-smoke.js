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
  const enemy = impl.enemy?.getLocalPosition?.();
  const character = impl.skinnedModel?.getLocalEulerAngles?.();
  const trajectory = impl.bladeTrajectoryState || {};
  return {
    frame,
    enemyX: Number(enemy?.x), enemyY: Number(enemy?.y), enemyZ: Number(enemy?.z),
    characterPitch: Number(character?.x), characterRoll: Number(character?.z),
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
  assert(pressured.frame.active && pressured.frame.ratio > 0.79, 'High posture did not activate pressured guard presence');
  assert(pressured.enemyZ < neutral.enemyZ - 0.035, 'High posture did not visibly retreat the whole enemy');
  assert(pressured.enemyY < neutral.enemyY - 0.015, 'High posture did not visibly lower the whole enemy stance');
  assert(pressured.characterPitch > neutral.characterPitch + 1.0, 'High posture did not visibly load the skinned whole-body guard');
  assert(pressured.swordParent === 'HandR' && pressured.gripLocked && pressured.orientationDeltaDeg < 0.25, 'Posture presence broke authored Sword/HandR grip authority');
  assert([pressured.enemyX, pressured.enemyY, pressured.enemyZ, pressured.characterPitch, pressured.characterRoll].every(Number.isFinite), 'Posture pressure produced a non-finite transform');

  const telegraph = draw({ ...gap, phase: 'telegraph', phaseProgress: 0.55, enemyPosture: 5, attack: { direction: Direction.TOP, displayedDirection: Direction.TOP, heavy: false, guardBroken: true } }, 2300);
  assert(!telegraph.frame.active && telegraph.frame.retreat === 0 && telegraph.frame.pitch === 0, 'Posture presence leaked into live telegraph blade reading');
  assert(telegraph.swordParent === 'HandR' && telegraph.gripLocked && telegraph.orientationDeltaDeg < 0.25, 'Telegraph suppression broke authored blade grip');

  const broken = draw({ ...gap, phase: 'recovery', phaseProgress: 0.18, enemyPosture: 5, attack: { direction: Direction.TOP, displayedDirection: Direction.TOP, heavy: false, guardBroken: true } }, 2600);
  assert(broken.frame.active && broken.frame.guardBroken, 'Guard-break recovery did not activate the stronger posture read');
  assert(broken.frame.retreat > pressured.frame.retreat, 'Guard-break recovery was not stronger than a high pressured gap');
  assert(broken.frame.retreat < 0.15 && broken.frame.drop < 0.06 && broken.frame.pitch < 8, 'Guard-break presentation exceeded bounded whole-model offsets');
  assert(broken.swordParent === 'HandR' && broken.gripLocked && broken.orientationDeltaDeg < 0.25, 'Guard-break posture read broke authored blade grip');

  root.dataset.enemyPostureRendererIntegration = 'pass';
  root.dataset.enemyPostureRendererViewport = '320x568';
  root.dataset.enemyPostureRendererSequence = 'neutral-pressure-telegraph-suppressed-guard-break';
  root.dataset.enemyPostureRendererBlade = 'handr-grip-locked';
} catch (error) {
  console.error('PlayCanvas enemy-posture renderer contract smoke failed', error);
  root.dataset.enemyPostureRendererIntegration = 'fail';
  root.dataset.enemyPostureRendererError = String(error?.message || error).slice(0, 220);
} finally {
  try { view?.impl?.app?.destroy?.(); } catch {}
  canvas.remove();
}
