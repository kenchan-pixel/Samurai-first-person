import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { extname, resolve, sep } from 'node:path';

const root = resolve(process.cwd());
const distRoot = resolve(root, 'dist');
const viteCli = resolve(root, 'node_modules/vite/bin/vite.js');
const build = spawnSync(process.execPath, [viteCli, 'build'], { cwd: root, encoding: 'utf8' });
if (build.status !== 0) throw new Error(`Vite build failed:\n${build.stdout}\n${build.stderr}`);

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.map': 'application/json',
};

function resolveServedFile(pathname) {
  const relative = decodeURIComponent(pathname === '/' ? '/index.html' : pathname);
  const sourceMode = relative.startsWith('/tests/') || relative.startsWith('/src/');
  const base = sourceMode ? root : distRoot;
  const file = resolve(base, `.${relative}`);
  if (file !== base && !file.startsWith(`${base}${sep}`)) throw new Error('unsafe path');
  return file;
}

const server = createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
    const file = resolveServedFile(requestUrl.pathname);
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not a file');
    res.writeHead(200, { 'content-type': contentTypes[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

await new Promise((resolveListen, rejectListen) => {
  server.once('error', rejectListen);
  server.listen(4173, '127.0.0.1', resolveListen);
});

function findBrowser() {
  const candidates = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'];
  return candidates.find((name) => {
    const probe = spawnSync(name, ['--version'], { encoding: 'utf8' });
    return !probe.error && probe.status === 0;
  });
}

async function dumpDom(browser, path, { budget = 1800, extraArgs = [] } = {}) {
  const child = spawn(browser, [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-webgl',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--window-size=320,568',
    `--virtual-time-budget=${budget}`,
    ...extraArgs,
    '--dump-dom',
    `http://127.0.0.1:4173${path}`,
  ]);

  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (chunk) => (stdout += chunk));
  child.stderr.on('data', (chunk) => (stderr += chunk));

  const code = await new Promise((resolveExit, rejectExit) => {
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      rejectExit(new Error(`Headless browser timed out for ${path}. stderr: ${stderr.slice(-2000)}`));
    }, 20000);
    child.once('error', (error) => {
      clearTimeout(timer);
      rejectExit(error);
    });
    child.once('close', (exitCode) => {
      clearTimeout(timer);
      resolveExit(exitCode);
    });
  });

  if (code !== 0) throw new Error(`Headless browser exited ${code} for ${path}: ${stderr}`);
  return stdout;
}

try {
  const browser = findBrowser();
  if (!browser) throw new Error('Chrome/Chromium executable not found on CI runner');

  const appDom = await dumpDom(browser, '/?browser-smoke=renderer-motion', { budget: 2600 });
  if (!appDom.includes('data-webgl="ready"')) {
    throw new Error(`3D renderer did not initialize successfully. DOM:\n${appDom.slice(0, 4000)}`);
  }
  if (!appDom.includes('data-start-ready="true"')) {
    throw new Error('Start control was disabled after browser initialization');
  }
  if (!appDom.includes('data-renderer-backend="playcanvas"')) {
    throw new Error(`PlayCanvas primary renderer failed and fallback was used. DOM:\n${appDom.slice(0, 4000)}`);
  }
  if (!appDom.includes('data-visual-identity="playcanvas-samurai-v1"')) {
    throw new Error('PlayCanvas articulated samurai visual slice did not initialize in the real application document');
  }
  if (!appDom.includes('data-renderer-motion-integration="pass"')) {
    throw new Error(`PlayCanvas combat-motion integration failed. DOM:\n${appDom.slice(0, 5000)}`);
  }
  if (!appDom.includes('data-renderer-motion-sequence="telegraph-strike-parry-counter"')) {
    throw new Error('PlayCanvas smoke did not complete the representative telegraph → strike → parry → counter sequence');
  }
  if (!appDom.includes('data-renderer-motion-backend="playcanvas"')) {
    throw new Error('Renderer motion smoke did not stay on the PlayCanvas backend');
  }
  if (!appDom.includes('data-mastery-ready="true"')) {
    throw new Error('Mastery observer did not initialize in the real application document');
  }
  if (!appDom.includes('data-boss-ready="true"')) {
    throw new Error('Boss encounter module did not initialize before the real application runtime');
  }
  if (!appDom.includes('data-onboarding-ready="true"')) {
    throw new Error('Guided first-duel onboarding did not initialize in the real application document');
  }
  if (!appDom.includes('id="coach-toggle"')) {
    throw new Error('Guided first-duel toggle was not added to the start screen');
  }
  if (!appDom.includes('data-footwork-ready="true"') || !appDom.includes('id="footwork-step"')) {
    throw new Error('Footwork controller / STEP control did not initialize in the real application document');
  }
  if (!appDom.includes('data-impact-ready="true"') || !appDom.includes('id="impact-fx-layer"')) {
    throw new Error('Impact choreography layer did not initialize in the real application document');
  }
  if (
    !appDom.includes('data-practice-mode-ready="true"') ||
    !appDom.includes('id="practice-ronin-button"') ||
    !appDom.includes('id="practice-shogun-button"')
  ) {
    throw new Error('Ronin/Shogun practice entries did not initialize in the real application document');
  }
  if (!appDom.includes('data-practice-start-layout="pass"')) {
    throw new Error('Practice selector or start-screen content overflowed the 320x568 production viewport');
  }
  if (!appDom.includes('data-readability-mode-ready="true"') || !appDom.includes('id="blade-readability-toggle"')) {
    throw new Error('Optional high-contrast blade-read mode did not initialize in the real application document');
  }
  if (!appDom.includes('data-readability-start-layout="pass"')) {
    throw new Error('Blade-read accessibility toggle overflowed the 320x568 production viewport');
  }

  const combatUxDom = await dumpDom(browser, '/?browser-smoke=combat-ux', { budget: 6500 });
  if (!combatUxDom.includes('data-combat-ux-browser="pass"')) {
    throw new Error(`Production Combat UX integration failed. DOM:\n${combatUxDom.slice(0, 6000)}`);
  }
  if (!combatUxDom.includes('data-pause-input-safe="pass"')) throw new Error('Pause control overlaps a directional parry region');
  if (!combatUxDom.includes('data-combat-ux-top-parry-path="true"') || !combatUxDom.includes('data-combat-ux-right-parry-path="true"')) throw new Error('Adjacent top/right parry routing failed around the neutral Pause band');
  if (!combatUxDom.includes('data-combat-ux-pause-neutral="true"')) throw new Error('Pause control did not stay wholly inside the neutral tap band');
  if (!combatUxDom.includes('data-combat-ux-pause-freeze="true"')) throw new Error('Pause did not freeze the live combat phase across wall-clock time');
  if (!combatUxDom.includes('data-combat-ux-guide-keeps-paused="true"')) throw new Error('玩法 did not return to the still-paused state');
  if (!combatUxDom.includes('data-combat-ux-resume="true"')) throw new Error('Resume did not continue from the frozen combat phase');
  if (!combatUxDom.includes('data-combat-ux-restart="true"')) throw new Error('Pause restart did not re-enter Stage 1 through the normal restart path');
  if (!combatUxDom.includes('data-combat-ux-home="true"')) throw new Error('Pause home did not return to the start screen cleanly');

  const masteryDom = await dumpDom(browser, '/tests/mastery-browser-harness.html', { budget: 3200 });
  if (!masteryDom.includes('data-mastery-integration="pass"')) throw new Error(`Mastery event-stream integration failed. DOM:\n${masteryDom.slice(0, 5000)}`);
  if (!masteryDom.includes('data-ronin-practice-integration="true"')) throw new Error('Ronin practice did not stop after Stage 2, render Stage 2 analysis, or preserve the campaign personal best');
  if (!masteryDom.includes('data-ronin-practice-controls="true"')) throw new Error('Ronin practice player controls did not complete practice entry → retry → campaign handoff');
  if (!masteryDom.includes('data-shogun-practice-integration="true"')) throw new Error('Shogun practice did not stop after Stage 4, render Stage 4 analysis, or preserve the campaign personal best');
  if (!masteryDom.includes('data-shogun-practice-controls="true"')) throw new Error('Shogun practice player controls did not complete practice entry → retry → campaign handoff');
  if (!masteryDom.includes('data-mastery-best-preserved="true"')) throw new Error('A worse completed victory replaced the stored personal best');
  if (!masteryDom.includes('data-mastery-storage-fallback="true"')) throw new Error('Blocked localStorage prevented mastery result rendering');
  if (!masteryDom.includes('data-result-layout="pass"')) throw new Error('Mastery result content or restart control overflowed the 320x568 smoke viewport');

  const bossDom = await dumpDom(browser, '/tests/boss-browser-harness.html', { budget: 4200, extraArgs: ['--force-prefers-reduced-motion'] });
  if (!bossDom.includes('data-boss-integration="pass"')) throw new Error(`Boss event-stream integration failed. DOM:\n${bossDom.slice(0, 5000)}`);
  if (!bossDom.includes('data-boss-reduced-motion="true"')) throw new Error('Boss browser harness did not execute with reduced-motion preference enabled');
  if (!bossDom.includes('data-boss-banner-cleanup="true"')) throw new Error('Reduced-motion Phase II banner did not clean itself up');
  if (!bossDom.includes('data-boss-restart="true"')) throw new Error('Boss restart did not restore Phase I browser state');
  if (!bossDom.includes('data-boss-victory="true"')) throw new Error('Boss browser harness did not reach final victory');

  const onboardingDom = await dumpDom(browser, '/tests/onboarding-browser-harness.html', { budget: 2200 });
  if (!onboardingDom.includes('data-onboarding-integration="pass"')) throw new Error(`Guided first-duel event integration failed. DOM:\n${onboardingDom.slice(0, 5000)}`);
  if (!onboardingDom.includes('data-onboarding-layout="pass"')) throw new Error('Guided first-duel coach overflowed the 320x568 viewport or blocked pointer input');
  if (!onboardingDom.includes('data-onboarding-toggle="true"')) throw new Error('Guided first-duel start-screen toggle did not initialize enabled for a first-time run');
  if (!onboardingDom.includes('data-onboarding-skip-parry="true"')) throw new Error('Guided Duel was incorrectly persisted complete after an evade-only stage clear');

  const footworkDom = await dumpDom(browser, '/tests/footwork-browser-harness.html', { budget: 2200 });
  if (!footworkDom.includes('data-footwork-integration="pass"')) throw new Error(`Footwork distance / backstep integration failed. DOM:\n${footworkDom.slice(0, 5000)}`);
  if (!footworkDom.includes('data-footwork-short-evade="true"')) throw new Error('Short-range strike did not create a backstep evade counter opening');
  if (!footworkDom.includes('data-footwork-long-track="true"')) throw new Error('Long/heavy strike failed to track the backstep as designed');
  if (!footworkDom.includes('data-footwork-ui="true"')) throw new Error('Footwork STEP / distance UI did not initialize in browser harness');
  if (!footworkDom.includes('data-footwork-pointer="true"')) throw new Error('STEP pointerdown/pointerup path failed capture/isolation checks');
  if (!footworkDom.includes('data-footwork-travel-threshold="true"')) throw new Error('STEP pointer travel threshold allowed a dragged gesture to trigger a backstep');

  const readabilityDom = await dumpDom(browser, '/tests/readability-browser-harness.html', { budget: 1300 });
  if (!readabilityDom.includes('data-readability-integration="pass"')) throw new Error(`High-contrast blade-read integration failed. DOM:\n${readabilityDom.slice(0, 5000)}`);
  if (!readabilityDom.includes('data-readability-toggle="true"')) throw new Error('Blade-read accessibility toggle did not enable the optional mode');
  if (!readabilityDom.includes('data-readability-direction-flow="true"')) throw new Error('Blade-read mode did not follow the real telegraph direction');
  if (!readabilityDom.includes('data-readability-danger="true"')) throw new Error('Blade-read mode did not strengthen the cue for the real strike phase');
  if (!readabilityDom.includes('data-readability-clear="true"')) throw new Error('Blade-read cue did not clear after a successful real parry');
  if (!readabilityDom.includes('data-readability-pointer-safe="true"')) throw new Error('Blade-read overlay intercepted input or did not create exactly four reusable rails');
  if (!readabilityDom.includes('data-readability-layout="pass"')) throw new Error('Blade-read accessibility control overflowed the 320x568 harness viewport');

  const impactDom = await dumpDom(browser, '/tests/impact-browser-harness.html', { budget: 1600 });
  if (!impactDom.includes('data-impact-integration="pass"')) throw new Error(`Impact event choreography failed. DOM:\n${impactDom.slice(0, 5000)}`);
  if (!impactDom.includes('data-impact-pointer-safe="true"')) throw new Error('Impact layer intercepted pointer input');
  if (!impactDom.includes('data-impact-layout="pass"')) throw new Error('Impact layer escaped the 320x568 viewport');
  if (!impactDom.includes('data-impact-bounded="true"')) throw new Error('Impact burst nodes were not cleaned up after their bounded lifetime');

  const reducedImpactDom = await dumpDom(browser, '/tests/impact-browser-harness.html', { budget: 1200, extraArgs: ['--force-prefers-reduced-motion'] });
  if (!reducedImpactDom.includes('data-impact-integration="pass"')) throw new Error(`Reduced-motion impact event choreography failed. DOM:\n${reducedImpactDom.slice(0, 5000)}`);
  if (!reducedImpactDom.includes('data-impact-reduced-motion="true"')) throw new Error('Impact browser harness did not execute with reduced-motion preference enabled');
  if (!reducedImpactDom.includes('data-impact-reduced-fallback="true"')) throw new Error('Reduced-motion Impact FX did not preserve ring feedback while suppressing sparks/slash travel');
  if (!reducedImpactDom.includes('data-impact-bounded="true"')) throw new Error('Reduced-motion impact burst did not clean up after its bounded lifetime');

  console.log(`browser smoke passed with ${browser}: PlayCanvas renderer/motion + combat-ux + mastery/Ronin+Shogun-practice-controls + boss + onboarding + footwork + blade-read accessibility + impact/default+reduced integration`);
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
}
