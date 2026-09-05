import { CombatEngine, Direction, ENEMIES } from './game-core.js';
import { motionPhaseForSnapshot } from './animation-motion.js';
import { AttackRhythm } from './attack-rhythm.js';
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

function topEnemy({ telegraphMs, strikeMs, heavy = false }) {
  const base = ENEMIES[0];
  return Object.freeze({
    ...base,
    attacks: Object.freeze([
      Object.freeze({ direction: Direction.TOP, telegraphMs, strikeMs, damage: heavy ? 2 : 1, heavy }),
    ]),
  });
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
  const rhythm = impl.attackRhythmState || {};
  const heavy = impl.heavyAttackWeightState || {};
  const trajectory = impl.bladeTrajectoryState || {};
  const authored = impl.authoredAttackState || {};
  return {
    phase: snapshot.phase,
    telegraphMs: snapshot.attack?.telegraphMs,
    strikeMs: snapshot.attack?.strikeMs,
    profile: rhythm.profile || '',
    load: Number(rhythm.load) || 0,
    drive: Number(rhythm.drive) || 0,
    follow: Number(rhythm.follow) || 0,
    bodyY: Number(rhythm.bodyY) || 0,
    bodyZ: Number(rhythm.bodyZ) || 0,
    trailLengthGain: Number(rhythm.trailLengthGain) || 0,
    heavyActive: heavy.active === true,
    authoredClip: authored.clip || '',
    authoredLayer: impl.skinnedModel?.anim?.baseLayer?.activeState || '',
    readTrailEnabled: impl.skinnedReadTrail?.enabled === true,
    swordParent: impl.skinnedSword?.parent?.name || '',
    gripLocked: trajectory.gripLocked === true,
    orientationDeltaDeg: Number(trajectory.orientationDeltaDeg) || 0,
  };
}

function startSingle(enemy) {
  const engine = new CombatEngine({ enemies: [enemy] });
  engine.start(0);
  engine.drainEvents();
  engine.update(1550);
  return engine;
}

try {
  assert(innerWidth === 320 && innerHeight === 568, `Attack-rhythm gate requires 320x568 viewport, got ${innerWidth}x${innerHeight}`);
  view = new View(canvas);
  assert(view.backend === 'playcanvas', 'Attack-rhythm gate did not stay on PlayCanvas');
  const characterReady = await view.impl.characterReady;
  assert(characterReady && view.impl.skinnedModel, 'Attack-rhythm gate could not load the skinned samurai');
  await view.impl.bladeTrajectoryReady;
  assert(view.impl.authoredAttackClipsReady === true, 'Authored four-direction attack pack was not ready');
  assert(view.impl.skinnedSword?.parent?.name === 'HandR', 'Enemy Sword is not directly parented to HandR');
  assert(root.dataset.attackRhythmContract === 'measured-standard-quick-heavy-v1', 'Attack-rhythm presentation contract was not installed');

  const measuredEngine = startSingle(topEnemy({ telegraphMs: 880, strikeMs: 330 }));
  const measured = draw(measuredEngine, 2165);
  assert(measured.phase === 'telegraph' && measured.profile === AttackRhythm.MEASURED, 'Slow baseline cut did not enter measured presentation');
  assert(measured.telegraphMs === 880 && measured.strikeMs === 330, 'Measured renderer gate did not receive exact authoritative timing metadata');
  assert(measured.load > 0.8 && measured.bodyY < -0.025 && measured.bodyZ < -0.025, 'Measured cut did not visibly settle into a deeper held load');
  assert(measured.authoredClip === 'AttackTop' && measured.authoredLayer === 'AttackTop', 'Measured cut left the authored AttackTop track');
  assert(measured.readTrailEnabled && measured.swordParent === 'HandR' && measured.gripLocked && measured.orientationDeltaDeg < 0.25, 'Measured cut broke the real-blade authored grip/read path');

  const standardEngine = startSingle(topEnemy({ telegraphMs: 560, strikeMs: 225 }));
  const standard = draw(standardEngine, 1900);
  assert(standard.phase === 'telegraph' && standard.profile === AttackRhythm.STANDARD, 'Mid-tempo cut did not remain standard');
  assert(standard.bodyY === 0 && standard.bodyZ === 0 && standard.trailLengthGain === 0, 'Standard cut received unintended rhythm offsets');
  assert(standard.swordParent === 'HandR' && standard.gripLocked && standard.orientationDeltaDeg < 0.25, 'Standard cut broke authored grip neutrality');

  const quickEngine = startSingle(topEnemy({ telegraphMs: 420, strikeMs: 140 }));
  const quickTelegraph = draw(quickEngine, 1845);
  assert(quickTelegraph.profile === AttackRhythm.QUICK && quickTelegraph.phase === 'telegraph', 'Fast cut did not enter quick presentation during telegraph');
  quickEngine.update(1970);
  const quickStrike = draw(quickEngine, 2025);
  assert(quickStrike.phase === 'strike' && quickStrike.profile === AttackRhythm.QUICK, 'Fast cut did not keep quick presentation into strike');
  assert(quickStrike.telegraphMs === 420 && quickStrike.strikeMs === 140, 'Quick renderer gate did not preserve exact authoritative timing metadata');
  assert(quickStrike.drive > 0.95 && quickStrike.bodyZ > 0.075 && quickStrike.trailLengthGain > 0.20, 'Quick cut did not produce the bounded snap/drive read');
  assert(quickStrike.authoredClip === 'AttackTop' && quickStrike.authoredLayer === 'AttackTop', 'Quick cut left the authored AttackTop track');
  assert(quickStrike.readTrailEnabled && quickStrike.swordParent === 'HandR' && quickStrike.gripLocked && quickStrike.orientationDeltaDeg < 0.25, 'Quick cut broke the real-blade authored grip/read path');

  const heavyEngine = startSingle(ENEMIES[2]);
  const heavy = draw(heavyEngine, 2165);
  assert(heavy.phase === 'telegraph' && heavy.profile === AttackRhythm.HEAVY, 'Oni heavy cut did not remain in the dedicated heavy family');
  assert(heavy.bodyY === 0 && heavy.bodyZ === 0 && heavy.trailLengthGain === 0, 'Attack-rhythm adapter double-applied root/trail weight to heavy attacks');
  assert(heavy.heavyActive, 'Existing heavy-attack weighting was not active for the heavy family');
  assert(heavy.swordParent === 'HandR' && heavy.gripLocked && heavy.orientationDeltaDeg < 0.25, 'Heavy-family coexistence broke authored grip authority');

  root.dataset.attackRhythmRendererIntegration = 'pass';
  root.dataset.attackRhythmRendererViewport = '320x568';
  root.dataset.attackRhythmRendererSequence = 'measured-standard-quick-heavy';
  root.dataset.attackRhythmRendererBlade = 'authored-handr-grip';
  root.dataset.attackRhythmRendererCombat = 'timings-unchanged';
} catch (error) {
  console.error('PlayCanvas attack-rhythm renderer contract smoke failed', error);
  root.dataset.attackRhythmRendererIntegration = 'fail';
  root.dataset.attackRhythmRendererError = String(error?.message || error).slice(0, 220);
} finally {
  try { view?.impl?.app?.destroy?.(); } catch {}
  canvas.remove();
}
