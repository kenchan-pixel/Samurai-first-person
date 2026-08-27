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
- **Run 014 — Wide-framed 3D visual redraw:** pulled the opponent materially farther back, redrew stage-specific samurai silhouettes/armour, deepened the dojo scene, strengthened sword/body anticipation, reduced foreground-katana obstruction, separated renderer code, and closed reduced-motion Impact FX browser coverage.

## High-value candidates

1. **Challenge mode** — endless or seeded sequence with escalating tempo, mastery-aware scoring and a clean restart loop.
2. **Accessibility mode** — adjustable timing assistance, left-handed layout, high-contrast telegraphs and broader motion controls.
3. **Visual identity follow-through** — only after real-device review of Run 014: refine proportions, lighting, arena variety or stage-specific colour language based on what still reads poorly.
4. **Boss refinement** — only with play/review evidence: signature silhouette/weapon language, phase tuning or arena interaction rather than stacking mechanics.
5. **Onboarding follow-through** — only if player evidence shows remaining confusion; avoid turning the first duel into a long tutorial.

## Technical opportunities

- Pointer-level browser interaction smoke for representative physical edge-parry/swipe gestures; STEP is already covered.
- Performance HUD and adaptive render quality for real-device tuning.
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
- Large downloaded 3D asset packs before the procedural visual direction has been validated on a real phone.
