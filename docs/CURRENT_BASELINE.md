# Current Baseline

Version: **0.21.1-evolution**

These capabilities are approved for the current evolution branch and cumulative. Future work may improve or replace their implementation, but must not silently remove user-facing behaviour. `main` remains the owner-approved production baseline until Ken merges Draft PR #1.

## Playable flow

- Mobile-first portrait start screen → **four sequential duels** → victory/defeat → restart without page reload.
- Three baseline enemies are followed by the Crimson Shogun boss.
- The start screen also offers bounded direct-practice routes for the real **Stage 2 Wandering Ronin** and real **Stage 4 Crimson Shogun** without replacing the four-stage campaign.
- Practice results can restart the selected duel immediately or return to the complete campaign. Practice never advances into a different campaign stage.
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
- Live combat no longer shows the always-on `READ THE BLADE / PARRY NOW` prompt, footer gesture sentence, block-zone labels or arena subtitle. The compact live HUD keeps HP, stage/enemy and both posture values, while detailed instructions live behind **玩法**.
- With **刀路清晰** off, the existing centre direction cue remains available. With **刀路清晰** on, its edge rail becomes the sole directional overlay and the centre arrow/label is suppressed to avoid duplicate guidance.
- A 44×44 **Pause** control sits in a deliberately neutral lower-centre tap band rather than an active directional edge. It opens **繼續 / 玩法 / 重新開始 / 返回主頁** without taking over a top/right/bottom/left parry target.
- Pause freezes the game-time clock, combat phase and animation progress. Closing the guide returns to the still-paused menu; resume does not catch up wall-clock pause time. Restart/home reuse the existing normal restart/start flows.
- No Stage 2 timing, damage, health, posture or score value is changed by the current clarity/footwork/analysis/practice passes. Ronin balance remains an evidence-based follow-up after physical-phone play.
- No remote gameplay analytics/telemetry backend is added. Gameplay statistics remain local-only until a separate privacy/data-retention/backend Decision Gate is approved.

## Optional high-contrast blade-read mode

- The start screen now includes an optional **刀路清晰** accessibility toggle. It defaults off, so the normal blade-reading presentation remains the standard experience unless the player explicitly enables it.
- When enabled, four pointer-transparent edge rails mirror the authoritative incoming direction: telegraph uses the currently displayed direction, a Ronin feint moves the rail to the final direction, and the strike phase strengthens the same rail instead of adding another instruction panel over the opponent.
- A successful parry, incoming hit, stage reset/transition, enemy defeat, victory or defeat clears the rail immediately. Wrong-direction attempts do not hide the correct active strike cue.
- The mode changes presentation only. It does **not** widen parry/Perfect windows, alter damage/reach/STEP/score, auto-block, or change enemy behaviour.
- Reduced-motion preference removes the pulsing animation while retaining the static high-contrast direction cue.
- The preference is local-only; blocked `localStorage` is non-fatal and simply falls back to the default-off state. No account, network request, analytics or remote identifier is introduced.
- The top-left toggle and four edge rails remain pointer-safe and bounded at the 320×568 acceptance viewport.

## Core combat

- Four defensive directions: top, right, bottom, left.
- Portrait input is intentionally asymmetric for thumb reach: the central **top** parry region reaches to 42% of screen height, while left/right/bottom keep the existing 28% edge depth. When regions overlap, the physically nearest edge wins; the neutral centre remains non-parry. Landscape keeps the original symmetric 28% edge map.
- The Pause control must remain wholly inside that neutral band under the same ergonomic direction mapper; adjacent top/right taps must still reach their intended parry regions.
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
- **Shogun practice uses this same Stage 4 Phase I boss and composed boss adapters.** It keeps the same 12 HP, Blood Moon threshold/Phase II rules, timings, reach, damage, posture and presentation; only the surrounding progression is bounded to that duel.

## Mastery, local run analysis and replay feedback

- Duel telemetry tracks parry attempts/success, Perfect Parries, guard breaks, manual counters, hits, damage and elapsed time **locally** without changing combat resolution.
- Automatic Perfect Parry / Perfect STEP riposte damage contributes to local `damageDealt`, while `counters` remains a count of manual swipe counters only.
- Victory produces a 0–100 mastery score and S/A/B/C/D grade; defeat remains D while still showing run statistics.
- Result screen shows mastery, parry accuracy, Perfect Parries, guard breaks, hits taken, clear time and numeric score.
- **Run-end battle analysis is stage-aware and local-only.** During the current run it tracks each reached stage's parry attempts/success, counter openings versus manual counters, STEP attempts/success, hits/damage and clear state using the existing combat event stream.
- The analysis keeps **manual counter damage separate from automatic riposte damage**. Opposite-direction swipe coaching uses only manual counter damage, so Perfect Parry/Perfect STEP auto-ripostes cannot make weak swipe counters look stronger than they were.
- The result screen adds compact per-stage cards plus one actionable coaching tip. On defeat it focuses the last reached stage; on victory it focuses the weakest stage from the run. Examples include missed counter openings, low Ronin parry accuracy, low STEP success, excessive hits or low manual counter damage.
- Direct duel practice reuses the same mastery and local analysis surfaces, with distinct `RONIN PRACTICE` / `SHOGUN PRACTICE` labels and `不計個人最佳`; practice never reads or overwrites the campaign personal-best record.
- The analysis is deliberately ephemeral: it is held only in memory for the current run and sends nothing to a backend. It stores no raw touch coordinates, device identifier, account data or remote session identifier and does not change the separate remote-telemetry Decision Gate.
- Better completed campaign victories may replace a local personal best; worse campaign runs and all practice runs do not. Storage failure is non-fatal.
- No account, network sync, remote analytics or external gameplay-data service is used.

## Enemy differentiation

- Ashigaru Scout: low HP, broad timing, simple attacks, low posture; mixes close cuts with a committed longer strike.
- Wandering Ronin: faster rhythm, feints, mixed directions, lateral footwork, close/mid reach. The optional Stage 2 practice route uses this exact enemy definition rather than a softened training clone.
- Oni Guard: heavy damage, shorter strike windows, higher HP/posture, strong tracking/heavy posture pressure.
- Crimson Shogun: multi-phase boss, higher posture resistance, heavy/feint signatures, Blood Moon ruleset shift and long-reach pressure. The optional Stage 4 practice route uses the same Phase I/II boss definitions rather than a training clone.
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
- The optional high-contrast blade-read layer uses four reusable pointer-transparent edge rails and only one active rail at a time; it reinforces the current/final attack direction without covering the centre blade-reading area.
- The result analysis lives only on the post-run modal; it does not add persistent combat HUD text or cover the live blade-reading area.
- Direct practice is presented as one compact two-button row (**練浪人 / 練將軍**) beneath the primary start action. On short 320×568-class portrait viewports the start-screen spacing compresses rather than moving **拔刀** off-screen.

## Mobile performance baseline

- Gameplay and animation timing remain elapsed-time based rather than frame-count based.
- PlayCanvas adapts internal pixel ratio conservatively from rolling frame time; quality may fall before gameplay timing/responsiveness does.
- The skinned character reuses one loaded scene hierarchy and five clips; stage identity and blade trajectory reuse bounded entities with no per-frame model/trail allocation.
- The world-space blade trail allocates at most six segment entities after character readiness and reuses them during strikes.
- The first-person two-hand grip adds eight simple reused primitive entities once at renderer initialization; their transforms update in-place and create no per-frame objects.
- The blade-read accessibility layer creates one fixed overlay and four DOM rails once. It updates classes/text only when combat events arrive and creates no per-frame nodes, timers or network work.
- Run analysis and direct duel practice reuse the already-drained combat event stream/current CombatEngine. They create no gameplay backend, network request or unbounded gameplay-loop object growth.
- Generated GLB remains lightweight (about 315 KiB / about 1,972 triangles / 19 joints / no texture payload).
- Headless Chromium/SwiftShader proves production initialization and deterministic renderer contracts but cannot certify sustained 60 Hz, heat or subjective sword feel on a physical iPhone. Direct-device evidence remains the human acceptance gate.

## Technical baseline

- `src/game-core.js` remains the deterministic combat authority; boss, mastery, onboarding, footwork, impact, automatic-riposte, practice and accessibility systems are bounded adapters around that core.
- `src/combat-ux.js` owns the ergonomic portrait direction mapper, quiet live-combat presentation rules, Pause UI and the pausable game-time clock seam. It does not modify CombatEngine timing windows, damage, STEP, boss/Ronin balance or persistence/network authority.
- `src/perfect-riposte.js` adds the automatic 1-damage Perfect Parry riposte and suppresses the old later perfect damage bonus only for the same opening.
- `src/perfect-step.js` wraps the existing footwork seam only after a STEP has genuinely escaped attack reach. It owns the narrower Perfect STEP timing grade, 1-damage automatic sidestep riposte, guide/cue integration and conversion of its raw event into the existing visible counter event. Its riposte event carries whether the opening was closed by Blood Moon/defeat so presentation never advertises an impossible manual follow-up. It does not change normal STEP reach, timing window, posture or manual-counter rules.
- `src/boss-encounter.js` owns the reusable Crimson Shogun Phase II HP threshold. Manual counter, Perfect Parry auto-riposte and Perfect STEP auto-riposte all invoke the same gate.
- `src/onboarding-coach.js` owns the Guided Duel and phone-first gameplay-clarity sheet; Perfect STEP appends one additional guide card without changing combat authority.
- `src/mastery.js` counts raw automatic-riposte damage in local damage dealt while preserving manual counter count semantics.
- `src/run-analysis.js` is a local-only observer/result adapter. It keeps stage-level counters in a `WeakMap` for the active run, tracks both total damage and manual-only `counterDamage`, derives one coaching tip, and injects the compact result analysis panel. It does not patch damage/timing/input authority, persist gameplay records, or use network APIs.
- `src/practice-mode.js` is installed after the existing combat adapters and before `main.js`. It initializes all normal sessions first, then redirects only an explicitly requested practice run to the existing Wandering Ronin or already-installed Crimson Shogun, emits the real stage-start event, intercepts that selected practice stage-clear before campaign advancement, and labels practice terminal events. Normal campaign start/restart remains unchanged.
- `src/readability-mode.js` is a presentation-only observer installed after practice mode and before `main.js`. It reads the same composed event stream to mirror telegraph → feint → strike direction on an optional four-rail overlay, then returns the untouched events to the game runtime. It never calls parry/attack/STEP authority or changes combat state.
- `src/main.js` owns gameplay/input/HUD orchestration and passes renderer-neutral snapshot values to `View`.
- `src/renderer.js` keeps PlayCanvas primary / legacy WebGL2 fallback and composes stage identity, mobile combat readability, world-space blade trajectory, phone control readability and the player-weapon fidelity adapter.
- `src/player-weapon-fidelity.js` decorates only the existing PlayCanvas player katana rig with bounded primitive hands/forearms and action-local articulation. It does not patch CombatEngine or allocate objects during gameplay frames.
- Focused Combat UX coverage proves the 320×568 portrait top-reach map, neutral-centre Pause geometry, adjacent top/right parry routing and pausable-clock freeze/resume semantics. The production query-gated browser contract additionally exercises the real Pause → 玩法 → resume → restart → home flow against the actual app document.
- Focused Node coverage distinguishes normal STEP vs Perfect STEP, proves tracking attacks cannot Perfect STEP, preserves the manual follow-up, and proves Perfect STEP boss damage cannot bypass Blood Moon. The existing footwork browser harness drives the actual STEP pointer path and proves the exact boss 7→6 HP Perfect STEP path enters `gap`, labels Blood Moon, and suppresses all swipe-follow-up copy while the opening is closed.
- Focused run-analysis coverage proves stage-local statistics, missed-counter detection, Ronin-specific advice selection, and that automatic ripostes cannot inflate manual-counter damage coaching.
- Focused practice coverage proves the optional routes initialize the actual Stage 2 Ronin and Stage 4 Crimson Shogun definitions and terminate after the selected duel. The existing mastery browser harness additionally clicks both player-facing practice routes, requires retry/campaign handoff, renders the matching Stage 2/Stage 4 analysis, and preserves the campaign personal best; the real-app smoke requires both practice entries to initialize inside the production 320×568 layout.
- The separate boss Node/browser coverage remains authoritative for Blood Moon Phase II behaviour, including one-time transition, restart to Phase I and final boss victory; direct Shogun practice reuses that production boss adapter rather than duplicating phase logic.
- The blade-read browser harness uses a real CombatEngine stage-intro → telegraph → strike → successful parry path at 320×568 and requires the optional toggle, four pointer-safe rails, direction flow, stronger strike state, parry cleanup and bounded layout.
- The production PlayCanvas renderer-contract smoke still drives telegraph → strike → parry → counter through the same player katana rig, so the added grip remains behind the existing renderer/fallback and directional-motion gates.

## Approved 3D direction

The PlayCanvas-first Decision Gate remains approved. Production remains **PlayCanvas + local generated glTF/GLB skin/animation**, with Blender-compatible glTF/GLB as the long-term asset interchange. WebGL2 remains the required compatibility baseline; WebGPU remains optional progressive enhancement. A new human Decision Gate is required only if evidence points outside this approved direction or changes a material product/cost/privacy/licensing constraint.
