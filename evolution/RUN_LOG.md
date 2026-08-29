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

## Runs 055–061 — Authored four-direction attack pipeline

- Run 055 added original animation-only AttackTop/Right/Bottom/Left on the shared rig.
- Run 056 fixed a floating-point false failure and generic phase transitions interrupting one continuous Attack*.
- Run 057 made authored HandR/Sword hierarchy authoritative; browser gate exposed weak side separation.
- Run 058 strengthened mirrored side-guard targets without weakening grip/trajectory thresholds.
- Run 059 removed Attack*→Attack* telegraph crossfade; failure persisted, proving transition blending was not root cause.
- Run 060 fixed same-draw PlayCanvas pose evaluation; right/left side separation passed and a deeper top-strike depth issue surfaced.
- Run 061 added bounded whole-model forward-reach floor while preserving authored HandR/Sword orientation; exact-head CI/Vercel returned green.

## Runs 062–064 — Timing assist and verification hardening

- Run 062 FEATURE: added optional default-off 節拍提示 driven by authoritative telegraph and existing Perfect timing.
- Run 063 BLOCKER_FIX: made the default-off assist runtime-idle; Node passed but its new browser mutation regression suspended on a top-level RAF promise under the existing dump-dom runner.
- Run 064 BLOCKER_FIX: repaired that browser harness with synchronous layout readiness and focused timing-assist mutation observation. Exact-head CI #98 and Vercel were green. The owner LEFT/RIGHT + initial katana P1 remained explicitly open.

## Run 065 — Player-facing guard and screen-space slash semantics

**Date:** 2026-08-29  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `1364a052ca673f3eaaaa92bd1a178f8064737ac1`.
- Exact-head CI #98 was terminal green and GitHub `Vercel` status was success. Draft PR #1 remained open/Draft/unmerged and inline review threads were empty.
- The remaining owner P1 was still applicable: opponent LEFT/RIGHT looked reversed from the player perspective and the initial/neutral katana did not point its blade toward the player. Repository state explicitly prohibited feature work until both were repaired with deterministic geometry evidence.

### Delivered repair

- Added authored `Guard` to the local animation-only pack. Ready/stage-intro/gap use it and every Attack* starts/ends on the identical Guard target. The actual world blade axis targets `[0, 0.10, 0.995]` normalized, strongly toward the player/camera.
- Sword remains a direct child of HandR with one fixed local grip. Guard is authored by solving HandR inside the generated animation track; no normal runtime Sword rotation or Run-52-style Chest/arm/HandR override is introduced.
- Defined gameplay RIGHT/LEFT as **player-screen cut travel**. RIGHT starts on screen-left and cuts toward screen-right; LEFT starts screen-right and cuts toward screen-left. A presentation-only renderer adapter mirrors only enemy horizontal `attackDirectionIndex` 1↔3; player tap/swipe/parry/counter direction and CombatEngine values stay unchanged.
- Extended the production PlayCanvas contract to sample the actual ready Sword world axis and fail closed unless Guard faces the player. The same gate proves RIGHT/LEFT screen travel, grip lock, player-facing plane crossing and continuous authored attack state.
- Added focused generator/mapping tests and updated cumulative baseline, regression checklist, asset provenance, backlog, changelog and persistent state in the same implementation commit.

### Regression boundary

- No timing, damage, parry/Perfect windows, STEP, posture, boss phase, score, persistence or network/privacy rule changes.
- No downloaded asset/motion, analytics or backend.
- Normal telegraph→strike→recovery remains one authored Attack*; interrupted recovery remains Parry; bounded whole-model depth assist remains the only authored-mode reach correction.
- Post-commit exact-head Node/browser CI and GitHub Vercel status must both be terminal green before feature work resumes.

## Run 066 — Restore exact-head SOT verification path

**Date:** 2026-08-30  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `9de5fcf96139924a67d45e3cd0c6109f5b4a247e`.
- GitHub `Vercel` status was success, but exact-head CI #99 failed at `npm test`: 68/69 passed and `npm run test:browser` was skipped.
- The current Second Hourly review therefore remained a blocking P1: Run 65's player-facing Guard and player-screen RIGHT/LEFT repair had not reached the real PlayCanvas acceptance gate.
- Failure cause was deterministic SOT drift only: `tests/repo-smoke.test.mjs` still protects the cumulative four-duel and PlayCanvas renderer wording contract, while the compacted Current Baseline had removed those exact durable phrases.

### Delivered repair

- Restored the explicit cumulative sentence `Three baseline enemies are followed by the Crimson Shogun boss` while retaining the clearer four-sequential-duel description.
- Restored the durable `PlayCanvas Engine standalone ... primary production-facing renderer` wording without changing the approved PlayCanvas + Vite + WebGL2-fallback architecture.
- Did not weaken, remove or bypass `repo-smoke`; the intent is to let the unchanged Node gate complete so the existing real PlayCanvas Guard-axis / RIGHT-LEFT screen-travel browser contract can execute on this exact HEAD.

### Regression boundary

- No gameplay, renderer, animation, timing, damage, parry/Perfect, STEP, posture, boss, score, persistence, input, network/privacy or asset behaviour changed.
- This repair is complete only if the post-commit exact-head Node + browser workflow is green and GitHub `Vercel` status is terminal success; otherwise the next run remains BLOCKER_FIX.

## Run 067 — Make SOT smoke semantic instead of sentence-literal

**Date:** 2026-08-30  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `4ad06968b28e96eb06e93bfc606ad342db766ddd`.
- Exact-head CI #100 was terminal green: `npm test` and `npm run test:browser` both passed. GitHub `Vercel` commit status was `success`; Draft PR #1 remained open/Draft/unmerged and inline review threads were empty.
- The Run 65 owner P1 is demonstrably cleared on this HEAD by the fail-closed real PlayCanvas Guard-axis and player-screen RIGHT/LEFT travel gates.
- The current All Repos review raised an actionable P2: `repo-smoke` was coupled to exact editorial sentences, and Run 66 had duplicated baseline prose solely to satisfy that literal contract. Because this defect can deterministically turn harmless SOT edits into red CI and consume future evolution runs, it is treated as a delivery-loop blocker repair before feature work.

### Delivered repair

- Reworked `tests/repo-smoke.test.mjs` to extract the relevant Current Baseline sections and assert independent semantic invariants instead of exact sentences.
- The playable-flow guard now requires four sequential duels plus Ashigaru, Wandering Ronin, Oni Guard and Crimson Shogun within the playable-flow section.
- The renderer guard now requires PlayCanvas, primary renderer authority, Vite, WebGL2 and fallback/compatibility semantics within the presentation section.
- Removed the duplicate four-duel sentence and restored concise renderer wording. The real runtime/browser gates — including Guard axis, screen-space RIGHT/LEFT travel, grip lock, directional plane crossing, mobile Combat UX and timing-assist lifecycle — are unchanged.

### Regression boundary

- No gameplay, renderer, animation, timing, damage, parry/Perfect, STEP, posture, boss, score, persistence, input, asset or network/privacy behaviour changed.
- The smoke remains fail-closed on the protected product/architecture semantics while allowing editorial prose changes that preserve those invariants.
- Post-commit exact-head Node/browser CI and GitHub Vercel status must both be terminal green before feature work resumes.
