import { createMiddleware } from 'hono/factory'
import { auth } from './auth'

/**
 * 认证中间件
 * 检查用户登录状态，未登录返回 401
 * 成功时将 session 存入 context，避免重复查询
 */
export const requireAuth = createMiddleware(async (c, next) => {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers,
    })

    if (!session) {
        return c.json({ error: 'Unauthorized' as const }, 401)
    }

    // 将 session 存入 context，后续路由可直接使用
    c.set('session', session)
    await next()
})

/**
 * 可选认证中间件
 * 尝试获取 session，但不强制要求
 * 无论是否登录都继续执行
 */
export const optionalAuth = createMiddleware(async (c, next) => {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers,
    })

    // 即使没有 session 也继续执行
    if (session) {
        c.set('session', session)
    }

    await next()
})

