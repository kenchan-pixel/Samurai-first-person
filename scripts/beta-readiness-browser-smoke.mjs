import { spawn, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { dumpDomWithDeviceMetrics } from './cdp-mobile-dom.mjs';

const root = resolve(process.cwd());
const viteCli = resolve(root, 'node_modules/vite/bin/vite.js');
const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));

function findBrowser() {
  return ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'].find((name) => {
    const probe = spawnSync(name, ['--version'], { encoding: 'utf8' });
    return !probe.error && probe.status === 0;
  });
}

async function waitForServer(child, stderrRef) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Vite exited early (${child.exitCode}): ${stderrRef.value}`);
    try {
      const response = await fetch('http://127.0.0.1:4173/tests/beta-readiness-browser-harness.html');
      if (response.ok) return;
    } catch {
      // Retry while Vite starts.
    }
    await sleep(50);
  }
  throw new Error(`Vite did not become ready: ${stderrRef.value.slice(-2000)}`);
}

const browser = findBrowser();
if (!browser) throw new Error('Chrome/Chromium executable not found on CI runner');

const stderrRef = { value: '' };
const server = spawn(process.execPath, [viteCli, '--host', '127.0.0.1', '--port', '4173', '--strictPort'], {
  cwd: root,
  stdio: ['ignore', 'ignore', 'pipe'],
});
server.stderr.setEncoding('utf8');
server.stderr.on('data', (chunk) => { stderrRef.value += chunk; });

try {
  await waitForServer(server, stderrRef);
  const dom = await dumpDomWithDeviceMetrics(browser, '/tests/beta-readiness-browser-harness.html', {
    budget: 3500,
    width: 320,
    height: 568,
    doneExpression: `document.documentElement.dataset.betaReadinessNextBrowser === 'pass' || document.documentElement.dataset.betaReadinessNextBrowser === 'fail'`,
  });

  const required = [
    ['data-beta-readiness-next-browser="pass"', 'Closed Beta next-test browser flow failed'],
    ['data-beta-readiness-next-first="pass"', 'campaign result did not route into the existing practice path'],
    ['data-beta-readiness-next-repeat="pass"', 'direct-practice result did not preserve same-opponent retry'],
    ['data-beta-readiness-next-feedback="pass"', 'repeat-practice completion did not route into explicit feedback'],
    ['data-beta-readiness-next-done="true"', 'successful explicit feedback export did not complete 3/3'],
    ['data-beta-readiness-next-challenge-quiet="true"', 'next-test result action leaked into challenge mode'],
    ['data-beta-readiness-next-touch="true"', 'next-test/share/report controls fell below 44px'],
    ['data-beta-readiness-next-layout="pass"', 'next-test/share/report controls overlapped or escaped 320x568'],
  ];
  for (const [marker, message] of required) {
    if (!dom.includes(marker)) throw new Error(`${message}. DOM:\n${dom.slice(0, 7000)}`);
  }

  console.log(`Closed Beta next-test browser smoke passed with ${browser}: result → practice retry → feedback → 3/3 at 320x568`);
} finally {
  if (server.exitCode === null && !server.killed) server.kill('SIGTERM');
  if (server.exitCode === null) {
    await Promise.race([
      new Promise((resolveClose) => server.once('close', resolveClose)),
      sleep(1000),
    ]);
  }
  if (server.exitCode === null) server.kill('SIGKILL');
}
