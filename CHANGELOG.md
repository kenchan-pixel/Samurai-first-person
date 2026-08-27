# Changelog

## 0.12.2-evolution — Skinned GLB runtime binding repair

- Fixed the production PlayCanvas character loader to unwrap container animation Assets to real `AnimTrack` resources before assigning clips.
- Added the missing combat animation layer for a fresh `anim` component, then validated and bound `Idle`, `Windup`, `Strike`, `Recovery` and `Parry` by their actual track names.
- Kept the existing fail-closed production browser gate unchanged; no extra broad test suite, combat-rule change or asset substitution was introduced.

## 0.12.1-evolution — Current-baseline CI gate repair

- Repaired stale repository-smoke assertions that still depended on superseded SOT sentence wording after the skinned-samurai baseline landed.
- Kept the existing Node and production Vite/PlayCanvas browser verification architecture unchanged; no parallel test harness or runtime behaviour was added.
- The gate now checks the current skeletal animation vocabulary and PlayCanvas-primary renderer statement semantically, allowing browser verification to run again without weakening gameplay/runtime coverage.

## 0.12.0-evolution — Original skinned samurai and skeletal combat clips

- Replaced the visible Run 018 primitive opponent, after asset readiness, with an original **skinned glTF/GLB samurai** generated locally from repository source.
- Added a 19-joint rig and more detailed layered lamellar armour, shoulder/waist plates, greaves, menpo, helmet/crest, hands and katana while keeping a conservative mobile geometry budget and no texture downloads.
- Added real `Idle`, `Windup`, `Strike`, `Recovery` and `Parry` skeletal animation clips. Clip selection and sampling follow existing combat phase progress; animation does not own parry windows, damage or encounter timing.
- Added short bounded clip transitions and directional lean while keeping the wider full-body portrait framing.
- Preserved the previous articulated PlayCanvas character as character-level fallback and the legacy custom WebGL2 renderer as renderer-level fallback.
- Added deterministic build-time GLB generation through `vite.config.js` and `tools/generate-samurai-glb.mjs`; provenance is recorded in `docs/ASSET_PROVENANCE.md` and the generated binary is not committed.
- Extended the existing renderer-contract smoke only enough to require the skinned asset and verify Windup → Strike → Parry clip mapping through the real combat sequence.

## 0.11.2-evolution — PlayCanvas combat-motion verification hardening

- Real-app browser gate drives CombatEngine telegraph → strike → parry → counter through the production PlayCanvas `View`, including enemy/player transform progression and interrupted recovery.

## 0.11.1-evolution — PlayCanvas verification gate repair

- Replaced stale single-file WebGL/text assertions with semantic checks for the approved PlayCanvas-primary/WebGL2-fallback architecture while retaining the real Vite browser gate.

## 0.11.0-evolution — PlayCanvas true-3D renderer foundation

- Introduced PlayCanvas standalone + Vite as the primary renderer/build path, true perspective courtyard/lighting/shadows, original articulated primitive samurai and first-person katana; legacy WebGL2 remained fallback.

## 0.10.1-evolution — Phase-aware motion follow-through

- Removed persistent normal-motion smoothing lag and made interrupted recovery depend on authoritative `attack.parried` state so dropped frames catch up correctly.

## 0.10.0-evolution — Four-beat combat motion and adaptive phone rendering

- Added continuous wind-up → swing → impact/follow-through → recovery motion, action-local player sword animation and bounded adaptive render resolution.

## 0.9.0-evolution — Wide-framed samurai visual redraw

- Pulled the opponent farther back, strengthened samurai silhouette/armour and dojo depth, and improved attack-read space in portrait.

## 0.8.0-evolution — Directional impact choreography

- Added bounded direction-aware contact rings, slash afterimages and sparks with reduced-motion fallback.

## 0.7.1-evolution — Guided Duel / STEP integration hardening

- Prevented evade-only stage clear from persisting the parry lesson as complete, hardened STEP pointer coverage and synchronized four-stage copy.

## 0.7.0-evolution — Spacing and footwork

- Added close/mid/far engagement distance, attack reach/setup and timed STEP backstep while preserving directional parry/swipe controls.

## 0.6.1-evolution — Guided Duel CI lifecycle repair

- Corrected the onboarding browser lifecycle assertion after tutorial completion.

## 0.6.0-evolution — Guided first duel onboarding

- Added optional read → parry → counter coaching, adaptive miss guidance, boss rhythm-reset cues and local completion preference.

## 0.5.1-evolution — Boss reduced-motion and browser integration hardening

- Added explicit Phase II banner cleanup and executable boss browser coverage for reduced motion, restart and victory.

## 0.5.0-evolution — Crimson Shogun multi-phase boss

- Added the fourth-stage Crimson Shogun with Blood Moon Phase II, stronger pressure and bounded boss atmosphere.

## 0.4.1-evolution — Mastery browser integration hardening

- Added browser coverage for mastery event-stream integration, best-run preservation, blocked storage and 320×568 result layout.

## 0.4.0-evolution — Mastery grading and personal best

- Added 0–100 mastery, S/A/B/C/D grades, run feedback and local-only personal best.

## 0.3.0-evolution — Posture and guard-break pressure

- Added player/enemy posture, guard-break counter bonus and player guard-break consequence.

## 0.2.1-evolution — Renderer correctness hardening

- Fixed player-katana SDF, ordered GLSL masks and added headless WebGL2 smoke verification.

## 0.2.0-evolution — Combat animation readability

- Added phase-driven enemy anticipation, strike commitment, recovery follow-through, articulated stance and blade trails.

## 0.1.0 — Initial playable baseline

- Added mobile-first first-person WebGL dojo, directional parry/swipe combat, three enemies, progression, HUD/audio, tests, CI and evolution SOT.
