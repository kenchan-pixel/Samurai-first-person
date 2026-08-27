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
