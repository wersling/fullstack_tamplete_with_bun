#!/bin/bash
# 查看日志脚本

# 默认显示所有服务日志
if [ -z "$1" ]; then
    echo "📋 显示所有服务日志 (Ctrl+C 退出)"
    docker compose logs -f
else
    echo "📋 显示 $1 服务日志 (Ctrl+C 退出)"
    docker compose logs -f "$1"
fi

