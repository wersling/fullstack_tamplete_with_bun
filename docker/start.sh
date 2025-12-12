#!/bin/bash
# Docker 启动脚本

set -e

echo "========================================="
echo "🐳 启动 Fullstack 应用"
echo "========================================="

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "⚠️  .env 文件不存在，从 env.example 复制..."
    if [ -f env.example ]; then
        cp env.example .env
        echo "✅ 已创建 .env 文件，请编辑并填写必要的环境变量"
    else
        echo "❌ 找不到 env.example 文件！"
        echo "请手动创建 .env 文件，或从项目根目录运行此脚本"
    fi
    echo ""
    echo "最少需要设置："
    echo "  - BETTER_AUTH_SECRET (运行: openssl rand -base64 32)"
    echo ""
    echo "示例内容："
    echo "BETTER_AUTH_SECRET=your-secret-key-here"
    echo "LOG_LEVEL=info"
    echo ""
    exit 1
fi

# 检查必需的环境变量
if ! grep -q "BETTER_AUTH_SECRET=.*[^[:space:]]" .env 2>/dev/null; then
    echo "❌ 错误: BETTER_AUTH_SECRET 未设置"
    echo "请在 .env 文件中设置此变量"
    echo "生成方法: openssl rand -base64 32"
    exit 1
fi

echo "✅ 环境变量检查通过"
echo ""

# 构建镜像
echo "📦 构建 Docker 镜像..."
docker compose build

echo ""
echo "🚀 启动服务..."
docker compose up -d

echo ""
echo "⏳ 等待服务启动..."
sleep 5

# 检查服务状态
echo ""
echo "📊 服务状态:"
docker compose ps

echo ""
echo "========================================="
echo "✅ 应用启动完成！"
echo "========================================="
echo ""
echo "访问地址:"
echo "  - 前端: http://localhost"
echo "  - 后端: http://localhost:3001"
echo "  - 数据库: localhost:5432"
echo ""
echo "常用命令:"
echo "  - 查看日志: docker compose logs -f"
echo "  - 停止服务: docker compose down"
echo "  - 重启服务: docker compose restart"
echo "  - 查看状态: docker compose ps"
echo ""

