# Current Baseline

Version: **0.10.1-evolution**

These capabilities are approved for the current evolution branch and cumulative. Future work may improve or replace their implementation, but must not silently remove the user-facing behaviour. `main` remains the owner-approved production baseline until Ken merges the Draft PR.

## Playable flow

- Mobile-first portrait start screen → four sequential duels → victory/defeat → restart without page reload.
- Three enemies are fought sequentially as the original baseline sequence, followed by the Crimson Shogun boss.
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
- Reduced-motion preference disables the camera motion but not spacing/reach mechanics.
- Real STEP pointerdown/pointerup, capture/isolation and drag rejection are browser-tested.

## Boss encounter

- **Crimson Shogun** is stage 4 with 12 HP and Phase I posture 6.
- At 6 HP or lower after a valid counter, Blood Moon Phase II triggers once, resets posture/attack cursor, creates an 1100 ms breathing gap and switches to faster/tighter pressure.
- Phase II posture is 7, perfect-parry timing tightens and the attack set changes.
- Boss blood-moon/ember atmosphere is bounded, pointer-transparent and honours reduced motion.
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

- First-person WebGL2 combat view keeps the player katana in the near foreground and the opponent centred as the primary read.
- **Wide-framed enemy baseline:** the enemy is rendered materially farther back than the earlier near-camera presentation. The full body from helmet to feet remains visible in normal portrait framing, with more negative space around the sword path.
- The opponent retains the Run 014 procedural layered samurai armour and stage-specific silhouette language.
- The dojo retains stronger visual depth through a receding roof/gate, pillars, lanterns and perspective floor lines while keeping the centre combat lane clear.
- **Four-beat combat motion:** enemy attacks present a continuous **wind-up / swing / impact-follow-through / recovery** visual flow. Motion weights share matching boundary poses instead of resetting at each combat phase.
- **Phase-aware motion follow-through:** normal telegraph/strike/recovery frames now track the elapsed-time target directly rather than carrying a persistent smoothing delay. Fast 175–330 ms strike phases therefore keep their intended visual progression even after a slower frame.
- Only a materially interrupted strike → recovery transition (for example an early successful parry) keeps bounded multi-frame damping; a natural completed strike enters recovery directly because its visible boundary pose already matches.
- Enemy stance, torso, arms, hilt, sword trail and cape/weight shift are driven by the same elapsed-time motion frame so the whole body commits to the attack rather than only rotating the blade.
- Player parry and slash animation uses action-local elapsed progress; the foreground katana no longer depends on a wrapping global-clock animation that could visibly jump mid-action.
- Normal/perfect parries, counters, guard-break contacts and player damage keep bounded direction-aware contact FX. Reduced-motion removes traveling sparks/slashes but retains the contact ring/core.
- Impact nodes remain pointer-transparent, capped to three and self-cleaning.
- Boss blood-moon presentation, footwork range chip, posture HUD and Guided Duel remain additive overlays that must not obscure the enemy body/blade read.
- Generated Web Audio and optional vibration remain interaction-triggered; no external visual/audio assets are required.

## Mobile performance baseline

- Combat and animation timing continue to use elapsed time rather than assuming a fixed frame count.
- Normal animation frames are not recursively low-pass filtered; the render pose follows the current elapsed-time target so a dropped/slow frame catches up instead of accumulating extra visual latency.
- The renderer maintains a rolling frame-time estimate and adapts **internal render resolution only** within a bounded scale (approximately 1.0–1.6 device pixels per CSS pixel) to protect a 60 Hz-oriented phone experience under load.
- Adaptive resolution never changes parry windows, strike timing, damage, engine updates, input mapping or encounter rules.
- The motion controller reuses caller-owned state objects; no per-frame animation-node or DOM allocation is introduced by the four-beat choreography.
- Headless Chromium/SwiftShader can prove shader/runtime integration but cannot certify sustained 60 Hz on a physical iPhone. Recent-phone performance remains a human acceptance gate.

## Technical baseline

- Static ES-module web app with no runtime framework dependency.
- Combat rules remain isolated in `src/game-core.js`; boss, mastery, onboarding, footwork and impact are additive adapters/observers.
- Rendering remains isolated in `src/renderer.js`; `src/main.js` owns gameplay/input/HUD orchestration and passes render-state values into the renderer.
- `src/animation-motion.js` owns deterministic four-beat visual pose weights, phase-aware interrupted-recovery damping and bounded adaptive render-scale decisions; it does not mutate combat state.
- The renderer remains one bounded WebGL2 pass with procedural geometry/shading and no texture/model downloads, network calls, per-frame DOM allocation or third-party 3D engine.
- Browser smoke executes the real app under headless Chromium/SwiftShader and requires shader compile/link, enabled start control and `wide-samurai-v2` renderer initialization.
- Existing mastery, boss, onboarding, footwork and impact browser harnesses remain required at 320×568.
- Impact browser coverage runs under `prefers-reduced-motion` and proves ring feedback remains while sparks/slash travel are absent and cleanup remains bounded.
- GitHub Actions runs Node tests plus browser/WebGL integration on pull requests and pushes to `main`.

## Open 3D fidelity Decision Gate

The physical-phone review confirms that procedural shader art is still below the desired character fidelity. A rigged-model/open-source-engine path is now an **open Decision Gate**, not an approved stack migration. See `docs/3D_PIPELINE_DECISION_GATE.md`.

Until that gate is approved, the current static ES-module/WebGL2 architecture remains authoritative and no downloaded character pack or unverified third-party model may silently replace it.
