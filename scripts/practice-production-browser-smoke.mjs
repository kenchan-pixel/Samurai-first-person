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
      const response = await fetch('http://127.0.0.1:4173/tests/practice-production-browser-harness.html');
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
  const dom = await dumpDomWithDeviceMetrics(browser, '/tests/practice-production-browser-harness.html', {
    budget: 42000,
    width: 320,
    height: 568,
    doneExpression: `document.documentElement.dataset.practiceProductionBrowser === 'pass' || document.documentElement.dataset.practiceProductionBrowser === 'fail'`,
  });

  const required = [
    ['data-practice-production-browser="pass"', 'production practice orchestration lifecycle failed'],
    ['data-practice-production-viewport="true"', 'production practice gate did not run at 320×568'],
    ['data-practice-production-normal-ronin="true"', 'real 練浪人 start control did not enter Stage 2 practice'],
    ['data-practice-production-normal-oni="true"', 'real 練鬼 start control did not enter Stage 3 practice'],
    ['data-practice-production-normal-shogun="true"', 'real 練將軍 start control did not enter Stage 4 Phase I practice'],
    ['data-practice-production-training-launch="true"', 'weak-stage recommendation did not enter real Ronin practice'],
    ['data-practice-production-training-terminal="true"', 'real Ronin practice did not reach terminal recommendation state'],
    ['data-practice-production-training-retry="true"', 'recommended practice retry did not use production restart'],
    ['data-practice-production-training-handoff="true"', 'recommended practice campaign handoff did not restore Stage 1'],
    ['data-practice-production-blood-moon-launch="true"', 'real 練血月 control did not enter Blood Moon practice'],
    ['data-practice-production-blood-moon-phase-two="true"', '練血月 did not prove direct Phase II at 6 HP / 0 transition score'],
    ['data-practice-production-blood-moon-terminal="true"', 'Blood Moon practice did not reach terminal retry state'],
    ['data-practice-production-blood-moon-retry="true"', '再戰血月 did not stay in direct Blood Moon practice'],
    ['data-practice-production-blood-moon-handoff="true"', 'Blood Moon campaign handoff did not restore clean Stage 1'],
  ];
  for (const [marker, message] of required) {
    if (!dom.includes(marker)) throw new Error(`${message}. DOM:\n${dom.slice(0, 7000)}`);
  }

  console.log(`production practice browser smoke passed with ${browser}: 練浪人/練鬼/練將軍 real start controls + recommendation → Ronin terminal/retry/handoff + 練血月 direct Phase II terminal/retry/handoff`);
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
