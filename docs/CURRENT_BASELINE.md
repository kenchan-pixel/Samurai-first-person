# Current Baseline

Version: **0.29.0-evolution**

This is the cumulative approved baseline on `autonomous-evolution`. `main` remains Ken-approved production until Draft PR #1 is manually merged. Future work may replace implementations but must not silently remove user-facing behaviour.

## Playable flow and controls

- Mobile-first portrait start screen → four sequential duels → victory/defeat → restart without page reload. Ashigaru, Wandering Ronin and Oni Guard lead into Stage 4 Crimson Shogun.
- Optional direct **練浪人 / 練將軍** practice launches the real Stage 2 / Stage 4 definitions, ends after the selected duel, supports immediate retry or return to the full campaign, and never writes campaign personal best.
- Optional local **連戰試煉** launches a bounded eight-duel endurance ladder. Stages 1–3 reuse the baseline Ashigaru/Ronin/Oni definitions, Stages 4–7 are pressure rematches with higher HP/posture and tighter existing attack timings, and Stage 8 is the real Crimson Shogun with the existing Blood Moon transition. Player HP and score carry across all eight duels; retry stays in challenge and **開始完整主線** restores the normal four-duel campaign.
- Challenge adds a local **氣勢 / 不屈** endurance loop without changing campaign combat: each hitless wave adds one of two momentum marks; taking a hit breaks the chain. Two consecutive hitless clears trigger **不屈**—heal 1 HP when damaged, otherwise award +300 challenge score—then momentum resets. A compact pointer-transparent challenge badge shows the chain/reward and terminal challenge progress reports total 不屈 triggers.
- Optional local **今日陣** starts the same eight-duel challenge with a player-local calendar key. Stages 1–3 and Stage 8 Shogun stay unchanged; Stages 4–6 deterministically permute the existing pressure rematches, Stage 7 remains Ronin Master, and the pressure-stage attack arrays only rotate their opening order. Timing, damage, reach, posture and reward values are unchanged. A compact intro date/banner and 今日陣 stage titles identify the variant; replay on the same date reproduces the same roster/order. It reuses challenge 氣勢/不屈 and the same local challenge best, introducing no new persistence, account or network surface.
- Touch, stylus and mouse remain supported. Four defensive directions and four-direction swipe counters are unchanged.
- Portrait parry regions are intentionally asymmetric for thumb reach: central top extends to 42% height; left/right/bottom retain 28% edge depth; nearest edge wins overlaps; centre remains neutral. Landscape keeps symmetric 28% mapping.
- A 44×44 Pause button stays in the top-right HUD safe area and owns only its own hit rectangle. Adjacent top/right canvas taps remain parry targets. Pause freezes game time, combat phase and animation; 玩法 returns to still-paused state; resume has no wall-clock catch-up.
- The start screen exposes a persistent **STEP：右手側 / STEP：左手側** preference. Right remains the default; left mirrors only the lower-corner STEP button, distance chip and STEP feedback. Screen-space parry/swipe directions and the accepted top-right Pause contract never mirror.

## Direction semantics and enemy blade baseline

- Gameplay directions are player-screen semantics. **RIGHT means the incoming enemy cut travels toward screen-right; LEFT travels toward screen-left.** Because the opponent faces the player, the renderer mirrors only the enemy horizontal presentation index (1↔3). Player tap/swipe direction and first-person parry/counter presentation remain direct and unchanged.
- The opponent uses an authored `Guard` in ready / stage-intro / gap. Its actual Sword world axis points strongly toward the player/camera before an attack starts; the Sword remains directly parented to HandR.
- The local animation-only `samurai-attacks-v1.glb` contains `Guard`, `AttackTop`, `AttackRight`, `AttackBottom`, `AttackLeft` on the shared 19-joint rig. Every directional attack starts from and returns to the same player-facing Guard.
- Pack-local `AttackRight/AttackLeft` names are historical opponent-rig labels; `src/enemy-screen-space-direction.js` is the sole horizontal semantic seam. No combat-rule direction values are rewritten.
- Normal telegraph → strike → recovery stays continuously on one authored `Attack*`; feints switch directly between authored directional tracks; interrupted recovery deliberately uses the base `Parry` clip.
- The rejected Run 52 pattern remains prohibited: no per-frame Chest/arm/HandR overrides and no normal runtime Sword rotation. HandR animation owns the fixed Sword grip. A bounded whole-model depth assist may advance the complete skinned character so the real blade reaches the player-facing parry plane.

## Guided Duel and combat clarity

- Guided Duel can coach read → parry → manual swipe counter from the real event stream. Evade-only Stage 1 clears do not persist tutorial completion. Wrong-direction/wrong-time/feint guidance stays contextual.
- The start screen has a complete **玩法** guide for parry, counter direction bonus, posture/guard break, STEP, Perfect STEP and Ronin feints. Stage 2 gives a short cue to wait for the final feint direction.
- Live combat is intentionally quiet: HP, stage/enemy and posture remain; persistent READ/PARRY copy, footer gesture text, block-zone labels and arena subtitle remain removed.
- **刀路清晰** is optional/default-off: four pointer-transparent edge rails follow displayed/final direction, strengthen at strike, clear after resolution, stay static under reduced motion, and do not change gameplay.
- **節拍提示** is optional/default-off: a hollow pointer-transparent ring shrinks from authoritative telegraph progress, follows displayed/final direction, shows the existing Perfect window then normal legal strike window, and clears outside telegraph/strike. It does not widen windows, change enemy timing/damage/reach/STEP/score/input or create a second clock. When disabled it performs no per-update timing frame derivation or DOM writes after its one-time off render; toggle-off clears once then remains idle.

## Combat rules

- Correct direction/timing parries; wrong direction/timing can fail and lead to damage. Each recovery accepts at most one manual counter.
- Enemy posture rises on parry and faster on Perfect Parry. Ashigaru/Ronin/Oni thresholds remain 3/4/5. Guard break extends the opening and gives exactly +2 damage to the next valid manual counter before posture resets.
- Incoming hits build player posture; heavy hits build faster. Player guard break at 4 adds +1 damage to that hit and resets posture. A successful parry relieves one player-posture point.
- **Perfect Parry** immediately performs a 1-damage automatic light riposte and builds enemy posture. The player may still swipe once in the same recovery unless that riposte triggers Blood Moon or defeat. The old later perfect-counter +1 is suppressed for that opening so the total normal perfect + opposite-direction follow-up budget stays approximately unchanged.
- Normal parry has no automatic attack and still requires the manual swipe counter.

## Spacing, STEP and Perfect STEP

- Engagement distance is close / mid / far with compact 近 / 中 / 遠 feedback. Enemy attacks have reach/setup and can approach, retreat or sidestep.
- Normal STEP works only in its bounded early strike window, moves one distance step and creates evade recovery only if the attack no longer reaches. It deals no automatic damage.
- Perfect STEP is a narrower subset (roughly first 48–68 ms depending on strike duration): 1 automatic sidestep-riposte damage, no enemy posture, normally one manual counter remains. If the auto-riposte triggers Blood Moon or defeat, the opening closes and no swipe follow-up is advertised/accepted.
- Long/heavy tracking attacks can still reach at far distance, so STEP is not universal invulnerability. Stage start/restart resets distance to mid.
- STEP defaults to the lower-right safe corner with phone-readable primary text and pointer capture/drag rejection. The persistent left-hand preference mirrors only this lower-corner footwork cluster to the lower-left safe corner; combat direction semantics remain fixed in screen space.

## Crimson Shogun

- Stage 4 campaign / Stage 8 challenge Crimson Shogun has 12 HP and Phase I posture 6. Any accepted player-damage source that leaves it at 6 HP or less triggers Blood Moon Phase II exactly once before another counter can resolve.
- Phase II resets posture/attack cursor, creates the existing 1100 ms breathing gap, uses posture 7, tighter perfect timing and a changed pressure set. Restart restores Phase I.
- Signature presentation remains presentation-only: deliberate Phase I heavy preparation; Blood Moon becomes lower, more forward and more directional with stronger crimson weapon/read-trail emphasis. Boss atmosphere remains bounded, pointer-transparent and reduced-motion aware.

## Mastery, analysis and local persistence

- Local-only mastery tracks parry attempts/success, Perfect Parries, guard breaks, manual counters, hits, damage and elapsed time. Victory gives 0–100 + S/A/B/C/D; defeat remains D while showing stats.
- Automatic Perfect Parry / Perfect STEP riposte damage contributes to `damageDealt`; `counters` remains manual swipe counters only.
- In-memory run analysis records per-stage parry accuracy, counter openings/manual counters, STEP use, hits/damage and clear state, with manual counter damage separated from auto-ripostes so coaching remains truthful.
- Result cards give one stage-focused tip; practice results are explicitly labelled and excluded from campaign best. Better campaign victories may replace local best; worse runs and practice do not.
- Challenge uses the same local mastery/run-analysis stream but stores a separate local challenge best, ranked first by waves cleared and then score. Challenge 氣勢/不屈 is run-local only; its heal/score reward is challenge-only and never reads or overwrites the campaign personal best.
- 今日陣 is a challenge variant, not a separate account/leaderboard mode: it reuses that same local challenge best and adds no storage key. Its date key is derived at run start and kept only for the active run so a retry reproduces the same formation.
- Storage failure is non-fatal. There is no login, network sync, remote gameplay analytics, advertising or remote identifier. Remote telemetry still requires a separate privacy Decision Gate.

## Presentation and renderer

- PlayCanvas standalone + Vite remains the primary renderer/build path; the older WebGL2 renderer remains compatibility fallback.
- Visible opponents use the original locally generated `samurai-v1.glb`: ~315 KiB, ~1,972 triangles, 19-joint skin, no texture payload, base clips `Idle/Windup/Strike/Recovery/Parry`.
- The animation-only Guard + four-direction pack is ~26 KiB and contains no mesh/texture/downloaded motion. It reuses the same skeleton and fixed Sword→HandR relationship.
- Stage-specific skinned silhouettes distinguish all four baseline enemies without changing reach/hitboxes/timing. Challenge pressure rematches reuse these existing stage identities rather than introducing new downloaded assets.
- The bounded world-space blade trail follows actual blade-tip history; all directional strikes advance toward/cross the player-facing parry plane and follow through before recovery.
- Authored strikes use four pooled **full-blade afterimages** sampled from the actual Sword world transform. They never steer the weapon or change combat state, retain only bounded historical poses, briefly carry into natural recovery, clear immediately outside that path, and are disabled under reduced-motion.
- The first-person player katana retains a bounded two-hand grip (forearms, hands, wrist guards, habaki, pommel) and direction-aware parry/counter motion without changing input or combat authority.
- Successful parry feedback combines audio/haptic/camera/impact; Perfect Parry is stronger. Impact effects and accessibility overlays remain pointer-transparent and bounded; reduced-motion suppresses travelling effects while retaining readable state cues.
- The challenge-only 氣勢 badge is compact, pointer-transparent and fixed below the top HUD only while challenge is active; it never changes screen-space input ownership or normal campaign HUD density.
- 今日陣 adds only a compact pointer-transparent dated intro banner, hidden by the first telegraph, plus stage-title identity on its pressure rematches; it does not add persistent live-combat clutter.

## Performance and technical authority

- Gameplay/animation timing is elapsed-time based. PlayCanvas adaptively caps pixel ratio from rolling frame time before timing/responsiveness is sacrificed.
- Skinned model, attack pack, stage identity, trails, full-blade afterimages, first-person grip and UI overlays reuse bounded entities/nodes; no unbounded gameplay-loop allocation, timer or network work is allowed.
- `src/game-core.js` remains deterministic combat authority. Boss, mastery, onboarding, footwork, Perfect Parry, Perfect STEP, practice, challenge, run-analysis, accessibility and renderer systems remain bounded adapters.
- `src/challenge-mode.js` owns only explicit challenge-run roster selection, local challenge result persistence and challenge UI. It may replace the engine roster only for a requested challenge run; normal campaign/practice definitions and combat direction/timing/damage authority remain untouched.
- `src/daily-challenge.js` owns only the player-local date key, deterministic ordering/opening-attack rotation of existing challenge pressure rematches, and its start/banner presentation. It composes only when `CHALLENGE_ACTIVE` is true and may not change attack values, campaign/practice definitions, score/momentum authority, persistence or network behaviour.
- `src/challenge-momentum.js` owns only challenge-run hitless-wave momentum and its bounded heal/score reward/UI. It may observe existing challenge/player-hit/enemy-defeated events and adjust challenge HP/score at wave clear, but may not alter campaign/practice state, attack timing, parry/STEP rules, direction mapping or renderer authority.
- `src/control-handedness.js` owns only the local STEP-side preference and footwork-cluster presentation. It may not rewrite tap/swipe/parry direction, combat timing, reach, damage or Pause placement.
- `src/main.js` owns gameplay/input/HUD orchestration. `src/renderer.js` composes PlayCanvas primary/fallback plus authored attacks, stage identity, blade trajectory, actual-Sword strike afterimages, mobile readability, player weapon fidelity and the enemy screen-space direction adapter.
- `src/authored-enemy-attacks.js` owns Guard/Attack* binding and continuous normalized authored sampling. `src/enemy-screen-space-direction.js` mirrors only opponent horizontal presentation. `src/blade-trajectory.js` samples the actual Sword/HandR pose and may apply only bounded whole-model depth assist in authored mode.
- Browser acceptance uses 320×568 mobile rendering plus real production CombatEngine paths. Renderer contract must fail closed if the ready Sword world axis is not player-facing, if player-screen RIGHT/LEFT travel is reversed, if grip-lock continuity fails, if the actual-Sword afterimage cannot retain multiple historical strike poses, or if a directional strike misses the player-facing plane.
- Timing-assist browser coverage must prove default-off DOM idleness, off/on/off lifecycle, telegraph shrink, feint/final direction, existing Perfect boundary, normal strike state, cleanup and pointer safety without relying on a top-level RAF wait in the `--dump-dom` harness.
- The production start-layout gate covers the four-entry practice/challenge selector including 今日陣 inside the same 320×568 viewport; deterministic Node coverage separately proves same-date daily roster/order, unchanged pressure rule values and clean restoration to standard challenge/campaign.
- Headless Chromium/SwiftShader can prove deterministic production/runtime invariants but cannot certify sustained physical-iPhone 60 Hz, heat or subjective sword feel. Device evidence is supplemental and may override automation when it exposes a real defect; absence of device testing is not a HOLD.

## Approved 3D direction

The PlayCanvas-first Decision Gate remains approved: **PlayCanvas + locally generated glTF/GLB skin/animation**, Blender-compatible glTF/GLB as long-term interchange, WebGL2 compatibility fallback, WebGPU optional. A new human Decision Gate is needed only for a material change in product direction, stack, cost, privacy, licensing or cumulative behaviour.
