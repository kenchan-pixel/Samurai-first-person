# Current Baseline

Version: **0.14.2-evolution**

These capabilities are approved for the current evolution branch and cumulative. Future work may improve or replace their implementation, but must not silently remove user-facing behaviour. `main` remains the owner-approved production baseline until Ken merges Draft PR #1.

## Playable flow

- Mobile-first portrait start screen → **four sequential duels** → victory/defeat → restart without page reload.
- **Three baseline enemies are followed by the Crimson Shogun boss.**
- Touch, stylus and mouse input remain supported.

## Guided first duel

- First-time players may use the compact Guided Duel coach for read the blade → directional parry → manual swipe counter using the real combat event stream.
- Wrong-direction, wrong-time and feint guidance remains contextual; successful parries expose posture and guard-break opportunity.
- Clearing Ashigaru through STEP/evade counters without a demonstrated parry/manual counter does not persist tutorial completion.
- A Perfect Parry automatic riposte is a reward, not proof of the Guided Duel manual swipe-counter step.
- Completion stores only a local preference; blocked storage is non-fatal and the start-screen toggle remains available.
- Boss entry/Phase II may provide brief rhythm-reset cues when guidance remains enabled.

## Core combat

- **Four defensive directions:** top, right, bottom, left.
- Edge tap attempts a matching directional block; correct timing/direction parries, with a smaller perfect-parry window.
- Four-direction swipe attacks remain the normal/manual counter during recovery.
- Wrong direction/timing can result in damage; a manual counterattack can land once per recovery opening.
- Enemy posture rises on parry, faster on Perfect Parry. Ashigaru/Ronin/Oni thresholds remain 3/4/5.
- Enemy guard break extends the counter opening and grants +2 damage to the next valid manual counter before posture resets.
- Incoming hits build player posture; heavy hits build faster. Player guard break at 4 adds +1 damage to that hit and resets posture.
- Successful parry relieves one player-posture point.
- **Perfect Parry now immediately performs a 1-damage automatic light riposte.** The player may still swipe once during the same recovery opening. The previous +1 perfect bonus on the later manual counter is removed when the automatic riposte has fired, so the normal perfect-parry + opposite-direction follow-up damage budget stays approximately unchanged rather than stacking free damage.
- Normal parry does not auto-attack and still requires a manual swipe counter.

## Spacing and footwork

- Combat tracks close / mid / far engagement distance and shows a compact 近 / 中 / 遠 chip.
- Enemy attacks have reach/setup distance and can approach, retreat or sidestep before attacking.
- STEP / 後撤 works only in the bounded early strike window, moves one distance step, and creates an evade-recovery opening only when the attack no longer reaches.
- Long/heavy tracking attacks still reach at far distance, so STEP does not replace directional reading/parry.
- Evade counter closes one distance step; stage start/restart resets to mid.
- STEP remains in the lower-right safe corner outside the centre/bottom block region and right block region at the 320×568 acceptance viewport.
- The STEP primary label is now materially larger on phone; the tiny secondary label is removed, while distance/temporary feedback text is also enlarged.
- STEP pointer capture/isolation, drag rejection and gameplay semantics are unchanged.

## Boss encounter

- Crimson Shogun is stage 4 with 12 HP and Phase I posture 6.
- At 6 HP or lower after a valid manual counter, Blood Moon Phase II triggers once, resets posture/attack cursor, creates an 1100 ms breathing gap and switches to faster/tighter pressure.
- Phase II posture is 7, perfect-parry timing tightens and the attack set changes.
- Boss blood-moon/ember atmosphere remains bounded, pointer-transparent and honours reduced motion.
- Restart restores Phase I; victory flows into mastery.

## Mastery and replay feedback

- Duel telemetry tracks parry attempts/success, perfect parries, guard breaks, manual counters, hits, damage and elapsed time without changing combat resolution.
- Victory produces a 0–100 mastery score and S/A/B/C/D grade; defeat remains D while still showing learning stats.
- Result screen shows mastery, parry accuracy, perfect parries, guard breaks, hits taken, clear time and numeric score.
- Better victories may replace a local personal best; worse runs do not. Storage failure is non-fatal.
- No account, network sync, analytics or external service is used.

## Enemy differentiation

- Ashigaru Scout: low HP, broad timing, simple attacks, low posture; mixes close cuts with a committed longer strike.
- Wandering Ronin: faster rhythm, feints, mixed directions, lateral footwork, close/mid reach.
- Oni Guard: heavy damage, shorter strike windows, higher HP/posture, strong tracking/heavy posture pressure.
- Crimson Shogun: multi-phase boss, higher posture resistance, heavy/feint signatures, Blood Moon ruleset shift and long-reach pressure.
- The shared skinned GLB adds distinct stage silhouettes on the actual Head / Chest / Sword bones: jingasa Ashigaru, headband/sash Ronin, horned heavy Oni, and antler/sashimono Crimson Shogun.
- Identity parts are presentation-only and do not change reach, hitboxes, timing, parry windows or damage.

## Presentation and visual identity

- **PlayCanvas Engine standalone remains the primary production-facing renderer.** The older custom WebGL2 renderer remains the compatibility fallback.
- The visible opponent is an original locally generated skinned glTF/GLB samurai once the asset loads; the articulated primitive remains character-level fallback.
- The generated model has a 19-joint skin, layered armour and real `Idle / Windup / Strike / Recovery / Parry` clips. Combat authority remains renderer-neutral.
- Enemy full-body framing remains far enough back to keep helmet-to-feet silhouette and weapon path readable in portrait.
- Direction-specific body choreography remains additive, but **the weapon no longer relies on whole-body pose rotation to imply a cut**.
- On the production skinned path, top/right/bottom/left attacks now drive the actual `Sword` bone through a direction-specific **3D blade-tip trajectory**. During commitment, the opponent adds a bounded depth lunge, the katana points toward the camera/player, crosses a defined player-facing parry plane, follows through, then blends back into recovery.
- The old Run 026 bone-attached swing echoes are disabled by the new trajectory layer. A bounded set of reused world-space trail segments is built from the actual blade-tip history so the trail follows the real cut path rather than decorating an incorrect orientation.
- Telegraph/read glow still follows the real sword bone. No new model, texture, physics system or network asset is introduced.
- Successful parry feedback combines audio/haptic/camera/impact with direction-aware contact wash/ring/blade clash; Perfect Parry remains visibly stronger and now immediately transitions into the automatic player riposte animation/feedback.
- Live combat text stays intentionally quiet: passive edge labels/persistent gesture sentence remain hidden and critical direction cues remain larger than the original prototype.
- Reduced-motion continues to suppress traveling effects while preserving a short readable contact cue.

## Mobile performance baseline

- Gameplay and animation timing remain elapsed-time based rather than frame-count based.
- PlayCanvas adapts internal pixel ratio conservatively from rolling frame time; quality may fall before gameplay timing/responsiveness does.
- The skinned character reuses one loaded scene hierarchy and five clips; stage identity and blade trajectory reuse bounded entities and create no per-frame model/trail objects.
- The new world-space blade trail allocates a maximum of six segment entities once after character readiness and only repositions/reuses them during strike.
- Generated GLB remains deliberately lightweight (about 315 KiB / about 1,972 triangles / 19 joints / no texture payload).
- Headless Chromium/SwiftShader proves production initialization and deterministic renderer contracts but cannot certify sustained 60 Hz, heat or subjective sword feel on a physical iPhone. Direct-device evidence remains the human acceptance gate.

## Technical baseline

- `src/game-core.js` remains the deterministic combat authority; boss, mastery, onboarding, footwork, impact and Perfect Parry riposte are bounded adapters around that core.
- `src/perfect-riposte.js` adds the automatic 1-damage Perfect Parry riposte and suppresses the old manual perfect damage bonus only for that same opening. It deliberately exposes the automatic visual hit to the main runtime after onboarding/mastery observers have processed the raw event, so Guided Duel still requires a real swipe counter.
- `src/main.js` owns gameplay/input/HUD orchestration and passes renderer-neutral snapshot values to `View`.
- `src/renderer.js` keeps PlayCanvas primary / legacy WebGL2 fallback and composes stage identity, Run 026 readability, the world-space blade trajectory, and phone control readability.
- `src/blade-trajectory.js` is presentation-only: it overrides the real skinned Sword world orientation late enough to survive skeletal sampling, applies bounded strike depth, and reuses world-space blade-tip trail segments. It cannot change hit/parry timing or damage.
- `src/mobile-control-readability.js` enlarges STEP/range/temporary feedback presentation only; STEP mechanics remain in `src/footwork.js`.
- `tools/generate-samurai-glb.mjs` remains the auditable source for the local skinned model/rig/clips; Vite generates the binary for CI/Vercel.
- The real-app browser gate still requires PlayCanvas + the skinned GLB and drives a representative CombatEngine sequence. It now additionally verifies all four world-space blade paths move through the player-facing plane, the actual tip advances toward the player, world-space trail history is bounded, and the STEP primary label meets the phone readability floor.
- Focused Node coverage verifies Perfect Parry auto-riposte damage plus preservation of the manual swipe follow-up and unchanged normal-parry behavior.

## Approved 3D direction

The PlayCanvas-first Decision Gate remains approved. Production remains **PlayCanvas + local generated glTF/GLB skin/animation**, with Blender-compatible glTF/GLB as the long-term asset interchange. WebGL2 remains the required compatibility baseline; WebGPU remains optional progressive enhancement. A new human Decision Gate is required only if evidence points outside this approved direction or changes a material product/cost/privacy/licensing constraint.
