# Regression Checklist

Run this checklist before marking an evolution pull request complete.

## Startup and layout

- [ ] App loads without JavaScript errors.
- [ ] Start screen is usable at 320×568 CSS pixels.
- [ ] iPhone portrait safe areas do not hide HUD or restart controls.
- [ ] The primary combat view is not blocked by instructions or panels.
- [ ] Guided-duel toggle is reachable on the start screen without pushing the primary Start control outside the viewport.
- [ ] Optional 刀路清晰 toggle remains inside the 320×568 viewport, defaults off unless locally enabled, and does not enlarge the start-screen flow.
- [ ] The compact 練浪人 / 練將軍 practice selector remains inside the 320×568 viewport and does not push the primary 拔刀 action off-screen.
- [ ] STEP / 後撤 and the range chip remain clear of the four edge-block regions and the primary centre combat read.
- [ ] The 44×44 Pause control remains wholly inside the neutral lower-centre tap band at 320×568 and does not overlap STEP or any directional parry region.

## Guided first duel

- [ ] A first-time browser session starts with Guided Duel enabled; a completed/disabled preference makes later page loads default it off without preventing manual re-enable.
- [ ] Guided Duel observes the real stage-1 event stream and progresses through read → parry → counter without changing combat timing or damage rules.
- [ ] Clearing stage 1 through STEP/evade counters without a successful parry does not persist Guided Duel completion, and a fresh run still enables the lesson.
- [ ] The coach distinguishes wrong-direction from wrong-time parry misses and explains feints using the final displayed blade direction.
- [ ] A successful parry exposes current enemy posture; enemy guard break explains the +2 counter opportunity.
- [ ] Completing the read/parry/counter sequence produces a short completion acknowledgement and then clears the combat view.
- [ ] Crimson Shogun start / Blood Moon Phase II can show brief rhythm-reset cues when guidance is enabled, without competing with the boss phase banner.
- [ ] The coach is pointer-transparent, remains inside 320×568 portrait bounds, and does not cover the main centre combat view.
- [ ] Unavailable/blocked `localStorage` does not prevent starting, using, completing, or toggling the coach.

## Input

- [ ] Portrait central top taps are accepted down to 42% of screen height for thumb reach; landscape keeps the symmetric 28% edge depth.
- [ ] Tap near top produces top block.
- [ ] Tap near right produces right block.
- [ ] Tap near bottom produces bottom block.
- [ ] Tap near left produces left block.
- [ ] In overlapping portrait corners the physically nearest edge wins, so intended left/right taps are not swallowed by the expanded top region.
- [ ] A centre tap does not accidentally trigger an edge block.
- [ ] The Pause control itself maps to no parry direction, while adjacent top/right taps still reach their intended parry regions.
- [ ] Swipe direction is recognised for top, right, bottom, and left.
- [ ] Tap and swipe are not both triggered by one gesture.
- [ ] Mouse fallback remains usable.
- [ ] STEP pointerdown/pointerup captures its own pointer, stops propagation outside the control, rejects dragged gestures beyond the travel threshold, and leaves subsequent canvas pointer state clear.
- [ ] 刀路清晰 overlay is pointer-transparent and cannot consume parry/swipe/STEP input.

## Pause and guide

- [ ] Pause is available only during an active duel and does not replace an active directional edge target.
- [ ] Opening Pause freezes game time, combat phase/timing windows and renderer motion; wall-clock time spent paused is not applied on resume.
- [ ] Opening 玩法 from Pause and closing it returns to the still-paused state.
- [ ] 繼續 resumes from the frozen phase without an immediate catch-up hit.
- [ ] 重新開始 reuses the normal campaign/practice restart path; 返回主頁 returns to the start screen with Pause hidden.

## Combat

- [ ] Correct direction and timing parries an attack.
- [ ] Wrong direction does not count as a parry.
- [ ] Early/late input does not become an unintended perfect parry.
- [ ] Perfect parry gives increased counter damage.
- [ ] Enemy attacks damage the player when not parried.
- [ ] Counterattack can only land once per recovery window.
- [ ] Player and enemy health never become NaN or negative in the HUD.
- [ ] Successful parries increase enemy posture; perfect parries increase it faster.
- [ ] Reaching enemy posture maximum creates a guard-break counter window and the next valid counter gains exactly +2 damage.
- [ ] Enemy posture resets after a guard-break counter; an unused guard break falls back to partial posture rather than staying permanently broken.
- [ ] Taking hits increases player posture; heavy hits increase it faster.
- [ ] Player guard break adds exactly +1 damage to that hit and resets player posture.
- [ ] A successful parry relieves one point of player posture.

## Spacing and footwork

- [ ] Stage start and restart begin at mid engagement distance.
- [ ] Enemy telegraphs can visibly set up at close, mid, or far distance according to the attack profile.
- [ ] The range chip reports 近 / 中 / 遠 consistently with engine state.
- [ ] STEP is effective only during the bounded early strike window and can be attempted at most once per attack.
- [ ] A STEP that moves beyond a short/mid attack's reach creates an evade recovery opening.
- [ ] A long/heavy reach-2 attack still tracks at far distance, so STEP does not become universal invulnerability.
- [ ] Evade counter reuses the normal directional counter rules but receives no perfect-parry or guard-break bonus merely from evading.
- [ ] A successful evade counter closes one distance step; taking a hit cannot leave the fight artificially locked at far range.
- [ ] Reduced-motion preference removes camera movement without changing distance/reach mechanics.

## Progression

- [ ] All three original baseline enemies appear before the boss.
- [ ] Each original enemy retains distinct health, attack behaviour, and posture threshold.
- [ ] Crimson Shogun appears as stage 4 / 4 with 12 HP and Phase I posture maximum 6.
- [ ] A valid counter that leaves Crimson Shogun at 6 HP or lower triggers Blood Moon Phase II exactly once.
- [ ] The boss phase transition resets boss posture/attack cursor, creates a short neutral breathing gap, and switches to the Phase II attack/timing set.
- [ ] Restart returns the boss encounter to Phase I rather than retaining Phase II state.
- [ ] Defeating one stage advances to the next stage.
- [ ] Defeating Crimson Shogun reaches victory.
- [ ] Reaching zero player health reaches defeat.
- [ ] Stage transitions and restart reset posture, health, enemy, timing, HUD state, and engagement distance.
- [ ] 練浪人 starts the real Wandering Ronin at Stage 2 and ends after that duel instead of advancing to Oni Guard.
- [ ] 練將軍 starts the real Crimson Shogun at Stage 4 Phase I, preserves Blood Moon Phase II authority, and ends after the boss instead of changing campaign progression.
- [ ] Practice retry restarts the selected duel; 開始完整主線 returns to Stage 1 and campaign mode.

## Mastery and replay

- [ ] Mastery tracking does not change parry, counter, posture, damage, or stage-resolution behaviour.
- [ ] Victory result shows a 0–100 mastery score and S/A/B/C/D grade.
- [ ] Result summary shows parry accuracy, perfect parries, guard breaks, hits taken, and clear time.
- [ ] Defeat remains D grade while still showing the run statistics.
- [ ] A better completed victory becomes the local personal best; a worse run does not overwrite it.
- [ ] Ronin and Shogun practice results use distinct practice labels, render local stage analysis, and never read or overwrite the campaign personal best.
- [ ] Unavailable/blocked `localStorage` does not prevent a duel from starting, finishing, or restarting.

## Presentation and performance

- [ ] WebGL scene renders a first-person arena, enemy, enemy sword, and player katana.
- [ ] Telegraph animation visibly matches the incoming direction.
- [ ] Player parry/attack animation matches input direction.
- [ ] Player/enemy posture values remain visible without blocking the combat view.
- [ ] Enemy and player guard breaks show distinct feedback without hiding directional input cues.
- [ ] Engagement distance changes produce restrained camera depth/lateral feedback without hiding the blade read or moving essential controls.
- [ ] Normal/perfect parries produce direction-aware contact feedback; perfect parry is visibly stronger than a normal parry without changing timing.
- [ ] Counters produce a short directional slash afterimage and bounded sparks; guard-break counters read as stronger than normal counters.
- [ ] Incoming player hits use a distinct red burst rather than being visually confused with a successful parry/counter.
- [ ] Impact FX remain pointer-transparent, never exceed three concurrent burst containers, and self-remove after the bounded lifetime.
- [ ] Reduced-motion preference suppresses traveling impact sparks/slash afterimages while retaining a short readable contact cue.
- [ ] Optional 刀路清晰 mode follows telegraph direction, updates to the final direction after a feint, strengthens the strike cue, clears after resolution, and remains static rather than pulsing under reduced motion.
- [ ] With 刀路清晰 enabled, the old centre arrow/label is suppressed so only one directional overlay is shown.
- [ ] Live combat omits the persistent READ/PARRY prompt, footer gesture sentence, passive block-zone labels and arena subtitle; detailed instructions remain available through 玩法.
- [ ] Crimson Shogun stage activates the pointer-transparent blood-moon/ember atmosphere without covering HUD or directional input regions.
- [ ] Crimson Shogun Phase I heavy reads use a deliberate signature crouch/forward preparation while preserving the authoritative blade direction and timing.
- [ ] Blood Moon Phase II is visibly lower, more forward and more directionally committed than Phase I, with stronger crimson sword/read-trail emphasis; the presentation must not alter HP, damage, reach, posture, STEP, score or the Phase II threshold.
- [ ] Non-boss enemies retain their existing stage motion/scale and do not inherit the Shogun signature layer.
- [ ] Blood Moon Phase II displays a short explicit phase banner and stronger moon/ember state; reduced-motion preference disables looping ember motion and the banner still hides after its bounded display lifetime.
- [ ] Victory copy reflects the complete four-stage campaign.
- [ ] Result mastery summary remains readable at 320×568 portrait without obscuring the restart control.
- [ ] Audio remains optional and starts only after user interaction.
- [ ] Gameplay timing is based on elapsed time, not frame count.
- [ ] No unbounded object, event-listener, particle, timer, audio-node, or animation-loop growth is introduced.
- [ ] Recent target phone remains responsive during a complete four-stage run.

## Delivery

- [ ] `npm test` passes.
- [ ] `npm run test:browser` passes.
- [ ] Browser smoke confirms the production Vite app initializes the PlayCanvas primary renderer, preserves the WebGL2 fallback contract, enables the start control, and initializes mastery, boss, onboarding, footwork, impact, both practice entries and blade-read accessibility integrations in the real app document.
- [ ] Production Combat UX smoke starts the real app at 320×568 and proves adjacent top/right parry routing, neutral Pause placement, frozen phase while paused, 玩法-return-still-paused, resume without catch-up, restart and home behavior.
- [ ] The real-app PlayCanvas smoke drives one representative CombatEngine telegraph → strike → parry → counter sequence and proves enemy body/blade transform progression, authoritative interrupted recovery, player parry motion and player counter-slash motion while the backend remains PlayCanvas.
- [ ] Browser mastery harness drives the actual patched `CombatEngine` event stream to victory and renders the mastery fields.
- [ ] Browser mastery harness clicks both real practice entries and proves Ronin Stage 2 / Shogun Stage 4 entry → selected-duel retry → campaign handoff, with distinct practice result labels and campaign personal-best isolation.
- [ ] Browser mastery harness proves a worse victory cannot overwrite the current personal best and blocked storage writes remain non-fatal.
- [ ] Browser mastery result content and restart control remain inside a 320×568 viewport.
- [ ] Boss Node coverage proves stage injection, one-time Phase II transition, pressure reset, and restart-to-Phase-I behavior.
- [ ] Shogun-signature Node coverage proves non-boss neutrality, Phase I heavy preparation, stronger Blood Moon pressure, mirrored left/right body commitment and recovery release without importing combat rules.
- [ ] Boss browser harness runs with reduced-motion preference, drives the patched `CombatEngine` through boss activation and Phase II, proves the transition banner hides while the fight stays active, verifies restart-to-Phase-I, and reaches final victory.
- [ ] Onboarding Node coverage proves read/parry/counter progression, evade-only non-completion, adaptive miss guidance, boss rhythm-reset cues, and disabled-state inertness.
- [ ] Onboarding browser harness proves an evade-only Ashigaru clear does not write `completed`, a fresh run remains guided, then drives wrong-direction correction → successful parry → counter and verifies normal completion/toggle lifecycle plus 320×568 pointer-transparent coach layout.
- [ ] Footwork Node coverage proves short-range evade + counter, long/heavy tracking, and wrong-time STEP rejection.
- [ ] Footwork browser harness drives actual STEP pointerdown/pointerup, observes pointer capture/isolation, rejects a dragged STEP, proves a short evade/counter, proves a long tracked strike, and confirms later canvas pointer state resets cleanly.
- [ ] Blade-read browser harness drives the real CombatEngine stage-intro → telegraph → strike → successful parry path at 320×568 and proves optional toggle activation, direction flow, strike emphasis, cleanup and pointer-safe four-rail reuse.
- [ ] Impact Node coverage proves event-to-effect profile selection and direction-origin mapping without touching combat resolution.
- [ ] Impact browser harness drives actual perfect-parry, counter and player-hit events, proves 320×568 pointer-safe layout, and confirms all burst nodes clean themselves up.
- [ ] CI configuration remains valid.
- [ ] Current Baseline is updated only for accepted new baseline behaviour.
- [ ] Changelog, backlog, and run log are updated.
- [ ] Pull request contains Before/After and verification evidence.
