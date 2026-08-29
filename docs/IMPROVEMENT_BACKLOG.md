# Improvement Backlog

Candidate pool, not a fixed roadmap. Every run re-evaluates against exact-head CI/Preview, PR findings, current SOT and strongest self-observable runtime evidence. Device feedback is supplemental but can override an automated conclusion when it reveals a real defect.

## Recently delivered

- Runs 002–020: readable combat motion, renderer correctness, posture/guard break, mastery, Crimson Shogun, Guided Duel, STEP/spacing, impact choreography, elapsed-time motion and PlayCanvas production renderer.
- Runs 021–029: local 19-joint skinned samurai, direction/stage silhouettes, physical-phone readability repair, actual four-direction blade-tip paths, Perfect Parry auto-riposte and Blood Moon integrity.
- Runs 030–040: gameplay guide/Ronin lesson, Perfect STEP, phase-priority repair, first-person two-hand grip, local run analysis and repeatable Ronin practice with browser hardening.
- Runs 041–050: optional 刀路清晰, direct Shogun practice, mobile Combat UX/Pause hardening, Shogun phase signature and top-right Pause restoration.
- Runs 052–054: rejected broken runtime joint override, restored usable baseline, and removed mistaken human-test HOLD.
- Runs 055–061: authored four-direction animation pack, continuous Attack* pipeline, fixed Sword→HandR grip, lateral side-read repair, same-draw PlayCanvas pose evaluation and bounded forward commitment.
- Run 062: optional default-off 節拍提示 using authoritative telegraph/Perfect timing.
- Run 063: made default-off 節拍提示 truly DOM-idle; exact-head browser gate then exposed a harness scheduling blocker.
- Run 064: repaired the timing-assist browser harness without weakening its default-off off/on/off mutation contract; exact-head CI #98 and Vercel returned green.
- Run 065: repaired the remaining owner animation P1 with authored player-facing `Guard` plus explicit player-screen RIGHT/LEFT cut-travel semantics and enemy-only horizontal mirroring.
- Runs 066–067: restored exact-head SOT verification after wording drift, then replaced the brittle sentence-literal smoke with section-scoped semantic invariants so harmless editorial rewrites cannot consume another blocker run.
- Run 068: added four pooled full-blade afterimages sampled from the actual authored Sword transform, strengthening cut/follow-through readability without steering the weapon or changing combat.

## Highest priority — autonomous visual/runtime acceptance

1. **Guard + four cuts self-inspection** — inspect exact Preview/runtime evidence at normal speed. Confirm the initial blade line visibly points at the player, all four authored cuts stay coherent through body/arms/Sword, RIGHT/LEFT read as screen-space travel, and full-blade afterimages remain subordinate to the real blade. Refine only concrete defects; never return to per-frame Chest/arm/HandR overrides.
2. **Ronin/Shogun repeated practice evidence** — use real Stage 2/4 practice plus local stage analysis to separate reading, missed counters, STEP misuse, raw timing pressure and Blood Moon pressure before changing balance.
3. **Perfect Parry / Perfect STEP clarity** — keep their rewards visibly distinct: Perfect Parry builds posture; Perfect STEP does not and requires spacing to escape reach.
4. **Timing-assist coexistence** — keep optional/default-off, subordinate to the real blade, correct through Ronin feints, pointer-transparent and DOM-idle when off.
5. **First-person grip readability** — ensure hands/forearms improve embodiment without covering enemy blade reads or making directional parry/counter motion noisy.
6. **STEP + blade-read + Pause layout** — maintain quiet HUD, top-right bounded Pause, reachable adjacent top/right parries, lower-right STEP and optional rails/ring without overlap.
7. **Performance evidence** — tune shadows/material/pixel ratio only from concrete browser/runtime evidence; physical-phone heat/frame evidence remains valuable but not mandatory.

## High-value candidates after core acceptance

- Evidence-based difficulty refinement: tune one bounded Ronin/Shogun rhythm/window/phase pressure only if repeatable practice/runtime evidence shows a wall.
- Accessibility: left-handed layout and broader motion controls. Do not duplicate 刀路清晰 or 節拍提示 as another overlay system.
- Challenge mode: bounded endless/seeded pressure with mastery-aware scoring and clean restart.
- Further Shogun motion/phase refinement only from concrete readability/performance evidence.
- Deeper first-person weapon fidelity only if current two-hand silhouette stays readable and performant.

## Data / telemetry Decision Gate

Remote gameplay collection remains unapproved. Current practice, mastery and run-analysis are local-only. Before any backend implementation, define minimum anonymous schema, explicit raw-input/device-ID exclusions, retention/deletion, backend/secrets, player notice/consent/opt-out, test-session handling and the dashboard/AI output that justifies collection. Until approved, send no gameplay records remotely.

## Technical opportunities

- Compact performance readout only if needed for 60 Hz tuning.
- KTX2/Basis only when textures and memory/transfer evidence justify it.
- Deterministic replay only if combat complexity exceeds current focused regressions.
- PWA/offline shell only after renderer/asset loading stabilises.

## Avoid until justified

- Multiplayer, accounts/cloud saves, monetisation, inventory/open-world expansion.
- React migration solely to host the renderer.
- Physics engine without a gameplay requirement.
- Downloaded 3D assets without explicit provenance/licence review.
- Retiring primitive/WebGL2 fallbacks before self-verification is strong enough.
- Test/refactor work that does not protect a demonstrated risk or unlock player-visible value.
