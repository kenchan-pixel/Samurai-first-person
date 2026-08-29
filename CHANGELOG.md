# Changelog

## 0.24.1-evolution — Player-facing guard and screen-space cut semantics

- Added an original authored `Guard` to the local animation-only pack. Ready/stage-intro/gap and every Attack* start/end share the same HandR-solved blade axis pointing strongly toward the player; Sword remains directly parented to HandR with no runtime Sword rotation.
- Defined gameplay horizontal directions as player-screen cut travel. RIGHT starts screen-left and cuts toward screen-right; LEFT starts screen-right and cuts toward screen-left. Only enemy horizontal presentation is mirrored; player input/parry/counter mapping is unchanged.
- Added deterministic generator/mapping coverage and a real PlayCanvas renderer gate that samples the actual ready Sword world axis plus screen-space RIGHT/LEFT travel.
- Combat timing, damage, parry/Perfect windows, STEP, posture, boss rules, score, persistence and network/privacy boundaries are unchanged.

## 0.24.0-evolution — Optional rhythm / timing assist
- Added default-off 節拍提示: authoritative telegraph shrink, Ronin displayed/final direction, existing Perfect-vs-normal strike timing, reduced-motion support and pointer-safe local-only presentation.

## 0.23.0-evolution — Authored four-direction enemy katana attacks
- Added original animation-only AttackTop/Right/Bottom/Left on the shared 19-joint hierarchy with continuous telegraph→strike→recovery and no rejected runtime joint overrides.

## 0.22.1-evolution — Top-right Pause repair
- Restored bounded 44×44 Pause to conventional top-right HUD and proved adjacent top/right canvas parries remain reachable.

## 0.22.0-evolution — Crimson Shogun signature phase language
- Added presentation-only Phase I heavy preparation and stronger/lower/more-forward Blood Moon motion and crimson weapon emphasis.

## 0.21.1 / 0.21.0-evolution — Pause hardening and Shogun practice
- Hardened Pause semantics/layout and added direct real Stage 4 Shogun practice with retry/campaign handoff and personal-best isolation.

## 0.20.0-evolution — Optional high-contrast blade-read mode
- Added default-off 刀路清晰 four-edge rails following telegraph → feint → strike without changing combat.

## 0.19.1 / 0.19.0-evolution — Ronin practice
- Added repeatable real Stage 2 practice and browser control-path/layout verification.

## 0.18.1 / 0.18.0-evolution — Local run analysis
- Added local per-stage result analysis and separated manual counter damage from automatic riposte damage for truthful coaching.

## 0.17.0-evolution — First-person two-hand katana
- Replaced floating weapon presentation with bounded forearms/hands/wrist guards/habaki/pommel attached to the existing katana rig.

## 0.16.1 / 0.16.0-evolution — Perfect STEP
- Added narrower Perfect STEP auto-riposte while preserving spacing limits/manual follow-up, then fixed Blood Moon/defeat phase-priority messaging.

## 0.15.1 / 0.15.0-evolution — Gameplay clarity and Ronin learning ramp
- Added phone-first 玩法, transient follow-up cues and final-direction Ronin lesson; repaired exact-head wording assertions without changing balance.

## 0.14.3-evolution — Perfect Parry / Blood Moon integrity
- Unified automatic riposte damage with the same boss Phase II HP threshold used by manual counter damage.

## 0.14.2 / 0.14.1 / 0.14.0-evolution — Real blade path and phone readability
- Added actual four-direction world-space blade-tip paths, bounded real trail, Perfect Parry auto-riposte, stronger parry clash/quieter HUD/STEP readability and distinct skinned stage identities.

## 0.13.0-evolution — Directional skinned combat readability
- Added distinct top/right/bottom/left full-body choreography and a bounded read trail on the actual skinned Sword.

## 0.12.2 / 0.12.1 / 0.12.0-evolution — Skinned samurai pipeline
- Added locally generated 19-joint skinned samurai with Idle/Windup/Strike/Recovery/Parry, repaired PlayCanvas animation binding and aligned CI smoke.

## 0.11.2 / 0.11.1 / 0.11.0-evolution — PlayCanvas production foundation
- Introduced PlayCanvas standalone + Vite primary rendering, WebGL2 fallback and real combat-motion browser verification.

## 0.10.1 / 0.10.0-evolution — Four-beat motion
- Added elapsed-time wind-up → swing → impact/follow-through → recovery, adaptive phone render scale and dropped-frame recovery correctness.

## 0.9.0-evolution — Wide-framed samurai visual redraw
- Improved opponent framing, samurai silhouette/armour and dojo depth for portrait blade-read space.

## 0.8.0-evolution — Directional impact choreography
- Added bounded direction-aware contact rings, slash afterimages and sparks with reduced-motion fallback.

## 0.7.1 / 0.7.0-evolution — Guided Duel / STEP integration
- Added close/mid/far spacing and timed STEP, then hardened onboarding/STEP integration and pointer flow.

## 0.6.1 / 0.6.0-evolution — Guided first duel
- Added optional read → parry → counter coaching with adaptive misses and local completion preference, plus lifecycle repair.

## 0.5.1 / 0.5.0-evolution — Crimson Shogun boss
- Added Stage 4 multi-phase Blood Moon boss and reduced-motion/browser lifecycle hardening.

## 0.4.1 / 0.4.0-evolution — Mastery
- Added 0–100 mastery, S/A/B/C/D, local best and browser/storage hardening.

## 0.3.0-evolution — Posture and guard break
- Added player/enemy posture, guard-break bonus and player guard-break consequence.

## 0.2.1 / 0.2.0-evolution — Animation/readability correctness
- Added phase-driven combat animation/trails and hardened renderer correctness with executable WebGL2 smoke.

## 0.1.0 — Initial playable baseline
- Mobile-first first-person WebGL dojo, directional parry/swipe combat, three enemies, progression, HUD/audio, tests, CI and evolution SOT.
