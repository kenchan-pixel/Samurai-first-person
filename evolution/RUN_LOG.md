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

## Runs 065–089 — Blade semantics, delivery recovery, handedness, challenge and dojo

- Runs 065–069: player-facing Guard/directional cut semantics, semantic SOT smoke, actual-Sword afterimages and reduced-motion cleanup.
- Runs 070–072: bounded one-shot Vercel capacity recovery and architecture SOT reconciliation with PlayCanvas + Vite primary and WebGL2 fallback.
- Runs 073–074: persistent STEP handedness, left-side clipping repair and true 320×568 production input gate.
- Runs 075–086: eight-duel 連戰試煉, momentum, 今日陣, tactical choice, rematch visual identity and per-wave split records with lifecycle/browser repairs.
- Runs 087–089: direct Oni/Blood Moon practice and 師範弱點再練 routing while preserving campaign best and combat authority.

## Runs 090–100 — Production acceptance, owner-feedback repair and release prep

- Runs 090–091: real production 練血月 orchestration gate exposed and repaired the Pause → Home → direct Blood Moon fallback.
- Runs 092–093: result-only 四向防守 analysis plus normal-practice capture repair under the Blood Moon adapter.
- Runs 094–097: heavy-attack presentation, exact-head `/build-meta.json` recovery, Bottom/STEP 320×568 input repair and real-renderer heavy acceptance.
- Run 098: bounded 60–110 ms near-contact final-direction guard commitment; normal parry only, never Perfect.
- Run 099: refined deterministic AttackTop/AttackBottom into connected cross-body vertical cuts while preserving combat timing and fixed Sword→HandR grip.
- Run 100: explicit result 分享 through Web Share/clipboard with no account, persistence, analytics or background network request.

## Runs 101–113 — Practice evidence, Closed Beta readiness and combat-read refinement

- Run 101: added session-only 修行進度 comparing repeated same-opponent practice from authoritative defense/hit/manual-counter outcomes.
- Run 102: repaired practice-progress DOM marker ownership after CI exposed a style/result-row selector collision.
- Run 103: added explicit local/export-only 體驗意見 / 錯誤回報 and established the approved Closed Beta v0.5 local/export-only boundary.
- Run 104: added start-only 封測資訊 guide with the duel → repeated practice → explicit 回報 loop.
- Run 105: added read-only 本機戰績 inside that guide using only established campaign/challenge local best records.
- Run 106: repaired storage-denied startup so the guide/game stay usable when `localStorage` access throws.
- Run 107: extended 修行進度 with an observed weak-direction target and repeat tracking without balance/data changes.
- Runs 108–110: added session-only 封測 0/3 progress, repaired false terminal bootstrap, then fixed a DOM ownership collision that could replace the app root.
- Run 111: added challenge/今日陣 terminal 戰策回顧 for accepted Waves 2/4/6 choices and direct HP/score effects.
- Run 112: repaired the cumulative baseline/browser acceptance gap for 戰策回顧; exact route/effect text, bounds and retry/campaign clearing are now covered at 320×568.
- Run 113: added presentation-only measured / standard / quick / heavy attack-tempo readability from each exact current attack's existing telegraph/strike timing. Exact HEAD `d16d4c8663695d51c8d2ff924346c257d0ed6c05` passed Actions CI #159 / run `33830279572`, exact-head GitHub `Vercel` status was success, and the latest exact-head All Repos review reported no actionable P0/P1/P2 findings.

## Run 114 — Authored feint redirection continuity

**Date:** 2026-09-04  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `d16d4c8663695d51c8d2ff924346c257d0ed6c05`.
- Exact-head Actions CI #159 / run `33830279572` is terminal **success**; exact-head GitHub `Vercel` commit status is terminal **success**. The direct Vercel connector still cannot resolve the recorded imported project (`get_project` returned 404), so the GitHub status remains the authoritative deployment fallback.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, inline review threads are empty, and the latest exact-head All Repos review says **No actionable P0/P1/P2 findings**.
- Owner feedback still identifies abrupt **變刀 / feint** presentation as unresolved. This is stronger evidence than the backlog's prior caution against speculative interpolation, so a bounded authored-track repair is justified without reopening combat balance.
- Candidate scoring: (1) authored feint redirection continuity **22/25** (visible impact 5, goal 5, novelty 4, confidence 4, safety 4); (2) further Top/Bottom choreography refinement **19/25** because Run 099 already repaired the known deterministic path and no new concrete defect is observed; (3) difficulty tuning **18/25** because repository SOT still requires repeatable practice evidence before changing combat pressure. Candidate 1 wins.

### Implementation

- Replaced the mid-telegraph authored `Attack*` → `Attack*` hard cut with a bounded **50 ms full-rig crossfade** using the existing PlayCanvas animation-layer transition API.
- The final gameplay/read direction still changes immediately when CombatEngine resolves the feint. The destination authored clip begins at the **same normalized authored progress**, so the crossfade smooths body/arms/katana continuity without adding a second clock, delaying the final direction or rewinding the cut.
- The transition stays directly between authored directional tracks: no generic `Windup` contamination, no per-frame Chest/arm/HandR overrides, no runtime Sword rotation, and no new asset/downloaded motion.
- Added deterministic coverage for the feint-specific 50 ms transition while preserving the established Guard→attack and non-telegraph transition durations. The existing true 320×568 PlayCanvas renderer/browser contract remains the runtime acceptance fence for actual directional track switching, authored grip/trajectory and the cumulative combat baseline.
- CombatEngine timing, attack definitions, telegraph/strike durations, damage, parry/Perfect/STEP windows, late-telegraph guard buffer, feint/final-direction authority, attack-tempo classification, heavy weighting, persistence/privacy and networking are unchanged.

### Verification boundary

- Incoming exact-head CI/Vercel/review gates were green and source-level transition semantics were inspected before writing the commit; this execution surface has no local repository checkout for a pre-commit browser run.
- Exact-head GitHub CI (`npm test` + full `npm run test:browser`) and exact-head Vercel Preview are required before Run 114 is accepted. The PR run comment records the resulting SHA and post-commit receipts; no second bookkeeping commit is permitted.

## Run 115 — Feint regression-gate repair

**Date:** 2026-09-04  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `7348925fa142e6be3ee9adfe69f6739b7b631927`.
- Exact-head Actions CI #160 / run `33833289704` is terminal **failure**: `npm test` reaches 134/135 and fails the retained authored attack-pack generator regression; the required 320×568 browser/PlayCanvas step is skipped. Exact-head GitHub `Vercel` status is terminal **success**.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, and inline review threads are empty.
- The current-head Second Hourly review classifies the red acceptance fence as **P1** and identifies the stale generator expectation: Run 114 intentionally changed authored mid-telegraph `Attack*` → `Attack*` redirection from 0 ms to 50 ms, the new focused test already protects that contract, but `tests/authored-attack-generator.test.mjs` still requires the retired 0 ms value.
- Under the exact-head verification fence, feature work is prohibited until this blocker is repaired.

### Implementation

- Migrated the retained attack-pack regression to import and assert `AUTHORED_FEINT_BLEND_SECONDS`, keeping the approved value at **50 ms** for authored telegraph direction changes instead of the obsolete 0 ms hard cut.
- Preserved the rest of the generator/runtime contract: animation-only five-clip pack, 19-joint rig, fixed Sword→HandR grip, player-facing Guard axis, continuous telegraph→strike→recovery progress, Guard→attack timing and non-feint transition timing remain asserted.
- No production runtime source, combat timing, attack definitions, damage, parry/Perfect/STEP windows, direction authority, renderer composition, persistence, privacy or networking changed in this blocker repair.

### Verification boundary

- The repair is intentionally limited to the stale acceptance contract plus required state/run evidence; it does not weaken or bypass the browser gate that Run 114 still must pass.
- The resulting exact HEAD must pass the complete Node suite and full 320×568 browser/PlayCanvas suite, and its exact-head Vercel Preview must be terminal green. The Draft-PR run comment is the authoritative post-commit verification receipt.

## Run 116 — Real Ronin feint renderer acceptance

**Date:** 2026-09-04  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `47b9c7fec3b21d72861eddbaa9c4d922106f36ed`.
- Exact-head Actions CI #161 / run `33836576070` is terminal **failure**: `npm test` is **135/135 green**, while `npm run test:browser` fails the PlayCanvas lateral wind-up check (`rightStartX=0.645`, `leftStartX=-0.137`). Exact-head GitHub `Vercel` status is terminal **success**.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, and inline review threads are empty.
- The latest same-head Second Hourly review classifies the red gate as **P1**. It identifies the acceptance-harness defect precisely: the old renderer smoke forces RIGHT → LEFT → BOTTOM synchronously on the same PlayCanvas animation layer, so Run 114's intentional 50 ms authored crossfade contaminates the spatial samples. The review explicitly requires retaining the existing X thresholds, sampling clean directions from Guard/fresh state, and adding a real Ronin feint lifecycle that advances actual animation time beyond the blend before asserting final direction, blade travel, grip/trajectory and unchanged combat timing.
- Under the exact-head fence, feature work remains prohibited; this run is limited to that material regression-gate repair.

### Implementation

- Kept the established player-screen RIGHT/LEFT spatial thresholds unchanged. Each baseline directional cut now starts from the real authored `Guard`, enters its production Attack* clip, and advances the actual PlayCanvas animation system past the Guard→Attack transition before sampling the telegraph and strike path. This removes cross-direction blend contamination rather than relaxing acceptance.
- Added a true Wandering Ronin first-attack feint lifecycle using the production CombatEngine definition: displayed LEFT settles first, the authoritative final RIGHT commits immediately at `feintAt`, PlayCanvas advances beyond the 50 ms full-rig crossfade, and the final cue must settle screen-left with at least 150 ms of telegraph remaining before cutting screen-right across the player-facing plane.
- The real-feint gate also requires Sword→HandR grip/orientation continuity and proves the existing Ronin telegraph/strike durations are unchanged. Generic `Windup` routing remains prohibited by the retained transition assertions.
- No production runtime, combat timing, damage, parry/Perfect/STEP window, input, persistence, privacy, network or asset behavior changed in this blocker repair.

### Verification boundary

- Source syntax for the modified browser harness was checked before the commit. The resulting exact HEAD must pass the complete Node suite and full `npm run test:browser`, including the real 320×568 PlayCanvas renderer contract, and its exact-head Vercel Preview must be terminal green before further feature work.
- The Draft-PR run comment is the authoritative post-commit verification receipt; no second bookkeeping commit is permitted.

## Run 117 — Renderer acceptance lifecycle repair

**Date:** 2026-09-04  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `0832139154cdd6ecf1940019978f9e5a63f372d6`.
- Exact-head Actions CI #162 / run `33840791996` is terminal **failure**: `npm test` remains **135/135 green**, but `npm run test:browser` times out on `/?browser-smoke=renderer-motion` before the DOM receipt is emitted. Exact-head GitHub `Vercel` status is terminal **success**.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, inline review threads are empty, and the latest same-head Second Hourly review classifies the browser deadlock as **P1**.
- The review identifies the new Run 116 `view.impl.app.update(...)` calls as the blocker: the production PlayCanvas application is already running via its own main loop, so manually stepping the whole application inside the imported smoke creates a non-production double-drive path under SwiftShader/`--dump-dom`.
- Feature work remains prohibited under the exact-head fence; this run only repairs that acceptance lifecycle without weakening the feint contract.

### Implementation

- Removed every manual whole-application `app.update(...)` step from the 320×568 renderer smoke.
- Added a focused PlayCanvas `AnimComponentLayer` settling seam used only by the acceptance module. It advances the real authored animation controller/evaluator through the existing 55–70 ms Guard→Attack transition and the existing 50 ms Ronin AttackRight→AttackLeft feint transition while the production application itself stays on its normal RAF lifecycle.
- Clean per-direction samples still reset through authored Guard, retain the established RIGHT `< -0.700` / LEFT `> +0.700` thresholds and require the same blade travel, player-facing plane crossing and Sword→HandR orientation lock.
- The real Ronin LEFT→RIGHT feint lifecycle is retained unchanged in meaning: CombatEngine final-direction authority is immediate, the final authored clip must settle after the bounded crossfade with at least 150 ms telegraph remaining, then travel screen-right through strike with unchanged telegraph/strike timing.
- No production gameplay/runtime source, attack timing, damage, parry/Perfect/STEP window, persistence, privacy, network or asset behavior changed.

### Verification boundary

- The repair deliberately leaves the existing 20 s browser process timeout, 320×568 viewport, lateral thresholds, feint timing and blade/grip assertions unchanged. The resulting exact HEAD must pass `npm test` plus the complete `npm run test:browser` suite and exact-head Vercel before further feature work.
- The Draft-PR run comment is the authoritative post-commit verification receipt; no second bookkeeping commit is permitted.

## Run 118 — Lateral authored-contact acceptance repair

**Date:** 2026-09-04  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `08b61512f1dc44eb9ff173627013fd717d15807f`.
- Exact-head Actions CI #163 / run `33844746928` is terminal **failure**: `npm test` is **135/135 green**, while `npm run test:browser` reaches the real PlayCanvas directional gate and fails only the retained RIGHT full-travel assertion. Exact-head GitHub `Vercel` status is terminal **success**.
- The clean 320×568 wind-up evidence is now valid (`RIGHT x=-0.851`, `LEFT x=1.258`), Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, inline review threads are empty, and the latest same-head Second Hourly review classifies the remaining red directional acceptance as **P1**.
- Source inspection identifies the acceptance seam rather than production motion as the concrete defect: the failed RIGHT sample is at 2580 ms, only 150/330 ms (45.5%) into the Ashigaru strike. `authoredAttackProgress()` maps that to about 0.567 authored progress, before the deterministic lateral contact key at 0.68. The earlier contaminated harness had masked this pre-contact/full-travel mismatch. The real Ronin feint gate already samples its final strike at 175/250 ms (70%), so it is already aligned with authored contact.
- Under the exact-head fence, feature work remains prohibited; this run is limited to repairing the false-negative acceptance sampling without changing the game.

### Implementation

- Kept clean per-direction Guard setup and the Run 117 AnimComponentLayer-only settling path intact; no whole-app manual update was reintroduced.
- `sampleDirectionalCut()` now derives the strike start and duration from the authoritative CombatEngine state, retains early/mid renders for real trail/path accumulation, and takes the full RIGHT/LEFT/BOTTOM travel sample at **68% of the real strike**, which maps to the authored contact key instead of the former pre-contact pose.
- Preserved every player-visible acceptance threshold: RIGHT wind-up remains `< -0.700`, LEFT remains `> +0.700`, lateral full travel remains `>=0.20`, Bottom rise remains `>0.35`, all three cuts must cross the player-facing plane, and Sword→HandR orientation lock remains `<0.25°`. Added a contact-travel diagnostic so any future failure reports the real deltas instead of only the assertion label.
- Production runtime source, authored animation pack, 50 ms Ronin feint crossfade, attack timings, damage, parry/Perfect/STEP windows, direction authority, persistence, privacy and networking are unchanged.

### Verification boundary

- The modified acceptance path is deliberately semantic rather than a threshold relaxation: it measures complete cut travel at authored contact while retaining the same spatial limits. This execution surface has no local checkout, so the resulting exact HEAD must pass `npm test` plus the complete `npm run test:browser` suite and exact-head Vercel before further feature work.
- The Draft-PR run comment is the authoritative post-commit verification receipt; no second bookkeeping commit is permitted.
