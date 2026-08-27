# Evolution Run Log

This file keeps the autonomous-evolution history concise. Full implementation detail remains available in Git history and Draft PR receipts.

## Runs 000–014 — Established evolution history

- **Run 000 — BASELINE:** mobile-first first-person WebGL duel, four-direction parry/swipe combat, three enemies, progression, tests and SOT.
- **Run 001 — BLOCKER_FIX:** exact-head CI/Vercel fence plus P0/P1/P2 review-gate semantics.
- **Run 002 — FEATURE:** enemy animation readability with anticipation, body commitment, articulated stance and blade trails.
- **Run 003 — BLOCKER_FIX:** player-katana SDF / GLSL mask fixes plus executable WebGL browser smoke.
- **Run 004 — FEATURE:** player/enemy posture and guard-break pressure.
- **Run 005 — FEATURE:** mastery grading and local personal best.
- **Run 006 — BLOCKER_FIX:** mastery browser integration/storage/layout hardening.
- **Run 007 — FEATURE:** Crimson Shogun multi-phase boss and Blood Moon presentation.
- **Run 008 — BLOCKER_FIX:** boss reduced-motion banner cleanup and full boss browser integration.
- **Run 009 — FEATURE:** Guided Duel read/parry/counter onboarding.
- **Run 010 — BLOCKER_FIX:** Guided Duel browser lifecycle repair.
- **Run 011 — FEATURE:** close/mid/far spacing, attack reach and timed STEP backstep.
- **Run 012 — BLOCKER_FIX:** STEP cannot permanently bypass the parry lesson; real STEP pointer-path coverage and four-stage copy sync.
- **Run 013 — FEATURE:** bounded direction-aware impact choreography for parries, counters, guard breaks and player hits.
- **Run 014 — FEATURE:** wide-framed procedural samurai redraw, stronger stage silhouettes/armour and deeper dojo perspective.

## Runs 015–017 — Motion / mobile-render hardening

- **Run 015 — FEATURE:** continuous wind-up → swing → impact/follow-through → recovery motion, action-local player sword animation and bounded adaptive internal resolution.
- **Run 016 — FEATURE:** normal elapsed-time motion follows its target directly instead of carrying an 82 ms per-frame visual lag.
- **Run 017 — BLOCKER_FIX:** recovery damping now uses authoritative `attack.parried` state, so a dropped frame cannot misclassify natural recovery as a parry interruption.

## Run 018 — First PlayCanvas production-facing 3D slice

**Date:** 2026-08-27  
**Action type:** FEATURE  
**Goal:** Turn the approved PlayCanvas direction into a visible playable renderer upgrade rather than another shader repaint or disposable technology spike.

### Preflight / review disposition

- Exact previous HEAD `6f85cd38e0025d0814e177d8deef72b533913f8b`: CI run `33046386199` = success; exact-head GitHub `Vercel` status = success.
- Draft PR #1 remained open, Draft and unmerged.
- No inline review threads existed.
- Latest established All Repos review on the exact previous HEAD reported **no new P0/P1/P2 finding** and confirmed the Run 017 P1 was fixed.
- The PlayCanvas-first Decision Gate was already explicitly approved; no new human gate was required for this incremental implementation.

### Candidate selection

Candidates scored 1–5 for visible impact / goal alignment / novelty / confidence / safety:

- First PlayCanvas true-3D renderer + Vite production path + legacy fallback: **5 / 5 / 5 / 4 / 4 = 23**.
- Accessibility mode: **4 / 5 / 4 / 4 / 4 = 21**.
- Challenge mode: **4 / 4 / 5 / 3 / 3 = 19**.

The PlayCanvas slice won because physical-iPhone feedback identified character/animation presentation as the current product bottleneck and the stack direction was already approved.

### Before

- The opponent and dojo were drawn procedurally inside one fullscreen fragment shader.
- Even after the wide-framing and four-beat motion passes, the character was still visually a shader-built figure rather than a true 3D scene hierarchy.
- The project had no production PlayCanvas/Vite path despite the approved migration decision.

### After

- Added **PlayCanvas Engine standalone** as the primary renderer through a narrow `View` adapter.
- Added a real perspective 3D courtyard with floor depth, gate architecture, dynamic directional/point lighting and shadows.
- Added an original code-authored articulated samurai hierarchy with hips/torso/head/helmet/arms/elbows/hands/sword plus a first-person player katana.
- Existing combat direction and elapsed-time four-beat motion now drive the 3D hierarchy; combat timing/damage/parry/STEP rules remain authoritative outside PlayCanvas.
- Stage palette/crest/scale changes preserve enemy differentiation while the full body stays readable at the approved wider distance.
- Existing frame-time adaptation now controls PlayCanvas pixel ratio rather than combat timing.
- Preserved the previous custom WebGL2 renderer as `src/legacy-renderer.js` fallback during migration.
- Added Vite production bundling; Vercel and browser CI now exercise the built `dist/` application.
- The real-app browser gate explicitly requires `renderer-backend=playcanvas`, so a silent fallback cannot make the new slice appear green.
- No downloaded character/model/texture pack was introduced; the next fidelity step is a local licensed/original skinned GLB with recorded provenance.

### Verification before commit

- New renderer adapter, PlayCanvas scene source and revised browser-smoke script passed local syntax checks where applicable.
- Existing exact previous HEAD had terminal-green full CI and Vercel Preview before feature work began.
- Network-restricted local tooling could not install npm packages, so exact new-head Vite/PlayCanvas browser verification is delegated to repository CI and Vercel after the single allowed commit. A failure therefore blocks the next run and must be repaired before more feature work.

### Regression boundaries / risk

- No HP, damage, attack duration, parry/perfect window, posture, reach, STEP, boss, mastery, onboarding, persistence or input mapping was changed.
- DOM HUD/overlays and existing focused browser harnesses remain in place.
- PlayCanvas adds meaningful bundle/GPU cost; physical-iPhone frame time, heat and final visual quality remain the primary acceptance evidence.
- The articulated primitive samurai proves the renderer/animation path but is not yet the intended final high-detail skinned model.

### Next candidates

- Local clearly licensed/original skinned samurai glTF/GLB + real animation clips.
- Physical-iPhone PlayCanvas quality/performance tuning and fallback-retirement evidence.
- Accessibility mode after the core visual migration stabilises.
