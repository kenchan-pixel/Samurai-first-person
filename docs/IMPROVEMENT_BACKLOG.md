# Improvement Backlog

This is a candidate pool, not a fixed roadmap. Each evolution run re-evaluates priority against current SOT, exact-head verification, PR findings and direct physical-phone evidence.

## Recently delivered

- **Runs 002–003:** readable combat motion plus renderer/WebGL correctness.
- **Runs 004–006:** posture/guard break and mastery with browser/storage hardening.
- **Runs 007–010:** Crimson Shogun and Guided Duel with integration repairs.
- **Runs 011–014:** spacing/STEP, impact choreography and wider samurai/dojo framing.
- **Runs 015–020:** elapsed-time four-beat motion, PlayCanvas production renderer and production combat-motion browser contract.
- **Runs 021–023:** original local skinned GLB pipeline plus animation-binding/CI repairs.
- **Runs 024–025:** direction-specific skinned body reads and four stage-specific enemy silhouettes.
- **Run 026:** physical-iPhone readability repair: stronger parry clash, quieter HUD, STEP relocation and initial strike smoothing.
- **Run 027:** owner P1 repair: real world-space 3D blade-tip cuts toward/crossing the player-facing plane, bounded actual-path trail, larger STEP presentation, and Perfect Parry automatic light riposte without increasing the existing perfect+manual damage budget.
- **Run 028:** exact-head blocker repair: converted the real Sword path from unreachable absolute tip targets to hilt-relative normalized blade axes with faster early commitment, preserving the strict four-direction player-facing trajectory contract instead of weakening the failed browser gate.
- **Run 029:** Perfect Parry/Blood Moon phase-integrity repair so automatic riposte damage cannot bypass Crimson Shogun Phase II.
- **Run 030:** gameplay clarity pass: phone-first 玩法 guide, large transient follow-up cues and explicit Stage 2 Ronin feint/final-direction lesson without changing combat balance values.
- **Run 031:** first exact-head gameplay-clarity gate repair: aligned the Node Perfect-riposte assertion with the intended `掃屏反擊` semantic cue; the browser harness then exposed the same remaining stale wording check.
- **Run 032:** completed the exact-head gameplay-clarity gate repair by aligning the existing browser integration assertion with the same semantic `掃屏反擊` contract, without changing production gameplay.
- **Run 033:** separated STEP into normal evade and a narrower **Perfect STEP** skill reward: automatic 1-damage sidestep riposte, no posture damage, manual swipe still available, tracking attacks still punish STEP, and boss Phase II remains authoritative.
- **Run 034:** repaired Perfect STEP phase-priority messaging so a Blood Moon transition or enemy defeat closes the recovery opening without briefly/inaccurately telling the player to swipe; the existing browser footwork gate now covers the exact boss 7→6 path.
- **Run 035:** upgraded the first-person katana from a floating weapon silhouette to a bounded two-hand grip with forearms, hands, wrist guards, habaki/pommel and action-local articulation on the existing PlayCanvas rig.
- **Run 036:** added local-only stage-by-stage post-run battle analysis: parry accuracy, missed counter openings, STEP use, hits and targeted coaching are derived from the existing combat event stream without backend telemetry or identifiers.
- **Run 037:** repaired local battle-analysis coaching so automatic Perfect Parry/Perfect STEP riposte damage cannot inflate the average damage of manual swipe counters or suppress the opposite-direction swipe tip.
- **Run 038:** repaired the local analysis denominator so Blood Moon/defeat-closed automatic-riposte recoveries are not counted as manual counter opportunities that never legally existed.
- **Run 039:** added a repeatable **Stage 2 Ronin practice duel** using the real current Ronin rules and local analysis, with practice results excluded from campaign personal-best storage.
- **Run 040:** closed the Ronin-practice browser verification gap by driving the actual **第二關練習 → 再練浪人 → 開始完整主線** controls through the patched CombatEngine and requiring the real 320×568 start-screen layout gate.
- **Run 041:** added optional **刀路清晰** accessibility mode: four pointer-transparent high-contrast edge rails follow telegraph → Ronin feint resolution → strike direction, strengthen only at the live strike, and clear after resolution without changing combat timing or difficulty.
- **Run 042:** expanded bounded duel practice with a compact **練將軍** route alongside **練浪人**. It launches the real Stage 4 Crimson Shogun at Phase I, preserves Blood Moon rules, reuses local mastery/analysis, supports immediate boss retry or campaign return, and never writes campaign personal-best data.

## Highest priority — physical-phone acceptance

1. **Ronin + Shogun repeated practice re-check** — use the direct Stage 2 and Stage 4 practice routes for several same-device attempts. Compare local stage cards/tips and distinguish reading, missed counters, STEP misuse, raw timing pressure and boss Phase II pressure before changing any balance values.
2. **Physical-iPhone blade re-check** — verify the enemy katana visibly points/cuts toward the player in top/right/bottom/left attacks, reads as one continuous cut at normal speed, and the trail follows the actual weapon path.
3. **Perfect Parry / Perfect STEP feel** — confirm both automatic ripostes are immediate and obvious, while their strategic roles remain distinct: Perfect Parry builds enemy posture; Perfect STEP does not and only works when spacing actually escapes reach.
4. **First-person grip acceptance** — confirm the new two-hand/forearm silhouette improves embodiment without covering the enemy blade read or making parry/counter motion visually noisy on the target iPhone.
5. **STEP + optional blade-read readability/layout** — confirm normal STEP vs Perfect STEP feedback and the new opt-in high-contrast rails stay readable without entering bottom/right block regions, intercepting input or restoring dense combat text.
6. **Sustained phone performance** — inspect frame time, heat and load time; tune shadows/material/pixel-ratio budget only from evidence.

## High-value candidates after core acceptance

- **Difficulty tuning from evidence:** if repeated Ronin/Shogun practice still shows a wall after the learning pass, use the corrected local stage analysis plus same-device feel to tune one bounded rhythm/window/phase-pressure slice rather than weakening the whole campaign.
- Accessibility follow-ups: left-handed layout, timing assistance and broader motion controls. High-contrast directional telegraphs are now delivered as the optional **刀路清晰** mode; do not duplicate them as another system.
- Challenge mode: endless/seeded pressure with mastery-aware scoring and clean restart.
- Boss refinement: stronger signature motion/phase language using play evidence.
- Deeper first-person weapon fidelity only if the new bounded hand/grip silhouette passes phone readability and performance acceptance.

## Data / telemetry Decision Gate

The owner has proposed recording player gameplay data in a backend to support balancing analysis. This is potentially high value, especially for stage-clear rate, death stage, parry/Perfect/STEP success and missed counter opportunities, but it is **not yet an approved implementation** because current repository rules prohibit analytics/external tracking without a privacy Decision Gate.

Runs 036–042 deliberately do **not** cross that boundary: they use an ephemeral in-memory per-run summary, repeatable local Ronin/Shogun practice routes and a local-only optional accessibility preference to validate useful balancing/clarity signals before any remote collection is approved. Nothing is uploaded or retained as a gameplay record.

Before any backend implementation, define at minimum:

- smallest anonymous event/summary schema needed for balancing;
- whether raw input positions/device identifiers are explicitly excluded;
- retention/deletion period and aggregation policy;
- backend/storage choice and secret handling;
- player notice/consent/opt-out expectation for Preview and later public builds;
- whether test/owner sessions should be marked separately from public play;
- dashboard/AI analysis output actually needed to justify collection.

Until that gate is approved, keep gameplay statistics local-only and use direct physical-phone evidence plus the repeatable Stage 2/Stage 4 practice and local analysis for balancing decisions.

## Technical opportunities

- Compact physical-device performance readout only if needed for 60 Hz tuning.
- KTX2/Basis only when textured materials are introduced and memory/transfer evidence justifies it.
- Deterministic replay only if future combat complexity exceeds current focused regressions.
- PWA/offline shell after renderer/asset loading stabilises.

## Avoid until justified

- Multiplayer, accounts/cloud saves, monetisation, inventory/open-world expansion.
- React migration solely to host the renderer.
- Physics engine without a gameplay requirement.
- Downloaded 3D assets without explicit provenance/licence review.
- Retiring primitive/WebGL2 fallbacks before physical-phone evidence is adequate.
- Test/refactor work that does not protect a demonstrated risk or unlock visible player value.
