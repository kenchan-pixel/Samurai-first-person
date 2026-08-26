# Current Baseline

Version: **0.4.0-evolution**

These capabilities are approved for the current evolution branch and cumulative. Future work may improve or replace their implementation, but must not silently remove the user-facing behaviour. `main` remains the owner-approved production baseline until Ken merges the Draft PR.

## Playable flow

- The game starts from a mobile-friendly title screen.
- The player enters a first-person dojo combat view.
- Three enemies are fought sequentially.
- Each stage begins, plays, resolves, and advances without reloading the page.
- The game has victory and defeat states with restart support.

## Core combat

- Four defensive directions: top, right, bottom, left.
- Tapping an edge region attempts a block in that direction.
- Correctly timed, matching-direction blocks parry attacks.
- A smaller timing window awards a perfect parry.
- Swiping in four directions performs a katana attack.
- Counterattacks during recovery damage the enemy.
- Perfect parry counters deal increased damage.
- Wrong timing or direction can result in player damage.
- Successful parries pressure enemy posture; perfect parries build posture faster.
- Each enemy has a distinct posture threshold: Ashigaru Scout 3, Wandering Ronin 4, Oni Guard 5.
- Filling enemy posture causes a guard break, extends the current counter window, and adds +2 damage to the next valid counter before posture resets.
- Incoming hits build player posture. Heavy attacks build posture faster; when player posture reaches 4, the guard breaks, that hit gains +1 damage, and player posture resets.
- A successful parry relieves one point of player posture, rewarding recovery through correct defence.

## Mastery and replay feedback

- Each duel tracks parry attempts, successful parries, perfect parries, guard breaks, counters, hits taken, damage dealt/taken, and elapsed time without altering combat resolution.
- Victory produces a 0–100 mastery score plus S/A/B/C/D grade based on accuracy, perfect timing, guard breaks, counter execution, clear time, and damage taken.
- Defeat remains D grade while still showing the run statistics for learning feedback.
- The result screen shows compact mastery feedback: grade, mastery score, parry accuracy, perfect-parry count, guard breaks, hits taken, clear time, and the existing numeric score.
- The best completed victory is stored locally in browser `localStorage` and shown on later result screens. Storage failure is non-fatal and does not affect gameplay.
- No account, network sync, analytics, or external service is used for mastery records.

## Enemy differentiation

- **Ashigaru Scout:** low health, broad timing windows, simple single attacks, low posture threshold.
- **Wandering Ronin:** faster rhythm, feints, mixed directions, higher health, medium posture threshold.
- **Oni Guard:** heavy damage, short strike windows, larger health pool, pressure patterns, highest posture threshold; heavy hits also pressure player posture faster.

## Presentation

- First-person WebGL 3D arena and combatants.
- Player katana visible in the foreground.
- Enemy sword telegraphs and strike motion correspond to attack direction.
- Enemy animation is phase-driven rather than rigid: telegraphs use direction-specific anticipation, strikes use a committed body lunge and accelerated sword sweep, and recovery visibly follows through before resetting.
- Procedural arms, stance/legs, torso lean, ground shadow, telegraph blade halo, and strike trail make the opponent silhouette and blade path easier to read without adding dense controls.
- HUD shows player health, enemy health, stage, combat prompt, directional feedback, and compact player/enemy posture values.
- Enemy guard break and player guard break use explicit combat prompts, stronger impact timing, audio, flash, and optional vibration feedback.
- Generated Web Audio cues are used; no external audio assets are required.
- Pointer input supports touch, stylus, and mouse.

## Technical baseline

- Static web app with ES modules and no runtime framework dependency.
- Combat rules separated from rendering in `src/game-core.js`.
- Mastery scoring is isolated in pure `src/mastery.js`; a lightweight observer adapter records public combat events without changing the combat state machine.
- Procedural combat rendering remains a single bounded WebGL2 fragment-shader pass with no new assets, network calls, particles, or per-frame object allocation.
- Automated Node tests cover direction mapping, combat resolution, posture pressure, guard-break counter damage, player posture reset, mastery statistics, grading, personal-best comparison, and time formatting.
- A dependency-free headless Chromium/Chrome smoke test executes the real page with WebGL2/SwiftShader, requires shader compile/link success, verifies the start control remains enabled, and verifies the mastery observer module initializes.
- GitHub Actions runs both Node tests and the browser WebGL smoke test on pull requests and pushes to main.
