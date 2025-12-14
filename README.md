# Bun Fullstack Project

![CI Status](https://github.com/wersling/fullstack_tamplete_with_bun/workflows/CI%2FCD%20Pipeline/badge.svg)
![Docker Image](https://github.com/wersling/fullstack_tamplete_with_bun/workflows/Docker%20Image%20CI/badge.svg)
![Release](https://img.shields.io/github/v/release/wersling/fullstack_tamplete_with_bun)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

一个基于 Bun 的全栈项目模板，使用 TypeScript 开发，支持多种认证方式，配备完整的 CI/CD 流程。

## ✨ 特性

- ✅ **AI友好** - 100% Typescript，CLAUDE[开发规则](./CLAUDE.md)
- ✅ **极速 Bun 构建体验** - 原生 TS、包管理、测试一体，性能远超 Node.js
- ✅ **端到端类型安全** - 后端 API 改动，前端类型自动同步
- ✅ **多种认证方式** - 邮箱密码、Google OAuth、GitHub OAuth
- ✅ **国际化支持** - 内置中英文切换
- ✅ **完整 CI/CD** - 使用 GitHub Actions 构建应用程序并发布其 Docker 镜像
- ✅ **开发体验优先** - 热重载、类型提示、零配置

## 技术栈

### 后端
- **Runtime**: [Bun](https://bun.sh/) - 高性能 JavaScript 运行时
- **Framework**: [Hono](https://hono.dev/) - 轻量级 Web 框架
- **Auth**: [Better Auth](https://www.better-auth.com/) - 现代认证解决方案
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- **Database**: PostgreSQL
- **Language**: TypeScript

### 前端
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Library**: [React](https://react.dev/) 19
- **Routing**: [React Router](https://reactrouter.com/) v7（使用 loader/action 数据模式）
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

## 📚 文档

- 📖 **[快速开始](./docs/QUICK_START.md)** - 详细的环境搭建指南
- 🏗️ **[项目结构](./docs/PROJECT_STRUCTURE.md)** - 了解代码组织
- 💻 **[常用命令](./docs/COMMANDS.md)** - 所有命令速查表
- 🔒 **[类型安全](./docs/TYPE_SAFETY.md)** - 端到端类型安全指南
- 📡 **[API 参考](./docs/API_REFERENCE.md)** - 完整的 API 文档
- ⚠️ **[错误处理](./docs/ERROR_HANDLING.md)** - 统一错误处理机制
- 🗄️ **[自动迁移](./docs/AUTO_MIGRATION.md)** - 数据库迁移自动化
- 🐳 **[Docker 部署](./docker/README.md)** - Docker 容器化部署
- 🚢 **[部署指南](./docs/DEPLOYMENT.md)** - 其他部署方式


## License

MIT
