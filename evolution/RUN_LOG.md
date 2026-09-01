# Evolution Run Log

This log is intentionally concise. Full diffs, exact SHAs, CI receipts and Preview links remain in Git history and Draft PR #1.

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

## Runs 065–069 — Player-facing blade semantics and actual-Sword afterimages

- Run 065 repaired the remaining owner animation P1 with an authored player-facing `Guard`, explicit player-screen RIGHT/LEFT cut travel and enemy-only horizontal mirroring.
- Runs 066–067 restored exact-head SOT verification after wording drift, then replaced brittle sentence-literal smoke with section-scoped semantic invariants.
- Run 068 added four pooled full-blade afterimages sampled only from the actual authored Sword transform, strengthening cut/follow-through readability without steering the weapon or changing combat.
- Run 069 made those afterimages respond immediately to live reduced-motion changes, clear stale history and remove the media-query listener on renderer teardown.

## Runs 070–074 — Delivery-loop recovery, architecture SOT and handedness

- Run 070 repaired a Vercel rate-limit deadlock by defining bounded external-provider recovery while keeping failed Preview as a feature blocker.
- Run 071 made that recovery one-shot per durable provider incident, preventing repeated bookkeeping commits if the same external limit recurs.
- Run 072 reconciled `docs/ARCHITECTURE.md` with the approved PlayCanvas + Vite primary renderer, deterministic CombatEngine authority and WebGL2 fallback.
- Run 073 added a persistent local STEP right/left-side preference that mirrors only the lower-corner footwork cluster.
- Run 074 repaired inherited centering transforms that clipped left-hand STEP UI and strengthened the real 320×568 production gate to prove left-side safe-area geometry, fixed swipe semantics and top-right Pause/parry routing.

## Run 075 — Eight-duel challenge trial

**Date:** 2026-09-01  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `45627fbfa86dd3050ce192dac9d49ccd7b80559c`.
- Exact-head CI #109 was terminal green (`npm test` + `npm run test:browser`) and GitHub's exact-head `Vercel` commit status was `success`. Draft PR #1 remained open/Draft/unmerged and `main` was untouched.
- The latest exact-head All Repos review reported no actionable P0/P1/P2 finding; inline review threads were empty and the cumulative baseline had no material regression blocker.
- Candidate score (impact / goal alignment / novelty / confidence / safety): eight-duel challenge 5/5/5/4/4 = 23; broader accessibility/motion control without a concrete gap 4/4/4/3/4 = 19; further normal-speed sword visual refinement without pixel-level Preview inspection 5/5/3/2/3 = 18. The bounded challenge won as the strongest complete player-visible slice.

### Delivered slice

- Added local **連戰試煉** as an explicit start-screen mode. It swaps in exactly eight duels only for the requested run: the unchanged baseline Ashigaru/Ronin/Oni open the ladder, Stages 4–7 reuse those existing definitions as pressure rematches with bounded HP/posture/timing changes, and Stage 8 uses the real Crimson Shogun Phase I definition so the existing Blood Moon authority remains intact.
- Player HP, score, deterministic combat rules, STEP/parry/counter semantics and renderer authority carry through the same CombatEngine progression path; no parallel combat clock or second engine was introduced.
- Challenge terminal UI exposes progress/best, **再戰連陣** and **開始完整主線**. Restart remains in challenge; campaign handoff restores the original roster before the existing boss adapter rebuilds the normal four-duel campaign.
- Mastery/run analysis still observes the same event stream but challenge results are visibly labelled and excluded from the campaign personal best. A separate local challenge best ranks waves cleared first, then win/score; storage failure remains non-fatal.
- Added focused challenge regressions for the bounded eight-stage roster, pressure-vs-baseline invariants, best-result ordering, terminal challenge tagging and roster restoration. The shared selector-row layout now makes the existing production 320×568 start-screen gate cumulative across practice plus challenge.

### Regression boundary

- No campaign/practice enemy definition, input direction, parry/Perfect/STEP window, damage, boss threshold, mastery scoring formula, renderer animation/geometry, remote data, account, analytics, paid API or asset provenance behaviour changed.
- The challenge is local-only and opt-in; normal **拔刀**, 練浪人 and 練將軍 remain the accepted baseline paths.
- Local checkout could not reach GitHub from this runtime, so new modules were syntax-checked and focused pure logic was reviewed locally; post-commit exact-head Node/browser CI plus GitHub Vercel status remain the required acceptance evidence before another feature run.

## Run 076 — Challenge browser acceptance hardening

**Date:** 2026-09-01  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `8a3ad09e7322e7d59a44880ad570bfd66f4b360c`.
- Exact-head CI #110 was terminal green (`npm test` + `npm run test:browser`) and GitHub's exact-head `Vercel` status was `success`. Direct Vercel deployment enumeration returned 403, so the GitHub `Vercel` commit status remained the authoritative deployment signal.
- Draft PR #1 remained open/Draft/unmerged, inline review threads were empty, and `main` was untouched.
- The latest exact-head All Repos review found one blocking P2: Run 075 did not exercise the real challenge entry/retry/campaign-handoff/result UI through a production browser path, leaving the eight-stage lifecycle, independent best storage and 320×568 terminal layout able to regress while CI stayed green.

### Repair

- Extended the existing mastery browser harness instead of creating a parallel suite. It now clicks the real **連戰試煉** control, proves the composed CombatEngine activates exactly eight stages, drives all eight stage-clear transitions to a real challenge victory, verifies eight run-analysis cards and separate challenge-best persistence without changing campaign best, then exercises **再戰連陣** and **開始完整主線** back to the normal four-stage campaign.
- Added explicit 320×568 bounds checks for the challenge result block, all eight analysis cards, retry control and campaign-handoff control.
- Tightened only the challenge result density on short phone viewports so the complete eight-stage analysis and both terminal actions remain inside the accepted portrait viewport. Combat timing, input, scoring and campaign/practice presentation are untouched.
- Updated the regression checklist so the real challenge control/terminal browser path is a cumulative delivery gate.

### Regression boundary

- No campaign/practice roster, parry/swipe/STEP direction, combat timing, reach, damage, boss threshold, mastery scoring formula, renderer animation/geometry, remote data, account, analytics, paid API or asset provenance behaviour changed.
- Challenge storage remains local-only and isolated from the campaign personal best.
- Local syntax checks passed for the changed module and browser harness; exact-head repository CI and Vercel Preview after this commit remain the acceptance evidence before feature work resumes.

## Run 077 — Challenge momentum / 不屈

**Date:** 2026-09-01  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `b9da687ddaf5ac58bb56f8c71e2dc9257b36becd`.
- Exact-head CI #112 was terminal green (`npm test` + `npm run test:browser`) and GitHub's exact-head `Vercel` commit status was `success`; the Preview was Ready at the persistent challenge branch URL.
- Draft PR #1 remained open/Draft/unmerged, inline review threads were empty and `main` was untouched. The latest exact-head All Repos review reported no actionable P0/P1/P2 finding and explicitly cleared the prior challenge-browser acceptance P2.
- Candidate score (impact / goal alignment / novelty / confidence / safety): challenge 氣勢/不屈 5/5/4/5/5 = 24; deterministic date/seed challenge variant 4/5/5/3/4 = 21; post-wave tactical choice 5/5/5/3/3 = 21. 氣勢/不屈 won because it adds visible endurance/replay decisions while staying inside the existing deterministic challenge adapter and current browser acceptance surface.

### Delivered slice

- Added `src/challenge-momentum.js` as a challenge-only adapter layered after the existing challenge roster/result adapter. Each hitless wave fills one of two **氣勢** marks; any real `player-hit` immediately breaks the chain.
- Two consecutive hitless clears trigger **不屈** and reset momentum. If the player is damaged it restores exactly 1 HP; at full HP the same trigger awards +300 challenge score, so clean play always earns a visible benefit without changing campaign scoring.
- Added a compact pointer-transparent live badge under the top HUD, changed the challenge entry subtitle to **八關 · 無傷聚氣**, and appends total 不屈 triggers to the terminal challenge progress strip. The badge is hidden outside challenge and at terminal.
- Added deterministic Node coverage for hit/reset/heal/full-health score/campaign isolation. Extended the existing real 320×568 mastery browser path to prove the visible badge stays in bounds/pointer-safe, one clean clear shows 1/2 momentum, the second clean clear restores 1 HP, all eight waves remain completable, terminal 不屈 count renders, retry resets momentum and campaign handoff hides the adapter.
- Updated Current Baseline, regression checklist, backlog and changelog to make the challenge-only ownership and cumulative acceptance contract explicit.

### Regression boundary

- No campaign/practice enemy roster, attack timing, parry/Perfect/STEP windows, direction mapping, reach, damage, posture, Blood Moon threshold, renderer animation/geometry, local campaign mastery formula, account/network/privacy or asset behaviour changed.
- Momentum state is run-local only. It adds no persistence key, listener loop, timer, remote call or second combat clock; the only gameplay mutations are the documented challenge wave-clear +1 HP / +300 score rewards.
- New JS and the modified browser module were syntax-checked locally. Exact-head repository CI and Vercel Preview after this single implementation commit remain the acceptance evidence before the next feature run.

## Run 078 — Real player-hit momentum regression hardening

**Date:** 2026-09-01  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `909720ca177d972460e2fc739f2910a6fb965ce5`.
- Exact-head CI #115 was terminal green and GitHub's exact-head `Vercel` commit status was `success`. Direct Vercel deployment enumeration returned 403, so the GitHub `Vercel` commit status remained the authoritative deployment signal.
- Draft PR #1 remained open/Draft/unmerged, `main` was untouched and inline review threads were empty.
- The latest exact-head All Repos review found one blocking P2: the documented rule that any real `player-hit` breaks challenge momentum was only covered by a pure `hitThisWave: true` resolver input. The installed/composed adapter never had to observe an actual CombatEngine-emitted `player-hit`, so the event hook could regress while CI stayed green.

### Repair

- Strengthened the existing challenge-momentum Node regression instead of adding another test harness. It now uses the installed challenge + momentum adapters on a real `CombatEngine`, clears one clean wave, advances into the next real stage, lets the next incoming strike resolve naturally into an actual `player-hit`, and verifies HP falls through the production engine event path.
- The same regression then proves the damaged wave cannot trigger 不屈, the following clean wave rebuilds only the first 1/2 momentum mark, and only the next consecutive clean wave triggers the expected +1 HP rally. Campaign mode remains isolated and cannot emit challenge rally rewards.
- Updated the regression checklist so the composed real-CombatEngine `player-hit` → chain break → clean-wave rebuild sequence is a durable `npm test` delivery gate.

### Regression boundary

- No production gameplay code changed. Challenge reward values, combat timing, damage, direction mapping, STEP/parry/Perfect rules, boss behavior, renderer, persistence, privacy/network boundaries and campaign/practice behavior are unchanged.
- This tests/SOT-only change qualifies as a blocker repair because it closes a current-head P2 against an explicit cumulative gameplay contract and restores the delivery gate's ability to catch a broken event-composition seam.
- Post-commit exact-head CI and Vercel Preview remain required before feature work can resume.

## Run 079 — Final-wave challenge score authority

**Date:** 2026-09-01  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `941a97373c80ed7a15cdc15cde1c6b39559c89bd`.
- Exact-head CI #116 was terminal green (`npm test` + `npm run test:browser`) and GitHub's exact-head `Vercel` commit status was `success`. Direct Vercel deployment enumeration still returned 403, so GitHub's `Vercel` status remained the authoritative deployment signal.
- Draft PR #1 remained open/Draft/unmerged, `main` was untouched and inline review threads were empty.
- The latest exact-head Second Hourly review found one blocking P2: when final `enemy-defeated` and `victory` are drained together, a full-health final-wave 不屈 can add +300 to the engine after challenge terminalization has already copied the older score, causing victory/result/challenge-best data to omit the legitimate reward.

### Repair

- Made challenge momentum rewrite terminal `score` from the post-reward authoritative `CombatEngine.score` after processing the final `enemy-defeated` in the same drain batch.
- Changed challenge terminal rendering to retain the terminal event reference until its microtask runs, so result rendering and the separate local challenge best consume the score corrected by the outer momentum adapter instead of an earlier primitive copy.
- Extracted the existing best-result write path as `persistChallengeResult()` for focused deterministic verification without adding a second persistence implementation.
- Added a composed eight-stage regression that reaches the final full-health 2/2 rally, proves the +300 appears in engine score and `victory.detail.score`, then persists the exact same score through the real challenge-best ranking/write helper.
- Updated the regression checklist so same-batch final rally/victory score authority is a cumulative delivery gate.

### Regression boundary

- No challenge reward amount, campaign/practice scoring, combat timing/damage/input, boss behavior, renderer, account/network/privacy or storage key changed.
- The fix only reconciles an already-earned challenge reward across the existing terminal event/result/best surfaces; it does not create a new scoring rule or persistence surface.
- Post-commit exact-head CI and Vercel Preview remain required before feature work can resume.

## Run 080 — Player-visible final challenge score authority

**Date:** 2026-09-01  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `9041b89f7d9586031e860fa542495d15fff923be`.
- Exact-head CI #117 was terminal green (`npm test` + `npm run test:browser`) and GitHub's exact-head `Vercel` commit status was `success`. The direct Vercel connector still enumerated no project for the known team, so GitHub's `Vercel` commit status remained the authoritative deployment signal.
- Draft PR #1 remained open/Draft/unmerged, `main` was untouched and inline review threads were empty.
- The latest exact-head Second Hourly review found one blocking P2: Run 079 corrected engine/victory/challenge-best score authority, but the inner mastery observer still froze the pre-rally primitive score before the outer challenge-momentum wrapper applied the final +300, then its microtask could overwrite the generic visible result score with that stale value.

### Repair

- Kept mastery event observation synchronous, but deferred terminal `finishMastery()` report construction into the existing render microtask and retained the terminal event reference. The report now reads `terminalEvent.detail.score` only after the composed outer challenge wrappers have finished mutating the authoritative terminal event.
- Strengthened the existing true-320×568 challenge browser lifecycle. Its Stage 8 already completes a full-health 2/2 rally; the gate now requires the final `challenge-rally` to be +300 and proves one identical authoritative score across `CombatEngine.score`, returned `victory.detail.score`, player-visible `#result-score` and stored challenge best.
- The existing eight-stage entry, analysis, retry/campaign handoff, momentum, best-isolation and short-phone layout gates remain cumulative.

### Regression boundary

- No challenge reward amount, mastery formula, campaign/practice scoring, combat timing/damage/input, boss behavior, renderer, storage key, account/network/privacy or asset behavior changed.
- The repair changes only terminal observation ordering so already-earned score cannot be overwritten by an earlier inner-observer snapshot.
- Post-commit exact-head CI and Vercel Preview remain required before feature work can resume.

## Run 081 — 今日陣 deterministic daily challenge

**Date:** 2026-09-01  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `23b68be583439b5deaebde40bc173260820592c4`.
- Exact-head CI #118 was terminal green (`npm test` + `npm run test:browser`) and GitHub's exact-head `Vercel` commit status was `success`. Direct Vercel project enumeration returned an empty project list for the known team, so GitHub's exact-head `Vercel` commit status remained the deployment signal.
- Draft PR #1 remained open/Draft/unmerged, `main` was untouched and inline review threads were empty. The latest exact-head All Repos review reported no actionable P0/P1/P2 finding and explicitly confirmed the Run 080 terminal-score repair.
- Candidate score (impact / goal alignment / novelty / confidence / safety): deterministic 今日陣 4/5/5/5/5 = 24; bounded post-wave tactical choice 5/5/5/3/3 = 21; further authored-cut visual refinement without a concrete defect 4/5/3/3/4 = 19. 今日陣 won because it adds replayable player-visible variation using only the already-stable challenge definitions and no new backend/persistence authority.

### Delivered slice

- Added explicit **今日陣** beside practice and 連戰試煉. It derives one player-local `YYYY-MM-DD` key at run start and reuses that key for retry, so the same date reproduces the same formation without an account or network request.
- Stages 1–3 remain the untouched Ashigaru/Ronin/Oni challenge opening and Stage 8 remains the real Crimson Shogun/Blood Moon. Stages 4–6 deterministically permute only the existing three pressure rematches; Stage 7 remains Ronin Master. Each pressure variant may cyclically rotate its existing attack array so its opening rhythm changes, but no attack object/value is rewritten.
- Added a compact pointer-transparent **今日陣 MM/DD · 今日刀序已鎖定** intro banner that clears at the first telegraph, plus 今日陣 pressure-stage titles and terminal date identity. The shared start selector becomes four columns without adding row height.
- 今日陣 composes inside the existing challenge adapter, therefore reuses the same eight-stage lifecycle, 氣勢/不屈, mastery/run analysis, retry/campaign handoff and existing local challenge best. It adds no persistence key, timer, analytics, remote identifier or second combat engine/clock.
- Added deterministic Node coverage for same-date roster/order, unchanged pressure-rule values using order-insensitive attack fingerprints, daily→standard challenge→campaign restoration and real Shogun final-stage authority. Existing production 320×568 start-layout smoke remains cumulative because it measures every `.practice-button` in the shared selector row.

### Regression boundary

- No campaign/practice definitions, standard challenge pressure values, attack timing/damage/reach/heavy flags, parry/Perfect/STEP windows, direction mapping, boss thresholds, challenge rewards/scoring, renderer animation/geometry, storage key, account/network/privacy or asset provenance behavior changed.
- The new outer daily roster remains mutable so the existing boss adapter can safely replace the final Shogun definition during Blood Moon; individual daily pressure definitions stay immutable.
- New JS/tests were syntax-checked before commit. Exact-head repository CI and GitHub Vercel Preview after this single implementation commit remain the required acceptance evidence before another feature run.

## Run 082 — 今日陣 browser lifecycle acceptance

**Date:** 2026-09-01  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `414392de5c06cc575b2416feb1bea88201c2a682`.
- Exact-head CI #119 was terminal green (`npm test` + `npm run test:browser`) and GitHub's exact-head `Vercel` commit status was `success`. The direct Vercel connector again enumerated an empty project list for the known team, so GitHub's exact-head `Vercel` status remained the deployment signal.
- Draft PR #1 remained open/Draft/unmerged, `main` was untouched and inline review threads were empty.
- The latest exact-head All Repos review found one blocking P2: 今日陣 had deterministic Node coverage and start-layout coverage, but CI never clicked the real 今日陣 control or proved its dated banner, eight-stage terminal identity, same-date retry, and clean campaign handoff through a browser lifecycle.

### Repair

- Added one focused true-`320×568` 今日陣 browser companion gate under the existing `npm run test:browser` delivery command. It uses the production challenge → daily → momentum adapters, clicks the real **今日陣** button and requires an eight-stage dated challenge plus pointer-safe in-viewport intro banner.
- The gate sends the first telegraph through the real composed `drainEvents()` wrapper and proves the banner clears, then drives the existing deterministic eight stage-clear transitions to terminal victory and requires the terminal event/progress strip to carry the same `YYYY-MM-DD` identity.
- **再戰連陣** must retain the same date key and an exact roster/attack-order signature. A terminal retry then exercises **開始完整主線** and proves daily/challenge state is cleared and the normal four-stage campaign is restored at Ashigaru Stage 1.
- Kept the existing broad mastery/challenge browser smoke unchanged and chained this narrowly scoped escaped-regression check after it; no production gameplay module was modified.

### Regression boundary

- No campaign/practice/challenge enemy value, attack timing/damage/reach, parry/Perfect/STEP rule, direction mapping, Blood Moon threshold, challenge reward/scoring, renderer, storage, account/network/privacy or asset behavior changed.
- The new browser companion exists only because a concrete current-head daily lifecycle gap escaped the existing harness; it does not create a second gameplay implementation or clock.
- New runner and harness modules passed local syntax checks. Repository checkout/network access was unavailable in the runtime, so exact-head CI plus the GitHub Vercel status after this single commit remain the required acceptance evidence before feature work resumes.

## Run 083 — Challenge post-wave tactical choice

**Date:** 2026-09-01  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `49f26f2af3f7249bf39c7ab27e3267baad4a302a`.
- Exact-head CI #120 was terminal green (`npm test` + `npm run test:browser`) and GitHub's exact-head `Vercel` commit status was `success`. Draft PR #1 remained open/Draft/unmerged, `main` was untouched and inline review comments were empty.
- The latest exact-head review reported no actionable P0/P1/P2 finding and explicitly confirmed the Run 082 今日陣 browser-lifecycle P2 was closed, so the delivery gate was clear for feature work.
- Candidate score (impact / goal alignment / novelty / confidence / safety): bounded post-wave tactical choice 5/5/5/4/4 = 23; challenge/今日陣 pressure tuning without a concrete defect 4/5/3/3/4 = 19; further authored-cut visual refinement without pixel-level Preview inspection 5/5/3/2/3 = 18. The tactical choice won because it adds meaningful player agency inside the already-stable local challenge seam without expanding the core combat rules or backend surface.

### Delivered slice

- Added `src/challenge-tactics.js` outside the existing challenge → daily → momentum adapters. Only after Waves 2, 4 and 6, `enemy-defeated` parks the current `stage-clear` transition until one one-tap choice is made; the original transition deadline is then restored so the same deterministic CombatEngine progression resumes.
- **整息** restores up to 1 HP with no score change. **血誓** trades exactly 1 HP for +350 challenge score and is disabled at 1 HP, so it can never directly defeat the player. These effects are challenge-only and compose after any same-wave 氣勢/不屈 reward.
- Added a centered phone-safe tactical card with current wave/HP/score and two ≥44 px choices. It owns pointer input only while the between-wave gate is open, hides before the next stage, resets on retry/campaign handoff, and changes the challenge start copy to **八關 · 聚氣＋抉擇**.
- Added deterministic resolver/installed-adapter Node coverage for checkpoint bounds, exact heal/risk values, last-HP safety, restored stage-clear timing and campaign isolation. Extended the existing focused 320×568 今日陣 browser companion instead of creating another harness: it now proves all three checkpoints park before advancement, renders both choices in bounds, exercises 血誓/整息 effects, completes the same eight-stage daily run, resets tactics on retry and keeps campaign clean.
- Updated Current Baseline, backlog, changelog, state and this run log in the same candidate implementation tree.

### Regression boundary

- No campaign/practice roster or balance, challenge enemy timing/HP/posture definitions, attack damage/reach, parry/Perfect/STEP windows, direction mapping, Blood Moon threshold, renderer animation/geometry, storage key, account/network/privacy, analytics, paid API or asset provenance behavior changed.
- The feature adds no inventory, economy, perk tree, persistence key, timer, remote request or second combat engine/clock. The only new gameplay mutations are the documented challenge-only +1 HP or -1 HP/+350 score between-wave choice.
- Local repository checkout was unavailable, but the new JS/test/runner and browser module script were syntax-checked before commit. Exact-head repository CI and GitHub Vercel Preview after this single implementation commit remain the required acceptance evidence before the next feature run.
