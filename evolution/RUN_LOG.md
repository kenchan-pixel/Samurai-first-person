# Evolution Run Log

This log is intentionally concise. Full diffs, exact SHAs, CI receipts and Preview links remain in Git history and Draft PR #1. Historical implementation details are protected by `docs/CURRENT_BASELINE.md` and `docs/REGRESSION_CHECKLIST.md`.

## Runs 000–020 — Core systems and renderer evolution

- Mobile-first first-person duel baseline, exact-head delivery fence, readable combat motion, posture/guard break, mastery, Crimson Shogun, Guided Duel, STEP/spacing, impact choreography and PlayCanvas production renderer.

## Runs 021–042 — Skinned character, directional combat and practice

- Local skinned samurai, stage silhouettes, real four-direction blade-tip paths, Perfect Parry/STEP, two-hand first-person grip, run analysis, direct practice and optional 刀路清晰.

## Runs 043–064 — Combat UX and authored animation pipeline

- Mobile Combat UX/Pause hardening, Shogun signature presentation, rejected broken runtime-joint override and recovery, authored Guard + four Attack* tracks, fixed Sword→HandR hierarchy, player-facing directional reads and optional 節拍提示 with deterministic browser verification.

## Runs 065–100 — Delivery recovery, challenge, dojo and Closed Beta share

- Player-screen RIGHT/LEFT semantics, actual-Sword afterimages, bounded Vercel recovery, handed STEP preference, eight-duel challenge, 氣勢/不屈, 今日陣, 戰前抉擇, 宿敵步速, Oni/Blood Moon practice, 四向防守, heavy-attack presentation, exact-head build receipt, late-telegraph parry buffer and explicit local result 分享 via Web Share/clipboard.

## Runs 101–119 — Closed Beta readiness and combat-read refinement

- Session-only 修行進度, explicit local/export-only feedback, 封測資訊 and 0/3 tester guide, local-record summary, weak-direction repeat coaching, 戰策回顧, measured/standard/quick attack-tempo presentation, accepted 50 ms Ronin authored feint crossfade and distinct Perfect Parry `破` / Perfect STEP `閃` identities.

## Runs 120–133 — Direction-aware first-person grip acceptance

- Added a four-direction two-hand support brace and a dedicated real 320×568 PlayCanvas grip gate covering support/handle/blade visibility, pommel→habaki attachment, projected blade extension and neutral return.
- Repaired TOP, RIGHT and BOTTOM portrait framing; corrected BOTTOM counter to a true rising cut; then cleared the remaining BOTTOM-parry blade occlusion with a support-only forearm tuck/splay while preserving blade path and combat rules.
- Run 133 exact HEAD `ef144507f28fc744aabd0fb41196f3db225f8366` passed CI #179, full browser acceptance and exact-head Vercel.

## Run 134 — Structured Closed Beta feedback triage

**Action type:** FEATURE

- Added optional `刀路 / 格擋 / STEP / 畫面 / 難度 / 其他` topic chips to the result 回報 panel and exported a selected topic as `範圍：…` through the existing player-triggered Web Share/clipboard path.
- Exact HEAD `b07d8787c864fb452ed47c4a5d0adca4d98a4731` passed CI #180 and exact-head Vercel.
- Same-head All Repos review `5118902876` then identified two actionable P2 findings: the extra exported `範圍` field is outside the approved Closed Beta feedback payload contract, and the new topic interaction is not specifically covered by the real 320×568 browser gate.

## Run 135 — Restore the approved Closed Beta feedback contract

**Date:** 2026-09-05  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `b07d8787c864fb452ed47c4a5d0adca4d98a4731`.
- Exact-head Actions CI #180 / run `33929779117` is terminal success and exact-head GitHub `Vercel` status is success. Draft PR #1 is open/Draft/unmerged; `main` is untouched; inline review threads are empty.
- Latest same-head review has no P0/P1 but two actionable P2 findings. The payload-contract mismatch is treated as blocking because it is a product/SOT correctness issue in the approved Closed Beta release boundary. There is no owner-approved SOT expansion authorising an additional exported structured field.

### Repair

- Reverted only `src/result-feedback.js` and `tests/result-feedback.test.mjs` to the previously accepted Run 133 feedback implementation from `ef144507f28fc744aabd0fb41196f3db225f8366`.
- Removed the unapproved topic chips, topic UI state and exported `範圍` line. This also removes the browser-coverage gap specific to that interaction rather than weakening the acceptance gate.
- Preserved the approved feedback contract: explicit 體驗意見 / 錯誤回報, player-typed note, already-visible result/mode/progress/score/summary, clean query/hash-free URL, native Web Share with clipboard fallback, cancellation as no-op, privacy disclosure and no account/persistence/analytics/background upload/network endpoint.
- No combat, renderer, input, balance, local-best schema or deployment code changed.

### Verification boundary

- The restored source/test pair is byte-for-byte the previously accepted `ef14450` implementation that passed the full Node/browser suite before Run 134. No acceptance threshold is changed.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` and exact-head Vercel success are still mandatory. The PR run comment is the authoritative post-commit receipt under the one-commit rule.
