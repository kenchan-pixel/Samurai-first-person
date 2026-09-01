# Evolution Run Log

This log is intentionally concise. Full diffs, exact SHAs, CI receipts and Preview links remain in Git history and Draft PR #1. Historical long-form entries through Run 089 were compacted on Run 091; no product rule was removed from `docs/CURRENT_BASELINE.md` or `docs/REGRESSION_CHECKLIST.md`.

## Runs 000–020 — Core systems and renderer evolution

- Run 000 baseline: mobile-first first-person duel, directional parry/swipe combat, three enemies, progression, tests and SOT.
- Runs 001–003: exact-head CI/Vercel fence, readable combat motion and renderer/WebGL correctness/browser smoke.
- Runs 004–010: posture/guard break, mastery/local best, Crimson Shogun and Guided Duel with integration/reduced-motion repairs.
- Runs 011–020: spacing/STEP, impact choreography, wider framing, elapsed-time four-beat motion, dropped-frame recovery, PlayCanvas production renderer and real combat-motion browser contract.

## Runs 021–042 — Skinned character, mobile combat and practice

- Runs 021–025: local 19-joint skinned samurai GLB, animation binding, directional body reads and four stage silhouettes.
- Runs 026–029: physical-phone readability repair, real four-direction blade-tip paths, Perfect Parry riposte and Blood Moon integrity.
- Runs 030–034: phone-first guide/Ronin lesson, exact-head clarity repairs, Perfect STEP and phase-priority repair.
- Runs 035–038: first-person two-hand grip, local post-run analysis and denominator/damage repairs.
- Runs 039–042: repeatable Ronin/Shogun practice, practice browser verification and optional 刀路清晰.

## Runs 043–054 — Combat UX, animation regression and autonomy recovery

- Runs 043–050: mobile Combat UX simplification, top-parry reach, true Pause clock, repeated exact-head production-browser hardening, Shogun signature motion and final top-right Pause restoration.
- Run 051: aligned outer browser gate with accepted Pause contract; CI/Vercel green before animation work.
- Run 052 rejected: procedural per-frame Chest/arm/HandR choreography passed automation but physical-phone evidence exposed collapsed body/arm/blade hierarchy.
- Run 053 restored the pre-052 usable enemy-animation baseline.
- Run 054 removed the mistaken mandatory-human-test HOLD; autonomous self-verification is primary, later device evidence remains authoritative when it exposes a real defect.

## Runs 055–064 — Authored attacks and timing assist

- Run 055 added original animation-only AttackTop/Right/Bottom/Left on the shared rig.
- Run 056 repaired floating-point verification and generic phase transitions interrupting one continuous Attack*.
- Runs 057–061 made HandR/Sword hierarchy authoritative, repaired lateral reads and same-draw pose evaluation, and added bounded whole-model forward commitment while keeping the fixed grip.
- Run 062 added optional default-off 節拍提示 driven by authoritative telegraph/Perfect timing.
- Runs 063–064 made the disabled timing assist truly DOM-idle and repaired its deterministic browser harness without weakening the off/on/off mutation contract.

## Runs 065–074 — Blade semantics, afterimages, delivery recovery and handedness

- Run 065 repaired the remaining owner animation P1 with authored player-facing Guard and player-screen RIGHT/LEFT cut travel.
- Runs 066–067 restored exact-head SOT verification and replaced brittle sentence-literal smoke with semantic invariants.
- Runs 068–069 added bounded actual-Sword afterimages and live reduced-motion cleanup.
- Runs 070–071 defined bounded one-shot Vercel external-provider recovery without allowing failed Preview to pass the feature gate.
- Run 072 reconciled architecture SOT with PlayCanvas + Vite primary, deterministic CombatEngine authority and WebGL2 fallback.
- Runs 073–074 added persistent STEP handedness, fixed left-side clipping and strengthened the real 320×568 production input gate.

## Runs 075–089 — Challenge, dojo and training evolution

- Run 075 — **FEATURE:** added the local eight-duel 連戰試煉 while preserving the normal four-duel campaign.
- Run 076 — **BLOCKER_FIX:** added real challenge entry/retry/campaign-handoff/result browser acceptance.
- Run 077 — **FEATURE:** added challenge-only 氣勢/不屈, rewarding two clean waves with +1 HP or +300 score at full HP.
- Run 078 — **BLOCKER_FIX:** proved a real CombatEngine `player-hit` breaks momentum and clean waves rebuild it correctly.
- Run 079 — **BLOCKER_FIX:** made final-wave full-health 不屈 score authoritative across engine, victory and challenge-best persistence.
- Run 080 — **BLOCKER_FIX:** aligned the player-visible challenge result score with that same final authoritative score.
- Run 081 — **FEATURE:** added 今日陣, a deterministic same-local-date eight-wave roster/opening-order variant without new balance values.
- Run 082 — **BLOCKER_FIX:** added a real 320×568 今日陣 entry/banner/eight-wave/retry/campaign-handoff lifecycle gate.
- Run 083 — **FEATURE:** added challenge-only Waves 2/4/6 戰前抉擇: 整息 +1 HP or 血誓 -1 HP/+350 score with last-HP safety.
- Run 084 — **BLOCKER_FIX:** froze remaining stage-clear time during tactical choice so reading time cannot fast-forward the next duel.
- Run 085 — **REGRESSION_FIX:** restored correct challenge rematch visual identity from enemy id instead of clamped eight-wave ordinal.
- Run 086 — **FEATURE:** added challenge/今日陣 宿敵步速 using optional validated per-wave splits inside the existing local challenge-best record.
- Run 087 — **FEATURE:** added direct Oni Stage 3 practice with real Oni definition, retry and clean campaign handoff.
- Run 088 — **FEATURE:** added 練血月 direct Crimson Shogun Phase II practice at the existing 6 HP threshold, with no normal +300 transition reward.
- Run 089 — **FEATURE:** added 師範弱點再練, routing campaign Stage 2/3/4 analysis directly into the existing practice lifecycle while keeping campaign best isolated.

## Run 090 — Production practice gate attempt rejected

**Date:** 2026-09-02  
**Action type:** ABORTED / BLOCKER_CONFIRMED

- Incoming exact HEAD `5dc6c77e1d3e7da57f5e1e2140d5365408a1b1a1` was CI/Vercel green, but the latest exact-head review identified two P2 production-orchestration gaps: weak-stage training did not traverse real `main.js` restart orchestration, and 練血月 had no real-control browser lifecycle.
- Candidate `2e7f9c7d7f25731cbf42ffeafa0bec391d162e7d` added the true 320×568 production-document gate. It proved the complete 師範弱點再練 → Ronin terminal → 再練一次 → campaign handoff path, then failed after real Pause → Home when the actual 練血月 control did not enter Blood Moon mode.
- CI #131 therefore rejected the candidate and the branch was restored to verified `5dc6c77e`; no Run 090 implementation commit remained on `autonomous-evolution`.
- The failure converted the Blood Moon item from a coverage gap into a material production-control integration blocker that had to precede unrelated feature work.

## Run 091 — Blood Moon production-control repair

**Date:** 2026-09-02  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `5dc6c77e1d3e7da57f5e1e2140d5365408a1b1a1`.
- Latest exact-head GitHub Actions CI #132 was terminal green and GitHub's exact-head `Vercel` commit status was `success`; direct Vercel deployment enumeration is not required because the canonical fallback is the GitHub `Vercel` commit status.
- Draft PR #1 remained open/Draft/unmerged, `main` remained at `b6d42422cec9c35b7f1ccf07d50c8f2ff3e6ce40`, and inline review threads were empty.
- The latest exact-head review retained the two P2 orchestration findings, while the rejected Run 090 production gate supplied concrete evidence that the actual 練血月 control chain could fail even though direct Blood Moon request-API tests stayed green. This run therefore remained blocker-first; no feature candidates were eligible.

### Repair

- The first candidate correctly removed the fragile nested **練血月 → synthetic 練將軍 → synthetic Start** proxy, but its new production gate still failed. CI diagnostics showed `nextBloodMoon=blood-moon` while `nextRun=campaign`, proving the Blood Moon request survived but the shared practice request was reset before `engine.start`.
- Root cause: `installDuelPractice()` is legitimately re-entered by later adapters, and `installUi()` had been attaching a fresh `#start-button` practice-reset listener on every re-entry. One listener consumed the intentional practice-launch arm; the duplicate listener then immediately reset the request to campaign.
- `practice-mode.js` now makes that Start reset binding idempotent with one DOM binding marker and exports `armPracticeLaunch(enemyId)` as the single intentional Start handoff. Existing 練浪人/練鬼/練將軍 controls use that same arming path.
- `blood-moon-practice.js` now requests the real Shogun practice mode, explicitly arms that practice launch, preserves the Blood Moon request through exactly that Start event, and clicks the real production Start control directly. Ordinary Start/practice/challenge/campaign selections still clear stale Blood Moon requests.
- Blood Moon activation publishes non-visible receipts from the authoritative engine state (`phase=2`, `enemyHp=6`, `startScore=0`) so the browser gate can prove the real control reached the real Phase II definition without the normal transition reward; these receipts clear when Blood Moon mode is inactive and have no combat authority.
- Added the true 320×568 production-document gate to `npm run test:browser`. It proves generated Stage 2 recommendation → real Ronin restart → terminal/retry/campaign handoff, then real Pause → Home → 練血月 → direct Phase II 6 HP / 0 transition score → terminal **再戰血月** → repeat direct Phase II → clean Stage 1 campaign handoff.

### Regression boundary

- No campaign/practice/challenge enemy definition, HP/posture/timing/damage, parry/Perfect/STEP rule, direction mapping, Blood Moon threshold or normal +300 reward, challenge momentum/tactics/rival, mastery/run-analysis formula, renderer animation/geometry, persistence key, account/network/privacy or asset authority changed.
- `src/boss-encounter.js` remains the sole Phase II definition authority; this repair only makes the already-approved direct-practice production control reliably reach it.
- Local repository checkout could not resolve GitHub from this runtime, so exact-head GitHub Actions (`npm test` + `npm run test:browser`) and the exact-head GitHub `Vercel` commit status are the mandatory acceptance evidence for the final replacement commit.
