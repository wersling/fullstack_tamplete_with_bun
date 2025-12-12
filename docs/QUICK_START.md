# 快速开始

## 1. 安装依赖

```bash
# 后端依赖
cd backend && bun install

# 前端依赖
cd ../frontend && bun install
```

## 2. 配置环境变量

在 `backend` 目录创建 `.env` 文件：

```bash
# Server
PORT=3001

# Better Auth Secret (生成: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-secret-key-here

# Google OAuth (可选)
# 从 https://console.cloud.google.com/apis/credentials 获取
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (可选)
# 从 https://github.com/settings/developers 获取
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## 3. 初始化数据库

```bash
cd backend
bun run db:generate  # 生成迁移文件
bun run db:migrate   # 执行迁移
```

## 4. 启动开发服务器

**一键启动前后端（推荐）：**
```bash
bun run dev
```

或者分别启动：
```bash
# 终端 1 - 启动后端
bun run dev:backend

# 终端 2 - 启动前端
bun run dev:frontend
```

## 5. 访问应用

- 前端: http://localhost:5173
- 后端 API: http://localhost:3001

## OAuth 配置指南

### Google OAuth

1. 访问 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. 创建新项目或选择现有项目
3. 创建 OAuth 2.0 客户端 ID
4. 设置授权重定向 URI: `http://localhost:3001/api/auth/callback/google`
5. 复制 Client ID 和 Client Secret 到 `.env`

### GitHub OAuth

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 创建新的 OAuth App
3. 设置 Authorization callback URL: `http://localhost:3001/api/auth/callback/github`
4. 复制 Client ID 和 Client Secret 到 `.env`

## 常见问题

### Q: Bun 版本要求？
A: 建议使用 Bun 1.3.0 或更高版本。

### Q: 如何生成 BETTER_AUTH_SECRET？
A: 运行命令 `openssl rand -base64 32`

### Q: 数据库在哪里？
A: 默认使用 SQLite，数据库文件位于 `backend/sqlite.db`

### Q: 如何重置数据库？
A: 删除 `backend/sqlite.db` 文件，然后重新运行 `bun run db:migrate`

