import {defineConfig} from 'tsup';

export default defineConfig([
  {
    entry: ['src/entries/background.ts'],
    outDir: 'dist/src/entries',
    format: 'iife',
    outExtension() {
      return {
        js: '.js',
      };
    },
    external: ['react'],
  },
]);
