# Evolution Run Log

This file intentionally keeps autonomous-evolution history concise. Full implementation detail, exact SHAs, CI receipts and Preview links remain in Git history and Draft PR #1.

## Runs 000–020 — Core systems and renderer evolution

- **Run 000 — BASELINE:** mobile-first first-person WebGL duel, directional parry/swipe combat, three enemies, progression, tests and SOT.
- **Run 001 — BLOCKER_FIX:** exact-head CI/Vercel fence plus P0/P1/P2 review-gate semantics.
- **Runs 002–003 — FEATURE/BLOCKER_FIX:** readable combat motion plus renderer/WebGL correctness and executable browser smoke.
- **Runs 004–006 — FEATURE/BLOCKER_FIX:** posture/guard break, mastery grading/local best and browser/storage hardening.
- **Runs 007–010 — FEATURE/BLOCKER_FIX:** Crimson Shogun and Guided Duel with integration/reduced-motion repairs.
- **Runs 011–014 — FEATURE/BLOCKER_FIX:** spacing/STEP, impact choreography and wider samurai/dojo framing.
- **Runs 015–020 — FEATURE/BLOCKER_FIX:** elapsed-time four-beat motion, dropped-frame recovery repair, PlayCanvas production renderer and real combat-motion browser contract.

## Runs 021–042 — Skinned character, mobile combat and practice

- **Runs 021–025:** locally generated 19-joint skinned samurai GLB, animation binding, directional body reads and stage-specific silhouettes.
- **Runs 026–029:** physical-iPhone readability repair, real world-space four-direction blade paths, Perfect Parry riposte and Blood Moon phase-integrity repair.
- **Runs 030–034:** phone-first guide/Ronin lesson, exact-head clarity repairs, Perfect STEP and phase-priority repair.
- **Runs 035–038:** first-person two-hand weapon grip, local post-run analysis and analysis-denominator/damage repairs.
- **Runs 039–042:** repeatable Ronin/Shogun practice, practice browser verification and optional high-contrast blade-read mode.

## Runs 043–051 — Combat UX and exact-head hardening

- **Run 043 — REGRESSION_FIX:** simplified live combat, extended portrait top-parry reach, true Pause/玩法 frozen clock, and production Shogun-practice Blood Moon coverage.
- **Run 044 — REGRESSION_FIX:** moved Pause to a neutral lower-centre band to repair a parry-surface collision.
- **Runs 045–048 — BLOCKER_FIX:** hardened the real production Start/parry/Pause browser gate and replaced desktop window-size assumptions with true 320×568 CDP mobile emulation.
- **Run 049 — FEATURE:** presentation-only Crimson Shogun Phase I/Blood Moon signature motion.
- **Run 050 — REGRESSION_FIX:** restored Pause to the conventional top-right safe-area/HUD position after direct physical-phone feedback, with button-only hit isolation.
- **Run 051 — BLOCKER_FIX:** aligned the outer browser gate with the accepted top-right Pause contract; exact-head CI #85 and Vercel were green before Run 52 began.

## Run 052 — Rejected connected enemy attack choreography

**Date:** 2026-08-29  
**Action type:** FEATURE — **rejected by physical-device acceptance**

Run 52 added procedural per-frame Chest/upper-arm/forearm offsets plus HandR-attached katana alignment in an attempt to make all four enemy attacks read as one connected body-to-blade action. Node and browser contracts were green, and exact-head CI #86 plus Vercel succeeded.

The primary physical-iPhone acceptance immediately failed: the owner reported the animation was completely broken/collapsed. The exact-head PR review therefore classified Run 52 as a P1 playability/baseline regression. The failure exposed a verification gap: descriptor/path arithmetic and headless browser checks did not prove anatomical continuity of the real skinned hierarchy under combined joint overrides and world-space sword rotation.

Run 52 must not be treated as an accepted baseline or a foundation for Easy mode, VFX or further feature work.

## Run 053 — Restore last usable enemy-animation baseline

**Date:** 2026-08-29  
**Action type:** REGRESSION_FIX  
**Goal:** remove the Run 52 physical-device animation collapse before any new feature work.

### Preflight / evidence

- Exact incoming HEAD: `5fcc042205cbdde00c57175e0231c27d80784871`.
- CI #86 / workflow run `33200157967` = **success** and GitHub `Vercel` status = **success**, proving the regression was not detectable by the existing automated fence.
- Exact-head PR review contains a blocking **P1** based on direct owner physical-iPhone rejection; inline review threads are empty.
- The last pre-Run-52 branch state `f8f8e7a166225e92108012c47eae4fc6db71feee` had terminal-green CI #85 / Vercel and is the bounded known-good rollback target for this subsystem.

### Delivered repair

- Restored `src/blade-trajectory.js` exactly to the pre-Run-52 world-space blade-path implementation from `f8f8e7a166225e92108012c47eae4fc6db71feee`.
- Removed the rejected `src/enemy-attack-choreography.js` runtime joint-override layer and its descriptor-only test.
- Restored Current Baseline, Regression Checklist, Improvement Backlog and Changelog to their pre-Run-52 versions so the broken choreography is no longer represented as accepted product behaviour.
- CombatEngine timing, parry/Perfect windows, damage, posture, STEP, boss/Ronin balance, score, input, persistence/network/privacy boundaries and `main` are unchanged.

### Verification / regression boundary

- This is an exact bounded rollback of the Run 52 runtime/SOT delta rather than another attempt to tune the broken transforms.
- Automated post-commit CI and Vercel Preview must be terminal green before another implementation run.
- Physical-iPhone re-check remains mandatory because Run 52 proved CI cannot certify anatomical animation quality.

### Next candidates

1. Confirm on the target iPhone that the skeletal collapse is gone and the prior four-direction world-space blade baseline has returned.
2. For the next animation upgrade, prefer an original rigged enemy-samurai + katana asset with authored attack clips over stacking procedural runtime offsets on the current skeleton. Combat timing remains renderer-neutral.
3. Add the proposed Easy-mode rhythm/timing ring only after the base attack animation is physically accepted; it must assist direction/timing rather than hide an unreadable Normal-mode animation.
