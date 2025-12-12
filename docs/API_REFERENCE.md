# API 参考文档

## 基础信息

- **Base URL**: `http://localhost:3001`
- **认证方式**: Cookie-based Session (Better Auth)
- **Content-Type**: `application/json`

## 公开端点

### 根端点

```http
GET /
```

**响应示例**:
```json
{
  "message": "Welcome to Bun + Hono API Server",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "users": "/api/users",
    "auth": "/api/auth/*",
    "me": "/api/me"
  }
}
```

---

### 健康检查

```http
GET /api/health
```

**响应**:
```json
{
  "status": "ok",
  "timestamp": "2024-12-11T10:30:00.000Z"
}
```

---

### 认证端点

```http
ALL /api/auth/*
```

Better Auth 自动处理的认证端点：
- `POST /api/auth/sign-in/email` - 邮箱密码登录
- `POST /api/auth/sign-up/email` - 邮箱密码注册
- `GET /api/auth/sign-in/google` - Google OAuth 登录
- `GET /api/auth/sign-in/github` - GitHub OAuth 登录
- `POST /api/auth/sign-out` - 退出登录
- `GET /api/auth/callback/google` - Google OAuth 回调
- `GET /api/auth/callback/github` - GitHub OAuth 回调

详细文档请参考 [Better Auth 文档](https://www.better-auth.com/docs)

---

## 需要认证的端点

所有以下端点都需要用户已登录，否则返回 `401 Unauthorized`。

### 获取当前用户信息

```http
GET /api/me
```

**响应示例**:
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "image": null,
    "emailVerified": false
  },
  "session": {
    "id": "session_456",
    "userId": "user_123",
    "expiresAt": "2024-12-18T10:30:00.000Z"
  }
}
```

**错误响应**:
```json
{
  "error": "Unauthorized"
}
```

---

## 错误代码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

## 扩展 API

### 添加认证中间件

所有需要认证的路由都使用 `requireAuth` 中间件：

```typescript
import { requireAuth } from './lib/auth-middleware'

const api = new Hono()
  .get('/public', (c) => c.json({ data: 'public' }))
  .get('/protected', requireAuth, (c) => {
    const session = c.get('session')  // ✅ 已验证的 session
    return c.json({ user: session.user })
  })
```

### 类型安全

前端使用 Hono RPC Client 可以获得完整的类型推导：

```typescript
import { api } from '@/lib/api-client'

// ✅ 类型安全的 API 调用
const res = await api.me.$get()
const data = await res.json()
// TypeScript 自动知道 data 的类型！
```

详细使用方法请参考 [TYPE_SAFETY.md](./TYPE_SAFETY.md)

