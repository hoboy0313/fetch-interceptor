/**
 * vite plugin to sync manifest.json with the build output
 */
import fs from 'node:fs';
import path from 'node:path';

import type {Plugin, ResolvedConfig} from 'vite';

function syncManifest(): Plugin {
  let config = {} as ResolvedConfig;

  return {
    name: 'sync-manifest',
    configResolved(conf) {
      config = conf;
    },
    /**
     * 当处于 build 命令，且处于 watch 模式下，监听 manifest.json 文件变化，每次发生变更重新启动。
     */
    buildStart() {
      if (config.command === 'build' && config.build.watch) {
        const manifestPath = path.resolve(config.root, 'manifest.json');
        // 添加监听文件
        this.addWatchFile(manifestPath);
      }
    },
    writeBundle() {
      const root = config.root;
      const manifest = fs.readFileSync(path.resolve(root, 'manifest.json'), 'utf-8');
      const targetDir = path.resolve(root, config.build.outDir);
      // 确保 targetDir 目录存在
      fs.mkdirSync(targetDir, {recursive: true});
      fs.writeFileSync(path.resolve(targetDir, 'manifest.json'), manifest);
    },
  };
}

export {
  syncManifest,
};
