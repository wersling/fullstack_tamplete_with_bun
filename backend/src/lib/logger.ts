import pino from 'pino'

/**
 * 结构化日志配置
 * 
 * 开发环境：使用 pino-pretty 美化输出
 * 生产环境：输出 JSON 格式，便于日志聚合工具解析
 */
export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'production' 
        ? undefined  // 生产环境不使用 transport，直接输出 JSON
        : {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        },
})

/**
 * 创建子日志器，用于特定模块
 * 
 * @example
 * const dbLogger = createLogger('database')
 * dbLogger.info('Connected to database')
 */
export const createLogger = (name: string) => {
    return logger.child({ module: name })
}

