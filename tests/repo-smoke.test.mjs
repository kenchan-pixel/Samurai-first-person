import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const files = {
  html: new URL('../index.html', import.meta.url),
  main: new URL('../src/main.js', import.meta.url),
  renderer: new URL('../src/renderer.js', import.meta.url),
  playcanvas: new URL('../src/playcanvas-view.ts', import.meta.url),
  legacyRenderer: new URL('../src/legacy-renderer.js', import.meta.url),
  motion: new URL('../src/animation-motion.js', import.meta.url),
  core: new URL('../src/game-core.js', import.meta.url),
  baseline: new URL('../docs/CURRENT_BASELINE.md', import.meta.url),
  rules: new URL('../docs/EVOLUTION_RULES.md', import.meta.url),
};

test('entry document references local source files', async () => {
  const html = await readFile(files.html, 'utf8');
  assert.match(html, /src="\.\/src\/main\.js"/);
  assert.match(html, /href="\.\/src\/styles\.css"/);
  assert.match(html, /id="game-canvas"/);
  assert.match(html, /id="start-button"/);
});

test('runtime contains PlayCanvas primary rendering, WebGL2 fallback, four-beat motion, pointer controls, audio, and combat integration', async () => {
  const [main, renderer, playcanvas, legacyRenderer, motion] = await Promise.all([
    readFile(files.main, 'utf8'),
    readFile(files.renderer, 'utf8'),
    readFile(files.playcanvas, 'utf8'),
    readFile(files.legacyRenderer, 'utf8'),
    readFile(files.motion, 'utf8'),
  ]);

  // Primary/fallback renderer seam: PlayCanvas is production-facing, while the
  // previously accepted WebGL2 path remains available during migration.
  assert.match(renderer, /new PlayCanvasView\(canvas\)/);
  assert.match(renderer, /new LegacyWebGLView\(canvas\)/);
  assert.match(renderer, /rendererBackend = 'playcanvas'/);
  assert.match(renderer, /visualIdentity = 'playcanvas-samurai-v1'/);
  assert.match(legacyRenderer, /getContext\('webgl2'/);

  // The production 3D renderer must still be driven by the renderer-neutral
  // elapsed-time motion pipeline and retain the mobile adaptive-quality path.
  assert.match(playcanvas, /from 'playcanvas'/);
  assert.match(playcanvas, /new pc\.Application\(canvas/);
  assert.match(playcanvas, /enemyMotionFrame\(s\.phase/);
  assert.match(playcanvas, /smoothMotionFrame/);
  assert.match(playcanvas, /adaptiveRenderScale/);
  assert.match(playcanvas, /animationPipeline = 'playcanvas-four-beat-v1'/);
  assert.match(playcanvas, /renderProfile = 'playcanvas-adaptive-60-v1'/);
  assert.match(playcanvas, /graphicsDevice\.maxPixelRatio/);

  assert.match(motion, /enemyMotionFrame/);
  assert.match(motion, /smoothMotionFrame/);
  assert.match(motion, /adaptiveRenderScale/);
  assert.match(main, /new View\(canvas\)/);
  assert.match(main, /pointerdown/);
  assert.match(main, /directionFromSwipe/);
  assert.match(main, /AudioContext/);
  assert.match(main, /new CombatEngine/);
});

test('evolution source of truth is present', async () => {
  const [baseline, rules] = await Promise.all([
    readFile(files.baseline, 'utf8'),
    readFile(files.rules, 'utf8'),
  ]);
  assert.match(baseline, /Four defensive directions/);
  assert.match(baseline, /four sequential duels/i);
  assert.match(baseline, /Three baseline enemies are followed by the Crimson Shogun boss/);
  assert.match(baseline, /wind-up.*swing.*impact.*recovery/is);
  assert.match(baseline, /PlayCanvas Engine standalone is now the primary production-facing renderer/);
  assert.match(rules, /substantial visible vertical slice/i);
  assert.match(rules, /Never merge the pull request/i);
});
