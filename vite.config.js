import { defineConfig } from 'vite';
import { generateSamuraiGlb } from './tools/generate-samurai-glb.mjs';
import { generateSamuraiAttacksGlb } from './tools/generate-samurai-attacks-glb.mjs';

generateSamuraiGlb();
generateSamuraiAttacksGlb();

export default defineConfig({
  build: {
    outDir: 'dist',
  },
});
