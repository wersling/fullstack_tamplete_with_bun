# Docker 部署指南

## 📋 目录结构

```
docker/
├── docker-compose.yml      # Docker Compose 配置
├── Dockerfile.backend      # 后端镜像
├── Dockerfile.frontend     # 前端镜像
├── nginx.conf              # Nginx 配置
├── init-db.sql             # 数据库初始化脚本
├── .env.example            # 环境变量模板
├── start.sh                # 启动脚本
├── stop.sh                 # 停止脚本
├── migrate.sh              # 数据库迁移脚本
├── logs.sh                 # 日志查看脚本
└── README.md               # 本文件
```

---

## 🚀 快速开始

### 1. 配置环境变量

```bash
cd docker
cp .env.example .env
```

编辑 `.env` 文件，至少设置：

```bash
# 生成 secret
openssl rand -base64 32

# 填入 .env
BETTER_AUTH_SECRET=<生成的密钥>
```

### 2. 启动服务

```bash
# 给脚本添加执行权限
chmod +x *.sh

# 启动所有服务
./start.sh
```

### 3. 运行数据库迁移

```bash
./migrate.sh
```

### 4. 访问应用

- **前端**: http://localhost
- **后端 API**: http://localhost:3001
- **数据库**: localhost:5433 (映射到容器内的 5432)

---

## 🛠️ 常用命令

### 服务管理

```bash
# 启动服务
./start.sh

# 停止服务
./stop.sh

# 重启服务
docker compose restart

# 查看服务状态
docker compose ps

# 查看日志
./logs.sh                # 所有服务
./logs.sh backend        # 仅后端
./logs.sh frontend       # 仅前端
./logs.sh postgres       # 仅数据库
```

### 数据库管理

```bash
# 运行迁移
./migrate.sh

# 连接数据库
docker compose exec postgres psql -U fullstack_user -d fullstack_db

# 备份数据库
docker compose exec postgres pg_dump -U fullstack_user fullstack_db > backup.sql

# 恢复数据库
cat backup.sql | docker compose exec -T postgres psql -U fullstack_user -d fullstack_db
```

### 调试

```bash
# 进入后端容器
docker compose exec backend sh

# 进入数据库容器
docker compose exec postgres sh

# 查看容器资源使用
docker compose stats

# 重新构建镜像
docker compose build --no-cache
```

---

## 🏗️ 服务说明

### PostgreSQL

- **镜像**: postgres:16-alpine
- **端口**: 5432
- **数据卷**: postgres_data
- **健康检查**: pg_isready

**默认凭据**:
- Database: `fullstack_db`
- User: `fullstack_user`
- Password: `fullstack_password`

### 后端 (Bun + Hono)

- **构建**: 多阶段构建（deps → builder → runner）
- **端口**: 3001
- **健康检查**: HTTP /api/health
- **日志**: 结构化日志（pino）

**环境变量**:
- `NODE_ENV=production`
- `DATABASE_URL`: PostgreSQL 连接字符串
- `BETTER_AUTH_SECRET`: 认证密钥

### 前端 (React + Nginx)

- **构建**: Bun 构建 + Nginx 服务
- **端口**: 80
- **特性**:
  - Gzip 压缩
  - API 代理到后端
  - React Router 支持
  - 静态资源缓存

---

## 🔧 自定义配置

### 修改端口

编辑 `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # 改为 8080
  backend:
    ports:
      - "8001:3001"  # 改为 8001
```

### 修改数据库凭据

```yaml
services:
  postgres:
    environment:
      POSTGRES_DB: myapp_db
      POSTGRES_USER: myapp_user
      POSTGRES_PASSWORD: strong_password
  backend:
    environment:
      DATABASE_URL: postgresql://myapp_user:strong_password@postgres:5432/myapp_db
```

### 添加 Redis

```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
```

---

## 🐛 故障排除

### 网络连接问题（无法拉取镜像）

如果遇到 `connection reset by peer` 或 `failed to fetch oauth token` 错误：

**方案 1：手动拉取镜像（推荐）**

```bash
# 拉取所需镜像
docker pull postgres:16-alpine
docker pull oven/bun:1.3-alpine
docker pull nginx:1.25-alpine

# 然后再运行启动脚本
./start.sh
```

**方案 2：配置 Docker 镜像加速**

```bash
# macOS Docker Desktop
# Settings -> Docker Engine -> 添加配置
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
# 点击 "Apply & Restart"

# Linux
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
EOF
sudo systemctl restart docker
```

**方案 3：使用代理**

macOS Docker Desktop:
- Settings -> Resources -> Proxies -> Manual proxy configuration

### 服务无法启动

```bash
# 查看详细日志
docker compose logs

# 检查容器状态
docker compose ps -a

# 重新构建
docker compose build --no-cache
docker compose up -d
```

### 数据库连接失败

```bash
# 检查 PostgreSQL 是否健康
docker compose ps postgres

# 查看数据库日志
docker compose logs postgres

# 测试连接
docker compose exec postgres pg_isready -U fullstack_user
```

### 端口冲突

```bash
# 查看端口占用
lsof -i :80
lsof -i :3001
lsof -i :5432

# 修改 docker-compose.yml 中的端口映射
```

### 数据持久化

```bash
# 查看数据卷
docker volume ls

# 删除所有数据
docker compose down -v

# 仅删除容器，保留数据
docker compose down
```

---

## 📊 性能优化

### 1. 数据库连接池

编辑 `backend/src/db/index.ts`:

```typescript
const client = postgres(connectionString, {
    max: 20,              // 增加最大连接数
    idle_timeout: 30,
    connect_timeout: 10,
})
```

### 2. Nginx 缓存

编辑 `nginx.conf`:

```nginx
# 启用响应缓存
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m;

location /api {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    # ...
}
```

### 3. 容器资源限制

编辑 `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

---

## 🔒 生产环境建议

### 1. 使用 HTTPS

```yaml
services:
  frontend:
    volumes:
      - /path/to/ssl:/etc/nginx/ssl:ro
```

### 2. 设置强密码

```bash
# 生成强密码
openssl rand -base64 32
```

### 3. 限制数据库访问

```yaml
services:
  postgres:
    # 不暴露到宿主机
    # ports:
    #   - "5432:5432"
```

### 4. 使用外部数据库

```yaml
services:
  backend:
    environment:
      DATABASE_URL: postgresql://user:pass@external-db.example.com:5432/db
```

### 5. 定期备份

```bash
# 添加到 crontab
0 2 * * * cd /app/docker && docker compose exec postgres pg_dump -U fullstack_user fullstack_db > /backups/db-$(date +\%Y\%m\%d).sql
```

---

## 📚 相关文档

- [Docker Compose 文档](https://docs.docker.com/compose/)
- [PostgreSQL Docker 镜像](https://hub.docker.com/_/postgres)
- [Nginx Docker 镜像](https://hub.docker.com/_/nginx)
- [Bun Docker 镜像](https://hub.docker.com/r/oven/bun)

---

**最后更新**: 2024-12-11

