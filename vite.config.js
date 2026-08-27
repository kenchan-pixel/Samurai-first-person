import { defineConfig } from 'vite';
import { generateSamuraiGlb } from './tools/generate-samurai-glb.mjs';

generateSamuraiGlb();

export default defineConfig({
  build: {
    outDir: 'dist',
  },
});
