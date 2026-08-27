# Changelog

## 0.10.1-evolution — Phase-aware motion follow-through

- Removed persistent EMA-style smoothing from normal elapsed-time enemy motion so the fastest 175–330 ms strike phases can visually reach their intended pose instead of trailing behind the game timeline.
- Normal telegraph, strike and recovery frames now follow the deterministic motion target directly, including after a slow frame, preventing accumulated animation latency.
- Early successful parries still receive bounded multi-frame strike → recovery damping so interruption remains smooth rather than teleporting.
- Follow-up hardening makes strike → recovery damping depend on authoritative `attack.parried` state rather than inferring interruption from the previous rendered pose.
- A natural recovery after a skipped/slow render frame now catches up to the correct elapsed-time target immediately; only a genuine parry interruption keeps bounded multi-frame damping.
- Added focused regression coverage for identical stale strike poses followed by natural versus explicitly interrupted recovery.
- Added regression coverage for same-phase direct tracking, natural phase boundaries, multi-frame interrupted recovery, object reuse and adaptive render scaling.
- No combat timing, parry window, damage, posture, reach, STEP, boss, mastery, onboarding or renderer-stack rule changed.

## 0.10.0-evolution — Four-beat combat motion and adaptive phone rendering

- Reworked enemy visual motion around continuous wind-up → swing → impact/follow-through → recovery pose weights instead of phase-local pose resets.
- Added transition damping so an early successful parry no longer teleports the opponent sword/body directly from an early strike pose into recovery.
- Added coherent stance, torso, arm, hilt, blade-trail and cape/weight-shift motion driven by the same elapsed-time choreography.
- Replaced global-clock foreground-katana wrapping with action-local parry/slash progress so player sword motion starts and returns predictably.
- Added bounded adaptive internal render resolution based on rolling frame time to protect a 60 Hz-oriented phone experience without changing combat timing.
- Added deterministic Node coverage for motion boundaries, impact beats, interrupted-parry smoothing, object reuse and render-scale decisions.
- Opened a documented 3D fidelity Decision Gate: Three.js + local glTF/GLB is the tentative prototype path, but no runtime engine/model migration is approved yet.

## 0.9.0-evolution — Wide-framed samurai visual redraw

- Pulled the enemy materially farther back in portrait combat so the full helmet-to-feet silhouette and sword path have more negative space.
- Redrew the procedural opponent with layered samurai armour, stage-specific head/helmet language, menpo, shoulder plates, lamellar skirt plates, greaves and stronger light/shadow separation.
- Added deeper dojo composition with receding roof/gate, pillars, lanterns and perspective floor cues while keeping the centre combat lane clear.
- Enlarged the two-handed anticipation motion and added a directional sword-read arc; kept strike/recovery timing tied to the existing combat phases.
- Reduced the foreground player-katana footprint so it remains first-person but obstructs less of the opponent.
- Extracted the WebGL renderer into `src/renderer.js` without changing combat/input/state rules or adding a framework/asset dependency.
- Real-app browser smoke now requires the new renderer marker and therefore compiles/links the redesigned shader.
- Closed the Run 013 review P2 coverage gap by running the impact harness under real browser reduced-motion preference and proving ring/core fallback, no sparks/slash travel and bounded cleanup.

## 0.8.0-evolution — Directional impact choreography

- Added bounded event-driven direction-aware impact rings, slash afterimages and sparks for parry/counter/guard-break/player-hit events with reduced-motion fallback.

## 0.7.1-evolution — Guided Duel / STEP integration hardening

- Prevented evade-only stage clear from persisting the core parry lesson as complete, hardened real STEP pointer coverage and synchronized four-stage copy.

## 0.7.0-evolution — Spacing and footwork

- Added close/mid/far engagement distance, attack reach/setup and timed STEP backstep while preserving directional parry/swipe controls.

## 0.6.1-evolution — Guided Duel CI lifecycle repair

- Corrected the onboarding browser lifecycle assertion after tutorial completion.

## 0.6.0-evolution — Guided first duel onboarding

- Added optional event-driven read → parry → counter coaching, adaptive miss guidance, boss rhythm-reset cues and local completion preference.

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
