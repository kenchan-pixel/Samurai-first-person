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

## Run 134 — Structured Closed Beta feedback triage

**Action type:** FEATURE

- Added optional `刀路 / 格擋 / STEP / 畫面 / 難度 / 其他` topic chips to the result 回報 panel and exported a selected topic as `範圍：…` through the existing player-triggered Web Share/clipboard path.
- Exact HEAD `b07d8787c864fb452ed47c4a5d0adca4d98a4731` passed CI #180 and exact-head Vercel.
- Same-head All Repos review `5118902876` then identified two actionable P2 findings: the extra exported `範圍` field is outside the approved Closed Beta feedback payload contract, and the new topic interaction is not specifically covered by the real 320×568 browser gate.

## Run 135 — Restore the approved Closed Beta feedback contract

**Date:** 2026-09-05  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `b07d8787c864fb452ed47c4a5d0adca4d98a4731`.
- Exact-head Actions CI #180 / run `33929779117` is terminal success and exact-head GitHub `Vercel` status is success. Draft PR #1 is open/Draft/unmerged; `main` is untouched; inline review threads are empty.
- Latest same-head review has no P0/P1 but two actionable P2 findings. The payload-contract mismatch is treated as blocking because it is a product/SOT correctness issue in the approved Closed Beta release boundary. There is no owner-approved SOT expansion authorising an additional exported structured field.

### Repair

- Reverted only `src/result-feedback.js` and `tests/result-feedback.test.mjs` to the previously accepted Run 133 feedback implementation from `ef144507f28fc744aabd0fb41196f3db225f8366`.
- Removed the unapproved topic chips, topic UI state and exported `範圍` line. This also removes the browser-coverage gap specific to that interaction rather than weakening the acceptance gate.
- Preserved the approved feedback contract: explicit 體驗意見 / 錯誤回報, player-typed note, already-visible result/mode/progress/score/summary, clean query/hash-free URL, native Web Share with clipboard fallback, cancellation as no-op, privacy disclosure and no account/persistence/analytics/background upload/network endpoint.
- No combat, renderer, input, balance, local-best schema or deployment code changed.

### Verification boundary

- The restored source/test pair is byte-for-byte the previously accepted `ef14450` implementation that passed the full Node/browser suite before Run 134. No acceptance threshold is changed.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` and exact-head Vercel success are still mandatory. The PR run comment is the authoritative post-commit receipt under the one-commit rule.

## Run 136 — Restore feedback no-persistence regression guard

**Date:** 2026-09-05  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `495eea6b1a21dd1baec6048bcdba739aec0032bd`.
- Exact-head Actions CI #181 / run `33932917422` and exact-head GitHub `Vercel` status are terminal success. Draft PR #1 is open/Draft/unmerged; `main` is untouched; inline review threads are empty and Vercel Preview feedback reports 0 unresolved items.
- Latest same-head Second Hourly review `5118991053` has no P0/P1/runtime defect but one actionable P2: Run 135 removed the focused source assertion that guarded the approved local/export-only feedback boundary against accidental browser persistence.

### Repair

- Kept the Run 135 runtime contract unchanged; no product code or feedback payload fields changed.
- Restored the focused source-level no-persistence regression guard in `tests/result-feedback.test.mjs` and extended it to forbid `localStorage`, `sessionStorage` and `indexedDB` references in the feedback module, alongside the existing `fetch` / XHR / beacon / WebSocket transport guards.
- This is intentionally a test-only blocker repair because the finding protects a material privacy boundary from silent future regression; it does not reintroduce the rejected structured topic/export feature.

### Verification boundary

- No acceptance threshold is weakened and no runtime behavior changes.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` and exact-head Vercel success are mandatory. The PR run comment is the authoritative post-commit receipt under the one-commit rule.

## Run 137 — Opponent stage-intro read profiles

**Date:** 2026-09-05  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `1ff1e9bdab859435141fc8cbb4e00daabaffdca6`.
- Exact-head Actions CI #182 / run `33935947767` is terminal success and exact-head GitHub `Vercel` status is success. Draft PR #1 is open/Draft/unmerged; `main` is untouched; inline review threads are empty; latest exact-head review `5119189042` reports no actionable P0/P1/P2; Preview feedback reports 0 unresolved items.
- Candidate scoring: **敵式 stage-intro read profiles 23/25** (impact 4, goal 5, novelty 4, confidence 5, safety 5); challenge post-wave threat forecast 19/25; Perfect-technique streak feedback 18/25. The first candidate wins because it strengthens the core read-the-opponent fantasy across every campaign/practice duel without touching balance or adding live-combat clutter.

### Feature

- Added a compact pointer-transparent **敵式 / 應對** card during the existing 1.55 s stage-intro only. Ashigaru teaches steady four-direction reading, Ronin warns that the first motion may be a feint, Oni highlights heavy tracking pressure, Shogun highlights mixed heavy/feint rhythm, and direct Blood Moon practice upgrades to a distinct tighter-pressure profile.
- The card is event-driven from the existing `stage-start`, direct-practice `boss-phase`, and `telegraph` events; it clears before the first live telegraph rather than observing a per-frame phase dataset. Challenge/今日陣 suppress it so their existing intro/banner surfaces remain unchanged.
- No attack definitions, timing, damage, posture, parry/Perfect/STEP, score, persistence, identifiers, analytics, network transport, renderer pose or input ownership changed.
- Added deterministic profile/privacy coverage and a focused real 320×568 browser gate for Ashigaru/Ronin/Oni/Shogun/Blood Moon copy, viewport bounds, pointer transparency, pre-telegraph cleanup and challenge quietness.

### Verification boundary

- The new pure profile tests were syntax-checked and exercised in an isolated Node harness before the Git object was created; repository-authoritative verification remains exact-head Actions after the single final commit.
- Post-commit `npm test`, complete `npm run test:browser` including `duel-read-profile-browser-smoke.mjs`, and exact-head Vercel success are mandatory. The PR run comment is the authoritative resulting-SHA receipt under the one-commit rule.

## Run 138 — Production-route 敵式 composition acceptance

**Date:** 2026-09-05  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `ef790c7e5b87a804d331beed97568d3518ce5a64`.
- Exact-head Actions CI #183 / run `33939625243` is terminal success and exact-head GitHub `Vercel` status is success. Draft PR #1 is open/Draft/unmerged; `main` is untouched and the inline PR comments endpoint is empty.
- Latest exact-head review `5119499034` has no P0/P1 but one actionable P2: Run 137's new player-visible 敵式 card is proven only in its isolated browser harness, so the gate does not prove safe composition with the real production stage-intro HUD/prompt at 320×568 or real challenge/今日陣 suppression. This is treated as a blocker because it is a mobile clarity/playability acceptance gap on the just-delivered player-visible slice.

### Repair

- Kept the Run 137 runtime and copy unchanged; no CSS, timing, balance or interaction behavior is altered.
- Extended the existing real-app `browser-smoke=combat-ux` contract. A real campaign start must now observe the Ashigaru 敵式 card during the actual 1.55 s stage-intro, prove it is in the 320×568 viewport, pointer-transparent, clear of the visible top HUD and Pause control, and prove the existing production combat prompt is non-visible under the current Combat UX contract rather than geometrically competing with the card.
- The same production path must observe the first real telegraph with the card already hidden, then launch the real `連戰試煉` and `今日陣` controls and prove the card remains suppressed in both modes before returning home.
- The focused Run 137 harness remains in place for all archetype/Blood Moon copy and event-specific coverage; this repair closes the missing production-composition seam instead of duplicating that focused matrix.

### Verification boundary

- No acceptance threshold is weakened and no gameplay/runtime product behavior changes. The strengthened production Combat UX smoke is expected to fail closed if the new card ever overlaps production chrome, blocks input, lingers into telegraph, or leaks into challenge/今日陣.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` and exact-head Vercel success are mandatory. The PR run comment is the authoritative resulting-SHA receipt under the one-commit rule.
