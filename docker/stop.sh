#!/bin/bash
# Docker 停止脚本

set -e

echo "========================================="
echo "🛑 停止 Fullstack 应用"
echo "========================================="

# 停止并删除容器
docker compose down

echo ""
echo "✅ 服务已停止"
echo ""
echo "💡 提示:"
echo "  - 保留数据: docker compose down"
echo "  - 删除数据: docker compose down -v"
echo "  - 查看容器: docker compose ps -a"
echo ""

