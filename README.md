# Blade Reversal｜刃返

A mobile-first, first-person 3D samurai action web game. The player reads enemy attack direction and distance, uses directional parries or a timed backstep, then swipes to counterattack.

## Current vertical slice

- PlayCanvas standalone renders the primary true-3D duel scene with perspective camera, dynamic lighting, the repository-authored skinned samurai GLB, stage-specific silhouettes and a first-person two-hand katana rig; the previous custom WebGL2 renderer remains a compatibility fallback.
- Four-direction touch parry: top, right, bottom, and left.
- Four-direction swipe attacks plus a compact `STEP / 後撤` control for bounded distance evasion and a narrower Perfect STEP automatic sidestep riposte.
- Close / mid / far engagement distance with attack reach, approach/retreat/sidestep setup, and restrained camera response.
- Timing-based Perfect/normal parries, automatic Perfect Parry riposte, enemy/player posture, guard breaks, and counter bonuses.
- Three sequential baseline enemies followed by the multi-phase Crimson Shogun boss as stage 4 / 4.
- Optional **第二關練習** launches the real Wandering Ronin directly for repeatable Stage 2 practice without changing campaign balance or personal-best storage.
- Optional first-time Guided Duel only completes after the player demonstrates read → parry → counter; evade-only clears keep the lesson available next run.
- Optional **刀路清晰** accessibility mode adds four high-contrast, pointer-transparent edge cues that follow telegraph → feint resolution → strike direction without changing combat timing or difficulty.
- Mastery score/grade, local-only personal best, and ephemeral per-stage battle analysis after a run.
- Player/enemy health, stage progression, hit feedback, generated sound effects, victory, and defeat states.
- Mouse fallback for desktop testing.
- Deterministic combat state remains independent of rendering; Node tests plus headless mobile browser integration protect the playable baseline.

## 3D pipeline status

The approved production direction is PlayCanvas + a local repository-authored glTF/GLB skin/animation pipeline. The current generated samurai uses a 19-joint skin with `Idle`, `Windup`, `Strike`, `Recovery`, and `Parry` clips; combat authority remains renderer-neutral and the legacy WebGL2 path remains available as fallback. Physical-phone visual quality, sustained frame rate and thermal behaviour remain human acceptance checks.

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
- **刀路清晰:** optional start-screen accessibility toggle for stronger directional edge cues; it does not auto-block or widen timing windows.
- Counterattacks are most effective during the enemy recovery window after a successful parry or valid evade.

## Product evolution

This repository is designed as a persistent source of truth for a recurring ChatGPT Scheduled Task. Read `AGENTS.md` and the documents under `docs/` before each evolution run.

## Repository policy

- Public prototype repository; do not include secrets or proprietary assets.
- Feature work through branches and pull requests; the scheduled evolution loop uses its documented long-lived Draft PR exception.
- No automatic merge.
- No third-party copyrighted game assets.
