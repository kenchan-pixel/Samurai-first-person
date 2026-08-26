# AGENTS.md

## Authority

1. Direct written instruction from Ken.
2. Repository-local product and engineering documents.
3. This file.
4. Normal engineering defaults.

## Delivery rules

- Mobile-first is mandatory. Primary acceptance is a recent iPhone in portrait orientation.
- Every product request is cumulative unless Ken explicitly removes a requirement.
- Preserve the current playable baseline before adding features.
- Do not merge pull requests. Final merge belongs to Ken.
- Do not replace the technology stack without a documented Decision Gate.
- Do not add login, payments, analytics, advertising, external tracking, paid APIs, or sensitive permissions without approval.
- Do not use copyrighted game assets, character likenesses, music, logos, or copied level designs.

## Normal feature work

- One task = one branch = one focused pull request.
- Do not push feature work directly to `main`.

## Scheduled autonomous-evolution exception

The recurring ChatGPT Scheduled Task is intentionally different from normal feature work:

- It always continues from the latest `autonomous-evolution` branch.
- It uses one long-lived Draft PR from `autonomous-evolution` to `main`.
- One scheduled run may produce **at most one final Git commit** after all file changes for that run are ready.
- Never create a new evolution branch or PR per hourly run.
- Never merge the Draft PR.
- Every successful implementation run must deliver one substantial, player-visible vertical slice or one material blocker/regression repair.
- Pure refactors, documentation-only changes, test-only changes, tiny style tweaks, placeholder controls, or low-value changes do not qualify unless they are part of a material blocker/regression repair.
- If there is any unresolved blocker, failed CI, material regression, or broken preview, repair that before starting a new feature.
- Resolve the exact current branch HEAD before feature selection. Required CI and Vercel Preview for that exact HEAD must both be terminal green. Missing, queued, or in-progress verification means **HOLD: no commit**. Failed verification means **BLOCKER_FIX**.
- Any unresolved P0/P1 finding from a human reviewer or the established PR-review automations blocks new feature work while the finding still applies, even if the review did not use the literal word `BLOCKER` or was posted against an earlier HEAD.
- Every actionable P2 finding must be inspected and explicitly dispositioned before feature selection. P2 blocks only when it represents material correctness, baseline-regression, security/privacy/data-loss, runtime, deployment, or playability risk.
- If a run only inspects/waits and makes no product code change or material blocker/regression repair, do not create a commit merely to prove the schedule ran.

Full protocol: `docs/SCHEDULED_TASK_PROMPT.md` and `docs/EVOLUTION_RULES.md`.

## Mandatory preflight

Before modifying code, read:

1. `docs/PRODUCT_GOAL.md`
2. `docs/CURRENT_BASELINE.md`
3. `docs/EVOLUTION_RULES.md`
4. `docs/REGRESSION_CHECKLIST.md`
5. `docs/IMPROVEMENT_BACKLOG.md`
6. `docs/SCHEDULED_TASK_PROMPT.md`
7. `evolution/state.json`
8. `evolution/RUN_LOG.md`

Then inspect current code, the long-lived Draft PR, unresolved review threads/comments, CI/checks, and latest deployment state.

## Definition of done

A run is complete only when:

- the improvement is visibly usable on mobile, or a material blocker/regression is actually repaired;
- all existing tests pass;
- the regression checklist has been checked;
- no browser runtime error is introduced;
- touch and mouse input still work;
- approved baseline behaviour is not silently removed;
- relevant SOT/log files are updated in the same final commit;
- the Draft PR receives a concise run comment with Before, After, verification, regression, risk, and preview/deployment status.
