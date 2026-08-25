# Blade Reversal｜刃返

A mobile-first, first-person 3D samurai action web game. The player reads enemy attack direction, taps the matching screen zone at the correct moment to parry, then swipes to counterattack.

## Current vertical slice

- First-person WebGL dojo scene rendered without external assets.
- Four-direction touch parry: top, right, bottom, and left.
- Four-direction swipe attacks.
- Timing-based perfect and normal parries.
- Three sequential enemies with different health, tempo, damage, feints, and attack patterns.
- Player/enemy health, stage progression, hit feedback, generated sound effects, victory, and defeat states.
- Mouse fallback for desktop testing.
- Pure combat state machine with Node tests.

## Baseline status

The playable baseline is included in this repository. Open `index.html` through a local HTTP server to test the current mobile combat vertical slice.

## Run locally

```bash
npm test
npm run serve
```

Open `http://localhost:4173` on a phone or desktop browser.

## Controls

- **Tap near an edge:** parry from that direction.
- **Swipe:** slash in the swipe direction.
- Counterattacks are most effective during the enemy recovery window after a successful parry.

## Product evolution

This repository is designed as a persistent source of truth for a recurring ChatGPT Scheduled Task. Read `AGENTS.md` and the documents under `docs/` before each evolution run.

## Repository policy

- Public prototype repository; do not include secrets or proprietary assets.
- Feature work through branches and pull requests.
- No automatic merge.
- No third-party copyrighted game assets.
