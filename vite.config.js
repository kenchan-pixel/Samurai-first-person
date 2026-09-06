import { defineConfig } from 'vite';
import { generateSamuraiGlb } from './tools/generate-samurai-glb.mjs';
import { generateSamuraiAttacksGlb } from './tools/generate-samurai-attacks-glb.mjs';
import { buildReceiptPlugin } from './tools/build-receipt.mjs';

generateSamuraiGlb();
generateSamuraiAttacksGlb();

export default defineConfig({
  plugins: [buildReceiptPlugin()],
  build: {
    outDir: 'dist',
  },
});
