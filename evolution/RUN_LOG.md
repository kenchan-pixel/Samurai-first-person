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
- Post-commit exact-head Actions `npm test`, complete `npm run test:browser` and exact-head Vercel success are still mandatory. The PR run comment is the authoritative post-commit receipt under the one-commit rule.

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

## Run 146 — Show a bounded three-attempt practice trajectory

**Date:** 2026-09-05  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `a7952ddcfc93ffb57fda37ec556e6093372bdca4`.
- Exact-head Actions run `33960874424` is terminal success with `npm test` and the complete browser suite green; exact-head GitHub `Vercel` status is success; Vercel Preview Comments reports 0 unresolved feedback. Draft PR #1 is open/Draft/unmerged; `main` is untouched; inline review threads are empty; latest exact-head Second Hourly review `5120891626` reports no actionable P0/P1/P2.
- Candidate scoring: **bounded three-attempt same-route practice trend 23/25** (impact 4, goal 5, novelty 4, confidence 5, safety 5); bounded result key-moment recap 20/25; challenge checkpoint outcome reflection 19/25. The trend wins because it adds visible repeat-play progression to the already-approved dojo loop without persistence, balance changes or another live-combat overlay, and Run 145 already diversified the previous evolution into challenge tactics.

### Feature

- The existing direct-practice `修行進度` card now adds a compact **近3局** line only after the third result for the same practice route in the current page session. It shows the three authoritative defense rates, hits taken and manual-counter conversion values in order and grades only the first-to-third aggregate as `整體向上`, `大致持平` or `需要調整`.
- Attempts one and two remain unchanged. The established immediate `比上次` comparison, `上局目標` directional/Perfect verdict and next-run coaching remain intact rather than being replaced by the trend.
- Trend history is kept in a separate route-keyed in-memory map, capped to three frozen snapshots per route. Switching routes cannot mix opponents; refresh clears the history. Missing counter data stays `—` instead of being invented.
- The existing three-run Perfect browser harness now proves the trend stays hidden on attempts one/two, appears on attempt three with truthful `100%→100%→100% / 0→0→0 / 100%→100%→100%` evidence, owns no pointer input and keeps the composed result card inside 320×568.
- No combat timing, damage, posture, parry/Perfect/STEP, score, enemy balance, renderer/input authority, storage key, identifier, analytics or network behavior changed.

### Verification boundary

- Existing Node and browser-suite breadth is preserved; the established Perfect target harness is strengthened rather than replaced, and deterministic tests cover improving, declining, pre-third-run and unavailable-metric cases.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` and exact-head Vercel success are mandatory. The PR run comment is authoritative for the resulting SHA under the one-commit rule.

## Run 147 — Reconcile the delivered 近3局 baseline and regression SOT

**Date:** 2026-09-05  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `976f2d2d164c856833cd93bc9341d5f7dcd8039d`.
- Exact-head Actions CI #192 / run `33963396194` is terminal success after the same-SHA rerun and exact-head GitHub `Vercel` status is success. Draft PR #1 is open/Draft/unmerged; `main` is untouched; inline review threads are empty; Vercel Preview feedback reports 0 unresolved items.
- Latest exact-head Second Hourly review `5121042009` has one actionable P2: Run 146 delivered and verified the player-visible **近3局** practice trajectory, but `docs/CURRENT_BASELINE.md` and `docs/REGRESSION_CHECKLIST.md` still describe only the immediate previous-attempt comparison. Because cumulative player-visible behavior and its acceptance contract are canonical SOT, this is a material delivery/SOT blocker and feature work is prohibited this run.

### Repair

- Updated `docs/CURRENT_BASELINE.md` to record the session-only rolling last-three same-route trend, the third-result visibility boundary, route isolation, three-snapshot cap, page-refresh reset, `—` handling for unavailable metrics, campaign/challenge/今日陣 exclusion and pointer-transparent 320×568 result-only presentation.
- Extended `docs/REGRESSION_CHECKLIST.md` so future runs must preserve attempts one/two hidden, third-and-later truthful rolling values, route-switch/refresh isolation, campaign/challenge/今日陣 exclusion, coexistence with the immediate comparison/target coaching and the existing bounded pointer-transparent result surface.
- Product source, tests and browser thresholds are unchanged. The repair records behavior already present in `src/practice-progress.js` and already exercised by the Run 146 exact-head Node/browser suite; it does not introduce a new feature, persistence, identifier, network path, combat rule or layout surface.

### Verification boundary

- This documentation-only change qualifies as a blocker repair because it closes an exact-head reviewer finding against the mandatory cumulative product/regression SOT; no acceptance threshold is weakened.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` and exact-head Vercel success are mandatory. The PR run comment is authoritative for the resulting SHA under the one-commit rule.

## Run 148 — Close the challenge launch-intent suppression gap

**Date:** 2026-09-05  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `92ed8dae1444eb42d2ccf461761e389897f8885d`.
- Exact-head Actions CI #193 / run `33966421082` passed `npm test` but failed the production browser suite twice on `Production challenge route exposed the duel-read stage-intro card`; exact-head GitHub `Vercel` status is success. Direct Vercel deployment enumeration returns 403, so the GitHub commit status is the canonical deployment signal.
- Draft PR #1 is open/Draft/unmerged; `main` is untouched; inline review threads are empty. The latest exact-head review classifies the same production challenge leak as actionable P1, so feature work is prohibited.

### Repair

- Kept the Run 137 campaign/direct-practice 敵式 card, copy, layout, timing and all combat behavior unchanged.
- Extended the existing challenge suppression helper to trust `data-next-run-mode="challenge"`, which `requestChallenge(true)` publishes synchronously before the nested start-button launch. This closes the launch-intent gap before the CombatEngine challenge symbol or DOM active mirror can be observed by the presentation adapter.
- Reused the same root suppression helper inside `renderDuelReadProfile`, so even a stale drain-time snapshot cannot directly expose the card after a challenge launch has already been armed.
- Added a focused unit regression proving the launch-intent signal suppresses the card while `data-challenge-active` is still false, while `nextRunMode=campaign` remains eligible for normal campaign/direct-practice presentation. The real 320×568 production challenge/今日陣 quietness gate is unchanged and remains mandatory.
- No attack timing, damage, posture, parry/Perfect/STEP, score, renderer, input, CSS, persistence, identifier, analytics or network behavior changed.

### Verification boundary

- No acceptance threshold is weakened. This is a presentation startup-order repair against an already-approved cumulative baseline.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` and exact-head Vercel success are mandatory. The PR run comment is authoritative for the resulting SHA under the one-commit rule.

## Run 149 — Reflect immediate post-tactic wave outcomes

**Date:** 2026-09-05  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `9d384d63964bba478b9b3d526f0b93c64c91daf2`.
- Exact-head Actions CI #194 / run `33969196873` is terminal success and exact-head GitHub `Vercel` status is success. Draft PR #1 is open/Draft/unmerged; `main` is untouched; inline review comments are empty; Vercel Preview feedback reports 0 unresolved items; latest exact-head review `5121524967` reports no actionable P0/P1/P2.
- Candidate scoring: **challenge checkpoint outcome reflection 23/25** (impact 4, goal 5, novelty 4, confidence 5, safety 5); bounded result key-moment recap 22/25; Closed Beta next-test prompt 19/25. The first candidate wins because it closes the existing tactical decision → immediate consequence learning loop without changing balance, persistence or live-combat HUD density.

### Feature

- Added a compact terminal-only **戰策後果** line for accepted Waves 2/4/6 tactical choices. Each choice is bound only to its immediate following Wave 3/5/7 and reports authoritative `player-hit` event count plus clear/defeat outcome, for example `2誓→3無傷 · 4息→5受擊1 · 6誓→7無傷`.
- The reflection reports what happened after the choice rather than claiming the tactic caused the result. Later waves cannot backfill or rewrite an earlier checkpoint outcome; a defeat in the immediate next wave is explicitly labelled as defeat.
- Added `src/challenge-tactic-reflection.js` as a bounded session-only CombatEngine event adapter loaded after challenge tactics and before challenge rival. It does not alter HP, score, phase/timing, tactical rewards, roster/attacks, input, renderer, persistence, identifiers, analytics or network behavior.
- Extended the existing composed 320×568 今日陣/challenge tactical harness with one deterministic authoritative-style Wave-5 `player-hit`, exact 戰策後果 copy, event summary, pointer transparency, result bounds and retry/full-campaign cleanup. Added deterministic pure/composed Node coverage plus no-storage/no-transport guards.

### Verification boundary

- The new JavaScript, Node test and embedded browser-harness module were syntax-checked before the Git objects were assembled. Existing browser-suite breadth and tactical reward/scout/recap assertions are preserved rather than replaced.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` and exact-head Vercel success are mandatory. The PR run comment is authoritative for the resulting SHA under the one-commit rule.

## Run 150 — Track session-only practice personal bests

**Date:** 2026-09-05  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `d19f725f2c638c36f8d33a48c4c862122ef5020f`.
- Exact-head Actions CI #195 / run `33972579496` is terminal success and exact-head GitHub `Vercel` status is success. Direct Vercel deployment enumeration returns 403, so the exact-head GitHub commit status is the canonical deployment signal permitted by SOT. Draft PR #1 is open/Draft/unmerged; `main` is untouched; inline review comments are empty and Preview feedback reports 0 unresolved items. No applicable unresolved P0/P1/material-P2 or baseline regression was found.
- Candidate scoring: **same-route session practice personal bests 23/25** (impact 4, goal 5, novelty 4, confidence 5, safety 5); bounded result key-moment recap 22/25; challenge retry prompt from immediate-next-wave outcomes 22/25. The first candidate wins because it makes Closed Beta repeat practice measurable across the whole current page session, complements rather than replaces immediate `比上次` and rolling `近3局`, and diversifies away from the recent challenge-result work without persistence or balance risk.

### Feature

- Added a compact pointer-transparent **本次修行** line inside the existing direct-practice result analysis card. The first result establishes a one-attempt baseline; each same-route retry increments the count and independently keeps the best observed defense percentage, fewest hits taken and best manual-counter conversion for that practice route.
- A later result adds `今局刷新` only for metrics that strictly improve the existing session best; ties are not called records and unavailable percentage metrics remain `—`. Ronin/Oni/Shogun/Blood Moon histories are isolated from each other and page refresh clears all of them.
- Added `src/practice-session-record.js` as a bounded in-memory CombatEngine result adapter loaded through the existing mastery/result composition. It reuses authoritative run-analysis events/snapshots, creates no localStorage/sessionStorage/indexedDB key or network request, and does not alter combat, score, campaign/challenge personal-best schemas, renderer or input authority.
- Added deterministic best/strict-refresh/privacy tests and extended the existing 320×568 Perfect-practice browser gate to prove attempt counts 1→2→3, exact aggregate text, pointer transparency and the combined result layout alongside Perfect-target and 近3局 content. Existing acceptance gates are preserved rather than replaced.
- Updated Current Baseline and Regression Checklist in the same implementation commit so the session-only route-isolated record, privacy boundary and 320×568 composition remain cumulative SOT.

### Verification boundary

- The new JavaScript, Node test, mastery import, browser runner and embedded browser-harness module were syntax-checked before Git object assembly. The authoritative full repository test/browser suite can run only after the single final commit in this tool surface.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` and exact-head Vercel success are mandatory. The PR run comment is authoritative for the resulting SHA under the one-commit rule.

## Run 151 — Turn observed challenge outcomes into a retry focus

**Date:** 2026-09-06  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `e4dd9284c4a12f2363603e3669126129efda156b`.
- Exact-head Actions CI #196 / run `33975339405` is terminal success and exact-head GitHub `Vercel` status is success. Direct Vercel deployment enumeration remains unavailable in this runtime, so the repository-approved GitHub Vercel commit status is the canonical deployment signal. Draft PR #1 is open/Draft/unmerged; `main` is untouched; unresolved review threads are empty; latest exact-head review reports no actionable P0–P2 and Preview feedback reports 0 unresolved items.
- Candidate scoring: **challenge retry focus from immediate post-tactic outcomes 24/25** (impact 5, goal 5, novelty 4, confidence 5, safety 5); bounded generic result key-moment recap 20/25; unverified combat-motion refinement 16/25. The first candidate wins because Run 149 already records truthful immediate Wave 3/5/7 outcomes, but the result still leaves the player to infer what to target on the next challenge attempt.

### Feature

- Challenge/今日陣 terminal results now derive one compact **再戰重點** from the existing `戰策後果` evidence. An actual immediate-next-wave defeat is prioritised first; otherwise the resolved Wave 3/5/7 with the highest observed `player-hit` count is selected (earlier stage wins ties); if every resolved post-choice wave was hitless, the prompt says to preserve the clean rhythm instead of inventing a weakness.
- The existing retry button is retitled to the same target, for example `再戰 · 第5陣守穩`, so the terminal reflection now closes directly into a player action without adding live-combat HUD. The original `戰策後果` line remains unchanged and the new copy describes only what was observed, never claiming the preceding tactic caused the result.
- The focus is session/terminal-only, clears on retry and full-campaign handoff, and creates no storage key, identifier, analytics or network path. HP, score, tactical reward, attack timing/damage, roster, parry/Perfect/STEP, renderer and input authority are unchanged.
- Extended deterministic Node coverage for defeat/hit/clean priority and retry-button copy, and strengthened the existing composed 320×568 今日陣 browser gate to prove the real deterministic Wave-5 hit produces `再戰重點 · 第5陣 · 上局受擊1 · 先守穩`, keeps the new row inside the existing result strip with pointer events disabled, retitles the button, attaches truthful event detail, and clears all focus state on retry/full-campaign handoff.

### Verification boundary

- No existing browser gate or acceptance threshold is removed. The implementation reuses the established challenge terminal strip and existing retry control rather than introducing another combat-time surface.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` and exact-head Vercel success are mandatory. The PR run comment is authoritative for the resulting SHA under the one-commit rule.

## Run 152 — Hide stale campaign 敵式 state synchronously on challenge start

**Date:** 2026-09-06  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `0c5d7490827adcf54afe54adccbfd2869330bc72`.
- Exact-head Actions CI #197 / run `33978459741` passed `npm test` 168/168 but failed the real production 320×568 browser suite twice on `Production challenge route exposed the duel-read stage-intro card`; exact-head GitHub `Vercel` status is success. Draft PR #1 is open/Draft/unmerged, `main` is untouched, inline review comments are empty and Preview feedback reports 0 unresolved items.
- Latest exact-head review `5122132834` classifies the same leak as actionable P1. Feature work is therefore prohibited.
- Inspection of the production smoke found the remaining race: the smoke restarts campaign, returns Home only ~100 ms into the restarted Stage 1 intro, then launches challenge. The restarted campaign card can remain visible until a later animation-frame `drainEvents()` processes reset; meanwhile `data-combat-phase` can still be `stage-intro`. Once challenge start synchronously publishes `data-challenge-active=true`, the smoke can satisfy its start predicate before that next frame, observing the stale campaign card even though the challenge's own `stage-start` would be suppressed.

### Repair

- Kept the existing authoritative engine-symbol, DOM-active and launch-intent suppression checks, and kept the real challenge/今日陣 browser assertions unchanged.
- Extended only the duel-read presentation adapter's composed `Engine.start` seam. After the underlying start chain has published authoritative challenge state, a challenge/今日陣 start now synchronously hides any already-visible duel-read card before `start()` returns. The existing event-drain suppression remains as the second line of defense for challenge `stage-start` / `boss-phase` events.
- Added a focused regression that begins with a stale visible campaign card and stale campaign DOM intent, lets a fake composed start publish the authoritative challenge symbol/root state, and proves the card plus practice-focus datasets are hidden immediately without calling `drainEvents()`.
- Campaign/direct-practice 敵式 copy/timing/layout, challenge rules, attack timing/damage, posture, parry/Perfect/STEP, score, renderer, input, persistence, privacy and network behavior are unchanged.

### Verification boundary

- No acceptance threshold is weakened. This fixes the stale pre-challenge presentation seam that the existing fail-closed production gate exposed; it does not special-case or relax the test.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` and exact-head Vercel success are mandatory. The PR run comment is authoritative for the resulting SHA under the one-commit rule.
