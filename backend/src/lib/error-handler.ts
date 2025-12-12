import type { Context } from 'hono'
import { ZodError } from 'zod'
import { logger } from './logger'

/**
 * 自定义应用错误
 * 用于业务逻辑中需要返回特定错误的场景
 */
export class AppError extends Error {
    public readonly statusCode: number
    public readonly code?: string

    constructor(message: string, statusCode: number = 400, code?: string) {
        super(message)
        this.name = 'AppError'
        this.statusCode = statusCode
        this.code = code
    }
}

/**
 * 统一错误处理中间件
 * 捕获所有错误并返回统一格式的响应
 */
export const errorHandler = (err: Error, c: Context) => {
    // 1. Zod 验证错误
    if (err instanceof ZodError) {
        logger.warn({ errors: err.errors }, 'Validation error')
        return c.json(
            {
                error: 'Validation failed',
                details: err.errors.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message,
                })),
            },
            400
        )
    }

    // 2. 自定义应用错误
    if (err instanceof AppError) {
        logger.warn({ code: err.code, message: err.message }, 'Application error')
        return c.json(
            {
                error: err.message,
                ...(err.code && { code: err.code }),
            },
            err.statusCode as any  // Hono 的类型限制，实际运行时支持所有状态码
        )
    }

    // 3. 未知错误（不要暴露详细信息）
    logger.error({ err, stack: err.stack }, 'Unhandled error')
    
    // 生产环境隐藏错误详情
    const isDev = process.env.NODE_ENV !== 'production'
    
    return c.json(
        {
            error: 'Internal server error',
            ...(isDev && {
                message: err.message,
                stack: err.stack,
            }),
        },
        500
    )
}

/**
 * 异步路由处理器包装器
 * 自动捕获异步错误并传递给错误处理中间件
 */
export const asyncHandler = (
    fn: (c: Context) => Promise<Response>
) => {
    return async (c: Context) => {
        try {
            return await fn(c)
        } catch (error) {
            return errorHandler(error as Error, c)
        }
    }
}

