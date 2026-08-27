import * as pc from 'playcanvas';

export const STAGE_IDENTITIES = Object.freeze([
  { id: 'ashigaru-jingasa', enemyScale: 0.98, swordScale: 0.94, commitScale: 0.92 },
  { id: 'ronin-travel-wrap', enemyScale: 1.00, swordScale: 1.00, commitScale: 1.02 },
  { id: 'oni-heavy-guard', enemyScale: 1.04, swordScale: 1.10, commitScale: 1.08 },
  { id: 'crimson-shogun-banner', enemyScale: 1.10, swordScale: 1.16, commitScale: 1.14 },
]);

function part(parent, type, name, material, pos, scale, euler = [0, 0, 0], shadows = true) {
  const entity = new pc.Entity(name);
  entity.addComponent('render', { type, castShadows: shadows, receiveShadows: shadows });
  entity.render.material = material;
  entity.setLocalPosition(...pos);
  entity.setLocalScale(...scale);
  entity.setLocalEulerAngles(...euler);
  parent.addChild(entity);
  return entity;
}

function add(view, stage, parent, type, name, material, pos, scale, euler = [0, 0, 0], shadows = true) {
  const entity = part(parent, type, name, material, pos, scale, euler, shadows);
  entity.enabled = false;
  view.skinnedStageParts[stage].push(entity);
  return entity;
}

function createStageParts(view) {
  const head = view.skinnedModel?.findByName('Head');
  const chest = view.skinnedModel?.findByName('Chest');
  const sword = view.skinnedSword;
  if (!head || !chest || !sword) throw new Error('Skinned samurai is missing Head/Chest/Sword joints for stage identity');
  const M = view.materials;

  // Ashigaru Scout — broad jingasa and a simple diagonal chest cord.
  add(view, 0, head, 'cylinder', 'AshigaruJingasaBrim', M.armour, [0, 0.40, 0], [0.62, 0.045, 0.62]);
  add(view, 0, head, 'cone', 'AshigaruJingasaCrown', M.cloth, [0, 0.48, 0], [0.46, 0.17, 0.46]);
  add(view, 0, chest, 'box', 'AshigaruChestCord', M.accent, [-0.04, 0.05, 0.24], [0.055, 0.70, 0.032], [0, 0, -20], false);

  // Wandering Ronin — headband, travelling sash and a visibly different tsuba accent.
  add(view, 1, head, 'box', 'RoninHeadband', M.accent, [0, 0.18, 0.235], [0.52, 0.065, 0.035], [0, 0, -4]);
  add(view, 1, chest, 'box', 'RoninSash', M.cloth, [0.08, 0.02, 0.24], [0.12, 0.84, 0.035], [0, 0, -31], false);
  add(view, 1, sword, 'box', 'RoninTsubaAccent', M.accent, [0, 0.47, 0.045], [0.56, 0.045, 0.11], [0, 0, 0], false);

  // Oni Guard — horned helmet, broader shoulder mass and a heavier blade spine.
  add(view, 2, head, 'cone', 'OniHornL', M.metal, [-0.18, 0.48, 0], [0.12, 0.36, 0.12], [0, 0, -28]);
  add(view, 2, head, 'cone', 'OniHornR', M.metal, [0.18, 0.48, 0], [0.12, 0.36, 0.12], [0, 0, 28]);
  add(view, 2, chest, 'box', 'OniShoulderL', M.armour, [-0.53, 0.22, 0], [0.40, 0.18, 0.58], [0, 0, -14]);
  add(view, 2, chest, 'box', 'OniShoulderR', M.armour, [0.53, 0.22, 0], [0.40, 0.18, 0.58], [0, 0, 14]);
  add(view, 2, sword, 'box', 'OniBladeSpine', M.armourDark, [0, 1.06, 0.045], [0.15, 1.28, 0.045], [0, 0, 0], false);

  // Crimson Shogun — tall antlers, asymmetric sashimono and a crimson weapon spine.
  add(view, 3, head, 'cone', 'ShogunAntlerL', M.accent, [-0.22, 0.56, 0], [0.13, 0.52, 0.13], [0, 0, -46]);
  add(view, 3, head, 'cone', 'ShogunAntlerR', M.accent, [0.22, 0.56, 0], [0.13, 0.52, 0.13], [0, 0, 46]);
  add(view, 3, chest, 'box', 'ShogunBanner', M.cloth, [0.52, 0.54, -0.20], [0.34, 1.15, 0.045], [0, 0, 0], false);
  add(view, 3, chest, 'box', 'ShogunBannerBar', M.accent, [0.52, 1.08, -0.20], [0.52, 0.055, 0.075], [0, 0, 0], false);
  add(view, 3, sword, 'box', 'ShogunBladeSpine', M.accent, [0, 1.08, 0.046], [0.13, 1.34, 0.04], [0, 0, 0], false);
  add(view, 3, sword, 'box', 'ShogunTsuba', M.metal, [0, 0.47, 0.045], [0.68, 0.055, 0.13], [0, 0, 0], false);
}

function applyIdentity(view, stage) {
  if (!view.skinnedModel || !view.skinnedStageParts.some((items) => items.length)) return;
  const index = Math.max(0, Math.min(3, stage));
  if (index === view.stageIdentityIndex) return;
  const identity = STAGE_IDENTITIES[index];
  view.skinnedStageParts.forEach((items, stageIndex) => items.forEach((entity) => { entity.enabled = stageIndex === index; }));
  view.skinnedSword?.setLocalScale(identity.swordScale, identity.swordScale, identity.swordScale);
  view.enemy.setLocalScale(identity.enemyScale, identity.enemyScale, identity.enemyScale);
  view.stageIdentityIndex = index;
  view.stageIdentity = identity.id;
  document.documentElement.dataset.enemyStageIdentity = identity.id;
}

export function installStageIdentity(view) {
  view.stageIdentity = 'pending-skinned-model';
  view.stageIdentityIndex = -1;
  view.skinnedStageParts = [[], [], [], []];
  document.documentElement.dataset.enemyIdentityPipeline = 'shared-rig-stage-silhouette-v1';

  const originalApplyStage = view.applyStage.bind(view);
  view.applyStage = (stage) => {
    originalApplyStage(stage);
    applyIdentity(view, stage);
  };

  const originalSyncSkinnedAnimation = view.syncSkinnedAnimation.bind(view);
  view.syncSkinnedAnimation = (state, directionIndex) => {
    originalSyncSkinnedAnimation(state, directionIndex);
    if (!view.skinnedModel) return;
    const identity = STAGE_IDENTITIES[Math.max(0, view.stageIdentityIndex)];
    const euler = view.skinnedModel.getLocalEulerAngles();
    view.skinnedModel.setLocalEulerAngles(
      euler.x * identity.commitScale,
      euler.y * identity.commitScale,
      euler.z * identity.commitScale,
    );
  };

  Promise.resolve(view.characterReady).then((ready) => {
    if (!ready || !view.skinnedModel) return;
    try {
      createStageParts(view);
      applyIdentity(view, view.stageIndex < 0 ? 0 : view.stageIndex);
    } catch (error) {
      console.warn('Stage-specific skinned identity unavailable; base skinned samurai remains active.', error);
      view.stageIdentity = 'base-skinned-samurai';
      document.documentElement.dataset.enemyStageIdentity = view.stageIdentity;
    }
  });

  return view;
}
