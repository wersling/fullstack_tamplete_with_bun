import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db, schema } from "../db"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL 数据库
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  
  // 邮箱密码登录
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // 开发环境关闭邮箱验证
  },
  
  // OAuth 提供商
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
  
  // 信任的来源
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:3001",
    ...(process.env.TRUSTED_ORIGINS ? process.env.TRUSTED_ORIGINS.split(',') : []),
  ],
  
  // Session 配置
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 天
    updateAge: 60 * 60 * 24, // 每天更新
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 分钟缓存
    },
  },
  
  // 高级配置
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
  },
})

export type Session = typeof auth.$Infer.Session

