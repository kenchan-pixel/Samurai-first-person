import * as pc from 'playcanvas';
import { playerWeaponPose } from './player-weapon-pose.js';

const installed = Symbol.for('blade-reversal.player-weapon-fidelity-v2');

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

function applyPose(entity, position, euler) {
  entity?.setLocalPosition?.(...position);
  entity?.setLocalEulerAngles?.(...euler);
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
    const pose = playerWeaponPose(action, direction, progress);

    applyPose(view.playerForearmR, pose.forearmRPosition, pose.forearmREuler);
    applyPose(view.playerForearmL, pose.forearmLPosition, pose.forearmLEuler);
    applyPose(view.playerHandR, pose.handRPosition, pose.handREuler);
    applyPose(view.playerHandL, pose.handLPosition, pose.handLEuler);
    applyPose(view.playerCuffR, pose.cuffRPosition, pose.cuffREuler);
    applyPose(view.playerCuffL, pose.cuffLPosition, pose.cuffLEuler);

    document.documentElement.dataset.playerGripDirection = String(pose.direction);
    document.documentElement.dataset.playerGripAction = String(pose.action);
  };

  document.documentElement.dataset.playerWeaponFidelity = 'directional-two-hand-rig-v2';
  document.documentElement.dataset.playerWeaponParts = '8';
  document.documentElement.dataset.playerGripDirections = 'top,right,bottom,left';
  return view;
}
