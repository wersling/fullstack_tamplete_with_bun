#!/bin/bash
# 数据库迁移脚本
# 支持从项目根目录或 docker/ 目录执行

set -e

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# 判断项目根目录
if [ -f "$SCRIPT_DIR/../package.json" ]; then
    # 脚本在 docker/ 目录内
    PROJECT_ROOT="$SCRIPT_DIR/.."
    DOCKER_DIR="$SCRIPT_DIR"
else
    # 脚本在根目录
    PROJECT_ROOT="$SCRIPT_DIR"
    DOCKER_DIR="$SCRIPT_DIR/docker"
fi

# 切换到项目根目录
cd "$PROJECT_ROOT"

echo "========================================="
echo "🗄️  数据库迁移"
echo "========================================="

# 确保 PostgreSQL 正在运行
if ! docker compose -f "$DOCKER_DIR/docker-compose.yml" ps postgres | grep -q "Up"; then
    echo "❌ PostgreSQL 未运行，请先启动服务"
    echo "运行: ./docker/start.sh 或 cd docker && ./start.sh"
    exit 1
fi

echo "📊 生成迁移文件..."
cd "$PROJECT_ROOT/backend"
bun run db:generate

echo ""
echo "🚀 执行迁移..."
bun run db:migrate

echo ""
echo "✅ 数据库迁移完成"
echo ""
echo "💡 提示:"
echo "  - 查看迁移: ls -la backend/drizzle/"
echo "  - 数据库管理: cd backend && bun run db:studio"
echo ""

