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

## Run 005 — Mastery grading and personal best

**Date:** 2026-08-27  
**Action type:** FEATURE  
**Scope:** Turn the existing numeric score into clear replay feedback by grading how the duel was won, surfacing the player's strongest/weakest execution signals, and retaining a local personal best without accounts or network services.

### Candidate selection

Three materially different candidates were scored 1–5 for visible impact / goal alignment / novelty / confidence / safety:

- Mastery grading + personal best: **5 / 5 / 5 / 5 / 5 = 25**.
- Enemy spacing and footwork: **5 / 5 / 5 / 3 / 3 = 21** because distance-dependent combat needs larger renderer/encounter changes and broader phone playtesting.
- Multi-phase boss vertical slice: **5 / 5 / 5 / 2 / 2 = 19** because adding a boss immediately after a new posture system risks stacking unbalanced mechanics before replay feedback exists.

Mastery won because the Product Goal explicitly calls for replayable scoring/challenge depth, the current game already produces score/combo/posture signals but gives little end-of-run interpretation, and the slice can be added without changing proven parry/damage/timing behaviour.

### Preflight / review disposition

- Exact previous HEAD `bdadd78ea8194d2c02e04e3c9db572c6079103ad`: CI run `32995999850` = success; GitHub `Vercel` status = success.
- Draft PR #1 remained open, Draft, mergeable and unmerged.
- No inline review threads existed.
- Older P1 renderer/automation findings are demonstrably fixed by later reviewed heads; the prior P2 stale browser-smoke record was cleared in Run 004. No applicable unresolved P0/P1 or blocking P2 finding remained before feature selection.

### Before

- The result screen showed only victory/defeat and one numeric score.
- Players could not see parry accuracy, perfect-parry quality, guard-break execution, damage discipline, or clear time after a run.
- There was no mastery grade and no local personal-best target to encourage replay.

### After

- A pure mastery module records parry attempts/success, perfect parries, enemy guard breaks, counters, hits taken, damage dealt/taken, and elapsed time from the public combat event stream.
- Completed victories receive a deterministic 0–100 mastery score plus S/A/B/C/D grade; defeats remain D but still receive the same learning statistics.
- The existing result screen is upgraded in place to show mastery score/grade, parry accuracy, perfect-parry count, guard breaks, hits taken, clear time, numeric score, and personal-best feedback without adding another panel over combat.
- Better completed victories are retained in local browser storage and displayed on later results; storage failure is deliberately non-fatal.
- No combat-resolution, enemy, posture, rendering, input, network, account, analytics, or external-service behaviour is changed.

### Verification before final commit

- New pure mastery module and observer adapter both passed `node --check` in an isolated local syntax check.
- New mastery unit suite passed **3/3** locally, covering event statistics, S-grade/defeat semantics, personal-best comparison, and time formatting.
- Browser smoke is extended to require `data-mastery-ready="true"` in addition to existing WebGL2 and start-control readiness, so missing/broken mastery module loading becomes a CI failure.
- Existing `main.js`, `game-core.js`, WebGL shader, input listeners, and combat timings are unchanged.

### Post-commit verification

The new exact HEAD must reach terminal-green repository CI (`npm test` + browser smoke) and terminal-green Vercel Preview before another feature run. The Run 5 PR receipt is the authoritative post-commit SHA/CI/Preview record; no metadata-only follow-up commit should be created.

### Known risks

- Mastery weights are first-pass design values and may need tuning after observing real play styles.
- The compact one-line result summary should be visually checked on a 320×568 viewport and recent iPhone portrait display.
- Local personal best is intentionally device/browser-local and can be cleared by browser storage settings.
- The mastery observer decorates public `CombatEngine` lifecycle/event-drain methods; browser smoke guards initialization, but a future engine API refactor should replace this with explicit observer injection.

### Next-run candidates

- Add a multi-phase boss vertical slice.
- Add enemy spacing and footwork.
- Deepen combat impact with richer hit stop, camera impulse and sparks.
