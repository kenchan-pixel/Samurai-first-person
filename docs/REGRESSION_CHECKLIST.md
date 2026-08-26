# Regression Checklist

Run this checklist before marking an evolution pull request complete.

## Startup and layout

- [ ] App loads without JavaScript errors.
- [ ] Start screen is usable at 320×568 CSS pixels.
- [ ] iPhone portrait safe areas do not hide HUD or restart controls.
- [ ] The primary combat view is not blocked by instructions or panels.

## Input

- [ ] Tap near top produces top block.
- [ ] Tap near right produces right block.
- [ ] Tap near bottom produces bottom block.
- [ ] Tap near left produces left block.
- [ ] A centre tap does not accidentally trigger an edge block.
- [ ] Swipe direction is recognised for top, right, bottom, and left.
- [ ] Tap and swipe are not both triggered by one gesture.
- [ ] Mouse fallback remains usable.

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

## Progression

- [ ] All three baseline enemies appear.
- [ ] Each enemy retains distinct health, attack behaviour, and posture threshold.
- [ ] Defeating one stage advances to the next stage.
- [ ] Defeating the final enemy reaches victory.
- [ ] Reaching zero player health reaches defeat.
- [ ] Stage transitions and restart reset posture, health, enemy, timing, and HUD state.

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
- [ ] Result mastery summary remains readable at 320×568 portrait without obscuring the restart control.
- [ ] Audio remains optional and starts only after user interaction.
- [ ] Gameplay timing is based on elapsed time, not frame count.
- [ ] No unbounded object, event-listener, particle, or audio-node growth is introduced.
- [ ] Recent target phone remains responsive during a complete three-stage run.

## Delivery

- [ ] `npm test` passes.
- [ ] `npm run test:browser` passes.
- [ ] Browser smoke confirms WebGL2, enabled start control, and mastery observer initialization.
- [ ] CI configuration remains valid.
- [ ] Current Baseline is updated only for accepted new baseline behaviour.
- [ ] Changelog, backlog, and run log are updated.
- [ ] Pull request contains Before/After and verification evidence.
