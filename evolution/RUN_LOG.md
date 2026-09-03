# Evolution Run Log

This log is intentionally concise. Full diffs, exact SHAs, CI receipts and Preview links remain in Git history and Draft PR #1. Historical long-form entries are compacted after their acceptance; no product rule is removed from `docs/CURRENT_BASELINE.md` or `docs/REGRESSION_CHECKLIST.md`.

## Runs 000–020 — Core systems and renderer evolution

- Run 000 baseline: mobile-first first-person duel, directional parry/swipe combat, three enemies, progression, tests and SOT.
- Runs 001–003: exact-head CI/Vercel fence, readable combat motion and renderer/WebGL correctness/browser smoke.
- Runs 004–010: posture/guard break, mastery/local best, Crimson Shogun and Guided Duel with integration/reduced-motion repairs.
- Runs 011–020: spacing/STEP, impact choreography, wider framing, elapsed-time four-beat motion, dropped-frame recovery, PlayCanvas production renderer and real combat-motion browser contract.

## Runs 021–042 — Skinned character, mobile combat and practice

- Runs 021–025: local 19-joint skinned samurai GLB, animation binding, directional body reads and four stage silhouettes.
- Runs 026–029: physical-phone readability repair, real four-direction blade-tip paths, Perfect Parry riposte and Blood Moon integrity.
- Runs 030–034: phone-first guide/Ronin lesson, exact-head clarity repairs, Perfect STEP and phase-priority repair.
- Runs 035–038: first-person two-hand grip, local post-run analysis and denominator/damage repairs.
- Runs 039–042: repeatable Ronin/Shogun practice, practice browser verification and optional 刀路清晰.

## Runs 043–064 — Combat UX, animation repair and timing assist

- Runs 043–051: mobile Combat UX simplification, true Pause clock, repeated exact-head production-browser hardening, Shogun signature motion and top-right Pause restoration.
- Run 052 rejected after physical-phone evidence exposed collapsed body/arm/blade hierarchy; Run 053 restored the pre-052 usable enemy-animation baseline; Run 054 removed mistaken mandatory-human-test HOLD semantics.
- Runs 055–061: authored AttackTop/Right/Bottom/Left, continuous Attack* playback, fixed HandR/Sword hierarchy, lateral-read repair, same-draw pose evaluation and bounded forward commitment.
- Runs 062–064: optional 節拍提示 plus disabled-path DOM-idle and deterministic browser-harness repair.

## Runs 065–089 — Blade semantics, delivery recovery, handedness, challenge and dojo

- Runs 065–069: player-facing Guard/directional cut semantics, semantic SOT smoke, actual-Sword afterimages and live reduced-motion cleanup.
- Runs 070–072: bounded one-shot Vercel capacity recovery and architecture SOT reconciliation with PlayCanvas + Vite primary and WebGL2 fallback.
- Runs 073–074: persistent STEP handedness, left-side clipping repair and true 320×568 production input gate.
- Runs 075–086: eight-duel 連戰試煉, momentum, 今日陣, tactical choice, rematch visual identity and per-wave split records with lifecycle/browser repairs.
- Runs 087–089: direct Oni/Blood Moon practice and 師範弱點再練 routing while preserving campaign best and combat authority.

## Runs 090–098 — Production acceptance and owner-feedback repairs

- Run 090 rejected when the production document gate proved the real 練血月 control could fail despite direct request-API tests; Run 091 repaired practice Start ownership and real Blood Moon launch/retry/campaign handoff at 320×568.
- Run 092 added local result-only 四向防守 analysis; Run 093 repaired normal practice capture under the Blood Moon adapter.
- Run 094 added presentation-only heavy-attack weighting. Run 095 repaired the exact-head Preview identity deadlock with a fail-closed `/build-meta.json` receipt while preserving CI/Vercel authority.
- Run 096 moved default STEP into the approved lower-right safe corner and proved Bottom/Left canvas input plus STEP pointer ownership at 320×568; exact-head CI/Vercel were green.
- Run 097 closed the heavy-attack P2 with a true 320×568 real-PlayCanvas Oni heavy sequence and normal-Ashigaru neutrality gate; exact-head CI/Vercel were green.
- Run 098 added the bounded 60–110 ms near-contact final-direction guard commitment. It resolves only at strike contact as a normal non-Perfect parry; early telegraph, unresolved feints and wrong directions remain rejected. Exact-head `547b99208eddd6c621660ca44fd5e21bbdfcac4a` passed CI #144 and Vercel.

## Runs 099–100 — Choreography continuity and first release-prep surface

- Run 099 refined deterministic authored `AttackTop` / `AttackBottom` into connected cross-body vertical cuts while retaining the shared Guard, fixed Sword→HandR grip, player-facing contact path and unchanged combat authority. Exact-head `337c110e7235bfcbd168d2df098fd1b3f84c49b6` passed CI #145 and Vercel.
- Run 100 added the local/player-triggered **分享** action to campaign/practice/challenge/今日陣 terminal results. Native Web Share uses only already-visible result text plus a clean game URL; unsupported share falls back to clipboard. Exact-head `0ffa84f6ec02fada1fa8c45538075fa084e69ddd` passed CI #146 and Vercel. No account, identifier, persistence, analytics or gameplay backend was introduced.

## Run 101 — Same-opponent practice progress

**Date:** 2026-09-03  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `0ffa84f6ec02fada1fa8c45538075fa084e69ddd`.
- Exact-head GitHub Actions CI #146 / run `33767801127` is terminal **success** and exact-head GitHub `Vercel` status is terminal **success**.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, inline review threads are empty, and the latest exact-head review reports no actionable P0/P1/P2.
- Current SOT says another balance change needs repeated Ronin/Oni/Shogun/Blood Moon evidence. A pure evidence-only run would not qualify for a commit, so candidates were scored for player-visible value that strengthens that loop without pre-empting the privacy/data gate: (1) same-opponent practice progression 23/25; (2) Perfect Parry/STEP visual distinction 20/25 without a current confusion signal; (3) remote Closed Beta feedback/bug reporting 18/25 but still SOT/privacy-gated. Candidate 1 won.

### Implementation

- Added `src/practice-progress.js`, a result-only adapter that observes the same authoritative combat events into a separate in-memory analysis session. It stores only one previous snapshot per direct-practice route for the current page session.
- The first Ronin/Oni/Shogun/Blood Moon practice completion shows a compact **修行進度** prompt to repeat that opponent once. A later completion against the same route compares the current four-direction defense rate, hits taken and manual-counter conversion with the immediately previous attempt and labels the overall trend as **有進步 / 大致持平 / 再磨一局**.
- Comparison inputs are derived from existing authoritative `strike`, parry, successful STEP, `player-hit` and manual-counter outcomes. Page refresh clears the snapshots; each practice route is isolated; campaign/challenge terminals hide the row.
- No enemy definition, timing, damage, Perfect/parry/STEP rule, score, mastery grade, campaign/challenge best, renderer, storage key, account, identifier, analytics, telemetry, backend or network request changed.

### Self-verification boundary

- Added deterministic Node tests for snapshot derivation, improvement/regression deltas and unavailable counter-rate handling.
- Extended the existing focused 320×568 run-analysis browser gate: it retains the four-way defense/weakest-direction and eight-stage omission checks, then completes the same direct practice twice and requires the first-repeat prompt, expected `防守 +50% · 受擊 −1 · 反擊 ±0%` comparison and an in-bounds result row.
- This execution surface has no local repository/browser checkout; exact-head GitHub CI (`npm test` + full `npm run test:browser`) and exact-head Vercel Preview are therefore the post-commit acceptance gate. The PR run comment records final receipts; no second bookkeeping commit is allowed.

## Run 102 — Practice-progress selector/isolation repair

**Date:** 2026-09-04  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `e059ced77444b1b4a95b047998606fd31b6c4e1c`.
- Exact-head Vercel status is terminal **success**, but CI #147 / run `33773856599` is terminal **failure** in `npm run test:browser`; `npm test` passed.
- Latest exact-head review confirms one actionable blocking P2: the injected style and visible 修行進度 row both used `data-practice-progress`, so `hideProgress()` and the browser harness selected the `<style>` element first. Besides breaking CI, this could leave the visible practice-progress row on a later campaign/challenge result.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, and inline review threads are empty. New feature work is prohibited until this blocker is repaired.

### Implementation

- Split DOM ownership: injected CSS now uses `data-practice-progress-style`; the visible result row uses the unique `data-practice-progress-row` marker.
- Scoped `hideProgress()` to `#result-analysis [data-practice-progress-row]`, so cleanup can no longer be intercepted by the style node.
- Updated the focused 320×568 browser harness to select the real result row, preserve the first/repeat comparison assertions, then emit a normal campaign result after practice and require the row plus practice root-state markers to clear.
- No combat timing, damage, parry/Perfect/STEP rules, score, route-history semantics, persistence, renderer, account/identifier, analytics, backend or network behavior changed.

### Verification boundary

- Pre-commit review is source-level because this execution surface has no local repository/browser checkout.
- Exact-head GitHub CI (`npm test` + complete `npm run test:browser`) and exact-head Vercel Preview remain the authoritative post-commit gates. The PR run comment records the new SHA and final receipts; no second bookkeeping commit is permitted.

## Run 103 — Closed Beta feedback / bug-report export

**Date:** 2026-09-04  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `9368b7ed371bd3b21479e2c59d1ec308510c2978`.
- Exact-head Actions run `33778427313` is terminal **success** after a transient first Chromium startup timeout; exact-head GitHub `Vercel` status is terminal **success**.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, inline review threads are empty, and the latest exact-head review reports **no actionable P0/P1/P2**.
- Balance changes remain evidence-gated. Ken's approved next direction is Closed Beta release prep, but remote accounts/leaderboards/feedback ingestion/telemetry still need a privacy/data Decision Gate. The highest-value safe slice is therefore an explicit local/export-only tester feedback path plus a durable v0.5 data boundary.

### Implementation

- Added mandatory `docs/CLOSED_BETA_V0_5_BASELINE.md` and wired it into `AGENTS.md` preflight. It records the approved local/export-only release-prep boundary and explicitly blocks server-stored identities, cloud leaderboard, remote feedback ingestion and telemetry until a separate privacy/data Decision Gate defines fields, retention/deletion, visibility, abuse controls and hosting/cost ownership.
- Added a compact **回報** action to terminal result surfaces. Testers can choose **體驗意見** or **錯誤回報**, type up to 800 characters and explicitly export the report through native Web Share; unsupported share falls back to local clipboard.
- Exported context is limited to already-visible result/mode/progress/score/summary, the player's typed note and a query/hash-free game URL. The panel states that the game does not automatically upload the report. No user agent, hidden device data, identifier, storage record, analytics event, backend or background network request is added.
- Existing **分享** remains unchanged and independently usable.

### Verification boundary

- Added Node coverage for structured report content, URL sanitisation, note bound, native share, clipboard fallback/cancellation, and a source guard that rejects automatic upload transports in the feedback module.
- Extended the existing result-actions browser gate at true 320×568: both share and feedback controls must remain ≥44 px/in bounds; the feedback panel must remain inside the viewport, show the no-auto-upload disclosure, export a structured bug report with the player note through the local clipboard fallback, and close cleanly back to the terminal result.
- Exact-head GitHub CI (`npm test` + full `npm run test:browser`) and exact-head Vercel Preview are the post-commit acceptance gates. The PR run comment records the new SHA and final receipts; no second bookkeeping commit is permitted.

## Run 104 — Closed Beta tester guide / release-readiness surface

**Date:** 2026-09-04  
**Action type:** RELEASE_PREP

### Preflight

- Incoming exact HEAD: `8c8fc6fbced3465246f4f0e6209adf12e60f7959`.
- Exact-head Actions CI #149 / run `33785837788` is terminal **success** and exact-head GitHub `Vercel` status is terminal **success**.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, inline review threads are empty, and the latest applicable review history has no unresolved P0/P1/P2 blocker.
- Three eligible next actions were scored: (1) bounded Closed Beta tester/privacy guide 24/25; (2) local personal-record summary 20/25 but adds more storage-facing UI; (3) repeated-practice acceptance 19/25 because this execution surface cannot produce stronger subjective device evidence by itself. Candidate 1 won and stays fully inside the approved local/export-only v0.5 boundary.

### Implementation

- Added a compact start-only **封測資訊** control and phone-safe **Closed Beta v0.5 測試指南** panel. It tells testers to play one duel, repeat the same practice opponent once to inspect **修行進度**, then use the existing explicit **回報** path when something is unclear or broken.
- The panel states that the Preview is still a Closed Beta preparation build, requires no account, does not automatically upload reports, and has no cloud leaderboard or background telemetry.
- The guide is informational only: it creates no storage key, player/tester identifier, analytics event, backend, network request or gameplay authority. Because it is owned by the start modal, it disappears automatically when play begins and adds no combat HUD density.
- Extended `docs/CLOSED_BETA_V0_5_BASELINE.md` with the release-readiness UI contract so future runs cannot silently turn the guide into tracking or account collection.

### Verification boundary

- Added Node coverage for the bounded three-step tester flow plus a source guard prohibiting persistence/network transports in the readiness module.
- Extended the existing true 320×568 result-actions browser harness: after it proves 分享 and 回報, it switches to the start modal and requires the real **封測資訊** touch target/panel to stay in bounds, show the no-auto-upload/no-account/no-background-telemetry copy, expose exactly three tester steps and close cleanly.
- Exact-head GitHub CI (`npm test` + full `npm run test:browser`) and exact-head Vercel Preview are the post-commit acceptance gates. The PR run comment records final receipts; no second bookkeeping commit is permitted.
