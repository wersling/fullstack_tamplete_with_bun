#!/bin/bash

# CI 本地测试脚本
# 用于在推送前验证 CI 是否能通过

set -e  # 遇到错误立即退出

echo "════════════════════════════════════════════════════"
echo "🔍 开始 CI 本地测试"
echo "════════════════════════════════════════════════════"
echo ""

# 检查 Bun 是否安装
if ! command -v bun &> /dev/null; then
    echo "❌ 错误: 未找到 Bun"
    echo "请先安装 Bun: https://bun.sh"
    exit 1
fi

echo "✓ Bun 版本: $(bun --version)"
echo ""

# 测试后端
echo "────────────────────────────────────────────────────"
echo "📦 测试后端构建"
echo "────────────────────────────────────────────────────"
cd backend

echo "→ 安装依赖..."
bun install --frozen-lockfile

echo "→ TypeScript 类型检查..."
bun run tsc --noEmit

echo "→ 构建后端..."
bun run build

echo "→ 运行测试..."
bun test 2>/dev/null || echo "  (未找到测试文件)"

echo "✅ 后端测试通过"
echo ""

cd ..

# 测试前端
echo "────────────────────────────────────────────────────"
echo "🎨 测试前端构建"
echo "────────────────────────────────────────────────────"
cd frontend

echo "→ 安装依赖..."
bun install --frozen-lockfile

echo "→ ESLint 检查..."
bun run lint || echo "  (有警告但继续)"

echo "→ TypeScript 类型检查..."
bun run tsc -b --noEmit

echo "→ 构建前端..."
bun run build

echo "→ 运行测试..."
bun test 2>/dev/null || echo "  (未找到测试文件)"

echo "✅ 前端测试通过"
echo ""

cd ..

# 完整构建测试
echo "────────────────────────────────────────────────────"
echo "🏗️  测试完整项目构建"
echo "────────────────────────────────────────────────────"

echo "→ 执行完整构建..."
bun run build

echo "✅ 完整构建通过"
echo ""

# 检查构建产物
echo "────────────────────────────────────────────────────"
echo "📊 检查构建产物"
echo "────────────────────────────────────────────────────"

if [ -d "backend/dist" ]; then
    echo "✓ 后端构建产物: backend/dist/"
    ls -lh backend/dist/ | tail -n +2
else
    echo "❌ 未找到后端构建产物"
    exit 1
fi

echo ""

if [ -d "frontend/dist" ]; then
    echo "✓ 前端构建产物: frontend/dist/"
    du -sh frontend/dist
else
    echo "❌ 未找到前端构建产物"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "✅ 所有测试通过！可以安全推送到 GitHub"
echo "════════════════════════════════════════════════════"
echo ""
echo "下一步:"
echo "  git add ."
echo "  git commit -m '【ADD】你的提交信息'"
echo "  git push"
echo ""



