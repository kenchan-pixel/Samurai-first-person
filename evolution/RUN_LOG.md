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

## Run 002 — Combat animation readability

**Date:** 2026-08-26  
**Action type:** FEATURE  
**Scope:** Make enemy intent readable from body and blade motion instead of relying mainly on the directional HUD cue.

### Candidate selection

Three materially different candidates were scored 1–5 for visible impact / goal alignment / novelty / confidence / safety:

- Animation readability pass: **5 / 5 / 5 / 4 / 5 = 24**.
- Posture / guard-break system: **5 / 5 / 5 / 3 / 3 = 21**.
- Deeper combat-juice pass: **4 / 5 / 3 / 4 / 4 = 20**, because hit stop, shake, flash, audio and haptics already exist in the baseline.

Animation readability won because it directly strengthens the Product Goal's first pillar — reading opponent intent through motion — with bounded risk to the existing combat state machine.

### Before

- The enemy body was essentially a rigid rectangle/head silhouette while the sword changed angle.
- Telegraph, strike, and recovery phases had limited full-body distinction, so the HUD arrow carried too much of the directional-reading burden.
- The sword had no short-lived motion trail or anticipation emphasis to clarify its path on a phone-sized screen.

### After

- Telegraphs pull the enemy body and blade into direction-specific anticipation poses.
- Strike phase commits with a torso lean/lunge and accelerated sword sweep; recovery visibly follows through before settling.
- Procedural shoulders, arms, hands, stance/legs, and a ground shadow give the opponent a clearer fighting silhouette.
- A restrained telegraph blade halo and bounded two-step strike trail make blade path easier to track without adding UI panels or external assets.
- Stage index subtly changes stance width/helmet scale while keeping all three baseline enemies and their combat timings intact.
- Rendering remains one bounded WebGL2 fragment-shader pass; no textures, network calls, particle objects, listeners, or new runtime dependencies are introduced.

### Verification before final commit

- Exact previous HEAD `2e9667157f630e78c17f2e7d78249c61ab275d64`: CI run #24 completed successfully.
- Exact previous HEAD Vercel commit status: success.
- All Repos review on that exact HEAD reported **no new actionable P0/P1/P2 finding**; no inline review threads existed.
- Existing game-core rules, touch/swipe input code, enemy definitions, audio events, progression, and HUD semantics were preserved.
- `src/main.js` was syntax-checked locally with `node --check`; repository tests were inspected and remain unchanged.
- Regression focus: four-direction tap/swipe mapping, parry/perfect timing, enemy progression, restart flow, optional audio, elapsed-time timing, and bounded rendering cost remain structurally unchanged.

### Post-commit verification

Exact new-HEAD CI and Vercel Preview must be terminal green before another feature run. The PR run comment records the resulting commit SHA, CI, deployment status, and any reviewer disposition without creating a second metadata-only commit.

### Known risks

- Static CI cannot prove WebGL shader compilation or visual quality on every mobile GPU; Preview/mobile review remains important.
- The new shader performs more signed-distance-field segment calculations per pixel. It remains a single pass at the existing capped device-pixel ratio, but real-device responsiveness should be watched before adding more shader complexity.

### Next-run candidates

- Add posture / guard-break system.
- Deepen combat impact with richer hit stop, camera impulse, and sparks.
- Add enemy spacing and footwork.

## Run 003 — Renderer correctness and WebGL verification

**Date:** 2026-08-27  
**Action type:** BLOCKER_FIX  
**Scope:** Repair the current-head P1/P2 renderer findings before allowing any new feature work.

### Before

- The foreground player-katana segment used translated sample coordinates and translated segment endpoints together, so the translation cancelled and produced a spatially degenerate constant-distance mask rather than a localized blade.
- The fragment shader used reversed `smoothstep(edge0, edge1, x)` edges for many signed-distance masks. GLSL ES leaves results undefined when `edge0 >= edge1`, creating cross-driver rendering risk.
- CI only ran Node logic/source tests, so a deployed shader could compile incorrectly or disable the start control without CI noticing.

### After

- Player-katana endpoints are now local to `playerHilt`, restoring a screen-localized foreground blade mask.
- All inverse signed-distance masks use one ordered `mask()` helper; the floor fade also uses ordered `smoothstep` edges.
- The app exposes initialization-only `data-webgl` and `data-start-ready` signals for automated acceptance without changing gameplay UI.
- A dependency-free headless Chrome/Chromium smoke test serves the real app, instantiates WebGL2 with SwiftShader, requires shader compile/link success, and verifies the start control stays enabled.
- GitHub CI now runs both the existing Node suite and the browser WebGL smoke test.

### Verification before final commit

- Exact previous HEAD `14fe569cad03d037e9bbb5550fc10e18938e2c04`: CI run #25 succeeded.
- Exact previous HEAD Vercel status: success.
- PR review on that HEAD identified the P1 player-katana mask defect and the P2 undefined-mask / missing-browser-smoke risk; both are the sole scope of this repair.
- No inline review threads exist and the Draft PR remains open/unmerged.
- Combat state machine, enemy definitions, touch/swipe mapping, progression, generated audio and user-visible HUD structure are unchanged.

### Post-commit verification

The new exact HEAD must complete CI including `npm run test:browser` and Vercel Preview must reach `success`. Results will be recorded in the PR run comment without a second metadata-only commit.

### Known risks

- SwiftShader proves browser-level WebGL2 compile/link and startup behavior, not real iPhone GPU performance or artistic correctness. Preview review on a target phone remains the human visual/performance gate.

### Next-run candidates

- Add posture / guard-break system.
- Deepen combat impact with richer hit stop, camera impulse and sparks.
- Add enemy spacing and footwork.
