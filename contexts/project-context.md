# Fetch 拦截器 Chrome 扩展

## 项目概述
这是一个基于 Chrome 扩展的 Fetch 请求拦截器，使用现代前端技术栈构建。该扩展允许用户监控、修改和管理网页中的 Fetch 请求。

## 技术栈
- **框架**: React 18
- **构建工具**: Vite 6
- **包管理器**: Bun 1.x
- **语言**: TypeScript
- **样式**: TailwindCSS 4.x
- **状态管理**: Zustand 4.x
- **UI 组件**: Shadcn UI
- **图标库**: Lucide React

## 项目结构
```
src/
├── components/         # 可复用组件
│   └── ui/             # UI 基础组件
├── lib/                # 工具库和辅助函数
│   └── utils.ts
├── pages/              # Chrome 扩展的各个页面
│   ├── popup/          # 扩展弹出窗口
│   ├── options/        # 扩展配置页面
│   ├── devtools/       # 开发者工具面板
│   └── background/     # 后台脚本
├── services/           # 所有请求存放的地方
│   └── core/           # 请求封装核心基础工具
├── stores/             # 状态管理存放的地方
└── styles/             # 全局样式文件
```

## 开发环境
- Node.js 20.x
- Bun 1.x 包管理器
- Chrome 扩展开发环境

## 开发命令
- `bun run dev`: 开发模式（监听文件变化）
- `bun run build`: 构建生产版本
- `bun run preview`: 预览构建结果

## 主要功能
1. Fetch 请求拦截和监控
2. 请求数据修改
3. 响应数据查看
4. 自定义拦截规则配置

## 扩展架构
- Popup：快速操作界面
- Options：详细配置界面
- DevTools：开发调试面板
- Background：后台请求处理

## 项目规范
- 文件名采用中划线命名方式

## 注意事项
1. 项目中已经引入了 tailwindcss 相关样式，无需再引入 tailwindcss 相关 css 代码。
