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

## Run 139 — Stabilize production Combat UX acceptance timing

**Date:** 2026-09-05  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `89c386d7f092297bb44b18349fb1e0df4687426a`.
- Exact-head GitHub `Vercel` status is terminal success. CI #184 / run `33942070284` first completed with `npm test` 149/149 green but failed inside the first production Combat UX browser smoke. The failure DOM already proved campaign 敵式 composition and first-telegraph cleanup true and had reached the real 今日陣 route.
- Re-running the exact same CI job on the exact same SHA completed the full `npm run test:browser` suite successfully. With no code/deployment change between attempts, this is treated as a nondeterministic delivery-gate timing defect rather than a product/runtime regression. Draft PR #1 remains open/Draft/unmerged; `main` is untouched; inline review threads remain empty.

### Repair

- Kept all Run 138 production assertions and all player/runtime behavior unchanged.
- Increased only the bounded virtual-time allowance for the now-longer production Combat UX path so the sequential campaign → Pause/Home → 連戰試煉 → 今日陣 acceptance flow can finish deterministically on CI.
- Added explicit browser-runner assertions for production 敵式 composition, first-telegraph cleanup, challenge suppression and 今日陣 suppression so a future failure names the exact contract instead of truncating before the late root-dataset markers.
- No gameplay timing, damage, posture, parry/Perfect/STEP, renderer, input, CSS, persistence, privacy/network or product copy changes.

### Verification boundary

- No acceptance threshold is lowered; the same aggregate `data-combat-ux-browser="pass"` contract and every existing production/mobile assertion remain mandatory.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` and exact-head Vercel success remain mandatory. The PR run comment is authoritative for the resulting SHA under the one-commit rule.

## Run 140 — Carry practice weakness into the next duel intro

**Date:** 2026-09-05  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `1ef134e270655066e4685fcd5235cab870690149`.
- Exact-head Actions CI #185 / run `33944703796` is terminal success and exact-head GitHub `Vercel` status is success. Draft PR #1 is open/Draft/unmerged; `main` is untouched; inline review threads are empty; the latest exact-head review reports no actionable P0–P2 finding; the latest PR receipt contains no unresolved human blocker.
- Candidate scoring: **same-opponent practice focus carried into the next 敵式 intro 24/25** (impact 5, goal 5, novelty 4, confidence 5, safety 5); bounded result key-moment recap 20/25; Closed Beta next-test prompt 18/25. The first candidate wins because it closes the already-approved 四向防守 → 修行進度 → retry loop at the exact moment the player starts the next duel, without touching live combat or persistence.

### Feature

- The existing direct-practice `修行進度` route/focus receipt now feeds one compact **今局修行** line into the existing stage-intro 敵式 card on a same-route retry. A tracked weak direction shows `今局修行 · 右方/左方/上方/下方 · 先守穩再反擊`; if every observed direction in the prior attempt was clean, the line becomes `四向守穩 · 挑戰 Perfect`.
- The carry-over is strict and session-only: the stored practice route must exactly match the new practice route. Campaign starts, another opponent's practice, 連戰試煉 and 今日陣 never receive the line; refresh still clears all practice progress. The entire card remains pointer-transparent and still disappears on the first telegraph.
- No attack definitions, timing, damage, posture, parry/Perfect/STEP, score, renderer pose, input ownership, storage key, identifier, analytics or network transport changed.
- Added deterministic route-isolation/clean-repeat coverage and extended the existing focused 320×568 duel-read browser gate to prove the retry line is visible/in-bounds, publishes the intended focus state, and does not leak into the next campaign profile.

### Verification boundary

- Modified JavaScript and the embedded browser-harness module were syntax-checked before creating the Git objects. Repository-authoritative verification remains exact-head Actions after the single final commit.
- Post-commit `npm test`, complete `npm run test:browser` including the existing duel-read profile browser smoke, and exact-head Vercel success are mandatory. The PR run comment is authoritative for the resulting SHA under the one-commit rule.

## Run 141 — Keep practice retry coaching truthful to observed directions

**Date:** 2026-09-05  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `f95a32d4a661f5383842e320716fec60f72855ef`.
- Exact-head Actions CI #186 / run `33947296485` is terminal success; exact-head GitHub `Vercel` status is success; Vercel Preview feedback reports 0 unresolved items. Direct Vercel deployment enumeration returned 403, so the canonical GitHub Vercel commit status is used. Draft PR #1 remains open/Draft/unmerged; `main` is untouched; inline review threads are empty.
- Latest exact-head Second Hourly review `5119950734` has no P0/P1 but one actionable P2 correctness finding: the practice-progress `clear` state means all **observed** directions were defended, while Run 140's stage-intro copy said `四向守穩`, which can overclaim directions that never appeared. The Closed Beta SOT explicitly forbids inventing unseen-direction failures/coverage and allows coaching to acknowledge only observed刀路, so this blocks new feature work.

### Repair

- Preserved the existing session-only `allObservedPerfect` meaning and changed only the retry-intro clear copy from `四向守穩` to `已見刀路守穩`, keeping the bounded `挑戰 Perfect` next-step cue.
- Added a regression case with exactly two observed directions defended at 100% and two directions at `faced=0`; it must remain a valid all-observed-clean state but must not emit `四向守穩`.
- Route isolation, campaign/challenge suppression, pre-telegraph cleanup and all combat/storage/network authority remain unchanged.

### Verification boundary

- No acceptance threshold or gameplay rule is weakened. The change is a truthful presentation repair against the already-approved Closed Beta coaching contract.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` and exact-head Vercel success are mandatory. The PR run comment is authoritative for the resulting SHA under the one-commit rule.

## Run 142 — Grade the practice target shown on the retry

**Date:** 2026-09-05  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `7a888d8c7460852a0ee62f83575d216161745b57`.
- Exact-head Actions CI #187 / run `33949747390` is terminal success and exact-head GitHub `Vercel` status is success. Draft PR #1 is open/Draft/unmerged; `main` is untouched; inline review threads are empty; the latest exact-head review reports no actionable P0–P2 finding; the latest PR/Vercel comments contain no unresolved human blocker.
- Candidate scoring: **explicit prior practice-target verdict 24/25** (impact 5, goal 5, novelty 4, confidence 5, safety 5); bounded result key-moment recap 20/25; challenge pre-wave target cue 18/25. The first candidate wins because Run 140 already tells the player which observed weak direction to train on the same-opponent retry, but the result still returns only a raw percentage delta instead of saying whether that exact objective was achieved.

### Feature

- The existing result-only `修行進度` coaching now grades the exact directional objective that was carried into the retry: **達成** when it reaches 100%, **進步** when accuracy rises, **持平** when unchanged, **回落** when lower, and **今局未再遇到** when that direction never appears in the repeat. The line stays compact, for example `上局目標 · 上方 · 達成 0%→100%`, then continues into the existing next-run focus.
- The verdict is derived only from authoritative observed strike/parry/STEP/player-hit direction data and only from the previous same-route weak direction. If the previous run was already all-observed-clean, no directional verdict is invented because the next intro challenged **Perfect** rather than naming a direction and the current practice snapshot does not measure Perfect timing.
- Added deterministic outcome coverage and extended the existing focused 320×568 四向防守 / 修行進度 browser gate to prove the prior target state/direction, visible verdict, result bounds and later campaign cleanup. No new DOM surface, pointer target, persistence key or network path is added.
- No attack definitions, timing, damage, posture, parry/Perfect/STEP, score, renderer pose, input ownership, local-best schema, identifier, analytics or network transport changed.

### Verification boundary

- The feature reuses the already accepted result-only coaching row and leaves all gameplay authority untouched. Repository-authoritative verification remains exact-head Actions after the single final commit.
- Post-commit `npm test`, complete `npm run test:browser` including the existing run-analysis direction browser smoke, and exact-head Vercel success are mandatory. The PR run comment is authoritative for the resulting SHA under the one-commit rule.

## Run 143 — Bind 敵式 suppression to authoritative challenge state

**Date:** 2026-09-05  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `ae45398a90df3c0bb810c2f031fc5613b54791a1`.
- Exact-head GitHub `Vercel` status is terminal success and Preview feedback reports 0 unresolved items, but Actions CI #188 / run `33952626204` failed twice on the existing production `連戰試煉` quietness gate while `npm test` stayed green. Draft PR #1 remains open/Draft/unmerged; `main` is untouched; inline review comments are empty.
- The repeated failure is `Production challenge route exposed the duel-read stage-intro card`. Under the exact-head priority fence this is a delivery/runtime blocker, so no feature candidate is eligible this run.

### Repair

- Kept the campaign/direct-practice 敵式 card, copy, layout, timing and practice coaching unchanged.
- The duel-read adapter now treats the CombatEngine `Symbol.for('blade-reversal.challenge-active-v1')` flag as authoritative for challenge/今日陣 suppression and retains the existing DOM `data-challenge-active` check only as a presentation fallback. Because challenge-mode sets the engine flag before entering the underlying start flow, a stage-start/boss-phase event cannot expose the card during startup ordering while the DOM mirror is still stale.
- Added a focused unit regression proving challenge suppression remains true when the authoritative engine flag is true but the DOM mirror still says false. The existing real 320×568 production browser gate is not weakened and must continue proving both `連戰試煉` and `今日陣` remain quiet.
- No combat timing, damage, posture, parry/Perfect/STEP, score, renderer, input, CSS, persistence, identifier, analytics or network authority changed.

### Verification boundary

- This repair changes only which already-existing challenge state the presentation adapter trusts; it does not alter challenge rules or the player-facing campaign/practice feature.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` and exact-head Vercel success are mandatory. The PR run comment is authoritative for the resulting SHA under the one-commit rule.

## Run 144 — Close the all-observed-clean Perfect practice objective

**Date:** 2026-09-05  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `9911a57f4402613bc7fa7ec69277fdee577f5b72`.
- Exact-head Actions CI #189 / run `33955351258` is terminal success and exact-head GitHub `Vercel` status is success. Draft PR #1 is open/Draft/unmerged; `main` is untouched; inline review threads are empty; latest exact-head Second Hourly review `5120531810` reports no actionable P0/P1/P2; the latest Run 143 receipt contains no unresolved human blocker.
- Candidate scoring: **close the existing Perfect retry objective at result 24/25** (impact 5, goal 5, novelty 4, confidence 5, safety 5); three-attempt practice trend 22/25; bounded result key-moment recap 20/25. The first candidate wins because Run 141 already tells an all-observed-clean player to `挑戰 Perfect`, but Run 142 deliberately cannot grade that objective, leaving the repeat-practice loop one step short of an explicit outcome.

### Feature

- The same-route practice snapshot now retains only a coaching count of authoritative `perfect-parry` and `perfect-step-riposte` outcomes. When the previous attempt defended every **observed** direction at 100%, the following `修行進度` result grades the exact Perfect objective: one or more Perfect techniques shows `上局目標 · Perfect · 達成 N次`; zero shows `上局目標 · Perfect · 未達成 0次`.
- The existing directional `上局目標` grading remains unchanged for non-clean prior attempts. Perfect grading has `direction=null`, publishes an explicit `perfect` target-kind marker, and removes any target-direction dataset rather than stringifying a fake direction. The existing next-run focus still derives from the current observed direction evidence.
- Reused the existing result-only coaching row; no new result panel, pointer target, live-combat HUD, storage key, identifier, analytics or network transport is added. Perfect timing, auto-riposte damage, posture, STEP rules, score, enemy balance, renderer pose and input ownership are unchanged.
- Added focused deterministic tests plus a dedicated 320×568 browser gate that exercises an all-observed-clean practice → Perfect target armed → Perfect achieved → later Perfect missed sequence on the composed result UI and fails closed on overflow or fake direction state.

### Verification boundary

- The implementation is intentionally result/coaching-only and keeps the prior directional-target contract intact. The new browser smoke is appended to the complete existing browser suite rather than replacing any gate.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` (including `practice-perfect-target-browser-smoke.mjs`) and exact-head Vercel success are mandatory. The PR run comment is authoritative for the resulting SHA under the one-commit rule.

## Run 145 — Scout the actual next challenge opponent

**Date:** 2026-09-05  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `4b7a1d39457458db3e8ac4ed32910ad3c1ad8041`.
- Exact-head Actions CI #190 / run `33958209494` is terminal success and exact-head GitHub `Vercel` status is success. Draft PR #1 is open/Draft/unmerged; `main` is untouched; inline review threads are empty; the latest exact-head Second Hourly review reports no actionable P0/P1/P2; Vercel Preview Comments reports 0 unresolved feedback. Direct Vercel project lookup returned 404 and team project enumeration returned empty in this runtime, so the exact-head GitHub `Vercel` status is the canonical deployment signal.
- Candidate scoring: **next-wave tactical scout 23/25** (impact 4, goal 5, novelty 4, confidence 5, safety 5); bounded three-attempt practice trend 20/25; bounded result key-moment recap 20/25. The first candidate wins because it strengthens an existing meaningful challenge decision and diversifies away from the recent practice-coaching refinements without touching combat balance.

### Feature

- Each existing Waves 2/4/6 **戰前抉擇** now shows a compact non-interactive **下一陣 · 偵察** read before the player chooses 整息 or 血誓. It reads `engine.enemies[checkpoint]`, so normal challenge and 今日陣 both show the actual next runtime opponent rather than a hard-coded stage assumption.
- Threat tags are derived only from that actual enemy's existing attack metadata: **重斬** when its set contains heavy attacks, **變刀** when it contains feints, **快起手** when its attack set contains a ≤500 ms telegraph, otherwise **正攻**. At most three tags render. No roster/attack definition is mutated.
- The scout is pointer-transparent, stays inside the same decision card, persists only while the stage-clear transition is already parked, and clears immediately when the choice closes as well as on retry/full-campaign handoff.
- The existing 320×568 今日陣 browser harness now verifies all three scouts against the actual date-determined runtime roster, their exact text/state, viewport/pointer safety, persistence during the parked decision, and cleanup before the next stage; existing risk/reward and 戰策回顧 assertions remain intact.
- No combat timing, damage, posture, parry/Perfect/STEP, HP-score trade, challenge ranking, renderer/input authority, storage key, identifier, analytics or network behavior changed.

### Verification boundary

- Existing browser-suite breadth is preserved; the composed 今日陣/challenge tactical gate is strengthened rather than replaced.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` and exact-head Vercel success are mandatory. The PR run comment is authoritative for the resulting SHA under the one-commit rule.
