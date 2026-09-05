import { PlayCanvasView } from './playcanvas-view.ts';
import { installAuthoredEnemyAttacks } from './authored-enemy-attacks.js';
import { installEnemyScreenSpaceDirection } from './enemy-screen-space-direction.js';
import { installStageIdentity } from './stage-identity.js';
import { installMobileCombatReadabilityView } from './mobile-combat-readability.js';
import { installHeavyAttackWeight } from './heavy-attack-weight.js';
import { installAttackRhythm } from './attack-rhythm.js';
import { installBladeTrajectoryView } from './blade-trajectory.js';
import { installEnemyBladeAfterimage } from './enemy-blade-afterimage.js';
import { installMobileControlReadability } from './mobile-control-readability.js';
import { installPlayerWeaponFidelity } from './player-weapon-fidelity.js';
import { View as LegacyWebGLView } from './legacy-renderer.js';

const VISUAL_STAGE_BY_ENEMY_ID = Object.freeze({
  'ashigaru-scout': 0,
  'wandering-ronin': 1,
  'oni-guard': 2,
  'crimson-shogun': 3,
});

export function enemyVisualStageIndex(enemy, fallbackStage = 0) {
  const mapped = VISUAL_STAGE_BY_ENEMY_ID[enemy?.id];
  if (Number.isInteger(mapped)) return mapped;
  const fallback = Number.isFinite(fallbackStage) ? Math.trunc(fallbackStage) : 0;
  return Math.max(0, Math.min(3, fallback));
}

export class View {
  constructor(canvas) {
    try {
      installMobileControlReadability();
      this.impl = installEnemyScreenSpaceDirection(
        installPlayerWeaponFidelity(
          installEnemyBladeAfterimage(
            installBladeTrajectoryView(
              installAttackRhythm(
                installHeavyAttackWeight(
                  installMobileCombatReadabilityView(
                    installStageIdentity(installAuthoredEnemyAttacks(new PlayCanvasView(canvas))),
                  ),
                ),
              ),
            ),
          ),
        ),
      );
      this.backend = 'playcanvas';
      document.documentElement.dataset.rendererBackend = 'playcanvas';
      queueMicrotask(() => { document.documentElement.dataset.visualIdentity = 'playcanvas-samurai-v1'; });
    } catch (error) {
      console.warn('PlayCanvas renderer unavailable; using legacy WebGL2 fallback.', error);
      this.impl = installEnemyScreenSpaceDirection(new LegacyWebGLView(canvas));
      this.backend = 'legacy-webgl2';
      document.documentElement.dataset.rendererBackend = 'legacy-webgl2';
      queueMicrotask(() => { document.documentElement.dataset.visualIdentity = 'wide-samurai-v2'; });
    }
  }

  draw(state, ...args) {
    if (!state) return this.impl.draw(state, ...args);
    const progressionStage = Number.isFinite(state.enemyIndex) ? state.enemyIndex : 0;
    const visualStage = enemyVisualStageIndex(state.enemy, progressionStage);
    if (visualStage === progressionStage) return this.impl.draw(state, ...args);

    // Renderer-only projection: challenge/daily rematches keep their real progression
    // index in CombatEngine, while presentation reuses the base enemy's authored look.
    const originalStage = state.enemyIndex;
    state.enemyIndex = visualStage;
    try {
      return this.impl.draw(state, ...args);
    } finally {
      state.enemyIndex = originalStage;
    }
  }
}
