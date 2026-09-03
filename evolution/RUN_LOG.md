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

## Runs 099–100 — Choreography continuity and first release-prep surface

- Run 099 refined deterministic authored `AttackTop` / `AttackBottom` into connected cross-body vertical cuts while retaining the shared Guard, fixed Sword→HandR grip, player-facing contact path and unchanged combat authority. Exact-head `337c110e7235bfcbd168d2df098fd1b3f84c49b6` passed CI #145 and Vercel.
- Run 100 added the local/player-triggered **分享** action to campaign/practice/challenge/今日陣 terminal results. Native Web Share uses only already-visible result text plus a clean game URL; unsupported share falls back to clipboard. Exact-head `0ffa84f6ec02fada1fa8c45538075fa084e69ddd` passed CI #146 and Vercel. No account, identifier, persistence, analytics or gameplay backend was introduced.

## Run 101 — Same-opponent practice progress

**Date:** 2026-09-03  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `0ffa84f6ec02fada1fa8c45538075fa084e69ddd`.
- Exact-head GitHub Actions CI #146 / run `33767801127` is terminal **success** and exact-head GitHub `Vercel` status is terminal **success**.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, inline review threads are empty, and the latest exact-head review reports no actionable P0/P1/P2.
- Current SOT says another balance change needs repeated Ronin/Oni/Shogun/Blood Moon evidence. A pure evidence-only run would not qualify for a commit, so candidates were scored for player-visible value that strengthens that loop without pre-empting the privacy/data gate: (1) same-opponent practice progression 23/25; (2) Perfect Parry/STEP visual distinction 20/25 without a current confusion signal; (3) remote Closed Beta feedback/bug reporting 18/25 but still SOT/privacy-gated. Candidate 1 won.

### Implementation

- Added `src/practice-progress.js`, a result-only adapter that observes the same authoritative combat events into a separate in-memory analysis session. It stores only one previous snapshot per direct-practice route for the current page session.
- The first Ronin/Oni/Shogun/Blood Moon practice completion shows a compact **修行進度** prompt to repeat that opponent once. A later completion against the same route compares the current four-direction defense rate, hits taken and manual-counter conversion with the immediately previous attempt and labels the overall trend as **有進步 / 大致持平 / 再磨一局**.
- Comparison inputs are derived from existing authoritative `strike`, parry, successful STEP, `player-hit` and manual-counter outcomes. Page refresh clears the snapshots; each practice route is isolated; campaign/challenge terminals hide the row.
- No enemy definition, timing, damage, Perfect/parry/STEP rule, score, mastery grade, campaign/challenge best, renderer, storage key, account, identifier, analytics, telemetry, backend or network request changed.

### Self-verification boundary

- Added deterministic Node tests for snapshot derivation, improvement/regression deltas and unavailable counter-rate handling.
- Extended the existing focused 320×568 run-analysis browser gate: it retains the four-way defense/weakest-direction and eight-stage omission checks, then completes the same direct practice twice and requires the first-repeat prompt, expected `防守 +50% · 受擊 −1 · 反擊 ±0%` comparison and an in-bounds result row.
- This execution surface has no local repository/browser checkout; exact-head GitHub CI (`npm test` + full `npm run test:browser`) and exact-head Vercel Preview are therefore the post-commit acceptance gate. The PR run comment records final receipts; no second bookkeeping commit is allowed.
