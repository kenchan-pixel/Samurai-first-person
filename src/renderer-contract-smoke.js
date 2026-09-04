import { CombatEngine, Direction, ENEMIES } from './game-core.js';
import { AUTHORED_FEINT_BLEND_SECONDS } from './authored-enemy-attacks.js';
import { motionPhaseForSnapshot } from './animation-motion.js';
import { ENEMY_DIRECTION_SEMANTICS } from './enemy-screen-space-direction.js';
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

function bladeWorldAxis(entity) {
  const q = entity?.getRotation?.();
  if (!q) return { x: 0, y: 0, z: 0 };
  return {
    x: 2 * (q.x * q.y - q.w * q.z),
    y: 1 - 2 * (q.x * q.x + q.z * q.z),
    z: 2 * (q.y * q.z + q.w * q.x),
  };
}

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
  const bladeAxis = bladeWorldAxis(impl.skinnedSword);
  return {
    backend: view.backend,
    phase: snapshot.phase,
    attackDisplayedDirection: snapshot.attack?.displayedDirection || '',
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
    bladeAxisX: Number(bladeAxis.x) || 0,
    bladeAxisY: Number(bladeAxis.y) || 0,
    bladeAxisZ: Number(bladeAxis.z) || 0,
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
  assert(root.dataset.authoredAttackPack === 'guard-four-direction-v2', 'Authored Guard + four-direction enemy attack pack did not load');
  assert(root.dataset.authoredGuard === 'player-facing-tip-v1', 'Authored player-facing Guard contract was not installed');
  assert(root.dataset.enemyDirectionSemantics === ENEMY_DIRECTION_SEMANTICS, 'Enemy horizontal presentation did not declare player screen-space direction semantics');
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

  // The opponent must already present a real player-facing point guard before the first
  // attack. This samples the actual world Sword axis on the production PlayCanvas rig,
  // not generator metadata or a later strike position.
  const guardEngine = new CombatEngine();
  const guard = render(guardEngine, 0);
  const guardDiagnostic = `axis=(${guard.bladeAxisX.toFixed(3)},${guard.bladeAxisY.toFixed(3)},${guard.bladeAxisZ.toFixed(3)}), required z>0.90 / |x|<0.25 / |y|<0.40`;
  root.dataset.rendererGuardAxis = guardDiagnostic;
  assert(guard.phase === 'ready' && guard.authoredLayerState === 'Guard' && guard.authoredAttackClip === 'Guard', 'Ready state did not use the authored Guard clip');
  assert(guard.bladeAxisZ > 0.90 && Math.abs(guard.bladeAxisX) < 0.25 && Math.abs(guard.bladeAxisY) < 0.40, `Initial katana tip/blade axis did not face the player (${guardDiagnostic})`);

  const DIRECTION_SETTLE_SECONDS = 0.07;
  const sampleDirectionalCut = (direction) => {
    const sampleEngine = new CombatEngine();
    sampleEngine.start(0);
    sampleEngine.drainEvents();
    sampleEngine.update(1550);

    // Each baseline direction begins from the real authored Guard, then advances the
    // actual PlayCanvas animation system past the production Guard→Attack* transition.
    // This preserves the spatial thresholds while avoiding contamination from a prior
    // direction's active crossfade.
    render(guardEngine, 0);
    render(sampleEngine, 2150, 0, Direction.TOP, DIRECTION_INDEX[direction]);
    view.impl.app.update(DIRECTION_SETTLE_SECONDS);
    const windPose = render(sampleEngine, 2150, 0, Direction.TOP, DIRECTION_INDEX[direction]);

    sampleEngine.update(2430);
    const strikeEarlyPose = render(sampleEngine, 2470, 0, Direction.TOP, DIRECTION_INDEX[direction]);
    render(sampleEngine, 2525, 0, Direction.TOP, DIRECTION_INDEX[direction]);
    const strikePose = render(sampleEngine, 2580, 0, Direction.TOP, DIRECTION_INDEX[direction]);
    return { wind: windPose, strikeEarly: strikeEarlyPose, strike: strikePose };
  };

  const rightCut = sampleDirectionalCut(Direction.RIGHT);
  const leftCut = sampleDirectionalCut(Direction.LEFT);
  const bottomCut = sampleDirectionalCut(Direction.BOTTOM);
  const windRight = rightCut.wind;
  const windLeft = leftCut.wind;
  const windBottom = bottomCut.wind;

  const engine = new CombatEngine();
  engine.start(0);
  engine.drainEvents();
  engine.update(1550);
  render(guardEngine, 0);
  render(engine, 2150);
  view.impl.app.update(DIRECTION_SETTLE_SECONDS);
  const wind = render(engine, 2150);
  const topWind = wind;
  assert(wind.phase === 'telegraph' && wind.wind > 0.35, 'Telegraph did not reach a readable wind-up pose');
  assert(wind.characterReady && wind.characterClip === 'Windup', 'Skinned rig did not enter the Windup compatibility phase');
  assert(wind.readTrailEnabled, 'Skinned sword did not expose the in-world blade-read trail during telegraph');
  assert(wind.bladeGripLocked && wind.bladeOrientationDeltaDeg < 0.25, 'Top telegraph did not preserve the authored HandR-to-sword orientation');

  // RIGHT/LEFT are defined by the player's screen-space travel direction. Because the
  // opponent faces the player, the renderer mirrors only the enemy horizontal index:
  // RIGHT starts on screen-left and cuts right; LEFT starts right and cuts left. These
  // baselines are sampled only after the real authored transition has settled.
  assert(windRight.characterYaw > 8 && windLeft.characterYaw < -8, 'Player-screen Right/Left telegraphs did not mirror the opponent full-body orientation correctly');
  assert(Math.abs(windRight.characterYaw - windLeft.characterYaw) > 20, 'Right/left directional body language was not materially distinct');
  assert(windBottom.enemyY < wind.enemyY - 0.04, 'Bottom telegraph did not lower the opponent stance');
  const lateralWindDiagnostic = `rightStartX=${windRight.bladeTipX.toFixed(3)}, leftStartX=${windLeft.bladeTipX.toFixed(3)}, required right<-0.700 / left>+0.700`;
  root.dataset.rendererLateralWindTips = lateralWindDiagnostic;
  assert(windRight.bladeTipX < -0.7 && windLeft.bladeTipX > 0.7, `Player-screen Right/Left wind-up sides were reversed (${lateralWindDiagnostic})`);
  assert(windBottom.bladeTipY < wind.bladeTipY - 0.55, 'Bottom wind-up blade tip did not start materially below the top attack');
  assert(windRight.authoredLayerState === 'AttackLeft' && windLeft.authoredLayerState === 'AttackRight' && windBottom.authoredLayerState === 'AttackBottom', 'Player-screen direction adapter did not select the mirrored opponent-local authored side clips');
  assert([windRight, windLeft, windBottom].every((pose) => pose.bladeGripLocked && pose.bladeOrientationDeltaDeg < 0.25), 'One or more directional telegraphs rotated the blade away from the authored HandR grip');
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

  const strikeRight = rightCut.strike;
  const strikeLeft = leftCut.strike;
  const strikeBottom = bottomCut.strike;
  assert(strikeRight.bladeCrossedPlane && strikeLeft.bladeCrossedPlane && strikeBottom.bladeCrossedPlane, 'One or more directional strikes failed to cross the player-facing parry plane');
  assert([strikeRight, strikeLeft, strikeBottom].every((pose) => pose.bladeGripLocked && pose.bladeOrientationDeltaDeg < 0.25), 'One or more directional strikes rotated the blade away from the authored HandR grip');
  assert(strikeRight.bladeTipX > windRight.bladeTipX + 0.20, 'RIGHT did not travel toward the player screen-right from its left-side wind-up');
  assert(strikeLeft.bladeTipX < windLeft.bladeTipX - 0.20, 'LEFT did not travel toward the player screen-left from its right-side wind-up');
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
  assert(animLayer.activeState === 'AttackLeft', 'Player-screen RIGHT telegraph did not enter the mirrored opponent-local AttackLeft clip');
  view.draw({ ...continuityBase, phase: 'telegraph', phaseProgress: 0.56 }, 3450, { ...continuityMeta, attackDirectionIndex: DIRECTION_INDEX[Direction.LEFT] });
  assert(animLayer.activeState === 'AttackRight', 'Player-screen LEFT telegraph did not enter the mirrored opponent-local AttackRight clip');
  const directionSwitchTransitions = attackTransitions.slice(directionSwitchStart);
  assert(directionSwitchTransitions.includes('AttackLeft') && directionSwitchTransitions.includes('AttackRight'), 'Direction switch did not transition between the mirrored authored directional tracks');
  assert(!directionSwitchTransitions.includes('Windup'), 'Direction switch leaked through the generic Windup state');

  // Exercise a real Ronin feint instead of inferring production behavior from immediate
  // back-to-back renderer overrides. CombatEngine commits the final player-screen RIGHT
  // direction at feintAt; the authored rig then has 50 ms to blend directly from the
  // opponent-local AttackRight (displayed LEFT) to AttackLeft (final RIGHT).
  render(guardEngine, 0);
  const roninEngine = new CombatEngine({ enemies: [ENEMIES[1]] });
  roninEngine.start(0);
  roninEngine.drainEvents();
  roninEngine.update(1550);
  const roninTelegraphStart = roninEngine.phaseStartedAt;
  const roninTelegraphMs = roninEngine.currentAttack.telegraphMs;
  const roninStrikeMs = roninEngine.currentAttack.strikeMs;
  const feintResolveAt = roninTelegraphStart + Math.ceil((roninEngine.currentAttack.feintAt ?? 0.62) * roninTelegraphMs);
  const feintLeadAt = feintResolveAt - 85;

  render(roninEngine, feintLeadAt);
  view.impl.app.update(DIRECTION_SETTLE_SECONDS);
  const feintLead = render(roninEngine, feintLeadAt);
  assert(feintLead.attackDisplayedDirection === Direction.LEFT, 'Ronin feint did not begin on the authored displayed LEFT direction');
  assert(feintLead.authoredAttackClip === 'AttackRight' && feintLead.authoredLayerState === 'AttackRight', 'Ronin feint lead did not settle on the mirrored opponent-local AttackRight clip');

  const strikeStartsAt = roninEngine.phaseEndsAt;
  roninEngine.update(feintResolveAt);
  const feintImmediate = render(roninEngine, feintResolveAt);
  assert(feintImmediate.attackDisplayedDirection === Direction.RIGHT, 'CombatEngine did not commit the Ronin final RIGHT direction immediately at feint resolution');
  assert(feintImmediate.authoredAttackClip === 'AttackLeft' && feintImmediate.authoredLayerState === 'AttackLeft', 'Ronin feint did not target the final mirrored AttackLeft clip immediately');

  const feintSettleMs = Math.ceil((AUTHORED_FEINT_BLEND_SECONDS + 0.015) * 1000);
  const feintSettledAt = feintResolveAt + feintSettleMs;
  view.impl.app.update(feintSettleMs / 1000);
  roninEngine.update(feintSettledAt);
  const feintSettled = render(roninEngine, feintSettledAt);
  const feintRemainingMs = roninEngine.phaseEndsAt - feintSettledAt;
  assert(feintSettled.attackDisplayedDirection === Direction.RIGHT, 'Ronin final direction changed after the authored feint blend');
  assert(feintSettled.authoredAttackClip === 'AttackLeft' && feintSettled.authoredLayerState === 'AttackLeft', 'Ronin final authored clip did not remain AttackLeft after the 50 ms blend');
  assert(feintSettled.bladeTipX < -0.7, `Ronin final RIGHT cue did not settle on screen-left before the cut (x=${feintSettled.bladeTipX.toFixed(3)})`);
  assert(feintSettled.bladeGripLocked && feintSettled.bladeOrientationDeltaDeg < 0.25, 'Ronin feint blend broke the authored Sword→HandR grip');
  assert(feintRemainingMs >= 150, `Ronin final cue settled too late to read before strike (${feintRemainingMs} ms remaining)`);
  assert(strikeStartsAt - roninTelegraphStart === roninTelegraphMs, 'Ronin feint blend changed authoritative telegraph timing');

  roninEngine.update(strikeStartsAt);
  const roninStrikeEarly = render(roninEngine, strikeStartsAt + 40);
  render(roninEngine, strikeStartsAt + 105);
  const roninStrike = render(roninEngine, strikeStartsAt + 175);
  assert(roninEngine.phase === 'strike' && roninEngine.phaseEndsAt - strikeStartsAt === roninStrikeMs, 'Ronin feint blend changed authoritative strike timing');
  assert(roninStrike.bladeTipX > feintSettled.bladeTipX + 0.20, 'Ronin final RIGHT cut did not travel toward player screen-right after the settled feint');
  assert(roninStrike.bladeTipX > roninStrikeEarly.bladeTipX, 'Ronin final RIGHT blade path did not continue screen-right through strike');
  assert(roninStrike.bladeCrossedPlane, 'Ronin final RIGHT strike did not cross the player-facing parry plane');
  assert(roninStrike.bladeGripLocked && roninStrike.bladeOrientationDeltaDeg < 0.25, 'Ronin final RIGHT strike lost the authored Sword→HandR grip');
  root.dataset.rendererRoninFeint = `left-to-right-settled-v1:${feintRemainingMs}ms`;

  root.dataset.rendererMotionIntegration = 'pass';
  root.dataset.rendererMotionSequence = 'telegraph-strike-parry-counter';
  root.dataset.rendererMotionBackend = view.backend;
  root.dataset.rendererCharacterPipeline = 'skinned-gltf-v1';
  root.dataset.rendererCharacterClips = 'Guard,Windup,Strike,Parry';
  root.dataset.rendererDirectionalRead = 'top-right-bottom-left';
  root.dataset.rendererDirectionSemantics = ENEMY_DIRECTION_SEMANTICS;
  root.dataset.rendererGuardFacing = 'player-facing-tip-v1';
  root.dataset.rendererBladeTrajectory = 'grip-locked-authored-v3';
  root.dataset.rendererStageIdentity = identities.join(',');
  root.dataset.rendererAuthoredAttacks = 'guard-continuous-four-direction-v2';
  root.dataset.rendererAuthoredTransitions = attackTransitions.join(',');
} catch (error) {
  console.error('PlayCanvas renderer contract smoke failed', error);
  root.dataset.rendererMotionIntegration = 'fail';
  root.dataset.rendererMotionError = String(error?.message || error).slice(0, 180);
} finally {
  try { view?.impl?.app?.destroy?.(); } catch {}
  canvas.remove();
}
