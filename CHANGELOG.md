# Changelog

## 0.23.0-evolution — Authored four-direction enemy katana attacks

- Added a deterministic original animation-only `samurai-attacks-v1.glb` pack with `AttackTop`, `AttackRight`, `AttackBottom`, and `AttackLeft` clips on the same 19-joint hierarchy as the existing samurai.
- Normal telegraph → strike → recovery now samples one continuous direction-specific authored track across hips, torso, head, both arms/forearms/hands and sword instead of relying on one generic attack clip plus extra runtime joint manipulation.
- The rejected Run 52 approach remains prohibited: no per-frame direct Chest/arm/HandR overrides were reintroduced. Interrupted recovery still uses the established `Parry` reaction, and the stable world-space blade-tip layer still guarantees the player-facing cut path.
- The attack pack is generated locally at build time, contains no mesh/texture/downloaded motion, and is part of the fail-closed skinned-character browser readiness contract.
- Added deterministic generator/timeline coverage. Combat timing, damage, parry/Perfect windows, STEP, posture, boss phase, score, input and privacy/network authority remain unchanged.

## 0.22.1-evolution — Top-right Pause HUD placement repair

- Moved the live 44×44 Pause control from the lower-centre play field to the conventional top-right safe-area/HUD corner after direct physical-phone owner feedback.
- Pause now owns only its own element hit rectangle; placement validation checks the actual rendered top-right geometry and requires immediately adjacent top/right points to remain canvas parry targets.
- Updated the 320×568 production Combat UX gate to prove button hit isolation plus adjacent directional routing while retaining frozen time, 玩法-return-still-paused, resume, restart and home semantics.
- No combat timing, damage, parry/STEP geometry, enemy balance, persistence/network or renderer authority changed.

## 0.22.0-evolution — Crimson Shogun signature phase language

- Added presentation-only Crimson Shogun choreography on the existing shared 3D rig: Phase I heavy reads settle into a deliberate crouch/forward preparation, while Blood Moon Phase II becomes lower, more forward and more directionally committed.
- Blood Moon also gains a slightly larger sword/read-trail silhouette and stronger crimson emissive on the existing weapon/accent materials, reinforcing the phase change through the opponent rather than extra HUD text.
- The new signature frame is derived only from the existing renderer-neutral boss snapshot; HP, damage, timing, reach, STEP, posture, score and phase authority remain unchanged.
- The implementation reuses existing transforms/materials, allocates no per-frame entities/timers/network work, and retains bounded primitive-fallback body motion when the skinned model is unavailable.
- Added focused deterministic Node coverage for non-boss neutrality, Phase I/II differentiation, mirrored side commitment and recovery release.

## 0.21.1-evolution — Mobile Pause / parry-surface repair

- Moved the 44×44 live Pause control from the active top-right parry surface into a lower-centre neutral tap band while preserving the Run 043 portrait top-parry reach and side/bottom mapping.
- Pause layout now validates its actual rectangle against the same ergonomic direction mapper; the production browser gate fails if Pause consumes a directional target or adjacent top/right routing regresses.
- Added a real-app Pause contract covering frozen combat phase, 玩法-return-still-paused, resume without wall-clock catch-up, restart and home.
- Recorded the accepted asymmetric portrait input, quiet live-HUD and true Pause semantics in Current Baseline / Regression Checklist; combat timing, damage, STEP and enemy balance are unchanged.

## 0.21.0-evolution — Direct Crimson Shogun practice

- Expanded the bounded practice selector into a compact two-button **練浪人 / 練將軍** row without adding another vertical block to the phone start screen.
- **練將軍** launches the real Stage 4 Crimson Shogun at Phase I after the normal boss adapter has initialized, so its 12 HP, Blood Moon threshold/Phase II pressure, reach, damage, posture and presentation remain unchanged.
- Shogun practice terminates after the selected boss duel, offers **再戰將軍** or **開始完整主線**, reuses the existing local mastery/run-analysis surfaces, and is explicitly excluded from campaign personal-best storage.
- Practice result labelling now distinguishes `RONIN PRACTICE` from `SHOGUN PRACTICE`; the existing Ronin route and normal four-stage campaign remain unchanged.
- Added focused Stage 4 practice Node coverage and extended the existing mastery/real-app browser gates to drive both player-facing practice entry → retry → campaign-handoff paths and enforce the 320×568 start layout.

## 0.20.0-evolution — Optional high-contrast blade-read mode

- Added an opt-in **刀路清晰** accessibility toggle that defaults off and stores only a local preference.
- When enabled, four reusable pointer-transparent edge rails mirror the authoritative incoming direction: telegraph follows the displayed blade, Ronin feints move to the final direction, and strike strengthens the cue without covering the centre opponent read.
- The cue clears after successful parry, player hit, stage/terminal transitions and never changes parry windows, damage, reach, STEP, score or enemy behaviour.
- Reduced-motion keeps a static high-contrast cue while removing the strike pulse; blocked localStorage is non-fatal and no network/analytics backend is introduced.
- Added a focused 320×568 browser integration using the real CombatEngine stage-intro → telegraph → strike → parry path, plus fail-closed production initialization/layout checks.

## 0.19.1-evolution — Ronin practice control-path verification repair

- Closed the Run 039 browser-verification P2 by driving the actual **第二關練習** button through the same listener order used by production, then proving the patched CombatEngine starts the real Stage 2 Wandering Ronin.
- The existing mastery browser harness now also exercises **再練浪人** and **開始完整主線**, proving practice retry stays on Stage 2 while campaign handoff returns to Stage 1.
- The real-app 320×568 smoke now requires `data-practice-start-layout="pass"`, so the practice entry cannot silently push the production start screen outside the phone acceptance viewport.
- No combat timing, balance, input rule, persistence, backend telemetry, renderer behavior or player-facing production copy changed.

## 0.19.0-evolution — Repeatable Stage 2 Ronin practice

- Added a compact **第二關練習** entry on the start screen that launches the real current Wandering Ronin directly without changing its timing, feints, reach, STEP, posture, HP, damage or score rules.
- A practice clear ends after the Ronin instead of advancing to Oni Guard; practice results offer **再練浪人** or **開始完整主線** while the normal start/restart path remains the four-duel campaign.
- Reused the existing local mastery and per-stage battle analysis for practice feedback, while explicitly labelling practice and preventing it from reading or overwriting the campaign personal-best record.
- Added focused Node coverage plus existing-browser-harness coverage for Stage 2 initialization, practice termination, Ronin result analysis, personal-best isolation and real-app practice UI initialization.
- No backend telemetry, network request, identifier, account system or persistence schema was introduced.

## 0.18.1-evolution — Local battle-analysis counter coaching repair

- Separated manual swipe-counter damage from total player damage in the local run-analysis stage record.
- Opposite-direction swipe coaching now computes average counter damage from manual counters only, so automatic Perfect Parry / Perfect STEP ripostes cannot hide a weak manual counter pattern.
- Added a focused mixed-damage regression proving total damage can include auto-ripostes while manual counter coaching still uses the real swipe damage.
- No combat timing, damage, scoring, input, persistence, network/privacy boundary or Ronin balance value changed.

## 0.18.0-evolution — Local post-run battle analysis

- Added local-only per-stage run analysis for parry accuracy, manual counter openings/counters, STEP attempts/success, hits/damage and stage-clear state using the existing combat event stream.
- The result screen now shows compact per-stage cards plus one actionable coaching tip; defeat focuses the last reached stage, while victory highlights the weakest stage from the run.
- Advice can distinguish missed counter openings, low Ronin parry accuracy/final-direction reading, poor STEP matchups, excessive hits and low counter damage without changing any combat balance value.
- The analysis is ephemeral and in-memory only: no backend, remote analytics, identifier, raw input position or persistent gameplay log is introduced. The separate telemetry/privacy Decision Gate remains unchanged.
- Added focused Node coverage and extended the existing mastery browser harness so the real result analysis renders and the complete result/restart flow stays inside the 320×568 acceptance viewport.

## 0.17.0-evolution — First-person two-hand katana rig

- Replaced the floating first-person katana silhouette with a bounded two-hand presentation layer on the existing PlayCanvas player rig: two forearms, two hands, wrist guards, habaki and pommel now visibly connect the weapon to the player.
- Added small action-local forearm/wrist articulation that follows the existing directional parry and counter-slash motion instead of introducing a new combat animation authority.
- The new grip creates eight simple entities once at renderer initialization and reuses them in-place; no per-frame objects, assets, network calls or combat-rule changes are introduced.
- Existing PlayCanvas/legacy fallback, directional input, parry/counter timing, damage, STEP, boss, mastery and mobile HUD behaviour remain unchanged.

## 0.16.1-evolution — Perfect STEP phase-priority cue repair

- Fixed a player-facing contradiction where Perfect STEP could trigger Crimson Shogun Blood Moon Phase II and close the recovery opening while the STEP feedback still told the player to swipe.
- Perfect STEP riposte events now carry whether Blood Moon/defeat closed the opening; the immediate STEP feedback and larger action cue switch to phase/defeat copy and suppress swipe instructions when no manual counter is legal.
- Extended the existing footwork browser harness through the actual STEP pointer path for the exact boss 7→6 HP transition, requiring `gap`, Blood Moon copy and no stale swipe prompt.
- Combat damage, STEP timing/reach, posture, boss threshold, input mapping and renderer behavior are unchanged.

## 0.16.0-evolution — Perfect STEP sidestep riposte

- Split STEP into two clearly different skill outcomes without removing the existing evade route: a normal successful STEP still only creates a manual swipe-counter opening, while a narrower 48–68 ms **Perfect STEP** window immediately performs a 1-damage sidestep riposte.
- Perfect STEP adds no enemy posture, so Perfect Parry remains the posture-breaking route; long/heavy tracking attacks still cannot be escaped merely by perfect timing.
- The same Perfect STEP recovery still allows one manual swipe counter. Automatic damage uses the existing player counter-slash feedback and gets a concise `PERFECT STEP` cue plus a new gameplay-guide card.
- Perfect STEP automatic damage now uses the same Crimson Shogun Phase II HP gate as manual counters and Perfect Parry ripostes, preventing Blood Moon bypass.
- Local mastery now includes automatic Perfect Parry / Perfect STEP riposte damage in `damageDealt` without counting either as a manual counter.
- Added focused Node/browser coverage for normal-vs-perfect STEP timing, tracking attacks, manual follow-up, actual STEP pointer integration, and the boss 7→6 HP Perfect STEP threshold path.

## 0.15.1-evolution — Gameplay-clarity verification gate repair

- Repaired the Run 030 onboarding cue regression assertion that expected the obsolete wording fragment `再掃` while the intended production cue says `仲有一次掃屏反擊`.
- The focused test now protects the stable semantic contract `掃屏反擊`, allowing the required exact-head browser gate to run without changing gameplay, Ronin balance, combat timing, or player-facing copy.
- No analytics/telemetry, network behavior, asset, renderer, input, persistence, or combat rule is introduced or changed by this blocker repair.

## 0.15.0-evolution — Gameplay clarity and Ronin learning ramp

- Added a prominent phone-first **玩法** guide on the start screen that explains the complete parry → swipe-counter loop, Perfect Parry automatic riposte plus remaining swipe, opposite-direction +1 damage, enemy posture/guard-break +2 damage, STEP range limits, and Ronin feints.
- Added short, large, pointer-transparent live cues after parry/Perfect riposte/STEP evade/guard break and on Stage 2 entry so the next required action is clear without restoring persistent instruction clutter.
- Stage 2 entry now explicitly tells the player to wait for Ronin's final blade direction; no Ronin timing, damage, health, posture or score value is changed in this slice so the next physical-phone test can separate learnability from actual balance.
- Extended the existing onboarding Node/browser coverage to verify the guide, Ronin cue, Perfect-riposte follow-up cue and phone readability without adding a parallel harness.
- Remote analytics/telemetry is intentionally not introduced yet; the owner-proposed balancing backend remains a privacy Decision Gate because current policy requires approval before external gameplay tracking.

## 0.14.3-evolution — Perfect Parry / Blood Moon phase-integrity repair

- Fixed a cross-module boss regression where repeated Perfect Parry automatic ripostes could reduce Crimson Shogun from Phase I to defeat without ever entering Blood Moon Phase II.
- Manual counter damage and automatic riposte damage now share one boss HP-threshold transition; reaching 6 HP starts Phase II immediately, resets boss pressure and creates the existing 1100 ms breathing gap before another counter/attack can resolve.
- Added focused boss coverage for the exact 7→6 HP automatic-riposte path while preserving the existing manual-counter Phase II regression.

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
