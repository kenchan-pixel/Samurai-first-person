# AGENTS.md

## Active owner control — PAUSED_BY_OWNER

Ken explicitly requested on 2026-09-06: **pause autonomous development** and merge once only if there are no unresolved review issues. This owner instruction takes precedence over all normal evolution rules below.

- Autonomous development is paused until Ken explicitly resumes it. Scheduled invocations must stop after reading this control; do not implement features, repair blockers, refactor, create commits, trigger deployments or merge automatically.
- A recurring "Run the autonomous evolution loop" prompt is not an instruction to resume. Existing failed CI or review findings do not override this owner-directed pause.
- Read-only reviews/inspection remain permitted. Do not disable GitHub CI, delete the branch, close PR #1, or alter unrelated scheduled tasks.
- The requested one-time merge was not performed: product HEAD `eaa8ce49181070da7e7a7fc095d78badef2b3698` has an unresolved P1 finisher-grip finding and failed CI #221. `main` must remain unchanged; no automatic merge has been queued.
- This control is a repository-level stop guard, not a claim that the ChatGPT scheduler switch was disabled. That switch was unavailable in the handling session. See the owner-control receipt at the top of `docs/SCHEDULED_TASK_PROMPT.md`.

## Authority

1. Direct written instruction from Ken.
2. Repository-local product and engineering documents.
3. This file.
4. Normal engineering defaults.

## Delivery rules

- Mobile-first is mandatory. Primary acceptance target is a recent iPhone in portrait orientation, but autonomous runs must verify with the strongest self-observable evidence available and must not wait for a human device test.
- Every product request is cumulative unless Ken explicitly removes a requirement.
- Preserve the current playable baseline before adding features.
- Do not merge pull requests. Final merge belongs to Ken.
- Do not replace the technology stack without a documented Decision Gate.
- An approved Decision Gate may be executed incrementally without asking again for each internal refactor/test/migration step; stop for human input only if the approved assumptions, hard constraints, licensing/cost/privacy boundary, or product direction materially changes.
- Human/device testing and owner visual feedback are supplemental evidence, never a prerequisite for autonomous continuation. When supplied, they can reveal or override a mistaken automated conclusion and trigger a blocker/regression repair; their absence alone must never cause HOLD or a Decision Gate.
- The agent must inspect the Preview/runtime itself using available browser, screenshot, DOM/runtime, CI, renderer-state and deterministic test evidence. If one evidence channel is unavailable, use the strongest remaining evidence and continue with a bounded, reversible decision rather than asking for a human test.
- Testing and refactoring are supporting tools, not delivery goals. Prefer the smallest risk-proportionate verification set that proves the changed behaviour and protects the critical playable baseline. Do not inflate test count or spend an evolution run on test/refactor-only work unless it repairs a material blocker/regression.
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
- Human/device feedback blocks only when it reports an actual applicable defect/regression; the lack of a fresh human re-test is never itself an unresolved blocker.
- Every actionable P2 finding must be inspected and explicitly dispositioned before feature selection. P2 blocks only when it represents material correctness, baseline-regression, security/privacy/data-loss, runtime, deployment, or playability risk.
- If a run only inspects/waits and makes no product code change or material blocker/regression repair, do not create a commit merely to prove the schedule ran.

Full protocol: `docs/SCHEDULED_TASK_PROMPT.md` and `docs/EVOLUTION_RULES.md`.

## Mandatory preflight

Before modifying code, read:

1. `docs/PRODUCT_GOAL.md`
2. `docs/CURRENT_BASELINE.md`
3. `docs/CLOSED_BETA_V0_5_BASELINE.md`
4. `docs/EVOLUTION_RULES.md`
5. `docs/REGRESSION_CHECKLIST.md`
6. `docs/IMPROVEMENT_BACKLOG.md`
7. `docs/SCHEDULED_TASK_PROMPT.md`
8. `evolution/state.json`
9. `evolution/RUN_LOG.md`

Then inspect current code, the long-lived Draft PR, unresolved review threads/comments, CI/checks, and latest deployment state.

## Definition of done

A run is complete only when:

- the improvement is visibly usable on mobile through available self-verification evidence, or a material blocker/regression is actually repaired;
- all existing tests pass;
- the regression checklist has been checked;
- no browser runtime error is introduced;
- touch and mouse input still work;
- approved baseline behaviour is not silently removed;
- relevant SOT/log files are updated in the same final commit;
- the Draft PR receives a concise run comment with Before, After, verification, regression, risk, and preview/deployment status.
