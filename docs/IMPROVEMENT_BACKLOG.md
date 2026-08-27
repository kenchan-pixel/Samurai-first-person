# Improvement Backlog

This is a candidate pool, not a fixed roadmap. Each evolution run should re-evaluate priority against the latest product state and direct user feedback.

## Recently delivered

- **Run 002 — Animation readability:** anticipation, body commitment, articulated stance and blade trails.
- **Run 003 — Renderer/WebGL correctness:** katana SDF/GLSL fixes and executable WebGL browser smoke.
- **Run 004 — Posture / guard break:** player/enemy posture, thresholds and counter consequences.
- **Run 005–006 — Mastery:** grading, local best and browser/storage/layout hardening.
- **Run 007–008 — Crimson Shogun:** multi-phase boss plus reduced-motion/browser hardening.
- **Run 009–010 — Guided Duel:** read/parry/counter onboarding plus lifecycle repair.
- **Run 011–012 — Spacing/STEP:** close/mid/far engagement and safe onboarding/pointer integration.
- **Run 013 — Impact choreography:** bounded direction-aware contact feedback with reduced-motion fallback.
- **Run 014 — Wide visual redraw:** more readable full-body framing and stronger procedural samurai/dojo depth.
- **Run 015–017 — Four-beat motion:** elapsed-time wind-up/swing/impact/recovery, adaptive render scale and parry-authoritative dropped-frame recovery handling.
- **Run 018 — First PlayCanvas production slice:** PlayCanvas standalone + Vite becomes the primary renderer, with a real perspective 3D courtyard, lighting, articulated original samurai/player katana and adaptive pixel ratio; legacy WebGL2 remains temporary fallback and the real production bundle is browser-gated.
- **Run 019 — PlayCanvas verification repair:** repository smoke assertions now validate the approved PlayCanvas-primary/WebGL2-fallback architecture and current four-duel SOT instead of stale single-file WebGL source/text details, allowing the real Vite/PlayCanvas browser gate to run.
- **Run 020 — PlayCanvas motion-contract verification:** the existing real-app browser gate now drives a representative CombatEngine telegraph → strike → parry → counter sequence through the production PlayCanvas `View`, proving enemy body/blade motion, interrupted recovery and player katana action transforms rather than only initialization.

## Highest priority — finish the rigged-character fidelity migration

Run 018 proves the engine/build/renderer seam without importing an unverified character pack. Run 020 closes the remaining current-head browser verification gap around actual PlayCanvas combat-motion mapping. Once Run 020 exact-head CI and Preview are terminal green, the next visible step is asset fidelity rather than more framework or test work.

Preferred next slice:

1. add one **local, clearly licensed/original skinned samurai glTF/GLB** with recorded provenance;
2. use real skeletal animation clips/blending for idle + representative directional attack + parry reaction/recovery;
3. continue driving timing from `game-core.js` rather than letting the animation clip redefine parry windows;
4. keep full-body portrait readability and current HUD/input behaviour;
5. compare load size/frame time against Run 018 on the same Preview and physical iPhone;
6. only retire the legacy renderer after the PlayCanvas path has enough real-device evidence.

Do not spend a full run merely converting file formats or building an asset-management framework. Asset work should land as a visible playable improvement.

## High-value candidates after / alongside 3D fidelity

1. **Accessibility mode** — adjustable timing assistance, left-handed layout, high-contrast telegraphs and broader motion controls.
2. **Challenge mode** — endless or seeded sequence with escalating tempo, mastery-aware scoring and clean restart.
3. **Boss refinement** — signature model/weapon/animation language and phase tuning based on play evidence.
4. **Onboarding follow-through** — only if player evidence shows remaining confusion.

## Technical opportunities

- Physical-device frame sampling / compact developer performance readout for evidence-based tuning.
- Deterministic replay of combat inputs for broader regression testing if future complexity needs it.
- Installable PWA/offline shell after the renderer/asset path is stable.
- Migrate selected new 3D code toward stronger TypeScript typing only where it reduces real integration risk.

## Avoid until justified

- Multiplayer.
- Accounts and cloud saves.
- Monetisation.
- Large inventory/equipment systems.
- Open-world navigation.
- React migration solely to host the renderer.
- Physics engine without a gameplay requirement.
- Downloaded 3D assets without explicit provenance/licence review.
- Test/refactor work that does not protect a real risk or unlock a visible result.
