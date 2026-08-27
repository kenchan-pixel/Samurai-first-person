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
- **Run 021 — Original skinned samurai vertical slice:** deterministic local GLB generated from repository source, 19-joint skin, layered armour and five real skeletal clips; combat phase progress remains authoritative and the primitive renderer character remains fallback.
- **Run 022 — Current-baseline CI gate repair:** removed stale sentence-coupled SOT assertions so the existing Node + production PlayCanvas browser gate can verify the skinned-character baseline again without adding a new test harness.

## Highest priority — physical-phone quality and animation refinement

The engine migration and first skinned-character slice are now production-facing. Do not spend another run building framework infrastructure unless phone evidence exposes a real bottleneck.

Preferred next work:

1. **Physical-iPhone visual/performance tuning** — inspect normal combat distance, sustained frame time, heat and load time; tune model/material/shadow/pixel-ratio budget based on evidence.
2. **Directional skeletal attack variants** — expand left/right/bottom attack body language so blade direction is readable primarily from pose, not UI. Reuse the same combat-authoritative timing contract.
3. **Enemy-specific visual language** — vary helmet/armour/weapon silhouette or animation rhythm per stage without creating four heavyweight duplicate assets.
4. **First-person weapon fidelity** — upgrade player hands/katana only after enemy readability and frame budget are stable.

## High-value product candidates after the core fidelity path

1. **Accessibility mode** — adjustable timing assistance, left-handed layout, high-contrast telegraphs and broader motion controls.
2. **Challenge mode** — endless or seeded sequence with escalating tempo, mastery-aware scoring and clean restart.
3. **Boss refinement** — stronger signature weapon/animation language and phase tuning from play evidence.
4. **Onboarding follow-through** — only if player evidence shows remaining confusion.

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
