# Evolution Rules

## Purpose

Run a high-frequency, human-supervised autonomous product-evolution experiment. ChatGPT periodically reads the latest repository state, chooses the highest-value next action, implements it, verifies it, and keeps moving the playable game toward — and where justified beyond — the product goal.

## High-frequency operating model

- Cadence target: hourly.
- Persistent branch: `autonomous-evolution`.
- Persistent Draft PR: `autonomous-evolution` → `main`.
- Production baseline: `main`, changed only when Ken merges.
- One scheduled run = at most one final commit.
- One implementation commit = one Vercel Preview update once Git integration is connected.
- Do not create a new branch or PR per run.
- **Never merge the pull request.** Final merge remains Ken's manual gate.

## Priority order at the start of every run

1. Failed CI/checks or broken runtime/preview.
2. Unresolved blocker review threads/comments.
3. Material regressions against `CURRENT_BASELINE.md` or `REGRESSION_CHECKLIST.md`.
4. Only when the above are clear: one new high-value visible improvement.

While a blocker/regression exists, **new feature work is prohibited**.

A blocker includes an unresolved review thread or review/comment explicitly marked `BLOCKER`, plus any defect that breaks a baseline flow, causes data/security risk, makes the game unplayable, or causes CI/runtime failure.

## Required outcome per implementation run

Deliver one substantial visible vertical slice. Multiple coordinated file changes are allowed when needed to complete that slice.

Qualifying examples:

- a new enemy with complete attacks, behaviour, stage presentation, and verification;
- a posture/guard-break system with HUD, combat consequences, integration, and tests;
- a major combat-animation/camera feedback pass;
- a complete challenge mode with scoring and restart flow;
- a material blocker repair that restores a broken baseline flow.

Non-qualifying examples:

- colours, spacing, labels, or one icon;
- documentation-only work;
- refactoring without visible player benefit;
- tests without product behaviour;
- placeholders or disabled controls;
- splitting one obvious slice into tiny hourly changes to inflate run count.

## Selection process

When feature work is allowed:

1. Re-read Product Goal and Current Baseline.
2. Inspect actual gameplay/code, open PR review feedback, CI, backlog, and recent run history.
3. Generate at least three materially different candidate improvements.
4. Score 1–5 on visible impact, goal alignment, novelty, confidence, and regression/performance safety.
5. Choose the highest-value candidate that fits one bounded implementation run.
6. Avoid repeatedly optimising the same subsystem unless evidence justifies it.

## Commit discipline

- Stage all run changes conceptually before writing the final Git history.
- Use Git tree/blob/commit APIs where available so the run lands as one commit even when multiple files change.
- Commit message format: `evolution: <visible outcome>` or `fix: <blocker outcome>`.
- Update code, tests, relevant SOT, `evolution/state.json`, and run log in that same commit.
- If no qualifying implementation is made, leave Git unchanged.

## Deployment discipline

- Vercel Preview is the deploy target for `autonomous-evolution` once the repo is imported into Vercel.
- Do not deploy merely because an hourly schedule fired.
- A real implementation/blocker-fix commit should update the preview.
- Production deploy occurs only from `main` after Ken merges.
- Preview deployment is allowed before reviewer clearance because reviewers need the preview to find visual/mobile blockers.

## Verification

Before completing an implementation run:

- run repository tests;
- check the full regression checklist;
- inspect changed code for runtime/schema/security issues;
- perform a mobile-oriented browser/runtime check when tooling permits;
- verify the Draft PR remains open and unmerged;
- inspect deployment status when Vercel is connected.

## Required Draft PR run comment

For each implementation commit append one concise top-level PR comment:

- Run number / commit SHA
- Action type: `FEATURE`, `BLOCKER_FIX`, or `REGRESSION_FIX`
- Before
- After
- Verification
- Baseline regression result
- Known risk/limitations
- Preview deployment status/link when available

## Stop / hold conditions

Do not force a low-value change. If no safe qualifying improvement is available, or the next move requires a product/architecture decision that could materially redirect the game, leave the repo unchanged and report a Decision Gate in the Draft PR instead.
