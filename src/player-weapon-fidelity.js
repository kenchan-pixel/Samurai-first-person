import * as pc from 'playcanvas';
import { playerWeaponPose } from './player-weapon-pose.js';

const installed = Symbol.for('blade-reversal.player-weapon-fidelity-v2');
const TOP_PARRY_FRAME_X = -0.22;

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

function applyTopParryFraming(rig, pose) {
  if (!rig?.getLocalPosition || !rig?.setLocalPosition) return;
  if ((pose.action !== 1 && pose.action !== 2) || pose.direction !== 0 || pose.pulse <= 0) return;
  const current = rig.getLocalPosition();
  rig.setLocalPosition(current.x + TOP_PARRY_FRAME_X * pose.pulse, current.y, current.z);
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

    // TOP parry turns the camera-child katana almost vertical. On the accepted
    // 320x568 portrait framing that could leave the compact handle completely
    // beyond the right edge even while the blade/support still intersected it.
    // Move the whole rig together, never individual blade/grip/support pieces,
    // so handle attachment and the authoritative direction/timing stay intact.
    applyTopParryFraming(rig, pose);

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
  document.documentElement.dataset.playerGripFraming = 'top-handle-safe-v1';
  return view;
}
