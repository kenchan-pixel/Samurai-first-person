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

## Highest priority — physical-phone acceptance

1. **Stage 2 Ronin re-check after the clarity pass** — confirm whether the difficulty wall remains after the player is explicitly taught that normal parry needs a swipe counter, opposite-direction swipe gains +1, STEP is range-limited, and Ronin feints require waiting for the final blade direction.
2. **Physical-iPhone blade re-check** — verify the enemy katana visibly points/cuts toward the player in top/right/bottom/left attacks, reads as one continuous cut at normal speed, and the trail follows the actual weapon path.
3. **Perfect Parry feel** — confirm automatic light riposte is immediate/obvious and the short cue makes the remaining manual swipe understandable without making normal parry redundant.
4. **STEP readability/layout** — confirm the enlarged STEP label and short evade cue are readable without entering bottom/right block regions.
5. **Sustained phone performance** — inspect frame time, heat and load time; tune shadows/material/pixel-ratio budget only from evidence.

## High-value candidates after core acceptance

- **Difficulty tuning from evidence:** if Ronin remains a wall after the learning pass, tune Stage 2 rhythm/window/feint pressure as one bounded balance slice rather than weakening the whole campaign.
- Accessibility: timing assistance, left-handed layout, high-contrast telegraphs and broader motion controls.
- Challenge mode: endless/seeded pressure with mastery-aware scoring and clean restart.
- Boss refinement: stronger signature motion/phase language using play evidence.
- First-person player weapon fidelity: improve hands/katana grip, silhouette and motion after opponent blade acceptance is stable.

## Data / telemetry Decision Gate

The owner has proposed recording player gameplay data in a backend to support balancing analysis. This is potentially high value, especially for stage-clear rate, death stage, parry/Perfect/STEP success and missed counter opportunities, but it is **not yet an approved implementation** because current repository rules prohibit analytics/external tracking without a privacy Decision Gate.

Before implementation, define at minimum:

- smallest anonymous event/summary schema needed for balancing;
- whether raw input positions/device identifiers are explicitly excluded;
- retention/deletion period and aggregation policy;
- backend/storage choice and secret handling;
- player notice/consent/opt-out expectation for Preview and later public builds;
- whether test/owner sessions should be marked separately from public play;
- dashboard/AI analysis output actually needed to justify collection.

Until that gate is approved, keep gameplay statistics local-only and use direct physical-phone evidence for balancing decisions.

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
