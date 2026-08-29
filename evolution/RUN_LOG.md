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
- **Run 050 — REGRESSION_FIX:** restored Pause to the conventional top-right safe-area/HUD position after direct owner feedback, with button-only hit isolation.
- **Run 051 — BLOCKER_FIX:** aligned the outer browser gate with the accepted top-right Pause contract; exact-head CI #85 and Vercel were green before Run 52 began.

## Runs 052–054 — Animation regression recovery and autonomy gate

- **Run 052 — REJECTED FEATURE:** procedural per-frame Chest/arm/HandR choreography passed automated checks but owner phone evidence exposed a collapsed body/arm/blade hierarchy. The approach is rejected.
- **Run 053 — REGRESSION_FIX:** removed the rejected joint-override layer and restored the pre-Run-52 world-space blade-path baseline without changing combat authority.
- **Run 054 — BLOCKER_FIX:** removed the mistaken mandatory human-test HOLD. Autonomous runs now use the strongest available Preview/browser/runtime evidence; later owner/device evidence can still override when it exposes a real defect.

## Runs 055–057 — Authored four-direction attack pipeline

- **Run 055 — FEATURE:** added original animation-only `samurai-attacks-v1.glb` with `AttackTop/Right/Bottom/Left` on the shared 19-joint hierarchy; no downloaded motion or Run-52-style runtime joint overrides.
- **Run 056 — BLOCKER_FIX:** fixed a floating-point test false failure and prevented generic `Windup/Strike/Recovery` transitions from interrupting a continuous normal `Attack*` track across telegraph → strike → recovery.
- **Run 057 — REGRESSION_FIX:** made the normal authored katana orientation come from the HandR animation hierarchy with one fixed Sword→HandR grip; removed the normal authored world-space Sword rotation override and retained player-facing contact through bounded whole-model depth assist. Node tests passed, but exact-head browser CI #91 exposed insufficient left/right wind-up blade-tip separation, so the run remained unaccepted.

## Run 058 — Restore lateral side-guard readability

**Date:** 2026-08-29  
**Action type:** BLOCKER_FIX  
**Goal:** close the Run 057 exact-head P1 without weakening the grip-lock or directional-read contracts.

### Preflight / blocker evidence

- Incoming exact HEAD: `950065bac28aae59eb1508440b6d4ea76e9ec0db`.
- GitHub Actions CI #91: `npm test` passed; `npm run test:browser` failed on the real PlayCanvas assertion that right/left wind-up blade tips occupy clearly opposite sides. Exact-head GitHub `Vercel` status was success.
- The same-HEAD automated review classified the failure as P1 because directional defense must remain readable from opponent/body/blade animation. Inline review threads were empty.
- New feature work remained prohibited until this exact browser/runtime regression was repaired.

### Delivered repair

- Kept the fixed Sword→HandR local grip and the prohibition on normal authored world-space Sword rotation overrides.
- Retuned only the authored side-guard blade targets used to solve HandR: `AttackRight` and `AttackLeft` now use a stronger mirrored lateral wind-up axis (`±0.90, 0.42, 0.12`) while their contact and follow-through targets remain unchanged.
- This increases pre-commit left/right spatial separation without changing strike timing, contact path, damage, parry windows, STEP, posture, boss phase or score.
- Preserved the existing fail-closed world-space threshold (`right > +0.700`, `left < -0.700`) and added measured right/left blade-tip X values to the browser failure diagnostic instead of lowering the requirement.
- The generated attack pack remains deterministic, local, animation-only and build-generated through the existing Vite config.

### Regression boundary

- Run 52-style direct Chest/arm/HandR runtime overrides remain prohibited.
- The normal authored Sword stays parented to HandR and must retain near-zero post-animation orientation delta.
- All four strikes must still cross the player-facing parry plane; right/left cuts must travel inward from their now-more-lateral guards; bottom must rise and top must cut downward.
- Post-commit exact-head Node/browser CI and Vercel Preview must both be terminal green before another feature run.

## Run 059 — Commit telegraph direction changes to the new authored guard immediately

**Date:** 2026-08-29  
**Action type:** BLOCKER_FIX  
**Goal:** close the remaining Run 058 lateral-read P1 by fixing authored direction-switch transition semantics rather than further exaggerating animation targets or weakening the browser gate.

### Preflight / blocker evidence

- Incoming exact HEAD: `c666e8d2439aa9271be0008e634bbea03156a66a`.
- GitHub Actions CI #92: `npm test` passed, but `npm run test:browser` failed on the retained real PlayCanvas side-read contract. The measured wind-up tips were `rightX=+1.771` and `leftX=+0.471`, while the accepted contract requires right `> +0.700` and left `< -0.700`.
- Exact-head GitHub `Vercel` status was success; PR #1 remained Draft/open/unmerged; inline review threads were empty.
- The same-head automated review identified the cause as the 55 ms telegraph crossfade from the previous authored `AttackRight` state into `AttackLeft`, which left the newly authoritative left read spatially contaminated by the previous-side pose.

### Delivered repair

- Added an explicit authored transition policy: initial base/Idle → `Attack*` telegraph entry retains the existing short 55 ms blend, while an `Attack*` → different `Attack*` telegraph direction/feint change uses a zero-duration commit to the new authored guard.
- Normal telegraph → strike → recovery continuity remains transition-free on the same `Attack*` state; interrupted recovery still deliberately uses the existing `Parry` reaction.
- Kept the fixed Sword→HandR grip, existing side-guard target geometry, world-space tip thresholds, player-facing cut paths and bounded depth assist unchanged.
- Added focused Node coverage for the transition policy while retaining the real browser right→left world-space gate as the acceptance proof.

### Regression boundary

- No Run 52-style direct Chest/arm/HandR per-frame override or normal world-space Sword rotation is reintroduced.
- Combat timing, damage, parry/Perfect windows, STEP, posture, boss phase, score, input, persistence and network/privacy authority remain unchanged.
- The accepted lateral threshold is not weakened. Exact-head Node/browser CI and Vercel Preview must both be terminal green before feature work resumes.
