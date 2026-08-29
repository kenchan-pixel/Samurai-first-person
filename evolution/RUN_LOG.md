# Evolution Run Log

This file intentionally keeps autonomous-evolution history concise. Full implementation detail, exact SHAs, CI receipts and Preview links remain in Git history and Draft PR #1.

## Runs 000–020 — Core systems and renderer evolution

- **Run 000 — BASELINE:** mobile-first first-person WebGL duel, directional parry/swipe combat, three enemies, progression, tests and SOT.
- **Run 001 — BLOCKER_FIX:** exact-head CI/Vercel fence plus P0/P1/P2 review-gate semantics.
- **Runs 002–003 — FEATURE/BLOCKER_FIX:** readable combat motion plus renderer/WebGL correctness and executable browser smoke.
- **Runs 004–006 — FEATURE/BLOCKER_FIX:** posture/guard break, mastery grading/local best and browser/storage hardening.
- **Runs 007–010 — FEATURE/BLOCKER_FIX:** Crimson Shogun and Guided Duel with integration/reduced-motion repairs.
- **Runs 011–014 — FEATURE/BLOCKER_FIX:** spacing/STEP, impact choreography and wider samurai/dojo framing.
- **Runs 015–020 — FEATURE/BLOCKER_FIX:** elapsed-time four-beat motion, dropped-frame recovery repair, PlayCanvas production renderer and real combat-motion browser contract.

## Runs 021–042 — Skinned character, mobile combat and practice

- **Runs 021–025:** locally generated 19-joint skinned samurai GLB, animation binding, directional body reads and stage-specific silhouettes.
- **Runs 026–029:** mobile readability repair, real world-space four-direction blade paths, Perfect Parry riposte and Blood Moon phase-integrity repair.
- **Runs 030–034:** phone-first guide/Ronin lesson, exact-head clarity repairs, Perfect STEP and phase-priority repair.
- **Runs 035–038:** first-person two-hand weapon grip, local post-run analysis and analysis-denominator/damage repairs.
- **Runs 039–042:** repeatable Ronin/Shogun practice, practice browser verification and optional high-contrast blade-read mode.

## Runs 043–051 — Combat UX and exact-head hardening

- **Run 043 — REGRESSION_FIX:** simplified live combat, extended portrait top-parry reach, true Pause/玩法 frozen clock, and production Shogun-practice Blood Moon coverage.
- **Run 044 — REGRESSION_FIX:** moved Pause to a neutral lower-centre band to repair a parry-surface collision.
- **Runs 045–048 — BLOCKER_FIX:** hardened the real production Start/parry/Pause browser gate and replaced desktop window-size assumptions with true 320×568 CDP mobile emulation.
- **Run 049 — FEATURE:** presentation-only Crimson Shogun Phase I/Blood Moon signature motion.
- **Run 050 — REGRESSION_FIX:** restored Pause to the conventional top-right safe-area/HUD position after direct owner feedback, with button-only hit isolation.
- **Run 051 — BLOCKER_FIX:** aligned the outer browser gate with the accepted top-right Pause contract; exact-head CI #85 and Vercel were green before Run 52 began.

## Runs 052–054 — Animation regression recovery and autonomy gate

- **Run 052 — REJECTED FEATURE:** procedural per-frame Chest/arm/HandR choreography passed automated checks but owner phone evidence exposed a collapsed body/arm/blade hierarchy. The approach is rejected.
- **Run 053 — REGRESSION_FIX:** removed the rejected joint-override layer and restored the pre-Run-52 world-space blade-path baseline without changing combat authority.
- **Run 054 — BLOCKER_FIX:** removed the mistaken mandatory human-test HOLD. Autonomous runs now use the strongest available Preview/browser/runtime evidence; later owner/device evidence can still override when it exposes a real defect.

## Runs 055–057 — Authored four-direction attack pipeline

- **Run 055 — FEATURE:** added original animation-only `samurai-attacks-v1.glb` with `AttackTop/Right/Bottom/Left` on the shared 19-joint hierarchy; no downloaded motion or Run-52-style runtime joint overrides.
- **Run 056 — BLOCKER_FIX:** fixed a floating-point test false failure and prevented generic `Windup/Strike/Recovery` transitions from interrupting a continuous normal `Attack*` track across telegraph → strike → recovery.
- **Run 057 — REGRESSION_FIX:** made the normal authored katana orientation come from the HandR animation hierarchy with one fixed Sword→HandR grip; removed the normal authored world-space Sword rotation override and retained player-facing contact through bounded whole-model depth assist. Node tests passed, but exact-head browser CI #91 exposed insufficient left/right wind-up blade-tip separation, so the run remained unaccepted.

## Run 058 — Restore lateral side-guard readability

**Date:** 2026-08-29  
**Action type:** BLOCKER_FIX  
**Goal:** close the Run 057 exact-head P1 without weakening the grip-lock or directional-read contracts.

### Preflight / blocker evidence

- Incoming exact HEAD: `950065bac28aae59eb1508440b6d4ea76e9ec0db`.
- GitHub Actions CI #91: `npm test` passed; `npm run test:browser` failed on the real PlayCanvas assertion that right/left wind-up blade tips occupy clearly opposite sides. Exact-head GitHub `Vercel` status was success.
- The same-HEAD automated review classified the failure as P1 because directional defense must remain readable from opponent/body/blade animation. Inline review threads were empty.
- New feature work remained prohibited until this exact browser/runtime regression was repaired.

### Delivered repair

- Kept the fixed Sword→HandR local grip and the prohibition on normal authored world-space Sword rotation overrides.
- Retuned only the authored side-guard blade targets used to solve HandR: `AttackRight` and `AttackLeft` now use a stronger mirrored lateral wind-up axis (`±0.90, 0.42, 0.12`) while their contact and follow-through targets remain unchanged.
- This increases pre-commit left/right spatial separation without changing strike timing, contact path, damage, parry windows, STEP, posture, boss phase or score.
- Preserved the existing fail-closed world-space threshold (`right > +0.700`, `left < -0.700`) and added measured right/left blade-tip X values to the browser failure diagnostic instead of lowering the requirement.
- The generated attack pack remains deterministic, local, animation-only and build-generated through the existing Vite config.

### Regression boundary

- Run 52-style direct Chest/arm/HandR runtime overrides remain prohibited.
- The normal authored Sword stays parented to HandR and must retain near-zero post-animation orientation delta.
- All four strikes must still cross the player-facing parry plane; right/left cuts must travel inward from their now-more-lateral guards; bottom must rise and top must cut downward.
- Post-commit exact-head Node/browser CI and Vercel Preview must both be terminal green before another feature run.

## Run 059 — Commit telegraph direction changes to the new authored guard immediately

**Date:** 2026-08-29  
**Action type:** BLOCKER_FIX  
**Goal:** close the remaining Run 058 lateral-read P1 by fixing authored direction-switch transition semantics rather than further exaggerating animation targets or weakening the browser gate.

### Preflight / blocker evidence

- Incoming exact HEAD: `c666e8d2439aa9271be0008e634bbea03156a66a`.
- GitHub Actions CI #92: `npm test` passed, but `npm run test:browser` failed on the retained real PlayCanvas side-read contract. The measured wind-up tips were `rightX=+1.771` and `leftX=+0.471`, while the accepted contract requires right `> +0.700` and left `< -0.700`.
- Exact-head GitHub `Vercel` status was success; PR #1 remained Draft/open/unmerged; inline review threads were empty.
- The same-head automated review identified the cause as the 55 ms telegraph crossfade from the previous authored `AttackRight` state into `AttackLeft`, which left the newly authoritative left read spatially contaminated by the previous-side pose.

### Delivered repair

- Added an explicit authored transition policy: initial base/Idle → `Attack*` telegraph entry retains the existing short 55 ms blend, while an `Attack*` → different `Attack*` telegraph direction/feint change uses a zero-duration commit to the new authored guard.
- Normal telegraph → strike → recovery continuity remains transition-free on the same `Attack*` state; interrupted recovery still deliberately uses the existing `Parry` reaction.
- Kept the fixed Sword→HandR grip, existing side-guard target geometry, world-space tip thresholds, player-facing cut paths and bounded depth assist unchanged.
- Added focused Node coverage for the transition policy while retaining the real browser right→left world-space gate as the acceptance proof.

### Regression boundary

- No Run 52-style direct Chest/arm/HandR per-frame override or normal world-space Sword rotation is reintroduced.
- Combat timing, damage, parry/Perfect windows, STEP, posture, boss phase, score, input, persistence and network/privacy authority remain unchanged.
- The accepted lateral threshold is not weakened. Exact-head Node/browser CI and Vercel Preview must both be terminal green before feature work resumes.

## Run 060 — Evaluate the authored pose before same-draw blade sampling

**Date:** 2026-08-29  
**Action type:** BLOCKER_FIX  
**Goal:** repair the persistent Run 057–059 lateral-read P1 at the actual PlayCanvas animation-evaluation seam instead of changing authored geometry or weakening acceptance thresholds.

### Preflight / blocker evidence

- Incoming exact HEAD: `284714f14987d7b11d17bcf3ae908faa4be571db`.
- GitHub Actions CI #93: `npm test` passed 65/65, but `npm run test:browser` failed with `rightX=+1.765`, `leftX=+0.459` against the retained right `> +0.700` / left `< -0.700` real PlayCanvas contract.
- Exact-head GitHub `Vercel` status was success; PR #1 remained Draft/open/unmerged and the latest automated review kept the issue at P1.
- Inspection of the pinned PlayCanvas `2.21.4` source identified the propagation gap: on a playing layer, setting `activeStateCurrentTime` updates controller/clip time but does not evaluate the pose until the animation-system update. The blade-trajectory adapter samples Sword/HandR immediately after `draw()`, so synchronous right→left contract draws could observe the previous evaluated skeleton even though `activeState` already reported `AttackLeft`.

### Delivered repair

- Added same-draw authored pose synchronization using the PlayCanvas layer's public `playing` and `activeStateCurrentTime` path: temporarily pause only the animation layer, scrub to the authoritative normalized attack time so PlayCanvas evaluates it at zero delta, then restore the previous playing state.
- This keeps the authored `AnimTrack` as the sole normal body/arms/HandR/Sword pose authority and makes the already-existing blade trajectory sample the newly evaluated pose rather than stale previous-direction transforms.
- The zero-delta scrub advances neither combat time nor animation time; initial authored-entry blending, normal telegraph→strike→recovery continuity, direct authored feint switches and interrupted `Parry` recovery semantics remain unchanged.
- Added a lightweight `authoredAttackPoseSync` runtime diagnostic; the existing fail-closed real PlayCanvas right/left blade-tip gate remains unchanged and is the acceptance proof.

### Regression boundary

- No Run 52-style runtime joint manipulation and no normal world-space Sword rotation is reintroduced.
- The fixed Sword→HandR grip, authored guard geometry, player-facing strike paths and ±0.700 lateral thresholds are unchanged.
- Combat timing, damage, parry/Perfect windows, STEP, posture, boss phase, score, input, persistence and network/privacy authority are unchanged.
- The extra evaluation is a zero-delta update of one 19-joint animation layer during the existing renderer draw; post-commit browser CI must confirm both correctness and the broader PlayCanvas contract before feature work resumes.

## Run 061 — Preserve continuous authored forward commitment

**Date:** 2026-08-29  
**Action type:** BLOCKER_FIX  
**Goal:** repair the new exact-head top-strike depth/continuity failure exposed after Run 060 fixed same-draw pose evaluation.

### Preflight / blocker evidence

- Incoming exact HEAD: `1f410dc414e97cfccc6a886b4d7c5f6fbc67a175`.
- GitHub Actions CI #94: `npm test` passed 65/65; `npm run test:browser` failed on the unchanged real PlayCanvas contract `Top strike blade tip did not advance continuously toward the player`.
- Run 060 simultaneously proved its intended lateral repair: measured wind-up tips changed to `rightX=+1.761`, `leftX=-1.249`, clearing the retained `>+0.700 / <-0.700` gate.
- Exact-head GitHub `Vercel` status was success; PR #1 remained Draft/open/unmerged; inline review threads were empty.
- The failure occurs after the real authored pose is now evaluated correctly, so the next repair must preserve that pose authority and the fixed Sword→HandR grip rather than masking the issue with another Sword/joint override.

### Delivered repair

- Retained the existing rigid whole-model depth-assist mechanism, but added an authored-strike **forward-reach floor** anchored to the final telegraph blade-tip Z position.
- Before the established 62% contact point, the floor grows with the existing cut-ease commitment curve to a bounded 1.08 world-unit reach; after contact it releases with the existing follow-through curve. The actual authored pose remains free to advance farther on its own.
- If the animated body/arm pose would temporarily pull the blade behind that floor, only the complete skinned model receives the minimum extra Z assist required, capped by the unchanged 1.10 depth-assist budget. Sword local rotation remains untouched and HandR remains the animation authority.
- The original player-facing parry-plane assist remains active; the stricter existing browser assertions for early/late forward progression, plane crossing, downward top cut, actual world trail and all four directional paths are not weakened.
- Added runtime diagnostics for the computed forward floor and whether the actual tip meets it, without adding any new gameplay timing or animation clock.

### Regression boundary

- No Run 52-style Chest/arm/HandR runtime manipulation and no normal authored world-space Sword rotation is introduced.
- The `AttackTop/Right/Bottom/Left` tracks, same-draw pose synchronization, fixed Sword→HandR grip, lateral side-read thresholds and all combat/input/boss rules remain unchanged.
- The assist moves the complete skinned character rigidly in camera depth only and remains inside the pre-existing 1.10 assist cap; it cannot change hit timing, parry/Perfect windows, damage, STEP, posture, boss phase, score or persistence/network/privacy behavior.
- Exact-head Node/browser CI and Vercel Preview must both be terminal green before feature work resumes.

## Run 062 — Optional rhythm / timing assist

**Date:** 2026-08-29  
**Action type:** FEATURE  
**Goal:** add one visible optional aid for learning incoming rhythm and the existing Perfect-vs-normal parry timing without weakening Normal-mode authored animation or combat rules.

### Preflight / selection evidence

- Incoming exact HEAD: `883ff199e084a1b83343952da384dfd1df7286a6`.
- GitHub Actions CI #95 was terminal green for both `npm test` (65/65) and the complete production/browser PlayCanvas gate; exact-head GitHub `Vercel` status was success.
- Draft PR #1 remained open/Draft/unmerged; inline review threads were empty and the exact-head automated review reported no actionable P0/P1/P2 finding.
- Candidate scoring favoured the already-approved timing-aid backlog slice over balance tuning (insufficient evidence to alter difficulty) and endless/challenge mode (larger scope/risk): high visible impact, direct learning value, high confidence, and a bounded presentation-only implementation.

### Delivered slice

- Added a default-off **節拍提示** start-screen toggle below 刀路清晰, stored only as a local preference with blocked-storage fallback.
- When enabled, one hollow pointer-transparent ring shrinks from a larger preparation radius to a fixed target using the authoritative `CombatEngine.phaseProgress()` telegraph clock. A small direction marker follows `currentAttack.displayedDirection`, so the existing Ronin feint resolution remains authoritative.
- At strike start the ring reaches the target and shows **完美** only while elapsed strike time remains inside the enemy's existing `perfectWindowMs`; afterward it changes to **格擋** for the remaining legal strike. No timing value is copied, widened or replaced.
- The assist clears outside telegraph/strike, uses no wall-clock timer, and therefore freezes naturally with the existing Pause game clock. Reduced motion keeps a static preparation ring plus discrete strike-state changes.
- Added focused Node tests for telegraph shrink, Ronin feint direction authority, Perfect/normal timing boundary and presentation-only state; added a 320×568 browser harness plus production initialization/layout fail-closed checks.

### Regression boundary

- Default-off means the existing Normal combat presentation is unchanged unless the player explicitly enables the aid.
- No change to parry/Perfect windows, enemy telegraph/strike timing, damage, reach, STEP, posture, boss phase, score, input mapping, authored animation, blade trajectory, persistence schema or network/privacy boundary.
- The overlay is pointer-transparent, reuses one fixed ring/layer without per-frame DOM allocation, and stays visually hollow so the opponent/blade path remain readable.
- Exact-head Node/browser CI and Vercel Preview must both be terminal green before another feature run.

## Run 063 — Make default-off timing assist truly idle

**Date:** 2026-08-29  
**Action type:** BLOCKER_FIX  
**Goal:** close the current-head performance P2 so opting out of 節拍提示 does not add continuous DOM work to normal combat.

### Preflight / blocker evidence

- Incoming exact HEAD: `999f656846525d0566ad2384c35a93f35ad232cb`.
- GitHub Actions CI #96 was terminal green for both Node and browser gates; exact-head GitHub `Vercel` status was success and Draft PR #1 remained open/Draft/unmerged.
- Inline review threads were empty. The same-head Second Hourly review reported one actionable P2: `CombatEngine.update()` still called timing-assist render code every live frame even while the default-off preference was disabled, causing avoidable DOM queries/writes on the primary mobile surface.
- Because that finding affects the documented default-off/no-normal-session-impact and mobile-performance boundary, it is handled before any new feature work.

### Delivered repair

- Cached the timing-assist toggle/ring/marker/label references once at UI installation instead of querying those nodes on every enabled frame.
- Engine start/reset/update wrappers still remember the latest engine/time so toggle-on can synchronize immediately, but they now return from timing-assist syncing before frame derivation or DOM rendering whenever the assist is disabled.
- The initial disabled state renders once. Toggling off clears the ring and off-state datasets once, then later engine updates remain timing-assist DOM-idle; toggling on resumes authoritative CombatEngine-clock updates immediately.
- Repeated enabled renders now skip unchanged toggle, phase, direction and scale writes where possible while retaining the continuously changing telegraph scale when it is actually visible.
- Extended the existing browser timing-assist harness with a `MutationObserver` regression proving: default-off engine updates cause zero timing-assist DOM mutations after setup; toggle-on activates the existing live timing checks; toggle-off clears once; subsequent updates remain idle.

### Regression boundary

- No parry/Perfect window, enemy timing, damage, reach, STEP, posture, boss phase, score, input routing, authored animation, blade trajectory, persistence or network/privacy rule changes.
- No second timer/clock is introduced; enabled timing still derives only from the existing CombatEngine clock and Pause semantics remain unchanged.
- The player-visible assist, Ronin feint direction authority, Perfect-vs-normal state, reduced-motion behavior, pointer safety and 320×568 layout remain covered by the existing browser gate.
- Post-commit exact-head Node/browser CI and Vercel Preview must both be terminal green before the next feature run.
