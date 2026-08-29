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
- The remaining owner P1 was still applicable: opponent LEFT/RIGHT looked reversed from the player perspective and the initial/neutral katana did not point the blade tip toward the player. Repository state explicitly prohibited feature work until both were repaired with deterministic geometry evidence.

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
