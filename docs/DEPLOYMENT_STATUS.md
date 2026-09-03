# Deployment Status

Last reconciled: 2026-09-03.

- Production branch: `main`.
- Preview branch: `autonomous-evolution`.
- Vercel team slug / ID: `kenchan-pixels-projects` / `team_qnmhvwQSVdB0ygoS9fw5lLtr`.
- Vercel project slug / ID: `samurai-first-person` / `prj_UC2Q7h9EPyVHEuzt3ZBOEzHid5cr`.
- Stable Preview alias: `https://samurai-first-person-git-autonom-9c4929-kenchan-pixels-projects.vercel.app`.

## Current integration condition

Incoming HEAD `5b3859dd553d9cf25bde9c6e164b2ee8597cab8f` has terminal-green CI #138, but GitHub currently returns no commit statuses for that SHA. Direct Vercel deployment enumeration returns `403 Forbidden`, and direct lookup of the known Preview alias returns `404 Deployment not found` through the connector, while the owner has independently confirmed that the Preview alias is reachable. The latest Vercel bot Preview receipt on PR #1 predates this HEAD, so it cannot prove exact-head identity.

This is a deployment-verification integration deadlock, not evidence that the Preview runtime itself is down.

## Exact-head fallback introduced by Run 095

Vite now emits `/build-meta.json` from Vercel's Git build metadata. When direct deployment lookup is unavailable and the GitHub `Vercel` status is **missing rather than failed**, the Scheduled Task may use this receipt as exact-head Preview evidence only when:

1. the Preview alias returns the receipt successfully;
2. `commitSha` is a valid 40-character SHA and equals the exact current `autonomous-evolution` HEAD;
3. `branch`, when available, equals `autonomous-evolution`.

Any missing/unknown/mismatched receipt remains `HOLD`. An explicit Vercel failure is never overridden by this fallback. See `docs/DEPLOYMENT.md` and the canonical Scheduled Task prompt.

A real implementation commit should normally produce one Vercel Preview update. Production remains controlled by Ken merging `main`.
