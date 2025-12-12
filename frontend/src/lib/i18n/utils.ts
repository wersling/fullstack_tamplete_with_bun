import { defaultLocale, type Locale } from './types'

// LocalStorage key
export const LOCALE_STORAGE_KEY = 'app-locale'

// 获取初始语言
export function getInitialLocale(): Locale {
    // 1. 优先从 localStorage 读取
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && (stored === 'en' || stored === 'zh')) {
        return stored
    }

    // 2. 从浏览器语言推断
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('zh')) {
        return 'zh'
    }

    // 3. 默认语言
    return defaultLocale
}

