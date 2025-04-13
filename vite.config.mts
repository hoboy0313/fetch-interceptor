import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import process from 'node:process';
import {defineConfig, loadEnv} from 'vite';

import {syncManifest} from './build/plugins/sync-manifest.mjs';

import type {PluginOption} from 'vite';

export default defineConfig(({mode}) => {
  // port 从环境变量中获取
  const env = loadEnv(mode, process.cwd());

  const port = Number(env.VITE_APP_DEVTOOLS_PORT) || 5820;

  return {
    plugins: [
      react() as PluginOption,
      tailwindcss() as PluginOption,
      syncManifest(),
    ],
    build: {
      rollupOptions: {
        input: {
          popup: 'src/pages/popup/index.html',
          background: 'src/pages/background/index.html',
          devtools: 'src/pages/devtools/index.html',
          devtoolsEntry: 'src/pages/devtools/entry.html',
          options: 'src/pages/options/index.html',
        },
        output: {
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port,
      hmr: {
        port,
      },
    },
  };
});
