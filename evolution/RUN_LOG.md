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

## Runs 101–105 — Practice evidence and Closed Beta local-only readiness

- Run 101: added session-only 修行進度 comparing repeated same-opponent practice from authoritative defense/hit/manual-counter outcomes.
- Run 102: repaired practice-progress DOM marker ownership after CI exposed style/result-row selector collision; exact-head CI/Vercel returned green.
- Run 103: added explicit local/export-only 體驗意見 / 錯誤回報 and established `docs/CLOSED_BETA_V0_5_BASELINE.md`; remote ingestion/accounts/leaderboard/telemetry remain gated.
- Run 104: added start-only 封測資訊 / Closed Beta v0.5 tester guide with the duel → repeated practice → explicit 回報 loop and no-account/no-auto-upload/no-cloud-leaderboard/no-background-telemetry disclosure.
- Run 105: added read-only 本機戰績 inside the existing guide using only the established campaign mastery best and challenge best; exact-head `9c707774302987ee81ec74514d2e4e96efac4eee` passed CI #151 / run `33790869499` and Vercel.

## Run 106 — Denied-storage startup repair

**Date:** 2026-09-04  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `9c707774302987ee81ec74514d2e4e96efac4eee`.
- Exact-head Actions CI #151 / run `33790869499` is terminal **success** and exact-head GitHub `Vercel` status is terminal **success**.
- Draft PR #1 remains open/Draft/unmerged and `main` remains untouched.
- The latest exact-head Second Hourly review identified one actionable P2: `src/local-records.js` evaluated `globalThis.localStorage` in default parameters, so a browser whose `localStorage` property getter throws `SecurityError` could abort module initialization before the existing read fallback ran.
- Because that failure can break the imported mastery/startup path and violates the established storage-disabled non-fatal baseline, it is a blocking runtime/playability regression. New feature work is prohibited this run.

### Implementation

- Removed eager `localStorage` default-parameter evaluation from both `readLocalPersonalRecords()` and `installLocalPersonalRecords()`.
- Added one lazy guarded resolver: omitted storage now acquires `globalThis.localStorage` only inside `try/catch`; property-access denial degrades to `null`, while explicitly injected storage objects or `null` remain authoritative. Existing `getItem`/JSON failures remain caught by the read path.
- Extended the true 320×568 local-record browser harness. It first proves normal seeded campaign/challenge records, then replaces `window.localStorage` with a getter that throws `SecurityError`, freshly imports the module, and requires the same Closed Beta guide to remain open/usable while both records degrade to “未有紀錄” and the Start control remains usable.
- Added a deterministic source regression forbidding the unsafe `storage = globalThis.localStorage` default-parameter pattern while retaining the existing no-write/no-network guard.
- No combat timing, damage, parry/Perfect/STEP rules, scoring, renderer, record schema, storage write, identifier, analytics, backend or network behaviour changed.

### Verification boundary

- Source/lifecycle reasoning is complete in this execution surface; there is no local repository/browser checkout.
- Exact-head GitHub CI (`npm test` + full `npm run test:browser`) and exact-head Vercel Preview are the authoritative post-commit acceptance gates. The PR run comment records the new SHA and final receipts; no second bookkeeping commit is permitted.
