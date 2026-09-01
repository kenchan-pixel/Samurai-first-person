# Regression Checklist

Run before accepting an evolution implementation. Current mobile acceptance viewport is 320×568 CSS pixels.

## Startup / layout / input

- [ ] App loads without JS errors; Start remains usable inside 320×568 and safe areas.
- [ ] Guided Duel, 刀路清晰, 節拍提示, 練浪人 / 練將軍 and 連戰試煉 remain reachable without pushing 拔刀 off-screen; the shared selector row stays in bounds with all three entries.
- [ ] STEP/range/feedback follow the selected lower safe corner: right remains default, left-hand mode mirrors only the footwork cluster to the lower-left, and both layouts stay fully inside the 320×568 safe area without obstructing centre/bottom/opposite parry regions.
- [ ] Pause remains a bounded 44×44 top-right HUD control; its own hit is isolated and immediately adjacent top/right canvas taps still map correctly.
- [ ] Portrait top parry extends to 42% height; left/right/bottom retain 28%; nearest edge wins overlaps; centre stays neutral; landscape stays symmetric 28%.
- [ ] Top/right/bottom/left taps and swipes map correctly; one gesture cannot trigger both; mouse fallback works.
- [ ] STEP captures/rejects dragged pointers correctly and leaves later canvas pointer state clear.
- [ ] 刀路清晰 / 節拍提示 / impact overlays remain pointer-transparent.

## Pause / guide / accessibility

- [ ] Pause freezes game-time phase/timing/animation; 玩法 returns to still-paused state; resume has no catch-up; restart/home reuse normal paths.
- [ ] Guided Duel observes real Stage 1 read → parry → manual counter; evade-only clear does not persist completion; wrong-direction/time and feints are explained contextually.
- [ ] 刀路清晰 follows displayed/final feint direction, strengthens at strike, clears after resolution, suppresses duplicate centre cue and stays static under reduced motion.
- [ ] 節拍提示 uses authoritative telegraph progress, displayed/final direction and existing Perfect boundary; it never changes combat rules or creates a second clock.
- [ ] With 節拍提示 off, engine updates cause zero timing-assist DOM mutations after setup; toggle-off clears once and later updates remain idle.
- [ ] Blocked localStorage is non-fatal for all local preferences/best-run state, including challenge best.

## Combat / STEP / progression

- [ ] Correct timing+direction parries; wrong/early/late input does not become an unintended success/perfect.
- [ ] Enemy hits cause damage; health/posture never becomes invalid; only one manual counter lands per opening.
- [ ] Parry raises enemy posture; Perfect raises faster; guard break gives exactly +2 next valid manual counter and resets correctly.
- [ ] Incoming hits build player posture; heavy hits build faster; player guard break adds +1 to that hit and resets; successful parry relieves one point.
- [ ] Perfect Parry immediately deals 1 auto-riposte damage, builds posture and normally leaves one manual counter; normal parry does not auto-attack.
- [ ] Stage start/restart begins mid distance. Normal STEP works only in bounded early strike and only evades if reach is escaped. Heavy/long attacks still track at far distance.
- [ ] Perfect STEP remains narrower, deals exactly 1 auto-riposte damage, adds no posture and normally leaves one manual counter. Blood Moon/defeat closes that opening immediately.
- [ ] Ashigaru → Ronin → Oni → Crimson Shogun campaign progression remains intact; stage transition/restart resets combat state and distance.
- [ ] Shogun remains 12 HP / Phase I posture 6; any accepted player damage crossing 6 HP triggers Blood Moon exactly once, resets pressure, creates the existing breathing gap and switches to Phase II posture 7/pressure set; restart returns to Phase I.
- [ ] 練浪人 starts real Stage 2 and ends there; 練將軍 starts real Stage 4 Phase I, keeps Blood Moon rules and ends there; retry/campaign handoff remain correct.
- [ ] 連戰試煉 starts exactly 8 stages, preserves HP/score across waves, uses bounded pressure rematches only at Stages 4–7, reaches the real Crimson Shogun/Blood Moon at Stage 8, keeps retry inside challenge and restores the normal four-duel roster on campaign handoff.

## Direction / animation / presentation

- [ ] **Before the first attack and during neutral gap/stage-intro, authored `Guard` is active and the actual Sword world axis points strongly toward the player/camera.** Sword stays directly parented to HandR.
- [ ] **Enemy RIGHT/LEFT use player-screen cut travel:** RIGHT starts screen-left and travels screen-right; LEFT starts screen-right and travels screen-left. Only opponent horizontal presentation is mirrored; player input/parry/counter direction stays direct.
- [ ] Telegraph body/blade motion matches all four incoming directions; Ronin feints switch to the final authored direction without generic Windup contamination.
- [ ] Normal telegraph → strike → recovery stays on one Attack* track; interrupted recovery selects Parry. No Run-52-style per-frame Chest/arm/HandR override and no normal runtime Sword rotation returns.
- [ ] All four actual blade-tip paths advance toward/cross the player-facing parry plane and follow through; RIGHT/LEFT travel in their declared screen direction; top cuts down; bottom rises.
- [ ] Authored mode keeps Sword/HandR orientation locked; whole-model depth assist stays within its bound; tip trail follows actual history; full-blade afterimages sample only actual Sword history, stay bounded/reused and disappear under reduced-motion.
- [ ] Player first-person katana remains visibly held by two hands/forearms and parry/counter animation follows direct input direction.
- [ ] Normal/perfect parries, counter, guard break and incoming hit feedback remain visually distinct without covering blade reads; reduced motion preserves readable static/contact cues.
- [ ] Four baseline stage identities and Shogun Phase I/Blood Moon signature presentation remain distinct without changing hit/timing/reach/damage; challenge rematches reuse existing identities cleanly.
- [ ] Live fight remains quiet: no persistent READ/PARRY/footer/block-zone/arena clutter; detailed instructions stay behind 玩法.

## Mastery / privacy / performance

- [ ] Mastery/result analysis does not alter combat. Campaign victory shows 0–100 + S/A/B/C/D; defeat remains D with stats.
- [ ] Automatic riposte damage contributes to total damage but never inflates manual counter count/damage coaching.
- [ ] Practice results stay distinctly labelled and never read/overwrite campaign personal best; worse campaign runs do not overwrite better best.
- [ ] Challenge results are distinctly labelled, store only separate local waves/score best, and never read/overwrite campaign personal best; retry and campaign handoff preserve this isolation.
- [ ] No login, analytics, tracking, advertising, paid API, remote identifier or new gameplay backend is introduced without approval.
- [ ] Timing remains elapsed-time based; no unbounded entity/listener/particle/timer/audio-node/animation-loop growth is introduced.
- [ ] Generated base character stays lightweight and attack pack remains animation-only/local/reproducible.

## Delivery gates

- [ ] `npm test` passes, including challenge roster/best/lifecycle regressions.
- [ ] `npm run test:browser` passes.
- [ ] Production browser smoke initializes PlayCanvas primary, keeps WebGL2 fallback, Start control, mastery, boss, onboarding, footwork, impact, practice/challenge selector layout, 刀路清晰 and 節拍提示.
- [ ] Combat UX smoke proves real 320×568 Start/parry/Pause freeze/玩法/resume/restart/home flow; it also selects and persists left STEP mode, starts the real duel, measures STEP/range/feedback inside the safe viewport, and re-proves unchanged swipe directions plus top-right Pause/parry routing.
- [ ] Renderer contract samples actual ready-state Sword axis and fails unless Guard points at player; proves player-screen RIGHT left→right and LEFT right→left; proves grip lock, actual-Sword multi-pose afterimage history, telegraph→strike→parry→counter and all directional player-facing cuts.
- [ ] Timing-assist harness proves deterministic default-off idle and off/on/off lifecycle without relying on a top-level RAF promise.
- [ ] Mastery browser harness clicks the real 連戰試煉 control, proves composed 8-stage activation and terminal 8-card analysis, keeps challenge best isolated from campaign best, exercises 再戰連陣 / 開始完整主線, and keeps terminal content plus both controls inside 320×568.
- [ ] Existing mastery, boss, onboarding, footwork, readability and impact browser harnesses remain green.
- [ ] CI configuration remains valid; Current Baseline, changelog, backlog, state and run log are updated with the implementation.
- [ ] Draft PR remains open/Draft/unmerged and contains one concise run comment with Before/After/verification/regression/risk/Preview.
