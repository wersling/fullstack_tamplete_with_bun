import { createContext, useState, useEffect, type ReactNode } from 'react'
import { translations, type Locale } from '@/lib/i18n'
import type { Translations } from '@/lib/i18n'
import { LOCALE_STORAGE_KEY, getInitialLocale } from '@/lib/i18n/utils'

// Context 类型
export interface I18nContextType {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: Translations
}

// 创建 Context
export const I18nContext = createContext<I18nContextType | null>(null)

// Provider 组件
export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

    // 切换语言
    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale)
        localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
        // 更新 html lang 属性
        document.documentElement.lang = newLocale
    }

    // 初始化时设置 html lang
    useEffect(() => {
        document.documentElement.lang = locale
    }, [locale])

    const value: I18nContextType = {
        locale,
        setLocale,
        t: translations[locale],
    }

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

