# Improvement Backlog

This is a candidate pool, not a fixed roadmap. Each evolution run should re-evaluate priority against the latest product state.

## Recently delivered

- **Run 002 — Animation readability pass:** procedural anticipation, body commitment, recovery follow-through, articulated arms/stance, blade-read halo, and strike trail were added to the existing WebGL combat view.
- **Run 003 — Renderer/WebGL correctness:** localized player-katana SDF, ordered GLSL masks, and dependency-free browser WebGL compile/link/startup smoke coverage.
- **Run 004 — Posture / guard-break system:** player and enemy posture pressure, enemy-specific thresholds, guard-break counter bonus/window, player guard-break consequence, compact HUD state, and automated combat tests.
- **Run 005 — Mastery grading and personal best:** result-screen mastery score/grade, parry accuracy, perfect-parry/guard-break/hit/clear-time feedback, and local best-victory persistence without accounts or network services.
- **Run 006 — Mastery integration hardening:** browser-level actual-`CombatEngine` mastery event-stream coverage, local-best overwrite protection, blocked-storage fallback, and 320×568 result-layout verification.
- **Run 007 — Crimson Shogun boss:** fourth-stage multi-phase boss, Blood Moon tempo/attack transition, posture reset/breathing gap, distinct procedural arena atmosphere, restart safety, and automated encounter coverage.
- **Run 008 — Boss accessibility/integration hardening:** bounded Phase II banner lifetime under reduced motion plus browser-level boss activation, Phase II, restart and final-victory regression coverage.
- **Run 009 — Guided first duel:** first-time interactive read/parry/counter coaching, adaptive miss/feint/posture guidance, optional start-screen toggle, boss rhythm reset cues, local completion preference, and 320×568 browser integration coverage.
- **Run 010 — Guided Duel CI lifecycle repair:** fixed the browser gate to capture the first-time enabled toggle before combat, then verify tutorial completion persists and correctly defaults guidance off afterward.

## High-value candidates

1. **Enemy spacing and footwork** — advance, retreat, sidestep, distance-dependent attacks, and player-facing camera response.
2. **Combat juice pass** — richer hit stop/time dilation, camera impulse, impact sparks, directional audio, and optional haptics beyond the current baseline feedback.
3. **Challenge mode** — endless or seeded sequence with escalating tempo, mastery-aware scoring, and a clean restart loop.
4. **Accessibility mode** — adjustable timing windows, left-handed layout, reduced camera motion, high-contrast telegraphs, and sound-independent cues.
5. **Visual identity pass** — original environments, weather, lighting, silhouette language, and enemy art direction using procedural assets.
6. **Boss refinement** — only after play/review evidence: additional boss-specific renderer silhouette/weapon language, phase tuning, or signature arena interactions rather than immediately stacking more boss mechanics.
7. **Onboarding follow-through** — only if play/review evidence shows confusion remains: teach mastery/replay goals more explicitly without turning the first duel into a long tutorial.

## Technical opportunities

- Pointer-level browser interaction smoke for representative touch/parry/posture flows at mobile viewports; mastery, boss, and onboarding event-stream integration are already covered.
- Performance HUD and adaptive render quality.
- Deterministic replay of combat inputs for broader regression testing.
- Installable PWA and offline shell.
- Separate rendering, audio, input, encounter, onboarding, and run-summary controllers as complexity grows.

## Avoid until justified

- Multiplayer.
- Accounts and cloud saves.
- Monetisation.
- Large inventory/equipment systems.
- Open-world navigation.
- Framework migration solely for fashion or preference.
