import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { logger } from '../lib/logger'

// 数据库连接字符串
// 使用现有的 PostgreSQL 容器（用户：postgres，端口：5432）
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/fullstack_db'

// 创建 PostgreSQL 连接
const client = postgres(connectionString, {
    max: 10,  // 最大连接数
    idle_timeout: 20,  // 空闲超时（秒）
    connect_timeout: 10,  // 连接超时（秒）
    onnotice: () => {},  // 禁用 PostgreSQL notice 日志
})

// 创建 Drizzle 实例
export const db = drizzle(client, { schema })

// 数据库连接日志
logger.info({ database: 'postgresql' }, 'Database connection initialized')

export { schema }
