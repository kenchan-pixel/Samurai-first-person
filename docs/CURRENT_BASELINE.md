# Current Baseline

Version: **0.13.0-evolution**

These capabilities are approved for the current evolution branch and cumulative. Future work may improve or replace their implementation, but must not silently remove user-facing behaviour. `main` remains the owner-approved production baseline until Ken merges Draft PR #1.

## Playable flow

- Mobile-first portrait start screen → four sequential duels → victory/defeat → restart without page reload.
- Three baseline enemies are followed by the Crimson Shogun boss.
- Touch, stylus and mouse input remain supported.

## Guided first duel

- First-time players may use the compact Guided Duel coach for **read the blade → directional parry → swipe counter** using the real combat event stream.
- Wrong-direction, wrong-time and feint guidance remains contextual; successful parries expose posture and guard-break opportunity.
- Clearing Ashigaru through STEP/evade counters without a demonstrated parry does not persist tutorial completion.
- Completion stores only a local preference; blocked storage is non-fatal and the start-screen toggle remains available.
- Boss entry/Phase II can provide brief rhythm-reset cues when guidance remains enabled.
- Coach/toggle remain pointer-safe and covered at 320×568.

## Core combat

- Four defensive directions: top, right, bottom, left.
- Edge tap attempts a matching directional block; correct timing/direction parries, with a smaller perfect-parry window.
- Four-direction swipe attacks are used for counters during recovery.
- Wrong direction/timing can result in damage; counterattack can land once per recovery opening.
- Enemy posture rises on parry, faster on perfect parry. Ashigaru/Ronin/Oni thresholds remain 3/4/5.
- Enemy guard break extends the counter opening and grants +2 damage to the next valid counter before posture resets.
- Incoming hits build player posture; heavy hits build faster. Player guard break at 4 adds +1 damage to that hit and resets posture.
- Successful parry relieves one player-posture point.

## Spacing and footwork

- Combat tracks close / mid / far engagement distance and shows a compact **近 / 中 / 遠** chip.
- Enemy attacks have reach/setup distance and can approach, retreat or sidestep before attacking.
- **STEP / 後撤** works only in the bounded early strike window, moves one distance step, and creates an evade-recovery opening only when the attack no longer reaches.
- Long/heavy tracking attacks still reach at far distance, so STEP does not replace directional reading/parry.
- Evade counter closes one distance step; stage start/restart resets to mid.
- Reduced-motion preference disables camera motion but not spacing/reach mechanics.
- Real STEP pointerdown/pointerup, capture/isolation and drag rejection remain browser-tested.

## Boss encounter

- **Crimson Shogun** is stage 4 with 12 HP and Phase I posture 6.
- At 6 HP or lower after a valid counter, Blood Moon Phase II triggers once, resets posture/attack cursor, creates an 1100 ms breathing gap and switches to faster/tighter pressure.
- Phase II posture is 7, perfect-parry timing tightens and the attack set changes.
- Boss blood-moon/ember atmosphere remains bounded, pointer-transparent and honours reduced motion.
- Phase II banner has an explicit bounded lifetime; restart restores Phase I; victory flows into mastery.

## Mastery and replay feedback

- Duel telemetry tracks parry attempts/success, perfect parries, guard breaks, counters, hits, damage and elapsed time without changing combat resolution.
- Victory produces a 0–100 mastery score and S/A/B/C/D grade; defeat remains D while still showing learning stats.
- Result screen shows mastery, parry accuracy, perfect parries, guard breaks, hits taken, clear time and numeric score.
- Better victories may replace a local personal best; worse runs do not. Storage failure is non-fatal.
- No account, network sync, analytics or external service is used.

## Enemy differentiation

- **Ashigaru Scout:** low HP, broad timing, simple attacks, low posture; mixes close cuts with a committed longer strike.
- **Wandering Ronin:** faster rhythm, feints, mixed directions, lateral footwork, close/mid reach.
- **Oni Guard:** heavy damage, shorter strike windows, higher HP/posture, strong tracking/heavy posture pressure.
- **Crimson Shogun:** multi-phase boss, higher posture resistance, heavy/feint signatures, Blood Moon ruleset shift and long-reach pressure.

## Presentation and visual identity

- **PlayCanvas Engine standalone remains the primary production-facing renderer.** It renders the perspective courtyard, directional/point lighting, shadows, first-person katana and enemy character.
- **The visible enemy is an original skinned glTF/GLB samurai once the local asset loads.** The generated model has layered lamellar armour, shoulder/waist plates, greaves, menpo, helmet/crest, hands and katana with a 19-joint skin hierarchy.
- The local GLB is generated deterministically at build time from `tools/generate-samurai-glb.mjs`; no downloaded model, texture or motion-capture pack is used. Provenance is recorded in `docs/ASSET_PROVENANCE.md`.
- The previous code-authored articulated PlayCanvas primitive remains a graceful character-level fallback if the GLB cannot load. The older custom single-pass WebGL2 renderer remains in `src/legacy-renderer.js` as renderer-level fallback while migration evidence accumulates.
- Enemy full-body framing remains materially farther back than the original near-camera presentation so helmet-to-feet silhouette and sword path stay readable in portrait.
- Stage identity continues through armour/cloth/accent palette and boss scale/atmosphere; the imported material groups are recoloured locally per stage without extra texture downloads.
- The skinned enemy uses real skeletal `Idle / Windup / Strike / Recovery / Parry` clips, while **direction-specific full-body choreography now reorients the whole rig for top/right/bottom/left attacks**. Right and left attacks visibly coil to opposite sides; bottom attacks lower the stance; top attacks retain the overhead read.
- A bounded in-world blade-read trail is attached to the skinned sword bone during telegraph/strike, so the actual moving weapon carries the cue rather than adding another HUD panel.
- Clip choice and sampling remain driven by the existing renderer-neutral combat snapshot. The directional body layer is presentation-only and cannot change hit/parry timing, reach, damage or encounter rules.
- Normal telegraph/strike/recovery poses continue to follow elapsed-time phase progress. A genuine parry maps interrupted recovery to the explicit `Parry` reaction clip; normal recovery maps to `Recovery`.
- Short clip transitions use bounded PlayCanvas blending while the destination clip begins at current combat progress, preventing the visual layer from redefining combat windows.
- Player parry/slash motion remains action-local and direction-aware; normal/perfect parry, counter, guard-break and player-hit DOM impact FX remain bounded and reduced-motion aware.
- Boss blood-moon presentation, range chip, posture HUD and Guided Duel remain additive DOM overlays and must not obstruct the opponent/body/blade read.
- Generated Web Audio and optional vibration remain interaction-triggered.

## Mobile performance baseline

- Gameplay and animation timing remain elapsed-time based rather than frame-count based.
- PlayCanvas rendering uses the rolling frame-time signal to adapt `graphicsDevice.maxPixelRatio` within a conservative mobile range; quality may fall before gameplay timing/responsiveness does.
- Adaptive quality never changes parry windows, strike timing, damage, engine updates, input mapping or encounter rules.
- The skinned character reuses one loaded scene hierarchy and animation component; no enemy entities, model assets or animation controllers are created per frame.
- Directional choreography reuses the same loaded rig and five clips; it adds only bounded root transforms plus one sword-bone trail entity, avoiding duplicate character assets or per-direction model downloads.
- The generated GLB remains about 315 KiB with about 1,972 triangles, 19 joints, 8 material groups and no texture payload. This is a deliberately conservative first mobile fidelity budget, not a final art ceiling.
- Headless Chromium/SwiftShader proves production bundle, model loading, skeletal clip selection, directional body mapping and combat mapping but cannot certify sustained 60 Hz, heat or final visual quality on a physical iPhone. Recent-phone performance remains the human acceptance gate.

## Technical baseline

- Deterministic combat rules remain isolated in `src/game-core.js`; boss, mastery, onboarding, footwork and impact remain additive adapters/observers.
- `src/main.js` owns gameplay/input/HUD orchestration and passes renderer-neutral snapshot values to `View`.
- `src/renderer.js` remains a narrow adapter: PlayCanvas primary, legacy WebGL2 fallback.
- `src/playcanvas-view.ts` owns the scene, local skinned-character loading/animation, stage style, direction-specific body/blade choreography, primitive character fallback, first-person katana and adaptive render quality.
- `src/animation-motion.js` remains renderer-independent and owns deterministic four-beat visual weights plus the authoritative parry-interruption smoothing rule.
- `tools/generate-samurai-glb.mjs` remains the auditable original model/rig/clip source. `vite.config.js` generates `public/assets/samurai-v1.glb` before Vite serves/builds the app; the generated binary is ignored by Git.
- Build/development uses Vite; Vercel builds the same `dist/` output.
- The real-app browser gate requires the PlayCanvas backend and drives one representative CombatEngine telegraph → strike → parry → counter sequence. It also requires the skinned GLB to load, verifies Windup → Strike → Parry skeletal clip mapping, and checks distinct right/left/bottom body reads plus the in-world sword trail in that same smoke path.
- Existing mastery, boss, onboarding, footwork and impact browser harnesses remain required at 320×568.
- PlayCanvas is the only runtime 3D dependency; no React, physics engine, account, analytics, network model service or paid API is introduced.

## Approved 3D direction

The PlayCanvas-first Decision Gate remains approved. The production path is **PlayCanvas + local generated glTF/GLB skin/animation**, with Blender-compatible glTF/GLB retained as the long-term asset interchange and KTX2/Basis available when textured assets justify it. WebGL2 remains the required compatibility baseline; WebGPU remains optional progressive enhancement.

A new human Decision Gate is required only if evidence points outside this approved direction or changes a material product/cost/privacy/licensing constraint.
