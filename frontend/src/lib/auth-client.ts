import { createAuthClient } from "better-auth/react"

// 认证 API 基础 URL - 根据环境自动选择
// 生产环境：使用当前域名（通过 Nginx 反向代理到后端）
// 开发环境：直接连接到后端服务
const AUTH_BASE_URL = import.meta.env.PROD 
  ? window.location.origin  // 生产环境使用当前域名
  : "http://localhost:3001"  // 开发环境直连后端

export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient

