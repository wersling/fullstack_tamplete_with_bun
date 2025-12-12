/**
 * 错误处理使用示例
 * 
 * 本文件展示如何在 API 路由中使用统一错误处理
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { AppError, asyncHandler } from './error-handler'
import { requireAuth } from './auth-middleware'

const exampleApi = new Hono()

// ============================================
// 示例 1: Zod 验证错误（自动处理）
// ============================================

const CreateProductSchema = z.object({
    name: z.string().min(1, '产品名不能为空'),
    price: z.number().positive('价格必须大于0'),
})

exampleApi.post('/products', zValidator('json', CreateProductSchema), (c) => {
    const data = c.req.valid('json')
    // ✅ 如果验证失败，自动返回 400 和详细错误信息
    // {
    //   "error": "Validation failed",
    //   "details": [
    //     { "path": "price", "message": "价格必须大于0" }
    //   ]
    // }
    return c.json({ id: 1, ...data }, 201)
})

// ============================================
// 示例 2: 自定义业务错误
// ============================================

exampleApi.get('/products/:id', async (c) => {
    const id = c.req.param('id')
    
    // 模拟数据库查询
    const product = null  // 假设找不到
    
    if (!product) {
        // ✅ 抛出自定义错误
        throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND')
        // 自动返回：
        // {
        //   "error": "Product not found",
        //   "code": "PRODUCT_NOT_FOUND"
        // }
    }
    
    return c.json(product)
})

// ============================================
// 示例 3: 使用 asyncHandler 包装器
// ============================================

exampleApi.get('/products/:id/reviews', asyncHandler(async (c) => {
    const id = c.req.param('id')
    
    // ✅ 任何 throw 都会被自动捕获
    if (!id) {
        throw new AppError('Invalid product ID', 400)
    }
    
    // 模拟可能失败的异步操作
    const reviews = await fetchReviewsFromDB(id)
    
    return c.json(reviews)
}))

async function fetchReviewsFromDB(id: string) {
    // 如果抛出错误，会被 asyncHandler 捕获
    throw new Error('Database connection failed')
}

// ============================================
// 示例 4: 认证错误
// ============================================

exampleApi.get('/products/my', requireAuth, (c) => {
    const session = c.get('session')
    
    // requireAuth 中间件会在未认证时自动返回 401
    // {
    //   "error": "Unauthorized"
    // }
    
    return c.json({ userId: session.user.id })
})

// ============================================
// 示例 5: 权限检查
// ============================================

exampleApi.delete('/products/:id', requireAuth, async (c) => {
    const session = c.get('session')
    const productId = c.req.param('id')
    
    // 检查用户是否有权限删除
    const product = await getProduct(productId)
    
    if (product.ownerId !== session.user.id) {
        // ✅ 返回 403 Forbidden
        throw new AppError('You do not have permission to delete this product', 403, 'FORBIDDEN')
    }
    
    await deleteProduct(productId)
    return c.json({ success: true })
})

async function getProduct(id: string) {
    return { id, ownerId: 'other-user' }
}

async function deleteProduct(id: string) {
    // 删除逻辑
}

// ============================================
// 错误响应格式总结
// ============================================

/**
 * 1. Zod 验证错误 (400)
 * {
 *   "error": "Validation failed",
 *   "details": [
 *     { "path": "fieldName", "message": "错误信息" }
 *   ]
 * }
 * 
 * 2. 自定义应用错误 (自定义状态码)
 * {
 *   "error": "错误信息",
 *   "code": "ERROR_CODE"  // 可选
 * }
 * 
 * 3. 未知错误 (500)
 * 开发环境：
 * {
 *   "error": "Internal server error",
 *   "message": "实际错误信息",
 *   "stack": "错误堆栈"
 * }
 * 
 * 生产环境：
 * {
 *   "error": "Internal server error"
 * }
 */

export { exampleApi }

