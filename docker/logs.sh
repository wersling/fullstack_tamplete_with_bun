#!/bin/bash
# 查看日志脚本
# 支持从项目根目录或 docker/ 目录执行

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

# 默认显示所有服务日志
if [ -z "$1" ]; then
    echo "📋 显示所有服务日志 (Ctrl+C 退出)"
    docker compose -f "$DOCKER_DIR/docker-compose.yml" logs -f
else
    echo "📋 显示 $1 服务日志 (Ctrl+C 退出)"
    docker compose -f "$DOCKER_DIR/docker-compose.yml" logs -f "$1"
fi

