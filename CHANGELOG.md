# Changelog

## 0.14.2-evolution — Real blade trajectory + Perfect Parry riposte

- Run 028 blocker repair replaced unreachable absolute blade-tip targets with normalized hilt-relative world-space blade axes and a front-loaded strike commitment, so the real fixed-length Sword advances continuously toward the player-facing plane without relaxing the production browser contract.
- Replaced pose/echo-based enemy weapon implication with four real world-space 3D blade-tip paths on the actual skinned `Sword` joint. Top/right/bottom/left strikes now advance into camera depth, cross a player-facing parry plane, follow through and recover.
- Added a bounded strike depth lunge plus six reusable world-space trail segments sampled from the actual blade-tip history; old attached swing echoes are suppressed while this path is active.
- Enlarged STEP primary text materially for phone play, removed its tiny secondary label, and enlarged range/temporary feedback while retaining the lower-right non-overlap layout.
- Perfect Parry now immediately deals 1 automatic light-riposte damage and produces the existing player counter-slash feedback. The player can still swipe once in the same recovery opening.
- Moved the previous +1 perfect damage bonus from the later manual counter into the automatic riposte so a normal perfect + opposite-direction follow-up keeps approximately the same total damage instead of stacking a new free bonus.
- Added focused Node coverage for perfect/normal parry behaviour and extended the existing production PlayCanvas browser contract to verify four-direction blade-tip movement, player-facing plane crossing, bounded world-space trail and STEP text readability.

## 0.14.1-evolution — Physical-iPhone combat readability repair

- Re-timed the existing skinned `Strike` presentation with a smootherstep playback curve, small full-body whip and two bounded sword-bone afterimages so the cut reads as a continuous accelerating swing instead of pose changes; combat timing remains authoritative in `game-core.js`.
- Added a stronger direction-aware successful-parry clash with a short contact wash, expanding ring and crossed blade flash; perfect parry remains visibly stronger and reduced-motion retains a compact cue.
- Reduced live-fight instruction density by suppressing quiet read/track prompts, hiding persistent prompt subtitles/passive edge labels/gesture copy, and enlarging the critical direction indicator and core HUD type.
- Moved STEP and its range chip to the lower-right safe corner, outside the bottom-block and right-block regions at the 320×568 acceptance viewport, without changing STEP mechanics or pointer isolation.

## 0.14.0-evolution — Stage-specific skinned enemy identities

- Gave all four duels distinct opponent silhouettes while reusing the same locally generated skinned GLB and five combat-authoritative skeletal clips.
- Ashigaru uses a broad jingasa; Ronin a headband/sash and altered tsuba; Oni horned heavy armour and heavier blade; Crimson Shogun tall antlers, sashimono and enlarged crimson weapon silhouette.

## 0.13.0-evolution — Directional skinned combat readability

- Added distinct top/right/bottom/left full-body choreography around the loaded skinned samurai while keeping the same `Windup / Strike / Recovery / Parry` clip pipeline.
- Added a bounded translucent read trail attached to the actual skinned sword bone during telegraph/strike.

## 0.12.2-evolution — Skinned GLB runtime binding repair

- Unwrapped PlayCanvas container animation Assets to real `AnimTrack` resources, created the missing combat layer and restored the fail-closed skinned production path.

## 0.12.1-evolution — Current-baseline CI gate repair

- Repaired stale repository-smoke wording assertions so the real Vite/PlayCanvas browser gate could execute without weakening coverage.

## 0.12.0-evolution — Original skinned samurai and skeletal combat clips

- Added a deterministic repository-authored 19-joint skinned GLB samurai, layered armour and real `Idle`, `Windup`, `Strike`, `Recovery`, `Parry` clips; primitive and WebGL2 fallbacks remained.

## 0.11.2-evolution — PlayCanvas combat-motion verification hardening

- Real-app browser gate drives CombatEngine telegraph → strike → parry → counter through the production PlayCanvas View.

## 0.11.1-evolution — PlayCanvas verification gate repair

- Replaced stale single-file WebGL/text assertions with semantic checks for PlayCanvas-primary/WebGL2-fallback architecture.

## 0.11.0-evolution — PlayCanvas true-3D renderer foundation

- Introduced PlayCanvas standalone + Vite as primary renderer/build path with perspective courtyard, lighting/shadows, articulated samurai and first-person katana; legacy WebGL2 remained fallback.

## 0.10.1-evolution — Phase-aware motion follow-through

- Made interrupted recovery depend on authoritative `attack.parried` state so dropped frames catch up correctly.

## 0.10.0-evolution — Four-beat combat motion and adaptive phone rendering

- Added continuous wind-up → swing → impact/follow-through → recovery motion, action-local player sword animation and bounded adaptive render resolution.

## 0.9.0-evolution — Wide-framed samurai visual redraw

- Pulled the opponent farther back, strengthened samurai silhouette/armour and dojo depth, and improved attack-read space in portrait.

## 0.8.0-evolution — Directional impact choreography

- Added bounded direction-aware contact rings, slash afterimages and sparks with reduced-motion fallback.

## 0.7.1-evolution — Guided Duel / STEP integration hardening

- Prevented evade-only stage clear from persisting the parry lesson as complete, hardened STEP pointer coverage and synchronized four-stage copy.

## 0.7.0-evolution — Spacing and footwork

- Added close/mid/far engagement distance, attack reach/setup and timed STEP backstep while preserving directional parry/swipe controls.

## 0.6.1-evolution — Guided Duel CI lifecycle repair

- Corrected onboarding browser lifecycle assertion after tutorial completion.

## 0.6.0-evolution — Guided first duel onboarding

- Added optional read → parry → counter coaching, adaptive miss guidance, boss rhythm-reset cues and local completion preference.

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
