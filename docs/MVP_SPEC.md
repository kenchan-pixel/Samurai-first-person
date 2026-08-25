# MVP Specification — 0.1

## Core loop

1. Read the enemy's directional telegraph.
2. Tap the corresponding edge of the screen during the strike window.
3. A successful parry opens recovery.
4. Swipe to perform a directional counterattack.
5. Reduce enemy health to zero and advance to the next stage.
6. Complete all stages before player health reaches zero.

## Input model

The screen is treated as four directional edge zones around a neutral centre:

- top edge → high guard;
- right edge → right guard;
- bottom edge → low guard;
- left edge → left guard.

A pointer gesture longer than the minimum swipe threshold is an attack, not a tap. The dominant movement axis defines slash direction.

## Timing model

- Enemy attack begins with an anticipation/telegraph phase.
- The strike phase is the valid parry window.
- The earliest part of the strike phase is the perfect-parry window.
- A successful parry immediately moves the enemy into recovery.
- A counter can damage the enemy once during that recovery.
- Unanswered strikes damage the player and then enter recovery.

## Stage set

### Stage 1 — Ashigaru Scout

- HP: 3
- Damage: 1
- Slow, readable top and side attacks
- No feints
- Purpose: teach directional tap and counter swipe

### Stage 2 — Wandering Ronin

- HP: 5
- Damage: 1
- Faster attacks
- Direction-changing feints during telegraph
- Mixed attack rhythm
- Purpose: test observation rather than reacting to the first cue

### Stage 3 — Oni Guard

- HP: 8
- Damage: 2 for heavy attacks
- Longer anticipation but shorter strike window
- Heavy overhead and low attacks
- Purpose: test calm timing under pressure

## Initial acceptance criteria

- A complete three-stage run is possible on touch.
- All four parry and attack directions are mechanically recognised.
- Each enemy is recognisably different without reading documentation.
- The player can understand success/failure through motion, sound, and HUD feedback.
- The game runs as a static site and has no server dependency.
