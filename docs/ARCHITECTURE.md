# Architecture

This document is the current engineering architecture SOT for `autonomous-evolution`. Product behaviour remains governed by `docs/CURRENT_BASELINE.md`; the approved 3D stack decision is recorded in `docs/3D_PIPELINE_DECISION_GATE.md`.

## Current shape

The game remains a compact static web application, but the production renderer has already migrated to the approved PlayCanvas-first path and is built with Vite.

```text
index.html
  ├─ src/styles.css
  ├─ feature/domain adapters loaded as ES modules
  │    ├─ boss / mastery / onboarding / footwork
  │    ├─ Perfect Parry / Perfect STEP / practice
  │    └─ readability / timing assist / impact feedback
  └─ src/main.js
       ├─ src/game-core.js            deterministic combat authority
       └─ src/renderer.js             renderer seam
            ├─ src/playcanvas-view.ts primary PlayCanvas renderer
            │    └─ bounded animation / stage / blade / weapon adapters
            └─ src/legacy-renderer.js compatibility WebGL2 fallback
```

Vite is the build/dev-server layer used by CI and Vercel Preview. No gameplay backend, account system, remote analytics or paid runtime API is part of the current architecture.

## Combat authority

### `src/game-core.js`

`CombatEngine` is the deterministic core authority for the duel state machine: directions, attack timing, parry/counter outcomes, health, posture, progression, victory/defeat, events and serialisable snapshots. Browser rendering must not decide whether an attack succeeds.

Bounded deterministic domain adapters such as boss encounter, footwork, Perfect Parry/STEP, practice, mastery and local run analysis extend the approved game without transferring combat authority into the renderer. Their behaviour is covered by Node and/or browser contracts.

### `src/main.js`

`main.js` is the browser/gameplay orchestrator. It owns pointer gesture capture, the pausable combat clock, HUD/result flow, local audio/haptic feedback and translation of player input into `CombatEngine` calls. It creates one renderer-neutral `View` and passes snapshots/presentation state into it.

## Rendering architecture

### `src/renderer.js`

`renderer.js` is the renderer seam. It attempts the PlayCanvas production path first and falls back to the legacy WebGL2 renderer only when PlayCanvas cannot initialise.

The PlayCanvas path composes bounded presentation adapters around `PlayCanvasView`, including authored enemy attacks, stage identity, mobile readability, blade trajectory, actual-Sword afterimages, first-person weapon fidelity and enemy screen-space direction mapping. These adapters may read combat snapshots and renderer transforms, but must not silently rewrite combat timing, damage, parry windows or input semantics.

### `src/playcanvas-view.ts`

The primary renderer owns the PlayCanvas application, camera/lights/materials, local skinned samurai GLB, animation playback, player weapon presentation and adaptive pixel-ratio behaviour. Locally generated GLB assets and their provenance remain documented in `docs/ASSET_PROVENANCE.md`.

### `src/legacy-renderer.js`

The older custom WebGL2 renderer is a compatibility fallback, not the production design authority. Keep it operational while the PlayCanvas path remains the approved primary renderer; do not evolve new gameplay around fallback-only behaviour.

## Architectural boundaries

- Combat outcomes stay deterministic and elapsed-time based; frame rate and renderer state cannot decide hit/parry/counter results.
- Player-screen direction semantics remain authoritative at the gameplay/input layer. Opponent-only horizontal mirroring belongs at the renderer presentation seam.
- Rendering consumes snapshots/events and may apply bounded presentation assists; it must not mutate combat rules to make visuals pass.
- Audio, haptics, trails, afterimages, camera motion and accessibility overlays are optional feedback. Gameplay cannot depend on them.
- Local preferences/best-run data must fail safely when storage is unavailable. Remote telemetry remains a separate privacy Decision Gate.
- Prefer small focused adapters over a broad rewrite when a subsystem has independent state, tests, renderer ownership or a measurable performance boundary.

## Approved stack and future Decision Gates

The **PlayCanvas + Vite + locally generated glTF/GLB** direction is already approved by `docs/3D_PIPELINE_DECISION_GATE.md`; it is not a future migration awaiting approval. Blender-compatible glTF/GLB remains the long-term interchange format, WebGL2 remains the compatibility fallback, and WebGPU is optional when supported.

A new Decision Gate is required only for a material change from this approved direction: a substantially different engine/framework stack, paid service or API, material privacy/data collection, licensing/copyright risk, meaningful recurring cost, or removal of cumulative player behaviour. Normal incremental PlayCanvas renderer/asset/animation improvements do not require another stack approval.
