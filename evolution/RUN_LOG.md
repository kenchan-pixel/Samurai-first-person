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
