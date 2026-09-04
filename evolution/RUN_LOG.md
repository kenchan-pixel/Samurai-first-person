# Evolution Run Log

This log is intentionally concise. Full diffs, exact SHAs, CI receipts and Preview links remain in Git history and Draft PR #1. Historical long-form entries are compacted after acceptance; no product rule is removed from `docs/CURRENT_BASELINE.md` or `docs/REGRESSION_CHECKLIST.md`.

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

## Runs 043–064 — Combat UX, animation repair and timing assist

- Runs 043–051: mobile Combat UX simplification, true Pause clock, production-browser hardening, Shogun signature motion and top-right Pause restoration.
- Run 052 rejected after physical-phone evidence exposed collapsed body/arm/blade hierarchy; Run 053 restored the usable animation baseline; Run 054 removed mistaken mandatory-human-test HOLD semantics.
- Runs 055–061: authored AttackTop/Right/Bottom/Left, continuous Attack* playback, fixed HandR/Sword hierarchy, lateral-read repair, same-draw pose evaluation and bounded forward commitment.
- Runs 062–064: optional 節拍提示 plus disabled-path DOM-idle and deterministic browser-harness repair.

## Runs 065–100 — Blade semantics, delivery recovery, handedness, challenge, dojo and owner repairs

- Runs 065–069: player-facing Guard/directional cut semantics, semantic SOT smoke, actual-Sword afterimages and reduced-motion cleanup.
- Runs 070–074: bounded Vercel recovery, architecture reconciliation, persistent STEP handedness, safe-area repair and 320×568 coverage.
- Runs 075–089: eight-duel challenge, 氣勢/不屈, 今日陣, tactical choice, 宿敵步速, Oni/Blood Moon practice and 師範弱點再練.
- Runs 090–093: production practice orchestration, 四向防守 and normal-practice capture repair.
- Runs 094–098: heavy-attack presentation/acceptance, exact-head build receipt recovery, Bottom/STEP repair and bounded 60–110 ms near-contact normal-parry buffer.
- Run 099: connected authored Top/Bottom vertical katana choreography with fixed Sword→HandR grip.
- Run 100: explicit local result 分享 through Web Share/clipboard with no account, persistence, analytics or background network request.

## Runs 101–119 — Closed Beta readiness and combat-read refinement

- Runs 101–107: session-only 修行進度, DOM ownership repair, local/export-only feedback, 封測資訊, local records, storage-denied startup and weak-direction repeat coaching.
- Runs 108–112: session-only 封測 0/3 progress, terminal/bootstrap/DOM ownership repairs and challenge/今日陣 戰策回顧 with cumulative 320×568 acceptance.
- Run 113: presentation-only measured / standard / quick / heavy attack-tempo readability from unchanged authoritative timing; exact-head CI/Vercel passed.
- Runs 114–118: replaced abrupt Ronin mid-telegraph hard cuts with a bounded 50 ms authored full-rig crossfade, then repaired stale/contaminated real-renderer acceptance without relaxing blade/grip/travel thresholds or changing combat timing.
- Run 119: added separate transient Perfect Parry `破` / Perfect STEP `閃` identities; exact-head CI/Vercel and same-head review passed.

## Runs 120–126 — Direction-aware first-person grip and acceptance hardening

- Run 120 added a bounded four-direction first-person two-hand support brace layered on the authoritative katana action path.
- Runs 121–122 added then isolated a dedicated real 320×568 PlayCanvas player-grip browser process, enforcing bounded support transforms, hand spacing, pommel→habaki hand-axis attachment, support/handle/blade viewport intersection, projected blade extension and neutral return.
- Runs 123–124 repaired concrete TOP parry and BOTTOM-counter portrait framing by moving the complete `PlayerSwordRig`, preserving blade/handle/support attachment.
- Runs 125–126 investigated BOTTOM-counter support/blade occlusion and hardened the Boss browser timing harness; those support-only counter experiments were superseded by Run 127's authoritative blade-path correction.

## Runs 127–132 — Portrait grip blocker sequence

- Run 127 corrected the authoritative BOTTOM counter from the generic `+92°` sweep to a BOTTOM-specific `-92°` rising cut.
- Run 128 added bounded complete-rig portrait framing for RIGHT parry after the 320×568 gate exposed an off-screen player blade.
- Run 129 added BOTTOM normal/Perfect whole-rig `-0.52/+0.10` portrait framing and a bounded roll so support, handle and blade re-entered the viewport.
- Run 130 refined only the BOTTOM whole-rig roll to `-26°` (~77° peak), preserving all existing combat and 24 px blade-extension thresholds.
- Run 131 added a pulse-shaped `-0.10` local-X tuck to the dominant/right forearm, hand and cuff only, leaving the blade and left support untouched; exact-head Node acceptance exposed a non-zero `Math.sin(Math.PI)` endpoint residue.
- Run 132 made action endpoints exactly neutral by returning a zero player-support pulse at `p <= 0` / `p >= 1`. Exact HEAD `1105daf4277239770606692c985f0ed5fe91505c` passes **146/146 Node tests** and the broad browser smoke, but Actions CI #178 / run `33921404599` still fails the unchanged dedicated 320×568 normal-BOTTOM blade-read gate because the support silhouette obscures the required **>24 px** projected blade extension. Exact-head Vercel is successful.

## Run 133 — Clear the BOTTOM parry blade lane with a relative forearm brace

**Date:** 2026-09-05  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `1105daf4277239770606692c985f0ed5fe91505c`.
- Exact-head Actions CI #178 / run `33921404599` is terminal **failure** after `npm test` passes 146/146 and broad browser smoke succeeds; the dedicated true-320×568 player-grip process fails at normal BOTTOM Parry because support geometry still obscures the unchanged >24 px blade-extension contract. Exact-head GitHub `Vercel` status is terminal **success** and Preview feedback reports zero unresolved items.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, and inline review threads are empty. The latest same-head All Repos review identifies this one actionable P1 and no additional P0/P1/P2.
- Feature work is prohibited. The repair must preserve BOTTOM direction semantics, pommel→habaki attachment, support/handle/blade viewport intersection, the >24 px blade-read threshold, exact neutral return and all combat timing/input/damage/Perfect/STEP rules.

### Blocker repair

- Stopped relying on further complete-rig roll/framing changes. The accepted BOTTOM `-0.52/+0.10` framing and `-26°` whole-rig roll remain unchanged.
- Strengthened only the dominant/right BOTTOM-parry support tuck from `-0.10` to `-0.14` local X so the hand/cuff/forearm stay near the handle but sit farther out of the blade lane.
- Added a pulse-shaped BOTTOM-only `+28°` local roll to the long right forearm. At peak normal BOTTOM parry that changes the forearm's local Z rotation from about `-30°` to about `-2°`, making the forearm splay across the grip instead of projecting vertically through the blade while the actual katana and left support remain untouched.
- Focused pose coverage now pins both the stronger dominant-support tuck and the BOTTOM forearm splay, while retaining exact endpoint-neutral, transform-bound and existing framing assertions. No acceptance threshold is reduced.

### Verification boundary

- Exact-head post-commit GitHub Actions `npm test` + complete `npm run test:browser` are required. The unchanged dedicated 320×568 player-grip gate must clear normal and Perfect BOTTOM support/handle/blade visibility, >24 px blade extension, hand-axis attachment, all four directions, BOTTOM rising counter and exact neutral return.
- Exact-head Vercel success is also required. The one-commit rule prohibits a second bookkeeping commit; the Draft-PR run comment is the authoritative post-commit verification receipt.
