# Current Baseline

Version: **0.1.0**

These capabilities are approved and cumulative. Future work may improve or replace their implementation, but must not silently remove the user-facing behaviour.

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

## Enemy differentiation

- **Ashigaru Scout:** low health, broad timing windows, simple single attacks.
- **Wandering Ronin:** faster rhythm, feints, mixed directions, higher health.
- **Oni Guard:** heavy damage, short strike windows, larger health pool, pressure patterns.

## Presentation

- First-person WebGL 3D arena and combatants.
- Player katana visible in the foreground.
- Enemy sword telegraphs and strike motion correspond to attack direction.
- HUD shows player health, enemy health, stage, combat prompt, and directional feedback.
- Generated Web Audio cues are used; no external audio assets are required.
- Pointer input supports touch, stylus, and mouse.

## Technical baseline

- Static web app with ES modules and no runtime framework dependency.
- Combat rules separated from rendering in `src/game-core.js`.
- Automated Node tests cover direction mapping and combat resolution.
- GitHub Actions runs tests on pushes to main and pull requests.
