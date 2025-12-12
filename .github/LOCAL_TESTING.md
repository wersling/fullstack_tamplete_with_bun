# 本地测试 GitHub Actions

虽然 GitHub Actions 主要在云端运行，但你可以在本地模拟和测试工作流。

## 方法 1：手动模拟（推荐）

最简单的方法是手动执行工作流中的命令：

### 测试后端构建

```bash
cd backend

# 1. 安装依赖
bun install --frozen-lockfile

# 2. TypeScript 类型检查
bun run tsc --noEmit

# 3. 构建
bun run build

# 4. 运行测试
bun test
```

### 测试前端构建

```bash
cd frontend

# 1. 安装依赖
bun install --frozen-lockfile

# 2. ESLint 检查
bun run lint

# 3. TypeScript 类型检查
bun run tsc -b --noEmit

# 4. 构建
bun run build

# 5. 运行测试
bun test
```

### 测试完整构建

```bash
# 从项目根目录
bun run install:all
bun run build
```

## 方法 2：使用 act 工具

[act](https://github.com/nektos/act) 是一个可以在本地运行 GitHub Actions 的工具。

### 安装 act

**macOS**:
```bash
brew install act
```

**Linux**:
```bash
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

**Windows**:
```bash
choco install act-cli
```

### 使用 act

```bash
# 列出所有工作流
act -l

# 运行 push 事件的工作流
act push

# 运行特定任务
act -j backend

# 使用 GitHub token（如果需要）
act -s GITHUB_TOKEN=your-token

# 详细输出
act -v
```

### act 配置文件

创建 `.actrc` 文件（可选）：

```bash
# .actrc
-P ubuntu-latest=catthehacker/ubuntu:act-latest
--container-daemon-socket -
```

## 方法 3：创建测试脚本

创建一个本地测试脚本：

```bash
#!/bin/bash
# test-ci.sh

echo "🔍 开始 CI 测试..."

# 后端测试
echo "📦 测试后端..."
cd backend
bun install --frozen-lockfile
bun run tsc --noEmit || exit 1
bun run build || exit 1
cd ..

# 前端测试
echo "🎨 测试前端..."
cd frontend
bun install --frozen-lockfile
bun run lint
bun run tsc -b --noEmit || exit 1
bun run build || exit 1
cd ..

# 完整构建
echo "🏗️ 测试完整构建..."
bun run build || exit 1

echo "✅ 所有测试通过！"
```

赋予执行权限并运行：

```bash
chmod +x test-ci.sh
./test-ci.sh
```

## 常见问题

### Q: act 无法运行？
A: 确保 Docker 已安装并运行。act 需要 Docker 来创建容器。

### Q: 本地测试和 CI 结果不一致？
A: 检查以下几点：
- Bun 版本是否一致
- 是否使用了 `--frozen-lockfile`
- 环境变量是否配置正确

### Q: 如何测试需要环境变量的构建？
A: 使用 act 时通过 `-s` 参数传递：
```bash
act -s MY_SECRET=value
```

或创建 `.secrets` 文件：
```
MY_SECRET=value
ANOTHER_SECRET=value
```

然后运行：
```bash
act --secret-file .secrets
```

## 提示

- ✅ 提交前先在本地运行测试脚本
- ✅ 使用 `--frozen-lockfile` 确保依赖版本一致
- ✅ act 工具仅用于开发调试，不能完全替代真实 CI 环境
- ✅ 真实的 CI 测试在推送后自动运行

---

更多信息请参考：
- [act 文档](https://github.com/nektos/act)
- [GitHub Actions 本地开发指南](https://docs.github.com/actions/learn-github-actions/understanding-github-actions)





