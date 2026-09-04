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

## Runs 120–126 — Direction-aware first-person grip and acceptance hardening

- Run 120 added a bounded four-direction first-person two-hand support brace layered on the authoritative katana action path; normal/Perfect parries and counters return to the established neutral grip without changing combat authority.
- Runs 121–122 added then isolated a dedicated real 320×568 PlayCanvas player-grip browser process, enforcing bounded support transforms, hand spacing, pommel→habaki hand-axis attachment, support/handle/blade viewport intersection, projected blade extension and neutral return without weakening production combat rules.
- Runs 123–124 repaired concrete TOP parry and BOTTOM-counter portrait framing by moving the complete `PlayerSwordRig`, preserving blade/handle/support attachment.
- Runs 125–126 investigated BOTTOM-counter support/blade occlusion and hardened the Boss browser timing harness; those support-only counter experiments were superseded by Run 127's authoritative blade-path correction. Exact diffs, CI receipts and run comments remain in Git history and Draft PR #1.

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

## Run 129 — Restore BOTTOM parry support and blade readability

**Date:** 2026-09-05  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `53d6954fda29a6172072c5e70e5e5c82ab0d89b9`.
- Exact-head Actions CI #174 / run `33901136466` is terminal **failure** while exact-head GitHub `Vercel` status is terminal **success**. `npm test` remains **145/145** green; the browser suite advances past the repaired TOP, BOTTOM-counter and RIGHT paths, then the dedicated 320×568 player-grip gate fails at **BOTTOM normal parry** because the live two-hand support silhouette has no geometry intersecting the viewport.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, unresolved inline review threads are empty and Vercel toolbar feedback reports zero unresolved items. The latest same-head review classifies the exact failure as actionable **P1**. Feature work is prohibited.
- Source inspection identifies a BOTTOM-only choreography root cause: the generic parry formula reaches `-34 + 180*0.55 + 38 = 103°` at peak, uniquely carrying the katana past a 90° lower guard. The blade therefore drops below the support while the support projects toward/outside the portrait edge; a translation-only repair would risk passing support visibility while failing the unchanged 24 px blade-extension gate.

### Blocker repair

- Added a BOTTOM normal/Perfect-parry whole-rig portrait correction at the existing action pulse: peak `-0.52` local X and `+0.10` local Y. Blade, grip, pommel/habaki, both hands, cuffs and forearms translate together and the correction is exactly zero at action start/completion.
- Added one bounded BOTTOM normal/Perfect-parry `-20°` whole-rig roll correction at the same pulse. Peak presentation becomes about `83°`, retaining a distinct lower-guard identity without carrying the blade below the support. The correction rotates the complete `PlayerSwordRig`, so handle-axis and two-hand attachment are preserved rather than faked by moving support parts independently.
- Pure pose coverage now pins normal/Perfect BOTTOM framing, the bounded roll, zero-at-endpoint return and unchanged BOTTOM counter scope. The existing real 320×568 support/handle/blade intersection, 24 px blade-extension, hand-axis, spacing, transform and neutral-return thresholds are not relaxed.
- TOP/RIGHT framing, LEFT, the restored BOTTOM `-92°` rising counter, combat input/direction/timing/damage/posture/STEP/reach/score/persistence/network authority are unchanged. Focused pure player-weapon tests pass **7/7** before commit.

### Verification boundary

- Exact-head post-commit Actions `npm test` + complete `npm run test:browser`, including the unchanged player-grip path through BOTTOM normal/Perfect and all later gates, plus exact-head Vercel status are required before Run 129 is accepted.
- The one-commit rule prohibits a second bookkeeping commit; the Draft-PR run comment is the authoritative post-commit receipt.

## Run 130 — Increase BOTTOM parry blade/support separation

**Date:** 2026-09-05  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `07259684bb12aee51aef4ce6ce6a56647f4c30a2`.
- Exact-head Actions CI #175 / run `33907050792` is terminal **failure** while exact-head GitHub `Vercel` status is terminal **success**. `npm test` passes **145/145** and the broad browser smoke passes. The dedicated real 320×568 player-grip gate now confirms BOTTOM normal-parry support, handle and blade geometry all intersect the viewport, then fails the unchanged **24 px projected blade-extension** requirement because the two-hand silhouette still obscures too much of the blade.
- Direct Vercel deployment enumeration for the known project/team returns **403**, so the exact-head GitHub `Vercel` commit status is the authoritative deployment signal. Unresolved Vercel toolbar feedback is empty. Draft PR #1 remains open/Draft/unmerged, `main` remains untouched and inline review threads are empty.
- The latest same-head All Repos review classifies the exact blade-readability failure as actionable **P1** and reports no separate actionable P0/P2 issue. Feature work is prohibited.
- Source inspection narrows the remaining defect to screen-space orientation rather than missing geometry or attachment. The authoritative BOTTOM normal/Perfect peak is about `103°`; Run 129's `-20°` complete-rig correction leaves it near `83°`, where the blade remains almost horizontal relative to the support silhouette even though the whole group is now inside portrait framing.

### Blocker repair

- Kept Run 129's accepted BOTTOM normal/Perfect whole-rig portrait translation exactly `-0.52` local X / `+0.10` local Y at peak and changed only the pulse-shaped whole-rig roll correction from `-20°` to `-26°`. Peak presentation is therefore about `77°`, preserving a distinct lower-guard diagonal while giving the live blade more vertical screen-space extension above the hands/forearms.
- The correction still rotates the complete `PlayerSwordRig` after the authoritative PlayCanvas action pose. `PlayerBlade`, `PlayerGrip`, pommel/habaki and both support hands/forearms remain attached and return to the unchanged neutral pose; no support-only offset or fake blade translation is introduced.
- Deterministic pose coverage pins the new normal/Perfect BOTTOM `-26°` peak correction and unchanged zero-at-endpoints / BOTTOM-counter scope. TOP/RIGHT/LEFT presentation, the restored BOTTOM `-92°` rising counter, player direction/input, combat timing/damage/posture/Perfect/STEP/reach/scoring, persistence/privacy/network behaviour and every real 320×568 threshold remain unchanged.

### Verification boundary

- The connector execution surface has no dependency-backed repository checkout, so exact-head GitHub Actions `npm test` + complete `npm run test:browser`, especially the unchanged player-grip 24 px blade-extension/attachment path through normal and Perfect BOTTOM, plus exact-head Vercel status are required after the one permitted commit before Run 130 is accepted.
- No second bookkeeping commit is permitted; the Draft-PR run comment is the authoritative post-commit receipt.

## Run 131 — Tuck the BOTTOM parry dominant support below the blade lane

**Date:** 2026-09-05  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `6ab0cfc601f48bb3490255da75e34b0fe230f632`.
- Exact-head Actions CI #176 / run `33911572070` is terminal **failure** while exact-head GitHub `Vercel` status is terminal **success**. `npm test` passes **145/145** and the broad browser smoke remains green; the dedicated real 320×568 player-grip gate still fails the unchanged **>24 px projected BOTTOM normal-parry blade-extension** requirement because the support silhouette obscures too much of the blade.
- Direct Vercel deployment enumeration for the known project/team returns **403**, so the exact-head GitHub `Vercel` commit status is the authoritative deployment signal. Unresolved Vercel toolbar feedback and inline PR review comments are empty. Draft PR #1 remains open/Draft/unmerged and `main` remains untouched.
- The latest same-head review classifies the exact failure as actionable **P1** with no separate P0/P2 and explicitly says to stop relying on whole-rig framing/roll alone: relative BOTTOM support-hand/forearm choreography or another legitimate weapon-pose seam must create the required blade/support separation without weakening the 24 px gate.
- Source inspection confirms that at Run 130's roughly `77°` BOTTOM peak the dominant/right support's positive local X projects upward into the blade-read lane. Whole-rig translation/roll cannot change this relative relationship. The right hand is already well inside the live pommel→habaki radial budget, so moving that support toward the handle centre is the bounded repair seam.

### Blocker repair

- Kept the accepted BOTTOM normal/Perfect whole-rig `-0.52` local-X / `+0.10` local-Y portrait framing and `-26°` roll correction unchanged. No further blade/root framing change is made.
- Added one pulse-shaped **`-0.10` local-X dominant/right support tuck** only for BOTTOM normal/Perfect parry. `PlayerForearmR`, `PlayerHandR` and `PlayerCuffR` move together toward the handle centre/below the projected blade lane at peak; `PlayerHandL`/left forearm/cuff and the authoritative blade remain untouched. The offset is exactly zero at action start/completion.
- At peak normal BOTTOM the right hand moves from local X `0.075` to `-0.025` while keeping its existing local Z/depth choreography, reducing rather than increasing its radial distance from the handle axis. The right forearm and cuff similarly tuck from X `0.18→0.08` and `0.12→0.02`, so the visible dominant arm collapses under the handle instead of artificially translating the blade.
- Existing deterministic pose coverage now also pins the BOTTOM dominant-side tuck and unchanged left-hand X. TOP/RIGHT/LEFT presentation, BOTTOM rising counter, combat direction/input/timing/damage/posture/Perfect/STEP/reach/scoring, persistence/privacy/network behaviour, 320×568 viewport intersections, handle-axis/spacing budgets and the **>24 px** blade-extension threshold are unchanged.
- Superseded long-form Runs 120–126 were compacted into their existing run-log summary; their exact diffs, CI receipts and PR comments remain in Git history/Draft PR #1. No product rule was removed from Current Baseline or Regression Checklist.

### Verification boundary

- The execution surface still has no dependency-backed repository checkout, so exact-head GitHub Actions `npm test` + complete `npm run test:browser`, especially the unchanged BOTTOM normal/Perfect player-grip projection/attachment checks, plus exact-head Vercel status are required after the one permitted commit before Run 131 is accepted.
- No second bookkeeping commit is permitted; the Draft-PR run comment is the authoritative post-commit receipt.
