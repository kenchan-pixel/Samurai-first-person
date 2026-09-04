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

## Runs 101–110 — Practice evidence, Closed Beta local readiness and hardening

- Run 101: added session-only 修行進度 comparing repeated same-opponent practice from authoritative defense/hit/manual-counter outcomes.
- Run 102: repaired practice-progress DOM marker ownership after CI exposed style/result-row selector collision; exact-head CI/Vercel returned green.
- Run 103: added explicit local/export-only 體驗意見 / 錯誤回報 and established `docs/CLOSED_BETA_V0_5_BASELINE.md`; remote ingestion/accounts/leaderboard/telemetry remain gated.
- Run 104: added start-only 封測資訊 guide with the duel → repeated practice → explicit 回報 loop and no-account/no-auto-upload/no-cloud-leaderboard/no-background-telemetry disclosure.
- Run 105: added read-only 本機戰績 inside that guide using only established campaign/challenge local best records.
- Run 106: repaired storage-denied startup by making `localStorage` acquisition lazy/fail-safe and proving the 320×568 guide remains usable when access throws `SecurityError`.
- Run 107: extended 修行進度 with an observed weak-direction target and repeat-attempt tracking without changing combat balance or collecting remote data.
- Run 108: added session-only 封測 0/3 progress for terminal duel → repeated practice → successful explicit feedback export.
- Run 109: repaired false checklist bootstrap by requiring a genuine hidden→visible terminal transition rather than sampling a pre-visible result modal.
- Run 110: repaired a DOM-ownership collision where the progress selector could bind `<html>` and replace the app. Exact HEAD `2e32b27d73c3c6e555a8c3d7745b7d6d439ad7ac` passed Actions CI #156 / run `33817524748`, exact-head Vercel was green, and the latest Second Hourly review reported no actionable P0/P1/P2 findings.

## Run 111 — Challenge 戰策回顧

**Date:** 2026-09-04  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `2e32b27d73c3c6e555a8c3d7745b7d6d439ad7ac`.
- Exact-head Actions CI #156 / run `33817524748` is terminal **success**; exact-head GitHub `Vercel` commit status is terminal **success**.
- Latest exact-head Second Hourly review reports **no actionable P0/P1/P2 finding** and there are no inline review threads. Draft PR #1 remains open/Draft/unmerged; `main` remains untouched.
- Candidate scoring: challenge **戰策回顧** **23/25** (visible impact 4, goal 5, novelty 4, confidence 5, safety 5); multi-attempt practice session summary **21/25**; Closed Beta export/session-summary extension **21/25**. 戰策回顧 wins because the existing Waves 2/4/6 decisions currently disappear at terminal, while a compact local recap directly improves replay learning without another balance or data-collection change.

### Implementation

- Accepted **整息 / 血誓** decisions now create a bounded active-run history containing only checkpoint, choice and the already-authoritative direct HP/score delta. The history resets on every start and is never persisted.
- Challenge/今日陣 terminal events now carry a validated summary of those accepted checkpoints. The result strip renders one compact **戰策** line such as `2誓 · 4息 · 6誓 · +700分 · 生命-1`, letting the player review the route and its direct cost/reward beside the existing run result.
- Duplicate/out-of-range checkpoint records are ignored by the pure summary seam; retry/campaign start clears the visible recap so stale choices cannot leak into the next run.
- Existing 戰前抉擇 timing, +1 HP / -1 HP +350 rules, enemy definitions, combat timing/damage, momentum, PB splits, challenge best schema, campaign/practice state, storage keys, identifiers, analytics and network behaviour are unchanged.
- Deterministic tests cover the three-checkpoint summary/format, direct effect aggregation, duplicate/out-of-range filtering and terminal-event attachment. Existing 320×568 challenge/今日陣 browser gates remain the acceptance fence for terminal fit and full composed lifecycle.

### Verification boundary

- Source/lifecycle reasoning is complete in this execution surface; no local browser checkout is available.
- Exact-head GitHub CI (`npm test` + full `npm run test:browser`) and exact-head Vercel Preview are required before Run 111 is accepted. The PR run comment records the resulting SHA and receipts; no second bookkeeping commit is permitted.
