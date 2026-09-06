import { mkdtemp, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForDevTools(child, stderrRef, timeout = 5000) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    };
    const inspect = () => {
      const match = stderrRef.value.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) finish(resolve, match[1]);
    };
    const timer = setTimeout(() => finish(reject, new Error(`DevTools endpoint timeout. stderr: ${stderrRef.value.slice(-2000)}`)), timeout);
    child.stderr.on('data', inspect);
    child.once('error', (error) => finish(reject, error));
    child.once('close', (code) => {
      if (!settled) finish(reject, new Error(`Browser exited before DevTools was ready (${code}). stderr: ${stderrRef.value.slice(-2000)}`));
    });
    inspect();
  });
}

async function findPageTarget(port) {
  let lastError = null;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (response.ok) {
        const targets = await response.json();
        const page = targets.find((target) => target.type === 'page' && target.webSocketDebuggerUrl);
        if (page) return page;
      }
    } catch (error) {
      lastError = error;
    }
    await sleep(25);
  }
  throw new Error(`DevTools page target was not available${lastError ? `: ${lastError.message}` : ''}`);
}

async function openCdp(webSocketDebuggerUrl) {
  if (typeof WebSocket !== 'function') throw new Error('Node WebSocket client is unavailable');
  const socket = new WebSocket(webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('DevTools WebSocket open timeout')), 5000);
    socket.addEventListener('open', () => {
      clearTimeout(timer);
      resolve();
    }, { once: true });
    socket.addEventListener('error', (event) => {
      clearTimeout(timer);
      reject(event.error || new Error('DevTools WebSocket error'));
    }, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  socket.addEventListener('message', (event) => {
    let message;
    try {
      message = JSON.parse(String(event.data));
    } catch {
      return;
    }
    if (!message.id) return;
    const entry = pending.get(message.id);
    if (!entry) return;
    pending.delete(message.id);
    clearTimeout(entry.timer);
    if (message.error) entry.reject(new Error(`${entry.method}: ${message.error.message || JSON.stringify(message.error)}`));
    else entry.resolve(message.result);
  });

  const send = (method, params = {}, timeout = 20000) => new Promise((resolve, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`${method} timed out`));
    }, timeout);
    pending.set(id, { resolve, reject, timer, method });
    socket.send(JSON.stringify({ id, method, params }));
  });

  return { socket, send };
}

async function waitForNavigation(send, url, timeout = 5000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      const result = await send('Runtime.evaluate', {
        expression: `location.href === ${JSON.stringify(url)} && document.readyState === 'complete'`,
        returnByValue: true,
      }, 1000);
      if (result?.result?.value === true) return;
    } catch {
      // Navigation may temporarily replace the execution context; retry until the deadline.
    }
    await sleep(25);
  }
  throw new Error(`Timed out waiting for ${url} to finish loading`);
}

export async function dumpDomWithDeviceMetrics(
  browser,
  path,
  {
    budget = 1800,
    extraArgs = [],
    width = 320,
    height = 568,
    doneExpression = 'false',
  } = {},
) {
  const profile = await mkdtemp(join(tmpdir(), 'samurai-browser-smoke-'));
  const stderrRef = { value: '' };
  const child = spawn(browser, [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-webgl',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    ...extraArgs,
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (chunk) => {
    stderrRef.value += chunk;
  });

  let socket = null;
  try {
    const browserWebSocket = await waitForDevTools(child, stderrRef);
    const port = new URL(browserWebSocket).port;
    const page = await findPageTarget(port);
    const cdp = await openCdp(page.webSocketDebuggerUrl);
    socket = cdp.socket;

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: true,
      screenWidth: width,
      screenHeight: height,
      screenOrientation: { type: 'portraitPrimary', angle: 0 },
    });
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });

    const url = `http://127.0.0.1:4173${path}`;
    const navigation = await cdp.send('Page.navigate', { url });
    if (navigation?.errorText) throw new Error(`Browser navigation failed for ${path}: ${navigation.errorText}`);
    await waitForNavigation(cdp.send, url);

    const expression = `(async () => {
      const deadline = performance.now() + ${Math.max(100, Number(budget) || 1800)};
      while (performance.now() < deadline) {
        if (${doneExpression}) break;
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      return document.documentElement.outerHTML;
    })()`;
    const evaluated = await cdp.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    }, Math.max(20000, budget + 5000));
    if (evaluated?.exceptionDetails) {
      throw new Error(`DOM evaluation failed for ${path}: ${evaluated.exceptionDetails.text || 'unknown exception'}`);
    }
    const html = evaluated?.result?.value;
    if (typeof html !== 'string') throw new Error(`DOM evaluation returned no HTML for ${path}`);
    return html;
  } finally {
    if (socket && socket.readyState <= WebSocket.OPEN) socket.close();
    if (child.exitCode === null && !child.killed) child.kill('SIGKILL');
    if (child.exitCode === null) {
      await Promise.race([
        new Promise((resolve) => child.once('close', resolve)),
        sleep(1000),
      ]);
    }
    await rm(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 }).catch(() => {});
  }
}
