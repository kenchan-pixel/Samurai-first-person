import { CombatEngine, Direction, ENEMIES, oppositeDirection } from './game-core.js';
import { motionPhaseForSnapshot } from './animation-motion.js';
import { PLAYER_WEAPON_BASE_POSE } from './player-weapon-pose.js';
import { View } from './renderer.js';

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

const VIEWPORT_WIDTH = 320;
const VIEWPORT_HEIGHT = 568;
const DIRECTION_INDEX = Object.freeze({
  [Direction.TOP]: 0,
  [Direction.RIGHT]: 1,
  [Direction.BOTTOM]: 2,
  [Direction.LEFT]: 3,
});

const SUPPORT_PARTS = Object.freeze([
  ['forearmR', 'playerForearmR'],
  ['forearmL', 'playerForearmL'],
  ['handR', 'playerHandR'],
  ['handL', 'playerHandL'],
  ['cuffR', 'playerCuffR'],
  ['cuffL', 'playerCuffL'],
]);

const BASE_POSITIONS = Object.freeze({
  forearmR: PLAYER_WEAPON_BASE_POSE.forearmRPosition,
  forearmL: PLAYER_WEAPON_BASE_POSE.forearmLPosition,
  handR: PLAYER_WEAPON_BASE_POSE.handRPosition,
  handL: PLAYER_WEAPON_BASE_POSE.handLPosition,
  cuffR: PLAYER_WEAPON_BASE_POSE.cuffRPosition,
  cuffL: PLAYER_WEAPON_BASE_POSE.cuffLPosition,
});

const BASE_EULERS = Object.freeze({
  forearmR: PLAYER_WEAPON_BASE_POSE.forearmREuler,
  forearmL: PLAYER_WEAPON_BASE_POSE.forearmLEuler,
  handR: PLAYER_WEAPON_BASE_POSE.handREuler,
  handL: PLAYER_WEAPON_BASE_POSE.handLEuler,
  cuffR: PLAYER_WEAPON_BASE_POSE.cuffREuler,
  cuffL: PLAYER_WEAPON_BASE_POSE.cuffLEuler,
});

let view;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function xyz(value) {
  return {
    x: Number(value?.x) || 0,
    y: Number(value?.y) || 0,
    z: Number(value?.z) || 0,
  };
}

function lengthBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function finite3(point) {
  return Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.z);
}

function pointToSegmentMetric(point, start, end) {
  const ab = {
    x: end.x - start.x,
    y: end.y - start.y,
    z: end.z - start.z,
  };
  const ap = {
    x: point.x - start.x,
    y: point.y - start.y,
    z: point.z - start.z,
  };
  const denominator = ab.x * ab.x + ab.y * ab.y + ab.z * ab.z;
  const rawT = denominator > 0
    ? (ap.x * ab.x + ap.y * ab.y + ap.z * ab.z) / denominator
    : 0;
  const t = Math.max(0, Math.min(1, rawT));
  const closest = {
    x: start.x + ab.x * t,
    y: start.y + ab.y * t,
    z: start.z + ab.z * t,
  };
  return { distance: lengthBetween(point, closest), rawT };
}

function screenBoundsForEntity(entity, label) {
  const meshInstances = entity?.render?.meshInstances || [];
  assert(meshInstances.length > 0, `${label} has no live render mesh for viewport verification`);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const meshInstance of meshInstances) {
    const aabb = meshInstance?.aabb;
    assert(aabb?.getMin && aabb?.getMax, `${label} has no live world AABB`);
    const min = aabb.getMin();
    const max = aabb.getMax();
    for (const x of [min.x, max.x]) {
      for (const y of [min.y, max.y]) {
        for (const z of [min.z, max.z]) {
          const world = min.clone();
          world.x = x;
          world.y = y;
          world.z = z;
          const screen = view.impl.camera.camera.worldToScreen(world);
          assert(Number.isFinite(screen?.x) && Number.isFinite(screen?.y), `${label} projected a non-finite screen point`);
          minX = Math.min(minX, screen.x);
          minY = Math.min(minY, screen.y);
          maxX = Math.max(maxX, screen.x);
          maxY = Math.max(maxY, screen.y);
        }
      }
    }
  }
  return { minX, minY, maxX, maxY };
}

function unionBounds(bounds) {
  return bounds.reduce((combined, current) => ({
    minX: Math.min(combined.minX, current.minX),
    minY: Math.min(combined.minY, current.minY),
    maxX: Math.max(combined.maxX, current.maxX),
    maxY: Math.max(combined.maxY, current.maxY),
  }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
}

function intersectsViewport(bounds) {
  return bounds.maxX >= 0
    && bounds.minX <= VIEWPORT_WIDTH
    && bounds.maxY >= 0
    && bounds.minY <= VIEWPORT_HEIGHT;
}

function snapshotSupport() {
  const impl = view.impl;
  const parts = {};
  for (const [key, property] of SUPPORT_PARTS) {
    const entity = impl[property];
    parts[key] = {
      position: xyz(entity?.getLocalPosition?.()),
      euler: xyz(entity?.getLocalEulerAngles?.()),
      parent: entity?.parent?.name || '',
    };
  }

  const playerGrip = impl.playerRig?.findByName?.('PlayerGrip');
  const playerBlade = impl.playerRig?.findByName?.('PlayerBlade');
  const pommelWorld = xyz(impl.playerPommel?.getPosition?.());
  const habakiWorld = xyz(impl.playerHabaki?.getPosition?.());
  const handRMetric = pointToSegmentMetric(xyz(impl.playerHandR?.getPosition?.()), pommelWorld, habakiWorld);
  const handLMetric = pointToSegmentMetric(xyz(impl.playerHandL?.getPosition?.()), pommelWorld, habakiWorld);
  const supportProjection = unionBounds(SUPPORT_PARTS.map(([key, property]) => screenBoundsForEntity(impl[property], key)));
  const handleProjection = unionBounds([
    screenBoundsForEntity(playerGrip, 'PlayerGrip'),
    screenBoundsForEntity(impl.playerPommel, 'PlayerPommel'),
    screenBoundsForEntity(impl.playerHabaki, 'PlayerHabaki'),
  ]);
  const bladeProjection = screenBoundsForEntity(playerBlade, 'PlayerBlade');

  return {
    action: Number(impl.playerAction) || 0,
    direction: Number(impl.playerDirection) || 0,
    parts,
    rigEuler: xyz(impl.playerRig?.getLocalEulerAngles?.()),
    attachment: { handR: handRMetric, handL: handLMetric },
    projection: {
      support: supportProjection,
      handle: handleProjection,
      blade: bladeProjection,
    },
  };
}

function draw(engine, now, playerAction, direction) {
  const snapshot = engine.snapshot(now);
  const motionPhase = motionPhaseForSnapshot(snapshot);
  const renderState = motionPhase === snapshot.phase ? snapshot : { ...snapshot, phase: motionPhase };
  view.draw(renderState, now, {
    attackDirectionIndex: DIRECTION_INDEX[snapshot.attack?.displayedDirection] ?? 0,
    playerAction,
    playerDirectionIndex: DIRECTION_INDEX[direction] ?? 0,
    hitAge: 999,
    shake: 0,
  });
  return snapshotSupport();
}

function singleAttackEnemy(direction) {
  const attack = { ...ENEMIES[0].attacks[0], direction };
  delete attack.feintFrom;
  delete attack.feintAt;
  return { ...ENEMIES[0], attacks: [attack] };
}

function prepareParry(direction, startAt, { perfect = false } = {}) {
  const engine = new CombatEngine({ enemies: [singleAttackEnemy(direction)] });
  engine.start(startAt);
  engine.drainEvents();
  engine.update(startAt + 1550);
  assert(engine.phase === 'telegraph' && engine.currentAttack?.direction === direction, `${direction} setup did not enter the intended real telegraph`);
  const strikeAt = engine.phaseEndsAt;
  engine.update(strikeAt);
  assert(engine.phase === 'strike', `${direction} setup did not enter the real strike window`);
  const parryAt = strikeAt + (perfect ? 20 : 150);
  engine.update(parryAt);
  const result = engine.attemptParry(direction, parryAt);
  assert(result.accepted, `${direction} real parry was rejected`);
  assert(Boolean(result.perfect) === perfect, `${direction} real parry did not preserve ${perfect ? 'Perfect' : 'normal'} timing identity`);
  return { engine, parryAt };
}

function assertCompactSupport(pose, label) {
  for (const [key] of SUPPORT_PARTS) {
    const part = pose.parts[key];
    assert(part.parent === 'PlayerSwordRig', `${label} ${key} detached from PlayerSwordRig`);
    assert(finite3(part.position) && finite3(part.euler), `${label} ${key} exposed non-finite live transforms`);
    const p = part.position;
    assert(Math.abs(p.x) <= 0.30 && p.y >= -0.68 && p.y <= 0.02 && p.z >= 0 && p.z <= 0.24, `${label} ${key} escaped the accepted foreground local-position budget`);
    assert(Math.abs(part.euler.x) <= 65 && Math.abs(part.euler.y) <= 65 && Math.abs(part.euler.z) <= 65, `${label} ${key} escaped the accepted foreground rotation budget`);
  }
  const handGap = lengthBetween(pose.parts.handR.position, pose.parts.handL.position);
  assert(handGap >= 0.12 && handGap <= 0.38, `${label} support hands separated from the compact two-hand grip budget (${handGap.toFixed(3)})`);

  for (const hand of ['handR', 'handL']) {
    const metric = pose.attachment[hand];
    assert(metric.distance <= 0.17, `${label} ${hand} drifted away from the live pommel→habaki grip axis (${metric.distance.toFixed(3)})`);
    assert(metric.rawT >= -0.15 && metric.rawT <= 1.08, `${label} ${hand} escaped the live handle length (${metric.rawT.toFixed(3)})`);
  }

  assert(intersectsViewport(pose.projection.support), `${label} support silhouette has no geometry intersecting the 320x568 viewport`);
  assert(intersectsViewport(pose.projection.handle), `${label} live handle has no geometry intersecting the 320x568 viewport`);
  assert(intersectsViewport(pose.projection.blade), `${label} live player blade has no geometry intersecting the 320x568 viewport`);
  assert(
    pose.projection.blade.minY < pose.projection.support.minY - 24,
    `${label} support silhouette obscured the blade's projected readable extension`,
  );
}

function assertNeutral(pose, label) {
  for (const [key] of SUPPORT_PARTS) {
    const actualPosition = pose.parts[key].position;
    const actualEuler = pose.parts[key].euler;
    const expectedPosition = BASE_POSITIONS[key];
    const expectedEuler = BASE_EULERS[key];
    const positionError = Math.hypot(
      actualPosition.x - expectedPosition[0],
      actualPosition.y - expectedPosition[1],
      actualPosition.z - expectedPosition[2],
    );
    const eulerError = Math.hypot(
      actualEuler.x - expectedEuler[0],
      actualEuler.y - expectedEuler[1],
      actualEuler.z - expectedEuler[2],
    );
    assert(positionError < 0.0001 && eulerError < 0.001, `${label} ${key} did not return to the authored neutral support pose`);
  }
}

function sampleNormalParry(direction, startAt) {
  const prepared = prepareParry(direction, startAt);
  draw(prepared.engine, prepared.parryAt, 1, direction);
  const pose = draw(prepared.engine, prepared.parryAt + 145, 1, direction);
  assert(pose.action === 1 && pose.direction === DIRECTION_INDEX[direction], `${direction} player parry did not reach the real PlayCanvas grip adapter`);
  assertCompactSupport(pose, `${direction} parry`);
  return { ...prepared, pose };
}

try {
  assert(innerWidth === VIEWPORT_WIDTH && innerHeight === VIEWPORT_HEIGHT, `Player-grip renderer gate requires 320x568 viewport, got ${innerWidth}x${innerHeight}`);
  assert(canvas.width === VIEWPORT_WIDTH && canvas.height === VIEWPORT_HEIGHT, 'Player-grip renderer contract canvas was not 320x568');
  view = new View(canvas);
  assert(view.backend === 'playcanvas', 'Player-grip renderer contract did not stay on PlayCanvas');
  const impl = view.impl;
  assert(root.dataset.playerWeaponFidelity === 'directional-two-hand-rig-v2', 'Directional first-person weapon-fidelity adapter was not installed');
  assert(impl.playerRig?.name === 'PlayerSwordRig', 'Authoritative player weapon rig was unavailable');
  for (const [, property] of SUPPORT_PARTS) assert(impl[property]?.parent === impl.playerRig, `${property} was not directly parented to PlayerSwordRig`);
  assert(impl.playerHabaki?.parent === impl.playerRig && impl.playerPommel?.parent === impl.playerRig, 'Katana grip reference parts were not attached to PlayerSwordRig');
  assert(impl.playerRig.findByName('PlayerGrip')?.parent === impl.playerRig, 'PlayerGrip was not attached to PlayerSwordRig');
  assert(impl.playerRig.findByName('PlayerBlade')?.parent === impl.playerRig, 'PlayerBlade was not attached to PlayerSwordRig');

  const neutralEngine = new CombatEngine();
  const neutral = draw(neutralEngine, 0, 0, Direction.TOP);
  assertNeutral(neutral, 'Initial neutral');

  const top = sampleNormalParry(Direction.TOP, 0);
  const counterAt = top.parryAt + 180;
  const counter = top.engine.attemptAttack(oppositeDirection(Direction.TOP), counterAt);
  assert(counter.accepted, 'Real opposite-direction counter was rejected after the verified top parry');
  draw(top.engine, counterAt, 3, Direction.BOTTOM);
  const counterPose = draw(top.engine, counterAt + 195, 3, Direction.BOTTOM);
  assert(counterPose.action === 3, 'Counter action did not reach the real PlayCanvas grip adapter');
  assertCompactSupport(counterPose, 'Bottom counter');
  assert(counterPose.parts.forearmR.position.y < BASE_POSITIONS.forearmR[1] - 0.015, 'Bottom counter did not keep a bounded downward support follow-through');
  const counterNeutral = draw(top.engine, counterAt + 410, 0, Direction.TOP);
  assertNeutral(counterNeutral, 'Post-counter neutral');

  const right = sampleNormalParry(Direction.RIGHT, 4000);
  const rightNeutral = draw(right.engine, right.parryAt + 310, 0, Direction.TOP);
  assertNeutral(rightNeutral, 'Post-right-parry neutral');

  const bottom = sampleNormalParry(Direction.BOTTOM, 8000);
  const bottomNeutral = draw(bottom.engine, bottom.parryAt + 310, 0, Direction.TOP);
  assertNeutral(bottomNeutral, 'Post-bottom-parry neutral');

  const left = sampleNormalParry(Direction.LEFT, 12000);
  const leftNeutral = draw(left.engine, left.parryAt + 310, 0, Direction.TOP);
  assertNeutral(leftNeutral, 'Post-left-parry neutral');

  assert(top.pose.parts.forearmR.position.y > bottom.pose.parts.forearmR.position.y + 0.09, 'Live Top/Bottom forearm brace did not separate vertically');
  assert(top.pose.parts.handR.position.y > bottom.pose.parts.handR.position.y + 0.07, 'Live Top/Bottom support hand did not separate vertically');
  assert(right.pose.parts.forearmR.position.x > left.pose.parts.forearmR.position.x + 0.07, 'Live Right/Left forearm brace did not mirror laterally');
  assert(right.pose.parts.handR.position.x > left.pose.parts.handR.position.x + 0.05, 'Live Right/Left support hand did not mirror laterally');

  const perfect = prepareParry(Direction.TOP, 16000, { perfect: true });
  draw(perfect.engine, perfect.parryAt, 2, Direction.TOP);
  const perfectPose = draw(perfect.engine, perfect.parryAt + 145, 2, Direction.TOP);
  assert(perfectPose.action === 2, 'Perfect Parry action did not reach the real PlayCanvas grip adapter');
  assertCompactSupport(perfectPose, 'Perfect Top parry');
  const normalTopLift = top.pose.parts.forearmR.position.y - BASE_POSITIONS.forearmR[1];
  const perfectTopLift = perfectPose.parts.forearmR.position.y - BASE_POSITIONS.forearmR[1];
  assert(perfectTopLift > normalTopLift * 1.05, 'Perfect Parry did not preserve the stronger version of the same live directional brace');
  const perfectNeutral = draw(perfect.engine, perfect.parryAt + 310, 0, Direction.TOP);
  assertNeutral(perfectNeutral, 'Post-Perfect neutral');

  root.dataset.playerGripRendererIntegration = 'pass';
  root.dataset.playerGripRendererViewport = '320x568';
  root.dataset.playerGripRendererDirections = 'top,right,bottom,left';
  root.dataset.playerGripRendererActions = 'normal,perfect,counter,neutral';
  root.dataset.playerGripRendererAttachment = 'pommel-habaki-axis-v2';
  root.dataset.playerGripRendererVisibility = 'support-handle-blade-projected-v1';
} catch (error) {
  console.error('Player-grip renderer contract smoke failed', error);
  root.dataset.playerGripRendererIntegration = 'fail';
  root.dataset.playerGripRendererError = String(error?.message || error).slice(0, 180);
} finally {
  try { view?.impl?.app?.destroy?.(); } catch {}
  canvas.remove();
}
