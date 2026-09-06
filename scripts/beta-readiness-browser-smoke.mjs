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
    budget: 70000,
    width: 320,
    height: 568,
    doneExpression: `document.documentElement.dataset.betaReadinessNextBrowser === 'pass' || document.documentElement.dataset.betaReadinessNextBrowser === 'fail'`,
  });

  const required = [
    ['data-beta-readiness-next-browser="pass"', 'Closed Beta production next-test browser flow failed'],
    ['data-beta-readiness-next-production-document="true"', 'acceptance gate did not execute against the production document'],
    ['data-beta-readiness-next-viewport="true"', 'production acceptance gate did not execute at 320×568'],
    ['data-beta-readiness-next-first="pass"', 'real campaign terminal did not route into the existing practice path'],
    ['data-beta-readiness-next-practice-navigation="true"', 'result CTA did not invoke the real Ronin production route'],
    ['data-beta-readiness-next-repeat="pass"', 'real direct-practice result did not preserve same-opponent retry'],
    ['data-beta-readiness-next-feedback="pass"', 'real repeat-practice comparison did not route into explicit feedback'],
    ['data-beta-readiness-next-feedback-navigation="true"', 'result CTA did not open the real feedback panel'],
    ['data-beta-readiness-next-platform-seam="true"', 'headless gate did not install the bounded Web Share platform seam'],
    ['data-beta-readiness-next-feedback-payload="true"', 'real production feedback payload did not reach the platform seam intact'],
    ['data-beta-readiness-next-done="true"', 'real explicit feedback export did not complete 3/3'],
    ['data-beta-readiness-next-challenge-quiet="true"', 'result CTA leaked into a real standard challenge terminal'],
    ['data-beta-readiness-next-daily-quiet="true"', 'result CTA leaked into a real 今日陣 terminal'],
    ['data-beta-readiness-next-touch="true"', 'production next/share/report controls fell below 44px'],
    ['data-beta-readiness-next-layout="pass"', 'production next/share/report controls overlapped or escaped 320×568'],
  ];
  for (const [marker, message] of required) {
    if (!dom.includes(marker)) throw new Error(`${message}. DOM:\n${dom.slice(0, 9000)}`);
  }

  console.log(`Closed Beta production next-test browser smoke passed with ${browser}: real campaign result → Ronin retry/comparison → real feedback payload through deterministic Web Share seam → challenge + 今日陣 quietness at 320×568`);
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
