# Scheduled Task Prompt — Autonomous Evolution

Use this as the canonical instruction for the recurring ChatGPT Scheduled Task.

## Goal

Continuously evolve `kenchan-pixel/Samurai-first-person` into a substantially better mobile-first first-person 3D samurai action game. Each implementation run must create a clearly player-visible improvement or repair a material blocker/regression. Detailed design is intentionally delegated to the agent; optimise toward the repository Product Goal and actual playable result rather than merely completing backlog items.

## Source of truth

At the start of every run, read the latest `autonomous-evolution` branch and the repository documents required by `AGENTS.md`. Inspect the long-lived Draft PR from `autonomous-evolution` to `main`, all unresolved review threads/comments/reviews, CI/check state, recent evolution log, and deployment state if Vercel is connected. Do not rely on previous-chat memory when repository evidence is available.

## Run decision

Apply this order strictly:

1. If CI/checks/runtime/preview are failing, repair the failure.
2. Else if an unresolved blocker exists, repair the highest-value coherent blocker group.
3. Else if a material baseline regression exists, repair it.
4. Else propose at least 3 materially different player-visible improvements, score them for impact / goal alignment / novelty / confidence / safety, and implement the strongest bounded vertical slice.

Never add a new feature while a blocker, failing CI, or material regression remains unresolved.

## Minimum work threshold

A qualifying implementation must be substantial enough that a player can clearly see or feel the difference. Do not spend a run on pure refactoring, documentation, tests alone, tiny CSS/text changes, placeholder UI, trivial balance changes, or artificially split micro-work.

A blocker fix counts as the run's action when it materially restores correctness or playability.

## Git / PR protocol

- Work only on the persistent `autonomous-evolution` branch.
- Maintain one persistent Draft PR to `main`; never create a new PR each hour.
- Never merge or close the PR unless Ken explicitly instructs it.
- Produce at most **one final Git commit per scheduled run**, containing all code/tests/SOT/log updates for that run.
- If the run makes no qualifying implementation, make no Git commit.
- Keep `main` untouched.

## Verification / deployment

Before committing, run/inspect all available tests and regression evidence. Protect mobile portrait input, first-person combat, directional parry/swipe behaviour, enemy progression, audio, and performance. Do not weaken tests to pass.

After a successful implementation commit, check CI and Vercel Preview deployment if connected. A preview may deploy before reviewer approval; production must remain tied to Ken merging `main`.

## Persistent state

Update `evolution/state.json` and `evolution/RUN_LOG.md` in the same implementation commit. Increment `run_number` only for a real implementation/blocker/regression-fix commit. Record the chosen action, action type, commit, tests, known risks, and next candidates. Update `docs/CURRENT_BASELINE.md`, backlog, and changelog when the delivered behaviour warrants it.

## Draft PR communication

After an implementation commit, add one concise PR comment with:

`Run N | FEATURE/BLOCKER_FIX/REGRESSION_FIX | <short outcome>`

Then Before, After, Verification, Regression, Risk, and Preview status/link.

If no qualifying implementation is safe, do not commit; leave a concise PR Decision Gate comment only when human input is genuinely required.

## Hard constraints

All prior approved requirements are cumulative. Do not silently delete functionality. Do not change the stack, introduce login/payment/analytics/tracking/paid APIs, or import copyrighted game assets without approval. Optimise for a maintainable, low-dependency web game and a smooth mobile experience.
