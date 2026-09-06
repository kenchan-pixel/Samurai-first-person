# 3D Asset Provenance

## `samurai-v1.glb`

- **Runtime path:** `/assets/samurai-v1.glb`
- **Source of truth:** `tools/generate-samurai-glb.mjs`
- **Build:** generated locally when Vite loads `vite.config.js`; the binary output is intentionally not committed.
- **Origin:** original project-authored geometry, skeleton, skin weights, materials and animation keyframes. No downloaded character pack, texture, motion-capture file, commercial-game asset or character likeness is used.
- **Repository licence:** covered by the repository MIT licence.
- **Current generated budget:** about 315 KiB, 1,972 triangles, 19-joint rig, 8 PBR material groups.
- **Base animation clips:** `Idle`, `Windup`, `Strike`, `Recovery`, `Parry`.

## `samurai-attacks-v1.glb`

- **Runtime path:** `/assets/samurai-attacks-v1.glb`
- **Source of truth:** `tools/generate-samurai-attacks-glb.mjs`
- **Build:** generated locally alongside the base samurai asset; the binary output is intentionally not committed.
- **Origin:** original project-authored animation-only glTF/GLB using the same 19 named joints/hierarchy as `samurai-v1.glb`. It contains no downloaded motion-capture data, external character pack, texture, commercial-game animation, or copied character likeness.
- **Repository licence:** covered by the repository MIT licence.
- **Current generated budget:** about 26 KiB, 19-node animation rig, no mesh or texture payload.
- **Authored clips:** `Guard`, `AttackTop`, `AttackRight`, `AttackBottom`, `AttackLeft`.
- **Guard contract:** `Guard` and the first/final keyframe of every directional attack use the same authored world blade axis (`player-facing-tip-v1`), with the actual Sword still parented directly below HandR. The generated axis points strongly toward the player/camera; no runtime Sword rotation is used to fake the neutral pose.
- **Direction contract:** the pack-local `AttackRight` / `AttackLeft` names describe the historical opponent-rig side. Production mirrors only the enemy horizontal presentation index so `CombatEngine` RIGHT/LEFT are explicit player-screen cut-travel semantics; player parry/counter presentation is not mirrored.
- **Motion contract:** each directional clip continuously animates hips/spine/chest/head, both upper arms/forearms/hands and the sword from the shared Guard through anticipation, strike/contact, follow-through and back to Guard. Combat timing/damage/parry authority remains in `CombatEngine`; the bounded world-space blade-tip layer still guarantees the player-facing cut path.

Both generators are deterministic and dependency-free so reviewers can reproduce the exact local assets without Blender, a paid service or a remote asset host. Future external assets must be listed here with source URL, author, licence and modification notes before they enter the production renderer.
