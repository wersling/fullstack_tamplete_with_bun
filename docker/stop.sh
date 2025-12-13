#!/bin/bash
# Docker 停止脚本
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
echo "🛑 停止 Fullstack 应用"
echo "========================================="

# 停止并删除容器
docker compose -f "$DOCKER_DIR/docker-compose.yml" down

echo ""
echo "✅ 服务已停止"
echo ""
echo "💡 提示:"
echo "  - 保留数据: docker compose -f $DOCKER_DIR/docker-compose.yml down"
echo "  - 删除数据: docker compose -f $DOCKER_DIR/docker-compose.yml down -v"
echo "  - 查看容器: docker compose -f $DOCKER_DIR/docker-compose.yml ps -a"
echo ""

