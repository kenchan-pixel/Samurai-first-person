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

## Run 025 — Stage-specific skinned enemy identities

**Date:** 2026-08-27  
**Action type:** FEATURE  
**Goal:** Make every duel immediately recognisable from the opponent silhouette and weapon while keeping one lightweight shared skinned rig and unchanged combat authority.

### Preflight / review disposition

- Exact previous HEAD `8ea291b66348067a884abd48b3ef3d804d8c4543`: CI run `33083292549` / CI #53 = success; exact-head GitHub `Vercel` status = success.
- Draft PR #1 remained open, Draft and unmerged.
- No inline review threads existed.
- Latest established All Repos review on the preceding verified GLB-binding HEAD reported **no actionable P0/P1/P2 finding**; all older P1/P2 findings remain materially fixed by later verified commits.

### Candidate selection

Candidates scored 1–5 for visible impact / goal alignment / novelty / confidence / safety:

- Stage-specific skinned silhouette / weapon language: **5 / 5 / 5 / 4 / 5 = 24**.
- Accessibility timing / high-contrast / left-handed mode: **4 / 5 / 4 / 4 / 4 = 21**.
- First-person player hands / katana fidelity: **4 / 4 / 4 / 4 / 4 = 20**.

Physical-iPhone tuning remains the highest-value evidence task, but lack of a physical phone in this environment is explicitly not a HOLD condition. Stage differentiation won because distinct duels are a core product pillar and the current shared rig provides a bounded presentation-only seam.

### Before

- Stages differed in palette, combat behaviour and boss atmosphere, but the loaded skinned character kept almost the same helmet, armour mass and weapon silhouette across all four opponents.
- Oni and Crimson Shogun therefore depended more on colour/HUD/rules than on instant body-shape recognition.

### After

- Reused the same loaded skinned GLB and attached small original PlayCanvas accessories directly to its real `Head`, `Chest` and `Sword` bones.
- Ashigaru uses a broad jingasa; Ronin uses a headband/travel sash and different tsuba; Oni uses horns, broader shoulder guards and a heavier blade spine; Crimson Shogun uses tall antlers, sashimono, a wider tsuba and crimson blade spine.
- Added restrained stage-specific body/weapon scaling and presentation commitment so heavier enemies read heavier without changing reach or rules.
- All 17 accessory entities are created once after model load and only the current stage group is enabled, with at most six active. No duplicate GLB, texture, network asset or per-frame accessory allocation is introduced.
- Extended the existing renderer-contract smoke instead of adding another harness: it now proves four distinct identities, bounded active groups and heavier Oni/Shogun scale before running the existing real telegraph → strike → parry → counter sequence.

### Verification / regression boundary

- Modified renderer and existing smoke pass local JavaScript syntax checks before commit.
- Exact previous HEAD was terminal-green for both CI and Vercel before feature selection.
- No HP, damage, timing window, attack selection, reach, STEP, boss rules, mastery, onboarding, persistence, input mapping or network behaviour changes.
- Primitive PlayCanvas and legacy WebGL2 fallbacks remain available.
- Exact new-head `npm test` + `npm run test:browser` and Vercel Preview are the post-commit gate; any failure blocks the next feature run.

### Risk / human acceptance

- Headless assertions prove the identity-switching and bounded-resource contract, not final artistic quality or physical-iPhone sustained 60 Hz/heat.
- Accessories are intentionally simple geometry so this slice improves silhouette before spending the mobile performance budget on textures or separate characters.

### Next candidates

- Physical-iPhone material/shadow/pixel-ratio tuning from real device evidence.
- First-person player hands/katana fidelity.
- Accessibility options, with separate directional clips only if physical play shows the current shared clips are limiting readability.

## Run 026 — Physical-iPhone combat readability repair

**Date:** 2026-08-28  
**Action type:** REGRESSION_FIX  
**Goal:** Repair four player-visible problems demonstrated by direct iPhone screenshots: pose-like enemy swings, weak successful-parry feedback, dense/tiny combat copy, and STEP overlapping the lower block area.

### Preflight / evidence disposition

- Exact previous HEAD `c2aae51c00fc91bbbbc5777f0765317d916486da`: CI run `33089165442` / CI #54 = success; exact-head GitHub `Vercel` commit status = success.
- Draft PR #1 remained open, Draft and unmerged; no inline review threads existed.
- Latest established review on the exact previous HEAD reported no actionable P0/P1/P2 finding.
- New direct physical-iPhone evidence superseded feature selection: the attack blade read looked like pose changes rather than a flowing cut, successful parry lacked a clear visual hit, the live HUD carried too much small instructional text, and centred STEP occupied the lower directional-input area. These are material regressions against the mobile clarity / animation-first product goal and regression checklist, so unrelated feature work was prohibited.

### Before

- Strike clip sampling followed linear phase progress, making the three-pose skeletal cut read mechanically on the phone despite the existing directional choreography.
- The single in-world sword read trail did not create a strong continuous sweep impression.
- Existing DOM impact FX technically fired on parry, but physical-phone feedback showed the result was too subtle to register reliably.
- Persistent combat prompt subtitles, edge-zone labels and the bottom gesture sentence competed with the opponent read; several live labels were 8–9 px.
- STEP was centred near the bottom of the viewport, inside the same area used for bottom directional blocking.

### After

- Added a presentation-only smootherstep strike curve around the existing combat-authoritative skeletal clip, plus a small full-body whip and two bounded sword-bone afterimages during the actual strike. Combat timing and hit/parry windows remain unchanged.
- Added an unmistakable direction-aware parry clash: short screen wash, expanding contact ring and crossed blade flash; perfect parry is visibly stronger and reduced-motion keeps a compact contact cue.
- Quiet read/track prompts and instructional subtitles are suppressed during normal observation, passive edge-zone words and the persistent gesture sentence are removed from the live fight, while direction arrow/name and essential HUD typography are enlarged.
- STEP and the distance chip move to the lower-right safe corner. At 320×568 their hit area sits right of the bottom-block region and below the right-block region; STEP pointer mechanics themselves are untouched.
- Footwork feedback copy is shortened to action-level cues instead of full instructional sentences.

### Verification / regression boundary

- New presentation module and renderer adapter pass local Node syntax checks before commit.
- Exact previous HEAD was terminal-green for CI and Vercel before this regression repair.
- No HP, damage, attack duration, parry/perfect timing window, posture, reach, STEP effectiveness, boss rules, mastery, persistence or input mapping changes.
- New strike afterimages are two entities created once after the skinned model loads; parry clash nodes are pointer-transparent, capped to two concurrent containers and self-remove within 460 ms.
- Existing PlayCanvas/GLB and legacy WebGL2 fallback architecture remains intact. Exact new-head `npm test`, `npm run test:browser`, CI and Vercel Preview are the post-commit gate.

### Human acceptance boundary

- Headless verification can prove runtime safety and the input/control contracts but cannot certify whether the revised strike now feels sufficiently fluid or whether the new clash strength is ideal on the user's iPhone. The next physical-device check should compare directly against the screenshots that triggered this repair before any additional feature expansion.

### Next candidates

- Physical-iPhone re-check of swing/parry/HUD/STEP and only evidence-driven tuning if needed.
- Sustained phone frame-time / shadow / pixel-ratio tuning.
- First-person player hands/katana fidelity after this readability repair is confirmed.
