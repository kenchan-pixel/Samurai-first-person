# 3D Pipeline Decision Gate

Status: **APPROVED DIRECTION — PlayCanvas-first incremental migration is authorised.**

## Why this decision exists

Physical iPhone review after Run 014 confirms two separate needs:

1. enemy character fidelity is still below the desired quality;
2. attack animation needs a complete, fluid wind-up → swing → impact → recovery read while targeting a 60 Hz phone experience.

Runs 015–016 improve the motion pipeline inside the existing WebGL2 stack, but character fidelity is now at the practical limit of the procedural single-pass figure. The next meaningful improvement is a real rigged-character asset and animation pipeline rather than more shader-drawn body parts.

## Decision baseline

The game remains:

- mobile-first, recent-iPhone portrait as primary acceptance;
- a deterministic first-person directional parry / swipe counter / STEP combat game;
- a compact browser game deployed as a static site;
- free of accounts, analytics, paid runtime services and unnecessary permissions;
- dependent on auditable original or openly licensed assets only.

The existing `src/game-core.js`, boss, mastery, onboarding and footwork logic should remain independent from rendering so a visual migration cannot silently change combat timing or rules.

## Approved stack direction

### Runtime / renderer

**PlayCanvas Engine used standalone** is the approved first-choice 3D runtime.

Use it as the rendering / scene / skeletal-animation layer rather than adopting a cloud-editor-centric application architecture. The current DOM/CSS HUD and deterministic combat modules should remain outside the 3D engine where practical.

### Build / language

Adopt **Vite + TypeScript incrementally for the new 3D layer**. Existing stable JavaScript game modules do not need a broad conversion merely for consistency; migrate them only when it materially improves the implementation.

### Asset pipeline

Use **Blender → glTF/GLB** for rigged samurai characters and animation clips. Prefer local assets committed or otherwise versioned with clear provenance. Use **KTX2/Basis-compressed textures** where they materially improve transfer size / GPU memory without unacceptable quality loss.

Every imported model, texture and animation must have recorded provenance/licence. Do not use downloaded character packs with unclear or incompatible rights.

### Rendering compatibility

- **WebGL2 remains the required compatibility baseline.**
- WebGPU may be used progressively when supported, but must not become a requirement until real-device evidence justifies it.
- Keep adaptive quality / render-scale behaviour so visual fidelity can degrade gracefully before gameplay timing or responsiveness does.

### Deliberate exclusions for now

- No React migration just to host the renderer.
- No physics engine unless a future gameplay requirement actually needs rigid-body/collision simulation.
- No full rewrite of combat state into PlayCanvas entities/components.
- No network service for model delivery, analytics or runtime game logic.

## Why PlayCanvas is preferred

PlayCanvas provides the game-specific middle layer the project now needs: skinned meshes, animation state handling/blending, scene/material tooling, glTF workflows, browser/mobile rendering and performance-oriented runtime controls without requiring the project to become a heavyweight desktop-engine export.

This gives the project substantially more room for expressive enemy characters and animation while preserving the existing deterministic combat core and static web deployment model.

## Alternatives retained as fallback

### Babylon.js

Retain as the strongest alternative if PlayCanvas proves materially worse for animation authoring, mobile performance or maintenance. Its broader game-engine surface may become useful if the project expands substantially beyond compact duels.

### Three.js

Retain as a focused-library alternative if PlayCanvas's engine layer becomes a constraint. Three.js has a strong glTF/WebGL/WebGPU ecosystem, but this project would need to own more game-animation/state plumbing itself.

### Custom WebGL2

Keep the current renderer as a fallback during migration, not as the long-term fidelity target. Building our own glTF/skinning/animation/material stack is not preferred because it diverts effort from gameplay and art.

## Implementation strategy — outcome first

Do not spend a full evolution run on a throwaway technology demo when the same evidence can come from a bounded production-facing slice.

The preferred first slice is:

1. add the PlayCanvas renderer behind a narrow adapter/fallback seam;
2. load one clearly licensed/original rigged samurai;
3. map existing combat phases to a complete readable wind-up → swing → impact/follow-through → recovery animation;
4. keep the existing combat engine authoritative for timing, damage, parry and STEP;
5. retain the current renderer as a temporary fallback until the new path is proven sufficiently stable;
6. ship the slice to the existing Draft PR / Vercel Preview so real iPhone feedback can immediately judge visual quality and responsiveness.

Refactors are allowed where they directly enable that slice, but broad architecture cleanup should not outrun visible progress.

## Verification discipline

Testing is risk-based rather than coverage-maximising. For the first migration slices, prefer the smallest evidence set that protects the important failure modes:

- engine/model loads without browser runtime or shader errors;
- one representative full attack animation follows the existing combat phase timing;
- parry/swipe/STEP input remains functional and combat rules remain unchanged;
- stage/restart flow still works;
- mobile portrait layout remains usable;
- existing Node/browser baseline tests continue to pass unless a test is legitimately updated for the new renderer contract.

Add new tests only when they prove new high-risk integration behaviour or prevent a demonstrated regression. Do not create duplicate harnesses merely to increase test count.

## Performance acceptance

The goal remains a smooth **60 Hz-oriented recent-iPhone experience**. Evaluate the playable result at normal combat distance, not an isolated benchmark scene.

Track:

- frame-time stability during repeated complete attack cycles;
- input responsiveness while skeletal animation is active;
- internal render resolution / quality fallback behaviour;
- first-load transfer and time-to-playable;
- memory/GPU warnings or obvious thermal degradation during several minutes of play;
- character/texture cost and asset provenance.

Physical-device evidence is the primary final acceptance signal, but bounded implementation work does not need to stop whenever a physical phone is temporarily unavailable. Browser/runtime evidence and conservative budgets should keep the branch moving until the next device check.

## Approval boundary

Ken has approved the PlayCanvas-first direction and delegated detailed testing, refactoring and implementation sequencing to the agent with an outcome-first bias.

No new human Decision Gate is needed for incremental work inside this direction. Re-open a gate only if evidence points to a substantially different engine/stack, material new cost/privacy/licensing risk, removal of cumulative product behaviour, or another change outside the approved hard constraints.
