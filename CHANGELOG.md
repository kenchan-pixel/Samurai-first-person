# Changelog

## 0.39.0-evolution — Perfect technique identity

- Reused the existing transient combat action-cue surface to give **Perfect Parry** and **Perfect STEP** visibly different technique identities after the authoritative event adapters resolve. Perfect Parry now keeps a cool clash/`破` treatment with explicit enemy-posture language; Perfect STEP keeps a green lateral/`閃` treatment with explicit no-posture/spacing language.
- The cue adapter changes no combat state or timing and adds no second timer. Normal parry/counter remain unchanged, the Perfect Parry auto-riposte counter cannot overwrite the Perfect Parry identity, and Perfect STEP Blood Moon/defeat variants do not advertise an unavailable follow-up swipe.
- Added deterministic event/copy/no-duplicate coverage plus a focused 320×568 production-action-cue browser gate proving distinct visual signatures, viewport bounds and pointer transparency.

## 0.38.0-evolution — Existing-timing attack rhythm readability

- Added a presentation-only **measured / standard / quick / heavy** rhythm layer derived from each exact current attack's existing authoritative telegraph/strike timing. Slow non-heavy cuts settle into a deeper held load; mid-tempo cuts remain neutral; genuinely quick cuts use a bounded forward snap and stronger real-blade read accent.
- Existing heavy attacks remain solely owned by the established heavy-weight pass. Combat phase durations, damage, parry/Perfect/STEP rules, final/feint direction authority, authored `Attack*` selection and the fixed Sword→HandR grip are unchanged.
- Added deterministic timing/profile/bounded-motion coverage plus a focused true 320×568 PlayCanvas gate proving measured → standard → quick → heavy coexistence, exact timing observation, authored grip/read-trail continuity and heavy-pass non-duplication.

## 0.37.0-evolution — Same-opponent practice progress

- Added a session-only **修行進度** row to direct-practice result analysis. The first completion prompts one repeat; a repeat against the same practice route compares authoritative four-direction defense rate, hits taken and manual-counter conversion with the immediately previous attempt.
- Ronin/Oni/Shogun/Blood Moon snapshots are isolated per route and exist only in page memory. Campaign/challenge terminals never show the row; refresh clears the comparison; no storage key, account, identifier, analytics, network request, score or combat balance change was introduced.
- Extended deterministic Node coverage and the existing focused 320×568 run-analysis browser gate to prove first-attempt prompting, second-attempt deltas and in-bounds result presentation.

## 0.36.0-evolution — Local result sharing

- Added a compact ≥44 px **分享** action to every terminal result surface so campaign, practice, challenge and 今日陣 results can be shared without adding another vertical result row.
- Native Web Share receives only the already-visible terminal result plus a query/hash-free game URL after an explicit player tap. Unsupported native share falls back to local clipboard copy; cancelling share is non-error. No account, identifier, persistence, analytics or background gameplay request is introduced.
- Added deterministic payload/native/fallback tests plus a focused 320×568 browser gate proving button bounds, native challenge-result sharing and clipboard fallback.

## Run 099 — Top/Bottom authored katana choreography continuity

- Refined only the deterministic authored `AttackTop` / `AttackBottom` body-arm-Sword arcs into connected cross-body vertical cuts while preserving the shared Guard endpoints, six-keyframe timing, player-facing contact path and fixed Sword→HandR grip.
- RIGHT/LEFT clips and all combat timing, input, damage, posture, STEP, persistence and network/privacy behavior remained unchanged; exact-head CI #145 and Vercel were green.

## Run 098 — Near-contact normal-parry tolerance repair

- Added a bounded final-telegraph guard commitment buffer derived from each opponent's existing Perfect timing, clamped to 60–110 ms so slower early-game cuts receive more mobile-input grace while Oni/Shogun/Blood Moon remain tighter.
- A buffered correct-direction guard resolves only when strike contact begins and is always a normal parry: it cannot earn Perfect, auto-riposte or the legacy Perfect damage budget. Earlier telegraph taps, unresolved feints and wrong final directions still fail.
- Enemy telegraph/strike durations, Perfect-window values, damage, posture, STEP/reach, direction mapping, renderer motion, persistence and network/privacy behavior are unchanged; focused deterministic tests cover the boundary, non-Perfect/manual-counter budget and feint protection.

## Run 096 — Bottom parry / STEP ownership repair

- Repaired the default right-hand STEP layout so the STEP button, range chip and feedback now live in the approved lower-right safe corner instead of occupying the bottom-centre parry lane; left-hand preference continues to mirror the same cluster into the lower-left safe corner.
- Kept input precedence explicit: the visible STEP button exclusively owns its own pointer stream, while the adjacent canvas remains available to directional parry/swipe input. Combat timing, parry/Perfect windows, STEP timing/reach, damage and direction semantics are unchanged.
- Expanded the true 320×568 production Combat UX gate across both handedness modes with real Bottom/Left taps, an adjacent Bottom probe beside STEP, STEP pointerdown→move→up isolation, and an immediate post-STEP Bottom tap that catches duplicate/stale pointer state.

## 0.35.0-evolution — 四向防守 weakness map

- Extended the existing in-memory run analysis with a compact **四向防守** result map for campaign and direct-practice runs. It counts the authoritative incoming `strike` direction, treats successful parry/STEP as defended and `player-hit` as failed defense, then highlights the lowest observed direction rate.
- Kept the slice coaching-only: no combat timing, damage, score, persistence, input, renderer or network authority changed. Eight-wave challenge/今日陣 terminals deliberately omit the extra map so their established 320×568 result layout stays unchanged.
- Added deterministic direction-accounting tests plus a focused 320×568 browser gate proving a left-side 50% weakness renders as four in-bounds direction cells and that an eight-stage terminal suppresses the map.

## 0.34.0-evolution — 師範弱點再練

- Turned the existing campaign result analysis into an actionable **師範建議 · 弱點再練** bridge. The focused Stage 2/3/4 result can now launch the already-authoritative Ronin/Oni/Shogun practice route in one tap; a Stage 1 focus restarts the full campaign from the real Ashigaru opening rather than inventing a practice-only Stage 1 copy.
- Recommended practice keeps the existing isolated mastery/best behavior. After one recommended duel the compact coaching row confirms completion and offers **再練一次**, while the established practice campaign-handoff control remains available.
- Added deterministic focus→route coverage plus a focused real 320×568 browser lifecycle proving a weak Stage 2 campaign result recommends Ronin, launches the real practice adapter, preserves campaign best, completes, retries the same opponent and keeps the new ≥44 px action inside the result viewport.

## 0.33.0-evolution — Direct Blood Moon Phase II practice

- Added **練血月** beside the existing direct dojo controls. It starts the real Crimson Shogun Phase II definition directly at the existing 6 HP Blood Moon threshold, posture 7 and unchanged Phase II timing/attack set; it deliberately does not award the normal +300 phase-transition score because the transition itself is skipped.
- Blood Moon practice remains inside the established Shogun practice lifecycle: it ends after Stage 4, uses a distinct `BLOOD MOON PRACTICE` result identity, supports **再戰血月** / **開始完整主線**, and never writes campaign personal best.
- Expanded the start selector to six entries in a compact 3×2 phone layout. The existing 320×568 start-layout gate now measures all six entries, while deterministic Node coverage and the existing boss browser harness prove direct Phase II runtime/atmosphere activation without changing campaign/challenge boss authority.

## 0.32.0-evolution — Direct Oni practice

- Added **練鬼** to complete direct practice for the three pre-boss campaign opponents. It launches the unchanged real Stage 3 Oni Guard (8 HP / posture 5 / existing heavy attacks), ends after that duel, and reuses the established practice retry / full-campaign handoff without a practice-only combat copy.
- Oni practice results now render a distinct `ONI PRACTICE` identity, Stage 3 / 鬼武者 analysis, and remain isolated from campaign personal best just like Ronin/Shogun practice.
- Expanded the production start selector to five single-row entries at the accepted 320×568 target and extended deterministic + browser integration coverage through 練鬼 entry → terminal → same-opponent retry → Stage 1 campaign handoff.

## 0.31.0-evolution — Challenge rival PB splits

- Added challenge-only **宿敵步速**: each cleared wave can compare the current authoritative cumulative score with the same-wave split from the stored challenge best, showing a compact signed lead/deficit without changing score, HP, combat timing or progression.
- Extended the existing `blade-reversal-challenge-v1` best record with optional validated monotonic `waveScores`; legacy `{won,wavesCleared,score}` records remain valid, malformed split arrays are ignored, and no new storage key/account/network surface was added. 今日陣 intentionally shares the same challenge PB/splits.
- Added deterministic split/PB compatibility coverage plus a focused real 320×568 browser gate proving behind/ahead feedback, same-wave 不屈 score authority, eight-split persistence after a better victory, retry reload and campaign isolation.

## 0.30.1-evolution — Challenge rematch visual identity repair

- Repaired an escaped renderer regression in 連戰試煉 / 今日陣: pressure rematches no longer inherit the Shogun look merely because their 8-wave progression index is 4–7.
- The renderer façade now projects presentation from the current enemy id while leaving the authoritative CombatEngine progression index untouched. Waves 4–8 therefore reuse Ashigaru → Ronin → Oni → Ronin → Shogun authored silhouettes/palettes in both PlayCanvas and the WebGL2 fallback.
- Added a focused real 320×568 PlayCanvas browser gate for the complete pressure-rematch identity sequence and explicit proof that renderer-only projection cannot leak back into gameplay progression state.

## 0.30.0-evolution — Challenge post-wave tactical choice

- Added three challenge-only **戰前抉擇** checkpoints after Waves 2/4/6. The stage-clear transition waits for one phone-friendly tap, then resumes the same CombatEngine progression path.
- **整息** restores up to 1 HP. **血誓** trades exactly 1 HP for +350 challenge score and is disabled at the last HP, creating a bounded risk/recovery decision that composes with existing 氣勢/不屈 without changing enemy timing, damage or campaign balance.
- Added deterministic resolver/adapter coverage plus true 320×568 今日陣 browser verification for in-bounds ≥44 px choices, exact HP/score effects, all three checkpoints, retry reset and campaign isolation. No persistence, account, network or inventory/economy surface was added.

## 0.29.0-evolution — 今日陣 deterministic daily challenge

- Added start-screen **今日陣**, a local calendar-keyed variant of the existing eight-duel challenge. The same local date reproduces the same pressure roster/order without accounts, network sync or a new persistence key.
- Stages 1–3 and Stage 8 Crimson Shogun remain unchanged; Stages 4–6 deterministically permute the existing pressure rematches, Stage 7 stays Ronin Master, and pressure attack arrays only rotate their opening order. HP/posture/gap/recovery/Perfect/telegraph/strike/damage values remain unchanged.
- 今日陣 reuses challenge 氣勢/不屈 and the same local challenge best, adds a compact dated intro/banner plus pressure-stage titles, and keeps the four-entry start selector inside the existing 320×568 layout contract.

## 0.28.0-evolution — Challenge momentum / 不屈

- Added challenge-only **氣勢**: each hitless wave fills one of two marks, taking a hit breaks the chain, and two consecutive clean clears trigger **不屈**.
- 不屈 restores 1 HP when the player is damaged; at full HP it awards +300 challenge score instead. The reward then resets momentum, keeping the eight-duel run deterministic without changing campaign/practice combat timing, damage, direction or boss rules.
- Added a compact pointer-transparent live badge, clearer challenge-entry copy, terminal 不屈 count, deterministic Node coverage and real 320×568 browser verification for the clean-wave stack, +1 HP rally, retry and campaign handoff.

## 0.27.0-evolution — Eight-duel challenge trial

- Added local **連戰試煉**, an eight-duel endurance ladder: the baseline trio opens the run, four bounded pressure rematches tighten existing HP/posture/timing values, and the real Crimson Shogun/Blood Moon closes Stage 8.
- Player HP and score carry through the full challenge; terminal results expose clean **再戰連陣** / **開始完整主線** handoff without mutating the normal four-duel campaign roster.
- Challenge mastery/run analysis stays local and writes only a separate waves-cleared/score best; campaign personal-best storage, combat timing, damage, input, renderer and privacy boundaries remain unchanged.

## 0.26.0-evolution — Persistent STEP handedness

- Added a start-screen **STEP：右手側 / STEP：左手側** preference that persists locally and defaults safely to the existing right-side layout.
- Left-hand mode mirrors only the lower-corner STEP button, distance chip and STEP feedback into the left safe area; player-screen parry/swipe directions and the top-right Pause contract remain unchanged.
- Added focused source/integration guards for production script ordering and ownership boundaries; no combat timing, reach, damage, boss, scoring, assets or network/privacy behaviour changed.

## 0.25.0-evolution — Actual-Sword strike afterimages

- Added four pooled full-blade afterimages sampled from the actual enemy Sword world transform during authored strikes, making real cut direction and follow-through easier to read without changing the weapon pose.
- Afterimages retain only bounded historical poses, briefly carry into normal recovery, clear outside the strike path, and are disabled under reduced-motion.
- Existing combat timing, player-screen direction semantics, HandR grip lock, blade-tip trajectory/depth assist, input, damage and privacy boundaries are unchanged.

## Run 067 — Semantic SOT verification hardening

- Replaced sentence-literal `CURRENT_BASELINE.md` smoke assertions with section-scoped semantic invariants for the four-duel roster and PlayCanvas/Vite/WebGL2 renderer architecture.
- Removed the duplicate four-duel sentence and restored concise renderer wording without changing any approved product or technical baseline.
- Kept all real Node, PlayCanvas/browser, mobile Combat UX, Guard-axis and player-screen RIGHT/LEFT acceptance gates unchanged.

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
