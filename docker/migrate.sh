#!/bin/bash
# 数据库迁移脚本

set -e

echo "========================================="
echo "🗄️  数据库迁移"
echo "========================================="

# 确保 PostgreSQL 正在运行
if ! docker compose ps postgres | grep -q "Up"; then
    echo "❌ PostgreSQL 未运行，请先启动: ./start.sh"
    exit 1
fi

echo "📊 生成迁移文件..."
cd ../backend
bun run db:generate

echo ""
echo "🚀 执行迁移..."
bun run db:migrate

echo ""
echo "✅ 数据库迁移完成"
echo ""
echo "💡 提示:"
echo "  - 查看迁移: ls -la drizzle/"
echo "  - 数据库管理: bun run db:studio"
echo ""

