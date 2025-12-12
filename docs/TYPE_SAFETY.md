# 🔒 类型安全 API 调用指南

## 🎯 核心优势

本项目使用 **Hono RPC Client** 实现了端到端的类型安全：

✅ **零手动维护** - 后端 API 改动，前端类型自动同步  
✅ **编译时检查** - 参数错误、字段拼写错误在编译时就能发现  
✅ **智能提示** - IDE 自动补全所有 API 端点和数据字段  
✅ **重构安全** - 后端重命名字段，前端所有引用都会报错  

---

## 📖 使用方法

### 1️⃣ 导入 API 客户端和类型

```typescript
import { api, type User, type CreateUserRequest } from '@/lib/api-client'
```

### 2️⃣ GET 请求 - 自动类型推导

```typescript
// ✅ 返回类型自动推导
const res = await api.users.$get()

if (res.ok) {
    const users = await res.json()
    // users 的类型是 User[] | { error: string }
    
    // 需要类型守卫来区分成功和错误
    if (!('error' in users)) {
        // 这里 TypeScript 知道 users 是 User[]
        console.log(users[0].name) // ✅ 类型安全
    }
}
```

### 3️⃣ POST 请求 - 参数自动检查

```typescript
// ✅ json 参数会自动进行类型检查
const res = await api.users.$post({
    json: {
        name: 'Alice',
        email: 'alice@example.com'
    }
})
```

---

## 🔄 工作原理

### 后端定义 API

```typescript
// backend/src/index.ts
import { requireAuth } from './lib/auth-middleware'

const api = new Hono()
  .get('/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() })
  })
  .get('/me', requireAuth, (c) => {
    const session = c.get('session')  // ✅ 类型安全的 session
    return c.json({ user: session.user })
  })

export type ApiRoutes = typeof api
```

### 前端自动推导类型

```typescript
// frontend/src/lib/api-client.ts
import { hc, type InferResponseType } from 'hono/client'
import type { ApiRoutes } from '@backend/index'

const client = hc<ApiRoutes>('http://localhost:3001/api')

// ✅ 类型自动从后端推导
export type HealthResponse = InferResponseType<typeof client.health.$get>
export type MeResponse = InferResponseType<typeof client.me.$get>
```

---

## 📋 可用类型

```typescript
import type {
    UsersResponse,      // 完整响应（包含错误情况）
    HealthResponse,     // 健康检查响应
    CreateUserRequest,  // 创建用户请求体
    User,               // 用户数据类型
} from '@/lib/api-client'
```

---

## 🛠️ 扩展新 API

### 1. 在后端添加端点

```typescript
// backend/src/index.ts
import { requireAuth } from './lib/auth-middleware'

const api = new Hono()
  .get('/products', (c) => {
    return c.json([{ id: 1, name: 'Product A', price: 99.99 }])
  })
  .post('/products', requireAuth, async (c) => {
    const session = c.get('session')  // ✅ 已验证的用户
    // 创建产品逻辑
    return c.json({ id: 1, name: 'New Product' }, 201)
  })
```

### 2. 前端自动获得类型

```typescript
// frontend/src/lib/api-client.ts
export type ProductsResponse = InferResponseType<typeof api.products.$get>
```

### 3. 直接使用

```typescript
const res = await api.products.$get()
const products = await res.json()
// ✅ TypeScript 知道 products 的类型
```

## 认证中间件

使用 `requireAuth` 中间件简化认证逻辑：

```typescript
// ❌ 旧方式 - 重复代码
.get('/users', async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  // ...
})

// ✅ 新方式 - 使用中间件
.get('/users', requireAuth, (c) => {
  const session = c.get('session')  // 已验证，直接使用
  // ...
})
```

详细的实战示例和最佳实践，请参考项目源码。

