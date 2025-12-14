import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

// 数据库连接字符串
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/fullstack_db'

// 执行迁移
async function main() {
    console.log('🗄️  Running database migrations...')
    
    // 创建迁移专用连接（max: 1）
    const migrationClient = postgres(connectionString, { max: 1 })
    const db = drizzle(migrationClient)
    
    try {
        await migrate(db, { migrationsFolder: './drizzle' })
        console.log('✅ Migrations completed successfully')
        await migrationClient.end()
        process.exit(0)
    } catch (error) {
        console.error('❌ Migration failed:', error)
        process.exit(1)
    }
}

main()

