# Changelog

## 0.8.0-evolution — Directional impact choreography

- Added a dedicated event-driven impact layer for normal/perfect parries, counters, guard-break strikes, and player hits without changing combat resolution.
- Impact contact now appears toward the relevant attack/counter direction; perfect parries and guard-break hits use larger shock rings, counters add short slash afterimages, and incoming damage uses a distinct red burst.
- Impact nodes are pointer-transparent, capped to three concurrent bursts, and removed after a bounded lifetime; reduced-motion preference suppresses traveling sparks/slashes while keeping a short contact ring/core.
- Added pure Node coverage for impact profile/direction mapping plus a 320×568 browser harness that drives real `CombatEngine` events and verifies perfect-parry/counter/damage presentation, pointer safety, viewport containment, and cleanup.
- Extended the real-app browser smoke gate to require impact initialization alongside WebGL, mastery, boss, onboarding, and footwork controllers.
- No enemy HP/damage/timing, posture math, reach, boss phase rules, mastery scoring/storage, input mapping, networking, dependencies, or framework changed.

## 0.7.1-evolution — Guided Duel / STEP integration hardening

- Fixed Guided Duel completion so clearing the opening Ashigaru through STEP/evade counters without a demonstrated parry no longer persists the tutorial as completed; the lesson remains eligible on the next run.
- Added Node and 320×568 browser regressions proving evade-only stage clear does not write the completion preference and a fresh run still enables guidance.
- Hardened the real STEP button browser path with pointerdown/pointerup dispatch, pointer-capture observation, stop-propagation isolation, drag-distance rejection, short-range evade, long-range tracking, and post-STEP canvas pointer reset checks.
- Updated the visible victory summary and README from the older three-enemy description to the current four-duel campaign and STEP baseline.
- No combat timing, damage, reach values, boss rules, mastery scoring, storage schema, network service, dependency, framework, or merge policy changed.

## 0.7.0-evolution — Spacing and footwork

- Added close / mid / far engagement distance as a new combat dimension while preserving the existing four-direction edge parry and swipe-counter controls.
- Enemy attack profiles now set up at readable engagement ranges; light attacks can approach/retreat/sidestep while long/heavy attacks can retain reach from farther away.
- Added a compact mobile `STEP / 後撤` control. A correctly timed early-strike backstep increases distance by one; if that moves the player beyond the current attack's reach, the strike whiffs and creates a normal counter opening.
- Long/heavy reach-2 attacks continue to track at far distance, preventing STEP from becoming universal invulnerability; directional parry remains required when the attack can still reach.
- Successful evade counters close one distance step. Stage start/restart returns spacing to mid, and reduced-motion preference disables only the camera movement rather than the underlying reach rules.
- Added pure Node coverage for short-range evade/counter, long/heavy tracking and wrong-time STEP rejection, plus a 320×568 browser footwork harness and real-app footwork initialization gate.
- No network service, storage, account, asset, dependency, or framework was added.

## 0.6.1-evolution — Guided Duel CI lifecycle repair

- Fixed the onboarding browser harness so it captures the first-time Guided Duel toggle before completing the tutorial instead of incorrectly asserting that the toggle should still be enabled after completion.
- The same browser gate now verifies the complete preference lifecycle: first-time guidance starts enabled, successful read/parry/counter completion persists `completed`, and the toggle defaults off immediately afterward as designed.
- No gameplay timing, damage, input mapping, coach copy, storage semantics, boss behavior, mastery logic, renderer, or deployment behavior changed.

## 0.6.0-evolution — Guided first duel onboarding

- Added an optional first-time Guided Duel coach that reacts to the real opening Ashigaru event stream and teaches read-the-blade → directional parry → swipe counter using normal combat rules rather than a separate tutorial mode.
- Added adaptive cues for wrong direction, wrong timing, feints, enemy posture and guard break, then collapses the coach after the player demonstrates the core loop.
- Added a compact start-screen toggle plus local-only completion preference; storage failure is non-fatal and no analytics/network service is introduced.
- Added brief boss rhythm-reset cues for Crimson Shogun entry and Blood Moon Phase II when guidance remains enabled.
- Added pure Node coverage for coach progression/adaptive cues and a 320×568 browser harness that drives the real `CombatEngine`, verifies wrong-direction correction → parry → counter completion, and proves the coach remains pointer-transparent and inside the viewport.
- Extended the real-app browser smoke gate to require onboarding initialization/toggle wiring while preserving WebGL, mastery and boss integration gates.

## 0.5.1-evolution — Boss reduced-motion and browser integration hardening

- Fixed the Blood Moon Phase II banner so its visibility has an explicit bounded lifetime instead of relying on CSS animation completion; reduced-motion users no longer keep the banner over the fight indefinitely.
- Added explicit boss overlay timer cleanup so restart/reset cannot inherit stale phase-banner or delayed atmosphere-deactivation timers.
- Added a deterministic 320×568 browser boss harness that runs with `prefers-reduced-motion`, drives the real patched `CombatEngine` through boss activation and Phase II, verifies the banner hides while Phase II remains active, verifies restart-to-Phase-I, and reaches final victory.
- Extended `npm run test:browser` to execute the boss integration harness in addition to existing WebGL/startup and mastery integration checks.
- Preserved all boss timings, HP/posture values, directional controls, mastery behavior, static deployment model, and owner-only merge gate.

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
