# Evolution Run Log

This file keeps the autonomous-evolution history concise. Full implementation detail remains available in Git history and Draft PR receipts.

## Runs 000–013 — Established evolution history

- **Run 000 — BASELINE:** mobile-first first-person WebGL duel, four-direction parry/swipe combat, three enemies, progression, tests and SOT.
- **Run 001 — BLOCKER_FIX:** exact-head CI/Vercel fence plus P0/P1/P2 review-gate semantics.
- **Run 002 — FEATURE:** enemy animation readability with anticipation, body commitment, articulated stance and blade trails.
- **Run 003 — BLOCKER_FIX:** player-katana SDF / GLSL mask fixes plus executable WebGL browser smoke.
- **Run 004 — FEATURE:** player/enemy posture and guard-break pressure.
- **Run 005 — FEATURE:** mastery grading and local personal best.
- **Run 006 — BLOCKER_FIX:** mastery browser integration/storage/layout hardening.
- **Run 007 — FEATURE:** Crimson Shogun multi-phase boss and Blood Moon presentation.
- **Run 008 — BLOCKER_FIX:** boss reduced-motion banner cleanup and full boss browser integration.
- **Run 009 — FEATURE:** Guided Duel read/parry/counter onboarding.
- **Run 010 — BLOCKER_FIX:** Guided Duel browser lifecycle repair.
- **Run 011 — FEATURE:** close/mid/far spacing, attack reach and timed STEP backstep.
- **Run 012 — BLOCKER_FIX:** STEP cannot permanently bypass the parry lesson; real STEP pointer-path coverage and four-stage copy sync.
- **Run 013 — FEATURE:** bounded direction-aware impact choreography for parries, counters, guard breaks and player hits.

## Run 014 — Wide-framed samurai visual redraw

**Date:** 2026-08-27  
**Action type:** FEATURE  
**Scope:** Directly address Ken's current visual feedback that the opponent was too close, hard to read in motion and visually unattractive, while retaining the existing combat system and low-dependency WebGL architecture.

### Preflight / review disposition

- Exact previous HEAD `f9eb6b4b2f869f571d69e1620832d7c1d9341910`: CI #40 (`33030310940`) = success; GitHub `Vercel` status = success.
- Draft PR #1 remained open, Draft, mergeable and unmerged; there were no inline review threads.
- The current-head review contained no P0/P1. Its only P2 was a browser-coverage gap for the already-implemented reduced-motion Impact FX path. Node coverage and production logic showed no known behavior defect, so it was non-blocking for feature selection; Run 014 closes the gap by executing the impact harness under real browser reduced-motion preference as part of the same bounded change.

### Candidate selection

Direct user feedback materially changed priority, so the three candidates were scored 1–5 for visible impact / goal alignment / novelty / confidence / safety:

- Wide-framed visual redraw and enemy art-direction pass: **5 / 5 / 5 / 4 / 4 = 23**.
- Accessibility settings surface: **4 / 5 / 5 / 4 / 4 = 22**.
- Challenge mode: **5 / 4 / 5 / 4 / 3 = 21**.

The visual redraw wins because the Product Goal makes opponent reading the first experience pillar, and the user explicitly reported that the current close framing and enemy appearance were blocking that experience.

### Before

- The opponent occupied almost the full vertical combat view, leaving little negative space around the sword path.
- Enemy body/armour relied on a comparatively flat torso/head/limb silhouette and was visually weak at phone size.
- Player katana and contact effects competed with the opponent in the same near-camera space.
- Dojo depth cues were limited, making the fight feel flatter and the enemy feel closer than intended.

### After

- Renderer framing now scales the opponent to roughly 72–76% of the former on-screen size so helmet-to-feet remain visible with more surrounding read space.
- Stage-specific procedural samurai redraw adds hakama, greaves, lamellar skirt plates, lit chest armour, shoulder plates, menpo/eye band, helmet/brim and unique silhouette accents for Ashigaru, Ronin, Oni and Crimson Shogun.
- The environment gains receding roof/gate structure, pillars, lanterns and perspective floor lines to create a clearer near/mid/far composition without adding downloaded assets.
- Telegraphs use a larger two-handed anticipation pose plus a directional arc behind the sword; strike and recovery still derive from the same combat phase/timing values.
- Player katana is slightly slimmer/lower in the foreground to reduce obstruction while retaining first-person presence.
- Rendering code is isolated in `src/renderer.js`; `src/main.js` retains input/gameplay/HUD orchestration and passes only render state.
- Real-app browser smoke now requires the `wide-samurai-v2` renderer marker and therefore compiles/links the new shader in CI.
- Reduced-motion Impact FX browser coverage now proves ring/core feedback remains while sparks/slash travel are absent and cleanup remains bounded.

### Regression boundaries

- No enemy HP, damage, timing, posture, reach, STEP, boss phase, mastery, onboarding or input rule changed.
- No framework, external model/texture, copyrighted asset, network request, account, analytics or paid dependency was introduced.
- The renderer remains a bounded WebGL2 pass; no per-frame DOM/object growth is added.

### Post-commit gate

The new exact HEAD must reach terminal-green `npm test`, `npm run test:browser` and Vercel Preview before another feature run. The Draft PR Run 14 receipt is authoritative for the created SHA and post-commit verification.

### Known risks

- Browser smoke proves shader compile/link and controller integration, not subjective art quality. A real iPhone review is still required to judge whether the new full-body scale, armour proportions and lighting are sufficiently attractive/readable.
- The redraw is still procedural WebGL rather than downloaded high-detail character models. If the visual direction is approved but fidelity remains insufficient, a later Decision Gate can evaluate a lightweight original 3D-asset pipeline without silently changing the current stack.

### Next-run candidates

- Add challenge mode with mastery-aware scoring and a clean restart loop.
- Add accessibility options for timing assistance, left-handed layout and high-contrast telegraphs.
- Refine Run 014 proportions/lighting only if real-device evidence shows a specific remaining readability or art-direction defect.
