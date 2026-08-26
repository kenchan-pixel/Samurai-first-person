# Changelog

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
