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

function render(engine, now, playerAction = 0, playerDirection = Direction.TOP, attackDirectionIndex = null) {
  const snapshot = engine.snapshot(now);
  const motionPhase = motionPhaseForSnapshot(snapshot);
  const renderState = motionPhase === snapshot.phase ? snapshot : { ...snapshot, phase: motionPhase };
  view.draw(renderState, now, {
    attackDirectionIndex: attackDirectionIndex ?? DIRECTION_INDEX[snapshot.attack?.displayedDirection] ?? 0,
    playerAction,
    playerDirectionIndex: DIRECTION_INDEX[playerDirection] ?? 0,
    hitAge: 999,
    shake: 0,
  });
  const impl = view.impl;
  const sword = impl.sword.getLocalEulerAngles();
  const playerSword = impl.playerRig.getLocalEulerAngles();
  const enemy = impl.enemy.getLocalPosition();
  const character = impl.skinnedModel?.getLocalEulerAngles();
  const trajectory = impl.bladeTrajectoryState || {};
  const authored = impl.authoredAttackState || {};
  return {
    backend: view.backend,
    phase: snapshot.phase,
    motionPhase: impl.motion.phase,
    interruptedRecovery: impl.motion.interruptedRecovery === true,
    wind: Number(impl.motion.wind) || 0,
    swing: Number(impl.motion.swing) || 0,
    enemyY: enemy.y,
    enemyZ: enemy.z,
    swordZ: sword.z,
    playerAction: impl.playerAction,
    playerSwordZ: playerSword.z,
    characterReady: Boolean(impl.skinnedModel),
    characterClip: impl.characterClip,
    characterYaw: Number(character?.y) || 0,
    characterRoll: Number(character?.z) || 0,
    readTrailEnabled: Boolean(impl.skinnedReadTrail?.enabled),
    authoredAttackClip: authored.clip || '',
    authoredAttackPhase: authored.phase || '',
    authoredAttackProgress: Number(authored.progress) || 0,
    authoredLayerState: impl.skinnedModel?.anim?.baseLayer?.activeState || '',
    bladeTipX: Number(trajectory.tipX) || 0,
    bladeTipY: Number(trajectory.tipY) || 0,
    bladeTipZ: Number(trajectory.tipZ) || 0,
    bladeCrossedPlane: trajectory.crossedPlane === true,
    worldTrailSegments: Number(trajectory.trailSegments) || 0,
    bladeGripLocked: trajectory.gripLocked === true,
    bladeOrientationDeltaDeg: Number(trajectory.orientationDeltaDeg) || 0,
    bladeDepthAssist: Number(trajectory.depthAssist) || 0,
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
  assert(root.dataset.authoredAttackPack === 'four-direction-v1', 'Authored four-direction enemy attack pack did not load');
  assert(view.impl.authoredAttackClipsReady === true, 'Authored attack clips were not bound to the skinned rig');
  assert(view.impl.skinnedSword?.parent?.name === 'HandR', 'Skinned katana is not attached directly to HandR');
  await view.impl.bladeTrajectoryReady;
  assert(root.dataset.bladeTrajectory === 'worldspace-v3-grip-lock', 'Grip-locked enemy blade trajectory adapter was not installed');

  const attackTransitions = [];
  const animLayer = view.impl.skinnedModel.anim.baseLayer;
  const originalTransition = animLayer.transition.bind(animLayer);
  animLayer.transition = (...args) => {
    attackTransitions.push(String(args[0]));
    return originalTransition(...args);
  };

  const identities = [];
  const activeCounts = [];
  const swordScales = [];
  const enemyScales = [];
  for (let stage = 0; stage < 4; stage += 1) {
    view.impl.applyStage(stage);
    identities.push(view.impl.stageIdentity);
    activeCounts.push(view.impl.skinnedStageParts.reduce((count, parts) => count + parts.filter((entity) => entity.enabled).length, 0));
    swordScales.push(Number(view.impl.skinnedSword?.getLocalScale().y) || 0);
    enemyScales.push(Number(view.impl.enemy.getLocalScale().x) || 0);
  }
  assert(new Set(identities).size === 4, 'Four stages did not expose four distinct skinned enemy identities');
  assert(activeCounts.join(',') === '3,3,5,6', 'Stage identity attachments were not bounded to the intended active groups');
  assert(swordScales[2] > swordScales[1] && swordScales[3] > swordScales[2], 'Heavy/boss weapon silhouettes did not scale above the ronin blade');
  assert(enemyScales[3] > enemyScales[2] && enemyScales[2] > enemyScales[1], 'Oni/Shogun silhouettes did not increase body mass distinctly');
  view.impl.applyStage(0);

  const step = document.querySelector('#footwork-step');
  const range = document.querySelector('#footwork-range');
  assert(step && range, 'STEP/range controls were not installed in the production page');
  const stepStyle = getComputedStyle(step);
  const stepSecondary = step.querySelector('span');
  assert(parseFloat(stepStyle.fontSize) >= 14, 'STEP primary label remained too small for the 320px phone acceptance viewport');
  assert(!stepSecondary || getComputedStyle(stepSecondary).display === 'none', 'STEP retained tiny secondary copy after the phone readability repair');

  const engine = new CombatEngine();
  engine.start(0);
  engine.drainEvents();

  engine.update(1550);
  const wind = render(engine, 2150);
  assert(wind.phase === 'telegraph' && wind.wind > 0.35, 'Telegraph did not reach a readable wind-up pose');
  assert(wind.characterReady && wind.characterClip === 'Windup', 'Skinned rig did not enter the Windup compatibility phase');
  assert(wind.readTrailEnabled, 'Skinned sword did not expose the in-world blade-read trail during telegraph');
  assert(wind.bladeGripLocked && wind.bladeOrientationDeltaDeg < 0.25, 'Top telegraph did not preserve the authored HandR-to-sword orientation');

  const windRight = render(engine, 2150, 0, Direction.TOP, DIRECTION_INDEX[Direction.RIGHT]);
  const windLeft = render(engine, 2150, 0, Direction.TOP, DIRECTION_INDEX[Direction.LEFT]);
  const windBottom = render(engine, 2150, 0, Direction.TOP, DIRECTION_INDEX[Direction.BOTTOM]);
  assert(windRight.characterYaw < -8 && windLeft.characterYaw > 8, 'Right/left telegraphs did not produce mirrored full-body skeletal orientation');
  assert(Math.abs(windRight.characterYaw - windLeft.characterYaw) > 20, 'Right/left directional body language was not materially distinct');
  assert(windBottom.enemyY < wind.enemyY - 0.04, 'Bottom telegraph did not lower the opponent stance');
  assert(windRight.bladeTipX > 0.7 && windLeft.bladeTipX < -0.7, 'Right/left wind-up blade tips did not occupy opposite sides in world space');
  assert(windBottom.bladeTipY < wind.bladeTipY - 0.55, 'Bottom wind-up blade tip did not start materially below the top attack');
  assert(windRight.authoredLayerState === 'AttackRight' && windLeft.authoredLayerState === 'AttackLeft' && windBottom.authoredLayerState === 'AttackBottom', 'Direction changes did not switch to the matching authored Attack* clips');
  assert([windRight, windLeft, windBottom].every((pose) => pose.bladeGripLocked && pose.bladeOrientationDeltaDeg < 0.25), 'One or more directional telegraphs rotated the blade away from the authored HandR grip');

  const topWind = render(engine, 2150, 0, Direction.TOP, DIRECTION_INDEX[Direction.TOP]);
  assert(topWind.authoredAttackClip === 'AttackTop' && topWind.authoredLayerState === 'AttackTop', 'Top telegraph did not run the authored AttackTop clip');

  engine.update(2430);
  const strikeEarly = render(engine, 2470);
  render(engine, 2525);
  const strike = render(engine, 2580);
  assert(strike.phase === 'strike' && strike.swing > 0.2, 'Strike motion did not progress on the PlayCanvas rig');
  assert(strike.characterClip === 'Strike', 'Skinned rig did not expose the Strike compatibility phase');
  assert(strike.authoredAttackClip === 'AttackTop' && strike.authoredLayerState === 'AttackTop', 'Telegraph -> strike did not stay on the continuous AttackTop authored track');
  assert(strike.readTrailEnabled, 'Skinned sword trail did not persist through the strike path');
  assert(strike.bladeGripLocked && strike.bladeOrientationDeltaDeg < 0.25, 'Top strike rotated the katana away from the authored HandR grip');
  assert(strike.bladeDepthAssist >= 0 && strike.bladeDepthAssist <= 1.10, 'Grip-locked whole-body depth assist exceeded its bounded budget');
  assert(Math.abs(strike.swordZ - wind.swordZ) > 12, 'Enemy sword transform did not move from telegraph into strike');
  assert(Math.abs(strike.enemyZ - wind.enemyZ) > 0.08, 'Enemy body transform did not commit into the strike');
  assert(strikeEarly.bladeTipZ > topWind.bladeTipZ + 0.25 && strike.bladeTipZ > strikeEarly.bladeTipZ + 0.45, 'Top strike blade tip did not advance continuously toward the player');
  assert(strike.bladeCrossedPlane, 'Top strike blade tip never crossed the player-facing parry plane');
  assert(strike.bladeTipY < topWind.bladeTipY - 0.45, 'Top strike did not visibly cut downward from the overhead wind-up');
  assert(strike.worldTrailSegments >= 2, 'World-space blade trail did not record the actual strike path');

  const strikeRight = render(engine, 2580, 0, Direction.TOP, DIRECTION_INDEX[Direction.RIGHT]);
  const strikeLeft = render(engine, 2580, 0, Direction.TOP, DIRECTION_INDEX[Direction.LEFT]);
  const strikeBottom = render(engine, 2580, 0, Direction.TOP, DIRECTION_INDEX[Direction.BOTTOM]);
  assert(strikeRight.bladeCrossedPlane && strikeLeft.bladeCrossedPlane && strikeBottom.bladeCrossedPlane, 'One or more directional strikes failed to cross the player-facing parry plane');
  assert([strikeRight, strikeLeft, strikeBottom].every((pose) => pose.bladeGripLocked && pose.bladeOrientationDeltaDeg < 0.25), 'One or more directional strikes rotated the blade away from the authored HandR grip');
  assert(strikeRight.bladeTipX < windRight.bladeTipX - 0.20, 'Right strike did not travel inward/across from its wind-up side');
  assert(strikeLeft.bladeTipX > windLeft.bladeTipX + 0.20, 'Left strike did not travel inward/across from its wind-up side');
  assert(strikeBottom.bladeTipY > windBottom.bladeTipY + 0.35, 'Bottom strike did not rise through its player-facing cut path');

  render(engine, 2580, 0, Direction.TOP, DIRECTION_INDEX[Direction.TOP]);
  const parry = engine.attemptParry(Direction.TOP, 2580);
  assert(parry.accepted, 'Representative directional parry was rejected');
  render(engine, 2620, 1, Direction.TOP);
  const parryPose = render(engine, 2740, 1, Direction.TOP);
  assert(parryPose.phase === 'recovery', 'Parry did not enter recovery');
  assert(parryPose.interruptedRecovery, 'Parry interruption did not reach the renderer motion contract');
  assert(parryPose.characterClip === 'Parry', 'Interrupted recovery did not select the skeletal Parry reaction clip');
  assert(!parryPose.bladeGripLocked, 'Interrupted recovery incorrectly remained on the normal authored grip-lock path');
  assert(parryPose.playerAction === 1, 'Player parry action did not reach the PlayCanvas view');
  assert(Math.abs(parryPose.playerSwordZ + 34) > 12, 'Player katana did not visibly move for the parry');

  const counter = engine.attemptAttack(Direction.BOTTOM, 2780);
  assert(counter.accepted, 'Representative opposite-direction counter was rejected');
  render(engine, 2780, 3, Direction.BOTTOM);
  const counterPose = render(engine, 2940, 3, Direction.BOTTOM);
  assert(counterPose.playerAction === 3, 'Counter action did not reach the PlayCanvas view');
  assert(Math.abs(counterPose.playerSwordZ - parryPose.playerSwordZ) > 24, 'Player katana did not progress from parry into counter slash');

  // Normal authored attacks must keep one Attack* state across telegraph -> strike ->
  // recovery. Generic compatibility phase labels may change, but they must never become
  // animation transitions while the authored track is active.
  attackTransitions.length = 0;
  const continuityBase = engine.snapshot(3000);
  const continuityMeta = { attackDirectionIndex: DIRECTION_INDEX[Direction.TOP], playerAction: 0, playerDirectionIndex: 0, hitAge: 999, shake: 0 };
  view.draw({ ...continuityBase, phase: 'telegraph', phaseProgress: 0.62 }, 3100, continuityMeta);
  assert(animLayer.activeState === 'AttackTop', 'Authored continuity test did not enter AttackTop');
  assert(view.impl.bladeTrajectoryState.gripLocked === true && view.impl.bladeTrajectoryState.orientationDeltaDeg < 0.25, 'Continuity telegraph did not keep Sword locked to the authored HandR orientation');
  view.draw({ ...continuityBase, phase: 'strike', phaseProgress: 0.42 }, 3200, continuityMeta);
  assert(animLayer.activeState === 'AttackTop', 'Generic Strike state interrupted AttackTop at the phase boundary');
  assert(view.impl.bladeTrajectoryState.gripLocked === true && view.impl.bladeTrajectoryState.orientationDeltaDeg < 0.25, 'Continuity strike did not keep Sword locked to the authored HandR orientation');
  view.draw({ ...continuityBase, phase: 'recovery', phaseProgress: 0.35 }, 3300, continuityMeta);
  assert(animLayer.activeState === 'AttackTop', 'Generic Recovery state interrupted AttackTop at the phase boundary');
  assert(view.impl.bladeTrajectoryState.gripLocked === true && view.impl.bladeTrajectoryState.orientationDeltaDeg < 0.25, 'Continuity recovery did not keep Sword locked to the authored HandR orientation');
  assert(!attackTransitions.some((clip) => clip === 'Windup' || clip === 'Strike' || clip === 'Recovery'), `Generic attack transition leaked into authored track: ${attackTransitions.join(',')}`);

  const directionSwitchStart = attackTransitions.length;
  view.draw({ ...continuityBase, phase: 'telegraph', phaseProgress: 0.48 }, 3400, { ...continuityMeta, attackDirectionIndex: DIRECTION_INDEX[Direction.RIGHT] });
  assert(animLayer.activeState === 'AttackRight', 'Telegraph direction switch did not enter AttackRight');
  view.draw({ ...continuityBase, phase: 'telegraph', phaseProgress: 0.56 }, 3450, { ...continuityMeta, attackDirectionIndex: DIRECTION_INDEX[Direction.LEFT] });
  assert(animLayer.activeState === 'AttackLeft', 'Ronin-style telegraph direction switch did not enter AttackLeft');
  const directionSwitchTransitions = attackTransitions.slice(directionSwitchStart);
  assert(directionSwitchTransitions.includes('AttackRight') && directionSwitchTransitions.includes('AttackLeft'), 'Direction switch did not transition between authored directional tracks');
  assert(!directionSwitchTransitions.includes('Windup'), 'Direction switch leaked through the generic Windup state');

  root.dataset.rendererMotionIntegration = 'pass';
  root.dataset.rendererMotionSequence = 'telegraph-strike-parry-counter';
  root.dataset.rendererMotionBackend = view.backend;
  root.dataset.rendererCharacterPipeline = 'skinned-gltf-v1';
  root.dataset.rendererCharacterClips = 'Windup,Strike,Parry';
  root.dataset.rendererDirectionalRead = 'top-right-bottom-left';
  root.dataset.rendererBladeTrajectory = 'grip-locked-authored-v3';
  root.dataset.rendererStageIdentity = identities.join(',');
  root.dataset.rendererAuthoredAttacks = 'continuous-four-direction-v1';
  root.dataset.rendererAuthoredTransitions = attackTransitions.join(',');
} catch (error) {
  console.error('PlayCanvas renderer contract smoke failed', error);
  root.dataset.rendererMotionIntegration = 'fail';
  root.dataset.rendererMotionError = String(error?.message || error).slice(0, 180);
} finally {
  try { view?.impl?.app?.destroy?.(); } catch {}
  canvas.remove();
}
