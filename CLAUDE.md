# Claude AI 项目规则

> 本文档定义了 AI 助手在此项目中工作时应遵循的规则和最佳实践

## 🎯 项目概述

这是一个基于 **Bun** 的全栈项目模板，采用 monorepo 架构：
- **后端**: Hono + Better Auth + Drizzle ORM + SQLite
- **前端**: React 19 + Vite + Tailwind CSS v4 + Shadcn/ui
- **运行时**: Bun (替代 Node.js/npm/pnpm)

## 🔧 核心技术栈规则

### 1. 包管理器和运行时
- ✅ **包管理**: 必须使用 Bun，禁止使用 npm、pnpm、yarn
- ✅ **后端运行时**: 必须使用 Bun，替代 Node.js
- ✅ **前端构建**: 使用 Vite（通过 `bun run` 调用）
- ✅ 安装依赖: `bun install` 或 `bun add [package]`
- ✅ 运行脚本: `bun run [script]`
- ✅ 执行后端文件: `bun run [file.ts]`

### 2. TypeScript 配置
- ✅ 项目使用 TypeScript，所有新文件应为 `.ts` 或 `.tsx`
- ✅ 使用 ES Module (`"type": "module"`)
- ✅ 利用 Bun 的原生 TypeScript 支持，无需 ts-node

### 3. 后端开发规则

#### 框架和路由
- ✅ 使用 **Hono** 作为 Web 框架
- ✅ API 路由应遵循 RESTful 规范
- ✅ 认证相关端点统一使用 `/api/auth/*` 前缀

#### 数据库
- ✅ 使用 **Drizzle ORM** 进行数据库操作
- ✅ Schema 定义在 `backend/src/db/schema.ts`
- ✅ 数据库迁移命令:
  - 生成迁移: `bun run db:generate`
  - 执行迁移: `bun run db:migrate`
  - 可视化管理: `bun run db:studio`

#### 认证
- ✅ 使用 **Better Auth** 处理认证逻辑
- ✅ 支持邮箱密码、Google OAuth、GitHub OAuth
- ✅ 认证配置在 `backend/src/lib/auth.ts`
- ✅ 环境变量必须包含 `BETTER_AUTH_SECRET`

### 4. 前端开发规则

#### 构建工具
- ✅ 使用 **Vite** 作为前端构建工具
- ✅ 开发服务器: `bun run dev:frontend`（实际执行 `vite`）
- ✅ 生产构建: `bun run build:frontend`（实际执行 `vite build`）

**为什么使用 Vite 而非 Bun 原生 bundler？**
1. **架构需求**: 前后端分离架构，前端需要独立部署能力
2. **生态成熟**: React Fast Refresh、Tailwind v4 插件等开箱即用
3. **开发体验**: 毫秒级 HMR、精确错误提示、完善的 Source Map
4. **生产验证**: 经过数百万项目验证的稳定性和优化能力

#### UI 组件
- ✅ 使用 **Shadcn/ui** 组件库
- ✅ 添加新组件: `bunx --bun shadcn@latest add [component-name]`
- ✅ 组件位于 `frontend/src/components/ui/`
- ✅ 样式使用 **Tailwind CSS v4**

#### 状态管理和路由
- ✅ 使用 **React Router v7** 进行路由管理
- ✅ 使用 v7 新特性：`loader`（数据预加载）和 `action`（表单处理）
- ✅ 认证状态通过 `useAuth` Hook 管理
- ✅ API 请求通过 `lib/api-client.ts` 统一处理

**React Router v7 新特性说明：**
1. **数据加载器 (Loader)**: 页面渲染前预取数据
   ```typescript
   // 在页面组件中导出 loader 函数
   export async function homeLoader() {
       const data = await fetchData()
       return { data }
   }
   
   // 在组件中使用
   const loaderData = useLoaderData()
   ```

2. **表单操作 (Action)**: 服务端式的表单处理
   ```typescript
   // 导出 action 函数处理表单提交
   export async function loginAction({ request }: { request: Request }) {
       const formData = await request.formData()
       // 处理登录逻辑
       return redirect('/')
   }
   
   // 使用 Form 组件
   <Form method="post">...</Form>
   ```

3. **路由配置**: 使用 `createBrowserRouter` 集中管理
   ```typescript
   // router.tsx
   export const router = createBrowserRouter([
       { path: '/', element: <HomePage />, loader: homeLoader },
       { path: '/login', element: <LoginPage />, action: loginAction },
   ])
   
   // App.tsx
   <RouterProvider router={router} />
   ```

#### 国际化
- ✅ 使用 `useI18n` Hook 进行多语言支持
- ✅ 语言文件位于 `frontend/src/lib/i18n/locales/`
- ✅ 支持中文 (zh) 和英文 (en)

## 📁 项目结构约定

### 后端目录结构
```
backend/
├── src/
│   ├── db/              # 数据库相关
│   │   ├── index.ts     # 数据库连接
│   │   └── schema.ts    # 数据表定义
│   ├── lib/             # 工具库
│   │   └── auth.ts      # 认证配置
│   └── index.ts         # 应用入口
├── drizzle/             # 数据库迁移文件
├── drizzle.config.ts    # Drizzle 配置
└── package.json
```

### 前端目录结构
```
frontend/
├── src/
│   ├── components/      # React 组件
│   │   └── ui/          # Shadcn UI 组件
│   ├── hooks/           # 自定义 Hooks
│   ├── lib/             # 工具库
│   │   ├── i18n/        # 国际化
│   │   ├── api-client.ts
│   │   └── auth-client.ts
│   ├── pages/           # 页面组件
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

## 🔐 环境变量管理

### 后端环境变量 (.env)
```bash
# 服务器配置
PORT=3001

# Better Auth 密钥 (必需)
BETTER_AUTH_SECRET=your-secret-key

# Google OAuth (可选)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# GitHub OAuth (可选)
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

### 规则
- ✅ 敏感信息必须通过环境变量配置
- ✅ 不要在代码中硬编码密钥或凭证
- ✅ `.env` 文件不应提交到 Git 仓库
- ✅ 提供 `.env.example` 作为模板

## 💻 开发工作流

### 启动开发环境
```bash
# 一键启动前后端
bun run dev

# 或分别启动
bun run dev:backend  # 后端 (3001)
bun run dev:frontend # 前端 (5173)
```

## 📝 代码规范

### 通用规范
- ✅ 使用 **4 空格缩进**
- ✅ 添加必要的中文注释，单行注释在代码后
- ✅ 函数和类使用清晰的命名
- ✅ 导出的接口和类型使用 PascalCase
- ✅ 变量和函数使用 camelCase

### TypeScript 规范
```typescript
// ✅ 明确的类型定义
interface User {
    id: string;
    email: string;
    name: string | null;
}

// ✅ 使用类型推断
const users = await db.select().from(usersTable);

// ✅ async/await 代替 Promise
async function getUser(id: string): Promise<User | null> {
    return await db.query.users.findFirst({
        where: eq(usersTable.id, id)
    });
}
```

### React 规范
```typescript
// ✅ 函数组件 + Hooks
export function UserProfile() {
    const { user } = useAuth();
    const { t } = useI18n();
    
    return (
        <Card>
            <h2>{t('profile.title')}</h2>
            <p>{user?.email}</p>
        </Card>
    );
}

// ✅ 使用 Shadcn 组件
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
```

## 🧪 测试规范

- ✅ 使用 Bun 内置测试功能: `bun test`
- ✅ 测试文件命名: `*.test.ts` 或 `*.spec.ts`
- ✅ 单元测试覆盖核心业务逻辑
- ✅ API 测试使用 Hono 的测试工具

## 🚀 部署规范

### 构建
```bash
# 构建所有
bun run build

# 单独构建
bun run build:backend
bun run build:frontend
```

### 生产环境
- ✅ 后端构建输出到 `backend/dist/`
- ✅ 前端构建输出到 `frontend/dist/`
- ✅ 确保所有环境变量在生产环境正确配置
- ✅ 使用 HTTPS 和安全的 `BETTER_AUTH_SECRET`

## 📋 Git 提交规范

### Commit Message 格式
```
【标签】简短描述

详细说明（可选）
```

### 标签类型
- **【ADD】** - 添加新功能
- **【FIX】** - 修复 Bug
- **【UPDATE】** - 更新现有功能
- **【REMOVE】** - 删除代码或功能
- **【REFACTOR】** - 重构代码
- **【DOCS】** - 文档更新
- **【STYLE】** - 代码格式调整
- **【TEST】** - 测试相关

### 示例
```
【ADD】用户资料编辑功能

- 添加编辑表单组件
- 实现 API 端点 PUT /api/users/:id
- 更新数据库 schema
```

## 🎨 UI/UX 规范

- ✅ 遵循现代 UI 设计原则
- ✅ 响应式设计，支持移动端
- ✅ 使用 Tailwind 实用类而非自定义 CSS
- ✅ 保持组件可复用性
- ✅ 深色模式支持（如需要）

## ⚠️ 注意事项

### 禁止操作
- ❌ 不要使用 npm/yarn/pnpm 命令（包管理统一用 Bun）
- ❌ 不要在后端使用 Node.js 特定 API（优先使用 Bun API）
- ❌ 不要尝试用 Bun 原生 bundler 替代 Vite（架构不匹配）
- ❌ 不要在代码中硬编码敏感信息
- ❌ 不要提交 `.env` 文件到 Git
- ❌ 不要跳过数据库迁移直接修改数据库

### 优先级
1. **安全性**: 认证、授权、数据验证
2. **性能**: 利用 Bun 的高性能特性
3. **可维护性**: 清晰的代码结构和注释
4. **用户体验**: 响应式、易用的界面

## 🔄 常用命令速查

```bash
# 开发
bun run dev                    # 启动前后端
bun run dev:backend            # 仅后端
bun run dev:frontend           # 仅前端

# 数据库
bun run db:generate            # 生成迁移
bun run db:migrate             # 执行迁移
bun run db:studio              # 数据库管理界面

# 构建
bun run build                  # 构建全部
bun run build:backend          # 构建后端
bun run build:frontend         # 构建前端

# UI 组件
bunx --bun shadcn@latest add button  # 添加 Shadcn 组件

# 依赖管理
bun install                    # 安装依赖
bun add [package]              # 添加依赖
bun remove [package]           # 移除依赖
```

## 📚 参考资源

- [Bun 官方文档](https://bun.sh/docs)
- [Hono 官方文档](https://hono.dev/)
- [Better Auth 文档](https://www.better-auth.com/)
- [Drizzle ORM 文档](https://orm.drizzle.team/)
- [Shadcn/ui 文档](https://ui.shadcn.com/)
- [React Router v7 文档](https://reactrouter.com/)
- [Tailwind CSS v4 文档](https://tailwindcss.com/)

---

## 💬 技术决策说明

### 为什么保留 Vite？

虽然 Bun 提供了原生的 bundler 和 HTML imports 功能，但本项目仍然使用 Vite 作为前端构建工具，原因如下：

#### 1. 架构匹配度
- **前后端分离**: 后端 API (Hono) 和前端 SPA (React) 完全解耦
- **独立部署**: 前端可部署到 CDN/Vercel/Netlify，后端部署到支持 Bun 的平台
- Bun 的 HTML imports 适合单体架构，不适合本项目

#### 2. 生态成熟度
- **React 生态**: Fast Refresh、React DevTools 集成
- **插件支持**: Tailwind CSS v4 官方 Vite 插件
- **类型安全**: 完善的 TypeScript 支持和类型提示

#### 3. 开发体验
- **HMR**: 毫秒级的热模块替换
- **错误提示**: 精确的错误定位和堆栈跟踪
- **Source Map**: 生产环境调试友好

#### 4. 生产验证
- Vite 已被数百万项目验证
- 稳定的长期支持和社区维护
- 成熟的优化策略（代码分割、Tree Shaking、懒加载）

#### 5. 团队效率
- 社区资源丰富，问题容易解决
- 团队成员学习曲线平缓
- 降低技术风险和维护成本

---

**最后更新**: 2025-12-13  
**维护者**: AI Assistant

> 💡 提示：当项目技术栈或规范发生变化时，请及时更新此文档

