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
      const response = await fetch('http://127.0.0.1:4173/tests/run-analysis-direction-browser-harness.html');
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
  const dom = await dumpDomWithDeviceMetrics(browser, '/tests/run-analysis-direction-browser-harness.html', {
    budget: 5000,
    width: 320,
    height: 568,
    doneExpression: `document.documentElement.dataset.runAnalysisDirectionBrowser === 'pass' || document.documentElement.dataset.runAnalysisDirectionBrowser === 'fail'`,
  });

  const required = [
    ['data-run-analysis-direction-browser="pass"', 'four-way direction/practice-progress analysis did not render correctly'],
    ['data-run-analysis-direction-focus="pass"', 'weakest direction was not derived from authoritative event outcomes'],
    ['data-run-analysis-direction-layout="pass"', 'direction analysis overflowed the 320×568 result surface'],
    ['data-run-analysis-direction-challenge-omitted="true"', 'eight-stage terminal did not suppress the extra direction map'],
    ['data-practice-progress-first="pass"', 'first same-opponent practice did not show the repeat-to-compare prompt'],
    ['data-practice-progress-comparison="pass"', 'repeat practice did not compare defense, hits and counter conversion'],
    ['data-practice-progress-layout="pass"', 'repeat-practice progress row overflowed the 320×568 result surface'],
  ];
  for (const [marker, message] of required) {
    if (!dom.includes(marker)) throw new Error(`${message}. DOM:\n${dom.slice(0, 7000)}`);
  }

  console.log(`run-analysis browser smoke passed with ${browser}: four-way defense + challenge omission + same-opponent practice progress at 320x568`);
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
