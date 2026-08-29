import { PlayCanvasView } from './playcanvas-view.ts';
import { installAuthoredEnemyAttacks } from './authored-enemy-attacks.js';
import { installStageIdentity } from './stage-identity.js';
import { installMobileCombatReadabilityView } from './mobile-combat-readability.js';
import { installBladeTrajectoryView } from './blade-trajectory.js';
import { installMobileControlReadability } from './mobile-control-readability.js';
import { installPlayerWeaponFidelity } from './player-weapon-fidelity.js';
import { View as LegacyWebGLView } from './legacy-renderer.js';

export class View {
  constructor(canvas) {
    try {
      installMobileControlReadability();
      this.impl = installPlayerWeaponFidelity(
        installBladeTrajectoryView(
          installMobileCombatReadabilityView(
            installStageIdentity(installAuthoredEnemyAttacks(new PlayCanvasView(canvas))),
          ),
        ),
      );
      this.backend = 'playcanvas';
      document.documentElement.dataset.rendererBackend = 'playcanvas';
      queueMicrotask(() => { document.documentElement.dataset.visualIdentity = 'playcanvas-samurai-v1'; });
    } catch (error) {
      console.warn('PlayCanvas renderer unavailable; using legacy WebGL2 fallback.', error);
      this.impl = new LegacyWebGLView(canvas);
      this.backend = 'legacy-webgl2';
      document.documentElement.dataset.rendererBackend = 'legacy-webgl2';
      queueMicrotask(() => { document.documentElement.dataset.visualIdentity = 'wide-samurai-v2'; });
    }
  }

  draw(...args) { return this.impl.draw(...args); }
}
