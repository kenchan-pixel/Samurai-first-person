import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Closed Beta direct-practice reconciliation uses the authoritative retry terminal receipt', async () => {
  const source = await readFile(new URL('../src/beta-readiness-practice-reconcile.js', import.meta.url), 'utf8');
  assert.match(source, /markBetaReadinessItem\('duel'\)/);
  assert.match(source, /#restart-button/);
  assert.match(source, /observer\.observe\(restart, \{ childList: true/);
  assert.match(source, /queueMicrotask/);
  assert.match(source, /data-practice-progress-state/);
  assert.match(source, /terminal-authority/);
  assert.equal(source.includes('requestAnimationFrame'), false, 'terminal reconciliation must not depend on render-frame delivery');
  for (const forbidden of ['localStorage', 'sessionStorage', 'fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket']) {
    assert.equal(source.includes(forbidden), false, `unexpected reconciliation transport/storage token: ${forbidden}`);
  }
});
