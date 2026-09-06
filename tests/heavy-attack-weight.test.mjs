import test from 'node:test';
import assert from 'node:assert/strict';
import { heavyAttackWeightFrame, installHeavyAttackWeight } from '../src/heavy-attack-weight.js';

const heavy = (phase, phaseProgress) => ({ phase, phaseProgress, attack: { heavy: true } });

test('normal attacks remain presentation-neutral', () => {
  assert.deepEqual(heavyAttackWeightFrame({ phase: 'strike', phaseProgress: 0.5, attack: { heavy: false } }), {
    active: false, phase: 'strike', load: 0, drive: 0, follow: 0, read: 0,
  });
});

test('heavy attack frame preserves phase-boundary weight continuity', () => {
  const teleEnd = heavyAttackWeightFrame(heavy('telegraph', 1));
  const strikeStart = heavyAttackWeightFrame(heavy('strike', 0));
  const strikeEnd = heavyAttackWeightFrame(heavy('strike', 1));
  const recoveryStart = heavyAttackWeightFrame(heavy('recovery', 0));

  assert.equal(teleEnd.load, 1);
  assert.equal(strikeStart.load, 1);
  assert.equal(strikeStart.drive, 0);
  assert.equal(strikeEnd.drive, 1);
  assert.equal(strikeEnd.follow, 1);
  assert.equal(recoveryStart.drive, 1);
  assert.equal(recoveryStart.follow, 1);
});

function entity({ x = 0, y = 0, z = 0, ex = 0, ey = 0, ez = 0, sx = 1, sy = 1, sz = 1 } = {}) {
  let position = { x, y, z };
  let euler = { x: ex, y: ey, z: ez };
  let scale = { x: sx, y: sy, z: sz };
  return {
    enabled: true,
    getLocalPosition: () => ({ ...position }),
    setLocalPosition: (nx, ny, nz) => { position = { x: nx, y: ny, z: nz }; },
    getLocalEulerAngles: () => ({ ...euler }),
    setLocalEulerAngles: (nx, ny, nz) => { euler = { x: nx, y: ny, z: nz }; },
    getLocalScale: () => ({ ...scale }),
    setLocalScale: (nx, ny, nz) => { scale = { x: nx, y: ny, z: nz }; },
    read: () => ({ position, euler, scale }),
  };
}

test('installed pass adds load, forward drive and blade emphasis without touching normal attacks', () => {
  const enemy = entity();
  const character = entity();
  const trail = entity({ sx: 0.1, sy: 1.4, sz: 0.05 });
  const camera = (() => {
    let position = { x: 0, y: 1.75, z: 5.7 };
    return {
      getPosition: () => ({ ...position }),
      setPosition: (x, y, z) => { position = { x, y, z }; },
      lookAt: () => {},
      read: () => ({ ...position }),
    };
  })();
  const view = {
    enemy,
    skinnedModel: character,
    skinnedReadTrail: trail,
    camera,
    draw(state) {
      enemy.setLocalPosition(0, 0, 0);
      character.setLocalEulerAngles(0, 0, 0);
      trail.setLocalScale(0.1, 1.4, 0.05);
      camera.setPosition(0, 1.75, 5.7);
      return state?.phase;
    },
  };
  installHeavyAttackWeight(view);

  view.draw({ phase: 'strike', phaseProgress: 0.8, attack: { heavy: false } });
  assert.deepEqual(enemy.read().position, { x: 0, y: 0, z: 0 });

  view.draw(heavy('telegraph', 1));
  assert.ok(enemy.read().position.z < -0.06, 'heavy wind-up should load away from the player');
  assert.ok(character.read().euler.x > 5, 'heavy wind-up should visibly brace the full body');

  view.draw(heavy('strike', 0.8));
  assert.ok(enemy.read().position.z > 0.13, 'heavy strike should drive forward past the neutral root');
  assert.ok(enemy.read().position.y < -0.03, 'heavy strike should retain a lowered weighted stance');
  assert.ok(character.read().euler.x < -3, 'heavy strike should commit the full body forward');
  assert.ok(trail.read().scale.y > 1.6, 'heavy strike should enlarge the existing real-blade read trail');
  assert.ok(camera.read().z > 5.73, 'heavy strike should add a bounded camera pressure response');
});
