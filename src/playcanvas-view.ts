import * as pc from 'playcanvas';
import { adaptiveRenderScale, enemyMotionFrame, smoothMotionFrame } from './animation-motion.js';

const DIR_Z = [0, -90, 180, 90];
const clamp01 = (v) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
const CHARACTER_URL = '/assets/samurai-v1.glb';
const CHARACTER_CLIPS = Object.freeze(['Idle', 'Windup', 'Strike', 'Recovery', 'Parry']);

function mat(rgb, { metal = 0, gloss = 0.45, emissive = null } = {}) {
  const m = new pc.StandardMaterial();
  m.diffuse = new pc.Color(...rgb);
  m.useMetalness = metal > 0;
  m.metalness = metal;
  m.gloss = gloss;
  if (emissive) m.emissive = new pc.Color(...emissive);
  m.update();
  return m;
}

function part(parent, type, name, material, pos, scale, euler = [0, 0, 0], shadows = true) {
  const e = new pc.Entity(name);
  e.addComponent('render', { type, castShadows: shadows, receiveShadows: shadows });
  e.render.material = material;
  e.setLocalPosition(...pos);
  e.setLocalScale(...scale);
  e.setLocalEulerAngles(...euler);
  parent.addChild(e);
  return e;
}

function pivot(parent, name, pos = [0, 0, 0]) {
  const e = new pc.Entity(name);
  e.setLocalPosition(...pos);
  parent.addChild(e);
  return e;
}

export class PlayCanvasView {
  constructor(canvas) {
    this.c = canvas;
    this.app = new pc.Application(canvas, {
      graphicsDeviceOptions: {
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      },
    });
    this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    this.app.setCanvasResolution(pc.RESOLUTION_AUTO);
    this.app.graphicsDevice.maxPixelRatio = Math.min(globalThis.devicePixelRatio || 1, 1.4);
    this.app.scene.ambientLight = new pc.Color(0.18, 0.18, 0.2);

    this.materials = {
      floor: mat([0.12, 0.11, 0.10], { gloss: 0.2 }),
      wood: mat([0.20, 0.075, 0.045], { gloss: 0.25 }),
      darkWood: mat([0.055, 0.045, 0.04], { gloss: 0.2 }),
      stone: mat([0.18, 0.18, 0.19], { gloss: 0.15 }),
      skin: mat([0.36, 0.22, 0.15], { gloss: 0.3 }),
      armour: mat([0.27, 0.14, 0.07], { metal: 0.5, gloss: 0.52 }),
      armourDark: mat([0.07, 0.055, 0.05], { metal: 0.45, gloss: 0.5 }),
      cloth: mat([0.12, 0.07, 0.045], { gloss: 0.15 }),
      metal: mat([0.58, 0.56, 0.50], { metal: 0.9, gloss: 0.75 }),
      blade: mat([0.78, 0.84, 0.86], { metal: 0.95, gloss: 0.9, emissive: [0.06, 0.08, 0.09] }),
      accent: mat([0.72, 0.18, 0.08], { metal: 0.35, gloss: 0.5 }),
      lantern: mat([0.55, 0.23, 0.05], { gloss: 0.3, emissive: [0.25, 0.08, 0.01] }),
    };

    this.createScene();
    this.createEnemy();
    this.createPlayerSword();

    this.motion = enemyMotionFrame('ready', 0, {});
    this.motionTarget = enemyMotionFrame('ready', 0, {});
    this.motionReady = false;
    this.lastFrameAt = 0;
    this.frameEmaMs = 16.67;
    this.renderScale = Math.min(globalThis.devicePixelRatio || 1, 1.4);
    this.qualityCheckAt = 0;
    this.playerAction = 0;
    this.playerDirection = 0;
    this.playerActionAt = 0;
    this.stageIndex = -1;
    this.stageStyle = null;
    this.skinnedModel = null;
    this.skinnedMaterials = new Map();
    this.characterClip = 'PrimitiveFallback';
    this.characterDirection = 0;

    this.app.start();
    this.characterReady = this.loadSkinnedEnemy();
    document.documentElement.dataset.animationPipeline = 'playcanvas-four-beat-v1';
    document.documentElement.dataset.renderProfile = 'playcanvas-adaptive-60-v1';
  }

  createScene() {
    this.camera = new pc.Entity('Camera');
    this.camera.addComponent('camera', {
      clearColor: new pc.Color(0.045, 0.055, 0.07),
      fov: 46,
      nearClip: 0.08,
      farClip: 60,
    });
    this.camera.setPosition(0, 1.75, 5.7);
    this.camera.lookAt(0, 1.28, 0);
    this.app.root.addChild(this.camera);

    const key = new pc.Entity('KeyLight');
    key.addComponent('light', {
      type: 'directional',
      color: new pc.Color(1.0, 0.82, 0.64),
      intensity: 1.4,
      castShadows: true,
      shadowResolution: 1024,
    });
    key.setEulerAngles(48, 28, 0);
    this.app.root.addChild(key);

    const fill = new pc.Entity('FillLight');
    fill.addComponent('light', {
      type: 'directional',
      color: new pc.Color(0.28, 0.42, 0.65),
      intensity: 0.48,
      castShadows: false,
    });
    fill.setEulerAngles(25, -150, 0);
    this.app.root.addChild(fill);

    const floor = part(this.app.root, 'box', 'Courtyard', this.materials.floor, [0, -0.09, -0.5], [8, 0.12, 8]);
    floor.render.receiveShadows = true;
    for (let i = -3; i <= 3; i += 1) {
      part(this.app.root, 'box', `FloorLine${i}`, this.materials.stone, [i * 0.72, -0.015, -0.45], [0.018, 0.01, 7.2], [0, 0, 0], false);
    }

    const gate = pivot(this.app.root, 'Gate', [0, 0, -3.2]);
    part(gate, 'box', 'GateLeft', this.materials.wood, [-2.0, 1.55, 0], [0.26, 3.3, 0.32]);
    part(gate, 'box', 'GateRight', this.materials.wood, [2.0, 1.55, 0], [0.26, 3.3, 0.32]);
    part(gate, 'box', 'GateBeam', this.materials.darkWood, [0, 3.05, 0], [4.7, 0.34, 0.48]);
    part(gate, 'box', 'GateRoof', this.materials.darkWood, [0, 3.42, 0], [5.5, 0.18, 0.95]);

    for (const s of [-1, 1]) {
      part(gate, 'box', `LanternFrame${s}`, this.materials.darkWood, [s * 1.42, 1.72, 0.08], [0.22, 0.42, 0.22]);
      part(gate, 'box', `LanternGlow${s}`, this.materials.lantern, [s * 1.42, 1.72, 0.04], [0.15, 0.30, 0.15], [0, 0, 0], false);
      const lamp = new pc.Entity(`LanternLight${s}`);
      lamp.addComponent('light', { type: 'point', color: new pc.Color(1, 0.35, 0.08), intensity: 0.6, range: 3.2, castShadows: false });
      lamp.setLocalPosition(s * 1.42, 1.72, 0.35);
      gate.addChild(lamp);
    }
  }

  createEnemy() {
    const M = this.materials;
    this.enemy = pivot(this.app.root, 'EnemyRig', [0, 0, 0]);
    this.hips = pivot(this.enemy, 'PrimitiveFallback', [0, 0.92, 0]);
    this.torso = pivot(this.hips, 'Torso', [0, 0.62, 0]);

    part(this.hips, 'box', 'HakamaL', M.cloth, [-0.19, -0.34, 0], [0.28, 0.70, 0.34], [0, 0, -5]);
    part(this.hips, 'box', 'HakamaR', M.cloth, [0.19, -0.34, 0], [0.28, 0.70, 0.34], [0, 0, 5]);
    part(this.hips, 'capsule', 'ShinL', M.armourDark, [-0.22, -0.84, 0.02], [0.16, 0.52, 0.16]);
    part(this.hips, 'capsule', 'ShinR', M.armourDark, [0.22, -0.84, 0.02], [0.16, 0.52, 0.16]);
    part(this.hips, 'box', 'FootL', M.darkWood, [-0.22, -1.10, 0.12], [0.25, 0.12, 0.50]);
    part(this.hips, 'box', 'FootR', M.darkWood, [0.22, -1.10, 0.12], [0.25, 0.12, 0.50]);
    part(this.torso, 'box', 'Chest', M.armour, [0, 0.04, 0], [0.72, 0.78, 0.38]);
    for (let i = 0; i < 4; i += 1) part(this.torso, 'box', `ChestPlate${i}`, M.armourDark, [0, 0.24 - i * 0.16, -0.215], [0.78 - i * 0.03, 0.055, 0.06]);
    for (const s of [-1, 1]) {
      part(this.torso, 'box', `ShoulderPlate${s}`, M.armour, [s * 0.50, 0.23, 0], [0.34, 0.14, 0.48], [0, 0, s * 12]);
      part(this.torso, 'box', `WaistPlate${s}`, M.armourDark, [s * 0.34, -0.50, 0], [0.25, 0.38, 0.30], [0, 0, s * 8]);
    }

    this.neck = pivot(this.torso, 'Neck', [0, 0.62, 0]);
    part(this.neck, 'sphere', 'Head', M.skin, [0, 0.22, 0], [0.42, 0.46, 0.40]);
    part(this.neck, 'box', 'Menpo', M.armourDark, [0, 0.10, -0.21], [0.37, 0.18, 0.06]);
    part(this.neck, 'cylinder', 'HelmetBrim', M.metal, [0, 0.47, 0], [0.56, 0.055, 0.56]);
    part(this.neck, 'sphere', 'HelmetCrown', M.armourDark, [0, 0.48, 0], [0.46, 0.28, 0.45]);
    this.crestL = part(this.neck, 'cone', 'CrestL', M.accent, [-0.16, 0.72, 0], [0.11, 0.38, 0.11], [0, 0, -28]);
    this.crestR = part(this.neck, 'cone', 'CrestR', M.accent, [0.16, 0.72, 0], [0.11, 0.38, 0.11], [0, 0, 28]);

    this.armR = pivot(this.torso, 'ArmR', [0.43, 0.24, 0]);
    this.elbowR = pivot(this.armR, 'ElbowR', [0, -0.38, 0]);
    part(this.armR, 'capsule', 'UpperArmR', M.cloth, [0, -0.18, 0], [0.15, 0.46, 0.15]);
    part(this.elbowR, 'capsule', 'ForeArmR', M.armourDark, [0, -0.22, 0], [0.14, 0.44, 0.14]);
    this.handR = part(this.elbowR, 'sphere', 'HandR', M.darkWood, [0, -0.45, 0], [0.17, 0.17, 0.17]);
    this.armL = pivot(this.torso, 'ArmL', [-0.43, 0.24, 0]);
    this.elbowL = pivot(this.armL, 'ElbowL', [0, -0.36, 0]);
    part(this.armL, 'capsule', 'UpperArmL', M.cloth, [0, -0.18, 0], [0.15, 0.46, 0.15]);
    part(this.elbowL, 'capsule', 'ForeArmL', M.armourDark, [0, -0.21, 0], [0.14, 0.42, 0.14]);
    part(this.elbowL, 'sphere', 'HandL', M.darkWood, [0, -0.43, 0], [0.17, 0.17, 0.17]);
    this.sword = pivot(this.handR, 'EnemySword', [0, -0.10, 0]);
    part(this.sword, 'cylinder', 'Grip', M.darkWood, [0, 0.22, 0], [0.08, 0.45, 0.08]);
    part(this.sword, 'box', 'Guard', M.metal, [0, 0.48, 0], [0.46, 0.07, 0.10]);
    part(this.sword, 'box', 'Blade', M.blade, [0, 1.25, 0], [0.075, 1.50, 0.035]);
  }

  createPlayerSword() {
    const M = this.materials;
    this.playerRig = pivot(this.camera, 'PlayerSwordRig', [0.58, -0.50, -1.25]);
    this.playerRig.setLocalEulerAngles(-13, -18, -34);
    part(this.playerRig, 'cylinder', 'PlayerGrip', M.darkWood, [0, -0.05, 0], [0.10, 0.38, 0.10]);
    part(this.playerRig, 'box', 'PlayerGuard', M.metal, [0, 0.18, 0], [0.45, 0.06, 0.10]);
    part(this.playerRig, 'box', 'PlayerBlade', M.blade, [0, 0.95, 0], [0.075, 1.48, 0.035]);
  }

  loadSkinnedEnemy() {
    return new Promise((resolve) => {
      this.app.assets.loadFromUrl(CHARACTER_URL, 'container', (error, asset) => {
        if (error || !asset?.resource) {
          console.warn('Skinned samurai unavailable; keeping articulated primitive fallback.', error);
          document.documentElement.dataset.characterPipeline = 'primitive-fallback';
          resolve(false);
          return;
        }
        try {
          const model = asset.resource.instantiateRenderEntity();
          model.name = 'SkinnedSamuraiV1';
          model.setLocalPosition(0, 0, 0);
          this.enemy.addChild(model);
          for (const render of model.findComponents('render')) {
            render.castShadows = true;
            render.receiveShadows = true;
            for (const meshInstance of render.meshInstances || []) {
              const material = meshInstance.material;
              if (material?.name && !this.skinnedMaterials.has(material.name)) this.skinnedMaterials.set(material.name, material);
            }
          }
          model.addComponent('anim', { activate: true, speed: 1 });
          const tracks = asset.resource.animations || [];
          const available = new Set(tracks.map((track) => track.name));
          for (const clip of CHARACTER_CLIPS) if (!available.has(clip)) throw new Error(`Missing GLB animation clip: ${clip}`);
          for (const track of tracks) model.anim.baseLayer.assignAnimation(track.name, track, 1, track.name === 'Idle');
          model.anim.baseLayer.play('Idle');
          this.skinnedModel = model;
          this.characterClip = 'Idle';
          this.hips.enabled = false;
          this.applySkinnedStyle(this.stageStyle);
          document.documentElement.dataset.characterPipeline = 'skinned-gltf-v1';
          document.documentElement.dataset.characterClips = CHARACTER_CLIPS.join(',');
          document.documentElement.dataset.characterAsset = 'samurai-v1.glb';
          resolve(true);
        } catch (modelError) {
          console.warn('Skinned samurai setup failed; keeping articulated primitive fallback.', modelError);
          document.documentElement.dataset.characterPipeline = 'primitive-fallback';
          resolve(false);
        }
      });
    });
  }

  applySkinnedStyle(style) {
    if (!style || !this.skinnedMaterials.size) return;
    const palette = {
      Armor: style.armour,
      Cloth: style.cloth,
      Accent: style.accent,
      DarkArmor: style.armour.map((v) => v * 0.23),
      Cord: style.accent.map((v) => v * 0.42),
    };
    for (const [name, rgb] of Object.entries(palette)) {
      const material = this.skinnedMaterials.get(name);
      if (!material) continue;
      material.diffuse = new pc.Color(...rgb);
      material.update();
    }
  }

  applyStage(stage) {
    if (stage === this.stageIndex) return;
    this.stageIndex = stage;
    const styles = [
      { armour: [0.30, 0.18, 0.09], cloth: [0.14, 0.08, 0.045], accent: [0.62, 0.24, 0.07], sky: [0.045, 0.055, 0.07] },
      { armour: [0.08, 0.16, 0.29], cloth: [0.08, 0.07, 0.11], accent: [0.55, 0.10, 0.06], sky: [0.035, 0.05, 0.075] },
      { armour: [0.27, 0.055, 0.035], cloth: [0.08, 0.04, 0.03], accent: [0.76, 0.36, 0.06], sky: [0.075, 0.04, 0.035] },
      { armour: [0.24, 0.018, 0.035], cloth: [0.25, 0.025, 0.04], accent: [0.86, 0.52, 0.12], sky: [0.12, 0.018, 0.025] },
    ][Math.max(0, Math.min(3, stage))];
    this.stageStyle = styles;
    this.materials.armour.diffuse = new pc.Color(...styles.armour);
    this.materials.cloth.diffuse = new pc.Color(...styles.cloth);
    this.materials.accent.diffuse = new pc.Color(...styles.accent);
    this.materials.armour.update(); this.materials.cloth.update(); this.materials.accent.update();
    this.applySkinnedStyle(styles);
    this.camera.camera.clearColor = new pc.Color(...styles.sky);
    const boss = stage === 3;
    this.crestL.enabled = stage >= 2;
    this.crestR.enabled = stage >= 2;
    this.enemy.setLocalScale(boss ? 1.08 : 1, boss ? 1.08 : 1, boss ? 1.08 : 1);
  }

  updateQuality(n, frameMs) {
    if (frameMs > 0 && frameMs < 80) this.frameEmaMs += (frameMs - this.frameEmaMs) * 0.08;
    if (n < this.qualityCheckAt) return;
    const dpr = globalThis.devicePixelRatio || 1;
    const cap = Math.min(Math.max(1, dpr), 1.5);
    const prev = this.renderScale;
    this.renderScale = adaptiveRenderScale({ current: Math.min(prev, cap), min: Math.min(1, cap), max: cap, frameEmaMs: this.frameEmaMs });
    this.app.graphicsDevice.maxPixelRatio = Math.min(dpr, this.renderScale);
    this.qualityCheckAt = n + (this.renderScale < prev ? 900 : 1400);
  }

  playerProgress(n, action, direction) {
    if (action !== this.playerAction || direction !== this.playerDirection) {
      this.playerAction = action;
      this.playerDirection = direction;
      if (action) this.playerActionAt = n;
    }
    if (!action) return 1;
    return clamp01((n - this.playerActionAt) / (action === 3 ? 390 : 290));
  }

  syncSkinnedAnimation(s, directionIndex) {
    if (!this.skinnedModel?.anim) return;
    const phase = s.phase;
    const clip = phase === 'telegraph' ? 'Windup'
      : phase === 'strike' ? 'Strike'
        : phase === 'recovery-interrupted' ? 'Parry'
          : phase === 'recovery' ? 'Recovery'
            : 'Idle';
    const progress = clip === 'Idle' ? ((performance.now() % 1600) / 1600) : clamp01(s.phaseProgress);
    const layer = this.skinnedModel.anim.baseLayer;
    if (clip !== this.characterClip) {
      const blend = clip === 'Parry' ? 0.045 : clip === 'Strike' ? 0.035 : 0.06;
      layer.transition(clip, blend, progress);
      this.characterClip = clip;
    }
    if (layer.activeState === clip && Number.isFinite(layer.activeStateDuration)) {
      layer.activeStateCurrentTime = Math.max(0, Math.min(layer.activeStateDuration, progress * layer.activeStateDuration));
    }
    this.characterDirection = directionIndex;
    const directionalLean = directionIndex === 1 ? -5 : directionIndex === 3 ? 5 : directionIndex === 2 ? 3 : 0;
    this.skinnedModel.setLocalEulerAngles(0, 0, directionalLean * Math.sin(Math.PI * clamp01(this.motion.swing)));
  }

  draw(s, n, m = {}) {
    const frameMs = this.lastFrameAt ? Math.min(50, n - this.lastFrameAt) : 16.67;
    this.lastFrameAt = n;
    this.updateQuality(n, frameMs);
    this.applyStage(s.enemyIndex || 0);

    enemyMotionFrame(s.phase, s.phaseProgress, this.motionTarget);
    if (!this.motionReady) {
      Object.assign(this.motion, this.motionTarget);
      this.motionReady = true;
    } else {
      smoothMotionFrame(this.motion, this.motionTarget, frameMs, 82, this.motion);
    }

    const idx = m.attackDirectionIndex || 0;
    const dirZ = DIR_Z[idx];
    const commit = Math.sin(Math.PI * clamp01(this.motion.swing));
    const lunge = -0.12 * this.motion.wind + 0.34 * commit + 0.18 * this.motion.follow;
    const side = idx === 1 ? 0.12 : idx === 3 ? -0.12 : 0;
    this.enemy.setLocalPosition(side * commit, 0, lunge);

    this.hips.setLocalEulerAngles(0, side * 18 * commit, (idx === 1 ? -1 : idx === 3 ? 1 : 0) * 6 * commit);
    this.torso.setLocalEulerAngles(-4 * this.motion.wind + 11 * commit, side * 38 * commit, (idx === 1 ? -1 : idx === 3 ? 1 : 0) * 11 * (this.motion.wind + commit));
    this.neck.setLocalEulerAngles(-2 + 5 * commit, -side * 34 * commit, 0);
    const swordArc = this.motion.sword * 82;
    this.armR.setLocalEulerAngles(-62 + swordArc * 0.42, -15 + side * 55, -28 + dirZ * 0.34);
    this.elbowR.setLocalEulerAngles(-52 + swordArc * 0.18, 0, 12 + dirZ * 0.18);
    this.armL.setLocalEulerAngles(-48 + swordArc * 0.30, 14 + side * 46, 24 + dirZ * 0.28);
    this.elbowL.setLocalEulerAngles(-44 + swordArc * 0.14, 0, -10 + dirZ * 0.14);
    this.sword.setLocalEulerAngles(0, 0, dirZ - 12 + swordArc);
    this.syncSkinnedAnimation(s, idx);

    const impact = this.motion.impact;
    const hitAge = m.hitAge ?? 999;
    const recoil = hitAge < 1 ? (1 - clamp01(hitAge)) * 0.18 : 0;
    this.enemy.translateLocal(recoil, 0, 0);

    const shake = m.shake || 0;
    const sx = Math.sin(n * 0.061) * shake * 0.012;
    const sy = Math.cos(n * 0.053) * shake * 0.009;
    this.camera.setPosition(sx, 1.75 + sy, 5.7);
    this.camera.lookAt(0, 1.28, 0);

    const action = m.playerAction || 0;
    const pdir = m.playerDirectionIndex || 0;
    const p = this.playerProgress(n, action, pdir);
    const pulse = Math.sin(Math.PI * p);
    const targetZ = DIR_Z[pdir];
    if (!action) {
      this.playerRig.setLocalPosition(0.58, -0.50, -1.25);
      this.playerRig.setLocalEulerAngles(-13, -18, -34);
    } else if (action === 3) {
      this.playerRig.setLocalPosition(0.52 - pulse * 0.18, -0.48 + pulse * 0.10, -1.18 - pulse * 0.15);
      this.playerRig.setLocalEulerAngles(-16 + pulse * 18, -18, -34 + targetZ + pulse * 92);
    } else {
      this.playerRig.setLocalPosition(0.56 - pulse * 0.10, -0.48 + pulse * 0.06, -1.20);
      this.playerRig.setLocalEulerAngles(-12 + pulse * 12, -18, -34 + targetZ * 0.55 + pulse * 38);
    }

    this.materials.blade.emissive = new pc.Color(0.05 + impact * 0.22, 0.07 + impact * 0.16, 0.08 + impact * 0.08);
    this.materials.blade.update();
  }
}
