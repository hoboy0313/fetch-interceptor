# Fetch Interceptor

A Chrome extension for intercepting and modifying fetch requests.

## Taskmaster Integration

This project uses taskmaster-ai for task management and automation. Available commands:

- `bun run task`: Run taskmaster commands
- `bun run task:watch`: Start taskmaster watchers
- `bun run task:list`: List all available tasks

### Task Categories

1. **Network Core (`interceptRequests`)**
   - Handles request interception logic
   - Located in `src/services/core`
   - Auto-rebuilds on changes

2. **DevTools UI (`devtools`)**
   - Manages DevTools panel interface
   - Located in `src/pages/devtools`
   - Hot-reloads during development

3. **Background Scripts (`background`)**
   - Handles background processes
   - Located in `src/pages/background`
   - Auto-rebuilds on changes

### Watchers

- **Network**: Watches core service files and triggers rebuild
- **UI**: Watches UI files and triggers development server refresh

### Automation Scripts

- **Pre-commit**: Runs linting before commits
- **Post-build**: Runs tests after build

## 参考文档

- [chrome 插件开发指南 V3](https://juejin.cn/post/7173567493871501325)
- [crxjs-vite-plugin](https://crxjs.dev/vite-plugin/concepts/manifest)
