import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Closed Beta direct-practice reconciliation stays session-only and reuses the canonical readiness renderer', async () => {
  const source = await readFile(new URL('../src/beta-readiness-practice-reconcile.js', import.meta.url), 'utf8');
  assert.match(source, /markBetaReadinessItem\('duel'\)/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /data-practice-progress-state/);
  for (const forbidden of ['localStorage', 'sessionStorage', 'fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket']) {
    assert.equal(source.includes(forbidden), false, `unexpected reconciliation transport/storage token: ${forbidden}`);
  }
});
