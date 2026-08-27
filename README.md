# Blade Reversal｜刃返

A mobile-first, first-person 3D samurai action web game. The player reads enemy attack direction and distance, uses directional parries or a timed backstep, then swipes to counterattack.

## Current vertical slice

- PlayCanvas standalone now renders the primary true-3D duel scene with perspective camera, dynamic lighting, articulated samurai body parts and a first-person katana; the previous custom WebGL2 renderer remains a temporary fallback during migration.
- Four-direction touch parry: top, right, bottom, and left.
- Four-direction swipe attacks plus a compact `STEP / 後撤` control for bounded distance evasion.
- Close / mid / far engagement distance with attack reach, approach/retreat/sidestep setup, and restrained camera response.
- Timing-based perfect and normal parries, enemy/player posture, guard breaks, and counter bonuses.
- Three sequential baseline enemies followed by the multi-phase Crimson Shogun boss as stage 4 / 4.
- Optional first-time Guided Duel that only completes after the player demonstrates read → parry → counter; evade-only clears keep the lesson available next run.
- Mastery score/grade, run statistics, and local-only personal best after victory.
- Player/enemy health, stage progression, hit feedback, generated sound effects, victory, and defeat states.
- Mouse fallback for desktop testing.
- Deterministic combat state remains independent of rendering; Node tests plus headless mobile browser integration protect the playable baseline.

## 3D migration status

Run 018 is the first production-facing PlayCanvas slice. It replaces the old shader figure as the preferred renderer with an original code-authored articulated 3D samurai and dojo while keeping the old renderer as fallback. A higher-detail local skinned GLB/animation asset is the next fidelity step; no downloaded character pack was introduced in this run.

## Run locally

```bash
npm install
npm test
npm run test:browser
npm run serve
```

Open `http://localhost:4173` on a phone or desktop browser. `npm run build` creates the Vercel production bundle in `dist/`.

## Controls

- **Tap near an edge:** parry from that direction.
- **Swipe:** slash in the swipe direction.
- **STEP / 後撤:** during the early strike window, step back one distance level. Short attacks can whiff; long/heavy tracking attacks may still reach.
- Counterattacks are most effective during the enemy recovery window after a successful parry or valid evade.

## Product evolution

This repository is designed as a persistent source of truth for a recurring ChatGPT Scheduled Task. Read `AGENTS.md` and the documents under `docs/` before each evolution run.

## Repository policy

- Public prototype repository; do not include secrets or proprietary assets.
- Feature work through branches and pull requests; the scheduled evolution loop uses its documented long-lived Draft PR exception.
- No automatic merge.
- No third-party copyrighted game assets.
