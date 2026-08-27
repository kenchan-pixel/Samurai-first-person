import { CombatEngine, Direction } from './game-core.js';
import { motionPhaseForSnapshot } from './animation-motion.js';
import { View } from './renderer.js';

const DIRECTION_INDEX = Object.freeze({
  [Direction.TOP]: 0,
  [Direction.RIGHT]: 1,
  [Direction.BOTTOM]: 2,
  [Direction.LEFT]: 3,
});

const root = document.documentElement;
const canvas = document.createElement('canvas');
canvas.width = 320;
canvas.height = 568;
canvas.setAttribute('aria-hidden', 'true');
Object.assign(canvas.style, { position: 'fixed', left: '-10000px', top: '0', width: '320px', height: '568px', pointerEvents: 'none' });
document.body.append(canvas);

let view;

function render(engine, now, playerAction = 0, playerDirection = Direction.TOP) {
  const snapshot = engine.snapshot(now);
  const motionPhase = motionPhaseForSnapshot(snapshot);
  const renderState = motionPhase === snapshot.phase ? snapshot : { ...snapshot, phase: motionPhase };
  view.draw(renderState, now, {
    attackDirectionIndex: DIRECTION_INDEX[snapshot.attack?.displayedDirection] ?? 0,
    playerAction,
    playerDirectionIndex: DIRECTION_INDEX[playerDirection] ?? 0,
    hitAge: 999,
    shake: 0,
  });
  const impl = view.impl;
  const sword = impl.sword.getLocalEulerAngles();
  const playerSword = impl.playerRig.getLocalEulerAngles();
  const enemy = impl.enemy.getLocalPosition();
  return {
    backend: view.backend,
    phase: snapshot.phase,
    motionPhase: impl.motion.phase,
    interruptedRecovery: impl.motion.interruptedRecovery === true,
    wind: Number(impl.motion.wind) || 0,
    swing: Number(impl.motion.swing) || 0,
    enemyZ: enemy.z,
    swordZ: sword.z,
    playerAction: impl.playerAction,
    playerSwordZ: playerSword.z,
    characterReady: Boolean(impl.skinnedModel),
    characterClip: impl.characterClip,
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

try {
  view = new View(canvas);
  assert(view.backend === 'playcanvas', 'PlayCanvas backend was not active');
  const characterReady = await view.impl.characterReady;
  assert(characterReady && view.impl.skinnedModel, 'Skinned GLB samurai did not load on the PlayCanvas backend');

  const engine = new CombatEngine();
  engine.start(0);
  engine.drainEvents();

  engine.update(1550);
  const wind = render(engine, 2150);
  assert(wind.phase === 'telegraph' && wind.wind > 0.35, 'Telegraph did not reach a readable wind-up pose');
  assert(wind.characterReady && wind.characterClip === 'Windup', 'Skinned rig did not enter the Windup clip');

  engine.update(2430);
  const strike = render(engine, 2580);
  assert(strike.phase === 'strike' && strike.swing > 0.2, 'Strike motion did not progress on the PlayCanvas rig');
  assert(strike.characterClip === 'Strike', 'Skinned rig did not enter the Strike clip');
  assert(Math.abs(strike.swordZ - wind.swordZ) > 12, 'Enemy sword transform did not move from telegraph into strike');
  assert(Math.abs(strike.enemyZ - wind.enemyZ) > 0.08, 'Enemy body transform did not commit into the strike');

  const parry = engine.attemptParry(Direction.TOP, 2580);
  assert(parry.accepted, 'Representative directional parry was rejected');
  render(engine, 2620, 1, Direction.TOP);
  const parryPose = render(engine, 2740, 1, Direction.TOP);
  assert(parryPose.phase === 'recovery', 'Parry did not enter recovery');
  assert(parryPose.interruptedRecovery, 'Parry interruption did not reach the renderer motion contract');
  assert(parryPose.characterClip === 'Parry', 'Interrupted recovery did not select the skeletal Parry reaction clip');
  assert(parryPose.playerAction === 1, 'Player parry action did not reach the PlayCanvas view');
  assert(Math.abs(parryPose.playerSwordZ + 34) > 12, 'Player katana did not visibly move for the parry');

  const counter = engine.attemptAttack(Direction.BOTTOM, 2780);
  assert(counter.accepted, 'Representative opposite-direction counter was rejected');
  render(engine, 2780, 3, Direction.BOTTOM);
  const counterPose = render(engine, 2940, 3, Direction.BOTTOM);
  assert(counterPose.playerAction === 3, 'Counter action did not reach the PlayCanvas view');
  assert(Math.abs(counterPose.playerSwordZ - parryPose.playerSwordZ) > 24, 'Player katana did not progress from parry into counter slash');

  root.dataset.rendererMotionIntegration = 'pass';
  root.dataset.rendererMotionSequence = 'telegraph-strike-parry-counter';
  root.dataset.rendererMotionBackend = view.backend;
  root.dataset.rendererCharacterPipeline = 'skinned-gltf-v1';
  root.dataset.rendererCharacterClips = 'Windup,Strike,Parry';
} catch (error) {
  console.error('PlayCanvas renderer contract smoke failed', error);
  root.dataset.rendererMotionIntegration = 'fail';
  root.dataset.rendererMotionError = String(error?.message || error).slice(0, 180);
} finally {
  try { view?.impl?.app?.destroy?.(); } catch {}
  canvas.remove();
}
