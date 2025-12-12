/**
 * 错误处理测试
 * 
 * 运行: bun test error-handler.test.ts
 */

import { describe, it, expect } from 'bun:test'
import { AppError } from './error-handler'

describe('AppError', () => {
    it('应该创建带默认状态码的错误', () => {
        const error = new AppError('Test error')
        
        expect(error.message).toBe('Test error')
        expect(error.statusCode).toBe(400)
        expect(error.name).toBe('AppError')
        expect(error.code).toBeUndefined()
    })
    
    it('应该创建带自定义状态码的错误', () => {
        const error = new AppError('Not found', 404)
        
        expect(error.message).toBe('Not found')
        expect(error.statusCode).toBe(404)
    })
    
    it('应该创建带错误代码的错误', () => {
        const error = new AppError('Forbidden', 403, 'FORBIDDEN')
        
        expect(error.message).toBe('Forbidden')
        expect(error.statusCode).toBe(403)
        expect(error.code).toBe('FORBIDDEN')
    })
    
    it('应该是 Error 的实例', () => {
        const error = new AppError('Test')
        
        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(AppError)
    })
})

