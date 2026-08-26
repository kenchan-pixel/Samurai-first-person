# Regression Checklist

Run this checklist before marking an evolution pull request complete.

## Startup and layout

- [ ] App loads without JavaScript errors.
- [ ] Start screen is usable at 320×568 CSS pixels.
- [ ] iPhone portrait safe areas do not hide HUD or restart controls.
- [ ] The primary combat view is not blocked by instructions or panels.
- [ ] Guided-duel toggle is reachable on the start screen without pushing the primary Start control outside the viewport.
- [ ] STEP / 後撤 and the range chip remain clear of the four edge-block regions and the primary centre combat read.

## Guided first duel

- [ ] A first-time browser session starts with Guided Duel enabled; a completed/disabled preference makes later page loads default it off without preventing manual re-enable.
- [ ] Guided Duel observes the real stage-1 event stream and progresses through read → parry → counter without changing combat timing or damage rules.
- [ ] The coach distinguishes wrong-direction from wrong-time parry misses and explains feints using the final displayed blade direction.
- [ ] A successful parry exposes current enemy posture; enemy guard break explains the +2 counter opportunity.
- [ ] Completing the read/parry/counter sequence produces a short completion acknowledgement and then clears the combat view.
- [ ] Crimson Shogun start / Blood Moon Phase II can show brief rhythm-reset cues when guidance is enabled, without competing with the boss phase banner.
- [ ] The coach is pointer-transparent, remains inside 320×568 portrait bounds, and does not cover the main centre combat view.
- [ ] Unavailable/blocked `localStorage` does not prevent starting, using, completing, or toggling the coach.

## Input

- [ ] Tap near top produces top block.
- [ ] Tap near right produces right block.
- [ ] Tap near bottom produces bottom block.
- [ ] Tap near left produces left block.
- [ ] A centre tap does not accidentally trigger an edge block.
- [ ] Swipe direction is recognised for top, right, bottom, and left.
- [ ] Tap and swipe are not both triggered by one gesture.
- [ ] Mouse fallback remains usable.
- [ ] STEP captures only its own pointer gesture and does not leave the canvas pointer state stuck.

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

## Mastery and replay

- [ ] Mastery tracking does not change parry, counter, posture, damage, or stage-resolution behaviour.
- [ ] Victory result shows a 0–100 mastery score and S/A/B/C/D grade.
- [ ] Result summary shows parry accuracy, perfect parries, guard breaks, hits taken, and clear time.
- [ ] Defeat remains D grade while still showing the run statistics.
- [ ] A better completed victory becomes the local personal best; a worse run does not overwrite it.
- [ ] Unavailable/blocked `localStorage` does not prevent a duel from starting, finishing, or restarting.

## Presentation and performance

- [ ] WebGL scene renders a first-person arena, enemy, enemy sword, and player katana.
- [ ] Telegraph animation visibly matches the incoming direction.
- [ ] Player parry/attack animation matches input direction.
- [ ] Player/enemy posture values remain visible without blocking the combat view.
- [ ] Enemy and player guard breaks show distinct feedback without hiding directional input cues.
- [ ] Engagement distance changes produce restrained camera depth/lateral feedback without hiding the blade read or moving essential controls.
- [ ] Crimson Shogun stage activates the pointer-transparent blood-moon/ember atmosphere without covering HUD or directional input regions.
- [ ] Blood Moon Phase II displays a short explicit phase banner and stronger moon/ember state; reduced-motion preference disables looping ember motion and the banner still hides after its bounded display lifetime.
- [ ] Result mastery summary remains readable at 320×568 portrait without obscuring the restart control.
- [ ] Audio remains optional and starts only after user interaction.
- [ ] Gameplay timing is based on elapsed time, not frame count.
- [ ] No unbounded object, event-listener, particle, timer, audio-node, or animation-loop growth is introduced.
- [ ] Recent target phone remains responsive during a complete four-stage run.

## Delivery

- [ ] `npm test` passes.
- [ ] `npm run test:browser` passes.
- [ ] Browser smoke confirms WebGL2, enabled start control, mastery observer initialization, boss encounter initialization, onboarding initialization, and footwork initialization in the real app document.
- [ ] Browser mastery harness drives the actual patched `CombatEngine` event stream to victory and renders the mastery fields.
- [ ] Browser mastery harness proves a worse victory cannot overwrite the current personal best and blocked storage writes remain non-fatal.
- [ ] Browser mastery result content and restart control remain inside a 320×568 viewport.
- [ ] Boss Node coverage proves stage injection, one-time Phase II transition, pressure reset, and restart-to-Phase-I behavior.
- [ ] Boss browser harness runs with reduced-motion preference, drives the patched `CombatEngine` through boss activation and Phase II, proves the transition banner hides while the fight stays active, verifies restart-to-Phase-I, and reaches final victory.
- [ ] Onboarding Node coverage proves read/parry/counter progression, adaptive miss guidance, boss rhythm-reset cues, and disabled-state inertness.
- [ ] Onboarding browser harness drives the real opening-enemy event stream through a wrong-direction correction, successful parry and counter, and proves toggle readiness plus 320×568 pointer-transparent coach layout.
- [ ] Footwork Node coverage proves short-range evade + counter, long/heavy tracking, and wrong-time STEP rejection.
- [ ] Footwork browser harness drives the patched engine through a short evade/counter and a long tracked strike, and proves the STEP/range UI initializes at mobile viewport.
- [ ] CI configuration remains valid.
- [ ] Current Baseline is updated only for accepted new baseline behaviour.
- [ ] Changelog, backlog, and run log are updated.
- [ ] Pull request contains Before/After and verification evidence.
