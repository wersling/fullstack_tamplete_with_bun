// 从 en.json 导入类型（作为基准）
import type en from './locales/en.json'

// 支持的语言类型
export type Locale = 'en' | 'zh'

// 翻译结构类型（从 JSON 推导）
export type Translations = typeof en

// 默认语言
export const defaultLocale: Locale = 'en'

// 语言显示名称
export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
}

