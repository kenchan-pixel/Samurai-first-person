# Current Baseline

Version: **0.7.0-evolution**

These capabilities are approved for the current evolution branch and cumulative. Future work may improve or replace their implementation, but must not silently remove the user-facing behaviour. `main` remains the owner-approved production baseline until Ken merges the Draft PR.

## Playable flow

- The game starts from a mobile-friendly title screen.
- The player enters a first-person dojo combat view.
- Three enemies are fought sequentially as the approved baseline sequence, followed by a fourth boss duel.
- Each stage begins, plays, resolves, and advances without reloading the page.
- The game has victory and defeat states with restart support.

## Guided first duel

- A first-time browser run enables a compact **Guided Duel** coach for the opening Ashigaru fight; a start-screen toggle lets the player turn it on or off before drawing the sword.
- The coach observes the real combat event stream rather than running a separate tutorial simulation: it progresses through **read the blade → directional parry → swipe counter** using the same controls and timings as normal play.
- Wrong-direction and wrong-time parry attempts receive different corrective cues, feints explicitly tell the player to re-read the final blade path, and successful parries expose current enemy posture so the posture system is learned in context.
- Enemy guard break explains the +2 counter opportunity. Completing the basic read/parry/counter sequence collapses the coach after a short acknowledgement instead of leaving a permanent overlay over combat.
- If guidance remains enabled, the Crimson Shogun intro and Blood Moon Phase II produce brief coach cues reminding the player to discard the old rhythm and re-read the boss.
- Completing the first guided duel stores only a local completion preference so later page loads default the coach off; storage failure is non-fatal, the toggle remains available, and no analytics/network service is introduced.
- The coach is pointer-transparent, bounded to a compact lower-left card, and has dedicated 320×568 browser coverage for progress, adaptive miss guidance, viewport containment, and non-blocking input.

## Core combat

- Four defensive directions: top, right, bottom, left.
- Tapping an edge region attempts a block in that direction.
- Correctly timed, matching-direction blocks parry attacks.
- A smaller timing window awards a perfect parry.
- Swiping in four directions performs a katana attack.
- Counterattacks during recovery damage the enemy.
- Perfect parry counters deal increased damage.
- Wrong timing or direction can result in player damage.
- Successful parries pressure enemy posture; perfect parries build posture faster.
- Each baseline enemy has a distinct posture threshold: Ashigaru Scout 3, Wandering Ronin 4, Oni Guard 5.
- Filling enemy posture causes a guard break, extends the current counter window, and adds +2 damage to the next valid counter before posture resets.
- Incoming hits build player posture. Heavy attacks build posture faster; when player posture reaches 4, the guard breaks, that hit gains +1 damage, and player posture resets.
- A successful parry relieves one point of player posture, rewarding recovery through correct defence.

## Spacing and footwork

- Active combat adds a compact **STEP / 後撤** control in the lower centre without changing the four edge-block zones or swipe attack mapping.
- Enemy attack profiles now carry close / mid / long reach. Before each attack the opponent automatically closes or opens to a valid engagement distance; lighter attacks may sidestep while heavy attacks can set up from farther away.
- The current engagement distance is shown as **近 / 中 / 遠** and drives a restrained first-person camera response so spacing changes are visible without adding dense UI.
- A STEP input is only effective during the early strike window. It increases distance by one step.
- If the new distance is beyond that attack's reach, the strike whiffs and creates a recovery counter opening without granting a parry/perfect-parry bonus.
- Long/heavy tracking attacks can still reach at far distance, so STEP is not universal invulnerability; the player must still read the attack and use directional parry when distance alone will not escape it.
- A successful counter after an evade closes one distance step again. Taking a hit also pulls the engagement back toward close/mid range.
- Stage start/restart resets engagement distance to mid.
- Reduced-motion preference disables the camera movement while keeping distance logic, STEP control, and reach outcomes unchanged.

## Boss encounter

- **Crimson Shogun** is a fourth-stage boss after the three approved baseline enemies.
- Phase I uses 12 HP, posture 6, deliberate heavy attacks, and mixed feints.
- At 6 HP or lower after a valid counter, the boss enters **Blood Moon Phase II** instead of continuing the same pattern.
- The phase transition resets boss posture/attack cursor, creates an 1100 ms breathing gap, and awards a small transition score bonus without changing player controls.
- Phase II raises posture to 7, tightens the perfect-parry window, shortens neutral gaps/recovery, and switches to a faster feint/heavy signature attack set.
- The boss stage adds a bounded procedural blood-moon/ember atmosphere and an explicit Phase II banner; effects are decorative, pointer-transparent, and honour reduced-motion preference.
- The Phase II banner has an explicit bounded lifetime, so reduced-motion users see the short transition cue without leaving a persistent panel over the fight.
- Defeating the boss reaches the existing victory/mastery flow. Restart returns the boss to Phase I.

## Mastery and replay feedback

- Each duel tracks parry attempts, successful parries, perfect parries, guard breaks, counters, hits taken, damage dealt/taken, and elapsed time without altering combat resolution.
- Victory produces a 0–100 mastery score plus S/A/B/C/D grade based on accuracy, perfect timing, guard breaks, counter execution, clear time, and damage taken.
- Defeat remains D grade while still showing the run statistics for learning feedback.
- The result screen shows compact mastery feedback: grade, mastery score, parry accuracy, perfect-parry count, guard breaks, hits taken, clear time, and the existing numeric score.
- The best completed victory is stored locally in browser `localStorage` and shown on later result screens. Storage failure is non-fatal and does not affect gameplay.
- No account, network sync, analytics, or external service is used for mastery records.

## Enemy differentiation

- **Ashigaru Scout:** low health, broad timing windows, simple single attacks, low posture threshold; mixes close cuts with a longer committing strike.
- **Wandering Ronin:** faster rhythm, feints, mixed directions, higher health, medium posture threshold; uses more lateral footwork and alternating close/mid reach.
- **Oni Guard:** heavy damage, short strike windows, larger health pool, pressure patterns, highest baseline posture threshold; heavy hits pressure player posture faster and use long tracking reach.
- **Crimson Shogun:** multi-phase boss with a mid-fight ruleset/tempo shift, higher posture resistance, signature heavy/feint patterns, distinct arena atmosphere, and long-reach tracking pressure on heavy attacks.

## Presentation

- First-person WebGL 3D arena and combatants.
- Player katana visible in the foreground.
- Enemy sword telegraphs and strike motion correspond to attack direction.
- Enemy animation is phase-driven rather than rigid: telegraphs use direction-specific anticipation, strikes use a committed body lunge and accelerated sword sweep, and recovery visibly follows through before resetting.
- Procedural arms, stance/legs, torso lean, ground shadow, telegraph blade halo, and strike trail make the opponent silhouette and blade path easier to read without adding dense controls.
- HUD shows player health, enemy health, stage, combat prompt, directional feedback, and compact player/enemy posture values.
- Enemy guard break and player guard break use explicit combat prompts, stronger impact timing, audio, flash, and optional vibration feedback.
- Boss-specific blood-moon and ember presentation is bounded to a fixed DOM layer and does not add external assets.
- Footwork adds only a small STEP control, distance chip, and bounded camera transform; the centre combat view and edge-block zones remain usable.
- Generated Web Audio cues are used; no external audio assets are required.
- Pointer input supports touch, stylus, and mouse.

## Technical baseline

- Static web app with ES modules and no runtime framework dependency.
- Combat rules separated from rendering in `src/game-core.js`.
- `src/boss-encounter.js` installs the boss as a small idempotent encounter adapter before `src/main.js` creates the engine; baseline enemies and the core interaction model remain untouched.
- `src/boss-overlay.js` observes public combat events for bounded boss-only atmosphere, uses explicit timers for transition-banner/deactivation cleanup, and marks readiness for browser smoke verification.
- `src/onboarding-coach.js` observes public combat events for the guided first duel, keeps tutorial state outside the combat state machine, injects a pointer-transparent coach/toggle, and stores only a local completion preference.
- `src/footwork.js` installs an idempotent encounter adapter over public `CombatEngine` state: it decorates attack reach/setup profiles, tracks engagement distance, adds timed backstep/evade openings, injects the STEP/range UI, and leaves directional parry/swipe rules intact.
- Mastery scoring is isolated in pure `src/mastery.js`; a lightweight observer adapter records public combat events without changing the combat state machine.
- Procedural combat rendering remains a single bounded WebGL2 fragment-shader pass with no new assets, network calls, particles, or per-frame object allocation.
- Automated Node tests cover direction mapping, combat resolution, posture pressure, guard-break counter damage, player posture reset, boss stage injection/phase transition/restart, mastery statistics, grading, personal-best comparison, time formatting, guided-duel state progression/adaptive cues, and footwork short-evade / long-track outcomes.
- A dependency-free headless Chromium/Chrome smoke test executes the real page with WebGL2/SwiftShader, requires shader compile/link success, verifies start/mastery/boss/onboarding/footwork initialization, and runs dedicated mastery, boss, onboarding, and footwork integration harnesses at a 320×568 viewport.
- The mastery browser integration gate verifies victory mastery rendering, personal-best persistence, worse-run preservation, blocked-`localStorage` tolerance, and that the mastery result/restart control remain inside the viewport.
- The boss browser integration gate runs with `prefers-reduced-motion`, drives the real patched `CombatEngine` through boss activation and Phase II, proves the banner cleans up while Phase II remains active, verifies restart-to-Phase-I, and reaches final victory.
- The onboarding browser integration gate drives the real opening enemy event stream through a wrong-direction correction, successful parry, and counter; it verifies coach step completion, the start-screen toggle, 320×568 containment, and pointer transparency.
- The footwork browser integration gate proves a close-range strike can be escaped into a counter opening, a long/heavy strike still tracks STEP, and the real STEP/range UI initializes.
- GitHub Actions runs both Node tests and the browser integration/WebGL smoke gate on pull requests and pushes to main.
