# Evolution Run Log

This log is intentionally concise. Full diffs, exact SHAs, CI receipts and Preview links remain in Git history and Draft PR #1. Historical long-form entries were compacted; no product rule was removed from `docs/CURRENT_BASELINE.md` or `docs/REGRESSION_CHECKLIST.md`.

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

## Runs 090–094 — Production practice, direction analysis and heavy attacks

- Run 090 rejected after the new production document gate proved the real 練血月 control could fail even while direct request-API tests were green.
- Run 091 repaired idempotent practice Start ownership and the real Blood Moon launch/retry/campaign handoff at 320×568.
- Run 092 added local result-only 四向防守 analysis without live HUD/network/persistence changes.
- Run 093 repaired Blood Moon capture so normal 練浪人 / 練鬼 / 練將軍 requests survive the nested production Start path; exact-head CI and Vercel were green.
- Run 094 added a presentation-only heavy-attack weight pass for existing heavy attacks. Exact-head CI #138 is green. The current-head review requires focused real 320×568 heavy-path verification before this slice is treated as fully evidenced.

## Run 095 — Exact-head Preview build receipt recovery

**Date:** 2026-09-03  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `5b3859dd553d9cf25bde9c6e164b2ee8597cab8f`.
- Exact-head GitHub Actions CI #138 / run `33571293133` is terminal **success**.
- GitHub's combined status endpoint currently returns no statuses for this SHA, so there is no exact-head `Vercel` status to certify. The latest Vercel bot Preview receipt on PR #1 predates this HEAD.
- Direct Vercel project deployment enumeration returns `403 Forbidden`; direct lookup of the known Preview alias returns `404 Deployment not found` through the connector. Ken separately confirmed the Preview alias itself is reachable, proving this is an integration/identity-verification deadlock rather than evidence that Vercel is down.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, and inline review threads are empty.
- The latest current-head review has one actionable P2: Run 094 heavy-attack weighting lacks focused real 320×568 renderer evidence. A later owner investigation also records a blocking P2 structural Bottom-parry risk because STEP owns part of the lower parry region and the production gate currently exercises Top/Right but not Bottom/Left. Those gameplay/input items remain next, but the exact-head verification fence has higher priority in this run.

### Repair

- Added `tools/build-receipt.mjs`. Vite now emits a static `/build-meta.json` receipt containing only schema version, build `commitSha`, Git branch and provider. Vercel Git metadata is authoritative; Vite-prefixed/GitHub values are bounded fallbacks for non-Vercel verification.
- Invalid or unavailable commit metadata fails closed as `commitSha: "unknown"`; it can never certify a Preview.
- `vercel.json` now marks `/build-meta.json` `no-store` so the stable branch alias cannot be certified from a stale cached receipt.
- Added focused Node coverage for Vercel metadata precedence, fail-closed invalid SHA handling and the exact emitted asset contract. Local standalone execution of these three tests passed before commit.
- Updated the canonical Scheduled Task/evolution/deployment SOT: direct Vercel exact-SHA data remains preferred, GitHub `Vercel` exact-head status remains the normal fallback, and the new receipt is allowed only when those integration signals are unavailable/missing rather than explicitly failed. The receipt must return a valid 40-character SHA exactly equal to the current branch HEAD and branch `autonomous-evolution` when available. Any mismatch/unknown/missing receipt remains HOLD; an explicit Vercel failure is never overridden.

### Regression boundary

- No gameplay, combat timing/damage/parry/Perfect/STEP rule, input mapping, enemy/boss definition, score, renderer animation/geometry, local persistence, network/account/privacy or asset authority changed.
- This is a delivery-safety repair only. It does not bypass CI or the Preview requirement; it creates a self-verifiable exact-head identity channel for the already-reachable Preview when external integration metadata is absent.
- Post-commit acceptance requires exact-head GitHub CI plus a successful Preview `/build-meta.json` whose SHA equals the new implementation commit. The PR run comment is authoritative for those post-commit results; no second bookkeeping commit is allowed.

## Run 096 — Bottom parry / STEP input ownership repair

**Date:** 2026-09-03  
**Action type:** REGRESSION_FIX

### Preflight

- Incoming exact HEAD: `b76784eb181763f6b5d472f511b8a5c9d9afe165`.
- Exact-head GitHub Actions CI #140 / run `33745121818` is terminal **success**, and GitHub's exact-head `Vercel` status is terminal **success**. The Preview-evidence deadlock from Run 095 is therefore closed for the incoming HEAD.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, and inline review threads are empty.
- The latest current-head All Repos review has two actionable P2 findings. The Bottom-parry/STEP ownership finding is blocking because it affects core mobile playability; the Run 094 heavy-attack focused-renderer evidence gap remains next after this repair.
- Code inspection found the concrete defect behind the first P2: the approved baseline says right-hand STEP belongs in the lower-right safe corner and left-hand mode mirrors it to the lower-left, but production CSS only overrode the left-hand layout. The default right-hand STEP therefore remained at the footwork module's bottom-centre base position and directly occupied the most natural Bottom-parry lane.

### Repair

- Restored the approved handedness contract in `control-handedness.js`: right-hand mode now pins STEP, range chip and STEP feedback to the lower-right safe area; left-hand mode keeps the mirrored lower-left placement. The visible STEP button remains the exclusive owner of its own pointer stream, while the rest of the canvas continues to own directional parry/swipe input.
- Expanded the real production Combat UX smoke at **320×568**. It now runs both right- and left-hand STEP layouts, exercises real Bottom and Left canvas taps in both modes, places the Bottom probe immediately beside the selected STEP button, and in left-hand mode also exercises the Left probe directly above/adjacent to STEP.
- The same production document now drives STEP `pointerdown → pointermove → pointerup`, proves that stream does not emit a canvas parry, then immediately re-tests the adjacent Bottom parry to catch duplicate/stale pointer ownership.
- Direction thresholds, parry/Perfect timing, STEP timing/reach, attack/swipe mapping and combat authority are unchanged; this repair moves the control to the baseline-approved corner and adds executable ownership evidence.

### Regression boundary

- No combat damage, timing, posture, score, enemy/boss definitions, player-screen direction semantics, persistence, account/network/privacy behavior, renderer geometry/animation or asset authority changed.
- Existing Top/Right Pause-adjacent production checks remain in the same gate; the new lower-input checks extend rather than replace them.
- Post-commit acceptance requires exact-head GitHub CI plus exact-head Vercel Preview success. The PR run comment is authoritative for those post-commit results; no second bookkeeping commit is allowed.

## Run 097 — Heavy-attack real-renderer acceptance closure

**Date:** 2026-09-03  
**Action type:** BLOCKER_FIX

### Preflight

- Incoming exact HEAD: `28656c938c63b07912459914c45ff72cf59e3535`.
- Exact-head GitHub Actions CI #142 / run `33750594724` is terminal **success**, and the exact-head GitHub `Vercel` status is terminal **success**.
- Draft PR #1 remains open/Draft/unmerged, `main` remains untouched, and inline review threads are empty.
- The latest current-head All Repos review confirms the Run 096 lower-control repair and leaves one actionable P2 ahead of feature work: Run 094 heavy weighting has unit/mocked evidence but no focused real-PlayCanvas 320×568 sequence proving it activates/settles correctly while the authored blade remains attached/readable and normal attacks remain neutral.

### Repair

- Added a dedicated production-build PlayCanvas browser contract at **320×568** rather than relying on a generic renderer-health pass. It uses the real `View` composition and a real `CombatEngine` configured with the existing Oni Guard definition, so the first existing heavy `AttackTop` is driven deterministically through telegraph → strike → recovery → gap.
- The gate requires the heavy load/read telegraph, committed strike drive, recovery decay and final zeroed state; verifies the authored attack remains on `AttackTop`; and checks the actual Sword stays directly parented to `HandR`, grip-lock/orientation remains bounded, the real-blade read trail/finite blade-tip diagnostics remain present, and depth/camera/body transforms stay finite/bounded.
- The same real renderer is then fed an existing normal Ashigaru telegraph and must report zero heavy load/drive/follow/read, proving the presentation adapter does not leak into ordinary attacks.
- Added a focused browser runner to `npm run test:browser` and made the production page expose this smoke only behind `?browser-smoke=heavy-attack`. `docs/REGRESSION_CHECKLIST.md` now carries the executable heavy-attack acceptance gate.
- Both new JavaScript files were syntax-checked locally with `node --check` before the Git commit. Full application/browser execution remains the post-commit CI acceptance gate because the connected GitHub surface does not provide an arbitrary pre-commit repository runner.

### Regression boundary

- No gameplay timing, parry/Perfect window, damage, posture, score, STEP/input semantics, enemy/boss definitions, renderer production transforms, persistence, network/account/privacy behavior or asset authority changed. This run adds acceptance instrumentation/tests only to close a material visual-runtime review blocker.
- The gate uses existing local source/assets and creates no account, telemetry, identifier, API or remote data flow.
- Post-commit acceptance requires exact-head GitHub CI (including the new focused browser smoke) plus exact-head Vercel Preview success. The PR run comment is authoritative for those post-commit results; no second bookkeeping commit is allowed.
