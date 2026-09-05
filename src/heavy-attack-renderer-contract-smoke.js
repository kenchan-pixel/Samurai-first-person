import { CombatEngine, Direction, ENEMIES } from './game-core.js';
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
Object.assign(canvas.style, {
  position: 'fixed',
  left: '-10000px',
  top: '0',
  width: '320px',
  height: '568px',
  pointerEvents: 'none',
});
document.body.append(canvas);

let view;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function draw(engine, now) {
  const snapshot = engine.snapshot(now);
  const motionPhase = motionPhaseForSnapshot(snapshot);
  const renderState = motionPhase === snapshot.phase ? snapshot : { ...snapshot, phase: motionPhase };
  view.draw(renderState, now, {
    attackDirectionIndex: DIRECTION_INDEX[snapshot.attack?.displayedDirection] ?? 0,
    playerAction: 0,
    playerDirectionIndex: 0,
    hitAge: 999,
    shake: 0,
  });

  const impl = view.impl;
  const heavy = impl.heavyAttackWeightState || {};
  const trajectory = impl.bladeTrajectoryState || {};
  const authored = impl.authoredAttackState || {};
  const camera = impl.camera?.getPosition?.();
  const enemy = impl.enemy?.getLocalPosition?.();
  return {
    phase: snapshot.phase,
    attackHeavy: snapshot.attack?.heavy === true,
    heavyActive: heavy.active === true,
    heavyPhase: heavy.phase || '',
    load: Number(heavy.load) || 0,
    drive: Number(heavy.drive) || 0,
    follow: Number(heavy.follow) || 0,
    read: Number(heavy.read) || 0,
    authoredClip: authored.clip || '',
    authoredLayer: impl.skinnedModel?.anim?.baseLayer?.activeState || '',
    readTrailEnabled: impl.skinnedReadTrail?.enabled === true,
    swordParent: impl.skinnedSword?.parent?.name || '',
    gripLocked: trajectory.gripLocked === true,
    orientationDeltaDeg: Number(trajectory.orientationDeltaDeg) || 0,
    bladeTipX: Number(trajectory.tipX),
    bladeTipY: Number(trajectory.tipY),
    bladeTipZ: Number(trajectory.tipZ),
    trailSegments: Number(trajectory.trailSegments) || 0,
    depthAssist: Number(trajectory.depthAssist) || 0,
    cameraY: Number(camera?.y),
    cameraZ: Number(camera?.z),
    enemyY: Number(enemy?.y),
    enemyZ: Number(enemy?.z),
  };
}

try {
  assert(innerWidth === 320 && innerHeight === 568, `Heavy renderer gate requires 320x568 viewport, got ${innerWidth}x${innerHeight}`);
  view = new View(canvas);
  assert(view.backend === 'playcanvas', 'Heavy renderer gate did not stay on PlayCanvas');
  const characterReady = await view.impl.characterReady;
  assert(characterReady && view.impl.skinnedModel, 'Heavy renderer gate could not load the skinned samurai');
  await view.impl.bladeTrajectoryReady;
  assert(view.impl.authoredAttackClipsReady === true, 'Authored four-direction attack pack was not ready');
  assert(view.impl.skinnedSword?.parent?.name === 'HandR', 'Enemy Sword is not directly parented to HandR');

  const heavyEngine = new CombatEngine({ enemies: [ENEMIES[2]] });
  heavyEngine.start(0);
  heavyEngine.drainEvents();
  heavyEngine.update(1550);

  const telegraph = draw(heavyEngine, 2150);
  assert(telegraph.phase === 'telegraph' && telegraph.attackHeavy && telegraph.heavyActive, 'Oni heavy telegraph did not activate the heavy-weight pass');
  assert(telegraph.heavyPhase === 'telegraph' && telegraph.load > 0.6 && telegraph.read > 0.35, 'Heavy telegraph did not build a readable loaded pose');
  assert(telegraph.authoredClip === 'AttackTop' && telegraph.authoredLayer === 'AttackTop', 'Heavy telegraph left the authored AttackTop track');
  assert(telegraph.readTrailEnabled, 'Heavy telegraph lost the real-blade read trail');
  assert(telegraph.swordParent === 'HandR' && telegraph.gripLocked && telegraph.orientationDeltaDeg < 0.25, 'Heavy telegraph broke the authored HandR/Sword grip');
  assert([telegraph.bladeTipX, telegraph.bladeTipY, telegraph.bladeTipZ].every(Number.isFinite), 'Heavy telegraph did not expose a finite real blade-tip pose');

  heavyEngine.update(2450);
  draw(heavyEngine, 2490);
  draw(heavyEngine, 2530);
  const strike = draw(heavyEngine, 2570);
  assert(strike.phase === 'strike' && strike.attackHeavy && strike.heavyActive, 'Oni heavy strike did not keep the heavy-weight pass active');
  assert(strike.heavyPhase === 'strike' && strike.drive > 0.7, 'Heavy strike did not reach the committed drive beat');
  assert(strike.authoredClip === 'AttackTop' && strike.authoredLayer === 'AttackTop', 'Heavy strike left the authored AttackTop track');
  assert(strike.readTrailEnabled && strike.trailSegments >= 1, 'Heavy strike lost the real-blade trajectory/read trail');
  assert(strike.swordParent === 'HandR' && strike.gripLocked && strike.orientationDeltaDeg < 0.25, 'Heavy strike broke the authored HandR/Sword grip');
  assert(strike.depthAssist >= 0 && strike.depthAssist <= 1.10, 'Heavy strike exceeded the bounded whole-model blade depth assist');
  assert([strike.cameraY, strike.cameraZ, strike.enemyY, strike.enemyZ].every(Number.isFinite), 'Heavy strike did not produce finite camera/body transforms');
  assert(strike.cameraZ > telegraph.cameraZ + 0.01, 'Heavy drive did not produce the bounded forward camera weight');

  heavyEngine.update(2645);
  const recoveryEarly = draw(heavyEngine, 2750);
  const recoveryLate = draw(heavyEngine, 3070);
  assert(recoveryEarly.phase === 'recovery' && recoveryEarly.heavyActive && recoveryEarly.heavyPhase === 'recovery', 'Heavy recovery did not retain the weight pass long enough to settle');
  assert(recoveryEarly.drive > recoveryLate.drive && recoveryEarly.follow > recoveryLate.follow, 'Heavy recovery did not decay drive/follow toward neutral');
  assert(recoveryEarly.swordParent === 'HandR', 'Heavy recovery detached the authored Sword from HandR');

  heavyEngine.update(3135);
  const cleared = draw(heavyEngine, 3140);
  assert(cleared.phase === 'gap' && !cleared.attackHeavy && !cleared.heavyActive, 'Heavy weight pass did not clear after recovery');
  assert(cleared.load === 0 && cleared.drive === 0 && cleared.follow === 0 && cleared.read === 0, 'Heavy weight diagnostics remained non-zero after recovery');

  const normalEngine = new CombatEngine({ enemies: [ENEMIES[0]] });
  normalEngine.start(0);
  normalEngine.drainEvents();
  normalEngine.update(1550);
  const normalTelegraph = draw(normalEngine, 2100);
  assert(normalTelegraph.phase === 'telegraph' && !normalTelegraph.attackHeavy && !normalTelegraph.heavyActive, 'Normal Ashigaru attack incorrectly activated heavy weighting');
  assert(normalTelegraph.load === 0 && normalTelegraph.drive === 0 && normalTelegraph.follow === 0 && normalTelegraph.read === 0, 'Normal attack received non-zero heavy weighting');
  assert(normalTelegraph.swordParent === 'HandR' && normalTelegraph.gripLocked && normalTelegraph.orientationDeltaDeg < 0.25, 'Normal-attack neutrality check broke the authored blade grip');

  root.dataset.heavyAttackRendererIntegration = 'pass';
  root.dataset.heavyAttackRendererViewport = '320x568';
  root.dataset.heavyAttackRendererSequence = 'oni-heavy-telegraph-strike-recovery-clear';
  root.dataset.heavyAttackRendererBlade = 'handr-grip-read-trail';
  root.dataset.heavyAttackRendererNeutrality = 'ashigaru-inactive';
} catch (error) {
  console.error('PlayCanvas heavy-attack renderer contract smoke failed', error);
  root.dataset.heavyAttackRendererIntegration = 'fail';
  root.dataset.heavyAttackRendererError = String(error?.message || error).slice(0, 220);
} finally {
  try { view?.impl?.app?.destroy?.(); } catch {}
  canvas.remove();
}
