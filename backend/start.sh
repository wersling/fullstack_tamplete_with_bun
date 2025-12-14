#!/bin/sh
# Docker 容器启动脚本
set -e

# 执行数据库迁移（幂等操作，重复执行安全）
bun run src/migrate.ts

echo "🚀 Starting application..."

# 启动应用
exec bun run dist/index.js

