# Evolution Run Log

This file keeps autonomous-evolution history concise. Full implementation detail and exact verification receipts remain in Git history and Draft PR #1.

## Runs 000–020 — Established evolution history

- **Run 000 — BASELINE:** mobile-first first-person WebGL duel, four-direction parry/swipe combat, three enemies, progression, tests and SOT.
- **Run 001 — BLOCKER_FIX:** exact-head CI/Vercel fence plus P0/P1/P2 review-gate semantics.
- **Run 002 — FEATURE:** enemy anticipation/body commitment/blade-trail readability.
- **Run 003 — BLOCKER_FIX:** player-katana/GLSL fixes plus executable WebGL browser smoke.
- **Run 004 — FEATURE:** player/enemy posture and guard break.
- **Runs 005–006 — FEATURE/BLOCKER_FIX:** mastery grading/local best plus browser/storage/layout hardening.
- **Runs 007–008 — FEATURE/BLOCKER_FIX:** Crimson Shogun and Guided Duel with integration repairs.
- **Runs 009–010 — FEATURE/BLOCKER_FIX:** Guided Duel onboarding plus lifecycle repair.
- **Runs 011–012 — FEATURE/BLOCKER_FIX:** close/mid/far spacing and STEP plus onboarding/pointer integration repair.
- **Run 013 — FEATURE:** direction-aware impact choreography.
- **Run 014 — FEATURE:** wider procedural samurai framing and deeper dojo perspective.
- **Runs 015–017 — FEATURE/BLOCKER_FIX:** four-beat elapsed-time motion, direct catch-up, authoritative parry-interruption repair.
- **Run 018 — FEATURE:** PlayCanvas standalone + Vite primary renderer, perspective scene and articulated primitive samurai with WebGL2 fallback.
- **Runs 019–020 — BLOCKER_FIX:** current PlayCanvas CI gate and production telegraph → strike → parry → counter renderer contract restored.

## Runs 021–026 — Skinned character and physical-phone readability

- **Run 021 — FEATURE:** deterministic local GLB with 19-joint skinned samurai, layered armour and `Idle / Windup / Strike / Recovery / Parry` clips.
- **Run 022 — BLOCKER_FIX:** stale current-baseline CI assertions repaired so the real browser gate could execute.
- **Run 023 — BLOCKER_FIX:** PlayCanvas container animation Assets unwrapped to real AnimTracks and skinned production path restored.
- **Run 024 — FEATURE:** direction-specific skinned body choreography plus sword-bone read trail.
- **Run 025 — FEATURE:** four stage-specific silhouettes/weapon profiles on the shared rig.
- **Run 026 — REGRESSION_FIX:** first physical-iPhone readability repair: smoother strike presentation, stronger parry clash, quieter HUD and STEP moved lower-right.

## Run 027 — Real blade trajectory + Perfect Parry riposte repair

**Date:** 2026-08-28  
**Action type:** REGRESSION_FIX  
**Goal:** Fix the direct owner physical-iPhone blockers that remained after Run 026: the enemy katana still did not actually point/cut toward the player, STEP text remained too small, and Perfect Parry lacked the requested immediate offensive reward.

### Preflight / blocker evidence

- Exact previous HEAD `793c456596aa99e3c2a61f867a23589e202f9250`: CI #55 / run `33094518212` = success; exact-head GitHub `Vercel` commit status = success.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; no inline review threads existed.
- Latest automated review on the previous HEAD contained one non-blocking P2 about focused Run 026 presentation coverage and no P0/P1.
- The owner then supplied direct iPhone evidence and explicit P1 acceptance: four real 3D blade-tip paths must advance toward/cross the player-facing plane; trail must follow the real world-space weapon path; STEP primary text must be materially larger; Perfect Parry should auto-riposte while manual swipe follow-up and approximate damage budget remain.
- These physical-device P1 findings override feature selection, so unrelated feature work is prohibited until repaired/rechecked.

### Root cause

- The primitive weapon path changed mostly Z-axis rotation, while the skinned path reused one Strike clip whose Sword joint also mainly rotated around Z.
- Direction differences were then amplified by rotating the whole skinned model and adding bone-attached echoes. That can make the body look committed while the blade shaft still never points into camera depth.
- Run 026 therefore decorated the wrong weapon trajectory rather than correcting it.
- STEP's Run 026 override still forced a 9 px primary label and 8 px secondary label on phone.

### Repair

- Added a late presentation-only trajectory layer around the actual loaded skinned `Sword` joint. Top/right/bottom/left now have different 3D wind-up → contact → follow-through targets.
- During the committed strike the opponent receives a bounded depth lunge, the katana local blade axis points toward the camera/player, the calculated blade tip crosses a player-facing Z plane, then blends back through recovery.
- Disabled the old attached swing echoes during this path and added at most six reused root/world-space trail segments built from actual blade-tip history; no per-frame entity creation and no new model/texture/network asset.
- Added a phone control style layer after Run 026 presentation CSS: STEP is materially larger/bolder, the tiny secondary label is hidden, and range/temporary feedback text is enlarged while the 320×568 STEP hit area stays beyond the bottom/right block-region boundaries.
- Added Perfect Parry automatic light riposte: exactly 1 immediate damage. The same recovery opening still allows one manual swipe counter. When auto-riposte has fired, the old +1 perfect bonus is suppressed on that manual counter, keeping the standard perfect + opposite-direction total at approximately the previous damage budget rather than stacking free damage.
- Normal parry remains manual-only.
- The automatic riposte uses a raw `perfect-riposte` event through onboarding/mastery/impact observers, then maps it to the existing visible counter event for the main runtime. This preserves Guided Duel's requirement for a genuine manual swipe counter while still showing the immediate player slash/audio/hit feedback.

### Verification added in the same slice

- Extended the existing production PlayCanvas renderer contract instead of adding a broad new harness: it checks all four wind-up/strike blade-tip paths, forward Z advance, player-facing plane crossing, actual world-space trail history, and the phone STEP font/secondary-copy contract.
- Added focused Node coverage for automatic Perfect Parry damage, preserved manual swipe follow-up, moved perfect bonus, and unchanged normal-parry behaviour.
- The prior Run 026 P2 is dispositioned as non-blocking for this run: the new player-critical sword path no longer depends on the two attached echoes, while existing impact browser coverage still protects bounded parry FX. Physical feel remains a human gate.

### Regression boundaries / risk

- No attack duration, parry/perfect timing window, input mapping, STEP effectiveness, reach, posture threshold, boss phase timing, account/network/storage model, asset provenance or merge/deploy authority changed.
- Combat authority remains in `CombatEngine`; blade trajectory is renderer-only. Perfect-riposte damage is a bounded combat adapter with focused tests.
- The renderer's automated world-space path proof cannot certify subjective smoothness, exact visual contact or sustained 60 Hz/thermals on iOS Safari. The next run must use new physical-device evidence before unrelated feature expansion.

### Next candidates

- Physical-iPhone re-check of all four blade paths, Perfect Parry auto-riposte feel and STEP readability.
- Sustained device frame-time/shadow/pixel-ratio tuning if evidence requires it.
- First-person player hands/katana fidelity only after opponent trajectory acceptance is confirmed.

## Run 028 — Blade trajectory exact-head CI repair

**Date:** 2026-08-28  
**Action type:** BLOCKER_FIX  
**Goal:** Repair the failed exact-head browser gate from Run 027 without weakening the player-facing blade acceptance contract.

### Preflight / blocker evidence

- Exact HEAD `890292fad3e4705decd65a3bee8deb5e3b2a6a4a`: Vercel commit status = success, but CI #56 / run `33100201493` failed.
- `npm test` passed all 40 Node tests. `npm run test:browser` failed the real production PlayCanvas contract with `Top strike blade tip did not advance continuously toward the player`.
- PlayCanvas, the skinned GLB, STEP readability layer and `worldspace-v2` adapter all initialized; the failure was isolated to the new real Sword trajectory.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; no inline review threads existed.
- Therefore this run is strictly `BLOCKER_FIX`; no unrelated feature work is permitted.

### Root cause / repair

- Run 027 described wind/contact/follow as absolute world-space tip targets several metres from the hilt, then normalized the aim back to the fixed 1.78 m blade length. The resulting reachable tip could fail the required monotonic forward movement even though the nominal target Z increased.
- The strike path also applied easing to already-interpolated absolute targets, making early commitment less deterministic than the contract requires.
- Replaced those unreachable positions with normalized hilt-relative **world-space blade-axis profiles** for top/right/bottom/left.
- The first strike beat now uses a bounded front-loaded cut easing from guard axis to a near-camera contact axis; the opponent depth lunge follows the same commitment. Contact then blends through a direction-specific follow-through axis and recovery returns to the sampled skeletal direction.
- The skeletal/base Sword direction is sampled immediately after the original animation draw and before the presentation override, so the later prerender pass cannot feed the overridden trajectory back into its own telegraph/recovery interpolation.
- Existing max-six world-space trail reuse, STEP presentation, Perfect Parry riposte, combat timing/input/damage authority and fallbacks are unchanged.

### Verification boundary

- The existing fail-closed browser assertion is intentionally unchanged; this repair must make the real Sword satisfy it rather than relax the gate.
- Post-commit exact-head CI and Vercel results are recorded in the Draft PR run receipt, per the scheduled-task protocol.
- Physical-iPhone normal-speed smoothness and exact visual contact remain the owner acceptance gate even after automated trajectory geometry is green.
