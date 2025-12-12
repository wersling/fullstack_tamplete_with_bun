# 部署指南

## 部署建议

### 推荐方案
- **前端**: Vercel / Netlify (静态站点)
- **后端**: Railway / Fly.io / Render (支持 Bun)

---

## Railway 部署

### 一键部署

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 部署
railway up
```

### 环境变量配置

在 Railway 控制台添加以下环境变量：

```
PORT=3001
BETTER_AUTH_SECRET=<生产环境密钥>
GOOGLE_CLIENT_ID=<生产环境 Google Client ID>
GOOGLE_CLIENT_SECRET=<生产环境 Google Client Secret>
GITHUB_CLIENT_ID=<生产环境 GitHub Client ID>
GITHUB_CLIENT_SECRET=<生产环境 GitHub Client Secret>
```

---

## Vercel 部署（前端）

### 方法 1: GitHub 集成

1. 在 Vercel 控制台连接 GitHub 仓库
2. 设置构建配置：
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `bun run build`
   - **Output Directory**: `dist`

### 方法 2: CLI 部署

```bash
cd frontend
npx vercel
```

---

## Netlify 部署（前端）

### netlify.toml 配置

在项目根目录创建 `netlify.toml`：

```toml
[build]
  base = "frontend"
  command = "bun run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 部署

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod
```

---

## Fly.io 部署（后端）

### 1. 创建 fly.toml

```toml
app = "your-app-name"
primary_region = "hkg" # 香港区域

[build]

[http_service]
  internal_port = 3001
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

### 2. 部署

```bash
# 安装 Fly CLI
curl -L https://fly.io/install.sh | sh

# 登录
fly auth login

# 创建应用
fly launch

# 设置环境变量
fly secrets set BETTER_AUTH_SECRET=xxx
fly secrets set GOOGLE_CLIENT_ID=xxx

# 部署
fly deploy
```

---

## Docker 部署

### Dockerfile (后端)

```dockerfile
FROM oven/bun:1.3

WORKDIR /app

# 复制依赖文件
COPY backend/package.json backend/bun.lock ./

# 安装依赖
RUN bun install

# 复制源码
COPY backend/ .

# 构建
RUN bun run build

# 暴露端口
EXPOSE 3001

# 启动
CMD ["bun", "run", "start"]
```

### 构建和运行

```bash
# 构建镜像
docker build -t my-app-backend .

# 运行容器
docker run -p 3001:3001 \
  -e BETTER_AUTH_SECRET=xxx \
  -e PORT=3001 \
  my-app-backend
```

---

## 环境变量管理

### 开发环境
- 使用 `.env` 文件（不要提交到 Git）

### 生产环境
- 使用部署平台的环境变量配置（Railway / Vercel / Netlify）
- 使用 Docker secrets
- 使用 Kubernetes ConfigMap/Secret

### 安全建议

1. **永远不要**将密钥提交到代码仓库
2. 生产环境使用强密钥（至少 32 字节）
3. 定期轮换密钥
4. 使用不同的密钥用于开发/生产环境
5. OAuth 回调 URL 要与部署环境匹配

---

## 数据库迁移

### 生产环境数据库

建议使用托管数据库服务：
- **PostgreSQL**: Railway / Supabase / Neon
- **MySQL**: PlanetScale
- **SQLite**: Turso (适合 SQLite 的边缘部署)

### 切换到 PostgreSQL

1. 修改 `backend/drizzle.config.ts`：

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

2. 更新依赖：

```bash
cd backend
bun add postgres
bun remove bun:sqlite
```

3. 修改 `backend/src/db/index.ts` 使用 PostgreSQL 连接

---

## 性能优化

### 前端优化
- ✅ 已启用生产构建优化（Vite）
- ✅ 已启用代码分割
- ✅ 已启用 Gzip 压缩
- 建议：添加 CDN（Cloudflare / Vercel Edge Network）

### 后端优化
- ✅ 使用 Bun 高性能运行时
- ✅ 已启用 CORS 和日志中间件
- 建议：添加 Redis 缓存
- 建议：使用负载均衡（多实例部署）

---

## 监控和日志

### 推荐工具
- **日志**: Logtail / Papertrail
- **监控**: Sentry / Datadog
- **性能**: Vercel Analytics / Google Analytics

---

## 回滚策略

### Railway / Fly.io
```bash
# 查看部署历史
railway logs
fly releases

# 回滚到上一版本
railway rollback
fly releases rollback
```

### Docker
```bash
# 保留多个版本的镜像
docker tag my-app:latest my-app:v1.0.0

# 回滚时使用旧版本
docker run my-app:v1.0.0
```

---

## CI/CD 集成

项目已配置 GitHub Actions 自动化部署。

详见 `.github/workflows/` 目录下的工作流配置。

