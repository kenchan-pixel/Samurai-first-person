# Current Baseline

Version: **0.19.0-evolution**

These capabilities are approved for the current evolution branch and cumulative. Future work may improve or replace their implementation, but must not silently remove user-facing behaviour. `main` remains the owner-approved production baseline until Ken merges Draft PR #1.

## Playable flow

- Mobile-first portrait start screen → **four sequential duels** → victory/defeat → restart without page reload.
- Three baseline enemies are followed by the Crimson Shogun boss.
- The start screen also offers a bounded **第二關練習** route that launches the real Wandering Ronin directly and ends after that duel, without replacing the four-stage campaign.
- Practice results can restart the Ronin immediately or return to the complete campaign.
- Touch, stylus and mouse input remain supported.

## Guided first duel and combat clarity

- First-time players may use the compact Guided Duel coach for read the blade → directional parry → manual swipe counter using the real combat event stream.
- Wrong-direction, wrong-time and feint guidance remains contextual; successful parries expose posture and guard-break opportunity.
- Clearing Ashigaru through STEP/evade counters without a demonstrated parry/manual counter does not persist tutorial completion.
- A Perfect Parry automatic riposte is a reward, not proof of the Guided Duel manual swipe-counter step.
- Completion stores only a local preference; blocked storage is non-fatal and the start-screen toggle remains available.
- The start screen includes a prominent **玩法** button with the complete core loop, Perfect Parry, counter direction bonus, posture/guard break, normal STEP, **Perfect STEP**, and Ronin feints.
- Entering Stage 2 — in campaign or Ronin practice — gives one short Ronin cue telling the player to wait for the final blade direction because feints can change the initial read.
- Successful parry, automatic ripostes, STEP evade and guard break use short pointer-transparent action cues instead of dense persistent text.
- No Stage 2 timing, damage, health, posture or score value is changed by the current clarity/footwork/analysis/practice passes. Ronin balance remains an evidence-based follow-up after physical-phone play.
- No remote gameplay analytics/telemetry backend is added. Gameplay statistics remain local-only until a separate privacy/data-retention/backend Decision Gate is approved.

## Core combat

- Four defensive directions: top, right, bottom, left.
- Edge tap attempts a matching directional block; correct timing/direction parries, with a smaller perfect-parry window.
- Four-direction swipe attacks remain the normal/manual counter during recovery.
- Wrong direction/timing can result in damage; a manual counterattack can land once per recovery opening.
- Enemy posture rises on parry and rises faster on Perfect Parry. Ashigaru/Ronin/Oni thresholds remain 3/4/5.
- Enemy guard break extends the counter opening and grants +2 damage to the next valid manual counter before posture resets.
- Incoming hits build player posture; heavy hits build faster. Player guard break at 4 adds +1 damage to that hit and resets posture.
- Successful parry relieves one player-posture point.
- **Perfect Parry immediately performs a 1-damage automatic light riposte.** The player may still swipe once during the same recovery opening unless that riposte crosses the Crimson Shogun Phase II threshold. The old +1 perfect bonus on the later manual counter is suppressed for that opening, keeping the normal perfect + opposite-direction follow-up damage budget approximately unchanged.
- Normal parry does not auto-attack and still requires a manual swipe counter.

## Spacing, STEP and Perfect STEP

- Combat tracks close / mid / far engagement distance and shows a compact 近 / 中 / 遠 chip.
- Enemy attacks have reach/setup distance and can approach, retreat or sidestep before attacking.
- **Normal STEP / 後撤** works only in the bounded early strike window, moves one distance step, and creates an evade-recovery opening only when the attack no longer reaches. It deals no automatic damage; the player must swipe to counter.
- **Perfect STEP** is a narrower timing subset inside a successful normal STEP: roughly the first 48–68 ms of the strike depending on strike duration. It immediately performs a 1-damage automatic sidestep riposte, adds **no enemy posture**, and normally leaves the one manual swipe counter available in that recovery opening. If the automatic riposte itself triggers Blood Moon Phase II or defeats the enemy, that opening closes immediately and no follow-up swipe is advertised or accepted.
- Perfect STEP therefore differs from Perfect Parry: it trades directional reading for strict spacing/reach limits and does not help break enemy posture. Perfect Parry remains the posture-breaking route.
- Long/heavy tracking attacks still reach at far distance, so neither normal nor Perfect STEP becomes universal invulnerability.
- Evade counter closes one distance step; stage start/restart resets to mid.
- STEP stays in the lower-right safe corner outside the centre/bottom and right block regions at the 320×568 acceptance viewport. Primary STEP text remains phone-readable and its tiny secondary label stays removed.
- STEP pointer capture/isolation and drag rejection remain unchanged.

## Boss encounter

- Crimson Shogun is stage 4 with 12 HP and Phase I posture 6.
- At 6 HP or lower after any accepted player damage source — manual counter, Perfect Parry automatic riposte, or Perfect STEP automatic riposte — Blood Moon Phase II triggers once before another counter can resolve, resets posture/attack cursor, creates the existing 1100 ms breathing gap, and switches to the Phase II pressure set.
- When Perfect STEP is the damage source that crosses the threshold, both the immediate STEP feedback and the larger action cue explicitly give Blood Moon priority and do not instruct the player to swipe into a closed recovery opening.
- Phase II posture is 7, perfect-parry timing tightens and the attack set changes.
- Boss blood-moon/ember atmosphere remains bounded, pointer-transparent and honours reduced motion.
- Restart restores Phase I; victory flows into mastery.

## Mastery, local run analysis and replay feedback

- Duel telemetry tracks parry attempts/success, Perfect Parries, guard breaks, manual counters, hits, damage and elapsed time **locally** without changing combat resolution.
- Automatic Perfect Parry / Perfect STEP riposte damage contributes to local `damageDealt`, while `counters` remains a count of manual swipe counters only.
- Victory produces a 0–100 mastery score and S/A/B/C/D grade; defeat remains D while still showing run statistics.
- Result screen shows mastery, parry accuracy, Perfect Parries, guard breaks, hits taken, clear time and numeric score.
- **Run-end battle analysis is stage-aware and local-only.** During the current run it tracks each reached stage's parry attempts/success, counter openings versus manual counters, STEP attempts/success, hits/damage and clear state using the existing combat event stream.
- The analysis keeps **manual counter damage separate from automatic riposte damage**. Opposite-direction swipe coaching uses only manual counter damage, so Perfect Parry/Perfect STEP auto-ripostes cannot make weak swipe counters look stronger than they were.
- The result screen adds compact per-stage cards plus one actionable coaching tip. On defeat it focuses the last reached stage; on victory it focuses the weakest stage from the run. Examples include missed counter openings, low Ronin parry accuracy, low STEP success, excessive hits or low manual counter damage.
- Ronin practice reuses the same mastery and local analysis surfaces, but its result is explicitly labelled `RONIN PRACTICE` / `不計個人最佳`; practice never reads or overwrites the campaign personal-best record.
- The analysis is deliberately ephemeral: it is held only in memory for the current run and sends nothing to a backend. It stores no raw touch coordinates, device identifier, account data or remote session identifier and does not change the separate remote-telemetry Decision Gate.
- Better completed campaign victories may replace a local personal best; worse campaign runs and all Ronin-practice runs do not. Storage failure is non-fatal.
- No account, network sync, remote analytics or external gameplay-data service is used.

## Enemy differentiation

- Ashigaru Scout: low HP, broad timing, simple attacks, low posture; mixes close cuts with a committed longer strike.
- Wandering Ronin: faster rhythm, feints, mixed directions, lateral footwork, close/mid reach. The optional Stage 2 practice route uses this exact enemy definition rather than a softened training clone.
- Oni Guard: heavy damage, shorter strike windows, higher HP/posture, strong tracking/heavy posture pressure.
- Crimson Shogun: multi-phase boss, higher posture resistance, heavy/feint signatures, Blood Moon ruleset shift and long-reach pressure.
- The shared skinned GLB adds distinct stage silhouettes on the actual Head / Chest / Sword bones. Identity parts are presentation-only and do not change reach, hitboxes, timing, parry windows or damage.

## Presentation and visual identity

- PlayCanvas Engine standalone remains the primary production-facing renderer; the older custom WebGL2 renderer remains the compatibility fallback.
- The visible opponent is an original locally generated skinned glTF/GLB samurai once the asset loads; the articulated primitive remains character-level fallback.
- The generated model has a 19-joint skin, layered armour and real `Idle / Windup / Strike / Recovery / Parry` clips. Combat authority remains renderer-neutral.
- Enemy full-body framing remains far enough back to keep helmet-to-feet silhouette and weapon path readable in portrait.
- Top/right/bottom/left attacks drive the actual `Sword` bone through direction-specific 3D blade-tip trajectories that advance toward/cross the player-facing parry plane and follow through before recovery.
- The bounded world-space trail follows actual blade-tip history rather than decorating a body pose; the old attached swing echoes remain suppressed by the trajectory layer.
- The first-person player katana includes a bounded **two-hand grip silhouette**: two forearms, hands, wrist guards, habaki and pommel are attached to the existing camera-space katana rig. They follow the existing directional parry/counter motion with small action-local wrist/forearm articulation, making the player weapon read as something physically held rather than a floating blade.
- The first-person grip is presentation-only: it does not alter swipe/parry direction mapping, damage, timing, hit logic, camera authority or combat state.
- Successful parry feedback combines audio/haptic/camera/impact with direction-aware contact wash/ring/blade clash. Perfect Parry and Perfect STEP automatic ripostes reuse the existing first-person counter-slash feedback so the offensive reward is visible without adding another persistent HUD panel.
- Live combat text remains intentionally quiet and reduced-motion preserves short readable contact cues while suppressing travelling effects.
- The result analysis lives only on the post-run modal; it does not add persistent combat HUD text or cover the live blade-reading area.
- The practice entry is a compact secondary start action. On short 320×568-class portrait viewports the start-screen spacing compresses rather than moving the primary **拔刀** action off-screen.

## Mobile performance baseline

- Gameplay and animation timing remain elapsed-time based rather than frame-count based.
- PlayCanvas adapts internal pixel ratio conservatively from rolling frame time; quality may fall before gameplay timing/responsiveness does.
- The skinned character reuses one loaded scene hierarchy and five clips; stage identity and blade trajectory reuse bounded entities with no per-frame model/trail allocation.
- The world-space blade trail allocates at most six segment entities after character readiness and reuses them during strikes.
- The first-person two-hand grip adds eight simple reused primitive entities once at renderer initialization; their transforms update in-place and create no per-frame objects.
- Run analysis and Ronin practice reuse the already-drained combat event stream/current CombatEngine. They create no gameplay backend, network request or unbounded gameplay-loop object growth.
- Generated GLB remains lightweight (about 315 KiB / about 1,972 triangles / 19 joints / no texture payload).
- Headless Chromium/SwiftShader proves production initialization and deterministic renderer contracts but cannot certify sustained 60 Hz, heat or subjective sword feel on a physical iPhone. Direct-device evidence remains the human acceptance gate.

## Technical baseline

- `src/game-core.js` remains the deterministic combat authority; boss, mastery, onboarding, footwork, impact, automatic-riposte and practice systems are bounded adapters around that core.
- `src/perfect-riposte.js` adds the automatic 1-damage Perfect Parry riposte and suppresses the old later perfect damage bonus only for the same opening.
- `src/perfect-step.js` wraps the existing footwork seam only after a STEP has genuinely escaped attack reach. It owns the narrower Perfect STEP timing grade, 1-damage automatic sidestep riposte, guide/cue integration and conversion of its raw event into the existing visible counter event. Its riposte event carries whether the opening was closed by Blood Moon/defeat so presentation never advertises an impossible manual follow-up. It does not change normal STEP reach, timing window, posture or manual-counter rules.
- `src/boss-encounter.js` owns the reusable Crimson Shogun Phase II HP threshold. Manual counter, Perfect Parry auto-riposte and Perfect STEP auto-riposte all invoke the same gate.
- `src/onboarding-coach.js` owns the Guided Duel and phone-first gameplay-clarity sheet; Perfect STEP appends one additional guide card without changing combat authority.
- `src/mastery.js` counts raw automatic-riposte damage in local damage dealt while preserving manual counter count semantics.
- `src/run-analysis.js` is a local-only observer/result adapter. It keeps stage-level counters in a `WeakMap` for the active run, tracks both total damage and manual-only `counterDamage`, derives one coaching tip, and injects the compact result analysis panel. It does not patch damage/timing/input authority, persist gameplay records, or use network APIs.
- `src/practice-mode.js` is installed after the existing combat adapters and before `main.js`. It initializes all normal sessions first, then redirects only an explicitly requested practice run to the existing Wandering Ronin, emits the real Stage 2 start event, intercepts that practice stage-clear before campaign advancement, and labels practice terminal events. Normal campaign start/restart remains unchanged.
- `src/main.js` owns gameplay/input/HUD orchestration and passes renderer-neutral snapshot values to `View`.
- `src/renderer.js` keeps PlayCanvas primary / legacy WebGL2 fallback and composes stage identity, mobile combat readability, world-space blade trajectory, phone control readability and the player-weapon fidelity adapter.
- `src/player-weapon-fidelity.js` decorates only the existing PlayCanvas player katana rig with bounded primitive hands/forearms and action-local articulation. It does not patch CombatEngine or allocate objects during gameplay frames.
- Focused Node coverage distinguishes normal STEP vs Perfect STEP, proves tracking attacks cannot Perfect STEP, preserves the manual follow-up, and proves Perfect STEP boss damage cannot bypass Blood Moon. The existing footwork browser harness drives the actual STEP pointer path and proves the exact boss 7→6 HP Perfect STEP path enters `gap`, labels Blood Moon, and suppresses all swipe-follow-up copy while the opening is closed.
- Focused run-analysis coverage proves stage-local statistics, missed-counter detection, Ronin-specific advice selection, and that automatic ripostes cannot inflate manual-counter damage coaching.
- Focused practice coverage proves the optional route initializes the actual Stage 2 Ronin and terminates after that stage. The existing mastery browser harness additionally requires the practice result to render Stage 2/Ronin analysis while preserving the campaign personal best, and the real-app smoke requires the practice entry/module to initialize in the production document.
- The production PlayCanvas renderer-contract smoke still drives telegraph → strike → parry → counter through the same player katana rig, so the added grip remains behind the existing renderer/fallback and directional-motion gates.

## Approved 3D direction

The PlayCanvas-first Decision Gate remains approved. Production remains **PlayCanvas + local generated glTF/GLB skin/animation**, with Blender-compatible glTF/GLB as the long-term asset interchange. WebGL2 remains the required compatibility baseline; WebGPU remains optional progressive enhancement. A new human Decision Gate is required only if evidence points outside this approved direction or changes a material product/cost/privacy/licensing constraint.