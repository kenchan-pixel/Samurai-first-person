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
      const response = await fetch('http://127.0.0.1:4173/?browser-smoke=campaign-replay');
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
  const dom = await dumpDomWithDeviceMetrics(browser, '/?browser-smoke=campaign-replay', {
    budget: 6000,
    width: 320,
    height: 568,
    doneExpression: `document.documentElement.dataset.campaignReplaySmoke === 'pass' || document.documentElement.dataset.campaignReplaySmoke === 'fail'`,
  });

  const required = [
    ['data-campaign-replay-smoke="pass"', 'campaign replay production browser gate failed'],
    ['data-campaign-replay-smoke-offer="pass"', 'campaign replay target was not offered after a real campaign terminal'],
    ['data-campaign-replay-smoke-achieved="pass"', 'campaign replay target was not carried/evaluated on the next campaign'],
    ['data-campaign-replay-smoke-challenge-quiet="pass"', 'campaign replay target leaked into challenge mode'],
  ];
  for (const [marker, message] of required) {
    if (!dom.includes(marker)) throw new Error(`${message}. DOM:\n${dom.slice(0, 8000)}`);
  }

  console.log(`campaign replay objective browser smoke passed with ${browser}: production 320x568 offer -> retry completion -> challenge isolation`);
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
