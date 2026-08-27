import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { extname, resolve, sep } from 'node:path';

const root = resolve(process.cwd());
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
};

const server = createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
    const relative = decodeURIComponent(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname);
    const file = resolve(root, `.${relative}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) throw new Error('unsafe path');
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

  const appDom = await dumpDom(browser, '/?browser-smoke=1');
  if (!appDom.includes('data-webgl="ready"')) {
    throw new Error(`WebGL2 shader did not compile/link successfully. DOM:\n${appDom.slice(0, 4000)}`);
  }
  if (!appDom.includes('data-start-ready="true"')) {
    throw new Error('Start control was disabled after browser initialization');
  }
  if (!appDom.includes('data-visual-identity="wide-samurai-v2"')) {
    throw new Error('Wide-framed samurai renderer did not initialize in the real application document');
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

  const masteryDom = await dumpDom(browser, '/tests/mastery-browser-harness.html', { budget: 2600 });
  if (!masteryDom.includes('data-mastery-integration="pass"')) {
    throw new Error(`Mastery event-stream integration failed. DOM:\n${masteryDom.slice(0, 5000)}`);
  }
  if (!masteryDom.includes('data-mastery-best-preserved="true"')) {
    throw new Error('A worse completed victory replaced the stored personal best');
  }
  if (!masteryDom.includes('data-mastery-storage-fallback="true"')) {
    throw new Error('Blocked localStorage prevented mastery result rendering');
  }
  if (!masteryDom.includes('data-result-layout="pass"')) {
    throw new Error('Mastery result content or restart control overflowed the 320x568 smoke viewport');
  }

  const bossDom = await dumpDom(browser, '/tests/boss-browser-harness.html', {
    budget: 4200,
    extraArgs: ['--force-prefers-reduced-motion'],
  });
  if (!bossDom.includes('data-boss-integration="pass"')) {
    throw new Error(`Boss event-stream integration failed. DOM:\n${bossDom.slice(0, 5000)}`);
  }
  if (!bossDom.includes('data-boss-reduced-motion="true"')) {
    throw new Error('Boss browser harness did not execute with reduced-motion preference enabled');
  }
  if (!bossDom.includes('data-boss-banner-cleanup="true"')) {
    throw new Error('Reduced-motion Phase II banner did not clean itself up');
  }
  if (!bossDom.includes('data-boss-restart="true"')) {
    throw new Error('Boss restart did not restore Phase I browser state');
  }
  if (!bossDom.includes('data-boss-victory="true"')) {
    throw new Error('Boss browser harness did not reach final victory');
  }

  const onboardingDom = await dumpDom(browser, '/tests/onboarding-browser-harness.html', { budget: 2200 });
  if (!onboardingDom.includes('data-onboarding-integration="pass"')) {
    throw new Error(`Guided first-duel event integration failed. DOM:\n${onboardingDom.slice(0, 5000)}`);
  }
  if (!onboardingDom.includes('data-onboarding-layout="pass"')) {
    throw new Error('Guided first-duel coach overflowed the 320x568 viewport or blocked pointer input');
  }
  if (!onboardingDom.includes('data-onboarding-toggle="true"')) {
    throw new Error('Guided first-duel start-screen toggle did not initialize enabled for a first-time run');
  }
  if (!onboardingDom.includes('data-onboarding-skip-parry="true"')) {
    throw new Error('Guided Duel was incorrectly persisted complete after an evade-only stage clear');
  }

  const footworkDom = await dumpDom(browser, '/tests/footwork-browser-harness.html', { budget: 2200 });
  if (!footworkDom.includes('data-footwork-integration="pass"')) {
    throw new Error(`Footwork distance / backstep integration failed. DOM:\n${footworkDom.slice(0, 5000)}`);
  }
  if (!footworkDom.includes('data-footwork-short-evade="true"')) {
    throw new Error('Short-range strike did not create a backstep evade counter opening');
  }
  if (!footworkDom.includes('data-footwork-long-track="true"')) {
    throw new Error('Long/heavy strike failed to track the backstep as designed');
  }
  if (!footworkDom.includes('data-footwork-ui="true"')) {
    throw new Error('Footwork STEP / distance UI did not initialize in browser harness');
  }
  if (!footworkDom.includes('data-footwork-pointer="true"')) {
    throw new Error('STEP pointerdown/pointerup path failed capture/isolation checks');
  }
  if (!footworkDom.includes('data-footwork-travel-threshold="true"')) {
    throw new Error('STEP pointer travel threshold allowed a dragged gesture to trigger a backstep');
  }

  const impactDom = await dumpDom(browser, '/tests/impact-browser-harness.html', { budget: 1600 });
  if (!impactDom.includes('data-impact-integration="pass"')) {
    throw new Error(`Impact event choreography failed. DOM:\n${impactDom.slice(0, 5000)}`);
  }
  if (!impactDom.includes('data-impact-pointer-safe="true"')) {
    throw new Error('Impact layer intercepted pointer input');
  }
  if (!impactDom.includes('data-impact-layout="pass"')) {
    throw new Error('Impact layer escaped the 320x568 viewport');
  }
  if (!impactDom.includes('data-impact-bounded="true"')) {
    throw new Error('Impact burst nodes were not cleaned up after their bounded lifetime');
  }

  const reducedImpactDom = await dumpDom(browser, '/tests/impact-browser-harness.html', {
    budget: 1200,
    extraArgs: ['--force-prefers-reduced-motion'],
  });
  if (!reducedImpactDom.includes('data-impact-integration="pass"')) {
    throw new Error(`Reduced-motion impact event choreography failed. DOM:\n${reducedImpactDom.slice(0, 5000)}`);
  }
  if (!reducedImpactDom.includes('data-impact-reduced-motion="true"')) {
    throw new Error('Impact browser harness did not execute with reduced-motion preference enabled');
  }
  if (!reducedImpactDom.includes('data-impact-reduced-fallback="true"')) {
    throw new Error('Reduced-motion Impact FX did not preserve ring feedback while suppressing sparks/slash travel');
  }
  if (!reducedImpactDom.includes('data-impact-bounded="true"')) {
    throw new Error('Reduced-motion impact burst did not clean up after its bounded lifetime');
  }

  console.log(`browser smoke passed with ${browser}: WebGL2/wide renderer + mastery + boss + onboarding + footwork + impact/default+reduced integration`);
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
}
