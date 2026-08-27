# 3D Asset Provenance

## `samurai-v1.glb`

- **Runtime path:** `/assets/samurai-v1.glb`
- **Source of truth:** `tools/generate-samurai-glb.mjs`
- **Build:** generated locally when Vite loads `vite.config.js`; the binary output is intentionally not committed.
- **Origin:** original project-authored geometry, skeleton, skin weights, materials and animation keyframes. No downloaded character pack, texture, motion-capture file, commercial-game asset or character likeness is used.
- **Repository licence:** covered by the repository MIT licence.
- **Current generated budget:** about 315 KiB, 1,972 triangles, 19-joint rig, 8 PBR material groups.
- **Animation clips:** `Idle`, `Windup`, `Strike`, `Recovery`, `Parry`.

The generator is deterministic and dependency-free so reviewers can reproduce the exact local GLB without Blender, a paid service or a remote asset host. Future external assets must be listed here with source URL, author, licence and modification notes before they enter the production renderer.
