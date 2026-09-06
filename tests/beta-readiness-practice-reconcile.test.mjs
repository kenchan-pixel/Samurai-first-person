import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Closed Beta direct-practice reconciliation waits for the exact practice-mode retry receipt', async () => {
  const source = await readFile(new URL('../src/beta-readiness-practice-reconcile.js', import.meta.url), 'utf8');
  assert.match(source, /'ronin-practice': '再練浪人'/);
  assert.match(source, /'oni-practice': '再戰鬼武者'/);
  assert.match(source, /'shogun-practice': '再戰將軍'/);
  assert.match(source, /retryLabel !== expectedRetryLabel/);
  assert.match(source, /markBetaReadinessItem\('duel'\)/);
  assert.match(source, /observer\.observe\(restart, \{ childList: true/);
  assert.match(source, /terminal-retry-match/);
  assert.equal(source.includes('queueMicrotask'), false, 'exact retry mutation must not be coalesced behind an earlier non-terminal mutation');
  assert.equal(source.includes('requestAnimationFrame'), false, 'terminal reconciliation must not depend on render-frame delivery');
  for (const forbidden of ['localStorage', 'sessionStorage', 'fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket']) {
    assert.equal(source.includes(forbidden), false, `unexpected reconciliation transport/storage token: ${forbidden}`);
  }
});
