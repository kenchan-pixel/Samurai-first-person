# Evolution Run Log

This file keeps autonomous-evolution history concise. Full implementation detail and exact verification receipts remain in Git history and Draft PR #1.

## Runs 000–020 — Core systems and renderer evolution

- **Run 000 — BASELINE:** mobile-first first-person WebGL duel, four-direction parry/swipe combat, three enemies, progression, tests and SOT.
- **Run 001 — BLOCKER_FIX:** exact-head CI/Vercel fence plus P0/P1/P2 review-gate semantics.
- **Runs 002–003 — FEATURE/BLOCKER_FIX:** readable combat motion plus renderer/WebGL correctness and executable browser smoke.
- **Runs 004–006 — FEATURE/BLOCKER_FIX:** player/enemy posture, guard break, mastery grading/local best and browser/storage hardening.
- **Runs 007–010 — FEATURE/BLOCKER_FIX:** Crimson Shogun and Guided Duel with integration/reduced-motion repairs.
- **Runs 011–014 — FEATURE/BLOCKER_FIX:** close/mid/far spacing, STEP, impact choreography and wider samurai/dojo framing.
- **Runs 015–020 — FEATURE/BLOCKER_FIX:** elapsed-time four-beat motion, dropped-frame recovery repair, PlayCanvas production renderer and real combat-motion browser contract.

## Runs 021–026 — Skinned samurai and phone readability

- **Run 021 — FEATURE:** deterministic local 19-joint skinned GLB samurai with layered armour and `Idle / Windup / Strike / Recovery / Parry` clips.
- **Runs 022–023 — BLOCKER_FIX:** stale baseline assertions and PlayCanvas animation-asset binding repaired so the real skinned production path loads.
- **Runs 024–025 — FEATURE:** direction-specific skinned body choreography and four stage-specific silhouettes/weapon profiles on the shared rig.
- **Run 026 — REGRESSION_FIX:** direct physical-iPhone readability repair: smoother strike presentation, stronger parry clash, quieter HUD and STEP relocation.

## Runs 027–032 — Direct physical-play repairs and learnability

- **Run 027 — REGRESSION_FIX:** real four-direction world-space blade-tip cuts toward/crossing the player-facing plane, bounded actual-path trail, larger STEP presentation and Perfect Parry automatic 1-damage riposte.
- **Run 028 — BLOCKER_FIX:** repaired the failed blade-path browser contract with hilt-relative normalized blade axes and faster early commitment rather than weakening the test.
- **Run 029 — BLOCKER_FIX:** unified Crimson Shogun Phase II threshold so Perfect Parry automatic damage cannot bypass Blood Moon.
- **Run 030 — FEATURE:** phone-first 玩法 guide, large transient action cues and explicit Stage 2 Ronin final-direction/feint lesson; Ronin balance values intentionally unchanged pending another phone check.
- **Runs 031–032 — BLOCKER_FIX:** aligned duplicated Node/browser onboarding assertions with the stable `掃屏反擊` semantic cue and restored the full exact-head verification fence.

## Run 033 — Perfect STEP differentiation

**Date:** 2026-08-28  
**Action type:** FEATURE  
**Goal:** Make STEP strategically distinct from normal directional parry after direct owner feedback that the two routes felt overlapping and that a high-quality STEP lacked an immediate counter reward.

### Preflight / evidence

- Exact previous HEAD `83177db2ecb5d493440b5f57337942810a968290`: CI #61 / run `33117974538` = success; exact-head GitHub `Vercel` commit status = success.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; no inline review threads existed.
- Exact-head Second Hourly review reported **no actionable P0–P2** findings and confirmed Run 032 restored the full Node + browser gate.
- Product evidence remained stronger for STEP differentiation than for blind Ronin nerfs: the owner explicitly reported that STEP overlapped the normal defensive loop and expected a perfect STEP to counter, while the current SOT still requires another physical-phone Ronin check before changing Stage 2 timings.
- Remote gameplay telemetry remains outside the approved privacy boundary and was not implemented.

### Candidate selection

1. **Perfect STEP skill route** — impact 5 / goal alignment 5 / novelty 4 / confidence 4 / safety 4. Directly separates spacing mastery from posture/parry mastery while preserving current input and reach rules.
2. **Immediate Ronin timing/feint nerf** — 4 / 4 / 2 / 3 / 4. Deferred because the current clarity pass has not yet received another same-device difficulty check.
3. **First-person player hands/katana fidelity** — 4 / 5 / 4 / 4 / 5. Valuable, but less directly tied to the latest gameplay feedback than STEP differentiation.

Chosen slice: candidate 1.

### Delivered slice

- Existing normal STEP is preserved: it still only works in its bounded early strike window, moves one distance step, must escape attack reach, deals no automatic damage, and leaves a manual swipe-counter opening.
- Added **Perfect STEP** as a narrower timing grade inside a genuinely successful STEP. The perfect window is bounded to roughly 48–68 ms depending on strike duration.
- Perfect STEP immediately deals exactly 1 automatic riposte damage, adds no enemy posture, and keeps the same one manual swipe counter available during recovery.
- This makes the two skill routes intentionally different: Perfect Parry requires direction and builds posture; Perfect STEP removes direction reading but only works when spacing escapes reach and gives no posture progress.
- Long/heavy reach-2 attacks still track at far distance, so even perfect timing cannot turn STEP into universal invulnerability.
- Automatic Perfect STEP damage invokes the same Crimson Shogun Phase II HP gate used by manual counters and Perfect Parry ripostes.
- The existing STEP feedback is upgraded on the perfect result to `PERFECT STEP · 自動補刀 -1`; the existing large action-cue surface explains `無敵勢 · 仲可掃屏`, and the start-screen 玩法 sheet receives one dedicated Perfect STEP card.
- Local mastery damage accounting now includes both automatic riposte types while preserving `counters` as manual swipe counters only.

### Verification / regression boundaries

- Focused footwork Node coverage now proves: ordinary STEP outside the narrower perfect window remains no-auto-damage; Perfect STEP auto-ripostes exactly 1 with no posture gain and keeps the manual opposite-direction counter; long/heavy tracking still defeats STEP even at perfect timing; wrong-time STEP remains rejected.
- The existing footwork browser harness still dispatches the real STEP pointerdown/pointerup path and now additionally requires the visible Perfect STEP feedback/cue/guide plus the automatic counter event, while retaining drag rejection, pointer isolation and long-tracking checks.
- Focused boss coverage proves Perfect STEP at Crimson Shogun 7 HP reaches 6 HP and enters Blood Moon before another manual counter can resolve.
- No Ronin timing/damage/HP, parry timing, normal STEP window/reach, input mapping, renderer/asset pipeline, account/network/analytics behavior or merge authority changed.
- Physical-iPhone feel remains the next acceptance boundary: confirm normal STEP vs Perfect STEP is obvious in play and that the automatic sidestep riposte reads as intentional rather than visual noise.

### Next candidates

- Same-device Stage 2 Ronin re-check after the gameplay guide; tune only if the difficulty wall remains.
- Same-device blade trajectory plus Perfect Parry/Perfect STEP differentiation check.
- Privacy Decision Gate for anonymous balancing telemetry before any backend collection is implemented.

## Run 034 — Perfect STEP closed-opening cue repair

**Date:** 2026-08-28  
**Action type:** BLOCKER_FIX  
**Goal:** Repair the current-head P2 where Perfect STEP could correctly trigger Blood Moon and close the recovery opening while the player-facing STEP/cue text still instructed a manual swipe.

### Preflight / evidence

- Exact previous HEAD `42b5daa876bab8d7b1c4b62bc45980f684ec69c7`: CI #62 / run `33122961450` = success; exact-head GitHub `Vercel` commit status = success.
- Direct Vercel deployment enumeration returned 403, so the canonical fallback remains GitHub's exact-head `Vercel` status.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; no inline review threads existed.
- The exact-head Second Hourly review identified one actionable P2: Crimson Shogun 7→6 HP Perfect STEP transitions to `gap`/Blood Moon, but both STEP feedback and the larger action cue could still say `掃屏` even though `currentAttack` had been cleared and no recovery counter was legal.
- Earlier P0/P1/P2 findings were already demonstrably addressed by later reviewed heads; no additional current-head blocker was found.

### Delivered repair

- Perfect STEP riposte events now retain whether their automatic damage closes the opening through Blood Moon Phase II or enemy defeat.
- The normal Perfect STEP result is unchanged: `無敵勢 · 仲可掃屏` still appears when a real recovery opening remains.
- If Blood Moon takes priority, the immediate STEP feedback is corrected before the next render and the larger cue says `BLOOD MOON 先行 · 等下一次開口`; neither surface tells the player to swipe.
- If the automatic riposte defeats the enemy, the cue reports the defeat rather than advertising a nonexistent follow-up.
- Updated the 玩法 card to state the same exception, keeping the mechanic learnable without adding persistent HUD text.

### Verification / regression boundaries

- Extended the existing footwork browser harness rather than adding another test suite. It now installs the real boss state, drives the actual STEP pointer path on Crimson Shogun's escapable second attack at 7 HP, and requires: 6 HP, zero posture gain, `gap`, Phase II enemy data, cleared `currentAttack`, automatic Perfect STEP event with `openingClosed`, Blood Moon event, and no `掃屏` copy in either immediate feedback or the action cue.
- Existing normal Perfect STEP browser assertions still require `仲可掃屏`, protecting the distinction between a genuine open recovery and a phase-transition-closed recovery.
- Combat damage, Perfect STEP/normal STEP timing and reach, posture rules, boss HP threshold, manual counter legality, input mapping, renderer/asset pipeline, network/privacy behavior and merge authority are unchanged.
- Post-commit CI/Preview remain pending self-verification by protocol; the Draft PR run comment will carry the exact commit SHA and verification receipt.

### Next candidates

- Same-device Stage 2 Ronin re-check after the gameplay guide; tune only if the difficulty wall remains.
- Same-device blade trajectory plus Perfect Parry/Perfect STEP differentiation check.
- Privacy Decision Gate for anonymous balancing telemetry before any backend collection is implemented.
