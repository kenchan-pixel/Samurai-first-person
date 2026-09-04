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
