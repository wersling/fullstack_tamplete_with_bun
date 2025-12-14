#!/bin/bash
# Docker 启动脚本
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
echo "🐳 启动 Fullstack 应用"
echo "========================================="
echo "📁 项目根目录: $PROJECT_ROOT"
echo "📁 Docker 目录: $DOCKER_DIR"
echo ""

# 检查 .env 文件（在 docker 目录下）
ENV_FILE="$DOCKER_DIR/.env"
ENV_EXAMPLE="$DOCKER_DIR/env.example"

if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️  $ENV_FILE 文件不存在"
    if [ -f "$ENV_EXAMPLE" ]; then
        echo "→ 从 env.example 复制..."
        cp "$ENV_EXAMPLE" "$ENV_FILE"
        echo "✅ 已创建 .env 文件"
    else
        echo "❌ 找不到 $ENV_EXAMPLE 文件！"
    fi
    echo ""
    echo "最少需要设置："
    echo "  - BETTER_AUTH_SECRET (运行: openssl rand -base64 32)"
    echo ""
    echo "示例内容："
    echo "BETTER_AUTH_SECRET=your-secret-key-here"
    echo "LOG_LEVEL=info"
    echo ""
    echo "请编辑 $ENV_FILE 并填写必要的环境变量"
    exit 1
fi

# 检查必需的环境变量
if ! grep -q "BETTER_AUTH_SECRET=.*[^[:space:]]" "$ENV_FILE" 2>/dev/null; then
    echo "❌ 错误: BETTER_AUTH_SECRET 未设置"
    echo "请在 $ENV_FILE 文件中设置此变量"
    echo "生成方法: openssl rand -base64 32"
    exit 1
fi

echo "✅ 环境变量检查通过"
echo ""

# 构建镜像（使用正确的 docker-compose 路径）
echo "📦 构建 Docker 镜像..."
docker compose -f "$DOCKER_DIR/docker-compose.yml" --env-file "$ENV_FILE" build

echo ""
echo "🚀 启动服务..."
docker compose -f "$DOCKER_DIR/docker-compose.yml" --env-file "$ENV_FILE" up -d

echo ""
echo "⏳ 等待服务启动..."
sleep 5

# 检查服务状态
echo ""
echo "📊 服务状态:"
docker compose -f "$DOCKER_DIR/docker-compose.yml" ps

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
echo "  - 查看日志: docker compose -f $DOCKER_DIR/docker-compose.yml logs -f"
echo "  - 停止服务: docker compose -f $DOCKER_DIR/docker-compose.yml down"
echo "  - 重启服务: docker compose -f $DOCKER_DIR/docker-compose.yml restart"
echo "  - 查看状态: docker compose -f $DOCKER_DIR/docker-compose.yml ps"
echo ""

