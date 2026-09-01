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
  challenge: new URL('../src/challenge-mode.js', import.meta.url),
  core: new URL('../src/game-core.js', import.meta.url),
  baseline: new URL('../docs/CURRENT_BASELINE.md', import.meta.url),
  architecture: new URL('../docs/ARCHITECTURE.md', import.meta.url),
  rules: new URL('../docs/EVOLUTION_RULES.md', import.meta.url),
};

function markdownSection(markdown, heading) {
  const marker = `## ${heading}`;
  const start = markdown.indexOf(marker);
  assert.notEqual(start, -1, `missing SOT section: ${heading}`);
  const bodyStart = markdown.indexOf('\n', start) + 1;
  const next = markdown.indexOf('\n## ', bodyStart);
  return markdown.slice(bodyStart, next === -1 ? undefined : next);
}

function assertTerms(text, terms, label) {
  for (const term of terms) assert.match(text, term, `${label} missing semantic invariant ${term}`);
}

test('entry document references local source files', async () => {
  const html = await readFile(files.html, 'utf8');
  assert.match(html, /src="\.\/src\/main\.js"/);
  assert.match(html, /src="\.\/src\/challenge-mode\.js"/);
  assert.match(html, /href="\.\/src\/styles\.css"/);
  assert.match(html, /id="game-canvas"/);
  assert.match(html, /id="start-button"/);
});

test('runtime contains PlayCanvas primary rendering, WebGL2 fallback, four-beat motion, pointer controls, audio, and combat integration', async () => {
  const [main, renderer, playcanvas, legacyRenderer, motion] = await Promise.all([
    readFile(files.main, 'utf8'), readFile(files.renderer, 'utf8'), readFile(files.playcanvas, 'utf8'), readFile(files.legacyRenderer, 'utf8'), readFile(files.motion, 'utf8'),
  ]);
  assert.match(renderer, /new PlayCanvasView\(canvas\)/);
  assert.match(renderer, /new LegacyWebGLView\(canvas\)/);
  assert.match(renderer, /rendererBackend = 'playcanvas'/);
  assert.match(renderer, /visualIdentity = 'playcanvas-samurai-v1'/);
  assert.match(legacyRenderer, /getContext\('webgl2'/);
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

test('challenge mode is a bounded local adapter and does not replace combat authority', async () => {
  const challenge = await readFile(files.challenge, 'utf8');
  assert.match(challenge, /CHALLENGE_STAGE_COUNT = 8/);
  assert.match(challenge, /createChallengeEnemies/);
  assert.match(challenge, /CHALLENGE_STORAGE_KEY/);
  assert.match(challenge, /requestPractice\(null\)/);
  assert.match(challenge, /this\.enemies = createChallengeEnemies\(\)/);
  assert.doesNotMatch(challenge, /attemptParry\s*=|attemptAttack\s*=|directionFromSwipe/);
});

test('evolution source of truth is present', async () => {
  const [baseline, rules] = await Promise.all([readFile(files.baseline, 'utf8'), readFile(files.rules, 'utf8')]);
  const playableFlow = markdownSection(baseline, 'Playable flow and controls');
  const presentation = markdownSection(baseline, 'Presentation and renderer');
  assert.match(baseline, /Four defensive directions/);
  assertTerms(playableFlow, [/four sequential duels/i, /Ashigaru/i, /Wandering Ronin/i, /Oni Guard/i, /Crimson Shogun/i, /連戰試煉/, /eight-duel/i], 'playable flow');
  assert.match(baseline, /Windup.*Strike.*Recovery.*Parry/is);
  assertTerms(presentation, [/PlayCanvas/i, /primary/i, /renderer/i, /Vite/i, /WebGL2/i, /fallback|compatibility/i], 'presentation');
  assert.match(rules, /substantial visible vertical slice/i);
  assert.match(rules, /Never merge the pull request/i);
});

test('architecture SOT matches the approved PlayCanvas/Vite renderer seam', async () => {
  const architecture = await readFile(files.architecture, 'utf8');
  assertTerms(architecture, [/PlayCanvas/i, /Vite/i, /primary/i, /src\/renderer\.js/i, /src\/playcanvas-view\.ts/i, /WebGL2/i, /fallback|compatibility/i, /src\/game-core\.js/i, /deterministic/i, /3D_PIPELINE_DECISION_GATE\.md/i], 'architecture');
  assert.doesNotMatch(architecture, /(?:framework|game-engine|engine) migration requires a Decision Gate/i, 'architecture must not describe the already-approved PlayCanvas migration as a future gate');
});
