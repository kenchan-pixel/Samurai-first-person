import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { extname, resolve, sep } from 'node:path';
import { dumpDomWithDeviceMetrics } from './cdp-mobile-dom.mjs';

const root = resolve(process.cwd());
const distRoot = resolve(root, 'dist');
const viteCli = resolve(root, 'node_modules/vite/bin/vite.js');
const build = spawnSync(process.execPath, [viteCli, 'build'], { cwd: root, encoding: 'utf8' });
if (build.status !== 0) throw new Error(`Vite build failed:\n${build.stdout}\n${build.stderr}`);

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.map': 'application/json',
};

function resolveServedFile(pathname) {
  const relative = decodeURIComponent(pathname === '/' ? '/index.html' : pathname);
  const file = resolve(distRoot, `.${relative}`);
  if (file !== distRoot && !file.startsWith(`${distRoot}${sep}`)) throw new Error('unsafe path');
  return file;
}

const server = createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
    const file = resolveServedFile(requestUrl.pathname);
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not a file');
    res.writeHead(200, { 'content-type': contentTypes[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

await new Promise((resolveListen, rejectListen) => {
  server.once('error', rejectListen);
  server.listen(4173, '127.0.0.1', resolveListen);
});

function findBrowser() {
  const candidates = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'];
  return candidates.find((name) => {
    const probe = spawnSync(name, ['--version'], { encoding: 'utf8' });
    return !probe.error && probe.status === 0;
  });
}

try {
  const browser = findBrowser();
  if (!browser) throw new Error('Chrome/Chromium executable not found on CI runner');
  const dom = await dumpDomWithDeviceMetrics(browser, '/?browser-smoke=attack-rhythm', {
    budget: 4400,
    width: 320,
    height: 568,
    doneExpression: `document.documentElement.dataset.attackRhythmRendererIntegration === 'pass' || document.documentElement.dataset.attackRhythmRendererIntegration === 'fail'`,
  });

  if (!dom.includes('data-renderer-backend="playcanvas"')) throw new Error('Attack-rhythm gate did not stay on the PlayCanvas production renderer');
  if (!dom.includes('data-attack-rhythm-renderer-integration="pass"')) throw new Error(`Attack-rhythm renderer contract failed. DOM:\n${dom.slice(0, 6000)}`);
  if (!dom.includes('data-attack-rhythm-renderer-viewport="320x568"')) throw new Error('Attack-rhythm renderer contract did not run at the required 320x568 viewport');
  if (!dom.includes('data-attack-rhythm-renderer-sequence="measured-standard-quick-heavy"')) throw new Error('Attack-rhythm gate did not prove measured → standard → quick → heavy coexistence');
  if (!dom.includes('data-attack-rhythm-renderer-blade="authored-handr-grip"')) throw new Error('Attack-rhythm gate did not preserve authored Sword→HandR grip authority');
  if (!dom.includes('data-attack-rhythm-renderer-combat="timings-unchanged"')) throw new Error('Attack-rhythm gate did not preserve the combat-timing contract');

  console.log(`attack-rhythm browser smoke passed with ${browser}: 320x568 real PlayCanvas measured/standard/quick/heavy rhythm + authored grip + unchanged combat timings`);
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
}
