# Deployment — Vercel

## Intended topology

- GitHub `main` → Vercel Production.
- GitHub `autonomous-evolution` → continuously updated Vercel Preview.
- Long-lived Draft PR uses the Preview for mobile review and blocker discovery.

## Current prerequisite status

The Vercel account is connected on Hobby plan, but at setup time it has no Vercel projects. The available ChatGPT Vercel connector can inspect/deploy existing projects but does not expose Git-repository import/project-creation configuration. Therefore one Vercel dashboard import is still required.

## One-time Vercel dashboard import

Import GitHub repository:

`kenchan-pixel/Samurai-first-person`

Recommended settings:

- Framework Preset: Other / no framework.
- Production Branch: `main`.
- Root Directory: repository root.
- Build Command: leave empty/default (static app).
- Output Directory: repository root / default static output behaviour.
- Install Command: none required.
- Preview Deployments: enabled for branches / pull requests.

After import, push activity on `autonomous-evolution` should create/update Preview deployments; merges to `main` create Production deployments.

## High-frequency usage rule

Scheduled evolution targets one implementation commit per hourly run. Do not create multiple commits for individual files. Do not create empty/log-only commits just to trigger Vercel. This keeps deployment count bounded and makes every Preview deployment correspond to a meaningful code state.

## Review gate

Preview deployment is not blocked by review comments. It is evidence used by the reviewer. A blocker prevents **new feature work**, not preview creation. Production remains gated by Ken merging `main`.
