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

## Run 092 — Four-direction defense result analysis

**Date:** 2026-09-02  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `2e637cdc4dd460a5f8bbf6b3c95762dcb7805aaf`.
- Exact-head GitHub Actions CI #135 and GitHub's exact-head `Vercel` commit status were terminal green before feature selection; Draft PR #1 remained open/Draft/unmerged and inline review threads were empty.
- Run 091 had closed the material production-practice blocker and its production-document gate was green. No applicable P0/P1/P2 correctness, runtime or deployment blocker remained.
- Candidate scoring favoured **四向防守** result analysis (23/25) over separate dojo mastery persistence (20/25) or another duel/enemy slice (19/25): it directly strengthens the directional-read learning loop while keeping combat and persistence untouched.

### Implementation

- `src/run-analysis.js` now records the actual incoming `strike` direction for the focused stage. A successful parry or STEP counts as defended; `player-hit` records an unsuccessful defense. The result-only aggregator derives the observed defense rate for top/right/bottom/left and highlights the weakest direction.
- Campaign and direct-practice results render a compact **四向防守** four-cell map under the existing local analysis. It adds no live-combat HUD, pointer ownership, storage or network surface. Eight-wave challenge/今日陣 terminals suppress the extra map to preserve their established phone result layout.
- Added deterministic Node coverage for direction accounting and a focused 320×568 browser gate for the four-cell map, weakest-direction highlight and eight-stage omission. The existing 師範弱點再練 browser harness now includes a real directional weakness so the map and ≥44 px recommendation control must fit together at 320×568.

### Regression boundary

- No `game-core` combat rule, enemy definition, HP/posture/timing/damage, score, input mapping, Perfect/STEP rule, boss transition, challenge momentum/tactics/rival, persistence key, renderer animation/geometry, asset, account/network/privacy or telemetry authority changed.
- Existing stage-focused coaching and practice routing remain authoritative; the new map only exposes evidence already present in the combat event stream.
- Current Baseline advances to 0.35.0-evolution and the checklist/backlog/changelog/state are updated in this same implementation commit. Exact-head CI and Vercel remain mandatory post-commit acceptance gates.

## Run 093 — Normal dojo launch isolation repair

**Date:** 2026-09-02  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `82d136149ec1480d9c7ac7ee95edc03b5aeea01d`.
- Its first CI #136 attempt passed all 98 Node tests but timed out in the first renderer-motion browser smoke. One exact-head rerun completed green for both `npm test` and `npm run test:browser`, confirming the timeout was transient rather than a repeatable renderer regression. GitHub's exact-head `Vercel` commit status was `success`; the direct Vercel connector still enumerated zero projects / returned 404 for the known project, so the canonical GitHub status remained the deployment signal.
- Draft PR #1 remained open/Draft/unmerged, `main` remained untouched, and inline review threads were empty.
- The latest exact-head All Repos review identified a separate material P1: the Blood Moon capture reset could erase the shared requested practice mode during the nested Start click for **練浪人 / 練鬼 / 練將軍**, silently launching Stage 1 campaign instead. That P1 prohibited feature selection.

### Repair

- `blood-moon-practice.js` now separates Blood Moon UI selection cleanup from the shared normal-practice request. Its capture listener clears only the Blood Moon variant; the existing `practice-mode.js` launcher/reset listener remains the sole authority for campaign vs Ronin/Oni/Shogun practice selection. The exported `requestBloodMoonPractice(false)` keeps its existing full-reset API semantics for explicit callers.
- This preserves the intended source-aware nested Start handshake: normal **練浪人 / 練鬼 / 練將軍** clicks can arm Stage 2 / Stage 3 / Stage 4 Phase I without a later Blood Moon capture handler forcing `requestedMode` back to campaign, while the dedicated **練血月** armed Start path still reaches direct Phase II.
- Strengthened the existing true 320×568 production-document browser gate. Before the recommendation/Blood Moon lifecycle it now clicks each real start-screen normal-practice control, requires Ronin Stage 2, Oni Stage 3 and Shogun Stage 4 Phase I respectively, confirms Blood Moon is not active for normal Shogun practice, and returns through real Pause → Home between launches. The existing real Ronin terminal/retry/campaign handoff and Blood Moon terminal/retry/handoff assertions remain fail-closed.

### Regression boundary

- No enemy definition, HP/posture/timing/damage, parry/Perfect/STEP rule, direction mapping, boss phase threshold/reward, mastery/run-analysis formula, challenge/今日陣 rule, renderer animation/geometry, storage key, network/account/privacy or asset authority changed.
- The repair narrows UI orchestration ownership only; `practice-mode.js` still owns normal direct-practice selection and `boss-encounter.js` still owns Blood Moon Phase II.
- Exact-head GitHub Actions and exact-head Vercel remain mandatory post-commit acceptance gates. The run is not complete until this implementation SHA has both terminal green and one concise Draft-PR receipt.

## Run 094 — Heavy attack weight pass

**Date:** 2026-09-02  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `835d6899a991920586c862e71d000fa7c0f0e5c7`.
- Exact-head GitHub Actions CI #137 and GitHub's exact-head `Vercel` commit status were terminal green before feature selection. Draft PR #1 remained open/Draft/unmerged, `main` remained untouched, inline review comments were empty, and the latest exact-head review reported no actionable P0/P1/P2 finding.
- Run 093 closed the normal-practice launch P1 in the real 320×568 production flow, so feature work was eligible.
- Candidate scoring: **heavy-attack body/blade weight pass 23/25** (impact 5, goal alignment 5, novelty 4, confidence 4, safety 5); direction-specific dojo drill layer 21/25; challenge/today pressure tuning 19/25. The heavy pass wins because current combat already marks real `heavy` attacks, but the primary renderer did not materially distinguish their body commitment from normal cuts beyond combat timing.

### Implementation

- Added a bounded presentation adapter driven only by the existing authoritative `attack.heavy` flag. Heavy telegraphs now settle into a deeper loaded stance; the strike keeps phase-boundary continuity, drives the whole opponent root farther forward, carries that weight into recovery, enlarges the existing real-blade read trail and adds a small camera-pressure response.
- The adapter acts after the existing authored/mobile motion pass but before blade-trajectory sampling, so HandR/Sword authority and the actual world-space blade path remain intact. It does not write Chest/arm/HandR joints or invent a second blade path.
- Normal attacks are byte-for-behaviour presentation-neutral through the adapter. Added deterministic Node coverage for inactive normal attacks, telegraph→strike→recovery continuity, full-body load/drive, blade-read emphasis and bounded camera response. Existing real PlayCanvas/browser gates remain mandatory for exact-head acceptance.

### Regression boundary

- No enemy definition, HP/posture/timing/damage, score, input mapping, parry/Perfect/STEP rule, boss threshold/reward, challenge/今日陣 rule, mastery/run-analysis formula, persistence key, network/account/privacy or asset authority changed.
- The legacy WebGL2 fallback remains unchanged and retains the accepted baseline; the new weight slice targets the canonical PlayCanvas primary renderer only.
- Exact-head GitHub Actions (`npm test` + full `npm run test:browser`) and GitHub `Vercel` commit status must both become terminal green before this run is accepted. Post-commit status is authoritative in the Draft-PR run receipt.
