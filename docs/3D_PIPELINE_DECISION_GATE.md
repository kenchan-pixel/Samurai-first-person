# 3D Pipeline Decision Gate

Status: **OPEN — no renderer/engine migration has been approved.**

## Why this gate exists

Physical iPhone review after Run 014 confirms two separate needs:

1. enemy character fidelity is still below the desired quality;
2. attack animation needs a complete, fluid wind-up → swing → impact → recovery read while targeting a 60 Hz phone experience.

Run 015 improves the motion pipeline inside the existing WebGL2 stack. Character fidelity, however, is now approaching the limit of the current procedural single-pass figure and should not be solved by endlessly adding shader shapes.

## Current system

- Static ES-module web app.
- One custom WebGL2 procedural renderer.
- Combat/timing state remains in `src/game-core.js`.
- No downloaded model/texture pack and no third-party runtime 3D engine.
- Vercel static deployment and current browser CI are already established.

## Hard requirements for any replacement

A candidate must preserve:

- recent-iPhone portrait as the primary acceptance target;
- four-direction edge parry, swipe counter and STEP input;
- elapsed-time combat timing independent of render frame count;
- readable full-body enemy framing and four-beat attack motion;
- deterministic boss/onboarding/mastery/footwork integrations;
- no account, analytics or paid runtime service;
- auditable original/openly licensed character and animation assets;
- static hosting compatibility;
- graceful fallback when high-end visual options are too expensive.

A migration is not approved merely because a library can render a nicer demo.

## Candidate A — Three.js + local glTF/GLB rig

**Tentative prototype recommendation.**

Why it is attractive:

- focused browser 3D library rather than a full application framework;
- native fit for scene/camera/mesh/skinning/animation workflows;
- glTF/GLB is a practical interchange format for Blender-made rigged characters;
- MIT-licensed project;
- can keep the existing combat engine and most non-rendering modules intact.

Main questions:

- real bundle/loader cost after only required modules are imported;
- iPhone Safari frame time with skinned mesh, PBR materials, shadows and effects;
- how cleanly animation clips can be driven by the existing combat phases;
- whether one original low/mid-poly samurai can look materially better without excessive texture size.

Official project: https://github.com/mrdoob/three.js

## Candidate B — Babylon.js + local glTF/GLB rig

Why it is attractive:

- broader game/rendering engine with built-in scene, animation and asset tooling;
- WebGL and WebGPU paths are maintained;
- glTF workflow and tooling are mature;
- Apache-2.0 licensed project.

Trade-off:

- potentially more engine surface than this compact game needs;
- migration cost and bundle/runtime overhead must be justified by a measurable authoring or performance advantage.

Official project: https://github.com/BabylonJS/Babylon.js

## Candidate C — custom WebGL2 rig/model pipeline

Why retain it as a comparator:

- smallest runtime dependency surface;
- maximum control over render budget.

Why it is not the default recommendation:

- we would need to own glTF/skinning/animation/material/loading concerns ourselves;
- engineering effort would shift away from gameplay and art;
- higher maintenance risk for a beginner-maintained project.

## Required prototype before approval

Build a disposable renderer prototype, not a production migration. Use one clearly licensed/original rigged samurai and four clips or blended poses:

1. anticipation / wind-up;
2. swing;
3. hit / parry impact;
4. recovery.

Measure on the same recent iPhone used for acceptance:

- visible character quality at normal combat distance;
- frame-time stability during the full four-beat attack;
- internal render resolution and device pixel ratio;
- first-load transfer size and time-to-playable;
- memory/GPU warning or thermal symptoms during several minutes of repeated combat;
- input responsiveness while animation is active;
- asset file size, texture count/resolution and licence/provenance.

## Approval condition

Only replace the current renderer after the prototype demonstrates a **material visual improvement** and acceptable phone performance without forcing changes to core combat rules.

Until then, Three.js is a **tentative prototype recommendation**, not an approved production dependency.
