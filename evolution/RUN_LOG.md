# Evolution Run Log

This log is intentionally concise. Full diffs, exact SHAs, CI receipts and Preview links remain in Git history and Draft PR #1. Historical long-form entries are compacted after their acceptance; no product rule is removed from `docs/CURRENT_BASELINE.md` or `docs/REGRESSION_CHECKLIST.md`.

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

- Runs 043–051: mobile Combat UX simplification, true Pause clock, repeated exact-head production-browser hardening, Shogun signature motion and top-right Pause restoration.
- Run 052 rejected after physical-phone evidence exposed collapsed body/arm/blade hierarchy; Run 053 restored the pre-052 usable enemy-animation baseline; Run 054 removed mistaken mandatory-human-test HOLD semantics.
- Runs 055–061: authored AttackTop/Right/Bottom/Left, continuous Attack* playback, fixed HandR/Sword hierarchy, lateral-read repair, same-draw pose evaluation and bounded forward commitment.
- Runs 062–064: optional 節拍提示 plus disabled-path DOM-idle and deterministic browser-harness repair.

## Runs 065–089 — Blade semantics, delivery recovery, handedness, challenge and dojo

- Runs 065–069: player-facing Guard/directional cut semantics, semantic SOT smoke, actual-Sword afterimages and live reduced-motion cleanup.
- Runs 070–072: bounded one-shot Vercel capacity recovery and architecture SOT reconciliation with PlayCanvas + Vite primary and WebGL2 fallback.
- Runs 073–074: persistent STEP handedness, left-side clipping repair and true 320×568 production input gate.
- Runs 075–086: eight-duel 連戰試煉, momentum, 今日陣, tactical choice, rematch visual identity and per-wave split records with lifecycle/browser repairs.
- Runs 087–089: direct Oni/Blood Moon practice and 師範弱點再練 routing while preserving campaign best and combat authority.

## Runs 090–098 — Production acceptance and owner-feedback repairs

- Run 090 rejected when the production document gate proved the real 練血月 control could fail despite direct request-API tests; Run 091 repaired practice Start ownership and real Blood Moon launch/retry/campaign handoff at 320×568.
- Run 092 added local result-only 四向防守 analysis; Run 093 repaired normal practice capture under the Blood Moon adapter.
- Run 094 added presentation-only heavy-attack weighting. Run 095 repaired the exact-head Preview identity deadlock with a fail-closed `/build-meta.json` receipt while preserving CI/Vercel authority.
- Run 096 moved default STEP into the approved lower-right safe corner and proved Bottom/Left canvas input plus STEP pointer ownership at 320×568; exact-head CI/Vercel were green.
- Run 097 closed the heavy-attack P2 with a true 320×568 real-PlayCanvas Oni heavy sequence and normal-Ashigaru neutrality gate; exact-head CI/Vercel were green.
- Run 098 added the bounded 60–110 ms near-contact final-direction guard commitment. It resolves only at strike contact as a normal non-Perfect parry; early telegraph, unresolved feints and wrong directions remain rejected. Exact-head `547b99208eddd6c621660ca44fd5e21bbdfcac4a` passed CI #144 and Vercel.

## Run 099 — Top/Bottom authored katana choreography continuity

**Date:** 2026-09-03  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `547b99208eddd6c621660ca44fd5e21bbdfcac4a`.
- Exact-head GitHub Actions CI #144 / run `33762440431` is terminal **success**, and the exact-head GitHub `Vercel` status is terminal **success**.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, and inline review threads are empty. The current HEAD has no same-SHA automated review marker yet, but no unresolved P0/P1 or material P2 was found in the full PR discussion; Run 098's run receipt records the previous review as clean.
- Bottom/STEP ownership, real heavy-path acceptance and near-contact normal-parry tolerance are now closed, so the strongest remaining owner-feedback slice is the visibly weak Top/Bottom katana choreography.
- Candidate scoring: (1) Top/Bottom authored choreography continuity 24/25; (2) repeated Ronin/Oni/Shogun/Blood Moon practice evidence 20/25; (3) Closed Beta v0.5 SOT/release-prep reconciliation 18/25. Core combat feel remains ahead of release prep.

### Implementation

- Refined only the deterministic authored `AttackTop` and `AttackBottom` animation generator. Both keep the established six-keyframe timeline and shared Guard endpoints, but the connected hips/spine/chest/arms now use a bounded cross-body coil → contact → follow-through instead of reading as a mostly planar arm hinge.
- `AttackTop` now winds slightly across the body, commits through centre toward the player-facing contact plane, and finishes with a controlled opposite-side low follow-through. `AttackBottom` now loads from a lower off-centre stance and rises progressively through centre into a high follow-through; its hip rise is reduced from the old abrupt contact-height jump.
- The authored world blade axes were adjusted only enough to support those natural cross-body arcs. Top still starts overhead and cuts down; Bottom still starts low and rises. RIGHT/LEFT clips are byte-for-byte source-equivalent, Sword remains directly parented to HandR with fixed local grip, and no runtime joint/Sword override was reintroduced.
- CombatEngine timing, telegraph/strike/recovery durations, parry/Perfect/STEP windows, damage, posture, reach, enemy definitions, score, persistence and network/privacy behavior are unchanged. Vite continues to generate the animation-only GLB deterministically from this source at build time.

### Self-verification boundary

- The existing generator test remains the deterministic asset contract: animation-only 19-joint pack, Guard + four clips, HandR/Sword hierarchy, player-facing Guard and bounded size.
- The existing production PlayCanvas renderer browser contract is the exact runtime acceptance gate for this slice: real Guard, continuous AttackTop through telegraph→strike, Bottom low wind-up/rising strike, player-facing plane crossing, actual Sword trail/history and grip lock, plus unchanged RIGHT/LEFT screen semantics.
- No pixel-level browser/screenshot controller is available in this execution surface. Therefore the post-commit exact-head CI browser contract plus exact-head Vercel Preview are the strongest self-observable evidence; subjective physical-phone naturalness remains supplemental owner feedback rather than a continuation gate.
- Post-commit acceptance requires exact-head GitHub CI plus exact-head Vercel Preview success. The PR run comment is authoritative for those post-commit results; no second bookkeeping commit is allowed.
