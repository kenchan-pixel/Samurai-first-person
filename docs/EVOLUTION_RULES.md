# Evolution Rules

## Purpose

Enable a recurring ChatGPT Scheduled Task to inspect the latest repository state, choose one high-value improvement, implement it, verify it, and open a pull request for Ken's review.

## Required outcome per run

Every run must deliver **one substantial visible vertical slice**. The slice may include multiple coordinated changes needed to make that improvement complete.

Qualifying examples:

- a new enemy whose animation, attacks, behaviour, stage presentation, and verification are complete;
- a full stamina/posture system with HUD, combat consequences, enemy integration, and tests;
- a major animation and camera-feedback pass that visibly improves every parry and strike;
- a complete challenge mode with scoring, restart flow, and persistent local best score;
- an accessibility control mode that is genuinely playable and tested.

Non-qualifying examples:

- changing colours, spacing, labels, or one icon;
- adding a setting that does not change gameplay;
- documentation-only work;
- refactoring without a visible improvement;
- tests without product behaviour;
- adding placeholders or disabled controls;
- creating a design proposal without implementing it.

## Selection process

1. Re-read Product Goal and Current Baseline.
2. Inspect current gameplay, open issues, PRs, CI, backlog, and recent run log.
3. Generate at least three candidate improvements.
4. Score each candidate from 1–5 on:
   - visible player impact;
   - goal alignment;
   - novelty relative to recent runs;
   - technical confidence;
   - regression/performance risk, reversed so safer is higher.
5. Choose the highest-value candidate that fits one bounded pull request.
6. Do not repeatedly optimise the same subsystem unless a verified defect or major opportunity justifies it.

## Implementation constraints

- Use a new branch named `evolution/YYYY-MM-DD-short-scope`.
- One evolution run creates one pull request.
- Never merge the pull request.
- Preserve mobile-first controls and portrait usability.
- Protect 60fps-oriented rendering; visual complexity must have an adaptive or bounded cost.
- Prefer procedural or original assets. Do not import copyrighted game assets.
- Keep external services and dependencies minimal.
- Never weaken tests merely to make CI pass.

## Required pull request evidence

- **Before:** concrete limitation or missing experience.
- **After:** what a player can now see or do.
- **Implementation:** main systems and files changed.
- **Verification:** automated tests and manual mobile checks.
- **Regression:** results against `REGRESSION_CHECKLIST.md`.
- **Risk/limitations:** remaining issues and performance considerations.
- **Preview:** screenshot, video, or deploy URL when available.

## Stop or maintenance conditions

Do not make a low-value change merely because the schedule ran. When no qualifying improvement can be implemented safely:

1. perform a focused gameplay/technical audit;
2. identify and reproduce a material defect or measurable weakness;
3. fix that defect as the run's vertical slice;
4. if no material issue exists, open an issue describing the Decision Gate rather than modifying code.
