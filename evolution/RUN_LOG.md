# Evolution Run Log

This file keeps the autonomous-evolution history concise. Full implementation detail remains available in Git history and Draft PR receipts.

## Runs 000–014 — Established evolution history

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
- **Run 014 — FEATURE:** wide-framed procedural samurai redraw, stronger stage silhouettes/armour, deeper dojo perspective and reduced foreground obstruction.

## Run 015 — Four-beat combat motion and adaptive phone rendering

**Date:** 2026-08-27  
**Action type:** FEATURE  
**Scope:** Directly address physical-iPhone feedback that enemy animation still felt incomplete/jerky and that the desired target is a fluid 60 Hz phone presentation, while keeping engine migration behind an explicit Decision Gate.

### Preflight / review disposition

- Exact previous HEAD `d85982839fb8a6f3c7ec0c02ecba3eecafaa91e3`: CI #41 (`33034005241`) = success; GitHub `Vercel` status = success.
- Draft PR #1 remained open, Draft and unmerged.
- No inline review threads existed.
- Latest current-HEAD All Repos review reported **no actionable P0/P1/P2 finding**.
- Physical iPhone evidence is treated as new direct-user product evidence: visual fidelity remains insufficient and motion needs complete wind-up / swing / impact / recovery presentation.

### Decision baseline

The repository rule prohibits silently replacing the renderer stack. The user's wording asked to **consider** an open-source 3D engine, not to approve a migration. Therefore this run separates two layers:

1. **Immediate player-visible motion problem:** safe to improve inside the existing renderer.
2. **Higher-detail rigged 3D character pipeline:** architecture/asset Decision Gate requiring a bounded prototype and explicit approval.

### Candidate selection

Candidates were scored 1–5 for visible impact / goal alignment / novelty / confidence / safety:

- Four-beat continuous motion + adaptive phone render budget: **5 / 5 / 5 / 4 / 5 = 24**.
- Accessibility settings surface: **4 / 5 / 4 / 4 / 4 = 21**.
- Immediate open-source-engine + rigged-model migration: **5 / 5 / 5 / 2 / 2 = 19** because asset provenance, migration cost and real-phone performance are not yet evidenced.

The four-beat motion slice wins; the 3D-engine/model path is documented separately as an open Decision Gate.

### Before

- Enemy poses were computed independently from `telegraph`, `strike` and `recovery` progress.
- At normal phase boundaries, body/hilt offsets could reset even when blade angle looked approximately aligned.
- A successful early parry could switch the game state directly into recovery while the rendered strike was still near its opening pose, causing a visible pose jump.
- Player katana used `fract(T*3.)` / global clock-derived motion, so a gesture could visually wrap independent of the action start.
- Internal rendering used a fixed DPR cap rather than reacting to sustained slow frames.

### After

- Added `src/animation-motion.js` with continuous visual pose weights for **wind-up → swing → impact/follow-through → recovery**.
- Telegraph end matches strike start; strike end matches recovery start; recovery end matches idle.
- Renderer dampens motion targets over multiple frames so an early parry interruption transitions rather than teleports.
- Stance, torso, arms, hilt, blade trail and stage accents share the same motion state, creating whole-body attack commitment.
- Player parry/slash motion now uses local elapsed action progress instead of a wrapping global animation clock.
- Added rolling frame-time estimation and bounded adaptive internal resolution (approximately 1.0–1.6) to protect a 60 Hz-oriented phone render budget. Combat timing remains unchanged.
- Added deterministic motion tests for phase continuity, impact beat, early-parry smoothing, object reuse and adaptive quality.
- Added `docs/3D_PIPELINE_DECISION_GATE.md`; Three.js + local glTF/GLB is the tentative first prototype, Babylon.js and custom WebGL remain comparators. No production engine/model dependency was added.

### Regression boundaries

- No enemy HP, damage, parry/perfect windows, posture, reach, STEP, boss phase, mastery, onboarding or input rule changed.
- Animation remains elapsed-time driven, not frame-count driven.
- Adaptive quality changes render resolution only.
- Motion state objects are reused; no per-frame DOM/model/node allocation is introduced.
- No external model, texture, account, analytics, network runtime service or paid dependency was added.

### Pre-commit verification

- New `animation-motion.js` and renderer passed `node --check`.
- New animation-motion Node tests passed locally 5/5.
- Previous exact HEAD had terminal-green full CI and Vercel Preview.
- The new exact HEAD must still pass the repository's complete `npm test` + browser/WebGL gate and Vercel Preview before the next feature run.

### Known risks / human acceptance

- Adaptive resolution is a defensive render-budget mechanism, **not a guarantee of 60 fps**. Sustained 60 Hz must be judged on the target physical iPhone.
- Procedural character geometry is still not a substitute for a properly rigged detailed model. The new Decision Gate intentionally prevents an unmeasured engine migration.
- A future model prototype must prove material visual gain, licence/provenance, load size and physical-phone performance before replacing the current renderer.

### Next candidates

- Run a bounded Three.js vs Babylon/custom prototype only after the 3D pipeline Decision Gate is explicitly approved.
- Add accessibility options for timing assistance, left-handed play and high-contrast telegraphs.
- Add challenge mode after the core visual/animation direction is stable.
