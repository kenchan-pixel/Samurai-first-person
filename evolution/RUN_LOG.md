# Evolution Run Log

This file keeps the current autonomous-evolution history concise. Full prior-run detail remains available in Git history.

## Run 000 — Repository baseline

**Date:** 2026-08-25  
**Scope:** Initial mobile-first first-person WebGL samurai duel with four-direction parry/swipe combat, three enemies, progression, tests, CI, and repository SOT.

**Result:** Playable 0.1.0 baseline established. Initial limitations included procedural low-detail presentation, no browser-level smoke test, and no posture/scoring depth.

## Run 001 — Autonomous verification/review gate hardening

**Date:** 2026-08-26  
**Action type:** BLOCKER_FIX

**Result:** Added exact-current-HEAD CI + Vercel terminal-green fence, HOLD semantics for missing/in-progress checks, P0/P1 review blocking semantics, actionable P2 disposition rules, and preserved the one-final-commit rule. Gameplay unchanged.

## Run 002 — Combat animation readability

**Date:** 2026-08-26  
**Action type:** FEATURE

**Result:** Added direction-specific anticipation, committed strike body motion, recovery follow-through, procedural arms/stance/shadow, telegraph halo, and bounded blade trails while retaining the existing combat timings and single-pass WebGL architecture.

**Known risk:** Real-device GPU responsiveness and visual quality still require target-phone review.

## Run 003 — Renderer correctness and WebGL verification

**Date:** 2026-08-27  
**Action type:** BLOCKER_FIX

**Result:** Fixed the spatially degenerate player-katana SDF, replaced undefined reversed-edge GLSL smoothstep masks, exposed startup readiness signals, and added dependency-free headless Chromium/SwiftShader WebGL compile/link/startup smoke coverage to CI.

**Post-commit receipt:** Exact HEAD `d26741621111b3b9274ec9e33288464234162870`; CI run `32991575316` success; Vercel success. Prior P1/P2 renderer findings fixed. The required PR receipt was posted before Run 004 feature selection.

**Known risk:** SwiftShader does not prove real-iPhone GPU performance or artistic correctness.

## Run 004 — Posture and guard-break pressure

**Date:** 2026-08-27  
**Action type:** FEATURE  
**Scope:** Add a complete player/enemy posture pressure loop that rewards sustained correct defence and makes repeated incoming pressure more dangerous without changing the core directional controls.

### Candidate selection

Three materially different candidates were scored 1–5 for visible impact / goal alignment / novelty / confidence / safety:

- Posture / guard-break system: **5 / 5 / 5 / 4 / 4 = 23**.
- Enemy spacing and footwork: **5 / 5 / 5 / 3 / 3 = 21** because it requires larger renderer/encounter changes immediately after a renderer hardening run.
- Combat-juice expansion: **4 / 4 / 3 / 4 / 4 = 19** because baseline already has hit stop, shake, flash, audio and optional vibration.

Posture won because it adds systemic depth and meaningful pressure choices while reusing the proven parry/counter loop and requiring no new assets or renderer complexity.

### Review disposition before feature selection

- Exact previous HEAD `d26741621111b3b9274ec9e33288464234162870`: CI run `32991575316` = success; Vercel = success.
- No inline review threads existed.
- The current review confirmed the prior renderer P1/P2 findings were fixed and raised one P2 durable-record issue: Run 003 lacked its top-level receipt and the backlog still listed delivered browser smoke as future work.
- The missing Run 003 receipt was posted before feature selection. The stale browser-smoke backlog item is removed/moved to Recently Delivered in this same real implementation commit rather than creating metadata-only work.

### Before

- Repeated defensive success had no longer-term pressure objective beyond score/combo.
- Enemies differed by health, tempo and attacks but had no guard-resilience stat.
- Repeated incoming hits had no cumulative guard-pressure consequence.
- HUD exposed health and combo but no pressure state.

### After

- Player and enemy posture are first-class combat state and included in snapshots.
- Successful parries build enemy posture; perfect parries build two points instead of one, while successful defence relieves one point of player posture.
- Ashigaru / Ronin / Oni posture thresholds are 3 / 4 / 5.
- Filling enemy posture marks the current opening as guard-broken, extends recovery by 45%, emits explicit `GUARD BREAK` feedback, and grants +2 damage to the next valid counter before posture resets.
- If the player misses that guard-break counter, enemy posture falls back to half rather than remaining permanently broken.
- Incoming hits build player posture; heavy hits build two points. Filling player posture adds exactly +1 damage to that hit and resets posture.
- Existing compact HUD lines show player and enemy posture without adding panels.
- Guard breaks use distinct prompt text, stronger hit-stop/shake, audio/flash, and optional vibration feedback.

### Verification before final commit

- Previous exact HEAD CI and Vercel were terminal green.
- Draft PR #1 remained open, Draft, mergeable and unmerged.
- Local modified game-core suite passed **10/10** tests, including enemy guard-break bonus/reset and player posture break/reset.
- `node --check src/main.js` passed after HUD/event integration changes.
- Four-direction input mapping, parry/perfect semantics, one-counter-per-opening rule, three-stage progression, victory/defeat flow, and WebGL shader source are preserved.

### Post-commit verification

The new exact HEAD must complete repository CI, including browser WebGL smoke, and Vercel Preview must reach terminal success before another feature run. The PR Run 4 receipt is authoritative for the created SHA and post-commit statuses so no second metadata-only commit is created.

### Known risks

- Posture thresholds and +2/+1 guard-break bonuses are initial balancing values and may need tuning after real play.
- Compact posture text should be visually checked at 320×568 and on a recent iPhone portrait display.
- Headless browser smoke proves startup/WebGL readiness, not full touch interaction or posture feel on a real phone.

### Next-run candidates

- Add enemy spacing and footwork.
- Deepen combat impact with richer hit stop, camera impulse and sparks.
- Add scoring/mastery grades that include posture breaks.
