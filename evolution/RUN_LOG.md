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

- Perfect STEP riposte events now retain whether their automatic damage closes the recovery opening through Blood Moon Phase II or enemy defeat.
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

## Run 035 — First-person two-hand katana embodiment

**Date:** 2026-08-28  
**Action type:** FEATURE  
**Goal:** Improve first-person physicality without changing combat rules by making the player katana read as a weapon held by the samurai rather than a floating camera-space blade.

### Preflight / evidence

- Exact previous HEAD `8dfe66db257732283975c22b7dfbd1696bd7790e`: CI #63 / run `33126286358` = success; exact-head GitHub `Vercel` commit status = success.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; no inline review threads existed.
- Exact-head Second Hourly review reported **no actionable P0/P1/P2** finding and confirmed the Perfect STEP closed-opening repair.
- The highest-priority Ronin balance item still calls for another same-device post-clarity re-check before changing timings; remote telemetry remains behind an unapproved privacy Decision Gate.

### Candidate selection

1. **First-person two-hand katana embodiment** — impact 4 / goal alignment 5 / novelty 4 / confidence 5 / safety 5. Strong visible gain, low gameplay risk, and directly strengthens the first-person physicality pillar.
2. **Immediate Ronin timing/feint tuning** — 5 / 5 / 3 / 2 / 4. Deferred because the current SOT still requires a post-clarity physical-phone re-check before changing Stage 2 balance.
3. **Anonymous gameplay telemetry backend** — 5 / 4 / 5 / 3 / 1. Deferred because analytics/external tracking remains explicitly blocked pending privacy/data-retention/backend approval.

Chosen slice: candidate 1.

### Delivered slice

- Added `src/player-weapon-fidelity.js` as a bounded PlayCanvas presentation adapter around the existing player katana rig.
- Added two forearms, two hands, two wrist guards, habaki and pommel using existing local materials; no downloaded asset or new dependency is introduced.
- The grip follows the existing player katana transform and adds small action-local wrist/forearm articulation for parry and counter movement, without creating a second animation or combat authority.
- The adapter creates eight primitive entities once and reuses their transforms in-place during draw calls.
- Legacy WebGL2 fallback remains unchanged; if the PlayCanvas path fails, the existing fallback policy still applies.

### Verification / regression boundaries

- Existing exact-head CI and production renderer-contract coverage were green before feature selection.
- The existing PlayCanvas real-app smoke already drives telegraph → strike → parry → counter through the same player rig and will fail if the new adapter breaks PlayCanvas initialization, fallback policy or directional player-katana motion.
- No combat timing, damage, parry/swipe mapping, STEP, boss, mastery, storage, network/privacy or merge-authority behavior is changed.
- Physical-iPhone acceptance remains required for the subjective target: hands/forearms should increase embodiment without hiding the enemy blade path or adding distracting foreground clutter.
- Post-commit CI/Preview remain pending self-verification by protocol; the Draft PR run comment will carry the exact commit SHA and verification receipt.

### Next candidates

- Same-device Stage 2 Ronin re-check after the gameplay guide; tune only if the difficulty wall remains.
- Same-device enemy blade + new first-person grip + Perfect Parry/Perfect STEP readability/performance check.
- Privacy Decision Gate for anonymous balancing telemetry before any backend collection is implemented.

## Run 036 — Local post-run battle analysis

**Date:** 2026-08-28  
**Action type:** FEATURE  
**Goal:** Turn the existing local combat event stream into useful per-stage feedback so a difficult run can show whether the player struggled with reading/parry accuracy, missed counter openings, STEP use or incoming hits without prematurely nerfing Stage 2 or introducing remote tracking.

### Preflight / evidence

- Exact previous HEAD `7f7398fb358c4974e216ecfa88c8aaa64757428b`: CI #64 / run `33129854462` = success; exact-head GitHub `Vercel` commit status = success.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; no inline review threads existed.
- The exact-head Second Hourly review reported **no actionable P0/P1/P2** finding. Remaining concerns were physical-iPhone readability/performance acceptance only.
- The latest product evidence says Stage 2 felt difficult, but the SOT still requires a post-clarity phone re-check before changing Ronin timing/damage/health. A remote analytics backend also remains prohibited pending the separate privacy/data-retention Decision Gate.

### Candidate selection

1. **Local stage-by-stage run analysis** — impact 5 / goal alignment 5 / novelty 4 / confidence 5 / safety 5. Gives immediate evidence on why a run failed while staying inside the approved local-only privacy boundary.
2. **Stage-select / Ronin practice mode** — impact 5 / goal alignment 5 / novelty 5 / confidence 3 / safety 3. Useful, but it touches campaign/mastery/progression semantics and is a larger integration surface.
3. **Timing-assist accessibility mode** — impact 4 / goal alignment 4 / novelty 4 / confidence 4 / safety 3. Helpful, but changes difficulty/scoring semantics and could mask the still-unmeasured Stage 2 balance issue.

Chosen slice: candidate 1.

### Delivered slice

- Added a bounded `src/run-analysis.js` observer that keeps per-stage run statistics in memory using the existing CombatEngine event stream; it does not modify combat resolution.
- Tracks parry attempts/success, Perfect Parries, manual counter openings/counters, unused openings, STEP attempts/success/Perfect STEP, hits/damage, damage dealt and stage-clear state.
- On defeat the analysis focuses the last reached stage; on victory it chooses the weakest stage from the run. It then emits one concrete coaching tip, such as waiting for Ronin's final blade path, using a missed counter opening, avoiding STEP against tracking attacks, or using opposite-direction counter damage.
- The result modal now shows compact per-stage cards (`格擋`, `受擊`, `反擊`, `STEP`) plus the single coaching tip. The live combat HUD remains unchanged and uncluttered.
- The analysis is ephemeral and local-only: no backend, fetch/XHR, identifier, raw touch position, device fingerprint or persistent gameplay log is introduced. The separate remote-telemetry Decision Gate remains unapproved and unchanged.

### Verification / regression boundaries

- Added focused Node tests for stage-local accounting, Ronin low-accuracy diagnosis, unused counter-opening detection and STEP outcomes.
- Extended the existing mastery browser harness rather than adding another broad browser suite: it requires the run-analysis observer/result panel to render through the real patched CombatEngine victory flow and keeps the complete result/restart flow inside 320×568.
- Existing mastery personal-best and blocked-localStorage checks remain in the same harness; run analysis itself does not use localStorage.
- No Ronin timing/damage/HP/posture, combat input, parry/STEP window, boss logic, mastery scoring, renderer/asset pipeline, network/privacy boundary or merge authority changed.
- Physical-iPhone acceptance remains the next evidence gate: retry Stage 2, then use the new Stage 2 card/tip together with feel/readability observations before any balance change.

### Next candidates

- Same-device Stage 2 Ronin re-check using the new local stage analysis; tune only if the difficulty wall remains after the rules are understood.
- Same-device enemy blade + first-person grip + Perfect Parry/Perfect STEP readability/performance check.
- Privacy Decision Gate for anonymous backend telemetry only if local analysis proves the signals are worth collecting remotely.

## Run 037 — Manual-counter coaching metric repair

**Date:** 2026-08-28  
**Action type:** BLOCKER_FIX  
**Goal:** Repair the current-head P2 where automatic Perfect Parry / Perfect STEP riposte damage could inflate the local run-analysis average used to judge manual swipe-counter quality.

### Preflight / evidence

- Exact previous HEAD `813f67082d5563386007590b1a4ca27f1f4b6886`: CI #65 / run `33133357066` = success; exact-head GitHub `Vercel` commit status = success.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; no inline review threads existed.
- The exact-head All Repos review identified one actionable P2: `damageDealt` includes automatic ripostes while `counters` counts only manual swipes, so `damageDealt / counters` could make a 1-damage manual counter appear strong and suppress the intended opposite-direction swipe coaching.
- Earlier review findings are demonstrably addressed by later reviewed heads. No additional current-head P0/P1 or material deployment/runtime blocker was found.
- Remote gameplay telemetry remains outside the approved privacy boundary and was not implemented.

### Delivered repair

- Added stage-local `counterDamage` as a manual-only metric while retaining `damageDealt` as total player damage for general analysis.
- Only real `counter` events add to `counterDamage`; Perfect Parry and Perfect STEP automatic ripostes continue to contribute only to total `damageDealt`.
- Opposite-direction swipe coaching now computes average counter damage from `counterDamage / counters`, so free/automatic ripostes cannot hide weak manual swipe direction.
- Player-facing analysis cards and live combat remain unchanged; this is a correctness repair to the advice selection behind the existing result screen.

### Verification / regression boundaries

- Extended focused run-analysis coverage with a mixed-damage case: one 1-damage manual counter plus two automatic ripostes must retain total damage 3, manual `counterDamage` 1, and still select the opposite-direction swipe coaching.
- Existing stage-local, Ronin-reading, missed-opening, STEP and browser result-panel coverage remains unchanged.
- No combat timing, damage, score, parry/STEP window, input, boss logic, mastery result, renderer/asset pipeline, persistence/network/privacy boundary or Ronin balance value changed.
- Post-commit CI/Preview remain pending self-verification by protocol; the Draft PR run comment will carry the exact commit SHA and verification receipt.

### Next candidates

- Same-device Stage 2 Ronin re-check using the corrected local stage analysis; tune only if the difficulty wall remains after the rules are understood.
- Same-device enemy blade + first-person grip + Perfect Parry/Perfect STEP readability/performance check.
- Privacy Decision Gate for anonymous backend telemetry only if local analysis proves the signals are worth collecting remotely.

## Run 038 — Legal counter-opening denominator repair

**Date:** 2026-08-28  
**Action type:** BLOCKER_FIX  
**Goal:** Repair the current-head P2 where automatic Perfect Parry / Perfect STEP damage could close a recovery through Blood Moon or defeat while the result card still counted a manual counter opportunity that never legally existed.

### Preflight / evidence

- Exact previous HEAD `a3a1a4a9d3a35ffb2a0b05910d28505824fb71bc`: CI #66 / run `33136005197` = success; exact-head GitHub `Vercel` commit status = success.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; no inline review threads existed.
- The exact-head Second Hourly review identified one actionable P2: `counterOpenings` was incremented before an automatic riposte could trigger `boss-phase` / `enemy-defeated`, so the visible `反擊 x/y` denominator could include an impossible swipe follow-up.
- Earlier current-head counter-damage coaching repair remains correct; no P0/P1, runtime, deployment, privacy or combat-authority blocker was found.
- Remote gameplay telemetry remains outside the approved privacy boundary and was not implemented.

### Delivered repair

- Counter openings remain provisional while a manual swipe is pending. If `boss-phase` or `enemy-defeated` closes that recovery before a manual counter is accepted, the analysis removes that provisional opening from the denominator.
- A real manual counter still closes its pending opening first, so a manual counter that itself triggers Blood Moon or defeat remains correctly counted.
- Normal Perfect Parry / Perfect STEP recoveries that stay open remain counted exactly as before.
- The result card therefore reports only legally available manual swipe opportunities rather than suggesting the player missed an action the combat engine had already closed.

### Verification / regression boundaries

- Added focused run-analysis regression coverage for both closure routes: Perfect Parry → Blood Moon and Perfect STEP → defeat must each leave `counterOpenings` at zero when no manual swipe can be accepted.
- The test also checks the stage-row view model used by the visible `反擊 x/y` result line, so its denominator follows the corrected legal-opening count.
- Existing Ronin-reading, missed-opening, STEP and manual-counter-damage tests remain intact.
- No combat timing, damage, score, parry/STEP window, input, boss phase logic, mastery score, renderer, persistence/network/privacy boundary or Ronin balance value changed.
- Post-commit CI/Preview remain pending self-verification by protocol; the Draft PR run comment will carry the exact commit SHA and verification receipt.

### Next candidates

- Same-device Stage 2 Ronin re-check using the corrected local stage analysis; tune only if the difficulty wall remains after the rules are understood.
- Same-device enemy blade + first-person grip + Perfect Parry/Perfect STEP readability/performance check.
- Privacy Decision Gate for anonymous backend telemetry only if local analysis proves the signals are worth collecting remotely.

## Run 039 — Repeatable Stage 2 Ronin practice duel

**Date:** 2026-08-28  
**Action type:** FEATURE  
**Goal:** Make the reported Stage 2 difficulty wall directly testable on phone without prematurely nerfing the Ronin or adding remote gameplay tracking.

### Preflight / evidence

- Exact previous HEAD `8bee62d0992b4d4a1d438483fc58f2434772226b`: CI #67 / run `33139545846` = success; exact-head GitHub `Vercel` commit status = success.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; the review-thread list was empty.
- The exact-head All Repos review reported **no new actionable P0/P1/P2 finding** and confirmed the Run 038 counter-opening repair.
- Owner evidence still says Stage 2 is difficult. Runs 030 and 036–038 improved learnability and local diagnosis, but the current SOT deliberately requires more same-device evidence before changing Ronin timing/damage/health.
- Remote gameplay telemetry remains outside the approved privacy boundary and was not implemented.

### Candidate selection

1. **Repeatable Stage 2 Ronin practice duel** — impact 5 / goal alignment 5 / novelty 5 / confidence 5 / safety 4. Directly enables repeated evidence on the reported difficulty wall using the real Stage 2 combat and existing local analysis, while leaving campaign balance untouched.
2. **Timing-assist accessibility mode** — 4 / 4 / 4 / 4 / 3. Valuable, but changes difficulty/scoring semantics before the current difficulty signal is understood.
3. **Challenge/endless mode** — 4 / 5 / 5 / 3 / 3. Strong replay value, but a wider progression/scoring surface and less directly tied to the current owner feedback.

Chosen slice: candidate 1.

### Delivered slice

- Added a compact **第二關練習** start-screen entry that launches the real Wandering Ronin directly, including its current feints, timing, reach/STEP profiles, posture rules and Stage 2 action cue.
- Practice uses the existing composed CombatEngine/adapters rather than a second combat implementation. It starts at Stage 2, and defeating the Ronin ends the practice result instead of advancing to Oni Guard.
- The existing local mastery and per-stage battle analysis render on practice victory/defeat, so repeated attempts expose Ronin parry accuracy, missed counter openings, STEP use and incoming hits.
- Practice results are explicitly labelled `RONIN PRACTICE` / `不計個人最佳` and cannot read or overwrite the campaign personal-best record.
- Practice result actions offer **再練浪人** and **開始完整主線**. A normal start/restart remains the unchanged four-duel campaign path.
- No Ronin timing/damage/HP/posture/score value, remote analytics, identifier, network request, account system or storage schema was added.

### Verification / regression boundaries

- Added focused Node coverage proving practice initializes the actual Stage 2 Ronin and that its stage-clear terminates at victory without advancing the campaign enemy index.
- Extended the existing mastery browser harness rather than creating a parallel broad suite: it requires a real practice Stage 2 event, Stage 2/Ronin result analysis, `RONIN PRACTICE` copy, `不計個人最佳`, and preservation of the existing campaign best.
- The real-app browser smoke now requires the practice module and start-screen entry to initialize alongside PlayCanvas, mastery, boss, onboarding, footwork and impact integrations.
- Default campaign engine order, boss injection, directional input, parry/STEP timing, damage, score, renderer/asset pipeline, local analysis privacy boundary and merge authority remain unchanged.
- Physical-iPhone acceptance remains the next product gate: use several practice attempts to judge whether the difficulty wall is final-direction reading, missed counter conversion, raw timing pressure or presentation/readability before tuning Stage 2.

### Next candidates

- Repeat the new Ronin practice on the same physical iPhone and use its local Stage 2 card plus feel observations before any balance change.
- Re-check enemy blade trajectory, first-person grip and Perfect Parry/Perfect STEP readability/performance on the same device.
- Open a privacy Decision Gate for anonymous backend telemetry only if repeated local practice proves remote aggregation is worth the added privacy/backend cost.

## Run 040 — Ronin practice player-control verification repair

**Date:** 2026-08-28  
**Action type:** BLOCKER_FIX  
**Goal:** Close the current-head P2 where the Stage 2 practice feature was green in CI without exercising its actual player-facing entry/retry/campaign controls or the production short-phone start layout.

### Preflight / evidence

- Exact previous HEAD `666cc292424fb91622de7cb6167a7c70f4f00045`: CI #68 / run `33142305909` = success; exact-head GitHub `Vercel` commit status = success.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; inline review-thread list was empty.
- The exact-head All Repos review identified one actionable P2: Node/mastery coverage invoked practice programmatically, while the real user-facing **第二關練習 / 再練浪人 / 開始完整主線** control path and `data-practice-start-layout` result were not fail-closed in browser CI.
- This P2 is treated as blocking because it covers the primary playability seam of the just-delivered practice vertical slice; feature work remains prohibited until that seam is executable in the browser gate.

### Delivered repair

- Extended the existing mastery browser harness rather than adding a parallel suite. It now creates the same start/restart surfaces used by the production practice adapter and attaches the main-like CombatEngine start/reset listeners after the practice module, preserving the real listener ordering.
- The harness clicks **第二關練習** and requires the patched CombatEngine to enter the real Wandering Ronin at Stage 2 with a practice `stage-start` event.
- After a terminal practice result, it clicks **再練浪人** and proves another Stage 2 practice starts, then completes again and clicks **開始完整主線** to prove the engine returns to Stage 1 campaign mode.
- The real production-page browser smoke now also requires `data-practice-start-layout="pass"` at 320×568, protecting the actual start-screen composition rather than only a minimal harness layout.
- Production gameplay code, Ronin balance, persistence and privacy behavior are unchanged.

### Verification / regression boundaries

- Before this repair, exact-head Node + browser CI and Vercel were terminal green; the gap was review-discovered verification coverage, not an observed gameplay regression.
- The repaired gate now fails if practice-entry listener ordering, retry mode retention, campaign handoff, personal-best isolation/result analysis, or the production 320×568 start layout regresses.
- No combat timing/damage/input, boss, renderer/asset, storage schema, network/analytics, account, secret or merge-authority behavior changed.
- Post-commit CI/Preview remain pending self-verification by protocol; the PR run comment will carry the exact new SHA and terminal verification receipt.

### Next candidates

- Repeat Stage 2 practice on the same physical iPhone and use local analysis plus feel before changing any Ronin balance value.
- Re-check enemy blade trajectory, first-person grip and Perfect Parry/Perfect STEP readability/performance on the same device.
- Open a privacy Decision Gate for anonymous backend telemetry only if repeated local practice proves remote aggregation is worth the added privacy/backend cost.

## Run 041 — Optional high-contrast blade-read accessibility mode

**Date:** 2026-08-28  
**Action type:** FEATURE  
**Goal:** Improve mobile directional readability for players who need stronger visual guidance without nerfing Ronin, changing combat timing, or covering the centre blade-reading view with more instructional text.

### Preflight / evidence

- Exact previous HEAD `654af846c3d1052f3806b54c61ce8a02a4cdbb2d`: CI #69 / run `33144757190` = success; exact-head GitHub `Vercel` commit status = success.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; inline review-thread list was empty.
- The exact-head Second Hourly review reported **no actionable P0/P1/P2 finding** and confirmed the Run 040 practice-control repair.
- The highest-priority Ronin balance item still requires repeated physical-phone evidence before changing timing/HP/damage. The backlog already identifies accessibility as a high-value candidate, while remote gameplay telemetry remains behind an unapproved privacy Decision Gate.

### Candidate selection

1. **Optional high-contrast blade-read mode** — impact 4 / goal alignment 5 / novelty 4 / confidence 5 / safety 5. Strengthens the core “read the opponent” interaction on phone while remaining presentation-only and default-off.
2. **Challenge/endless mode** — impact 5 / goal alignment 5 / novelty 5 / confidence 3 / safety 2. Strong replay value but much wider progression/scoring risk in one run.
3. **Crimson Shogun signature motion/phase refinement** — impact 4 / goal alignment 5 / novelty 4 / confidence 3 / safety 3. Valuable, but more dependent on physical-phone visual/performance acceptance than a bounded accessibility adapter.

Chosen slice: candidate 1.

### Delivered slice

- Added an opt-in **刀路清晰** start-screen accessibility toggle. Default remains off; the setting stores only a local on/off preference and storage failure is non-fatal.
- Added four reusable, pointer-transparent edge rails. During telegraph they mirror the currently displayed blade direction; when Ronin feints, the active rail moves to the final direction; during the actual strike the same rail switches to a stronger high-contrast danger state.
- Successful parry, incoming hit and stage/terminal transitions clear the cue immediately. A wrong-direction parry attempt does not hide the still-live correct strike direction.
- Reduced-motion preference keeps the static high-contrast rail but removes strike pulsing.
- The feature is presentation-only: no parry/Perfect timing, damage, reach, STEP, posture, score, enemy AI, campaign/practice progression, remote analytics or renderer authority changed.

### Verification / regression boundaries

- Added one focused 320×568 browser harness using the real CombatEngine event stream: stage intro → actual Ashigaru telegraph → actual strike → successful directional parry. It requires toggle activation, correct top-direction flow, stronger strike state, parry cleanup, exactly four reused rails and `pointer-events:none`.
- The production real-app smoke now fails closed unless the accessibility module/toggle initializes and the top-left control remains inside the 320×568 viewport.
- Existing Node and browser gates continue to protect campaign/practice progression, directional parry/swipe, STEP/Perfect STEP, boss, mastery/run analysis, PlayCanvas/skinned rendering and reduced-motion impact behavior.
- No remote network/storage schema, account, secret, downloaded asset or merge-authority change is introduced.
- Post-commit CI/Preview remain pending self-verification by protocol; the Draft PR run comment will carry the exact commit SHA and verification receipt.

### Next candidates

- Repeat Stage 2 practice on the same physical iPhone and use local analysis plus feel before changing any Ronin balance value.
- Re-check enemy blade trajectory, first-person grip, Perfect Parry/Perfect STEP and the optional blade-read mode together for readability/performance on the same device.
- After physical-phone core acceptance, consider one bounded challenge-mode or boss-refinement slice; keep remote gameplay telemetry behind its separate privacy Decision Gate.

## Run 042 — Direct Crimson Shogun practice duel

**Date:** 2026-08-28  
**Action type:** FEATURE  
**Goal:** Make the current boss pressure and Blood Moon feel directly repeatable on phone, using the real Stage 4 encounter, without changing balance or forcing the player through the first three duels for each acceptance attempt.

### Preflight / evidence

- Exact previous HEAD `ba0874d93bec3f0d47eb57fdf26a19900ea546d1`: CI run `33148093063` = success; exact-head GitHub `Vercel` commit status = success and Preview = Ready.
- Draft PR #1 remained open, Draft and unmerged; `main` remained untouched; the inline review-thread list was empty.
- The latest same-head review reported **no new actionable P0–P2 finding**. Earlier review findings are fixed by later heads and no baseline regression, runtime blocker or deployment blocker was present.
- The current backlog still prioritizes physical-phone acceptance before boss balance/signature-motion changes. Stage 2 already has a proven bounded practice seam, making a real Stage 4 practice route a lower-risk way to gather boss evidence than changing combat values.
- Remote gameplay telemetry remains outside the approved privacy boundary and was not implemented.

### Candidate selection

1. **Direct Crimson Shogun practice** — impact 4 / goal alignment 5 / novelty 3 / confidence 5 / safety 5 = 22. Reuses the proven practice boundary, gives immediate access to the real boss/Phase II loop, and changes no combat authority.
2. **Timing-assist accessibility mode** — 4 / 4 / 4 / 3 / 3 = 18. Useful, but it alters timing/difficulty semantics before current physical acceptance is complete.
3. **Challenge/endless mode** — 5 / 5 / 5 / 2 / 2 = 19. Strong replay value but substantially wider progression/scoring risk for a one-commit run.

Chosen slice: candidate 1.

### Delivered slice

- Generalized the existing bounded practice adapter so an explicit practice request can target the current Wandering Ronin or the already-installed Crimson Shogun without creating a second combat implementation.
- Replaced the single practice action with one compact two-button row: **練浪人** (Stage 2 · feints) and **練將軍** (Stage 4 · Blood Moon). The row is checked as part of the production 320×568 start layout.
- Shogun practice starts the real current Stage 4 Phase I definition after the normal boss adapter initializes; the same 12 HP, Blood Moon threshold, Phase II attack set, damage, reach, posture and feedback remain authoritative.
- A Shogun practice result ends after that boss duel, labels mastery as `SHOGUN PRACTICE`, offers **再戰將軍** or **開始完整主線**, and reuses the same local Stage 4 run analysis.
- Ronin practice keeps its existing `RONIN PRACTICE` / **再練浪人** behavior. All practice runs remain excluded from campaign personal-best reads/writes.
- Normal **拔刀** start/restart remains the four-stage campaign; no timing, damage, HP, score, input, renderer, account, network or analytics behavior changed.

### Verification / regression boundaries

- Added focused Node coverage proving the direct boss target is the real Stage 4 Phase I definition and that a bounded Stage 4 practice clear terminates without campaign advancement.
- Extended the existing mastery browser harness to click **練浪人** and **練將軍**, prove each enters the correct real stage, prove selected-duel retry, prove **開始完整主線** returns to Stage 1, and require distinct practice labels/Stage 2 or Stage 4 analysis while preserving the campaign personal best.
- Extended the real-app browser smoke to fail closed unless both practice entries initialize and the combined selector remains inside 320×568. Existing boss browser coverage remains authoritative for the actual Blood Moon Phase II transition/restart/victory rules.
- Local syntax checks passed for the modified practice/mastery/browser-smoke scripts before commit construction. The required exact-head CI and Vercel Preview are pending self-verification by protocol after the single implementation commit.
- No boss balance, Ronin balance, parry/STEP timing, damage, input mapping, renderer/asset pipeline, network/privacy boundary or merge authority changed.

### Next candidates

- Use both direct practice routes on the same physical iPhone and compare Ronin reading vs Shogun Phase II pressure before changing balance.
- Re-check enemy blade trajectories, the first-person two-hand grip, Perfect Parry/Perfect STEP and optional blade-read mode during the repeated duels.
- After physical-phone core acceptance, consider one bounded challenge-mode or boss signature-motion refinement; keep remote telemetry behind the separate privacy Decision Gate.
