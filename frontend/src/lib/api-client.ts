import { hc, type InferResponseType } from 'hono/client'
import type { ApiRoutes } from '@backend/index'

// API 基础 URL - 根据环境自动选择
// 生产环境：使用相对路径 '/api'（通过 Nginx 反向代理到后端）
// 开发环境：直接连接到后端服务 'http://localhost:3001/api'
const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // 生产环境使用相对路径
  : 'http://localhost:3001/api'  // 开发环境直连后端

// 创建类型安全的 API 客户端
const client = hc<ApiRoutes>(API_BASE_URL, {
  // 启用 credentials 以支持认证 cookie
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: 'include',
    }),
})

// 导出客户端实例
export const api = client

// ============================================
// 类型自动推导 - 从后端 API 自动同步
// ============================================

// ✅ 这些类型会自动从后端 API 推导，无需手动维护
// 当后端 API 改变时，前端类型会自动更新（重新编译时）

// API 响应类型
export type HealthResponse = InferResponseType<typeof api.health.$get>
export type MeResponse = InferResponseType<typeof api.me.$get>

// ============================================
// 辅助函数 - 处理 API 响应
// ============================================

/**
 * 安全地解析 API 响应
 * 自动处理错误状态码
 */
export async function fetchApi<T>(
  request: Promise<Response>
): Promise<{ data: T; error: null } | { data: null; error: string }> {
  try {
    const res = await request
    const json = await res.json()

    if (!res.ok) {
      const errorMessage =
        typeof json === 'object' && json !== null && 'error' in json
          ? String(json.error)
          : `Request failed with status ${res.status}`
      return { data: null, error: errorMessage }
    }

    return { data: json as T, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
