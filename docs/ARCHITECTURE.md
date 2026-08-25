# Architecture

## Current shape

The baseline intentionally uses a small static-web architecture:

```text
index.html
  ├─ src/styles.css
  └─ src/main.js
       └─ src/game-core.js
```

### `src/game-core.js`

Pure combat domain logic:

- directions and input mapping;
- enemy definitions and attack patterns;
- timing phases and transitions;
- parry, perfect-parry, damage, counter, progression, victory, and defeat;
- event queue and serialisable snapshots.

It has no DOM, WebGL, AudioContext, or browser dependency and is covered by Node tests.

### `src/main.js`

Browser integration:

- WebGL shaders, matrices, procedural cube geometry, arena, combatants, and katana;
- pointer gesture capture;
- HUD and modal updates;
- generated Web Audio feedback;
- camera shake, hit stop, flash, and weapon animation;
- mapping domain events to presentation.

### `src/styles.css`

Mobile-first full-screen presentation, safe areas, directional zones, HUD, title/result screens, and reduced-motion handling.

## Architectural boundaries

- New combat rules belong in the pure core before presentation.
- Rendering must consume snapshots/events rather than mutating combat state directly.
- Input adapters convert gestures to domain directions; they do not decide hit results.
- Audio and haptics are optional feedback. Gameplay cannot depend on them.
- Frame rate must not alter combat timing; all transitions use elapsed milliseconds.

## Evolution guidance

Do not prematurely split the app into many framework components. Introduce a new module only when one of these conditions is met:

- it has independent state and tests;
- `main.js` becomes difficult to reason about safely;
- the subsystem has multiple implementations, such as adaptive rendering or accessibility input;
- a measurable performance boundary requires isolation.

Likely future modules:

```text
src/
  combat/
  encounters/
  rendering/
  input/
  audio/
  accessibility/
```

A framework or game-engine migration requires a Decision Gate comparing migration cost, mobile performance, testability, and preservation of the current interaction model.
