import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const files = {
  rules: new URL('../docs/EVOLUTION_RULES.md', import.meta.url),
  prompt: new URL('../docs/SCHEDULED_TASK_PROMPT.md', import.meta.url),
  state: new URL('../evolution/state.json', import.meta.url),
};

function assertRecoveryContract(text, label) {
  assert.match(text, /external_deployment_recovery/i, `${label} must name the durable recovery receipt`);
  assert.match(text, /rearm_attempted/i, `${label} must gate the one re-arm attempt`);
  assert.match(text, /same incident[\s\S]{0,500}HOLD/i, `${label} must HOLD repeated failures from the same incident`);
  assert.match(text, /intervening[\s\S]{0,240}terminal[- ]green/i, `${label} must require a green Preview boundary before a new incident`);
}

test('external deployment recovery is durably bounded to one re-arm per incident', async () => {
  const [rules, prompt, stateText] = await Promise.all([
    readFile(files.rules, 'utf8'),
    readFile(files.prompt, 'utf8'),
    readFile(files.state, 'utf8'),
  ]);

  assertRecoveryContract(rules, 'Evolution Rules');
  assertRecoveryContract(prompt, 'Scheduled Task Prompt');

  const state = JSON.parse(stateText);
  const receipt = state.external_deployment_recovery?.last_incident;
  assert.ok(receipt, 'state must persist the last external deployment incident receipt');

  for (const key of [
    'provider',
    'incident_key',
    'failure_kind',
    'blocked_head',
    'status_target',
    'first_seen_at',
    'cooldown_until',
    'rearm_attempted',
    'rearm_head',
    'resolution',
  ]) {
    assert.ok(Object.hasOwn(receipt, key), `external deployment incident receipt missing ${key}`);
  }

  assert.equal(typeof receipt.rearm_attempted, 'boolean');
  if (receipt.rearm_attempted) {
    assert.match(receipt.rearm_head, /^(?:[0-9a-f]{40}|pending-current-commit)$/);
  }
  assert.match(receipt.resolution, /^(?:pending|success|same-incident-hold)$/);
});
