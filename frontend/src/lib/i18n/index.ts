// 导入 JSON 翻译文件
import en from './locales/en.json'
import zh from './locales/zh.json'

// 导出类型
export type { Locale, Translations } from './types'
export { defaultLocale, localeNames } from './types'

// 所有翻译
export const translations = {
  en,
  zh,
} as const
