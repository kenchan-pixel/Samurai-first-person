import test from 'node:test';
import assert from 'node:assert/strict';
import { perfectTechniqueCueForEvent } from '../src/perfect-technique-cue.js';

test('Perfect Parry keeps a posture/clash identity instead of a generic auto-riposte cue', () => {
  const profile = perfectTechniqueCueForEvent({ type: 'perfect-parry', detail: { direction: 'top' } });
  assert.equal(profile?.kind, 'perfect-parry');
  assert.equal(profile?.title, 'PERFECT PARRY');
  assert.match(profile?.detail || '', /敵勢大增/);
  assert.match(profile?.detail || '', /自動返刀/);
});

test('Perfect STEP keeps evade/no-posture identity and handles closed openings', () => {
  const normal = perfectTechniqueCueForEvent({ type: 'counter', detail: { perfectStep: true, enemyHp: 3 } });
  assert.equal(normal?.kind, 'perfect-step');
  assert.equal(normal?.title, 'PERFECT STEP');
  assert.match(normal?.detail || '', /無敵勢/);
  assert.match(normal?.detail || '', /仲可掃屏/);

  const phaseShift = perfectTechniqueCueForEvent({ type: 'counter', detail: { perfectStep: true, bossPhase: 2, enemyHp: 6 } });
  assert.match(phaseShift?.detail || '', /BLOOD MOON/);
  assert.doesNotMatch(phaseShift?.detail || '', /仲可掃屏/);

  const defeat = perfectTechniqueCueForEvent({ type: 'counter', detail: { perfectStep: true, defeated: true, enemyHp: 0 } });
  assert.match(defeat?.detail || '', /擊倒/);
  assert.doesNotMatch(defeat?.detail || '', /仲可掃屏/);
});

test('normal parry/counter and Perfect Parry auto-riposte counter do not create duplicate technique identities', () => {
  assert.equal(perfectTechniqueCueForEvent({ type: 'parry', detail: {} }), null);
  assert.equal(perfectTechniqueCueForEvent({ type: 'counter', detail: { damage: 2 } }), null);
  assert.equal(perfectTechniqueCueForEvent({ type: 'counter', detail: { perfectRiposte: true, automatic: true } }), null);
});
