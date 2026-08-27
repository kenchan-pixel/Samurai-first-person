# Evolution Run Log

This file keeps autonomous-evolution history concise. Full implementation detail and exact verification receipts remain in Git history and Draft PR #1.

## Runs 000–014 — Established evolution history

- **Run 000 — BASELINE:** mobile-first first-person WebGL duel, four-direction parry/swipe combat, three enemies, progression, tests and SOT.
- **Run 001 — BLOCKER_FIX:** exact-head CI/Vercel fence plus P0/P1/P2 review-gate semantics.
- **Run 002 — FEATURE:** enemy animation readability with anticipation, body commitment and blade trails.
- **Run 003 — BLOCKER_FIX:** player-katana/GLSL renderer fixes plus executable WebGL browser smoke.
- **Run 004 — FEATURE:** player/enemy posture and guard-break pressure.
- **Run 005 — FEATURE:** mastery grading and local personal best.
- **Run 006 — BLOCKER_FIX:** mastery browser/storage/layout integration hardening.
- **Run 007 — FEATURE:** Crimson Shogun multi-phase boss and Blood Moon presentation.
- **Run 008 — BLOCKER_FIX:** boss reduced-motion/banner/browser integration repair.
- **Run 009 — FEATURE:** Guided Duel read/parry/counter onboarding.
- **Run 010 — BLOCKER_FIX:** Guided Duel browser lifecycle repair.
- **Run 011 — FEATURE:** close/mid/far spacing, reach and STEP backstep.
- **Run 012 — BLOCKER_FIX:** STEP cannot permanently bypass the parry lesson; real pointer-path coverage and four-stage copy sync.
- **Run 013 — FEATURE:** direction-aware impact choreography.
- **Run 014 — FEATURE:** wide-framed procedural samurai redraw and deeper dojo perspective.

## Runs 015–020 — Motion and PlayCanvas migration

- **Run 015 — FEATURE:** continuous four-beat motion, action-local player sword animation and adaptive internal resolution.
- **Run 016 — FEATURE:** normal motion follows elapsed-time targets directly instead of carrying visual smoothing lag.
- **Run 017 — BLOCKER_FIX:** authoritative parry flag distinguishes true interrupted recovery from a dropped-frame natural transition.
- **Run 018 — FEATURE:** PlayCanvas standalone + Vite production renderer, true perspective scene, articulated original primitive samurai and legacy WebGL2 fallback.
- **Run 019 — BLOCKER_FIX:** stale repository smoke assertions updated so the production Vite/PlayCanvas browser gate executes.
- **Run 020 — BLOCKER_FIX:** existing real-app browser gate drives CombatEngine telegraph → strike → parry → counter through the PlayCanvas View and verifies transform progression.

## Run 021 — Original skinned samurai vertical slice

**Date:** 2026-08-27  
**Action type:** FEATURE  
**Goal:** Move the player-visible opponent from a PlayCanvas primitive hierarchy to a real skinned character/animation pipeline without changing deterministic combat authority.

### Preflight / review disposition

- Exact previous HEAD `3c5eb050c00bb0c317eea7292edfefc4b4782ec2`: CI run `33059263176` / CI #49 = success; exact-head GitHub `Vercel` status = success.
- Draft PR #1 remained open, Draft and unmerged.
- No inline review threads existed.
- Latest established All Repos review on the exact previous HEAD reported **no actionable P0/P1/P2 finding** and confirmed the Run 020 renderer-motion P2 was fixed.

### Candidate selection

Candidates scored 1–5 for visible impact / goal alignment / novelty / confidence / safety:

- Original skinned GLB samurai + skeletal combat clips: **5 / 5 / 5 / 4 / 4 = 23**.
- Accessibility mode: **4 / 5 / 4 / 4 / 4 = 21**.
- Challenge mode: **4 / 4 / 5 / 3 / 3 = 19**.

The skinned-character slice won because physical-phone feedback identified model fidelity and complete readable body animation as the current product bottleneck, while the PlayCanvas direction and combat/renderer seam are already approved and verified.

### Before

- PlayCanvas rendered a real 3D scene, but the opponent itself was assembled from runtime box/capsule/sphere primitives.
- Motion was articulated by directly rotating those primitive pivots; there was no skin, imported rig or animation clip pipeline.
- The next fidelity step was explicitly a local original/licensed skinned glTF/GLB character.

### After

- Added deterministic repository-authored GLB generation with a **19-joint skinned samurai**, layered armour geometry and eight material groups; current output is about 315 KiB / 1,972 triangles with no texture payload.
- Added real `Idle`, `Windup`, `Strike`, `Recovery` and `Parry` skeletal animation clips.
- PlayCanvas loads the local model, validates all required clips, swaps away from the primitive character only after successful setup, and keeps the primitive model as graceful fallback.
- Existing combat snapshot phase/progress chooses and samples the skeletal clips. Bounded visual blending is additive; hit/parry timing, damage, STEP and encounter logic remain owned by `game-core.js`.
- Stage palettes are applied to imported material groups without separate character downloads.
- Build-time generation is wired through Vite so CI/Vercel produce the same local asset; provenance is explicit and no third-party character/motion pack is introduced.
- The existing renderer-contract smoke is reused: it now waits for the skinned asset and verifies Windup → Strike → Parry clip selection during the already-covered real combat sequence. No parallel broad test harness was added.

### Verification before commit

- Generator and Vite config pass Node syntax checks.
- Generated GLB self-validates its glTF 2.0 header/chunks and was independently parsed locally: 20 nodes including mesh root, 19-joint skin, 8 material primitives and five named clips.
- Exact previous HEAD had terminal-green CI and Vercel before feature selection.
- Exact new-head Vite/PlayCanvas execution is verified after the single allowed commit by CI and Vercel; a failure blocks the next run.

### Regression boundaries / risk

- No HP, damage, attack duration, parry/perfect window, posture, reach, STEP, boss, mastery, onboarding, persistence or input mapping changes.
- Primitive PlayCanvas and legacy WebGL2 fallbacks remain available.
- The first skinned model is intentionally geometry/material efficient; it is a substantial pipeline/fidelity step, not final AAA character art.
- Physical-iPhone sustained 60 Hz, thermal behaviour, camera/model scale and subjective attack readability remain the main human acceptance evidence for the next tuning pass.

### Next candidates

- Physical-iPhone model/material/shadow/pixel-ratio tuning.
- Direction-specific skeletal attack variants and stage-specific silhouette language.
- First-person player katana/hand fidelity after the enemy path stabilises.

## Run 022 — Restore current-baseline CI gate

**Date:** 2026-08-27  
**Action type:** BLOCKER_FIX  
**Goal:** Repair the exact-head CI failure introduced after Run 021 so the production PlayCanvas/skinned-character browser gate can execute again without weakening coverage.

### Preflight / review disposition

- Exact HEAD `5fce1f055d44d4d6e2f8328f82d4fd7959b4d6a8`: Vercel status = success, but CI run `33070780364` / CI #50 = failure, so feature work was prohibited.
- CI failed in `npm test` before browser verification. The single failing assertion was a repository-smoke wording check that still required historical `wind-up → swing → impact → recovery` text after the baseline had moved to the current skeletal clip vocabulary.
- Draft PR #1 remained open, Draft and unmerged; no inline review threads existed.
- Latest established review on previous verified HEAD `3c5eb050c00bb0c317eea7292edfefc4b4782ec2` reported no actionable P0/P1/P2 finding. No newer submitted review covered the failed Run 021 HEAD before this repair.

### Before

- Runtime and deployment had advanced to the skinned GLB pipeline, but `tests/repo-smoke.test.mjs` still coupled SOT verification to superseded sentence wording.
- The same test also depended on the old phrase `is now the primary` even though the approved baseline now correctly says PlayCanvas `remains` primary.
- Because `npm test` failed first, the real Vite/Chromium PlayCanvas browser gate was skipped.

### After

- Kept the same repository smoke test and changed only the brittle SOT wording assertions to semantic checks for the current skeletal sequence (`Windup / Strike / Recovery / Parry`) and PlayCanvas-primary renderer statement.
- Runtime, combat timing, asset generation, renderer, input and browser harness behaviour are unchanged.
- No new test suite or parallel harness was added; this restores the existing risk-proportionate gate instead of expanding process volume.

### Verification / regression boundary

- The prior failure was isolated from GitHub Actions logs to one stale SOT assertion; 37/38 Node tests passed before the fix.
- Exact new-head CI must pass both `npm test` and the existing `npm run test:browser`; exact-head Vercel must remain terminal green before the next feature run.
- No gameplay, damage, timing, parry, STEP, boss, mastery, onboarding, persistence, network, asset provenance or renderer behaviour changed.

### Next candidates

- Physical-iPhone model/material/shadow/pixel-ratio tuning.
- Direction-specific skeletal attack variants and stronger stage-specific silhouette/weapon language.
- First-person player katana/hand fidelity once enemy readability and phone budget are stable.

## Run 023 — Repair PlayCanvas skinned-animation binding

**Date:** 2026-08-27  
**Action type:** BLOCKER_FIX  
**Goal:** Restore the required production browser gate by making the generated skinned GLB reach the live PlayCanvas animation pipeline instead of silently falling back to the primitive opponent.

### Preflight / blocker evidence

- Exact HEAD `92a8ee787817c1ca3772ab511ead34eab4d79496`: Vercel = success, CI run `33072851683` / CI #51 = failure.
- All 38 Node tests passed; `npm run test:browser` failed closed because the real page reported `data-character-pipeline="primitive-fallback"` and `Skinned GLB samurai did not load on the PlayCanvas backend`.
- The latest established All Repos review on this exact HEAD raised one applicable **P1** for the same production GLB load/animation path; no inline review threads existed.

### Root cause

- PlayCanvas `ContainerResource.animations` contains animation **Asset** objects. The renderer treated those Assets as if they were `AnimTrack` objects, checked the generated sub-asset names instead of the embedded clip names, and passed the Asset object directly to `assignAnimation()`.
- A fresh `anim` component also has no base animation layer until a state graph or layer is created. The loader assumed `baseLayer` already existed.
- PlayCanvas 2.21.4 requires `AnimTrack` resources for `assignAnimation()`; the engine's own examples unwrap container animation assets through `.resource`.

### Repair

- Unwrap every container animation Asset to its `AnimTrack` resource and validate the actual track names `Idle / Windup / Strike / Recovery / Parry`.
- Create a compact `combat` animation layer when no base layer exists, then assign the real tracks and start `Idle`.
- Keep the existing production browser smoke unchanged and fail-closed; it already covers the exact regression, so no extra test suite was added.

### Regression boundary / verification

- No combat rules, timing windows, damage, input mapping, STEP, boss, mastery, onboarding, persistence, model geometry, asset provenance or deployment architecture changed.
- Primitive PlayCanvas and legacy WebGL2 fallbacks remain available for genuine asset/runtime failure.
- Exact new-head CI must pass both `npm test` and `npm run test:browser`; exact-head Vercel must be terminal green before feature work resumes.

## Run 024 — Directional skinned combat readability

**Date:** 2026-08-27  
**Action type:** FEATURE  
**Goal:** Make top/right/bottom/left enemy attacks readable from the moving 3D body and weapon itself, without multiplying assets or changing combat authority.

### Preflight / review disposition

- Exact previous HEAD `c1f2e3f8257ff9a6cdca0eebb5336ec5bc8443e1`: CI run `33077417561` / CI #52 = success; exact-head GitHub `Vercel` status = success.
- Draft PR #1 remained open, Draft and unmerged.
- No inline review threads existed.
- Latest established All Repos review on this exact previous HEAD reported **no actionable P0/P1/P2 finding** and confirmed the Run 023 production GLB binding P1 was fixed.

### Candidate selection

Candidates scored 1–5 for visible impact / goal alignment / novelty / confidence / safety:

- Direction-specific skinned body/blade choreography: **5 / 5 / 5 / 4 / 4 = 23**.
- Enemy-specific silhouette/weapon language: **5 / 5 / 4 / 3 / 4 = 21**.
- First-person player hands/katana fidelity: **4 / 4 / 4 / 4 / 4 = 20**.

Physical-iPhone tuning remains highest-value evidence work, but lack of a physical device in this run is explicitly not a HOLD condition. The directional read won as the strongest bounded implementation because opponent motion is gameplay information and the current skinned pipeline already provides a safe renderer-only seam.

### Before

- The skinned samurai correctly loaded and played the five authored skeletal clips.
- Top/right/bottom/left attacks still shared the same full-body clip pose; direction was differentiated mainly by a small whole-model lean plus the HUD indicator.
- The actual skinned sword had no in-world telegraph trail.

### After

- Added direction-specific full-body pose envelopes around the existing skinned animation: top retains the overhead read; right/left attacks coil with opposite yaw/roll and lateral commitment; bottom attacks visibly crouch before driving through the strike.
- The same loaded rig and five clips remain authoritative for phase timing; the direction layer only changes presentation transforms.
- Added one bounded translucent additive trail as a child of the real skinned `Sword` joint. It appears only during readable telegraph/strike motion and scales with existing motion weights.
- No separate model, texture, motion pack, physics system or extra network asset is introduced.
- Extended the existing renderer-contract smoke rather than adding a new harness. It now checks mirrored right/left body reads, lower bottom stance and sword-bone trail while retaining the real CombatEngine telegraph → strike → parry → counter sequence.

### Verification / regression boundary

- Modified renderer and smoke files pass local JavaScript syntax checks.
- Exact previous HEAD was terminal-green for both CI and Vercel before feature selection.
- No HP, damage, timing window, attack sequence, reach, STEP, boss, mastery, onboarding, persistence, input mapping or network behaviour is changed.
- Primitive PlayCanvas and legacy WebGL2 fallbacks remain unchanged.
- Exact new-head `npm test` + `npm run test:browser` and Vercel Preview are the post-commit gate; any failure blocks the next run.

### Risk / human acceptance

- Headless transform assertions prove the direction mapping contract but not whether every pose reads strongly enough on a physical iPhone.
- The added sword trail is one bounded skinned-bone child and direction poses reuse the same rig, so runtime cost is deliberately small; sustained 60 Hz, heat and final visual feel remain physical-phone acceptance evidence.

### Next candidates

- Physical-iPhone model/material/shadow/pixel-ratio tuning.
- Stronger stage-specific helmet/armour/weapon silhouette and rhythm.
- First-person player hand/katana fidelity once enemy readability and mobile budget remain stable.
