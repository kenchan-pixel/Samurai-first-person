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
- **Run 014 — Wide visual redraw:** readable full-body framing and stronger procedural samurai/dojo depth.
- **Run 015–017 — Four-beat motion:** elapsed-time wind-up/swing/impact/recovery, adaptive render scale and authoritative parry interruption handling.
- **Run 018 — First PlayCanvas production slice:** PlayCanvas standalone + Vite primary renderer, true perspective scene, articulated original primitive samurai and legacy WebGL2 fallback.
- **Run 019 — PlayCanvas verification repair:** current architecture/browser gate restored after stale smoke assertions.
- **Run 020 — PlayCanvas motion-contract verification:** real production View driven through telegraph → strike → parry → counter.
- **Run 021 — Original skinned samurai vertical slice:** deterministic local GLB, 19-joint skin, layered armour and five skeletal clips.
- **Run 022 — Current-baseline CI gate repair:** stale sentence-coupled assertions repaired without adding another harness.
- **Run 023 — Skinned animation binding repair:** PlayCanvas animation Assets unwrapped to real AnimTracks and the production GLB path restored.
- **Run 024 — Directional skinned combat read:** four-direction full-body choreography plus an in-world sword-bone read trail.
- **Run 025 — Stage-specific skinned identities:** four clearly different opponent silhouettes/weapon profiles on the same rig, with bounded bone-attached accessories and no duplicate character downloads.

## Highest priority — physical-phone quality and player weapon fidelity

The engine migration, skinned-character path, directional choreography and stage silhouettes are production-facing. Do not spend another run building framework infrastructure unless phone evidence exposes a real bottleneck.

Preferred next work:

1. **Physical-iPhone visual/performance tuning** — inspect normal combat distance, sustained frame time, heat and load time; tune material/shadow/pixel-ratio budget from evidence.
2. **First-person weapon fidelity** — improve player hands/katana silhouette, grip and motion while keeping the main opponent read clear.
3. **Directional clip authoring only if needed** — runtime body/blade choreography already provides distinct reads; add separate imported clips only if physical play shows a genuine limit.
4. **Accessibility mode** — adjustable timing assistance, left-handed layout, high-contrast telegraphs and broader motion controls.

## High-value product candidates after the core fidelity path

1. **Challenge mode** — endless or seeded sequence with escalating tempo, mastery-aware scoring and clean restart.
2. **Boss refinement** — stronger signature animation/phase language and tuning from play evidence.
3. **Onboarding follow-through** — only if player evidence shows remaining confusion.

## Technical opportunities

- Compact physical-device performance readout only if needed to tune the 60 Hz budget.
- KTX2/Basis only when textured materials are introduced and memory/transfer evidence justifies it.
- Deterministic replay of combat inputs only if future complexity makes current focused regressions insufficient.
- Installable PWA/offline shell after renderer/asset loading stabilises.

## Avoid until justified

- Multiplayer, accounts/cloud saves, monetisation, large inventory systems or open-world navigation.
- React migration solely to host the renderer.
- Physics engine without a gameplay requirement.
- Downloaded 3D assets without explicit provenance/licence review.
- Retiring the primitive or legacy WebGL2 fallbacks before physical-phone evidence is adequate.
- Test/refactor work that does not protect a real risk or unlock a visible result.
