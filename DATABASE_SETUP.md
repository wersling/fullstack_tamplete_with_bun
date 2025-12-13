# 数据库设置指南

本项目使用 **PostgreSQL** 作为数据库。

## 快速启动（推荐）

### 使用 Docker Compose 启动 PostgreSQL

这是最简单的方式，无需手动安装 PostgreSQL。

```bash
# 1. 进入 docker 目录
cd docker

# 2. 仅启动 PostgreSQL 数据库
docker-compose up postgres -d

# 3. 查看数据库状态
docker-compose ps

# 4. 查看数据库日志
docker-compose logs -f postgres
```

**数据库连接信息：**
- 主机：`localhost`
- 端口：`5433`（注意不是默认的 5432）
- 数据库：`fullstack_db`
- 用户：`fullstack_user`
- 密码：`fullstack_password`

### 运行数据库迁移

启动数据库后，需要运行迁移创建表结构：

```bash
# 回到项目根目录
cd ..

# 运行迁移
bun run --cwd backend db:migrate
```

### 停止数据库

```bash
cd docker
docker-compose down postgres
```

### 清除数据库数据

```bash
cd docker
docker-compose down postgres -v  # -v 会删除数据卷
```

## 方法二：本地安装 PostgreSQL

### macOS (使用 Homebrew)

```bash
# 安装 PostgreSQL
brew install postgresql@16

# 启动服务
brew services start postgresql@16

# 创建数据库和用户
psql postgres
```

在 psql 中执行：

```sql
CREATE DATABASE fullstack_db;
CREATE USER fullstack_user WITH PASSWORD 'fullstack_password';
GRANT ALL PRIVILEGES ON DATABASE fullstack_db TO fullstack_user;
\q
```

**注意**：本地安装时，需要修改连接端口为 `5432`：

```bash
# 在 backend/.env 中设置
DATABASE_URL=postgresql://fullstack_user:fullstack_password@localhost:5432/fullstack_db
```

### Linux (Ubuntu/Debian)

```bash
# 安装 PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 创建数据库和用户
sudo -u postgres psql
```

在 psql 中执行：

```sql
CREATE DATABASE fullstack_db;
CREATE USER fullstack_user WITH PASSWORD 'fullstack_password';
GRANT ALL PRIVILEGES ON DATABASE fullstack_db TO fullstack_user;
\q
```

### Windows

1. 下载 PostgreSQL 安装器：https://www.postgresql.org/download/windows/
2. 运行安装器并按提示操作
3. 使用 pgAdmin 或命令行创建数据库和用户

## 验证数据库连接

### 使用 psql 连接

```bash
# Docker Compose 方式（端口 5433）
psql -h localhost -p 5433 -U fullstack_user -d fullstack_db

# 本地安装方式（端口 5432）
psql -h localhost -p 5432 -U fullstack_user -d fullstack_db
```

输入密码：`fullstack_password`

### 查看表结构

连接成功后，在 psql 中执行：

```sql
-- 列出所有表
\dt

-- 查看 user 表结构
\d user
```

## 常见问题

### 1. 端口冲突

**错误**：`bind: address already in use`

**解决**：
```bash
# 查看 5433 端口占用
lsof -i :5433

# 或修改 docker-compose.yml 中的端口映射
ports:
  - "5434:5432"  # 改用 5434 端口
```

### 2. 认证失败

**错误**：`password authentication failed for user "fullstack_user"`

**原因**：
1. Docker 容器未启动
2. 端口配置不匹配（5432 vs 5433）
3. 数据库凭据错误

**解决**：
```bash
# 1. 检查 Docker 容器状态
docker ps | grep postgres

# 2. 检查代码中的端口配置
# backend/src/db/index.ts 应该使用 5433 端口

# 3. 重启数据库容器
cd docker
docker-compose restart postgres
```

### 3. 迁移失败

**错误**：`relation "user" does not exist`

**解决**：
```bash
# 重新生成迁移文件
bun run --cwd backend db:generate

# 执行迁移
bun run --cwd backend db:migrate
```

### 4. 数据库连接超时

**错误**：`connect ETIMEDOUT`

**解决**：
```bash
# 检查防火墙设置
# 确保端口 5433 未被阻止

# 检查 Docker 网络
docker network ls
docker network inspect docker_fullstack-network
```

## Drizzle Studio（数据库可视化）

Drizzle 提供了一个 Web UI 来管理数据库：

```bash
# 启动 Drizzle Studio
bun run --cwd backend db:studio
```

然后访问：https://local.drizzle.studio

## 环境变量配置

在 `backend/.env` 文件中配置数据库连接：

```bash
# Docker Compose 方式（推荐）
DATABASE_URL=postgresql://fullstack_user:fullstack_password@localhost:5433/fullstack_db

# 本地安装方式
DATABASE_URL=postgresql://fullstack_user:fullstack_password@localhost:5432/fullstack_db

# 生产环境
DATABASE_URL=postgresql://user:password@production-host:5432/database
```

## 生产环境注意事项

1. **更改默认密码**：
   ```sql
   ALTER USER fullstack_user WITH PASSWORD 'strong_password_here';
   ```

2. **使用环境变量**：
   ```bash
   export DATABASE_URL=postgresql://user:secure_password@host:5432/db
   ```

3. **启用 SSL 连接**：
   ```bash
   DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require
   ```

4. **配置连接池**：
   参考 `backend/src/db/index.ts` 中的连接配置

---

**更新日期**：2025-12-13

