# 常用命令

## 开发命令

### 启动开发服务器

```bash
# 一键启动前后端（推荐）
bun run dev

# 仅启动后端（端口 3001）
bun run dev:backend

# 仅启动前端（端口 5173）
bun run dev:frontend
```

---

## 构建命令

### 构建生产版本

```bash
# 构建全部
bun run build

# 仅构建后端（输出到 backend/dist/）
bun run build:backend

# 仅构建前端（输出到 frontend/dist/）
bun run build:frontend
```

---

## 数据库命令

```bash
cd backend

# 生成迁移文件（根据 schema 变化）
bun run db:generate

# 执行迁移（应用到数据库）
bun run db:migrate

# 打开数据库管理界面（Drizzle Studio）
bun run db:studio
```

**Drizzle Studio** 会在浏览器中打开可视化数据库管理界面。

---

## UI 组件命令

### 添加 Shadcn UI 组件

```bash
cd frontend

# 添加单个组件
bunx --bun shadcn@latest add button

# 添加多个组件
bunx --bun shadcn@latest add dialog dropdown-menu toast

# 查看可用组件列表
bunx --bun shadcn@latest add
```

**常用组件**:
- `button` - 按钮
- `card` - 卡片
- `input` - 输入框
- `dialog` - 对话框
- `dropdown-menu` - 下拉菜单
- `toast` - 提示消息
- `form` - 表单
- `table` - 表格

---

## 依赖管理

### 安装依赖

```bash
# 安装所有依赖（前端 + 后端）
bun run install:all

# 安装后端依赖
cd backend && bun install

# 安装前端依赖
cd frontend && bun install
```

### 添加新依赖

```bash
# 后端添加依赖
cd backend
bun add package-name
bun add -d package-name  # 开发依赖

# 前端添加依赖
cd frontend
bun add package-name
bun add -d package-name  # 开发依赖
```

### 更新依赖

```bash
# 更新所有依赖
bun update

# 更新特定包
bun update package-name
```

---

## 测试命令

```bash
# 运行后端测试
cd backend
bun test

# 运行前端测试
cd frontend
bun test
```

---

## 代码检查

### ESLint

```bash
# 检查前端代码
cd frontend
bun run lint

# 自动修复
bun run lint --fix
```

### TypeScript 类型检查

```bash
# 检查后端类型
cd backend
bunx tsc --noEmit

# 检查前端类型
cd frontend
bunx tsc --noEmit
```

---

## 生产环境

### 启动生产服务器

```bash
# 先构建
bun run build

# 启动后端生产服务器
bun run start

# 设置日志级别
LOG_LEVEL=warn bun run start  # 生产环境建议 warn 或 error
```

**注意**: 前端构建产物是静态文件，需要使用 Nginx/Vercel/Netlify 等服务托管。

### 日志级别

```bash
# 开发环境（带颜色）
LOG_LEVEL=debug bun run dev

# 生产环境（JSON 格式）
NODE_ENV=production LOG_LEVEL=info bun run start
```

可用日志级别：`trace` | `debug` | `info` | `warn` | `error` | `fatal`

---

## CI 命令

### 本地 CI 测试

```bash
# 运行完整的 CI 测试流程
.github/test-ci.sh
```

该脚本会：
- ✅ 检查 Bun 版本
- ✅ 安装依赖
- ✅ TypeScript 类型检查
- ✅ ESLint 代码检查
- ✅ 构建前后端
- ✅ 运行测试
- ✅ 验证构建产物

---

## 清理命令

```bash
# 清理所有 node_modules 和构建产物
rm -rf backend/node_modules backend/dist
rm -rf frontend/node_modules frontend/dist
rm -rf node_modules

# 清理数据库（谨慎使用！仅限本地开发）
# 注意：项目使用 PostgreSQL，数据库在 Docker 容器中
# 如需重置，请删除 Docker volume: docker volume rm fullstack_tamplete_with_bun_postgres_data

# 重新安装依赖
bun run install:all
```

---

## 快捷脚本

### 完整重置项目

```bash
# 清理并重新开始
rm -rf backend/node_modules frontend/node_modules node_modules
rm -rf backend/dist frontend/dist
bun install

# 重新生成迁移文件
cd backend
bun run db:generate
bun run db:migrate
cd ..

# 启动开发服务器
bun run dev
```

### 快速部署检查

```bash
# 确保生产环境可以正常构建
bun run build && echo "✅ 构建成功，可以部署"
```

