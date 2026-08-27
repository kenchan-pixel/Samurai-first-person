# Evolution Run Log

This file keeps autonomous-evolution history concise. Full implementation detail and exact verification receipts remain in Git history and Draft PR #1.

## Runs 000–020 — Established evolution history

- **Run 000 — BASELINE:** mobile-first first-person WebGL duel, four-direction parry/swipe combat, three enemies, progression, tests and SOT.
- **Run 001 — BLOCKER_FIX:** exact-head CI/Vercel fence plus P0/P1/P2 review-gate semantics.
- **Run 002 — FEATURE:** enemy anticipation/body commitment/blade-trail readability.
- **Run 003 — BLOCKER_FIX:** player-katana/GLSL fixes plus executable WebGL browser smoke.
- **Run 004 — FEATURE:** player/enemy posture and guard break.
- **Runs 005–006 — FEATURE/BLOCKER_FIX:** mastery grading/local best plus browser/storage/layout hardening.
- **Runs 007–010 — FEATURE/BLOCKER_FIX:** Crimson Shogun and Guided Duel with integration repairs.
- **Runs 011–014:** spacing/STEP, impact choreography and wider samurai/dojo framing.
- **Runs 015–020:** elapsed-time four-beat motion, PlayCanvas production renderer and production combat-motion browser contract.

## Runs 021–026 — Skinned character and physical-phone readability

- **Run 021 — FEATURE:** deterministic local GLB with 19-joint skinned samurai, layered armour and `Idle / Windup / Strike / Recovery / Parry` clips.
- **Run 022 — BLOCKER_FIX:** stale current-baseline CI assertions repaired so the real browser gate could execute.
- **Run 023 — BLOCKER_FIX:** PlayCanvas container animation Assets unwrapped to real AnimTracks and skinned production path restored.
- **Run 024 — FEATURE:** direction-specific skinned body choreography plus sword-bone read trail.
- **Run 025 — FEATURE:** four stage-specific silhouettes/weapon profiles on the shared rig.
- **Run 026 — REGRESSION_FIX:** first physical-iPhone readability repair: smoother strike presentation, stronger parry clash, quieter HUD and STEP moved lower-right.

## Run 027 — Real blade trajectory + Perfect Parry riposte repair

**Date:** 2026-08-28  
**Action type:** REGRESSION_FIX  
**Goal:** Fix the direct owner physical-iPhone blockers that remained after Run 026: the enemy katana still did not actually point/cut toward the player, STEP text remained too small, and Perfect Parry lacked the requested immediate offensive reward.

### Preflight / blocker evidence

- Exact previous HEAD `793c456596aa99e3c2a61f867a23589e202f9250`: CI #55 / run `33094518212` = success; exact-head GitHub `Vercel` commit status = success.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; no inline review threads existed.
- Latest automated review on the previous HEAD contained one non-blocking P2 about focused Run 026 presentation coverage and no P0/P1.
- The owner then supplied direct iPhone evidence and explicit P1 acceptance: four real 3D blade-tip paths must advance toward/cross the player-facing plane; trail must follow the real world-space weapon path; STEP primary text must be materially larger; Perfect Parry should auto-riposte while manual swipe follow-up and approximate damage budget remain.
- These physical-device P1 findings override feature selection, so unrelated feature work is prohibited until repaired/rechecked.

### Root cause

- The primitive weapon path changed mostly Z-axis rotation, while the skinned path reused one Strike clip whose Sword joint also mainly rotated around Z.
- Direction differences were then amplified by rotating the whole skinned model and adding bone-attached echoes. That can make the body look committed while the blade shaft still never points into camera depth.
- Run 026 therefore decorated the wrong weapon trajectory rather than correcting it.
- STEP's Run 026 override still forced a 9 px primary label and 8 px secondary label on phone.

### Repair

- Added a late presentation-only trajectory layer around the actual loaded skinned `Sword` joint. Top/right/bottom/left now have different 3D wind-up → contact → follow-through targets.
- During the committed strike the opponent receives a bounded depth lunge, the katana local blade axis points toward the camera/player, the calculated blade tip crosses a player-facing Z plane, then blends back through recovery.
- Disabled the old attached swing echoes during this path and added at most six reused root/world-space trail segments built from actual blade-tip history; no per-frame entity creation and no new model/texture/network asset.
- Added a phone control style layer after Run 026 presentation CSS: STEP is materially larger/bolder, the tiny secondary label is hidden, and range/temporary feedback text is enlarged while the 320×568 STEP hit area stays beyond the bottom/right block-region boundaries.
- Added Perfect Parry automatic light riposte: exactly 1 immediate damage. The same recovery opening still allows one manual swipe counter. When auto-riposte has fired, the old +1 perfect bonus is suppressed on that manual counter, keeping the standard perfect + opposite-direction total at approximately the previous damage budget rather than stacking free damage.
- Normal parry remains manual-only.
- The automatic riposte uses a raw `perfect-riposte` event through onboarding/mastery/impact observers, then maps it to the existing visible counter event for the main runtime. This preserves Guided Duel's requirement for a genuine manual swipe counter while still showing the immediate player slash/audio/hit feedback.

### Verification added in the same slice

- Extended the existing production PlayCanvas renderer contract instead of adding a broad new harness: it checks all four wind-up/strike blade-tip paths, forward Z advance, player-facing plane crossing, actual world-space trail history, and the phone STEP font/secondary-copy contract.
- Added focused Node coverage for automatic Perfect Parry damage, preserved manual swipe follow-up, moved perfect bonus, and unchanged normal-parry behaviour.
- The prior Run 026 P2 is dispositioned as non-blocking for this run: the new player-critical sword path no longer depends on the two attached echoes, while existing impact browser coverage still protects bounded parry FX. Physical feel remains a human gate.

### Regression boundaries / risk

- No attack duration, parry/perfect timing window, input mapping, STEP effectiveness, reach, posture threshold, boss phase timing, account/network/storage model, asset provenance or merge/deploy authority changed.
- Combat authority remains in `CombatEngine`; blade trajectory is renderer-only. Perfect-riposte damage is a bounded combat adapter with focused tests.
- The renderer's automated world-space path proof cannot certify subjective smoothness, exact visual contact or sustained 60 Hz/thermals on iOS Safari. The next run must use new physical-device evidence before unrelated feature expansion.

### Next candidates

- Physical-iPhone re-check of all four blade paths, Perfect Parry auto-riposte feel and STEP readability.
- Sustained device frame-time/shadow/pixel-ratio tuning if evidence requires it.
- First-person player hands/katana fidelity only after opponent trajectory acceptance is confirmed.

## Run 028 — Blade trajectory exact-head CI repair

**Date:** 2026-08-28  
**Action type:** BLOCKER_FIX  
**Goal:** Repair the failed exact-head browser gate from Run 027 without weakening the player-facing blade acceptance contract.

### Preflight / blocker evidence

- Exact HEAD `890292fad3e4705decd65a3bee8deb5e3b2a6a4a`: Vercel commit status = success, but CI #56 / run `33100201493` failed.
- `npm test` passed all 40 Node tests. `npm run test:browser` failed the real production PlayCanvas contract with `Top strike blade tip did not advance continuously toward the player`.
- PlayCanvas, the skinned GLB, STEP readability layer and `worldspace-v2` adapter all initialized; the failure was isolated to the new real Sword trajectory.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; no inline review threads existed.
- Therefore this run is strictly `BLOCKER_FIX`; no unrelated feature work is permitted.

### Root cause / repair

- Run 027 described wind/contact/follow as absolute world-space tip targets several metres from the hilt, then normalized the aim back to the fixed 1.78 m blade length. The resulting reachable tip could fail the required monotonic forward movement even though the nominal target Z increased.
- The strike path also applied easing to already-interpolated absolute targets, making early commitment less deterministic than the contract requires.
- Replaced those unreachable positions with normalized hilt-relative **world-space blade-axis profiles** for top/right/bottom/left.
- The first strike beat now uses a bounded front-loaded cut easing from guard axis to a near-camera contact axis; the opponent depth lunge follows the same commitment. Contact then blends through a direction-specific follow-through axis and recovery returns to the sampled skeletal direction.
- The skeletal/base Sword direction is sampled immediately after the original animation draw and before the presentation override, so the later prerender pass cannot feed the overridden trajectory back into its own telegraph/recovery interpolation.
- Existing max-six world-space trail reuse, STEP presentation, Perfect Parry riposte, combat timing/input/damage authority and fallbacks are unchanged.

### Verification boundary

- The existing fail-closed browser assertion is intentionally unchanged; this repair must make the real Sword satisfy it rather than relax the gate.
- Post-commit exact-head CI and Vercel results are recorded in the Draft PR run receipt, per the scheduled-task protocol.
- Physical-iPhone normal-speed smoothness and exact visual contact remain the owner acceptance gate even after automated trajectory geometry is green.

## Run 029 — Perfect Parry / Blood Moon phase-integrity repair

**Date:** 2026-08-28  
**Action type:** BLOCKER_FIX  
**Goal:** Close the current-head P1 where Perfect Parry automatic riposte damage could bypass Crimson Shogun Phase II.

### Preflight / blocker evidence

- Exact HEAD `33359ac7271a8d0ae30270268e7284a5c2f54f48`: CI #57 / run `33101381344` = success and exact-head GitHub `Vercel` status = success.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; no inline review threads existed.
- Current-head All Repos review identified one P1: `perfect-riposte.js` could reduce boss HP independently while `boss-encounter.js` only evaluated the 6-HP Blood Moon threshold after a manual counter. Repeated Perfect Parries could therefore defeat Phase I without ever entering Phase II.
- Because the finding is a current-head P1 gameplay regression, this run is strictly `BLOCKER_FIX`; unrelated feature work is prohibited.

### Root cause / repair

- Boss Phase II transition logic was embedded inside the manual `attemptAttack()` wrapper rather than expressed as a reusable authoritative HP-threshold transition.
- Extracted a single `maybeAdvanceBossPhase()` transition in `boss-encounter.js`. It owns the one-time phase state change, boss definition swap, posture/attack reset, 1100 ms breathing gap, score bonus and `boss-phase` event.
- Manual accepted counter damage continues to invoke that transition.
- Perfect Parry automatic riposte now invokes the same transition immediately after its 1 damage. If the riposte moves Crimson Shogun from 7 HP to 6 HP, Blood Moon starts before another manual counter/attack can resolve. Phase I therefore cannot be chipped to defeat through automatic ripostes.
- Normal enemies and normal parries are unaffected; the existing Perfect Parry damage-budget rule remains unchanged outside the boss threshold transition.

### Focused regression / boundaries

- Extended the existing boss Node suite, not a new broad harness: a real patched `CombatEngine` is placed at Crimson Shogun 7 HP during a valid perfect-parry strike; the automatic riposte must reach 6 HP, emit `boss-phase`, swap to Phase II, enter the 1100 ms gap, avoid `enemy-defeated`, and reject an immediate manual follow-up as `no-opening`.
- Existing manual-counter Phase II test remains, proving both damage sources use the same transition.
- No parry window, attack timing, damage amount, posture threshold, STEP/input rule, renderer path, asset, storage/network model or merge/deploy authority changes.
- Physical-iPhone blade smoothness, automatic-riposte feel and STEP readability remain the next human acceptance gate before unrelated feature expansion.

## Run 030 — Gameplay clarity before Ronin rebalance

**Date:** 2026-08-28  
**Action type:** FEATURE  
**Goal:** Make the existing combat system learnable on a phone before changing Stage 2 balance, using direct owner evidence that Ronin felt very difficult (score 1965) and that key mechanics such as the post-parry swipe counter were not discoverable.

### Preflight / evidence

- Exact previous HEAD `17464e88c6bd1c7433df78fff6f229b9b278def1`: CI #58 / run `33103609415` = success; exact-head GitHub `Vercel` commit status = success.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; no inline review threads existed.
- Exact-head All Repos review reported no actionable P0/P1/P2 finding and confirmed the prior Blood Moon blocker is fixed.
- Owner play evidence identified a learnability problem: Stage 2 felt very hard, normal parry→manual swipe damage was not obvious, STEP's distinction from parry was unclear, and other mechanics were effectively hidden.
- The owner also proposed a backend for gameplay analytics. Current repository policy explicitly prohibits analytics/external tracking without approval, so that proposal is recorded as a privacy Decision Gate rather than silently implemented.

### Candidate selection

1. **Gameplay guide + contextual Ronin/recovery cues** — impact 5 / goal alignment 5 / novelty 4 / confidence 5 / safety 5.
2. **Immediately soften Ronin timing/feint pressure** — 4 / 4 / 2 / 3 / 4; deferred because the observed difficulty may be caused by hidden rules rather than raw timing.
3. **Remote balancing telemetry backend** — 5 / 4 / 5 / 2 / 1 under current policy; deferred pending explicit privacy/data-retention/backend approval.

Chosen slice: candidate 1. It is player-visible, directly addresses the owner evidence, and preserves a clean later balance decision.

### Delivered slice

- Added a prominent **玩法** control to the start screen. It opens a scrollable, phone-first guide covering the full normal parry→swipe loop, Perfect Parry automatic riposte + remaining swipe, opposite-direction swipe +1 damage, posture/guard-break +2 damage, STEP timing/range limitations and Ronin feints.
- Added short large live cues after successful parry, Perfect riposte, STEP evade and guard break so the immediate follow-up is explicit without bringing back persistent combat text.
- Added a Stage 2 entry cue: `RONIN · 假動作 — 等最後刀路先格擋`, directly teaching the final-direction rule before the difficulty spike.
- Kept existing Guided Duel behavior and local completion preference. Automatic riposte does not satisfy the manual counter lesson.
- No Ronin timing, damage, HP, posture, score, parry window, STEP reach or other balance value changed in this run.

### Verification / regression boundaries

- Extended the existing onboarding Node test with pure cue mapping checks rather than creating another test family.
- Extended the existing onboarding browser harness to open/close the real guide at 320×568, verify critical rule copy/scrollability, drive Stage 2 to verify the Ronin cue, and drive a real Perfect Parry through the patched engine to verify the automatic-riposte follow-up cue.
- The same browser harness checks the live cue is pointer-transparent and materially readable; the existing overall browser gate continues to protect the complete PlayCanvas/mastery/boss/onboarding/footwork/impact baseline.
- No new network request, account, analytics service, external storage, paid API, asset or permission is introduced.
- Physical-iPhone retest remains necessary: if Ronin still behaves as a difficulty wall after these rules are understood, the next bounded slice should tune Stage 2 from that evidence rather than globally weakening the game.

## Run 031 — Gameplay-clarity exact-head CI repair

**Date:** 2026-08-28  
**Action type:** BLOCKER_FIX  
**Goal:** Restore the required exact-head CI/browser verification fence for the Run 030 gameplay-clarity slice without changing gameplay behavior or weakening the intended cue contract.

### Preflight / blocker evidence

- Exact HEAD `df29da733051af80ef877843bb772b1671d861c6`: Vercel commit status = success, but CI #59 / run `33109558030` failed.
- `npm test` passed 41/42 tests; `tests/onboarding.test.mjs` expected `/再掃/` while the intended production Perfect-riposte cue is `仲有一次掃屏反擊`.
- Because the Node step failed first, `npm run test:browser` was skipped, leaving the new phone-first gameplay guide/cues without required exact-head browser proof.
- Current-head All Repos review classified this as the actionable P2/exact-head blocker; Draft PR #1 remained open, Draft and unmerged; no inline review threads existed; `main` remained untouched.

### Root cause / repair

- The failure is a stale copy-specific test expectation, not a production gameplay mismatch. The live cue correctly communicates that the automatic riposte leaves one manual swipe counter available.
- Updated the focused onboarding assertion to verify the stable semantic contract `掃屏反擊` rather than the obsolete wording fragment `再掃`.
- Runtime code, Ronin balance, combat timing/damage, STEP mechanics, renderer/assets, persistence and network/privacy behavior are unchanged.
- No analytics/telemetry backend is introduced; that proposal remains behind the documented privacy Decision Gate.

### Verification boundary / next gate

- This repair does not relax or remove any player-facing browser assertion. Its purpose is to let the existing full Node + browser gate execute again on the exact new HEAD.
- Post-commit exact-head CI and Vercel results are recorded in the Draft PR run receipt; no second metadata-only commit is allowed.
- Once the new HEAD is terminal green, the next product decision remains physical-iPhone evidence: re-test Stage 2 Ronin after the clarity pass, then tune Stage 2 only if it still behaves as a difficulty wall.

## Run 032 — Gameplay-clarity browser gate repair

**Date:** 2026-08-28  
**Action type:** BLOCKER_FIX  
**Goal:** Restore the remaining failed browser half of the exact-head gameplay-clarity verification fence without weakening the real phone-facing cue contract.

### Preflight / blocker evidence

- Exact HEAD `37694cab1f2ee6fed60bebfdd5511237585c5b51`: Vercel commit status = success, but CI #60 / run `33113437624` failed.
- `npm test` passed 42/42. `npm run test:browser` failed because `tests/onboarding-browser-harness.html` still required the obsolete contiguous wording fragment `再掃`, while the production Perfect-riposte cue is `仲有一次掃屏反擊`.
- The harness therefore reported `data-gameplay-guide-riposte="false"` and `data-onboarding-integration="fail"` even though the actual cue title was `自動補刀 -1` and its follow-up still told the player to swipe-counter.
- The current-head Second Hourly review classified the stale browser assertion as the actionable P2/exact-head blocker. No inline review threads existed; Draft PR #1 remained open/Draft/unmerged and `main` remained untouched.

### Root cause / repair

- Run 031 corrected the Node semantic assertion but missed the duplicated copy-specific assertion in the existing browser integration harness.
- Updated only that browser assertion to require the stable semantic contract `掃屏反擊` while retaining the stronger checks that the event is a real accepted Perfect Parry with `autoRiposte === true` and that the visible cue title identifies the automatic follow-up.
- No production runtime file, Ronin balance value, combat timing/damage, STEP rule, input mapping, renderer/asset, persistence, network or privacy behavior changes.
- No analytics/telemetry backend is introduced; the owner proposal remains behind the existing privacy Decision Gate.

### Verification boundary / next gate

- The real onboarding browser path remains fully exercised; the test is not removed, skipped or weakened to a readiness-only marker.
- Post-commit exact-head CI and Vercel results are authoritative in the Draft PR receipt. State intentionally remains `pending_self_verification` inside this one commit until those external checks finish.
- Once this exact HEAD is terminal green, the next product decision returns to physical-phone evidence: Stage 2 Ronin difficulty after the clarity pass, plus blade/Perfect-riposte/STEP feel.
