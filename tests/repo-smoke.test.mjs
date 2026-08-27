import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const files = {
  html: new URL('../index.html', import.meta.url),
  main: new URL('../src/main.js', import.meta.url),
  renderer: new URL('../src/renderer.js', import.meta.url),
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

test('runtime contains WebGL, four-beat motion, pointer controls, audio, and combat engine integration', async () => {
  const [main, renderer, motion] = await Promise.all([
    readFile(files.main, 'utf8'),
    readFile(files.renderer, 'utf8'),
    readFile(files.motion, 'utf8'),
  ]);
  assert.match(renderer, /getContext\('webgl2'/);
  assert.match(renderer, /enemyScale=\.70/);
  assert.match(renderer, /four-beat body choreography/i);
  assert.match(renderer, /action-local progress/i);
  assert.match(renderer, /animationPipeline = 'four-beat-v3'/);
  assert.match(renderer, /renderProfile = 'adaptive-60-v1'/);
  assert.match(motion, /enemyMotionFrame/);
  assert.match(motion, /smoothMotionFrame/);
  assert.match(motion, /adaptiveRenderScale/);
  assert.match(main, /pointerdown/);
  assert.match(main, /directionFromSwipe/);
  assert.match(main, /AudioContext/);
  assert.match(main, /new CombatEngine/);
  assert.match(main, /visualIdentity = 'wide-samurai-v2'/);
});

test('evolution source of truth is present', async () => {
  const [baseline, rules] = await Promise.all([
    readFile(files.baseline, 'utf8'),
    readFile(files.rules, 'utf8'),
  ]);
  assert.match(baseline, /Four defensive directions/);
  assert.match(baseline, /Three enemies are fought sequentially/);
  assert.match(baseline, /Four-beat combat motion/);
  assert.match(rules, /substantial visible vertical slice/i);
  assert.match(rules, /Never merge the pull request/i);
});
