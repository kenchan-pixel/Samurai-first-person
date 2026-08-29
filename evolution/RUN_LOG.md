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
- **Runs 026–029:** mobile readability repair, real world-space four-direction blade paths, Perfect Parry riposte and Blood Moon phase-integrity repair.
- **Runs 030–034:** phone-first guide/Ronin lesson, exact-head clarity repairs, Perfect STEP and phase-priority repair.
- **Runs 035–038:** first-person two-hand weapon grip, local post-run analysis and analysis-denominator/damage repairs.
- **Runs 039–042:** repeatable Ronin/Shogun practice, practice browser verification and optional high-contrast blade-read mode.

## Runs 043–051 — Combat UX and exact-head hardening

- **Run 043 — REGRESSION_FIX:** simplified live combat, extended portrait top-parry reach, true Pause/玩法 frozen clock, and production Shogun-practice Blood Moon coverage.
- **Run 044 — REGRESSION_FIX:** moved Pause to a neutral lower-centre band to repair a parry-surface collision.
- **Runs 045–048 — BLOCKER_FIX:** hardened the real production Start/parry/Pause browser gate and replaced desktop window-size assumptions with true 320×568 CDP mobile emulation.
- **Run 049 — FEATURE:** presentation-only Crimson Shogun Phase I/Blood Moon signature motion.
- **Run 050 — REGRESSION_FIX:** restored Pause to the conventional top-right safe-area/HUD position after direct physical-iPhone owner feedback, with button-only hit isolation.
- **Run 051 — BLOCKER_FIX:** aligned the outer browser gate with the accepted top-right Pause contract; exact-head CI and Vercel were green before the next animation work began.

## Runs 052–054 — Animation regression recovery and autonomy gate

- **Run 052 — REJECTED FEATURE:** procedural per-frame Chest/arm/HandR choreography passed automated checks but owner phone evidence exposed a collapsed body/arm/blade hierarchy. The approach is rejected.
- **Run 053 — REGRESSION_FIX:** removed the rejected joint-override layer and restored the pre-Run-52 world-space blade-path baseline without changing combat authority.
- **Run 054 — BLOCKER_FIX:** removed the mistaken mandatory human-test HOLD. Autonomous runs use the strongest available Preview/browser/runtime evidence; later owner/device evidence can still override when it exposes a real defect.

## Runs 055–061 — Authored four-direction attack pipeline and repairs

- **Run 055 — FEATURE:** added original animation-only `samurai-attacks-v1.glb` with `AttackTop/Right/Bottom/Left` on the shared 19-joint hierarchy; no downloaded motion or Run-52-style runtime joint overrides.
- **Run 056 — BLOCKER_FIX:** fixed a floating-point test false failure and prevented generic `Windup/Strike/Recovery` transitions from interrupting a continuous normal `Attack*` track across telegraph → strike → recovery.
- **Run 057 — REGRESSION_FIX:** made normal authored katana orientation come from the HandR animation hierarchy with one fixed Sword→HandR grip; the exact-head browser gate then exposed insufficient left/right wind-up separation.
- **Run 058 — BLOCKER_FIX:** strengthened mirrored lateral side-guard targets while retaining the fixed HandR grip and player-facing contact paths; the browser gate remained red because the newly selected side pose was still sampled late.
- **Run 059 — BLOCKER_FIX:** removed authored→authored telegraph crossfade for direction/feint switches so the new guard is selected immediately; the unchanged browser gate proved crossfade was not the remaining root cause.
- **Run 060 — BLOCKER_FIX:** fixed same-draw PlayCanvas authored-pose evaluation before blade sampling. The measured right/left wind tips moved to opposite world-space sides and cleared the retained lateral threshold.
- **Run 061 — BLOCKER_FIX:** added a bounded whole-model forward-reach floor for authored strikes so the top cut advances continuously toward the player without restoring Sword/joint runtime overrides; exact-head Node/browser CI and Vercel became green.

## Runs 062–064 — Timing assist and verification hardening

- **Run 062 — FEATURE:** added optional default-off `節拍提示`: a pointer-transparent ring follows authoritative telegraph progress and final feint direction, then distinguishes the existing Perfect window from normal parry timing without changing combat rules.
- **Run 063 — BLOCKER_FIX:** made the default-off timing assist genuinely runtime-idle by caching UI refs and skipping timing/frame/DOM work while disabled. Node tests passed, but its new browser mutation regression used a top-level `requestAnimationFrame()` wait that never completed under the existing `--dump-dom` virtual-time runner, leaving exact-head CI red.
- **Run 064 — BLOCKER_FIX:** repaired that exact-head verification blocker without weakening the off/on/off mutation contract. The timing-assist browser harness now forces layout synchronously and observes only timing-assist-relevant DOM mutations, deliberately excluding the unrelated one-shot start-layout marker; no top-level RAF suspension remains. This run does **not** clear the newer owner P1: LEFT/RIGHT slash semantics still require explicit player-perspective correction and the opponent's neutral/initial katana guard still requires a player-facing blade-axis repair before any feature work.

## Current blocker boundary after Run 064

- New feature work remains prohibited while the owner P1 visual-feedback finding applies.
- Next animation repair must define LEFT/RIGHT by the visible slash trajectory from the player's perspective, not by an ambiguous enemy/anatomical-side label.
- The opponent's base Idle plus authored attack entry/return guard must share a HandR-attached katana pose whose blade axis points materially toward the player.
- Acceptance must be automated with deterministic PlayCanvas/runtime geometry evidence; do not lower existing grip-lock, player-facing strike, timing, input or mobile regression gates.
