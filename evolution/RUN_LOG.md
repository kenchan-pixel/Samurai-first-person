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

## Run 019 — Restore PlayCanvas verification gate

**Date:** 2026-08-27  
**Action type:** BLOCKER_FIX  
**Goal:** Repair the failed exact-head CI gate from Run 018 without weakening coverage, then allow the real Vite/PlayCanvas browser path to execute.

### Preflight / blocker evidence

- Exact HEAD `7663c16811b4337f3fcaca38e9dd99edd6383bc7` had Vercel `success` but CI run `33052542521` / CI #47 completed `failure`.
- The failure occurred in `npm test`: 36/38 tests passed, while two stale `repo-smoke` assertions still expected the old renderer file itself to contain `getContext('webgl2')` and the historical phrase `Three enemies are fought sequentially`.
- Because Node tests failed first, `npm run test:browser` was skipped, so the new production PlayCanvas bundle remained unverified.
- Draft PR #1 remained open, Draft and unmerged; no inline review threads existed and no newer submitted review introduced a separate current-head P0/P1/P2 finding.

### Before

- Repository smoke coverage was structurally coupled to the retired single-file WebGL renderer and exact old baseline wording.
- The test therefore failed after an approved architecture change even though the intended guarantees had moved to `playcanvas-view.ts`, the renderer adapter, the legacy fallback and the updated four-duel SOT.

### After

- Reworked the repository smoke assertion to validate the current architecture semantically: PlayCanvas primary adapter, preserved WebGL2 fallback, renderer-neutral four-beat motion, adaptive mobile pixel ratio, input/audio/combat integration and current four-duel baseline.
- Kept the real browser gate unchanged. It must still build Vite `dist/`, initialize the PlayCanvas backend rather than silently falling back, and execute the existing mastery/boss/onboarding/footwork/impact browser integrations.
- No gameplay rule, renderer behaviour, input mapping, timing window, storage or network behaviour changed.

### Verification plan / regression boundary

- The focused change removes only stale source/text coupling; it does not delete the WebGL2 compatibility guarantee or relax the production PlayCanvas browser requirement.
- Exact new-head CI and Vercel status are intentionally verified after the single allowed commit; the PR run receipt is authoritative for those results.
- If the newly unblocked browser step exposes a real PlayCanvas runtime defect, the following run remains `BLOCKER_FIX` before any fidelity feature work.

### Next candidates

- Local clearly licensed/original skinned samurai glTF/GLB + real animation clips once exact-head CI and Preview are terminal green.
- Physical-iPhone PlayCanvas quality/frame-budget tuning.
- Accessibility mode after the main 3D fidelity path stabilises.

## Run 020 — Prove the PlayCanvas combat-motion contract

**Date:** 2026-08-27  
**Action type:** BLOCKER_FIX  
**Goal:** Close the current-head P2 verification gap around the production PlayCanvas renderer without growing a parallel test stack or changing gameplay.

### Preflight / review disposition

- Exact previous HEAD `c94421f47416af2bd54f845604bfea604a272d2b`: CI run `33053894768` / CI #48 = success; exact-head GitHub `Vercel` status = success.
- Draft PR #1 remained open, Draft and unmerged; no inline review threads existed.
- The latest All Repos review on this exact HEAD reported one actionable **P2**: the browser gate proved PlayCanvas initialization but did not execute the renderer's representative combat-motion mapping. Because that gap covers core player-visible attack/parry motion during an active renderer migration, it is treated as a blocking playability/correctness risk before the next fidelity feature.

### Before

- The real Vite browser page had to initialize the PlayCanvas backend, but the production-page check stopped at readiness markers.
- Separate subsystem harnesses proved combat, STEP, boss, onboarding and impact logic, but none drove the real PlayCanvas `View.draw()` through a representative attack/parry/counter sequence.
- A mapping regression could therefore leave PlayCanvas initialized while enemy or player transforms stopped following combat phases.

### After

- Added a small renderer-contract smoke module that is dynamically imported **only** for the explicit `browser-smoke=renderer-motion` query; normal gameplay does not load it.
- The smoke creates the production `View` adapter on a bounded offscreen canvas, requires the backend to remain PlayCanvas, and drives the real `CombatEngine` through Ashigaru telegraph → strike → directional parry → opposite-direction counter.
- It asserts visible-state transform progression rather than pixels: wind-up weight, enemy body lunge, enemy sword rotation, authoritative interrupted recovery, player parry katana motion and counter-slash motion.
- The existing first real-app Chromium invocation now performs this contract check, so no extra browser process or duplicate harness suite is added.
- No combat timing, HP/damage, input mapping, renderer runtime behaviour, persistence, network or asset policy changes.

### Verification before commit

- New smoke module and modified browser-smoke script pass `node --check` locally.
- Existing exact previous HEAD is terminal green for CI and Vercel before this blocker repair.
- Full Vite/PlayCanvas execution remains delegated to exact new-head CI after the single allowed commit; any failure keeps the next run in `BLOCKER_FIX`.

### Regression boundaries / risk

- The new contract smoke is query-gated and dynamically imported, so it adds no normal-play render loop or per-frame instrumentation.
- Existing mastery, boss, onboarding, footwork and impact browser coverage is retained rather than duplicated.
- Headless Chromium still cannot prove physical-iPhone sustained 60 Hz, thermals or final visual quality; those remain human acceptance boundaries.

### Next candidates

- Local clearly licensed/original skinned samurai glTF/GLB + real animation clips once exact-head CI and Preview are terminal green.
- Physical-iPhone quality/frame-budget tuning after the first skinned model lands.
- Accessibility mode after the core visual migration stabilises.
