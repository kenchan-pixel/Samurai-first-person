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
      const response = await fetch('http://127.0.0.1:4173/tests/challenge-mastery-browser-harness.html');
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
  const dom = await dumpDomWithDeviceMetrics(browser, '/tests/challenge-mastery-browser-harness.html', {
    budget: 5000,
    width: 320,
    height: 568,
    doneExpression: `document.documentElement.dataset.challengeMasteryBrowser === 'pass' || document.documentElement.dataset.challengeMasteryBrowser === 'fail'`,
  });

  const required = [
    ['data-challenge-mastery-browser="pass"', 'challenge mastery lifecycle did not complete'],
    ['data-challenge-mastery-entry="true"', 'mastery objective was not visible at 0/3 on challenge entry'],
    ['data-challenge-mastery-first="true"', 'first hitless wave did not advance the objective'],
    ['data-challenge-mastery-second="true"', 'second hitless wave did not advance the objective'],
    ['data-challenge-mastery-achieved-live="true"', 'third hitless wave did not visibly complete the objective'],
    ['data-challenge-mastery-terminal="true"', 'terminal result did not carry the truthful mastery receipt'],
    ['data-challenge-mastery-retry-reset="true"', 'retry did not reset the mastery objective'],
    ['data-challenge-mastery-retry-terminal="true"', 'retry terminal reused stale mastery success state'],
    ['data-challenge-mastery-campaign-isolation="true"', 'mastery objective leaked into campaign state'],
  ];
  for (const [marker, message] of required) {
    if (!dom.includes(marker)) throw new Error(`${message}. DOM:\n${dom.slice(0, 7000)}`);
  }

  console.log(`challenge mastery browser smoke passed with ${browser}: 0/3 → 1/3 → 2/3 → achieved → terminal → retry reset → campaign isolation`);
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
