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

try {
  const candidates = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'];
  const browser = candidates.find((name) => {
    const probe = spawnSync(name, ['--version'], { encoding: 'utf8' });
    return !probe.error && probe.status === 0;
  });
  if (!browser) throw new Error('Chrome/Chromium executable not found on CI runner');

  const child = spawn(browser, [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--virtual-time-budget=1500',
    '--dump-dom',
    'http://127.0.0.1:4173/?browser-smoke=1',
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
      rejectExit(new Error(`Headless browser timed out. stderr: ${stderr.slice(-2000)}`));
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

  if (code !== 0) throw new Error(`Headless browser exited ${code}: ${stderr}`);
  if (!stdout.includes('data-webgl="ready"')) {
    throw new Error(`WebGL2 shader did not compile/link successfully. DOM:\n${stdout.slice(0, 4000)}`);
  }
  if (!stdout.includes('data-start-ready="true"')) {
    throw new Error('Start control was disabled after browser initialization');
  }
  if (!stdout.includes('data-mastery-ready="true"')) {
    throw new Error('Mastery observer did not initialize');
  }
  console.log(`browser smoke passed with ${browser}: WebGL2, start control and mastery observer ready`);
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
}
