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
