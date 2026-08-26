# Evolution Run Log

## Run 000 — Repository baseline

**Date:** 2026-08-25  
**Scope:** Create initial mobile-first playable vertical slice and persistent evolution source of truth.

### Before

No persistent repository, executable baseline, regression checklist, or evolution protocol existed for this game concept.

### After

- First-person WebGL samurai duel prototype.
- Directional tap parry and swipe attack loop.
- Three-stage enemy progression.
- Pure combat state machine and automated tests.
- Product goal, baseline, backlog, evolution rules, CI, and regression checklist.

### Verification

- Run `npm test`.
- Start a local static server and complete all three stages at a mobile viewport.
- Check `docs/REGRESSION_CHECKLIST.md`.

### Known limitations

- Geometry and animation are deliberately procedural and low-detail.
- No automated browser screenshot test yet.
- No persistent scoring, boss phases, or accessibility settings yet.
- Haptic feedback is not yet implemented.

### Next-run candidates

- Improve animation readability and combat impact.
- Add posture/guard-break system.
- Add automated mobile browser smoke test.

## Run 001 — Autonomous verification/review gate hardening

**Date:** 2026-08-26  
**Action type:** BLOCKER_FIX  
**Scope:** Repair two P1 safety gaps found by the PR-review automation before allowing player-facing feature work.

### Before

- The evolution protocol only blocked on failed CI/Preview; a missing, queued, or in-progress exact-head check could be bypassed by the next hourly feature run.
- Review semantics relied too heavily on the literal word `BLOCKER`, while the established reviewers normally emit P0/P1/P2 findings.
- A previous P2 noted that Vercel Preview was not connected; that condition has since been removed by the completed Vercel import and successful Preview deployment.

### After

- New feature selection now requires exact-current-HEAD CI **and** Vercel Preview to be terminal green.
- Missing/queued/in-progress exact-head verification is an explicit `HOLD` with no commit; failed verification becomes `BLOCKER_FIX`.
- Applicable unresolved P0/P1 findings from human or established automated reviewers now block new features even without the literal word `BLOCKER` and even when posted against an earlier HEAD.
- Actionable P2 findings must be inspected and dispositioned; P2 blocks when it maps to material correctness, baseline, security/privacy/data-loss, runtime, deployment, or playability risk.
- The one-commit rule remains intact: post-commit CI/Preview results are recorded in the PR run comment rather than a second metadata commit.

### Verification before final commit

- Exact previous HEAD `b3f3ce1581304c22cefefcb07fda52cce8384bb2`: CI run #23 completed successfully.
- Exact previous HEAD Vercel status: success.
- Draft PR #1 remained open, Draft, mergeable, and unmerged.
- No inline review threads existed.
- Current gameplay code was inspected; this blocker repair intentionally changes no player-facing runtime code or baseline behaviour.
- Full regression checklist remains applicable; no gameplay files are modified by this run.

### Post-commit verification

Exact new-HEAD CI and Vercel Preview must be checked after the single final commit. Their terminal results and the handled-review disposition are authoritative in the Draft PR run comment so no second commit is created merely for metadata.

### Known risks

- Review severity is still natural-language metadata, so each run must inspect whether an older finding remains applicable rather than relying only on SHA markers.
- Direct Vercel connector enumeration may lag; GitHub's `Vercel` commit status remains the fallback deployment signal.

### Next-run candidates

- Improve combat animation readability and impact.
- Add posture/guard-break system.
- Add combat juice: hit stop, camera impulse, sparks, and optional haptics.
