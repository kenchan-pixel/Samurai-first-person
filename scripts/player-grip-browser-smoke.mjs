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
  const dom = await dumpDomWithDeviceMetrics(browser, '/?browser-smoke=player-grip', {
    budget: 4200,
    width: 320,
    height: 568,
    doneExpression: `document.documentElement.dataset.playerGripRendererIntegration === 'pass' || document.documentElement.dataset.playerGripRendererIntegration === 'fail'`,
  });

  if (!dom.includes('data-renderer-backend="playcanvas"')) throw new Error('Player-grip gate did not stay on the PlayCanvas production renderer');
  if (!dom.includes('data-player-grip-renderer-integration="pass"')) throw new Error(`Player-grip renderer contract failed. DOM:\n${dom.slice(0, 6000)}`);
  if (!dom.includes('data-player-grip-renderer-viewport="320x568"')) throw new Error('Player-grip renderer contract did not run at the required 320x568 viewport');
  if (!dom.includes('data-player-grip-renderer-directions="top,right,bottom,left"')) throw new Error('Player-grip renderer contract did not cover all four parry directions');
  if (!dom.includes('data-player-grip-renderer-actions="normal,perfect,counter,neutral"')) throw new Error('Player-grip renderer contract did not cover normal/perfect/counter/neutral action identity');
  if (!dom.includes('data-player-grip-renderer-attachment="pommel-habaki-axis-v2"')) throw new Error('Player-grip renderer contract did not prove live handle-axis attachment');
  if (!dom.includes('data-player-grip-renderer-visibility="support-handle-blade-projected-v1"')) throw new Error('Player-grip renderer contract did not prove projected support/handle/blade visibility');

  console.log(`player-grip browser smoke passed with ${browser}: dedicated 320x568 PlayCanvas process + four-direction grip + handle alignment + projected blade-read visibility`);
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
}
