# 错误处理指南

## 概述

项目使用统一的错误处理机制，所有错误都会被自动捕获并返回一致的 JSON 格式响应。

## 错误类型

### 1. Zod 验证错误（400）

当请求参数验证失败时自动触发：

```typescript
const CreateUserSchema = z.object({
  name: z.string().min(1, '名字不能为空'),
  email: z.string().email('邮箱格式不正确'),
})

api.post('/users', zValidator('json', CreateUserSchema), (c) => {
  const data = c.req.valid('json')
  // 如果验证失败，自动返回错误
  return c.json({ ...data })
})
```

**错误响应**：
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": "email",
      "message": "邮箱格式不正确"
    }
  ]
}
```

---

### 2. 自定义应用错误

使用 `AppError` 类抛出业务逻辑错误：

```typescript
import { AppError } from './lib/error-handler'

api.get('/products/:id', async (c) => {
  const product = await db.getProduct(id)
  
  if (!product) {
    throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND')
  }
  
  return c.json(product)
})
```

**错误响应**：
```json
{
  "error": "Product not found",
  "code": "PRODUCT_NOT_FOUND"
}
```

---

### 3. 认证错误（401）

使用 `requireAuth` 中间件时自动处理：

```typescript
api.get('/me', requireAuth, (c) => {
  // 未登录会自动返回 401
  const session = c.get('session')
  return c.json({ user: session.user })
})
```

**错误响应**：
```json
{
  "error": "Unauthorized"
}
```

---

### 4. 404 Not Found

访问不存在的路由时自动返回：

```json
{
  "error": "Not Found"
}
```

---

### 5. 未捕获的错误（500）

**开发环境**（包含详细信息）：
```json
{
  "error": "Internal server error",
  "message": "Cannot read property 'id' of undefined",
  "stack": "Error: ...\n    at ..."
}
```

**生产环境**（隐藏详情）：
```json
{
  "error": "Internal server error"
}
```

---

## 使用方法

### 基础用法

```typescript
import { AppError } from './lib/error-handler'

// 抛出 400 错误
throw new AppError('Invalid input')

// 抛出 404 错误
throw new AppError('Resource not found', 404)

// 带错误代码
throw new AppError('Permission denied', 403, 'FORBIDDEN')
```

---

### 使用 asyncHandler 包装器

对于异步路由，使用 `asyncHandler` 自动捕获错误：

```typescript
import { asyncHandler } from './lib/error-handler'

api.get('/users/:id', asyncHandler(async (c) => {
  const user = await fetchUser(c.req.param('id'))
  
  if (!user) {
    throw new AppError('User not found', 404)
  }
  
  return c.json(user)
}))
```

**优势**：
- ✅ 自动捕获异步错误
- ✅ 无需手动 try/catch
- ✅ 错误会被统一处理

---

### 权限检查示例

```typescript
api.delete('/posts/:id', requireAuth, async (c) => {
  const session = c.get('session')
  const postId = c.req.param('id')
  
  const post = await db.getPost(postId)
  
  if (!post) {
    throw new AppError('Post not found', 404)
  }
  
  if (post.authorId !== session.user.id) {
    throw new AppError('You cannot delete this post', 403, 'FORBIDDEN')
  }
  
  await db.deletePost(postId)
  return c.json({ success: true })
})
```

---

## 常用错误代码

| 状态码 | 场景 | 示例 |
|--------|------|------|
| 400 | 请求参数错误 | `throw new AppError('Invalid input', 400)` |
| 401 | 未认证 | 由 `requireAuth` 自动处理 |
| 403 | 无权限 | `throw new AppError('Forbidden', 403)` |
| 404 | 资源不存在 | `throw new AppError('Not found', 404)` |
| 409 | 资源冲突 | `throw new AppError('Already exists', 409)` |
| 500 | 服务器错误 | 自动捕获未知错误 |

---

## 最佳实践

### ✅ 推荐做法

```typescript
// 1. 使用有意义的错误消息
throw new AppError('Email already registered', 409, 'EMAIL_DUPLICATE')

// 2. 使用 asyncHandler 包装异步路由
api.get('/data', asyncHandler(async (c) => {
  const data = await fetchData()
  return c.json(data)
}))

// 3. 添加错误代码便于前端处理
throw new AppError('Rate limit exceeded', 429, 'RATE_LIMIT')
```

### ❌ 不推荐做法

```typescript
// 1. 不要返回敏感信息
throw new AppError(`Database password: ${password}`, 500)  // ❌

// 2. 不要在生产环境暴露堆栈
// 已自动处理，无需手动添加

// 3. 不要忽略错误
try {
  await riskyOperation()
} catch {
  // ❌ 默默忽略
}
```

---

## 前端错误处理

前端可以根据错误类型进行相应处理：

```typescript
try {
  const res = await api.users.$post({ json: userData })
  
  if (!res.ok) {
    const error = await res.json()
    
    // 根据错误代码处理
    if (error.code === 'EMAIL_DUPLICATE') {
      showToast('该邮箱已被注册')
    } else if (error.details) {
      // Zod 验证错误
      error.details.forEach(d => {
        showFieldError(d.path, d.message)
      })
    } else {
      showToast(error.error)
    }
  }
} catch (err) {
  showToast('网络错误，请稍后重试')
}
```

---

## 调试技巧

### 查看详细错误日志

开发环境下，所有错误都会记录到控制台：

```bash
# 设置日志级别
LOG_LEVEL=debug bun run dev
```

### 测试错误处理

```bash
# 404 错误
curl http://localhost:3001/api/nonexistent

# 验证错误
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"invalid"}'

# 认证错误
curl http://localhost:3001/api/me
```

---

## 总结

✅ **统一格式** - 所有错误返回一致的 JSON 格式  
✅ **自动捕获** - 无需手动 try/catch  
✅ **详细日志** - 所有错误都会记录  
✅ **安全性** - 生产环境隐藏敏感信息  
✅ **类型安全** - TypeScript 完整支持  

详细示例请查看 `backend/src/lib/error-handler.example.ts`

