import { spawn, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { dumpDomWithDeviceMetrics } from './cdp-mobile-dom.mjs';

const root = resolve(process.cwd());
const viteCli = resolve(root, 'node_modules/vite/bin/vite.js');
const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));

function findBrowser() {
  const candidates = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'];
  return candidates.find((name) => {
    const probe = spawnSync(name, ['--version'], { encoding: 'utf8' });
    return !probe.error && probe.status === 0;
  });
}

async function waitForServer(child, stderrRef) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Vite exited early (${child.exitCode}): ${stderrRef.value}`);
    try {
      const response = await fetch('http://127.0.0.1:4173/tests/challenge-retry-focus-reset-browser-harness.html');
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
  const dom = await dumpDomWithDeviceMetrics(browser, '/tests/challenge-retry-focus-reset-browser-harness.html', {
    budget: 5000,
    width: 320,
    height: 568,
    doneExpression: `document.documentElement.dataset.challengeRetryFocusResetBrowser === 'pass' || document.documentElement.dataset.challengeRetryFocusResetBrowser === 'fail'`,
  });

  const required = [
    ['data-challenge-retry-focus-reset-browser="pass"', 'challenge retry-focus reset lifecycle did not complete'],
    ['data-challenge-retry-focus-focused="true"', 'focused result did not own the retry label'],
    ['data-challenge-retry-focus-retry-label-reset="true"', 'retry retained stale focused button copy'],
    ['data-challenge-retry-focus-empty-terminal-default="true"', 'empty next terminal did not restore generic challenge retry copy'],
    ['data-challenge-retry-focus-campaign-label-reset="true"', 'full-campaign handoff retained challenge retry copy'],
  ];
  for (const [marker, message] of required) {
    if (!dom.includes(marker)) throw new Error(`${message}. DOM:\n${dom.slice(0, 6000)}`);
  }

  console.log(`challenge retry-focus browser smoke passed with ${browser}: focused label → retry reset → empty terminal fallback → campaign reset`);
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
