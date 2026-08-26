# Changelog

## 0.5.0-evolution — Crimson Shogun multi-phase boss

- Added Crimson Shogun as a fourth-stage boss after the three approved baseline enemies without removing or reordering the existing campaign.
- Added a deterministic Phase I → Blood Moon Phase II transition at 6 HP or lower after a valid counter, with posture/attack reset and an 1100 ms breathing gap.
- Phase II raises boss posture resistance, tightens the perfect-parry window, shortens neutral/recovery timing, and switches to a faster feint/heavy signature pattern.
- Added a bounded boss-only blood-moon/ember atmosphere plus an explicit Phase II banner; the decorative layer is pointer-transparent, asset-free, and honours reduced-motion preference.
- Added Node coverage for boss injection, phase transition, pressure reset and restart-to-Phase-I, plus browser readiness verification for the real app module wiring.
- Preserved the existing directional parry/swipe interaction, posture bonuses, mastery/personal-best behavior, static deployment model, and owner-only merge gate.

## 0.4.1-evolution — Mastery browser integration hardening

- Extended the headless browser gate beyond module initialization to exercise the real mastery observer through the actual `CombatEngine` event stream.
- Added deterministic browser checks that a completed victory renders mastery fields, persists a personal best, and refuses to replace that best with a worse victory.
- Added a blocked-`localStorage` browser case proving mastery result rendering remains non-fatal when storage writes throw.
- Added a 320×568 result-layout gate that requires the mastery content and restart control to remain inside the smoke viewport.
- Kept gameplay, scoring weights, input mapping, combat timing, rendering and production storage behavior unchanged.

## 0.4.0-evolution — Mastery grading and personal best

- Added a run-level mastery observer that records parry attempts/success, perfect parries, enemy guard breaks, counters, hits taken, damage dealt/taken, and clear time without changing combat resolution.
- Added deterministic 0–100 mastery scoring and S/A/B/C/D victory grades weighted toward accurate/perfect defence, guard breaks, counters, low damage taken, and efficient clears; defeats remain D while still showing learning stats.
- Upgraded the existing result screen to show mastery grade/score, parry accuracy, perfect-parry count, guard breaks, hits taken, clear time, and personal-best status.
- Added local-only personal-best persistence with safe `localStorage` fallback; no account, analytics, network sync, or external API is introduced.
- Added pure Node coverage for mastery event tracking, grading, personal-best comparison, and time formatting.
- Extended the browser smoke gate to require the mastery observer to initialize alongside WebGL2 and the start control.

## 0.3.0-evolution — Posture and guard-break pressure

- Added persistent player and enemy posture to the combat state machine without changing the four-direction parry/swipe interaction model.
- Successful parries now pressure enemy posture; perfect parries build it faster, while Ashigaru/Ronin/Oni use increasing posture thresholds.
- Breaking enemy posture extends the current counter opening and grants +2 damage to the next valid counter; posture then resets.
- Incoming hits build player posture, heavy attacks build it faster, and a full player posture break adds +1 damage to that hit before posture resets; successful parries relieve pressure.
- Added compact posture readouts plus distinct guard-break prompts, hit-stop/shake, audio and optional vibration feedback.
- Added Node coverage for enemy guard-break bonus/reset and player posture break/reset while preserving all existing combat tests.

## 0.2.1-evolution — Renderer correctness hardening

- Fixed the foreground player-katana signed-distance mask so the blade remains localized instead of degenerating into a frame-wide tint.
- Replaced undefined reversed-edge GLSL `smoothstep` masks with ordered signed-distance masks for consistent WebGL ES behavior across drivers.
- Added a dependency-free headless Chrome/Chromium WebGL2 smoke test that verifies shader compile/link and an enabled start control in CI.
- Kept combat rules, enemy timings, input mapping, progression and gameplay content unchanged.

## 0.2.0-evolution — Combat animation readability

- Replaced the rigid enemy presentation with phase-driven procedural anticipation, strike commitment, and recovery follow-through.
- Added articulated arm/hand positioning, stance/legs, torso lean, stage-scaled silhouette details, and a grounded shadow.
- Added a restrained telegraph blade halo and short strike trail so the attack path is readable from motion as well as the existing HUD cue.
- Kept the combat rules, touch/swipe mapping, enemy timing, generated audio, and single-pass low-dependency WebGL architecture unchanged.

## 0.1.0 — Initial playable baseline

- Added mobile-first first-person WebGL dojo.
- Added directional tap parries and directional swipe attacks.
- Added timing windows, perfect parry, counter damage, player damage, and recovery states.
- Added three enemies with distinct attack patterns, health, damage, tempo, and feints.
- Added stage progression, victory/defeat flow, touch tutorial, HUD, generated audio, and desktop fallback.
- Added regression, evolution, and product-goal source-of-truth documents.
- Added Node tests and GitHub Actions CI.
