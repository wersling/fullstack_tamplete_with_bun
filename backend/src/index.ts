import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger as honoLogger } from 'hono/logger'
import { auth } from './lib/auth'
import { requireAuth } from './lib/auth-middleware'
import { logger } from './lib/logger'
import { errorHandler } from './lib/error-handler'
import type { Session, User } from 'better-auth/types'

// 定义 Context 变量类型
type Variables = {
    session: {
        session: Session
        user: User
    }
}

const app = new Hono<{ Variables: Variables }>()

// 中间件
app.use('*', honoLogger())  // HTTP 请求日志
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// 全局错误处理
app.onError(errorHandler)

// Better Auth 路由处理
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  return auth.handler(c.req.raw)
})

// ============================================
// API 路由 - 使用链式调用以保留类型信息
// ============================================

// API 路由定义 - 链式调用保留完整类型
const api = new Hono<{ Variables: Variables }>()
  // 健康检查（无需认证）
  .get('/health', (c) => {
    return c.json({ 
      status: 'ok' as const, 
      timestamp: new Date().toISOString() 
    })
  })
  // 获取当前用户（需要认证）
  .get('/me', requireAuth, (c) => {
    // session 已由中间件验证并存入 context
    const session = c.get('session')
    
    return c.json({
      user: session.user,
      session: session.session,
    })
  })

// 挂载 API 路由
app.route('/api', api)

// 根路由
app.get('/', (c) => {
  return c.json({ 
    message: 'Welcome to Bun + Hono API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      me: '/api/me',
      auth: '/api/auth/*',
    }
  })
})

// 404 处理
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

const port = process.env.PORT || 3001

// 启动日志
logger.info({ port, env: process.env.NODE_ENV || 'development' }, 'Server starting')

export default {
  port,
  fetch: app.fetch,
}

// ============================================
// 导出 API 类型给前端使用
// ============================================
export type ApiRoutes = typeof api
