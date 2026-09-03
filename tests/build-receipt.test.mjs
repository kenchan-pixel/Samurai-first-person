import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReceiptFromEnv, buildReceiptPlugin } from '../tools/build-receipt.mjs';

test('build receipt prefers exact Vercel Git metadata', () => {
  const sha = '5b3859dd553d9cf25bde9c6e164b2ee8597cab8f';
  assert.deepEqual(buildReceiptFromEnv({
    VERCEL: '1',
    VERCEL_GIT_COMMIT_SHA: sha.toUpperCase(),
    VERCEL_GIT_COMMIT_REF: 'autonomous-evolution',
    GITHUB_SHA: 'a'.repeat(40),
  }), {
    schemaVersion: 1,
    commitSha: sha,
    branch: 'autonomous-evolution',
    provider: 'vercel',
  });
});

test('invalid or unavailable commit metadata fails closed as unknown', () => {
  assert.deepEqual(buildReceiptFromEnv({
    VERCEL: '1',
    VERCEL_GIT_COMMIT_SHA: 'not-a-sha',
    VERCEL_GIT_COMMIT_REF: 'autonomous-evolution',
  }), {
    schemaVersion: 1,
    commitSha: 'unknown',
    branch: 'autonomous-evolution',
    provider: 'vercel',
  });
});

test('vite plugin emits one root build-meta receipt with exact sha and branch', () => {
  const sha = '1'.repeat(40);
  const emitted = [];
  const plugin = buildReceiptPlugin({
    VERCEL: '1',
    VERCEL_GIT_COMMIT_SHA: sha,
    VERCEL_GIT_COMMIT_REF: 'autonomous-evolution',
  });

  plugin.generateBundle.call({ emitFile: (file) => emitted.push(file) });
  assert.equal(emitted.length, 1);
  assert.equal(emitted[0].type, 'asset');
  assert.equal(emitted[0].fileName, 'build-meta.json');
  assert.deepEqual(JSON.parse(emitted[0].source), {
    schemaVersion: 1,
    commitSha: sha,
    branch: 'autonomous-evolution',
    provider: 'vercel',
  });
});
