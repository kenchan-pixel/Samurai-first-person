import * as pc from 'playcanvas';

const installed = Symbol.for('blade-reversal.player-weapon-fidelity-v1');

function addPart(parent, type, name, material, position, scale, euler = [0, 0, 0]) {
  const entity = new pc.Entity(name);
  entity.addComponent('render', { type, castShadows: false, receiveShadows: false });
  entity.render.material = material;
  entity.setLocalPosition(...position);
  entity.setLocalScale(...scale);
  entity.setLocalEulerAngles(...euler);
  parent.addChild(entity);
  return entity;
}

export function installPlayerWeaponFidelity(view) {
  if (!view?.playerRig || view[installed]) return view;
  Object.defineProperty(view, installed, { value: true });

  const M = view.materials;
  const rig = view.playerRig;

  view.playerForearmR = addPart(rig, 'capsule', 'PlayerForearmR', M.cloth, [0.18, -0.48, 0.11], [0.14, 0.56, 0.14], [-8, 0, -22]);
  view.playerForearmL = addPart(rig, 'capsule', 'PlayerForearmL', M.cloth, [-0.17, -0.58, 0.14], [0.14, 0.54, 0.14], [-12, 0, 19]);
  view.playerHandR = addPart(rig, 'sphere', 'PlayerHandR', M.skin, [0.075, -0.13, 0.045], [0.17, 0.22, 0.16], [0, 0, -10]);
  view.playerHandL = addPart(rig, 'sphere', 'PlayerHandL', M.skin, [-0.07, -0.29, 0.055], [0.17, 0.22, 0.16], [0, 0, 10]);
  view.playerCuffR = addPart(rig, 'cylinder', 'PlayerCuffR', M.armourDark, [0.12, -0.30, 0.075], [0.17, 0.12, 0.17], [0, 0, -16]);
  view.playerCuffL = addPart(rig, 'cylinder', 'PlayerCuffL', M.armourDark, [-0.12, -0.45, 0.09], [0.17, 0.12, 0.17], [0, 0, 16]);
  view.playerHabaki = addPart(rig, 'box', 'PlayerHabaki', M.metal, [0, 0.27, 0], [0.12, 0.10, 0.075]);
  view.playerPommel = addPart(rig, 'cylinder', 'PlayerPommel', M.metal, [0, -0.31, 0], [0.105, 0.08, 0.105]);

  const originalDraw = view.draw.bind(view);
  view.draw = (snapshot, now, meta = {}) => {
    originalDraw(snapshot, now, meta);
    const action = meta.playerAction || 0;
    const direction = meta.playerDirectionIndex || 0;
    const progress = view.playerProgress(now, action, direction);
    const pulse = action ? Math.sin(Math.PI * progress) : 0;
    const attack = action === 3;

    view.playerForearmR.setLocalEulerAngles(-8 + pulse * (attack ? 18 : 9), 0, -22 - pulse * (attack ? 18 : 8));
    view.playerForearmL.setLocalEulerAngles(-12 + pulse * (attack ? 13 : 7), 0, 19 + pulse * (attack ? 14 : 7));
    view.playerHandR.setLocalEulerAngles(pulse * 5, 0, -10 - pulse * (attack ? 12 : 6));
    view.playerHandL.setLocalEulerAngles(pulse * 4, 0, 10 + pulse * (attack ? 10 : 5));
  };

  document.documentElement.dataset.playerWeaponFidelity = 'two-hand-rig-v1';
  document.documentElement.dataset.playerWeaponParts = '8';
  return view;
}
