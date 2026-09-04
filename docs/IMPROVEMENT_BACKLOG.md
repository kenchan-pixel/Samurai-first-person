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
- Runs 069–072: live reduced-motion afterimage correctness, bounded Vercel rate-limit recovery, durable one-shot incident receipts and renderer-architecture SOT reconciliation.
- Runs 073–074: added persistent right/left STEP-side preference, then repaired left safe-area geometry and added real 320×568 production coverage.
- Run 075: added local **連戰試煉**, an eight-duel endurance ladder with pressure rematches, real Stage 8 Blood Moon boss, separate local challenge best and clean retry/campaign handoff.
- Run 076: hardened the real 320×568 challenge browser lifecycle, proving entry, all eight stages, independent best, eight-card analysis, retry/campaign handoff and terminal layout.
- Run 077: added challenge-only **氣勢 / 不屈** depth: hitless-wave momentum, chain break on damage, +1 HP recovery when hurt or +300 challenge score at full health, compact live feedback and terminal rally count.
- Runs 078–080: hardened real player-hit momentum break and final-wave +300 score authority through engine, terminal event, visible mastery result and challenge-best persistence.
- Run 081: added local **今日陣**, a player-local date-keyed challenge variant that deterministically permutes only existing pressure rematches and rotates their opening attack order while preserving all combat-rule values and the same challenge momentum/best surfaces.
- Run 082: added a true 320×568 browser lifecycle for 今日陣 covering real entry/banner cleanup, eight-stage terminal identity, same-date retry and campaign handoff.
- Run 083: added challenge-only **戰前抉擇** after Waves 2/4/6: one-tap 整息 (+1 HP) versus 血誓 (-1 HP, +350 score), with last-HP safety, parked stage transition and real 320×568 今日陣 integration coverage.
- Run 084: repaired tactical-choice pause timing so time spent reading the between-wave decision cannot fast-forward the next duel; resume now rebases the frozen remaining transition on the authoritative CombatEngine clock.
- Run 085: repaired challenge/今日陣 pressure-rematch presentation so Waves 4–8 reuse Ashigaru → Ronin → Oni → Ronin → Shogun authored identities by enemy id instead of collapsing all progression indexes ≥4 into the Shogun look.
- Run 086: added challenge-only **宿敵步速**. A stored challenge best may now carry cumulative per-wave score splits in the existing local key; challenge/今日陣 compare each clear against the matching PB split with a compact pointer-safe lead/deficit badge, while legacy bests remain valid and combat/scoring rules stay unchanged.
- Run 087: completed the direct-practice dojo with **練鬼**. It launches the unchanged real Stage 3 Oni Guard, ends after that duel, supports same-opponent retry / full-campaign handoff, labels Oni practice separately from Ronin/Shogun, preserves campaign best, and keeps the full five-entry start selector inside the existing mobile acceptance gate.
- Run 088: added direct **練血月**. It enters the real Crimson Shogun Phase II at the existing 6 HP threshold with unchanged Blood Moon posture/timing/attacks, skips the normal +300 transition reward because Phase I is intentionally bypassed, keeps practice-best isolation/retry/campaign handoff, and expands the mobile selector to six entries with a cumulative 320×568 gate.
- Run 089: added **師範弱點再練** on normal campaign results. The existing stage-focused analysis now offers one-tap routing into the real Ronin/Oni/Shogun practice for a Stage 2/3/4 weakness, or a clean Stage 1 campaign restart for an Ashigaru focus; recommended practice completion keeps a same-opponent retry cue while preserving campaign best.
- Runs 090–091: converted the remaining practice orchestration review gaps into a true production-document 320×568 gate, then repaired the real **Pause → Home → 練血月** fallback by making the shared practice Start reset listener idempotent and explicitly arming the existing Shogun-practice launch contract before direct Blood Moon Phase II.
- Run 092: added result-only **四向防守** analysis for campaign/direct practice. It derives each direction from authoritative strike/parry/STEP/player-hit outcomes, highlights the weakest observed defense rate, stays compact at 320×568 and deliberately omits the extra map from eight-wave challenge/今日陣 terminals.
- Runs 093–099: repaired normal practice capture under the Blood Moon adapter, added and real-renderer-verified heavy-attack weight, restored exact-head Preview identity verification with `/build-meta.json`, moved default STEP out of the Bottom parry lane with 320×568 input coverage, added a bounded near-contact normal-parry buffer, and refined Top/Bottom authored two-handed katana choreography into connected cross-body vertical arcs while preserving combat timing and grip authority.
- Run 100: added the first local-only Closed Beta release-prep slice: a ≥44 px result **分享** action across campaign/practice/challenge terminals, native Web Share with clipboard fallback, a clean query/hash-free game URL and focused 320×568 coverage. It sends nothing automatically and adds no account, identifier, persistence or analytics.
- Run 101: added session-only **修行進度** to direct-practice results. The first duel prompts one repeat; later attempts against the same Ronin/Oni/Shogun/Blood Moon route compare authoritative defense rate, hits taken and manual-counter conversion with the immediately previous attempt, without persistence, identifiers, analytics, network calls or balance changes.
- Run 113: added presentation-only **攻擊節奏可讀性** from each exact current attack's existing telegraph/strike timing. Slow non-heavy cuts now visibly settle into a measured load, mid-tempo cuts remain neutral, genuinely quick cuts get a bounded snap/forward real-blade accent, and heavy attacks remain solely owned by the established heavy-weight pass; combat timing and feint authority are unchanged.
- Runs 114–118: replaced abrupt authored Ronin mid-telegraph hard cuts with a bounded 50 ms full-rig feint crossfade, then repaired stale/contaminated renderer acceptance until the real 320×568 clean Guard→direction and LEFT→RIGHT Ronin feint contracts passed without relaxing blade/grip/travel thresholds or changing combat timing.
- Run 119: added a **Perfect technique identity** pass on the existing transient action cue. Perfect Parry now ends on a cool clash/`破` treatment with explicit posture language, while Perfect STEP ends on a green lateral/`閃` treatment with explicit no-posture/spacing language; normal parry/counter and the Perfect Parry auto-riposte counter do not create duplicate technique identities, and combat rewards/timing are unchanged.
- Run 120: upgraded the first-person player katana support silhouette into a **direction-aware two-hand brace**. TOP raises the visible hands/forearms, BOTTOM lowers them, RIGHT/LEFT mirror a compact lateral brace, Perfect strengthens the same family and counters retain bounded follow-through; the authoritative player blade/root motion, input and combat rules are unchanged.

## Highest priority — autonomous visual/runtime acceptance

1. **Guard + four cuts + tempo self-inspection** — inspect exact Preview/runtime evidence at normal speed. Confirm the initial blade line visibly points at the player, refined Top/Bottom arcs and established RIGHT/LEFT cuts stay coherent through body/arms/Sword, measured/standard/quick rhythm reads match actual timing without overpowering the real blade, the accepted 50 ms Ronin feint crossfade keeps final direction readable, and full-blade afterimages remain subordinate. Refine only concrete defects; never return to per-frame Chest/arm/HandR overrides.
2. **Ronin/Oni/Shogun/Blood Moon repeated practice evidence** — use real Stage 2/3/4 Phase I/direct Phase II practice, local stage analysis, **四向防守**, session-only **修行進度** and campaign **師範弱點再練** to separate feint reading, direction-specific misses, Oni heavy-attack pressure, missed counters, STEP misuse, raw timing pressure, Phase I load and Blood Moon pressure before changing campaign balance. Require repeatable evidence, not a single bad run, before tuning difficulty.
3. **Challenge / 今日陣 pressure + momentum + tactics + 宿敵 evidence** — compare standard challenge and same-date 今日陣 over repeated runs. Check whether pressure order, hitless recovery, the three HP/score decisions and PB split feedback create meaningful endurance/replay decisions without flattening difficulty or obscuring blade reads. Tune challenge-only values/UI only from repeatable evidence.
4. **Perfect technique coexistence** — keep the Run 119 transient identities distinct and truthful: Perfect Parry builds posture; Perfect STEP does not and still depends on spacing. Refine only if the cue overlaps blade reads, misstates a closed opening or becomes visually redundant with existing impact/footwork feedback.
5. **Timing-assist coexistence** — keep optional/default-off, subordinate to the real blade, correct through Ronin feints, pointer-transparent and DOM-idle when off.
6. **First-person grip coexistence** — inspect the Run 120 directional two-hand brace at 320×568. Hands/forearms must improve embodiment without covering enemy blade reads, detaching visually from the katana or making parry/counter motion noisy; refine only concrete Preview/runtime defects.
7. **STEP + blade-read + Pause layout** — maintain quiet HUD, top-right bounded Pause, reachable adjacent top/right parries, persistent right/left STEP-side preference and optional rails/ring without overlap.
8. **Performance evidence** — tune shadows/material/pixel ratio only from concrete browser/runtime evidence; physical-phone heat/frame evidence remains valuable but not mandatory.

## High-value candidates after core acceptance

- Tactical-choice refinement only if runtime evidence shows the current 2/4/6 cadence, +1 HP safe option or -1 HP/+350 score risk option is trivial, confusing or dominant; do not expand it into inventory/economy/perks without a separate product need.
- 宿敵步速 refinement only if repeated challenge evidence shows the compact split badge is unreadable, distracting or not useful for replay decisions. Do not create online leaderboards/accounts/cloud sync without a separate product/privacy Decision Gate.
- Evidence-based difficulty refinement: after the bounded near-contact parry repair, tune at most one further Ronin/Oni/Shogun/Blood Moon rhythm/window/phase pressure only if repeated **修行進度** / 四向防守 evidence still shows a stable wall rather than normal run variance.
- Accessibility: broader motion controls only where they solve a concrete accessibility gap. Do not duplicate 刀路清晰 or 節拍提示 as another overlay system.
- Further Shogun motion/phase refinement only from concrete readability/performance evidence.
- Deeper first-person weapon fidelity only if the Run 120 direction-aware two-hand silhouette remains readable, attached and performant in exact Preview evidence.
- Closed Beta release prep may continue with player-visible feedback/bug-reporting and release-readiness surfaces only after the approved v0.5 baseline is reconciled into repository SOT. Keep leaderboard, remote telemetry, remote identifiers and backend writes behind the privacy/data Decision Gate below.

## Data / telemetry Decision Gate

Remote gameplay collection remains unapproved in repository SOT. Current practice, challenge, mastery, run-analysis, session-only practice progression and explicit result sharing are local/player-triggered only. Before backend implementation, reconcile the owner-approved Closed Beta v0.5 release baseline with this section and define minimum anonymous schema, explicit raw-input/device-ID exclusions, retention/deletion, backend/secrets, player notice/consent/opt-out, test-session handling and the dashboard/AI output that justifies collection. Until that repository SOT reconciliation is committed, send no gameplay records remotely.

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
