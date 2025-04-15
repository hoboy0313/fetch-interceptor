# 基础组件设施

## 组件库

- 选型：`Shadcn UI`
- 地址：`https://ui.shadcn.com/docs/components`

### **注意事项**

1. 如果当前项目中没有安装需要执行安装命令
2. 如果已经安装了可以直接使用

### 安装命令

```shell
bunx --bun shadcn@latest add {组件名}
```

### 检查是否已经安装

**如果已经安装，则不执行安装命令**

#### 判断方式
```shell
# 判断是否存在当前组件
DIR="src/components/ui/${组件名}"

if [ -d "$DIR" ]; then
  echo "$DIR 已存在"
```

## 图标库
- 选型：`Lucide React`
- 地址：`https://lucide.dev/icons/`
