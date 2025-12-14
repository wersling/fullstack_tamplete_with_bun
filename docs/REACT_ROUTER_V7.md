# React Router v7 使用指南

本项目使用 **React Router v7** 的新特性来管理前端路由和数据加载。

## 核心概念

React Router v7 引入了全新的数据驱动模式，主要包括：

1. **Loader** - 页面加载前的数据预取
2. **Action** - 表单提交的服务端式处理
3. **RouterProvider** - 新的路由提供者组件

## 路由配置

### 集中式路由定义

在 `frontend/src/router.tsx` 中定义所有路由：

```typescript
import { createBrowserRouter, redirect } from 'react-router-dom'
import { HomePage, homeLoader } from '@/pages/HomePage'
import { LoginPage, loginAction } from '@/pages/LoginPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
        loader: homeLoader, // 数据预加载
    },
    {
        path: '/login',
        element: <LoginPage />,
        action: loginAction, // 表单处理
    },
    {
        path: '*',
        loader: () => redirect('/'), // 404 重定向
    },
])
```

### 在 App 中使用

```typescript
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'

function App() {
    return <RouterProvider router={router} />
}
```

## Loader - 数据预加载

### 基本用法

Loader 在页面组件渲染**之前**执行，用于预取数据：

```typescript
// HomePage.tsx
import { useLoaderData } from 'react-router-dom'
import { api } from '@/lib/api-client'

// 导出 loader 函数
export async function homeLoader() {
    try {
        const healthRes = await api.health.$get()
        if (healthRes.ok) {
            const data = await healthRes.json()
            return { data, error: null }
        }
        return { data: null, error: 'Failed to fetch' }
    } catch (error) {
        return { data: null, error: 'Network error' }
    }
}

// 组件中使用
export function HomePage() {
    const { data, error } = useLoaderData() as Awaited<ReturnType<typeof homeLoader>>
    
    return (
        <div>
            {data ? <p>{data.status}</p> : <p>{error}</p>}
        </div>
    )
}
```

### Loader 的优势

1. **服务端渲染友好** - 数据在页面渲染前就绪
2. **自动缓存** - React Router 会自动缓存 loader 数据
3. **并行加载** - 多个 loader 可以并行执行
4. **类型安全** - 通过 TypeScript 推导类型

## Action - 表单处理

### 基本用法

Action 用于处理表单提交，类似服务端的 POST 处理：

```typescript
// LoginPage.tsx
import { redirect, useActionData, Form } from 'react-router-dom'
import { authClient } from '@/lib/auth-client'

// 导出 action 函数
export async function loginAction({ request }: { request: Request }) {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
        const result = await authClient.signIn.email({ email, password })
        
        if (result.error) {
            return { error: result.error.message }
        }
        
        return redirect('/') // 成功后重定向
    } catch {
        return { error: '网络错误' }
    }
}

// 组件中使用
export function LoginPage() {
    const actionData = useActionData() as { error?: string } | undefined
    
    return (
        <Form method="post">
            {actionData?.error && <p>{actionData.error}</p>}
            
            <input name="email" type="email" required />
            <input name="password" type="password" required />
            <button type="submit">登录</button>
        </Form>
    )
}
```

### Action 的优势

1. **渐进增强** - 即使 JavaScript 未加载也能工作
2. **自动重新验证** - Action 成功后自动重新加载相关 loader
3. **乐观更新** - 支持乐观 UI 更新
4. **统一错误处理** - 错误自动返回给组件

## Form 组件

### 使用 React Router Form

```typescript
import { Form } from 'react-router-dom'

<Form method="post">
    {/* name 属性对应 formData.get() 的键 */}
    <input name="email" type="email" />
    <input name="password" type="password" />
    <button type="submit">提交</button>
</Form>
```

### Form vs 原生表单

| 特性 | React Router Form | 原生表单 |
|------|------------------|---------|
| 自动调用 action | ✅ | ❌ |
| 防止页面刷新 | ✅ | ❌ |
| 自动重新验证 | ✅ | ❌ |
| 渐进增强 | ✅ | ✅ |

## 导航和重定向

### 编程式导航

```typescript
import { useNavigate } from 'react-router-dom'

function MyComponent() {
    const navigate = useNavigate()
    
    const handleClick = () => {
        navigate('/dashboard')
    }
}
```

### Action 中重定向

```typescript
import { redirect } from 'react-router-dom'

export async function myAction() {
    // 处理成功后重定向
    return redirect('/success')
}
```

### Loader 中重定向

```typescript
import { redirect } from 'react-router-dom'

export async function protectedLoader() {
    const isAuthenticated = await checkAuth()
    
    if (!isAuthenticated) {
        return redirect('/login')
    }
    
    return { /* data */ }
}
```

## 数据重新验证

### 手动重新验证

```typescript
import { useRevalidator } from 'react-router-dom'

function MyComponent() {
    const revalidator = useRevalidator()
    
    const handleRefresh = () => {
        revalidator.revalidate() // 重新执行当前路由的 loader
    }
}
```

### 自动重新验证

以下情况会自动重新验证：
- Action 成功执行后
- 导航回到已访问的页面
- 通过 `<Form>` 或 `useSubmit` 提交表单

## 错误处理

### Loader 中的错误

```typescript
export async function myLoader() {
    try {
        const data = await fetchData()
        return { data, error: null }
    } catch (error) {
        // 返回错误信息而不是抛出
        return { data: null, error: '加载失败' }
    }
}
```

### Action 中的错误

```typescript
export async function myAction({ request }: { request: Request }) {
    try {
        // 处理逻辑
        return redirect('/success')
    } catch {
        // 返回错误让组件显示
        return { error: '操作失败' }
    }
}
```

## 类型安全

### Loader 类型推导

```typescript
// 定义 loader
export async function homeLoader() {
    return { message: 'Hello', count: 42 }
}

// 自动推导类型
type LoaderData = Awaited<ReturnType<typeof homeLoader>>

// 在组件中使用
export function HomePage() {
    const data = useLoaderData() as LoaderData
    // data.message 和 data.count 都有正确的类型
}
```

### Action 类型推导

```typescript
// 定义 action 返回类型
type ActionData = { error?: string }

export async function loginAction(): Promise<Response | ActionData> {
    // ...
}

// 在组件中使用
const actionData = useActionData() as ActionData | undefined
```

## 最佳实践

### 1. 将 loader/action 与组件放在同一文件

```typescript
// LoginPage.tsx
export async function loginAction() { /* ... */ }
export function LoginPage() { /* ... */ }
```

**好处**: 保持相关代码靠近，便于维护

### 2. 使用 TypeScript 类型推导

```typescript
type LoaderData = Awaited<ReturnType<typeof myLoader>>
const data = useLoaderData() as LoaderData
```

**好处**: 获得完整的类型检查

### 3. 错误通过返回值而非抛出

```typescript
// ✅ 推荐
return { data: null, error: '失败原因' }

// ❌ 不推荐
throw new Error('失败原因')
```

**好处**: 更容易在组件中处理错误

### 4. 使用 Form 组件而非原生表单

```typescript
// ✅ 推荐
<Form method="post">...</Form>

// ❌ 不推荐
<form onSubmit={handleSubmit}>...</form>
```

**好处**: 自动与 action 集成

### 5. Action 成功后重定向

```typescript
export async function createAction() {
    await createItem()
    return redirect('/items') // 成功后跳转
}
```

**好处**: 防止重复提交

## 项目示例

### HomePage - 使用 Loader

查看 `frontend/src/pages/HomePage.tsx`，展示了如何：
- 导出 `homeLoader` 预加载 API 健康状态
- 使用 `useLoaderData` 获取预加载的数据
- 提供手动刷新功能

### LoginPage - 使用 Action

查看 `frontend/src/pages/LoginPage.tsx`，展示了如何：
- 导出 `loginAction` 处理登录表单
- 使用 `Form` 组件提交表单
- 使用 `useActionData` 显示错误信息

### RegisterPage - 使用 Action + 验证

查看 `frontend/src/pages/RegisterPage.tsx`，展示了如何：
- 在 action 中进行表单验证
- 返回验证错误信息
- 使用 HTML5 验证属性

## 参考资源

- [React Router v7 官方文档](https://reactrouter.com/)
- [Remix 文档](https://remix.run/docs)（React Router v7 基于 Remix）
- [Loader API 文档](https://reactrouter.com/en/main/route/loader)
- [Action API 文档](https://reactrouter.com/en/main/route/action)

---

**更新日期**: 2025-12-13

