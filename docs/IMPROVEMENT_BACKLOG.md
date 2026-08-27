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

## Highest-priority Decision Gate — rigged 3D character pipeline

Physical iPhone evidence shows that the procedural shader character is still not detailed enough. The next fidelity step should therefore be evaluated as a deliberate architecture/asset decision rather than another small shader repaint.

**Status: OPEN — migration not approved.** See `docs/3D_PIPELINE_DECISION_GATE.md`.

Candidate prototype order:

1. **Three.js + local glTF/GLB rigged character** — tentative first prototype because it is a focused browser 3D library with a large ecosystem and MIT licence.
2. **Babylon.js + local glTF/GLB rigged character** — stronger full game-engine/tooling option; evaluate if its extra scene/animation tooling materially reduces implementation cost.
3. **Stay on custom WebGL2 + build our own rig/model loader** — lowest dependency count but highest engineering burden; only retain if engine/library overhead is proven unacceptable.

Before approving a migration, one bounded prototype must compare: load size, first-load time, animation quality, sustained physical-phone frame timing, memory/GPU symptoms, asset provenance/licence, mobile Safari compatibility, and integration cost with the existing combat state machine.

## High-value candidates after the Decision Gate

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
