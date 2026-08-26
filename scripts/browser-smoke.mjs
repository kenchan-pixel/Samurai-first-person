import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { extname, resolve, sep } from 'node:path';

const root = resolve(process.cwd());
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const server = createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
    const relative = decodeURIComponent(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname);
    const file = resolve(root, `.${relative}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) throw new Error('unsafe path');
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

async function dumpDom(browser, path, { budget = 1800 } = {}) {
  const child = spawn(browser, [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--window-size=320,568',
    `--virtual-time-budget=${budget}`,
    '--dump-dom',
    `http://127.0.0.1:4173${path}`,
  ]);

  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (chunk) => (stdout += chunk));
  child.stderr.on('data', (chunk) => (stderr += chunk));

  const code = await new Promise((resolveExit, rejectExit) => {
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      rejectExit(new Error(`Headless browser timed out for ${path}. stderr: ${stderr.slice(-2000)}`));
    }, 20000);
    child.once('error', (error) => {
      clearTimeout(timer);
      rejectExit(error);
    });
    child.once('close', (exitCode) => {
      clearTimeout(timer);
      resolveExit(exitCode);
    });
  });

  if (code !== 0) throw new Error(`Headless browser exited ${code} for ${path}: ${stderr}`);
  return stdout;
}

try {
  const browser = findBrowser();
  if (!browser) throw new Error('Chrome/Chromium executable not found on CI runner');

  const appDom = await dumpDom(browser, '/?browser-smoke=1');
  if (!appDom.includes('data-webgl="ready"')) {
    throw new Error(`WebGL2 shader did not compile/link successfully. DOM:\n${appDom.slice(0, 4000)}`);
  }
  if (!appDom.includes('data-start-ready="true"')) {
    throw new Error('Start control was disabled after browser initialization');
  }
  if (!appDom.includes('data-mastery-ready="true"')) {
    throw new Error('Mastery observer did not initialize in the real application document');
  }

  const masteryDom = await dumpDom(browser, '/tests/mastery-browser-harness.html', { budget: 2600 });
  if (!masteryDom.includes('data-mastery-integration="pass"')) {
    throw new Error(`Mastery event-stream integration failed. DOM:\n${masteryDom.slice(0, 5000)}`);
  }
  if (!masteryDom.includes('data-mastery-best-preserved="true"')) {
    throw new Error('A worse completed victory replaced the stored personal best');
  }
  if (!masteryDom.includes('data-mastery-storage-fallback="true"')) {
    throw new Error('Blocked localStorage prevented mastery result rendering');
  }
  if (!masteryDom.includes('data-result-layout="pass"')) {
    throw new Error('Mastery result content or restart control overflowed the 320x568 smoke viewport');
  }

  console.log(`browser smoke passed with ${browser}: WebGL2/startup plus mastery event-stream, local best, storage fallback and 320x568 result layout`);
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
}
