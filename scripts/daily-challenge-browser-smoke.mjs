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
      const response = await fetch('http://127.0.0.1:4173/tests/daily-challenge-browser-harness.html');
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
  const dom = await dumpDomWithDeviceMetrics(browser, '/tests/daily-challenge-browser-harness.html', {
    budget: 5000,
    width: 320,
    height: 568,
    doneExpression: `document.documentElement.dataset.dailyChallengeBrowserIntegration === 'pass' || document.documentElement.dataset.dailyChallengeBrowserIntegration === 'fail'`,
  });

  const required = [
    ['data-daily-challenge-browser-integration="pass"', 'daily challenge lifecycle did not complete'],
    ['data-daily-challenge-entry="true"', 'real 今日陣 entry/date/banner activation failed'],
    ['data-daily-challenge-banner-lifecycle="true"', '今日陣 banner did not clear at first telegraph'],
    ['data-challenge-tactic-browser="true"', 'post-wave tactical choice did not safely park/render at 320×568'],
    ['data-challenge-tactic-risk-reward="true"', '整息/血誓 reward trade did not match the challenge rule'],
    ['data-challenge-tactic-three-choices="true"', 'challenge did not complete exactly the three Stage 2/4/6 tactical checkpoints'],
    ['data-daily-challenge-terminal="true"', '今日陣 terminal date summary failed'],
    ['data-daily-challenge-retry="true"', '今日陣 retry did not preserve date key'],
    ['data-daily-challenge-same-formation="true"', '今日陣 retry changed the daily formation'],
    ['data-daily-challenge-campaign-handoff="true"', '今日陣 state leaked into full campaign'],
    ['data-challenge-tactic-campaign-isolation="true"', 'challenge tactical state leaked into campaign'],
  ];
  for (const [marker, message] of required) {
    if (!dom.includes(marker)) throw new Error(`${message}. DOM:\n${dom.slice(0, 6000)}`);
  }

  const identityDom = await dumpDomWithDeviceMetrics(browser, '/tests/challenge-visual-identity-browser-harness.html', {
    budget: 7000,
    width: 320,
    height: 568,
    doneExpression: `document.documentElement.dataset.challengeVisualIdentityBrowser === 'pass' || document.documentElement.dataset.challengeVisualIdentityBrowser === 'fail'`,
  });
  const identityRequired = [
    ['data-challenge-visual-identity-browser="pass"', 'challenge rematch visual identity browser gate failed'],
    ['data-challenge-visual-identity-progression-restored="true"', 'renderer visual projection leaked into CombatEngine progression state'],
    ['data-challenge-visual-identity-sequence="ashigaru-jingasa,ronin-travel-wrap,oni-heavy-guard,ronin-travel-wrap,crimson-shogun-banner"', 'challenge Waves 4–8 did not reuse Ashigaru/Ronin/Oni/Ronin/Shogun authored visual identities'],
  ];
  for (const [marker, message] of identityRequired) {
    if (!identityDom.includes(marker)) throw new Error(`${message}. DOM:\n${identityDom.slice(0, 6000)}`);
  }

  const rivalDom = await dumpDomWithDeviceMetrics(browser, '/tests/challenge-rival-browser-harness.html', {
    budget: 7000,
    width: 320,
    height: 568,
    doneExpression: `document.documentElement.dataset.challengeRivalBrowserIntegration === 'pass' || document.documentElement.dataset.challengeRivalBrowserIntegration === 'fail'`,
  });
  const rivalRequired = [
    ['data-challenge-rival-browser-integration="pass"', 'challenge rival lifecycle did not complete'],
    ['data-challenge-rival-entry="true"', 'challenge rival PB badge was not visible, pointer-safe and in-bounds'],
    ['data-challenge-rival-behind="true"', 'challenge rival did not show a behind-PB wave split'],
    ['data-challenge-rival-ahead="true"', 'challenge rival did not show an ahead-PB split using authoritative same-wave score'],
    ['data-challenge-rival-stored="true"', 'winning challenge did not persist eight authoritative PB splits in the existing challenge key'],
    ['data-challenge-rival-terminal="true"', 'challenge rival badge did not clear at terminal'],
    ['data-challenge-rival-retry="true"', 'challenge retry did not reload the just-earned split PB'],
    ['data-challenge-rival-campaign-isolation="true"', 'challenge rival state leaked into campaign'],
  ];
  for (const [marker, message] of rivalRequired) {
    if (!rivalDom.includes(marker)) throw new Error(`${message}. DOM:\n${rivalDom.slice(0, 6000)}`);
  }

  console.log(`daily challenge browser smoke passed with ${browser}: 今日陣 lifecycle + tactical checkpoints + rematch identity + challenge rival PB splits`);
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
