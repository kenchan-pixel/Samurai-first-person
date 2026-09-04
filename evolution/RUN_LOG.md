# Evolution Run Log

This log is intentionally concise. Full diffs, exact SHAs, CI receipts and Preview links remain in Git history and Draft PR #1. Historical long-form entries are compacted after acceptance; no product rule is removed from `docs/CURRENT_BASELINE.md` or `docs/REGRESSION_CHECKLIST.md`.

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

- Runs 043–051: mobile Combat UX simplification, true Pause clock, production-browser hardening, Shogun signature motion and top-right Pause restoration.
- Run 052 rejected after physical-phone evidence exposed collapsed body/arm/blade hierarchy; Run 053 restored the usable animation baseline; Run 054 removed mistaken mandatory-human-test HOLD semantics.
- Runs 055–061: authored AttackTop/Right/Bottom/Left, continuous Attack* playback, fixed HandR/Sword hierarchy, lateral-read repair, same-draw pose evaluation and bounded forward commitment.
- Runs 062–064: optional 節拍提示 plus disabled-path DOM-idle and deterministic browser-harness repair.

## Runs 065–100 — Blade semantics, delivery recovery, handedness, challenge, dojo and owner repairs

- Runs 065–069: player-facing Guard/directional cut semantics, semantic SOT smoke, actual-Sword afterimages and reduced-motion cleanup.
- Runs 070–074: bounded Vercel recovery, architecture reconciliation, persistent STEP handedness, safe-area repair and 320×568 coverage.
- Runs 075–089: eight-duel challenge, 氣勢/不屈, 今日陣, tactical choice, 宿敵步速, Oni/Blood Moon practice and 師範弱點再練.
- Runs 090–093: production practice orchestration, 四向防守 and normal-practice capture repair.
- Runs 094–098: heavy-attack presentation/acceptance, exact-head build receipt recovery, Bottom/STEP repair and bounded 60–110 ms near-contact normal-parry buffer.
- Run 099: connected authored Top/Bottom vertical katana choreography with fixed Sword→HandR grip.
- Run 100: explicit local result 分享 through Web Share/clipboard with no account, persistence, analytics or background network request.

## Runs 101–113 — Closed Beta readiness and combat-read refinement

- Runs 101–107: session-only 修行進度, DOM ownership repair, local/export-only feedback, 封測資訊, local records, storage-denied startup and weak-direction repeat coaching.
- Runs 108–112: session-only 封測 0/3 progress, terminal/bootstrap/DOM ownership repairs and challenge/今日陣 戰策回顧 with cumulative 320×568 acceptance.
- Run 113: presentation-only measured / standard / quick / heavy attack-tempo readability from unchanged authoritative timing. Exact HEAD `d16d4c8663695d51c8d2ff924346c257d0ed6c05` passed Actions CI #159 and exact-head Vercel.

## Runs 114–119 — Feint continuity and Perfect technique identity

- Runs 114–118 replaced abrupt Ronin mid-telegraph hard cuts with a bounded 50 ms authored full-rig crossfade, then repaired stale/contaminated PlayCanvas acceptance until clean Guard→direction, lateral authored-contact travel and real LEFT→RIGHT feint evidence passed without relaxing blade/grip/travel thresholds or changing combat timing.
- Run 119 added separate transient Perfect Parry `破` / Perfect STEP `閃` identities on the existing action cue. Exact HEAD `d0a4e5b93ed3dcdfe5190e69ee2ce003915de37e` passed Actions CI #165 / run `33853876903`, exact-head GitHub `Vercel` status was success, inline review threads were empty and the same-head All Repos review reported no actionable P0/P1/P2 finding.

## Run 120 — Direction-aware first-person two-hand brace

**Date:** 2026-09-04  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `d0a4e5b93ed3dcdfe5190e69ee2ce003915de37e`.
- Exact-head Actions CI #165 / run `33853876903` is terminal **success** and exact-head GitHub `Vercel` status is terminal **success**. The direct Vercel project enumeration remains unavailable, so the GitHub status is the authoritative deployment signal.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, inline review threads are empty, and the latest same-head All Repos review reports **No actionable P0/P1/P2 finding**. Feature work is therefore allowed.
- Candidate scoring: (1) **direction-aware first-person two-hand bracing** **22/25** (visible impact 5, goal 5, novelty 4, confidence 4, safety 4); (2) further Closed Beta diagnostics/export polish **19/25** (impact 3, goal 4, novelty 4, confidence 4, safety 4); (3) opponent difficulty/challenge tuning **15/25** (impact 5, goal 5, novelty 3, confidence 1, safety 1) because current SOT still requires repeated practice/challenge evidence before balance changes. Candidate 1 wins. Source inspection provides a concrete implementation gap: `player-weapon-fidelity.js` already receives the player direction index but previously ignored it, while the backlog explicitly prioritises first-person grip readability.

### Implementation

- Added pure `src/player-weapon-pose.js` with a bounded four-direction foreground support pose family layered on the existing player katana action progress. TOP raises both support hands/forearms, BOTTOM lowers them, RIGHT/LEFT mirror a compact lateral brace, Perfect Parry strengthens the same direction family, and counter follow-through stays bounded.
- `src/player-weapon-fidelity.js` now applies the complete hand/forearm/wrist-guard pose after the authoritative PlayCanvas player katana rig draws. The established blade/root direction motion remains authoritative; the new support offsets only improve embodiment and return to the neutral grip when the action completes.
- Added deterministic tests for neutral preservation, top/bottom vertical separation, right/left mirroring, Perfect strength, bounded counter motion and clean return to the base grip across all four directions.
- No enemy animation, Sword→HandR grip, player input mapping, combat timing, damage, posture, Perfect/STEP windows, reach, scoring, persistence, privacy or network behaviour changed. Existing 320×568 production renderer/browser gates remain cumulative.
- Updated Current Baseline, changelog/backlog, state and this run log inside the same implementation tree.

### Verification boundary

- Incoming exact-head CI/Vercel/review gates were green. The connector execution surface has no local repository checkout, so exact-head GitHub Actions `npm test` + complete `npm run test:browser` and exact-head Vercel are required after the single branch commit before Run 120 is accepted.
- No second bookkeeping commit is permitted; the Draft-PR run comment is the authoritative post-commit receipt.

## Run 121 — Real PlayCanvas acceptance for directional first-person grip

**Date:** 2026-09-04  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `52137540794694c8e7900cef66d54ce5cfedd78f`.
- Exact-head Actions CI #166 / run `33859405982` is terminal **success** and exact-head GitHub `Vercel` status is terminal **success**. Draft PR #1 remains open/Draft/unmerged, `main` remains untouched and inline review threads are empty.
- The latest same-head Second Hourly review reports one actionable **P2**: Run 120's player-visible two-hand brace is covered by pure pose tests but not by a focused real 320×568 PlayCanvas/mobile integration gate. Because the risk is visible hand/forearm detachment, obstruction or runaway local transforms, feature work is prohibited until this acceptance gap is repaired.

### Blocker repair

- Extended the existing `?browser-smoke=renderer-motion` path rather than adding a separate broad suite. After the established renderer contract passes, it now runs a focused `player-grip-renderer-contract-smoke.js` sub-contract on the same 320×568 production PlayCanvas stack; any import/runtime/sub-contract failure flips the authoritative renderer-motion result to fail.
- The sub-contract drives real `CombatEngine` normal parries in TOP/RIGHT/BOTTOM/LEFT, one real Perfect Parry, one accepted opposite-direction counter and neutral cleanup. It samples the actual live `PlayerForearmR/L`, `PlayerHandR/L` and `PlayerCuffR/L` transforms parented to `PlayerSwordRig`, verifies Top/Bottom and Right/Left separation, Perfect-strength identity, compact hand spacing, bounded local position/rotation budgets and exact return to the authored neutral pose.
- No production combat, player animation values, input mapping, timing, damage, posture, STEP, scoring, persistence, privacy or network behaviour changed. This run only makes the existing player-visible Run 120 slice fail closed when its real renderer integration is broken.
- State and this run log are updated in the same blocker-fix tree; no product baseline rule changes because player behaviour is unchanged.

### Verification boundary

- Exact-head post-commit Actions `npm test` + complete `npm run test:browser` and exact-head Vercel status are required before Run 121 is accepted. The one-commit rule prohibits a second bookkeeping commit; the Draft-PR run comment is the authoritative post-commit receipt.

## Run 122 — Isolate and strengthen first-person grip acceptance

**Date:** 2026-09-04  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `0300c3f48dad51773ba87943cbbab6b52022ff52`.
- Exact-head Actions CI #167 / run `33863727134` is terminal **failure**: `npm test` passes **143/143**, then `npm run test:browser` times out on `/?browser-smoke=renderer-motion` before the renderer/grip document can emit a pass/fail receipt. Exact-head GitHub `Vercel` status is terminal **success**.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched and inline review threads are empty. The latest same-head Second Hourly review identifies two actionable findings: **P1** the new sequential second PlayCanvas app in the renderer-motion document is the concrete lifecycle seam causing acceptance to fail; **P2** same-parent/bounded transforms alone do not prove hand alignment to the live katana handle or projected 320×568 blade-read visibility. Feature work is prohibited.

### Blocker repair

- Restored `?browser-smoke=renderer-motion` to the established renderer contract only. The player-grip contract now has its own `?browser-smoke=player-grip` route and its own CDP mobile browser process in `npm run test:browser`, matching the already-proven focused heavy/rhythm gate pattern. One browser document no longer serially creates/destroys the renderer contract app and then another full grip `View`.
- Strengthened the live PlayCanvas grip contract without lowering any Run 121 threshold. Every normal four-direction parry plus Perfect Parry/counter still proves directional separation, bounded local transforms, compact two-hand spacing and neutral return. It now additionally measures each live hand against the world-space `PlayerPommel → PlayerHabaki` handle axis and fails on radial/longitudinal drift.
- Added real camera projection from live render AABBs at the required 320×568 viewport. The gate requires support, handle and player-blade geometry to intersect the viewport and requires the projected blade to retain readable extension beyond the support silhouette, providing a basic fail-closed visibility/occlusion sanity check while leaving subjective polish to Preview inspection.
- No production combat/presentation values, input, timing, damage, posture, STEP, scoring, persistence, privacy or network behaviour changed; this run only repairs and strengthens acceptance infrastructure for the existing Run 120 slice.

### Verification boundary

- Exact-head post-commit Actions `npm test` + complete `npm run test:browser`, including the dedicated player-grip process, and exact-head Vercel status are required before Run 122 is accepted. The one-commit rule prohibits a second bookkeeping commit; the Draft-PR run comment is the authoritative post-commit receipt.

## Run 123 — Keep the live TOP katana handle inside portrait framing

**Date:** 2026-09-04  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `af1e990e60e05e4ceae2033251c405765a686e00`.
- Exact-head Actions CI #168 / run `33868173692` is terminal **failure**. `npm test` passes **143/143** and the restored broad PlayCanvas renderer smoke passes; the dedicated `?browser-smoke=player-grip` process then fails fast because **TOP parry live handle geometry has no intersection with the required 320×568 viewport**. Exact-head GitHub `Vercel` status is terminal **success**.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched and inline review threads are empty. The latest same-head review treats the off-screen TOP handle as actionable **P1** and explicitly requires production player-grip/rig/camera composition repair while preserving the handle-axis, two-hand spacing, directional and blade-read thresholds. Feature work is prohibited.
- Source inspection confirms the authoritative PlayCanvas TOP parry keeps the camera-child `PlayerSwordRig` on the right-side portrait composition while rotating toward an almost vertical guard. The support silhouette can still enter frame through its wider child geometry, but the compact handle itself is the element exposed by the stronger Run 122 projection gate.

### Blocker repair

- `player-weapon-fidelity.js` now applies one smooth bounded camera-local leftward framing correction only to normal/Perfect **TOP** parry. At peak brace the correction is `-0.22` local X and follows the existing parry pulse, so it is zero at action start/completion; RIGHT/LEFT/BOTTOM parry and all attack/counter actions are unchanged.
- The correction moves the complete `PlayerSwordRig` after the authoritative draw rather than shifting individual blade, grip or support pieces. `PlayerBlade`, `PlayerGrip`, pommel/habaki and both hands/forearms therefore remain attached and move together; the existing hand-to-handle-axis and neutral-return contracts are not bypassed.
- No player direction mapping, input, combat timing, damage, posture, Perfect/STEP window, reach, score, persistence, privacy, enemy animation or network behaviour changed. The fail-closed 320×568 player-grip visibility/attachment assertions are unchanged.
- State and this run log are updated in the same implementation tree. No product baseline rule changes are required because this repairs the existing Run 120 first-person grip/readability baseline rather than introducing a new mechanic or authority seam.

### Verification boundary

- Exact-head post-commit Actions `npm test` + complete `npm run test:browser`, especially the dedicated player-grip projection/attachment process, and exact-head Vercel status are required before Run 123 is accepted. The one-commit rule prohibits a second bookkeeping commit; the Draft-PR run comment is the authoritative post-commit receipt.

## Run 124 — Keep the BOTTOM counter katana inside portrait framing

**Date:** 2026-09-04  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `6b062dda5e4dea27704e319e39b0ee25e111af88`.
- Exact-head Actions CI #169 / run `33872969506` is terminal **failure**. `npm test` passes **143/143** and the broad PlayCanvas renderer smoke passes. The dedicated `?browser-smoke=player-grip` process advances beyond Run 123's repaired TOP-handle check, then fails because the real **BOTTOM counter `PlayerBlade` has no geometry intersecting the required 320×568 viewport**. Exact-head GitHub `Vercel` status is terminal **success**.
- Direct Vercel project enumeration still returns no projects, so the exact-head GitHub `Vercel` commit status remains the authoritative deployment signal. Draft PR #1 remains open/Draft/unmerged, `main` remains untouched and inline review threads are empty.
- The latest same-head review treats the BOTTOM counter framing defect as actionable **P1** and requires the live blade, handle and two-hand support to remain meaningfully in-frame through counter follow-through while preserving pommel→habaki hand alignment, directional separation, combat timing/input/damage semantics, neutral return and the fail-closed projection thresholds. Feature work is prohibited.

### Blocker repair

- Moved portrait framing into the pure player weapon pose family so TOP parry and BOTTOM counter share the same action progress/pulse and cannot leave a residual offset. The accepted normal/Perfect TOP correction stays exactly `-0.22` local X at peak.
- BOTTOM action/counter now adds a bounded peak `-0.30` local X and `+0.10` local Y correction to the complete camera-child `PlayerSwordRig`. The correction is zero at action start/completion and does not change the authored directional rotation; `PlayerBlade`, `PlayerGrip`, pommel/habaki and both support hands/forearms translate together.
- Deterministic tests pin the action/direction scope, exact peak offsets and zero-at-endpoints behaviour. RIGHT/LEFT counter framing remains unchanged. Existing real 320×568 grip/handle/blade projection, blade-extension, hand-axis, spacing and neutral-return assertions are not relaxed.
- No player input mapping, counter eligibility, combat timing, damage, posture, Perfect/STEP windows, reach, scoring, persistence, privacy, enemy animation or network behaviour changed. State and this run log are updated in the same implementation tree; no product baseline rule changes are required because this repairs the existing first-person grip/readability baseline.

### Verification boundary

- Exact-head post-commit Actions `npm test` + complete `npm run test:browser`, especially the dedicated player-grip projection/attachment process, and exact-head Vercel status are required before Run 124 is accepted. The one-commit rule prohibits a second bookkeeping commit; the Draft-PR run comment is the authoritative post-commit receipt.

## Run 125 — Separate BOTTOM counter support from the blade read

**Date:** 2026-09-04  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `3c8bb36e8f348b4196d973c931664a4d17a541ee`.
- Exact-head Actions CI #170 / run `33878106004` is terminal **failure**. `npm test` passes **144/144** and the broad PlayCanvas renderer smoke passes; the dedicated `?browser-smoke=player-grip` gate now confirms the BOTTOM counter blade is in-frame but fails the unchanged 24 px projected blade-extension requirement because the support silhouette still covers the cut.
- Exact-head GitHub `Vercel` status is terminal **success**. Direct Vercel project enumeration again returns no projects, so the GitHub exact-head status remains the authoritative deployment signal.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched and inline review threads are empty. The latest same-head Second Hourly review reports one actionable **P1** matching the failed gate and no additional actionable P0/P1/P2. Feature work is prohibited.

### Blocker repair

- Kept the accepted Run 123/124 whole-rig portrait framing unchanged. BOTTOM counter now adds one bounded support-only catch-back: all six visible support parts trail `-0.06` local Y along the katana handle axis at peak action and return with the shared pulse.
- The authoritative `PlayerSwordRig` still owns the BOTTOM cut orientation/path. The new relative support motion does not rotate or steer `PlayerBlade`, alter the counter direction, or move hands independently from the handle-axis choreography; hands, cuffs and forearms trail together toward the pommel so the rising blade can remain visible through follow-through.
- Added deterministic scope/budget coverage proving the extra trail applies only to BOTTOM counter, gives every support part meaningful separation, keeps the tightest left forearm inside the established `-0.68` local-Y renderer budget, leaves RIGHT counter unchanged and still returns to the exact neutral pose.
- Existing real 320×568 viewport, 24 px blade-extension, hand-to-handle-axis, hand-spacing, direction, neutral-return and transform thresholds are unchanged. No input, combat timing, damage, posture, Perfect/STEP, reach, scoring, persistence, privacy, enemy animation or network behaviour changed.

### Verification boundary

- The focused pure pose test passes locally in isolation (7/7). Exact-head post-commit Actions `npm test` + complete `npm run test:browser`, especially the unchanged dedicated player-grip projection/attachment gate, and exact-head Vercel status are required before Run 125 is accepted.
- The one-commit rule prohibits a second bookkeeping commit; the Draft-PR run comment is the authoritative post-commit receipt.

## Run 126 — Correct BOTTOM support projection and harden Boss browser timing

**Date:** 2026-09-04  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `1c64358b9fda97d255e83a4e88e4e8fd8b480087`.
- Exact-head Actions CI #171 / run `33883915264` is terminal **failure** while exact-head GitHub `Vercel` status is terminal **success**. `npm test` passes **145/145**. In the first browser attempt the broad smoke passes but the unchanged dedicated 320×568 player-grip gate still fails the BOTTOM 24 px projected blade-extension assertion; the single bounded rerun then fails earlier in the Boss reduced-motion/event-stream browser integration.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched and inline review threads are empty. The latest same-head Second Hourly review reports actionable **P1**: the Run 125 support shift did not close the BOTTOM blade-read blocker and no exact current HEAD has a green complete browser suite. Feature work is prohibited.

### Blocker repair

- Kept the accepted TOP/BOTTOM whole-rig framing, BOTTOM cut orientation/path and every live 320×568 threshold unchanged. Source/contract inspection showed the Run 125 catch-back moved every support part farther toward the pommel even though the BOTTOM follow-through rotates the handle through the failing projected blade/support relationship. Run 126 reverses only that relative support motion: at BOTTOM-counter peak, both forearms, both hands and both cuffs advance `+0.10` local Y toward the habaki/tsuba and return with the same pulse.
- The two hands still move along the existing pommel→habaki handle axis rather than radially away from it; RIGHT/LEFT/TOP paths, hand spacing, whole-rig framing and neutral return are unchanged. The authoritative blade remains untouched. Focused pure pose coverage now proves all six support parts advance meaningfully only for BOTTOM counter, remain inside the existing transform budget and return exactly to neutral.
- Hardened the existing Boss browser harness without changing production timers or pass semantics. Instead of sampling the 1150 ms Phase-II banner cleanup and 900 ms final-atmosphere cleanup at one fixed instant, the harness polls the real DOM cleanup conditions with explicit 1500 ms / 1250 ms ceilings. This preserves a bounded lifetime contract while removing CI scheduling jitter that could prevent the suite reaching the player-grip gate.
- No 24 px blade-extension, viewport, handle-axis, spacing, direction, timing, damage, posture, Perfect/STEP, reach, scoring, persistence, privacy, enemy animation or network threshold was lowered.

### Verification boundary

- The focused pure player-weapon pose test passes locally in isolation (7/7). The execution surface has no networked repository checkout, so the complete dependency-backed browser suite cannot be run before the one permitted Git commit.
- Exact-head post-commit Actions `npm test` + complete `npm run test:browser`, especially both the Boss event-stream and dedicated player-grip projection/attachment gates, plus exact-head Vercel status are required before Run 126 is accepted. The Draft-PR run comment is the authoritative post-commit receipt; no second bookkeeping commit is permitted.

## Run 127 — Restore the real BOTTOM lower-to-upper counter path

**Date:** 2026-09-05  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `1dbd3af3dba78a78ce2f382b6fd3a930275bde17`.
- Exact-head Actions CI #172 / run `33889599704` is terminal **failure** while exact-head GitHub `Vercel` status is terminal **success**. `npm test` remains **145/145** green; on the bounded retry the broad browser/Boss paths pass and the dedicated 320×568 player-grip gate still fails the unchanged BOTTOM 24 px projected blade-extension assertion.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, Preview feedback reports zero unresolved items and inline review threads are empty. The latest same-head Second Hourly review classifies the failed exact-head browser acceptance as actionable **P1**. Feature work is prohibited.
- Source inspection shows Runs 125/126 were compensating at the support silhouette while the authoritative player katana path still applied the same `+92°` action-3 pulse sweep to all four directions. BOTTOM begins 180° opposite TOP but therefore sweeps in the same rotational sense, conflicting with the intended lower-origin → upper-contact cut and with the live projection gate.

### Blocker repair

- Changed only the authoritative first-person **BOTTOM counter** sweep direction: action 3 now uses `-92°` at BOTTOM while TOP/RIGHT/LEFT keep the established `+92°`. The BOTTOM blade therefore rises toward the shared contact line instead of carrying the lower-origin orientation farther through the same generic rotation.
- Removed the Run 126 `+0.10` support advance. Both hands/forearms/cuffs again use the established bounded downward BOTTOM brace, stay on the same handle choreography and return to neutral; the blade rather than a handle-space support translation now owns the readable rising lane.
- The accepted Run 123/124 whole-rig portrait framing remains unchanged. Combat direction/input/timing/damage/posture/STEP/reach/score/persistence/network authority are untouched, and the existing 320×568 viewport, handle-axis, two-hand spacing and **24 px blade-extension** thresholds are not weakened.
- Focused pure player-weapon pose tests pass **7/7** before commit. The dependency-backed PlayCanvas browser gate remains authoritative post-commit evidence for the actual projected blade path.

### Verification boundary

- Exact-head post-commit Actions `npm test` + complete `npm run test:browser`, including the unchanged Boss and dedicated player-grip gates, plus exact-head Vercel status are required before Run 127 is accepted.
- The one-commit rule prohibits a second bookkeeping commit; the Draft-PR run comment is the authoritative post-commit receipt.

## Run 128 — Keep the RIGHT parry katana inside portrait framing

**Date:** 2026-09-05  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `1609cdbf0495d24abe2716460630cb27822a9d49`.
- Exact-head Actions CI #173 / run `33895712983` is terminal **failure** while exact-head GitHub `Vercel` status is terminal **success**. `npm test` remains **145/145** green; the complete browser suite reaches the dedicated 320×568 player-grip gate and fails at **RIGHT normal parry** because the live `PlayerBlade` has no geometry intersecting the viewport.
- Direct Vercel deployment enumeration for the known project/team returns **403**, so the exact-head GitHub `Vercel` commit status is the authoritative deployment signal. Unresolved Vercel toolbar feedback is empty. Draft PR #1 remains open/Draft/unmerged, `main` remains untouched and inline review threads are empty.
- The latest same-head ChatGPT review classifies this as actionable **P1** and explicitly requires repairing the real RIGHT player-blade projection/pose without weakening the existing 320×568 blade/handle/support/attachment thresholds. Feature work is prohibited.
- Source inspection confirms RIGHT parry reaches its peak with the first-person rig still right-biased while the blade arc rotates toward positive screen X. Unlike TOP, there was no whole-rig portrait correction for this parry family, so the strengthened Run 122 projection gate exposes a real composition hole.

### Blocker repair

- Added one bounded camera-local **`-0.52` X** framing correction only to normal/Perfect RIGHT parry. It uses the existing action pulse, so the offset is zero at action start/completion and reaches its maximum only around the visible parry brace.
- The correction moves the complete `PlayerSwordRig` after the authoritative PlayCanvas action pose. `PlayerBlade`, `PlayerGrip`, pommel/habaki and both support hands/forearms therefore translate together; the established RIGHT support choreography, direction identity and hand-to-handle attachment are not bypassed.
- TOP's accepted `-0.22` parry correction, BOTTOM counter's accepted `-0.30/+0.10` framing and restored `-92°` rising sweep, LEFT framing, combat input/timing/damage/posture/STEP/reach/score/persistence/network authority are unchanged. The live 320×568 support/handle/blade intersection, 24 px blade-extension, handle-axis, spacing, bounded-transform and neutral-return assertions are unchanged.
- Focused pure player-weapon tests pass **7/7** before commit and now pin normal/Perfect RIGHT peak framing plus zero-at-endpoints behaviour. The execution surface has no dependency-backed repository checkout, so the real PlayCanvas projection remains authoritative post-commit evidence.

### Verification boundary

- Exact-head post-commit Actions `npm test` + complete `npm run test:browser`, including the unchanged dedicated player-grip gate through RIGHT, BOTTOM, LEFT and Perfect paths, plus exact-head Vercel status are required before Run 128 is accepted.
- The one-commit rule prohibits a second bookkeeping commit; the Draft-PR run comment is the authoritative post-commit receipt.
