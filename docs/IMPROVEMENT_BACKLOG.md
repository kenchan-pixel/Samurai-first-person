# Improvement Backlog

This is a candidate pool, not a fixed roadmap. Each evolution run should re-evaluate priority against the latest product state.

## High-value candidates

1. **Animation readability pass** — procedural body poses, anticipation, contact, follow-through, recovery, and stronger directional silhouettes.
2. **Posture system** — player and enemy posture, guard breaks, pressure choices, HUD, and enemy-specific posture behaviour.
3. **Boss vertical slice** — one multi-phase boss with phase transition, signature attacks, and a distinct arena event.
4. **Combat juice pass** — hit stop, time dilation, camera impulse, blade sparks, directional audio, and optional haptics.
5. **Enemy spacing and footwork** — advance, retreat, sidestep, distance-dependent attacks, and player-facing camera response.
6. **Scoring and mastery** — parry accuracy, perfect timing, damage avoided, clear time, grade, and local best result.
7. **Challenge mode** — endless or seeded sequence with escalating tempo and a clean restart loop.
8. **Onboarding redesign** — teach direction and timing through an interactive first duel rather than instruction text.
9. **Accessibility mode** — adjustable timing windows, left-handed layout, reduced camera motion, high-contrast telegraphs, and sound-independent cues.
10. **Visual identity pass** — original environments, weather, lighting, silhouette language, and enemy art direction using procedural assets.

## Technical opportunities

- Automated browser smoke testing at representative mobile viewports.
- Performance HUD and adaptive render quality.
- Deterministic replay of combat inputs for regression testing.
- Installable PWA and offline shell.
- Separate rendering, audio, input, and encounter controllers as complexity grows.

## Avoid until justified

- Multiplayer.
- Accounts and cloud saves.
- Monetisation.
- Large inventory/equipment systems.
- Open-world navigation.
- Framework migration solely for fashion or preference.
