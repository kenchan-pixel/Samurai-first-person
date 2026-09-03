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
      const response = await fetch('http://127.0.0.1:4173/tests/result-share-browser-harness.html');
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
  const dom = await dumpDomWithDeviceMetrics(browser, '/tests/result-share-browser-harness.html?browser-smoke=result-actions#debug', {
    budget: 3000,
    width: 320,
    height: 568,
    doneExpression: `document.documentElement.dataset.resultShareBrowser === 'fail' || document.documentElement.dataset.resultFeedbackBrowser === 'fail' || (document.documentElement.dataset.resultShareBrowser === 'pass' && document.documentElement.dataset.resultFeedbackBrowser === 'pass')`,
  });

  const required = [
    ['data-result-share-browser="pass"', 'result sharing browser lifecycle failed'],
    ['data-result-share-layout="pass"', 'share control escaped the 320×568 result surface or dropped below 44px'],
    ['data-result-share-native="pass"', 'native Web Share payload did not contain the visible terminal result'],
    ['data-result-share-clipboard="pass"', 'clipboard fallback did not preserve the visible terminal result and clean URL'],
    ['data-result-feedback-browser="pass"', 'Closed Beta feedback/bug-report lifecycle failed'],
    ['data-result-feedback-layout="pass"', 'feedback control/panel escaped 320×568 or privacy disclosure is missing'],
    ['data-result-feedback-export="pass"', 'structured bug report did not export locally with visible result + player note'],
    ['data-result-feedback-close="pass"', 'feedback panel did not return to the result surface cleanly'],
  ];
  for (const [marker, message] of required) {
    if (!dom.includes(marker)) throw new Error(`${message}. DOM:\n${dom.slice(0, 8000)}`);
  }

  console.log(`result-actions browser smoke passed with ${browser}: 320x568 share + local Closed Beta feedback/bug export`);
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
