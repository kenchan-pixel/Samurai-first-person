# Improvement Backlog

This is a candidate pool, not a fixed roadmap. Each evolution run re-evaluates priority against current SOT, exact-head verification, PR findings, self-observable Preview/browser/runtime evidence and any supplemental owner/device evidence that is actually available.

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
- **Run 043:** simplified live combat from direct physical-iPhone feedback: portrait top-parry reach extends lower for the thumb, persistent instruction clutter is removed, 刀路清晰 suppresses the duplicate centre direction cue, and Pause/玩法 uses a true frozen game clock.
- **Run 044:** repaired the Pause/input collision by moving the 44×44 Pause control wholly into a neutral lower-centre tap band, adding real-app Pause/parry/freeze/resume/restart/home browser coverage, and recording the accepted ergonomic input/Pause contract in the cumulative SOT.
- **Runs 045–048:** repaired the production Combat UX exact-head gate until it genuinely proves the real Start/parry path under a CDP-emulated 320×568 portrait viewport instead of desktop window-size assumptions.
- **Run 049:** added presentation-only Crimson Shogun signature phase language: deliberate Phase I heavy preparation plus lower, more forward, more directional and more crimson Blood Moon motion on the existing shared rig without changing combat balance.
- **Run 050:** restored Pause to a conventional top-right safe-area/HUD position after direct physical-iPhone owner feedback, with button-only hit isolation and 320×568 proof that immediately adjacent top/right canvas taps still reach their directional parries.
- **Runs 052–053:** rejected a broken runtime joint-override choreography after owner device evidence exposed skeletal collapse, then restored the last usable world-space enemy-animation baseline.
- **Run 054:** removed the mistaken mandatory human-test HOLD; autonomous runs now use the strongest available self-verification while treating later owner/device feedback as supplemental evidence that can still expose regressions.
- **Runs 055–056:** introduced the original animation-only four-direction `AttackTop/Right/Bottom/Left` pack on the shared 19-joint rig, then repaired exact-head verification and phase-boundary continuity so normal telegraph→strike→recovery stays on one authored `Attack*` state instead of blending through generic clips.

## Highest priority — autonomous visual/runtime acceptance

1. **Authored attack self-inspection and refinement** — inspect the current Preview/browser/runtime evidence for all four authored cuts. Confirm the active directional track, body/arms/sword continuity, player-facing blade path and trail remain coherent at normal speed. Refine only concrete observed defects; do not return to per-frame Chest/arm/HandR overrides.
2. **Ronin + Shogun repeated practice evidence** — use the direct Stage 2 and Stage 4 practice routes and local stage cards/tips to distinguish reading, missed counters, STEP misuse, raw timing pressure and boss Phase II pressure before changing balance. Supplemental owner/device attempts strengthen this evidence when supplied but are not required to continue.
3. **Perfect Parry / Perfect STEP clarity** — verify both automatic ripostes remain immediate and obvious while their strategic roles stay distinct: Perfect Parry builds enemy posture; Perfect STEP does not and only works when spacing actually escapes reach.
4. **First-person grip readability** — verify the bounded two-hand/forearm silhouette improves embodiment without covering the enemy blade read or making parry/counter motion visually noisy. Use Preview/runtime evidence first; device feedback can override if later supplied.
5. **STEP + blade-read + Pause layout** — keep normal STEP vs Perfect STEP feedback, the opt-in high-contrast rails and the quiet top-right Pause usable without restoring dense combat text; Pause must consume only its own 44×44 button while immediately adjacent top/right parries remain reachable.
6. **Performance evidence** — use browser/runtime frame evidence and conservative budgets; tune shadows/material/pixel ratio only from concrete evidence. Supplemental physical-device heat/frame feedback is valuable when available but not a prerequisite.

## High-value candidates after core acceptance

- **Easy-mode rhythm/timing assistance:** add a bounded optional shrinking/timing ring that communicates incoming direction and parry timing without changing Normal-mode animation readability or hiding the opponent. It must not widen timing windows unless a separate difficulty decision explicitly approves that rule change.
- **Difficulty tuning from evidence:** if repeated Ronin/Shogun practice still shows a wall after the learning pass, use the corrected local stage analysis plus self-observed/runtime evidence and any available device feedback to tune one bounded rhythm/window/phase-pressure slice rather than weakening the whole campaign.
- Accessibility follow-ups: left-handed layout and broader motion controls. High-contrast directional telegraphs are now delivered as the optional **刀路清晰** mode; do not duplicate them as another system.
- Challenge mode: endless/seeded pressure with mastery-aware scoring and clean restart.
- Boss refinement: the first Shogun Phase I/Blood Moon signature-motion slice is delivered; make further motion/phase changes only from concrete readability/performance evidence.
- Deeper first-person weapon fidelity only if the bounded hand/grip silhouette remains readable and performant under available self-verification evidence.

## Data / telemetry Decision Gate

The owner has proposed recording player gameplay data in a backend to support balancing analysis. This is potentially high value, especially for stage-clear rate, death stage, parry/Perfect/STEP success and missed counter opportunities, but it is **not yet an approved implementation** because current repository rules prohibit analytics/external tracking without a privacy Decision Gate.

Runs 036–056 deliberately do **not** cross that boundary: they use an ephemeral in-memory per-run summary, repeatable local Ronin/Shogun practice routes and local-only presentation/accessibility preferences to validate useful balancing/clarity signals before any remote collection is approved. Nothing is uploaded or retained as a gameplay record.

Before any backend implementation, define at minimum:

- smallest anonymous event/summary schema needed for balancing;
- whether raw input positions/device identifiers are explicitly excluded;
- retention/deletion period and aggregation policy;
- backend/storage choice and secret handling;
- player notice/consent/opt-out expectation for Preview and later public builds;
- whether test/owner sessions should be marked separately from public play;
- dashboard/AI analysis output actually needed to justify collection.

Until that gate is approved, keep gameplay statistics local-only and use Preview/browser/runtime evidence plus repeatable Stage 2/Stage 4 practice/local analysis. Supplemental owner/device evidence can refine or override conclusions when supplied.

## Technical opportunities

- Compact performance readout only if needed for 60 Hz tuning.
- KTX2/Basis only when textured materials are introduced and memory/transfer evidence justifies it.
- Deterministic replay only if future combat complexity exceeds current focused regressions.
- PWA/offline shell after renderer/asset loading stabilises.

## Avoid until justified

- Multiplayer, accounts/cloud saves, monetisation, inventory/open-world expansion.
- React migration solely to host the renderer.
- Physics engine without a gameplay requirement.
- Downloaded 3D assets without explicit provenance/licence review.
- Retiring primitive/WebGL2 fallbacks before strong self-verification and available device evidence are adequate.
- Test/refactor work that does not protect a demonstrated risk or unlock visible player value.
