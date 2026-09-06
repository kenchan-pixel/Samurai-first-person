const SHA40 = /^[0-9a-f]{40}$/i;

function firstText(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

export function buildReceiptFromEnv(env = process.env) {
  const rawSha = firstText(
    env.VERCEL_GIT_COMMIT_SHA,
    env.VITE_VERCEL_GIT_COMMIT_SHA,
    env.GITHUB_SHA,
    env.GIT_COMMIT_SHA,
  );
  const commitSha = SHA40.test(rawSha) ? rawSha.toLowerCase() : 'unknown';
  const branch = firstText(
    env.VERCEL_GIT_COMMIT_REF,
    env.VITE_VERCEL_GIT_COMMIT_REF,
    env.GITHUB_HEAD_REF,
    env.GITHUB_REF_NAME,
  ) || 'unknown';
  const provider = env.VERCEL === '1'
    ? 'vercel'
    : env.GITHUB_ACTIONS === 'true'
      ? 'github-actions'
      : 'local';

  return {
    schemaVersion: 1,
    commitSha,
    branch,
    provider,
  };
}

export function buildReceiptPlugin(env = process.env) {
  const receipt = buildReceiptFromEnv(env);
  return {
    name: 'samurai-build-receipt',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'build-meta.json',
        source: `${JSON.stringify(receipt, null, 2)}\n`,
      });
    },
  };
}
