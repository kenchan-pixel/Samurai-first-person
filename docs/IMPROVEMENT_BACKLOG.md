# Improvement Backlog

This is a candidate pool, not a fixed roadmap. Each evolution run should re-evaluate priority against the latest product state and direct user feedback.

## Recently delivered

- **Run 002 — Animation readability pass:** procedural anticipation, body commitment, recovery follow-through, articulated arms/stance, blade-read halo and strike trail.
- **Run 003 — Renderer/WebGL correctness:** localized player-katana SDF, ordered GLSL masks and browser WebGL compile/link/startup smoke.
- **Run 004 — Posture / guard-break system:** player/enemy posture, thresholds, guard-break counter bonus/window and HUD feedback.
- **Run 005 — Mastery grading and personal best:** mastery result feedback and local best-victory persistence.
- **Run 006 — Mastery integration hardening:** executable browser coverage for mastery, storage fallback and 320×568 result layout.
- **Run 007 — Crimson Shogun boss:** fourth-stage multi-phase boss, Blood Moon ruleset shift and arena atmosphere.
- **Run 008 — Boss accessibility/integration hardening:** bounded reduced-motion Phase II banner plus executable boss browser flow.
- **Run 009 — Guided first duel:** interactive read/parry/counter coaching and local completion preference.
- **Run 010 — Guided Duel CI lifecycle repair:** corrected first-time → completed browser verification.
- **Run 011 — Spacing and footwork:** close/mid/far engagement, attack reach and timed STEP backstep.
- **Run 012 — Guided Duel / STEP integration hardening:** evade-only tutorial non-completion, real STEP pointer path and four-stage copy sync.
- **Run 013 — Directional impact choreography:** bounded direction-aware contact rings, slash afterimages and sparks with reduced-motion fallback.
- **Run 014 — Wide-framed 3D visual redraw:** pulled the opponent farther back, strengthened procedural samurai silhouettes/armour, dojo depth and anticipation readability.
- **Run 015 — Four-beat motion / adaptive phone rendering:** continuous wind-up → swing → impact/follow-through → recovery animation, interruption damping, action-local player sword timing and bounded adaptive internal resolution.
- **Run 016 — Phase-aware motion follow-through:** normal elapsed-time motion now follows its target directly while only interrupted strike → recovery transitions are damped, removing accumulated visual lag from fast attacks.
- **Run 017 — Parry-authoritative recovery hardening:** recovery damping now uses the real parry state, so dropped-frame natural recoveries catch up immediately without losing smooth genuine-parry interruption.

## Highest-priority implementation — rigged 3D character pipeline

Physical iPhone evidence shows that the procedural shader character is still not detailed enough. The 3D architecture direction is now approved rather than blocked on another selection round.

**Approved direction:** **PlayCanvas Engine standalone + incremental Vite/TypeScript 3D layer + local Blender-authored/licensed glTF/GLB rigged characters + KTX2/Basis textures where useful.** See `docs/3D_PIPELINE_DECISION_GATE.md`.

### Preferred next vertical slice

Deliver a production-facing first PlayCanvas duel slice rather than a throwaway demo:

1. introduce a narrow renderer adapter/fallback seam without moving deterministic combat rules into the engine;
2. load one clearly licensed/original rigged samurai at the current wide combat framing;
3. drive a complete wind-up → swing → impact/follow-through → recovery animation from the existing combat phase/timing state;
4. preserve real parry/swipe/STEP behaviour and stage/restart flow;
5. keep the procedural renderer as a temporary fallback until the new path is proven stable;
6. deploy to the existing Vercel Preview for immediate physical-iPhone quality/performance feedback.

Testing/refactoring should be proportionate to the risks of this slice. Reuse existing regression coverage, add only focused integration evidence for new engine/model/animation failure modes, and avoid spending a run on test-count growth or broad cleanup without visible gameplay payoff.

### Fallback order if evidence rejects PlayCanvas

1. **Babylon.js + local glTF/GLB rigged character** — strongest full-engine alternative if it provides a material animation/performance/maintenance advantage.
2. **Three.js + local glTF/GLB rigged character** — focused rendering-library alternative if a thinner engine layer proves preferable.
3. **Stay on custom WebGL2 + build our own rig/model loader** — only if third-party engine overhead is proven unacceptable; highest engineering burden.

A new human Decision Gate is needed only if evidence points to a substantially different direction or introduces new material cost/privacy/licensing risk.

## High-value candidates after / alongside the 3D migration

1. **Accessibility mode** — adjustable timing assistance, left-handed layout, high-contrast telegraphs and broader motion controls.
2. **Challenge mode** — endless or seeded sequence with escalating tempo, mastery-aware scoring and a clean restart loop.
3. **Boss refinement** — signature weapon/animation language and phase tuning based on play evidence, not more stacked mechanics.
4. **Onboarding follow-through** — only if player evidence shows remaining confusion; avoid turning the first duel into a long tutorial.

## Technical opportunities

- Performance HUD / physical-device frame sampling for evidence-based quality tuning.
- Pointer-level browser interaction smoke for representative physical edge-parry/swipe gestures; STEP is already covered.
- Deterministic replay of combat inputs for broader regression testing.
- Installable PWA and offline shell.
- Continue separating rendering, audio, input and encounter controllers only when complexity warrants it.

## Avoid until justified

- Multiplayer.
- Accounts and cloud saves.
- Monetisation.
- Large inventory/equipment systems.
- Open-world navigation.
- Framework migration solely for fashion or preference.
- Downloaded 3D asset packs without explicit provenance/licence review and mobile performance evidence.
- Test or refactor work that does not protect a real risk or unlock a player-visible result.
