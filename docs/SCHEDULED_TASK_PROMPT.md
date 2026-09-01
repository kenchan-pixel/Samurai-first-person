# Scheduled Task Prompt — Autonomous Evolution

Use this as the canonical instruction for the recurring ChatGPT Scheduled Task.

## Goal

Continuously evolve `kenchan-pixel/Samurai-first-person` into a substantially better mobile-first first-person 3D samurai action game. Each implementation run must create a clearly player-visible improvement or repair a material blocker/regression. Detailed design is intentionally delegated to the agent; optimise toward the repository Product Goal and actual playable result rather than merely completing backlog items.

## Source of truth

At the start of every run, read the latest `autonomous-evolution` branch and the repository documents required by `AGENTS.md`. Inspect Draft PR #1 (`autonomous-evolution` → `main`), all unresolved review threads/comments/reviews, CI/check state, recent evolution log, and deployment state. Do not rely on previous-chat memory when repository evidence is available.

For Vercel, prefer direct project/deployment data when available. If the Vercel connector cannot enumerate the imported project, use GitHub's `Vercel` commit status on the current branch head as the authoritative deployment signal.

Human/device testing is auxiliary evidence only. Autonomous runs must not pause, HOLD, or request a Decision Gate merely because a fresh human/physical-iPhone test is unavailable. The agent must make the best bounded decision from available Preview/browser/runtime/screenshot/DOM/renderer-state/CI/test evidence. If later human feedback reveals a real regression, that evidence overrides the earlier automated conclusion and must be handled as a blocker/regression repair.

## Exact-head verification fence

Before selecting any new feature, resolve the exact current `autonomous-evolution` HEAD and inspect required CI plus Vercel Preview for that exact SHA.

- CI and Preview both terminal green → feature selection may continue if review/regression gates are also clear.
- CI or Preview missing, queued, or in progress → `HOLD`; make no commit and do not start feature work.
- CI or Preview failed → `BLOCKER_FIX`; repair before any feature work.

Do not infer success from an older SHA. Lack of human/device testing is not part of this HOLD fence.

### External deployment-provider recovery

A provider-capacity failure is different from a source/build/runtime regression, but it still blocks **FEATURE** work until a fresh exact-head Preview is green.

Treat a Vercel failure as an **external deployment blocker** only when all of the following are true:

- exact-head CI is terminal green;
- the Vercel status/target explicitly identifies provider capacity, deployment-rate-limit, quota, or equivalent account-side throttling rather than a source build/runtime error;
- there is no contradictory browser/runtime/review evidence that the game itself is broken.

Recovery rules:

- While the provider's stated retry/cooldown window is still active, `HOLD`; create no commit.
- After that window has elapsed, first try a same-SHA/provider-native redeploy when an authenticated tool safely supports it.
- If direct redeploy/enumeration is unavailable and the old failure status remains stale, **do not deadlock indefinitely**. One meaningful `BLOCKER_FIX` commit may repair/re-arm the delivery protocol and naturally trigger a fresh Preview. It must update the relevant SOT/state/run log in the same commit, must not contain unrelated feature work, and must never be an empty/log-only retry commit.
- The new commit then returns to the normal exact-head fence: its CI and Preview must both become terminal green before FEATURE work resumes.
- If the fresh deployment fails for an actual source build/runtime reason, inspect that failure and repair the source; do not classify it as external capacity.

This exception exists only to recover the delivery loop from a stale external-provider failure. It does not weaken the exact-head Preview requirement for feature work.

## Review gate

Inspect all PR review submissions, top-level comments, and inline threads, including findings posted against earlier HEADs.

- Any unresolved P0/P1 finding from a human reviewer or the established PR-review automations blocks new feature work while the finding still applies, even if it does not contain the literal word `BLOCKER`.
- Any explicit `BLOCKER` finding blocks new feature work while applicable.
- Human/device feedback blocks only when it reports an actual applicable defect/regression. A reviewer note that merely requests future/manual/physical-device confirmation is a limitation, not a blocker.
- Every actionable P2 must be inspected and explicitly dispositioned before feature selection. P2 blocks only when it represents material correctness, baseline-regression, security/privacy/data-loss, runtime, deployment, or playability risk.
- A finding is cleared only when the current repository state demonstrably addresses it or a concise PR disposition explains why it no longer applies.

## Run decision

Apply this order strictly:

1. Enforce the exact-head verification fence. Missing/queued/in-progress means `HOLD`; failed means `BLOCKER_FIX`, including the bounded external-provider recovery rule above when applicable.
2. Else repair any applicable unresolved review blocker/P0/P1, or blocking P2.
3. Else repair any material baseline regression.
4. Else propose at least 3 materially different player-visible improvements, score them for impact / goal alignment / novelty / confidence / safety, and implement the strongest bounded vertical slice.

Never add a new feature while a blocker, unverified/failed exact HEAD, broken preview, or material regression remains unresolved. Do not convert absence of human testing into a blocker.

## Minimum work threshold

A qualifying implementation must be substantial enough that a player can clearly see or feel the difference. Do not spend a run on pure refactoring, documentation, tests alone, tiny CSS/text changes, placeholder UI, trivial balance changes, or artificially split micro-work.

A material blocker/regression repair counts as the run's action when it restores the safety or correctness of the autonomous delivery loop, repository baseline, deployment, or playable game. A documentation/SOT change qualifies only when it directly repairs such a material delivery blocker; routine editorial cleanup does not.

## Outcome-first engineering discretion

Ken has delegated the detailed sequencing of testing, refactoring and continued improvement to the agent. Use that discretion to maximise playable outcomes rather than process volume.

- Treat tests as evidence, not as the product. Add only the smallest risk-proportionate verification needed for the changed behaviour and critical baseline; do not add tests merely to increase coverage or test count.
- Refactor only when it directly unlocks, simplifies or de-risks the current player-visible slice. Prefer incremental seams/adapters over broad rewrites.
- A run should not be consumed by a disposable spike when a bounded production-facing vertical slice can provide the same evidence.
- Preserve deterministic combat/timing logic independently from rendering/animation so visual upgrades do not silently change parry windows or encounter rules.
- The PlayCanvas-first 3D direction documented in `docs/3D_PIPELINE_DECISION_GATE.md` is approved for incremental implementation. The agent may introduce the approved renderer/build/asset pipeline without a new human gate, provided hard constraints remain satisfied.
- Stop for a new Decision Gate only when evidence would require changing the approved product direction, introducing material cost/privacy/licensing risk, removing cumulative behaviour, or adopting a substantially different stack than the approved 3D direction.
- A recent iPhone remains the design target, but human/device testing is supplemental. Use self-observed mobile browser/runtime/Preview evidence for autonomous acceptance; never wait for physical-device confirmation before continuing bounded work.

## Git / PR protocol

- Work only on the persistent `autonomous-evolution` branch.
- Maintain Draft PR #1 to `main`; never create a new PR each hour.
- Never merge or close the PR unless Ken explicitly instructs it.
- Produce at most **one final Git commit per scheduled run**, containing all code/tests/SOT/log updates for that run.
- Use Git blob/tree/commit APIs where available so multi-file changes land as one commit.
- If the run makes no qualifying implementation, make no Git commit.
- Keep `main` untouched.

## Verification / deployment

Before committing, inspect/run all available tests and regression evidence. Protect mobile portrait input, first-person combat, directional parry/swipe behaviour, enemy progression, audio, and performance. Do not weaken tests to pass.

Verification should be proportionate to the change. Reuse existing coverage when it already proves an unchanged path; add focused tests only for new high-risk behaviour or a regression that previously escaped. Do not build parallel test harnesses for the same behaviour without a concrete failure mode.

For visual/animation changes, the agent must inspect the Preview itself using every available self-observable channel: browser rendering, screenshots when supported, runtime/DOM/renderer-state instrumentation, animation/transform invariants and deterministic browser tests. If pixel-level inspection is unavailable in the current tool surface, record that limitation and use the strongest remaining self-verification; do not ask for a human test as a prerequisite to proceed.

After a successful implementation commit, inspect exact-head CI and Vercel Preview status. A preview may deploy before reviewer approval; production remains tied to Ken merging `main`.

## Persistent state

Update `evolution/state.json` and `evolution/RUN_LOG.md` in the same implementation commit. Increment `run_number` only for a real FEATURE / BLOCKER_FIX / REGRESSION_FIX commit. Record the chosen action, action type, tests, known risks, and next candidates. Update `docs/CURRENT_BASELINE.md`, backlog, and changelog when delivered behaviour warrants it.

Do **not** create a second commit merely to write the just-created commit SHA or post-commit CI/Preview result back into state. The PR run comment is the authoritative record of the new SHA and post-commit verification; state may record the previous confirmed SHA and a `pending` self-verification state until a later real implementation commit.

## Draft PR communication

After an implementation commit, add one concise PR comment with:

`Run N | FEATURE/BLOCKER_FIX/REGRESSION_FIX | <short outcome>`

Then Before, After, Verification, Regression, Risk, commit SHA, Preview status/link or Vercel status target, and disposition of any review finding handled by the run.

If no qualifying implementation is safe, do not commit; leave a concise PR Decision Gate comment only when a genuinely material product/architecture/cost/privacy/licensing decision is required. Never create a Decision Gate solely to request human testing.

## Hard constraints

All prior approved requirements are cumulative. Do not silently delete functionality. Do not change the stack outside an approved Decision Gate, introduce login/payment/analytics/tracking/paid APIs, or import copyrighted game assets without approval. Optimise for a maintainable, low-dependency web game and a smooth mobile experience.
