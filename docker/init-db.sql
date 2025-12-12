-- 数据库初始化脚本
-- 在 PostgreSQL 首次启动时自动执行

-- 创建数据库（如果使用不同名称）
-- CREATE DATABASE IF NOT EXISTS fullstack_db;

-- 设置默认 schema
SET search_path TO public;

-- 创建扩展（如需要）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 添加初始数据（可选）
-- INSERT INTO users (name, email) VALUES ('Admin', 'admin@example.com');

-- 输出日志
DO $$
BEGIN
    RAISE NOTICE 'Database initialization completed';
END $$;

