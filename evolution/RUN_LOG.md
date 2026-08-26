# Evolution Run Log

This file keeps the autonomous-evolution history concise. Full implementation detail remains available in Git history and the Draft PR receipts.

## Run 000 — Repository baseline

**Date:** 2026-08-25  
**Action type:** BASELINE

Initial mobile-first first-person WebGL samurai duel established with four-direction parry/swipe combat, three sequential enemies, progression, tests, CI, regression checklist, and repository SOT.

## Run 001 — Autonomous verification/review gate hardening

**Date:** 2026-08-26  
**Action type:** BLOCKER_FIX

Added exact-current-HEAD CI + Vercel terminal-green fence, HOLD semantics for missing/in-progress checks, P0/P1 review blocking semantics, and actionable P2 disposition rules. Gameplay unchanged.

## Run 002 — Combat animation readability

**Date:** 2026-08-26  
**Action type:** FEATURE

Added direction-specific anticipation, body commitment, recovery follow-through, procedural arms/stance/shadow, telegraph halo, and bounded blade trails while preserving combat timing and the single-pass WebGL architecture.

## Run 003 — Renderer correctness and WebGL verification

**Date:** 2026-08-27  
**Action type:** BLOCKER_FIX

Fixed the player-katana SDF and undefined reversed-edge GLSL masks; added dependency-free headless Chromium/SwiftShader compile/link/startup smoke coverage. Exact HEAD `d26741621111b3b9274ec9e33288464234162870` reached green CI and Vercel status.

## Run 004 — Posture and guard-break pressure

**Date:** 2026-08-27  
**Action type:** FEATURE

Added player/enemy posture, enemy-specific thresholds, guard-break counter bonus/window, player guard-break consequence, compact HUD state, distinct feedback, and automated combat tests. Initial balance values remain subject to real-device playtesting.

## Run 005 — Mastery grading and personal best

**Date:** 2026-08-27  
**Action type:** FEATURE

Added deterministic 0–100 mastery grading, S/A/B/C/D ranks, parry/perfect/guard-break/hit/clear-time feedback, and local-only best-victory persistence without accounts or network services.

## Run 006 — Mastery browser integration hardening

**Date:** 2026-08-27  
**Action type:** BLOCKER_FIX

Closed the reviewer P2 regression gap at the mastery/personal-best integration seam. Browser coverage now executes the real patched `CombatEngine` event stream, verifies victory mastery rendering, personal-best preservation, blocked-storage tolerance, and 320×568 result layout. Gameplay and mastery weights unchanged.

## Run 007 — Crimson Shogun multi-phase boss

**Date:** 2026-08-27  
**Action type:** FEATURE

Added Crimson Shogun as stage 4 with 12 HP, Phase I posture 6, a Blood Moon Phase II transition at 6 HP or lower after a valid counter, faster phase-two pressure, an 1100 ms breathing gap, bounded moon/ember atmosphere, restart safety, and encounter coverage.

## Run 008 — Boss reduced-motion and browser integration hardening

**Date:** 2026-08-27  
**Action type:** BLOCKER_FIX

Closed two reviewer P2s: the reduced-motion Phase II banner now has an explicit bounded lifetime, and a deterministic 320×568 browser harness executes boss activation, Phase II, restart-to-Phase-I, and final victory. Exact HEAD `8b163f48ca805340ea5be025ad5b5a8cea304b0b` entered Run 009 with CI `33015301566` success and Vercel success.

## Run 009 — Guided first duel onboarding

**Date:** 2026-08-27  
**Action type:** FEATURE  
**Scope:** Teach the real read → parry → counter loop interactively during the opening Ashigaru duel without changing combat timing, damage, input mapping, or encounter rules.

### Preflight / review disposition

- Exact previous HEAD `8b163f48ca805340ea5be025ad5b5a8cea304b0b`: CI run `33015301566` = success; GitHub `Vercel` status = success.
- Draft PR #1 remained open, Draft, mergeable and unmerged; no inline review threads existed.
- The latest actionable review findings were the two Run 007 P2s, both demonstrably closed by Run 008's bounded Phase II banner and executable boss browser harness. No applicable unresolved P0/P1 or blocking P2 remained before feature selection.

### Candidate selection

Three materially different candidates were scored 1–5 for visible impact / goal alignment / novelty / confidence / safety:

- Guided first-duel onboarding: **5 / 5 / 4 / 5 / 5 = 24**.
- Enemy spacing and footwork: **5 / 5 / 5 / 3 / 3 = 21** because meaningful distance-dependent combat still needs deeper renderer/encounter coupling and real-phone tuning.
- Combat-juice expansion: **4 / 4 / 3 / 5 / 4 = 20** because hit stop, shake, flash, audio and optional haptics already exist.

Guided onboarding wins because the Product Goal requires a coherent, learnable mobile experience while the current start screen still teaches mainly through static text. The public combat event stream provides a low-risk way to teach actual play rather than a separate tutorial simulation.

### Before

- New players received static control cards and generic combat prompts but no persistent learning progression.
- Wrong-direction and wrong-time parry misses did not become contextual first-duel coaching.
- Posture/guard-break meaning was visible in HUD numbers but not connected to the opening read/parry/counter lesson.

### After

- `src/onboarding-coach.js` adds an optional first-time Guided Duel layer driven by the real `CombatEngine` event stream: read the final blade path, parry the matching edge, then swipe counter.
- Wrong-direction versus wrong-time misses receive distinct corrective hints; feints explicitly prompt a re-read of the final blade direction.
- Successful parries expose current enemy posture inside the coach, and an enemy guard break explains the +2 counter opportunity.
- Completing the core read/parry/counter sequence produces a short completion acknowledgement and stores only a local completion preference so later page loads default the coach off. A start-screen toggle allows manual enable/disable; blocked storage remains non-fatal.
- If guidance remains enabled for the current run, Crimson Shogun entry and Blood Moon Phase II provide brief rhythm-reset cues without changing boss mechanics.
- The coach is pointer-transparent, bounded to a compact lower-left card, honours reduced-motion preference, and leaves the centre combat view and existing HUD/directional indicators intact.
- Node tests cover progression, adaptive miss guidance, boss phase cueing and disabled-state inertness. A dedicated 320×568 browser harness drives the real opening enemy event stream through wrong-direction correction → valid parry → counter and verifies completion, toggle readiness, viewport containment and pointer transparency.
- The real-app browser smoke now requires onboarding initialization/toggle wiring in addition to the existing WebGL, mastery and boss gates.

### Pre-commit verification

- Previous exact HEAD CI and Vercel were terminal green.
- Review submissions, top-level PR discussion and inline threads were inspected before feature selection.
- New onboarding module, Node test, browser-harness module body and updated browser-smoke script passed syntax checks before Git object creation; targeted onboarding Node tests passed 3/3.
- `game-core.js`, enemy HP/timing/damage, boss encounter rules, mastery scoring, WebGL shader, pointer mapping, audio and network boundaries are unchanged.

### Post-commit gate

The new exact HEAD must reach terminal-green repository CI (`npm test` + `npm run test:browser`) and terminal-green Vercel Preview before another feature run. The PR Run 9 receipt is authoritative for the created SHA and post-commit statuses; no second metadata-only commit should be created.

### Known risks

- Headless browser coverage proves event integration and 320×568 bounds, but a real-iPhone review is still needed to judge whether the lower-left coach feels appropriately unobtrusive during one-handed play.
- The coach intentionally teaches only the core first-duel loop plus contextual boss rhythm reset. Deeper mastery/replay education should be added only if play evidence shows confusion rather than turning onboarding into a long tutorial.

### Next-run candidates

- Add enemy spacing and footwork with distance-dependent attacks.
- Deepen combat impact with richer hit stop, camera impulse and bounded sparks.
- Add challenge mode with mastery-aware scoring and a clean restart loop.

## Run 010 — Guided Duel CI lifecycle repair

**Date:** 2026-08-27  
**Action type:** BLOCKER_FIX  
**Scope:** Restore the exact-head browser verification fence after Run 009 failed `npm run test:browser`.

### Preflight / blocker

- Exact HEAD `86046e230855ed0af77d43caff78ff9efb50bf45` had Vercel `success` but CI run `33021631244` failed in the onboarding browser assertion.
- All 22 Node tests passed; only the browser gate failed.
- The failing assertion expected the Guided Duel toggle to still be enabled **after** the harness had already completed the tutorial. Production behavior intentionally stores `completed`, sets the current-page guide default off, and updates the toggle to `aria-pressed="false"` after completion.
- Draft PR #1 remained open, Draft, mergeable and unmerged; no inline review threads existed. Earlier actionable review findings had already been dispositioned by prior runs, and no newer P0/P1 review applied to this exact head before the CI repair.

### Repair

- `tests/onboarding-browser-harness.html` now captures the initial first-time toggle state immediately after onboarding installation, before starting combat.
- After driving the real read → parry → counter completion path, the same harness verifies that the `completed` preference was written and that the toggle correctly defaults off afterward.
- The existing `data-onboarding-toggle="true"` browser-smoke contract now means the **full intended toggle lifecycle** passed, rather than incorrectly requiring the post-completion toggle to remain on.
- No production code or player-facing behavior changed.

### Pre-commit verification

- The revised inline module passed `node --check` before Git object creation.
- The repair is limited to the CI harness plus required SOT/state/changelog/backlog updates; combat rules, onboarding production logic, storage semantics, input, renderer, boss, mastery and deployment configuration are untouched.

### Post-commit gate

Exact HEAD `87b36f31aae737b2042ac801b6d6bd2d24c39307` reached terminal-green CI #36 (`33022179004`) and terminal-green Vercel Preview before Run 011 feature selection. The missing Run 10 PR receipt was restored during Run 011 preflight without a Git commit.

### Known risks

- This repair proves the expected first-time → completed preference lifecycle in headless Chromium. Real-iPhone judgement of coach placement remains the same open human visual check from Run 009.

### Next-run candidates

- Add enemy spacing and footwork with distance-dependent attacks.
- Deepen combat impact with richer hit stop, camera impulse and bounded sparks.
- Add challenge mode with mastery-aware scoring and a clean restart loop.

## Run 011 — Spacing, reach and timed backstep

**Date:** 2026-08-27  
**Action type:** FEATURE  
**Scope:** Add meaningful close / mid / far engagement distance and one bounded mobility decision without replacing the directional parry/swipe combat model.

### Preflight / review disposition

- Exact previous HEAD `87b36f31aae737b2042ac801b6d6bd2d24c39307`: CI #36 (`33022179004`) = success; GitHub `Vercel` status = success.
- Draft PR #1 remained open, Draft, mergeable and unmerged; no inline review threads existed.
- Submitted reviews and top-level discussion were inspected. Earlier renderer, mastery and boss P2 findings were demonstrably closed by Runs 003, 006 and 008; no applicable unresolved P0/P1 or blocking P2 remained.
- Run 010's required top-level PR verification receipt was missing despite green exact-head evidence, so that communication receipt was restored before feature work without changing Git history.

### Candidate selection

Three materially different player-visible candidates were scored 1–5 for visible impact / goal alignment / novelty / confidence / safety:

- Enemy spacing and footwork: **5 / 5 / 5 / 4 / 4 = 23**.
- Combat-juice expansion: **4 / 4 / 3 / 5 / 4 = 20** because strong hit stop, shake, flash, audio and optional haptics already exist.
- Challenge mode: **4 / 4 / 5 / 4 / 3 = 20** because it adds replay structure but less moment-to-moment combat depth than spacing.

Spacing wins because it directly strengthens the Product Goal's opponent-reading and distinct-duel pillars while adding a new decision that is visible every attack.

### Before

- Every duel effectively happened at one fixed engagement distance.
- Enemy attacks differed in direction, timing, feints and damage but not in whether their blade could still reach after spacing changed.
- The player had directional block and swipe counter only; there was no bounded mobility decision during a strike.

### After

- `src/footwork.js` adds an idempotent close / mid / far engagement layer over public `CombatEngine` state without changing `game-core.js`.
- Attack profiles now carry reach/setup distance. Ashigaru mixes close and committing long cuts; Ronin uses more lateral close/mid setups; Oni and Crimson Shogun heavy attacks use long tracking reach.
- A compact mobile `STEP / 後撤` control becomes available during active combat. A correctly timed early-strike STEP increases distance by one.
- If the new distance exceeds the current attack's reach, the strike whiffs into a recovery counter opening. The evade itself grants no perfect-parry or guard-break damage bonus.
- Long/heavy reach-2 attacks still track at far distance, so STEP cannot replace directional reading/parry.
- Successful evade counters pull spacing one step closer; hits and stage transitions prevent the duel from remaining artificially far.
- A small 近 / 中 / 遠 chip and restrained first-person depth/lateral camera response make spacing readable. Reduced-motion preference disables only camera motion, not the mechanics.
- Added Node coverage for short evade/counter, long/heavy tracking and wrong-time STEP; a 320×568 browser harness exercises the patched engine and verifies STEP/range UI initialization. The real-app browser smoke now requires footwork initialization.

### Pre-commit verification

- Prior exact-head CI and Vercel were terminal green and review gates clear.
- `src/footwork.js`, `tests/footwork.test.mjs`, and the updated browser-smoke script passed `node --check` before Git object creation.
- The implementation is additive: no change to `game-core.js`, boss HP/timing/phase rules, mastery scoring/storage, Guided Duel storage semantics, WebGL shader, edge block mapping, swipe direction mapping, networking, or dependencies.
- Regression checklist, Current Baseline, backlog, changelog, state, and this run log are included in the same final commit.

### Post-commit gate

The new exact HEAD must reach terminal-green repository CI (`npm test` + `npm run test:browser`) and terminal-green Vercel Preview before a later feature run. The PR Run 11 receipt is authoritative for the created SHA and post-commit statuses; no second metadata-only commit should be created.

### Known risks

- The camera response intentionally transforms the single canvas as a whole; it is a restrained depth/lateral cue rather than a full spatial 3D locomotion system. Real-iPhone play should decide whether the amount feels natural.
- STEP window/reach profiles are deterministic and covered by tests, but their difficulty and readability still need real-device play tuning.
- The browser harness proves footwork engine outcomes and UI initialization, while a future pointer-level browser test can harden the physical STEP gesture itself if reviews expose a need.

### Next-run candidates

- Deepen combat impact with richer hit stop, camera impulse and bounded sparks.
- Add challenge mode with mastery-aware scoring and a clean restart loop.
- Add accessibility options for timing assistance, left-handed play and high-contrast telegraphs.
