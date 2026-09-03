# Regression Checklist

Run before accepting an evolution implementation. Current mobile acceptance viewport is 320×568 CSS pixels.

## Startup / layout / input

- [ ] App loads without JS errors; Start remains usable inside 320×568 and safe areas.
- [ ] Guided Duel, 刀路清晰, 節拍提示, 練浪人 / 練鬼 / 練將軍 / 練血月, 連戰試煉 and 今日陣 remain reachable without pushing 拔刀 off-screen; the shared selector stays in bounds with all six entries.
- [ ] STEP/range/feedback follow the selected lower safe corner: right remains default, left-hand mode mirrors only the footwork cluster to the lower-left, and both layouts stay fully inside the 320×568 safe area without obstructing centre/bottom/opposite parry regions.
- [ ] Pause remains a bounded 44×44 top-right HUD control; its own hit is isolated and immediately adjacent top/right canvas taps still map correctly.
- [ ] Portrait top parry extends to 42% height; left/right/bottom retain 28%; nearest edge wins overlaps; centre stays neutral; landscape stays symmetric 28%.
- [ ] Top/right/bottom/left taps and swipes map correctly; one gesture cannot trigger both; mouse fallback works.
- [ ] STEP captures/rejects dragged pointers correctly and leaves later canvas pointer state clear.
- [ ] 刀路清晰 / 節拍提示 / impact / challenge 氣勢 / 宿敵步速 / 今日陣 overlays remain pointer-transparent.

## Pause / guide / accessibility

- [ ] Pause freezes game-time phase/timing/animation; 玩法 returns to still-paused state; resume has no catch-up; restart/home reuse normal paths.
- [ ] Guided Duel observes real Stage 1 read → parry → manual counter; evade-only clear does not persist completion; wrong-direction/time and feints are explained contextually.
- [ ] 刀路清晰 follows displayed/final feint direction, strengthens at strike, clears after resolution, suppresses duplicate centre cue and stays static under reduced motion.
- [ ] 節拍提示 uses authoritative telegraph progress, displayed/final direction and existing Perfect boundary; it never changes combat rules or creates a second clock.
- [ ] With 節拍提示 off, engine updates cause zero timing-assist DOM mutations after setup; toggle-off clears once and later updates remain idle.
- [ ] Blocked localStorage is non-fatal for all local preferences/best-run state, including challenge best and optional PB splits.

## Combat / STEP / progression

- [ ] Correct-direction parry remains legal throughout strike. A bounded near-contact late-telegraph buffer accepts only after the final direction is resolved, resolves at strike contact as a normal parry and can never become Perfect; earlier telegraph input, unresolved feints, wrong directions and input after the strike window still fail.
- [ ] Enemy hits cause damage; health/posture never becomes invalid; only one manual counter lands per opening.
- [ ] Parry raises enemy posture; Perfect raises faster; guard break gives exactly +2 next valid manual counter and resets correctly.
- [ ] Incoming hits build player posture; heavy hits build faster; player guard break adds +1 to that hit and resets; successful parry relieves one point.
- [ ] Perfect Parry immediately deals 1 auto-riposte damage, builds posture and normally leaves one manual counter; normal parry—including a buffered near-contact guard—does not auto-attack.
- [ ] Stage start/restart begins mid distance. Normal STEP works only in bounded early strike and only evades if reach is escaped. Heavy/long attacks still track at far distance.
- [ ] Perfect STEP remains narrower, deals exactly 1 auto-riposte damage, adds no posture and normally leaves one manual counter. Blood Moon/defeat closes that opening immediately.
- [ ] Ashigaru → Ronin → Oni → Crimson Shogun campaign progression remains intact; stage transition/restart resets combat state and distance.
- [ ] 練浪人 starts the unchanged real Stage 2 and ends there; 練鬼 starts the unchanged real Stage 3 Oni Guard (8 HP / posture 5 / existing heavy attacks) and ends there; 練將軍 starts real Stage 4 Phase I, keeps the normal Blood Moon transition and ends there. All three practice routes keep retry/campaign handoff correct and never write campaign personal best.
- [ ] 練血月 starts real Crimson Shogun Phase II directly at 6 HP, posture 7 and the unchanged Blood Moon attack/timing profile; it skips the normal +300 Phase I→II transition reward, cannot trigger that transition a second time, ends after Stage 4, supports 再戰血月 / full-campaign handoff and never writes campaign personal best.
- [ ] 連戰試煉 starts exactly 8 stages, preserves HP/score across waves, uses bounded pressure rematches only at Stages 4–7, reaches the real Crimson Shogun/Blood Moon at Stage 8, keeps retry inside challenge and restores the normal four-duel roster on campaign handoff.
- [ ] 今日陣 is challenge-only and deterministic for the same local `YYYY-MM-DD`: Stages 1–3 and Stage 8 remain unchanged, Stages 4–6 are a permutation of the existing three pressure rematches, Stage 7 stays Ronin Master, and only attack opening order rotates. HP/posture/gap/recovery/Perfect/telegraph/strike/damage/heavy values remain identical to each source pressure definition; standard challenge/campaign/practice restore unchanged.
- [ ] Challenge 氣勢 is challenge-only: one hitless clear shows 1/2 momentum, any real `player-hit` emitted through the composed CombatEngine path breaks the chain, two consecutive hitless clears reset momentum and trigger exactly one 不屈 reward—+1 HP when damaged or +300 challenge score at full HP. If a full-health final-wave rally and victory are drained together, the post-rally score is authoritative in engine state, victory/result data and challenge-best persistence. Campaign/practice HP, score and timing remain unchanged.
- [ ] Challenge 宿敵步速 is observation-only: it reads the authoritative cumulative challenge score after same-wave rewards/choices, never adds or removes score/HP, never pauses/advances the combat clock, and cannot change challenge ranking, enemy definitions, input, STEP/parry or campaign/practice state.

## Direction / animation / presentation

- [ ] **Before the first attack and during neutral gap/stage-intro, authored `Guard` is active and the actual Sword world axis points strongly toward the player/camera.** Sword stays directly parented to HandR.
- [ ] **Enemy RIGHT/LEFT use player-screen cut travel:** RIGHT starts screen-left and travels screen-right; LEFT starts screen-right and travels screen-left. Only opponent horizontal presentation is mirrored; player input/parry/counter direction stays direct.
- [ ] Telegraph body/blade motion matches all four incoming directions; Ronin feints switch to the final authored direction without generic Windup contamination.
- [ ] Normal telegraph → strike → recovery stays on one Attack* track; interrupted recovery selects Parry. No Run-52-style per-frame Chest/arm/HandR override and no normal runtime Sword rotation returns.
- [ ] All four actual blade-tip paths advance toward/cross the player-facing parry plane and follow through; RIGHT/LEFT travel in their declared screen direction; top cuts down; bottom rises.
- [ ] Authored mode keeps Sword/HandR orientation locked; whole-model depth assist stays within its bound; tip trail follows actual history; full-blade afterimages sample only actual Sword history, stay bounded/reused and disappear under reduced-motion.
- [ ] Player first-person katana remains visibly held by two hands/forearms and parry/counter animation follows direct input direction.
- [ ] Normal/perfect parries, counter, guard break and incoming hit feedback remain visually distinct without covering blade reads; reduced motion preserves readable static/contact cues.
- [ ] Four baseline stage identities and Shogun Phase I/Blood Moon signature presentation remain distinct without changing hit/timing/reach/damage. Challenge/今日陣 rematches resolve presentation from the current enemy id—not the 8-wave ordinal—so Waves 4–8 reuse Ashigaru → Ronin → Oni → Ronin → Shogun authored silhouettes/palettes while CombatEngine keeps its real progression index.
- [ ] Live fight remains quiet: no persistent READ/PARRY/footer/block-zone/arena clutter; detailed instructions stay behind 玩法.
- [ ] Challenge 氣勢 badge appears only during challenge, stays inside the 320×568 viewport, remains pointer-transparent, does not cover the blade-read centre, hides at terminal/campaign handoff, and the terminal challenge strip reports total 不屈 triggers.
- [ ] Challenge 宿敵步速 badge appears only during challenge/今日陣, stays inside the 320×568 viewport below the top-right HUD, remains pointer-transparent, displays a signed PB delta only when the stored best has a valid split for that wave, and hides at terminal/campaign handoff.
- [ ] 今日陣 shows only a compact pointer-transparent dated intro banner before the first telegraph and pressure-stage title identity; the intro banner clears before live blade reading and the terminal strip identifies the date-keyed run without adding non-challenge combat clutter.
- [ ] 練血月 immediately uses the existing Blood Moon Phase II atmosphere/presentation, not a duplicated visual state, while the direct-practice score starts without the normal transition bonus.
- [ ] Result **分享** stays off the live-combat HUD, is bounded to its own ≥44 px result-screen target inside the 320×568 safe viewport, and does not make campaign/practice/challenge/今日陣 terminal content taller.

## Mastery / privacy / performance

- [ ] Mastery/result analysis does not alter combat. Campaign victory shows 0–100 + S/A/B/C/D; defeat remains D with stats.
- [ ] Automatic riposte damage contributes to total damage but never inflates manual counter count/damage coaching.
- [ ] Campaign/direct-practice result analysis derives **四向防守** only from authoritative incoming `strike` direction plus successful parry/STEP and `player-hit` outcomes, highlights the lowest observed defense rate, remains result-only, and omits the extra map when the run contains more than four stages so 連戰/今日陣 terminal layout stays unchanged.
- [ ] Direct-practice **修行進度** is session-only and route-isolated: first completion prompts a same-opponent repeat; the next completion compares authoritative four-direction defense rate, hits taken and manual-counter conversion with only the immediately previous attempt for that route. Refresh clears the comparison, switching practice opponents does not cross-contaminate snapshots, and campaign/challenge terminals hide it.
- [ ] Practice results stay distinctly labelled by route (`RONIN / ONI / SHOGUN / BLOOD MOON PRACTICE`) and never read/overwrite campaign personal best; worse campaign runs do not overwrite better best.
- [ ] Challenge results are distinctly labelled, store only the separate local best record ranked by waves/score, and never read/overwrite campaign personal best. The same record may optionally contain monotonic per-wave cumulative score splits; legacy records without splits remain valid, malformed split arrays are ignored, and retry/campaign handoff preserve isolation.
- [ ] Challenge 氣勢/不屈, 戰前抉擇 and 宿敵步速 introduce no new persistence key, account, identifier or remote record. Only a better challenge result may write optional PB splits into the existing challenge-best key.
- [ ] 今日陣 adds no persistence key, account, remote identifier or network request. It intentionally reuses the existing local challenge best, challenge momentum/tactics and PB split comparison; its date key is run-local only.
- [ ] 練血月 adds no persistence key, account, network request or practice-only boss definition; it reuses the real Phase II definition and established local practice isolation.
- [ ] Result sharing reads only already-rendered terminal text on an explicit tap, strips query/hash from the shared page URL, treats native-share cancellation as non-error, falls back to local clipboard copy when needed, and creates no identifier/persistence/analytics/background gameplay request.
- [ ] No login, analytics, tracking, advertising, paid API, remote identifier or new gameplay backend is introduced without approval.
- [ ] Timing remains elapsed-time based; no unbounded entity/listener/particle/timer/audio-node/animation-loop growth is introduced.
- [ ] Generated base character stays lightweight and attack pack remains animation-only/local/reproducible.

## Delivery gates

- [ ] `npm test` passes, including bounded late-telegraph parry-buffer boundary/feint/Perfect-isolation coverage, direct Stage 2/3/4 Phase I practice activation/terminal isolation, direct Blood Moon Phase II entry/terminal identity with no transition-score grant, challenge roster/best/lifecycle, legacy challenge-best compatibility + validated per-wave split persistence/PB-delta logic, deterministic 今日陣 same-date roster/order + unchanged pressure values + standard-mode restoration, composed real-CombatEngine `player-hit` → momentum-break → clean-wave-rebuild, heal/full-health-score/campaign-isolation, final-wave full-health +300 terminal-score-authority regressions, four-direction run-analysis accounting for parry/STEP/hit outcomes, same-opponent practice-progress comparison logic, and result-share payload/native/fallback behavior.
- [ ] `npm run test:browser` passes.
- [ ] Production browser smoke initializes PlayCanvas primary, keeps WebGL2 fallback, Start control, mastery, boss, onboarding, footwork, impact and the full six-entry practice/challenge selector inside the shared 320×568 start layout, plus 刀路清晰 and 節拍提示.
- [ ] Combat UX smoke proves real 320×568 Start/parry/Pause freeze/玩法/resume/restart/home flow; it also selects and persists left STEP mode, starts the real duel, measures STEP/range/feedback inside the safe viewport, and re-proves unchanged swipe directions plus top-right Pause/parry routing.
- [ ] Renderer contract samples actual ready-state Sword axis and fails unless Guard points at player; proves player-screen RIGHT left→right and LEFT right→left; proves grip lock, actual-Sword multi-pose afterimage history, telegraph→strike→parry→counter and all directional player-facing cuts.
- [ ] Focused 320×568 heavy-attack PlayCanvas gate drives the real Oni heavy `AttackTop` through telegraph → strike → recovery → gap, requires the heavy load/drive/follow pass to activate and clear, keeps the authored Sword directly on HandR with grip lock + real-blade read trail/finite tip diagnostics, and proves a normal Ashigaru telegraph leaves heavy weighting fully inactive.
- [ ] Focused 320×568 challenge visual-identity browser gate renders the real pressure roster and requires Waves 4–8 to expose `ashigaru-jingasa → ronin-travel-wrap → oni-heavy-guard → ronin-travel-wrap → crimson-shogun-banner`, while proving the renderer restores the original 8-wave progression index after every draw.
- [ ] Timing-assist harness proves deterministic default-off idle and off/on/off lifecycle without relying on a top-level RAF promise.
- [ ] Mastery browser harness clicks 練浪人 / 練鬼 / 練將軍 and proves each real practice stage terminates after the selected duel, renders the correct opponent label/stage analysis, keeps campaign best isolated, supports same-practice retry and returns cleanly to Stage 1 campaign.
- [ ] Boss browser harness proves both the normal Phase I→II transition/restart/victory path and direct Blood Moon practice entering the real Phase II runtime/atmosphere at 6 HP without transition score; the production start-layout marker includes 練血月 in the six-entry 320×568 selector.
- [ ] Production practice orchestration gate first clicks the actual 320×568 start-screen 練浪人 / 練鬼 / 練將軍 controls and requires Stage 2 Ronin / Stage 3 Oni / Stage 4 Shogun Phase I respectively, with Blood Moon inactive and Pause → Home returning cleanly between launches. It then seeds only a deterministic Stage 2 campaign-result focus, clicks the generated 練浪人 action, requires the real production restart listener to enter Ronin practice, reach a real terminal defeat, retry the same opponent and hand off to clean Stage 1 campaign. Finally it returns through Pause → Home, clicks the real 練血月 control, requires the explicitly armed Shogun-practice Start chain to enter direct Blood Moon Phase II at 6 HP with 0 transition score, reaches real terminal retry, repeats direct Blood Moon and restores clean Stage 1 campaign through the existing handoff.
- [ ] Mastery browser harness clicks the real 連戰試煉 control, proves composed 8-stage activation, visible pointer-safe 氣勢 UI, first clean-wave stack, a real two-clean-wave +1 HP 不屈 reward, terminal 不屈 summary and 8-card analysis, keeps challenge best isolated from campaign best, exercises 再戰連陣 / 開始完整主線, and keeps terminal content plus both controls inside 320×568.
- [ ] Focused 320×568 challenge-rival browser gate starts from an existing eight-wave split PB, proves a visible behind split then an ahead split after the same-wave 不屈 score reward, persists eight authoritative monotonic splits after a better victory, reloads them on retry, and clears the badge on campaign handoff.
- [ ] Focused 320×568 run-analysis direction gate renders all four directions, identifies a synthetic left-side 50% weakness from strike/parry/STEP/hit events, stays in-bounds, proves an eight-stage terminal suppresses the extra map, then completes the same direct practice twice and shows an in-bounds **修行進度** comparison with the expected defense/hit/counter deltas.
- [ ] Focused 320×568 result-share browser gate proves the ≥44 px Share control stays in-bounds, native Web Share receives the visible terminal result/challenge progress/score with a clean URL, and clipboard fallback carries the same payload when native share is unavailable.
- [ ] Existing mastery, boss, onboarding, footwork, readability and impact browser harnesses remain green.
- [ ] CI configuration remains valid; Current Baseline, changelog, backlog, state and run log are updated with the implementation when their represented product/engineering state changes.
- [ ] Draft PR remains open/Draft/unmerged and contains one concise run comment with Before/After/verification/regression/risk/Preview.