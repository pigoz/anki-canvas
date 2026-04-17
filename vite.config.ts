import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const entry = process.env.ENTRY;

export default defineConfig(({ command }) => ({
  root: command === 'serve' ? '.' : undefined,
  build: {
    target: 'es2020',
    outDir: 'dist',
    emptyOutDir: entry === 'front' || entry === undefined,
    cssCodeSplit: false,
    modulePreload: false,
    lib: entry
      ? {
          entry: resolve(__dirname, `src/${entry}.ts`),
          name: `AnkiCanvas_${entry}`,
          formats: ['iife'],
          fileName: () => `${entry}.js`,
        }
      : undefined,
    rollupOptions: entry
      ? undefined
      : {
          input: {
            front: resolve(__dirname, 'src/front.ts'),
            back: resolve(__dirname, 'src/back.ts'),
          },
          output: {
            entryFileNames: '[name].js',
            assetFileNames: '[name][extname]',
          },
        },
  },
}));
