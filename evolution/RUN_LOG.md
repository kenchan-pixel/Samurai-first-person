# Evolution Run Log

This file keeps autonomous-evolution history concise. Full implementation detail and exact verification receipts remain in Git history and Draft PR #1.

## Runs 000–020 — Core systems and renderer evolution

- **Run 000 — BASELINE:** mobile-first first-person WebGL duel, four-direction parry/swipe combat, three enemies, progression, tests and SOT.
- **Run 001 — BLOCKER_FIX:** exact-head CI/Vercel fence plus P0/P1/P2 review-gate semantics.
- **Runs 002–003 — FEATURE/BLOCKER_FIX:** readable combat motion plus renderer/WebGL correctness and executable browser smoke.
- **Runs 004–006 — FEATURE/BLOCKER_FIX:** player/enemy posture, guard break, mastery grading/local best and browser/storage hardening.
- **Runs 007–010 — FEATURE/BLOCKER_FIX:** Crimson Shogun and Guided Duel with integration/reduced-motion repairs.
- **Runs 011–014 — FEATURE/BLOCKER_FIX:** close/mid/far spacing, STEP, impact choreography and wider samurai/dojo framing.
- **Runs 015–020 — FEATURE/BLOCKER_FIX:** elapsed-time four-beat motion, dropped-frame recovery repair, PlayCanvas production renderer and real combat-motion browser contract.

## Runs 021–032 — Skinned samurai, phone readability and learnability

- **Run 021 — FEATURE:** deterministic local 19-joint skinned GLB samurai with layered armour and `Idle / Windup / Strike / Recovery / Parry` clips.
- **Runs 022–023 — BLOCKER_FIX:** stale baseline assertions and PlayCanvas animation-asset binding repaired so the real skinned production path loads.
- **Runs 024–025 — FEATURE:** direction-specific skinned body choreography and four stage-specific silhouettes/weapon profiles on the shared rig.
- **Run 026 — REGRESSION_FIX:** physical-iPhone readability repair: smoother strike presentation, stronger parry clash, quieter HUD and STEP relocation.
- **Run 027 — REGRESSION_FIX:** real four-direction blade-tip cuts toward/crossing the player-facing plane, actual-path trail, larger STEP and Perfect Parry automatic riposte.
- **Run 028 — BLOCKER_FIX:** repaired the failed blade-path browser contract with hilt-relative normalized blade axes and faster early commitment.
- **Run 029 — BLOCKER_FIX:** unified Crimson Shogun Phase II threshold so Perfect Parry automatic damage cannot bypass Blood Moon.
- **Run 030 — FEATURE:** phone-first 玩法 guide, transient action cues and Stage 2 Ronin final-direction/feint lesson without changing Ronin balance.
- **Runs 031–032 — BLOCKER_FIX:** aligned duplicated Node/browser clarity assertions and restored the exact-head verification fence.

## Runs 033–042 — Skill differentiation, local diagnosis and direct practice

- **Run 033 — FEATURE:** split STEP into normal evade and narrower Perfect STEP with 1-damage automatic sidestep riposte, no posture gain and retained legal manual follow-up.
- **Run 034 — BLOCKER_FIX:** Blood Moon/defeat now takes priority over Perfect STEP follow-up copy when the recovery opening closes.
- **Run 035 — FEATURE:** added bounded two-hand/forearm first-person katana embodiment on the existing PlayCanvas rig.
- **Run 036 — FEATURE:** added local-only stage-by-stage post-run analysis for parry, counter openings, STEP and hits.
- **Run 037 — BLOCKER_FIX:** separated manual counter damage from automatic riposte damage for accurate swipe-direction coaching.
- **Run 038 — BLOCKER_FIX:** removed impossible Blood Moon/defeat-closed openings from the visible manual-counter denominator.
- **Run 039 — FEATURE:** added repeatable real Stage 2 Ronin practice with local analysis and no campaign personal-best writes.
- **Run 040 — BLOCKER_FIX:** browser gate now exercises the actual Ronin practice entry → retry → campaign handoff and 320×568 start layout.
- **Run 041 — FEATURE:** added optional pointer-transparent high-contrast blade-read edge rails following telegraph → feint → strike.
- **Run 042 — FEATURE:** added direct real Stage 4 Crimson Shogun practice with retry/campaign handoff and unchanged boss balance.

## Run 043 — Mobile combat UX and thumb-reach repair

**Date:** 2026-08-28  
**Action type:** REGRESSION_FIX  
**Goal:** Resolve direct physical-iPhone owner feedback that the upper parry target was outside comfortable thumb reach, the optional blade-read mode duplicated the centre direction cue, and the live combat screen carried too much explanatory text. Move detailed instructions behind a true Pause/玩法 surface while preserving combat authority.

### Preflight / evidence

- Exact previous HEAD `5d7f1b64a3882102da27428da063e04dec6ff4b8`: CI #71 / run `33152508290` = success; exact-head GitHub `Vercel` status = success / Preview Ready.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; inline review threads were empty.
- Direct owner physical-iPhone feedback is P1 by repository authority: `刀路清晰` should not duplicate the centre arrow, and top parry must extend materially lower into a one-hand portrait thumb-reach zone without stealing side/bottom/STEP intent.
- The owner then explicitly requested a cleaner combat screen with a Pause entry for reviewing controls, allowing persistent explanatory text to be removed from live play.
- The exact-head reviewer also found one blocking P2 verification gap: Shogun practice reached Stage 4 in browser tests but did not prove the composed practice route crosses the real 7→6 HP Blood Moon threshold before terminal flow.

### Delivered repair

- Added `src/combat-ux.js` as a bounded input/presentation helper. Portrait top parry now reaches to 42% of screen height while left/right/bottom retain the existing 28% edge depth. Overlapping corner candidates still choose the physically nearest edge, so a reachable upper-middle top zone does not silently turn upper-side taps into top parries. Landscape retains the symmetric 28% map and the neutral centre remains neutral.
- The visible top feedback zone mirrors the new 42% portrait reach. The actual combat timing, perfect window, damage and directional authority are unchanged.
- When optional **刀路清晰** is ON, its edge rail becomes the sole directional overlay and the old centre arrow/label is suppressed. With the mode OFF, the standard centre direction cue remains unchanged.
- Removed the always-on combat prompt, footer gesture sentence, block-zone labels and arena subtitle from live combat. The compact HUD keeps HP, stage/enemy and player/enemy posture; existing short action cues, impact feedback, audio/haptics and the optional Guided Duel remain available for moment-to-moment learning.
- Added a 44×44 **Pause** control with **繼續 / 玩法 / 重新開始 / 返回主頁**. `玩法` reuses the existing full guide instead of creating duplicate instructions. Restart reuses the existing campaign/practice restart path.
- Pause uses a game-time clock rather than merely hiding the screen: combat updates, timing windows and renderer motion stop advancing while paused, pointer input is ignored, and resuming does not catch up the elapsed wall-clock pause duration.
- Added a production-composition Shogun-practice regression: the real boss adapter plus practice adapter must legally counter from 7 HP to 6 HP, emit `boss-phase`, switch to `BOSS_PHASE_TWO`, remain Stage 4 practice, and only then complete as a practice victory.

### Verification / regression boundaries

- Pre-commit syntax checks passed for modified `src/main.js`, new `src/combat-ux.js`, and both focused tests.
- Focused input tests cover 320×568 portrait upper-middle top reach, side precedence in upper corners, bottom direction, neutral centre and unchanged landscape symmetry.
- Focused clock coverage proves a long wall-clock Pause interval contributes zero game time and normal elapsed-time progression resumes from the frozen value.
- The Shogun practice test closes the review P2 using the composed production boss/practice wrappers rather than forcing terminal state before Blood Moon.
- No parry/Perfect/STEP timing, damage, boss balance, Ronin balance, score, renderer/asset authority, persistence/network/privacy boundary or merge authority is changed.
- Exact-head CI and Vercel Preview for this single implementation commit are pending post-commit self-verification; the PR run comment is the authoritative verification receipt.

### Human acceptance / residual risk

- Re-check on the same physical iPhone that the 42% top target feels comfortably reachable without accidental top blocks from intended left/right taps.
- Confirm the 44×44 Pause control does not materially reduce the usable upper-right combat area in the preferred grip.
- Confirm the quieter HUD still leaves enough feedback with Guided Duel off, and that `刀路清晰` ON now reads cleaner with no centre-arrow duplication.

### Next candidates

- Repeat Ronin/Shogun practice on the same device and use local analysis plus feel before any balance change.
- Re-check blade trajectory, first-person grip, Perfect Parry/Perfect STEP and sustained phone performance with the simplified live HUD.
- After core acceptance, consider one bounded challenge-mode or boss signature-motion refinement; remote gameplay telemetry remains behind its separate privacy Decision Gate.
