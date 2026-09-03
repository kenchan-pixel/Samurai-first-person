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

- Required CI and Vercel Preview for that exact SHA must both be terminal green before FEATURE work.
- Missing, queued, or in-progress verification means `HOLD`; make no commit and start no feature work.
- Failed CI or Preview means `BLOCKER_FIX`.
- Never treat an older SHA's successful verification as evidence for the current HEAD.
- Missing human/device testing is not a HOLD condition.

### Preview identity fallback

Use direct Vercel deployment data when it can identify the exact Git SHA. If direct deployment enumeration is unavailable, GitHub's exact-head `Vercel` commit status is the normal fallback.

If those integration channels are unavailable or the GitHub `Vercel` status is **missing rather than failed**, while the known Preview alias is reachable, `/build-meta.json` may be used as a fail-closed exact-head identity receipt. It is green only when its `commitSha` is a valid 40-character SHA exactly equal to the current `autonomous-evolution` HEAD and, when available, its `branch` equals `autonomous-evolution`.

A missing, `unknown`, malformed, stale or mismatched receipt remains `HOLD`. An explicit Vercel failure status is never overridden by the receipt. This fallback verifies which commit the Preview alias is actually serving; it does not waive CI, review, runtime, regression, security or browser gates. See `docs/DEPLOYMENT.md`.

### External deployment-provider failure recovery

An explicitly external provider-capacity failure remains a feature blocker, but it must not permanently deadlock the branch.

Classify a failed Vercel status as external only when exact-head CI is terminal green and the Vercel status/target identifies deployment rate limiting, provider capacity, quota, or equivalent account-side throttling rather than source build/runtime failure. If browser/runtime/review evidence contradicts that classification, treat the game/source defect as authoritative.

Persist every external-provider recovery incident in `evolution/state.json` under `external_deployment_recovery.last_incident`, including at minimum `provider`, `incident_key`, `failure_kind`, `blocked_head`, `status_target`, `first_seen_at`, `cooldown_until`, `rearm_attempted`, `rearm_head`, and `resolution`.

The **same incident** is the continuous failure lineage for the same provider/failure class without an intervening terminal-green exact-head Preview. A re-arm commit's new SHA does not create a new incident. Only an intervening terminal-green exact-head Preview, or materially different provider evidence proving a different failure class, may establish a new incident.

- During the provider's stated retry/cooldown window: `HOLD`, no commit.
- After the window expires: first use a same-SHA/provider-native redeploy when an authenticated tool safely supports it.
- If direct redeploy/enumeration is unavailable and the old external failure status remains stale, one meaningful `BLOCKER_FIX` commit may repair/re-arm the delivery protocol and naturally trigger a fresh Preview. It must include the relevant SOT/state/run-log repair, contain no unrelated feature work, and must not be an empty/log-only retry commit.
- The re-arm commit must set `rearm_attempted: true` in its durable incident receipt. `rearm_head` may be `pending-current-commit` because the commit cannot know its own SHA; reconcile that field only in the next real implementation commit, never through a bookkeeping-only commit.
- If `rearm_attempted` is already true and the re-arm HEAD again fails for the **same incident**, `HOLD`: do not create another SOT/state/log retry commit. Wait for same-SHA/provider-native recovery or materially new provider/failure evidence.
- The fresh commit immediately returns to the ordinary exact-head fence. FEATURE work is still prohibited until its CI and Preview are terminal green.
- A fresh source build/runtime failure is not an external-capacity exception and must be repaired normally.
- A terminal-green exact-head Preview resolves the incident. The PR run comment is authoritative for the post-commit result; state may be reconciled in the next real implementation commit rather than generating a second commit.

This is a delivery-loop recovery rule, not a relaxation of Preview acceptance.

## Review blocker semantics

Review findings are machine-operational gates, not dependent on one literal keyword.

- Any explicit `BLOCKER` finding blocks new feature work while applicable.
- Any unresolved P0/P1 finding from a human reviewer or the established PR-review automations blocks new feature work while it still applies, including findings posted against an earlier HEAD.
- Human/device feedback blocks only when it reports an actual applicable defect/regression. A request for future physical-device confirmation by itself is a limitation, not a blocker.
- Every actionable P2 finding must be inspected and explicitly dispositioned before feature selection. P2 blocks only when it represents material correctness, baseline-regression, security/privacy/data-loss, runtime, deployment, or playability risk.
- A review finding is cleared only when the current repository state demonstrably addresses it or a concise PR disposition explains why it no longer applies.

## Priority order at the start of every run

1. Enforce the exact-head verification fence, including the bounded external-provider recovery rule when applicable.
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

A SOT/documentation change is qualifying only when it directly repairs a material automation or delivery blocker, such as an exact-head verification deadlock. Routine editorial cleanup is not an implementation run.

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
- External Vercel rate-limit/capacity failures use the bounded recovery protocol above; they never authorize feature work on an unverified head.

## Verification

Before completing an implementation run:

- run/inspect repository tests;
- check the full regression checklist;
- inspect changed code for runtime/schema/security issues;
- perform a mobile-oriented browser/runtime check when tooling permits;
- for visual/animation work, inspect the Preview using all self-observable evidence available: browser output, screenshots when supported, DOM/runtime/renderer-state instrumentation, transform/animation invariants and deterministic browser tests;
- if pixel-level inspection is unavailable, explicitly record that limitation and use the strongest remaining evidence rather than requesting a human test as a gate;
- verify the Draft PR remains open/Draft/unmerged;
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

Do not force a low-value change. Missing/queued/in-progress exact-head verification is `HOLD` and must produce no commit. A failed exact-head verification is `BLOCKER_FIX`; an explicitly external Vercel rate-limit/capacity failure may use the bounded recovery protocol above after its cooldown expires. If no safe qualifying improvement is available, or the next move requires a material product/architecture/cost/privacy/licensing decision that could redirect the game, leave the repo unchanged and report a Decision Gate in the Draft PR instead.

Do not create a HOLD or Decision Gate solely because a human/device test has not happened yet.
