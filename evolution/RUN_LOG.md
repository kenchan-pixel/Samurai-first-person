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

Added deterministic 0–100 mastery grading, S/A/B/C/D ranks, parry/perfect/guard-break/hit/clear-time feedback, and local-only best-victory persistence without accounts or network services. Exact previous HEAD `ef3022d443b80f2ac10e51348d58141712e9a44d` entered this run with CI `33000154167` success and Vercel success.

## Run 006 — Mastery browser integration hardening

**Date:** 2026-08-27  
**Action type:** BLOCKER_FIX  
**Scope:** Close the current reviewer P2 regression-detection gap at the player-visible mastery/personal-best integration seam before allowing more feature work.

### Review disposition

The current-HEAD review reported no P0/P1, but identified an actionable P2: CI proved pure mastery functions and module initialization yet did not execute the real `CombatEngine` → mastery observer → result DOM → `localStorage` path. Because mastery/personal-best behavior is now an approved player-visible baseline and the gap could let a material playability regression pass all automated gates, this P2 is treated as blocking under the repository's material-correctness/playability rule.

### Before

- Browser smoke proved WebGL2 startup, enabled Start control, and mastery module initialization only.
- It did not prove victory/defeat events reached the patched mastery observer and updated the actual result fields.
- It did not execute personal-best write/compare behavior or blocked-storage tolerance.
- The 320×568 result-screen requirement had no executable layout fence.

### After

- `tests/mastery-browser-harness.html` imports the real mastery overlay and `CombatEngine`, drives deterministic victory event streams, and asserts rendered mastery fields.
- The first completed victory must persist a best record; a deliberately worse victory must leave it unchanged.
- A third victory runs with `Storage.prototype.setItem` throwing and must still render mastery feedback without failing.
- The harness uses the production result-screen classes and requires result content plus Restart to remain inside a 320×568 viewport.
- `scripts/browser-smoke.mjs` continues checking the real app WebGL/start/mastery initialization, then runs the integration harness as a second browser gate.
- No production gameplay, mastery weights, combat timing, renderer, input, network, or storage semantics are changed.

### Pre-commit verification

- Exact previous HEAD `ef3022d443b80f2ac10e51348d58141712e9a44d`: CI `33000154167` = success; GitHub `Vercel` status = success.
- Draft PR #1 remained open, Draft, mergeable, and unmerged; no inline review threads existed.
- New `scripts/browser-smoke.mjs` passed `node --check` locally.
- The harness module body passed `node --check` after extraction from the HTML test fixture.

### Post-commit gate

The new exact HEAD must reach terminal-green repository CI (`npm test` + `npm run test:browser`) and terminal-green Vercel Preview before the next feature run. The PR Run 6 receipt is authoritative for the created SHA and post-commit statuses; no second metadata-only commit should be created.

### Known risks

- The harness drives real engine events but does not yet exercise physical pointer taps/swipes; pointer-level mobile interaction smoke remains a separate technical opportunity.
- Headless Chromium at 320×568 is a regression gate, not a substitute for final recent-iPhone visual review.

### Next-run candidates

- Add a multi-phase boss vertical slice.
- Add enemy spacing and footwork.
- Deepen combat impact with richer hit stop, camera impulse and sparks.

## Run 007 — Crimson Shogun multi-phase boss

**Date:** 2026-08-27  
**Action type:** FEATURE  
**Scope:** Add the first real boss duel as a complete fourth-stage vertical slice with a mid-fight phase change, distinct arena presentation and executable encounter regression coverage.

### Preflight / review disposition

- Exact previous HEAD `37e0fbeaae5478bbf703b48595a381a252bc8e35`: CI run `33005455392` = success; GitHub `Vercel` status = success.
- Draft PR #1 remained open, Draft, mergeable and unmerged; there were no inline review threads.
- The latest actionable P2 on Run 005 was already closed by Run 006's executable mastery integration gate and Run 6 PR receipt. No applicable unresolved P0/P1 or blocking P2 remained before feature selection.

### Candidate selection

Three materially different candidates were scored 1–5 for visible impact / goal alignment / novelty / confidence / safety:

- Multi-phase boss vertical slice: **5 / 5 / 5 / 4 / 3 = 22**.
- Enemy spacing and footwork: **5 / 5 / 5 / 3 / 3 = 21** because distance-dependent combat needs deeper renderer/encounter coupling and broader phone playtesting.
- Combat-juice expansion: **4 / 4 / 2 / 5 / 4 = 19** because the current baseline already has hit stop, shake, flash, audio and optional vibration.

Boss work wins because the Product Goal explicitly calls for memorable bosses and distinct duels, while the current engine can safely extend the campaign through a bounded encounter adapter without changing the proven four-direction interaction model.

### Before

- Victory followed the third Oni Guard stage; there was no boss duel.
- No enemy changed attack/timing rules midway through a fight.
- The campaign had no boss-specific arena event or phase-transition presentation.

### After

- Crimson Shogun is appended as stage 4 / 4 after the three baseline enemies.
- Phase I has 12 HP, posture 6, deliberate heavy/feint patterns and a 72 ms perfect-parry window.
- A valid counter that leaves the boss at 6 HP or lower triggers Blood Moon Phase II exactly once: boss posture and attack cursor reset, the used recovery becomes an 1100 ms neutral gap, and the boss earns a small transition score bonus.
- Phase II raises posture to 7, tightens the perfect window to 58 ms, shortens gaps/recovery, and switches to a faster signature attack set with mixed feints/heavies.
- A fixed, pointer-transparent blood moon plus bounded ember field activates only for the boss; Phase II shows an explicit banner and stronger atmosphere. Reduced-motion preference disables looping ember movement.
- Restart always reconstructs the boss at Phase I.
- Node tests cover boss injection, transition/reset semantics and app wiring; browser smoke now requires the boss module to initialize in the real page before `main.js`.

### Pre-commit verification

- Previous exact HEAD CI and Vercel were terminal green.
- New encounter and overlay modules passed `node --check` locally before Git object creation.
- The change preserves existing `game-core.js`, `main.js`, mastery modules, input mapping, posture formulas, WebGL shader and existing browser mastery harness.

### Post-commit gate

The new exact HEAD must reach terminal-green repository CI (`npm test` + `npm run test:browser`) and terminal-green Vercel Preview before another feature run. The PR Run 7 receipt is authoritative for the created SHA and post-commit statuses; no second metadata-only commit should be created.

### Known risks

- Boss HP/posture/timing values are first-pass balancing and need real-phone play review.
- The boss reuses the existing procedural combatant silhouette; the new moon/ember atmosphere makes the stage distinct, but a later visual-identity pass may add stronger boss-specific weapon/silhouette language if evidence justifies it.
- The encounter is installed as an idempotent pre-main adapter to avoid destabilising the proven core state machine; if encounter complexity grows substantially, it should move into a dedicated first-class encounter controller rather than accumulating prototype patches.

### Next-run candidates

- Add enemy spacing and footwork with distance-dependent attacks.
- Deepen combat impact with richer hit stop, camera impulse and bounded sparks.
- Redesign onboarding to teach direction, timing, posture, boss pressure and mastery interactively.
