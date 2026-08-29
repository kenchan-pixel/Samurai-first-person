# Evolution Rules

## Purpose

Run a high-frequency, human-supervised autonomous product-evolution experiment. ChatGPT periodically reads the latest repository state, chooses the highest-value next action, implements it, verifies it, and keeps moving the playable game toward — and where justified beyond — the product goal.

Human supervision means owner feedback can redirect or override the system when supplied; it does **not** mean autonomous runs wait for manual testing or approval between bounded iterations.

## High-frequency operating model

- Cadence target: hourly.
- Persistent branch: `autonomous-evolution`.
- Persistent Draft PR: `autonomous-evolution` → `main`.
- Production baseline: `main`, changed only when Ken merges.
- One scheduled run = at most one final commit.
- One implementation commit = one Vercel Preview update once Git integration is connected.
- Do not create a new branch or PR per run.
- **Never merge the pull request.** Final merge remains Ken's manual gate.

## Exact-head verification fence

Before any new feature selection, resolve the exact current `autonomous-evolution` HEAD.

- Required CI and Vercel Preview for that exact SHA must both be terminal green.
- Missing, queued, or in-progress verification means `HOLD`; make no commit and start no feature work.
- Failed CI or Preview means `BLOCKER_FIX`.
- Never treat an older SHA's successful verification as evidence for the current HEAD.
- Missing human/device testing is not a HOLD condition.

## Review blocker semantics

Review findings are machine-operational gates, not dependent on one literal keyword.

- Any explicit `BLOCKER` finding blocks new feature work while applicable.
- Any unresolved P0/P1 finding from a human reviewer or the established PR-review automations blocks new feature work while it still applies, including findings posted against an earlier HEAD.
- Human/device feedback blocks only when it reports an actual applicable defect/regression. A request for future physical-device confirmation by itself is a limitation, not a blocker.
- Every actionable P2 finding must be inspected and explicitly dispositioned before feature selection. P2 blocks only when it represents material correctness, baseline-regression, security/privacy/data-loss, runtime, deployment, or playability risk.
- A review finding is cleared only when the current repository state demonstrably addresses it or a concise PR disposition explains why it no longer applies.

## Priority order at the start of every run

1. Enforce the exact-head verification fence.
2. Repair applicable unresolved review blockers/P0/P1 and blocking P2 findings.
3. Repair material regressions against `CURRENT_BASELINE.md` or `REGRESSION_CHECKLIST.md`.
4. Only when the above are clear: one new high-value visible improvement.

While a blocker/regression exists, or exact-head verification is not terminal green, **new feature work is prohibited**. Absence of a new human test does not create a blocker/regression.

## Required outcome per implementation run

Deliver one substantial visible vertical slice, or one material blocker/regression repair that restores the safety/correctness of the delivery loop, repository baseline, deployment, or playable game. Multiple coordinated file changes are allowed when needed to complete the action.

Qualifying examples:

- a new enemy with complete attacks, behaviour, stage presentation, and verification;
- a posture/guard-break system with HUD, combat consequences, integration, and tests;
- a major combat-animation/camera feedback pass;
- a complete challenge mode with scoring and restart flow;
- a material blocker repair that restores a broken baseline flow or unsafe autonomous gate.

Non-qualifying examples:

- colours, spacing, labels, or one icon;
- documentation-only work that is not repairing a material automation/delivery blocker;
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

- Vercel Preview is the deploy target for `autonomous-evolution`.
- Do not deploy merely because an hourly schedule fired.
- A real implementation/blocker-fix commit should update the preview.
- Production deploy occurs only from `main` after Ken merges.
- Preview deployment is allowed before reviewer clearance because reviewers need the preview to find visual/mobile blockers.
- The next feature run must not start until the previous exact HEAD's Preview is terminal green.

## Verification

Before completing an implementation run:

- run/inspect repository tests;
- check the full regression checklist;
- inspect changed code for runtime/schema/security issues;
- perform a mobile-oriented browser/runtime check when tooling permits;
- for visual/animation work, inspect the Preview using all self-observable evidence available: browser output, screenshots when supported, DOM/runtime/renderer-state instrumentation, transform/animation invariants and deterministic browser tests;
- if pixel-level inspection is unavailable, explicitly record that limitation and use the strongest remaining evidence rather than requesting a human test as a gate;
- verify the Draft PR remains open and unmerged;
- inspect exact-head CI and deployment status.

A recent iPhone remains the target design surface, but physical human-device testing is supplemental evidence only. When supplied, it can expose regressions that automation missed and must be acted on. Its absence must never stop bounded autonomous work.

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
- Review-finding disposition when the run handled reviewer feedback

## Stop / hold conditions

Do not force a low-value change. Missing/queued/in-progress exact-head verification is `HOLD` and must produce no commit. If no safe qualifying improvement is available, or the next move requires a material product/architecture/cost/privacy/licensing decision that could redirect the game, leave the repo unchanged and report a Decision Gate in the Draft PR instead.

Do not create a HOLD or Decision Gate solely because a human/device test has not happened yet.
