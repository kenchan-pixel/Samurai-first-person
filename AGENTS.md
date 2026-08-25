# AGENTS.md

## Authority

1. Direct written instruction from Ken.
2. Repository-local product and engineering documents.
3. This file.
4. Normal engineering defaults.

## Delivery rules

- Mobile-first is mandatory. The primary acceptance viewport is a recent iPhone in portrait orientation.
- Every product request is cumulative unless Ken explicitly removes a requirement.
- One task = one branch = one focused pull request.
- Do not push feature work directly to `main`.
- Do not merge pull requests. Final merge belongs to Ken.
- Preserve the current playable baseline before adding features.
- A run must deliver one visible, complete vertical slice. Pure refactors, documentation-only changes, test-only changes, colour tweaks, or placeholder controls do not qualify as an evolution run.
- Do not replace the technology stack without a documented Decision Gate.
- Do not add login, payments, analytics, advertising, external tracking, paid APIs, or sensitive permissions without approval.
- Do not use copyrighted game assets, character likenesses, music, logos, or copied level designs.

## Mandatory preflight

Before modifying code, read:

1. `docs/PRODUCT_GOAL.md`
2. `docs/CURRENT_BASELINE.md`
3. `docs/EVOLUTION_RULES.md`
4. `docs/REGRESSION_CHECKLIST.md`
5. `docs/IMPROVEMENT_BACKLOG.md`
6. `evolution/RUN_LOG.md`

Then inspect the current code, open issues, open pull requests, and CI state.

## Definition of done

A task is complete only when:

- the improvement is visibly usable on mobile;
- all existing tests pass;
- the regression checklist has been checked;
- no browser runtime error is introduced;
- input remains usable by touch and mouse;
- the change does not silently remove an approved baseline feature;
- `docs/CURRENT_BASELINE.md`, `docs/IMPROVEMENT_BACKLOG.md`, `CHANGELOG.md`, and `evolution/RUN_LOG.md` are updated when applicable;
- the pull request explains Before, After, verification evidence, risks, and retained baseline behaviour.
