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
      const response = await fetch('http://127.0.0.1:4173/tests/duel-read-profile-browser-harness.html');
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
  const dom = await dumpDomWithDeviceMetrics(browser, '/tests/duel-read-profile-browser-harness.html', {
    budget: 3500,
    width: 320,
    height: 568,
    doneExpression: `document.documentElement.dataset.duelReadProfileBrowserIntegration === 'pass' || document.documentElement.dataset.duelReadProfileBrowserIntegration === 'fail'`,
  });

  const required = [
    ['data-duel-read-profile-browser-integration="pass"', 'duel read profile lifecycle failed'],
    ['data-duel-read-profile-ashigaru="true"', 'Ashigaru read profile missing'],
    ['data-duel-read-profile-ronin="true"', 'Ronin read profile missing'],
    ['data-duel-read-profile-oni="true"', 'Oni read profile missing'],
    ['data-duel-read-profile-shogun="true"', 'Shogun read profile missing'],
    ['data-duel-read-profile-blood-moon="true"', 'Blood Moon read profile missing'],
    ['data-duel-read-profile-clears-before-telegraph="true"', 'read profile remained into live telegraph'],
    ['data-duel-read-profile-challenge-quiet="true"', 'challenge/今日陣 gained extra intro clutter'],
    ['data-duel-read-profile-layout="pass"', 'read profile overflowed the 320×568 viewport or owned pointer input'],
  ];
  for (const [marker, message] of required) {
    if (!dom.includes(marker)) throw new Error(`${message}. DOM:\n${dom.slice(0, 6000)}`);
  }

  console.log(`duel read profile browser smoke passed with ${browser}: four campaign archetypes + Blood Moon, clears before telegraph, challenge quiet`);
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
