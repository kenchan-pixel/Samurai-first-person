# Evolution Run Log

This log is intentionally concise. Full diffs, exact SHAs, CI receipts and Preview links remain in Git history and Draft PR #1. Historical implementation details are protected by `docs/CURRENT_BASELINE.md` and `docs/REGRESSION_CHECKLIST.md`.

## Runs 000–020 — Core systems and renderer evolution

- Mobile-first first-person duel baseline, exact-head delivery fence, readable combat motion, posture/guard break, mastery, Crimson Shogun, Guided Duel, STEP/spacing, impact choreography and PlayCanvas production renderer.

## Runs 021–042 — Skinned character, directional combat and practice

- Local skinned samurai, stage silhouettes, real four-direction blade-tip paths, Perfect Parry/STEP, two-hand first-person grip, run analysis, direct practice and optional 刀路清晰.

## Runs 043–064 — Combat UX and authored animation pipeline

- Mobile Combat UX/Pause hardening, Shogun signature presentation, rejected broken runtime-joint override and recovery, authored Guard + four Attack* tracks, fixed Sword→HandR hierarchy, player-facing directional reads and optional 節拍提示 with deterministic browser verification.

## Runs 065–100 — Delivery recovery, challenge, dojo and Closed Beta share

- Player-screen RIGHT/LEFT semantics, actual-Sword afterimages, bounded Vercel recovery, handed STEP preference, eight-duel challenge, 氣勢/不屈, 今日陣, 戰前抉擇, 宿敵步速, Oni/Blood Moon practice, 四向防守, heavy-attack presentation, exact-head build receipt, late-telegraph parry buffer and explicit local result 分享 via Web Share/clipboard.

## Runs 101–119 — Closed Beta readiness and combat-read refinement

- Session-only 修行進度, explicit local/export-only feedback, 封測資訊 and 0/3 tester guide, local-record summary, weak-direction repeat coaching, 戰策回顧, measured/standard/quick attack-tempo presentation, accepted 50 ms Ronin authored feint crossfade and distinct Perfect Parry `破` / Perfect STEP `閃` identities.

## Runs 120–133 — Direction-aware first-person grip acceptance

- Added a four-direction two-hand support brace and a dedicated real 320×568 PlayCanvas grip gate covering support/handle/blade visibility, pommel→habaki attachment, projected blade extension and neutral return.
- Repaired TOP, RIGHT and BOTTOM portrait framing; corrected BOTTOM counter to a true rising cut; then cleared the remaining BOTTOM-parry blade occlusion with a support-only forearm tuck/splay while preserving blade path and combat rules.
- Run 133 exact HEAD `ef144507f28fc744aabd0fb41196f3db225f8366` passed CI #179, full browser acceptance and exact-head Vercel.

## Runs 134–160 — Closed Beta hardening, combat reads and repeat-play loops

- Restored the approved local/export-only feedback contract and privacy regression guard; added and production-hardened opponent **敵式 / 應對** reads plus same-route practice focus carry, truthful prior-target grading, Perfect-objective closure, three-run trend and session-only practice bests.
- Expanded challenge/今日陣 with actual-next-opponent scouting, immediate post-tactic outcome reflection, truthful 再戰重點, cumulative 無傷試煉 and lifecycle-safe retry labels while preserving combat/balance/persistence authority.
- Added pressured-guard body language, campaign **關鍵一刻**, explicit campaign/challenge/practice mode isolation and the Closed Beta result-level **下一步** flow. Replaced its synthetic acceptance with a real 320×568 production route and kept headless feedback export deterministic by stubbing only the platform-owned Web Share primitive while exercising the real production send path/payload/completion observer.
- Exact commit-level details and CI/Vercel receipts for Runs 134–160 remain in Git history and Draft PR #1; cumulative product/acceptance behavior remains protected by Current Baseline and Regression Checklist.

## Runs 161–165 — Export seam, combat feel and Closed Beta routing repair

- Run 161 kept the real Closed Beta production feedback path while replacing only the platform-owned Web Share primitive in headless acceptance; exact-head CI returned green.
- Run 162 added bounded player-visible enemy parry recoil for normal, Perfect and guard-break outcomes without changing combat authority; Run 163 added the session-only campaign **再戰目標** result loop.
- Runs 164–165 then stayed in `BLOCKER_FIX` after the real 320×568 Closed Beta flow began failing only at the first Ronin-practice result. Run 164 proved the failure was not simple test sampling latency by waiting for the exact semantic state; Run 165 made every authoritative practice-progress-state mutation re-render the existing Closed Beta action while keeping `comparison` as the only repeat-practice completion receipt.
- Incoming Run 165 exact HEAD `d199577120685a6f509860719406fd496ce7b98f` still passed **189/189** Node tests and every preceding browser gate, with exact-head Vercel success, but CI #211 / run `34014172660` remained red only at `data-beta-readiness-next-repeat=fail`. Full per-run details remain in Git history and Draft PR #1.

## Run 166 — Reconcile Closed Beta after a real direct-practice terminal

**Date:** 2026-09-06  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `d199577120685a6f509860719406fd496ce7b98f`.
- Exact-head GitHub `Vercel` status is terminal success, Draft PR #1 remains open/Draft/unmerged, `main` is untouched and inline review comments are empty, but Actions CI #211 / run `34014172660` is terminal failure. `npm test` is **189/189 green** and every browser gate before the real Closed Beta path passes.
- The real 320×568 flow reaches campaign terminal → starts real Ronin practice → reaches the first `ronin-practice` terminal, but the result-level `下一步` still does not settle on `repeat-practice + restart-button + 再練`. Run 164 already ruled out simple sampling latency and Run 165 already made every practice-progress-state mutation re-render, so feature work remains prohibited.

### Repair

- Added a narrow session-only direct-practice reconciliation adapter that reuses the canonical `markBetaReadinessItem('duel')` renderer path instead of duplicating beta progress/action logic.
- The adapter watches only result visibility, run mode and practice-progress state. On the next animation frame after those terminal mutations settle, an already-visible direct-practice result idempotently re-marks only the valid `duel` receipt, which forces the existing beta-readiness renderer to recompute `下一步`.
- It cannot complete `repeat-practice`; that still requires the existing authoritative `practiceProgressState=comparison`. Feedback still requires the real explicit export receipt, and challenge/今日陣 are excluded by direct-practice mode.
- Added one source-level regression test proving the adapter reuses the canonical readiness function and introduces no storage or network transport. The existing real-production 320×568 Closed Beta browser gate is unchanged/fail-closed.
- No combat timing, renderer, input, damage, posture, score, persistence, identifier, analytics, feedback transport, privacy or network authority changed.

### Verification boundary

- This is a blocker repair for terminal-order reconciliation, not a relaxed acceptance test or synthetic completion path.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` including the unchanged real-production Closed Beta gate, plus exact-head GitHub Vercel success, are mandatory. The PR run comment is authoritative for the resulting SHA/status under the one-commit rule.

## Run 167 — Use the authoritative practice retry receipt

**Date:** 2026-09-06  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `4b316430b97d71ea20e4ee584980a794e4b5706d`.
- Exact-head GitHub `Vercel` status is terminal success, Draft PR #1 remains open/Draft/unmerged, `main` is untouched and inline review threads are empty, but Actions CI #212 / run `34016636774` remains terminal failure.
- `npm test` is **190/190 green** and every earlier browser gate passes. The unchanged real 320×568 Closed Beta route still fails only after the first real Ronin-practice terminal, so feature work remains prohibited.

### Root cause and repair

- Run 166 still depended on `requestAnimationFrame` to decide when the direct-practice result had settled. That is a presentation-frame signal, not the authoritative semantic receipt for “same opponent can now be retried”.
- `practice-mode` already owns that semantic receipt by changing the existing `#restart-button` label to the same-opponent retry action only at a real terminal. Run 167 therefore makes the reconciliation adapter observe that existing retry-control mutation in addition to run mode, practice progress and result visibility.
- Reconciliation is now queued from `MutationObserver` delivery with `queueMicrotask`, then reuses only canonical `markBetaReadinessItem('duel')`. It still cannot complete `repeat-practice`; only `practiceProgressState=comparison` can do that. Challenge/今日陣 remain excluded.
- A compact session-only diagnostic snapshot records actual `runMode`, result visibility, practice-progress state and retry label if the exact-head production gate ever fails again. No persistence, telemetry or network transport is added.
- The source regression test now protects the authoritative retry receipt and explicitly rejects a return to render-frame-dependent reconciliation. The real 320×568 production gate itself is unchanged/fail-closed.

### Verification boundary

- No combat timing, renderer, input, balance, damage, posture, score, persistence, identifier, analytics, feedback transport or privacy authority changed.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser`, plus exact-head GitHub Vercel success, are mandatory. The PR run comment records the resulting one-commit verification outcome.

## Run 168 — Gate on the exact practice retry receipt

**Date:** 2026-09-06  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `8345e6bffc62ce9d0abe975caf51c28fbeb8d00f`.
- Exact-head GitHub `Vercel` status is terminal success; Draft PR #1 remains open/Draft/unmerged; `main` is untouched; inline review threads are empty. Actions run `34019356766` is terminal red only at the first real Ronin-practice Closed Beta result after **190/190 Node tests** and every earlier browser gate passed.
- Current-head review exposes the remaining P1 race: Run 167 observes `#restart-button`, but reconciliation never proves the observed mutation is the terminal retry mutation. Its queued microtask can be claimed by an earlier run-mode/result/progress mutation, causing the later authoritative retry mutation to be ignored. Feature work therefore remains prohibited.

### Root cause and repair

- Take the review-approved narrow repair instead of adding another timing layer: map each direct-practice run mode to the exact same-opponent retry label already owned by `practice-mode` (`再練浪人` / `再戰鬼武者` / `再戰將軍`).
- Reconciliation now runs directly on every observed run-mode, result-visibility or retry-label mutation. It only re-renders when the result is visible, the mode is direct practice, and the current retry label exactly matches the expected label for that mode.
- Remove `queueMicrotask` coalescing entirely, so an earlier non-terminal mutation cannot suppress the later authoritative retry-label mutation. The diagnostic snapshot now records actual and expected retry labels.
- It still only re-marks canonical `duel`; only `practiceProgressState=comparison` can complete `repeat-practice`. Challenge/今日陣 remain excluded. The real 320×568 production gate remains unchanged and fail-closed.
- No combat timing, renderer, input, balance, damage, posture, score, persistence, identifier, analytics, feedback transport, privacy or network authority changed.

### Verification boundary

- Post-commit exact-head Actions `npm test` + the complete browser suite, including the unchanged real-production 320×568 Closed Beta route, plus exact-head GitHub Vercel success are mandatory.
- If the production route is still red, no new feature is allowed; use the `mode/result/practice/retry/expectedRetry` snapshot as the next debugging authority rather than another timing guess.

## Run 169 — Surface the inner production failure receipt

**Date:** 2026-09-06  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `46df6c906e8d35aa858efecc20d085e6253a9ffc`.
- Exact-head GitHub `Vercel` status is terminal success, Preview feedback is 0 unresolved, Draft PR #1 remains open/Draft/unmerged, `main` is untouched and inline review threads are empty. Actions CI #214 / run `34022237452` remains terminal red after **190/190 Node tests** and every browser gate before the real Closed Beta route passed.
- The unchanged real 320×568 gate still fails only after the first real Ronin-practice terminal. The current-head P1 review explicitly rejects another timing/copy heuristic without evidence because CI dumps only the outer harness document; its P2 also notes that retry-label strings are a weak machine contract and omit Blood Moon.

### Blocker evidence repair

- Keep the production route and all completion assertions unchanged and fail-closed. Instead, make the CDP completion expression copy a compact **inner production receipt** into the outer harness only when the real gate has already failed.
- The receipt records the actual production `runMode`, `practiceProgressState` and route, reconciliation state/snapshot, Closed Beta progress, next step/target/visibility/hidden state/text, restart label and real result visibility.
- The smoke runner now includes that inner receipt directly in the thrown CI error before the outer DOM excerpt. This removes the current observability deadlock without mutating production DOM state, synthesizing completion, weakening the 1/3 → repeat-practice assertion, or adding storage/network telemetry.
- No combat, renderer, input, balance, damage, posture, score, readiness completion rule, persistence, identifier, analytics, feedback transport, privacy or network authority changed.

### Verification boundary

- Post-commit exact-head Actions remains authoritative. If the gate is still red, this run is expected to expose the exact inner mismatch needed for the next blocker repair; feature work remains prohibited until that evidence-driven repair returns the complete browser suite to green.
- Exact-head GitHub `Vercel` success remains the approved deployment signal when direct Vercel enumeration is unavailable. The PR run comment must record the resulting SHA, CI outcome, surfaced inner receipt and Preview status.
