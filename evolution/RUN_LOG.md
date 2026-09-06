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

## Runs 134–160 — Closed Beta hardening, combat reads and repeat-play loops

- Restored the approved local/export-only feedback contract and privacy regression guard; added and production-hardened opponent **敵式 / 應對** reads plus same-route practice focus carry, truthful prior-target grading, Perfect-objective closure, three-run trend and session-only practice bests.
- Expanded challenge/今日陣 with actual-next-opponent scouting, immediate post-tactic outcome reflection, truthful 再戰重點, cumulative 無傷試煉 and lifecycle-safe retry labels while preserving combat/balance/persistence authority.
- Added pressured-guard body language, campaign **關鍵一刻**, explicit campaign/challenge/practice mode isolation and the Closed Beta result-level **下一步** flow. Replaced its synthetic acceptance with a real 320×568 production route and kept headless feedback export deterministic by stubbing only the platform-owned Web Share primitive while exercising the real production send path/payload/completion observer.
- Exact commit-level details and CI/Vercel receipts for Runs 134–160 remain in Git history and Draft PR #1; cumulative product/acceptance behavior remains protected by Current Baseline and Regression Checklist.

## Run 161 — Make headless feedback export deterministic without bypassing production

**Date:** 2026-09-06  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `6a1fc79a3483f9ed29997fc383fa8d09a2b37f36`.
- Exact-head Actions CI #206 / run `34005288562` failed twice on the same SHA. `npm test` is **181/181 green** and every preceding browser gate passes; the real 320×568 Closed Beta production path also reaches campaign terminal → Ronin practice → same-opponent retry/comparison → feedback panel before failing because headless Chromium cannot complete OS Web Share/clipboard export.
- Exact-head GitHub `Vercel` status is success and Preview is Ready with 0 unresolved feedback. Draft PR #1 remains open/Draft/unmerged; `main` is untouched; inline review comments are empty.
- Current-head All Repos review `5123807212` classifies the red acceptance as actionable **P1** and explicitly requires a deterministic platform-export seam while retaining the real production send control, `deliverBetaFeedback` path, payload and explicit-user-action privacy contract. Feature work is prohibited.

### Repair

- Kept `src/result-feedback.js`, `src/beta-readiness.js` and all player/runtime behavior unchanged.
- The existing real-production 320×568 Closed Beta harness now replaces only the same-origin `navigator.share` platform primitive after the production document and feedback panel have initialized. Headless CI still clicks the real `分享回報` button, which invokes the unchanged real `collectBetaFeedbackPayload` → `deliverBetaFeedback` path and publishes the real `resultFeedbackLast=shared` receipt.
- The seam captures the actual exported payload and the gate now requires the real report title, a deliberately entered `320×568 平台匯出驗證` player note and the clean query/hash-free production URL before accepting the existing 3/3 completion observer. It never writes `resultFeedbackLast`, beta progress or completion datasets directly.
- The browser runner requires explicit platform-seam and payload-integrity receipts in addition to every Run 160 production-route/layout/challenge/今日陣 assertion.
- Closed Beta SOT now states that headless acceptance may stub only platform-owned Web Share/clipboard primitives; real send-control, delivery-path, payload and completion semantics remain mandatory. No combat, balance, persistence, analytics, identifier, backend or network product code changed.

### Verification boundary

- The repair is limited to test harness/runner plus acceptance SOT/state/log. It does not weaken the product privacy boundary or synthesize Closed Beta completion.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` including `beta-readiness-browser-smoke.mjs`, plus exact-head Vercel success, are mandatory. The PR run comment is authoritative for the resulting SHA/status under the one-commit rule.

## Run 162 — Make successful parries physically knock the opponent off-line

**Date:** 2026-09-06  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `c32ab5e1032fd2f2f10748ac590d76697121a881`.
- Exact-head Actions CI #207 / run `34006686352` is terminal success with the complete Node/browser suite green and exact-head GitHub `Vercel` status is success. Draft PR #1 is open/Draft/unmerged; `main` is untouched; inline review comments are empty; Preview feedback reports 0 unresolved items; latest exact-head Second Hourly review `5123851628` reports no actionable P0/P1/P2.
- Candidate scoring: **bounded enemy parry recoil 24/25** (impact 5, goal 5, novelty 5, confidence 4, safety 5); campaign replay objective 20/25; bounded live-combat mastery cue 18/25. The recoil wins because it improves the core sword-contact feel and makes the existing recovery opening readable through the opponent's body rather than another HUD surface, while reusing only authoritative recovery state.

### Feature

- Added `src/enemy-parry-recoil.js`, a presentation-only PlayCanvas adapter that reacts only after an authoritative parry has already opened recovery. A normal parry pushes the complete opponent back/off-axis, Perfect Parry is stronger, and a true guard break is strongest; RIGHT/LEFT incoming directions mirror the whole-body lateral/yaw/roll reaction rather than rewriting gameplay direction.
- The effect owns no timer: it derives entirely from existing `phaseProgress`, `attack.parried`, `attack.perfect`, `attack.guardBroken` and `attack.counterUsed`. It is exactly neutral during ready/stage-intro/gap/telegraph/strike, fades to zero before late recovery and clears immediately once the manual counter is consumed.
- Renderer composition places the recoil after pressured-guard body language and before blade-trajectory/afterimage sampling. It changes only complete enemy-root position and skinned whole-model Euler presentation; Sword/HandR are never rotated directly and downstream grip/trajectory evidence sees the final composed pose.
- Added deterministic pure tests for lifecycle, normal→Perfect→guard-break escalation, horizontal mirroring and no storage/transport/timer APIs. Strengthened the existing real 320×568 enemy-posture PlayCanvas gate to prove gap/telegraph suppression, visible normal recoil, stronger Perfect recoil, strongest bounded guard-break recoil, finite transforms, late-recovery settlement and unchanged Sword→HandR/grip/orientation authority.
- No attack definition, timing, damage, posture value, parry/Perfect/STEP rule, HP, score, roster, input, HUD, persistence, identifier, analytics or network behavior changed.

### Verification boundary

- The new focused pure suite passed 4/4 locally and all modified/new JavaScript passed `node --check` before Git object assembly. Repository-authoritative full verification remains exact-head Actions after the single final commit.
- Post-commit exact-head `npm test`, complete `npm run test:browser` including the strengthened enemy-posture browser gate, and exact-head GitHub Vercel success are mandatory. The PR run comment is authoritative for the resulting SHA/status under the one-commit rule.

## Run 163 — Turn campaign results into one replay objective

**Date:** 2026-09-06  
**Action type:** FEATURE

### Preflight

- Incoming exact HEAD: `654c9726b105ca0d910b8f7f070dc5605a35c4d2`.
- Exact-head Actions CI #208 / run `34009302753` is terminal success and exact-head GitHub `Vercel` status is success. Draft PR #1 is open/Draft/unmerged; `main` is untouched; unresolved review threads are empty; Preview feedback reports 0 unresolved items; latest exact-head review reports no actionable P0/P1/P2.
- Candidate scoring: **session-only campaign replay objective 23/25** (impact 4, goal 5, novelty 4, confidence 5, safety 5); manual-counter impact recoil 21/25; bounded live-combat mastery cue 18/25. The replay objective wins because it closes the normal-campaign result → retry learning loop using already-authoritative analysis, adds no live-combat HUD/persistence/network path, and diversifies away from the just-modified renderer subsystem.

### Feature

- Added one compact pointer-transparent campaign-only **再戰目標** row inside the existing result-analysis card. A defeat asks the next campaign to reach one stage farther; a Stage 4 defeat asks to defeat the Shogun. A completed campaign derives a bounded next target from existing total hits, missed manual-counter openings or Perfect-technique counts.
- The objective is module-memory only. The next campaign consumes and grades that exact target: success shows a factual `✓` receipt and derives the next target; failure shows `未達` and keeps the same target. Direct practice, 連戰試煉 and 今日陣 cannot display, consume or grade it, and page refresh clears it.
- Added a pure target/evaluation model plus a bounded CombatEngine/run-analysis observer. No combat timing, damage, posture, HP, score, input, renderer, persistence, identifier, analytics or network authority changes.
- Added deterministic unit coverage and a real-production 320×568 browser gate proving Stage 1 defeat → `再戰目標 · 打入第2關`, next campaign reaching Stage 2 → `✓ 打入第2關 · 下一步 打入第3關`, in-bounds/pointer-transparent composition and challenge isolation.
- Updated Current Baseline and Regression Checklist in the same implementation commit so the session-only lifecycle, privacy boundary and production acceptance remain cumulative SOT.

### Verification boundary

- Focused target-model tests passed 4/4 and all new JavaScript/browser scripts passed `node --check` before Git object assembly. Repository-authoritative verification remains exact-head Actions after the single final commit.
- Post-commit exact-head `npm test`, complete `npm run test:browser` including `campaign-replay-objective-browser-smoke.mjs`, and exact-head GitHub Vercel success are mandatory. The PR run comment is authoritative for the resulting SHA/status under the one-commit rule.

## Run 164 — Stabilize observer-owned Closed Beta next-step acceptance

**Date:** 2026-09-06  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `1639359f08d3482b1167c6bc2b26639ccb624d58`.
- Exact-head GitHub `Vercel` status is terminal success and Preview feedback is 0 unresolved, but Actions CI #209 / run `34012224087` failed after `npm test` **189/189** and every preceding browser gate passed. The failure occurs only after the real 320×568 production flow reaches the first Ronin-practice terminal: the harness observes result visibility and immediately samples the Closed Beta `下一步` state before the beta-readiness `MutationObserver` is guaranteed to settle the same-opponent retry action.
- Draft PR #1 remains open/Draft/unmerged; `main` is untouched; unresolved review threads are empty. Under the exact-head fence this red CI blocks feature work.

### Repair

- Kept all production/runtime code and the full Run 159–161 Closed Beta contract unchanged.
- The real-production acceptance now waits, for a bounded 1800 ms, for the exact same first-practice semantic state it previously sampled synchronously: session still `1/3`, next step still `repeat-practice`, target exactly `restart-button`, CTA visible and copy containing `再練`.
- Added the explicit `betaReadinessNextStep === 'repeat-practice'` assertion on that edge. Wrong target, stale progress, hidden CTA, wrong copy or a non-settling observer still fail closed; no beta state is written by the harness.
- No combat, renderer, input, balance, result UI, navigation, feedback payload/export, storage, identifier, analytics or network product behavior changed.

### Verification boundary

- This is a delivery-gate timing repair against a real asynchronous production observer, not a relaxed product assertion. The second-practice → feedback transition already uses the same bounded-settlement pattern.
- Post-commit exact-head Actions `npm test` + complete `npm run test:browser` including the real-production Closed Beta gate, plus exact-head Vercel success, are mandatory. The PR run comment is authoritative for the resulting SHA/status under the one-commit rule.
