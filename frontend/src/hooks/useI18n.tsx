import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { translations, defaultLocale, type Locale } from '@/lib/i18n'
import type { Translations } from '@/lib/i18n'

// 本地存储键名
const LOCALE_STORAGE_KEY = 'app-locale'

// 获取浏览器语言
function getBrowserLocale(): Locale {
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh')) return 'zh'
  return 'en'
}

// 获取初始语言（优先本地存储，其次浏览器语言）
function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored === 'en' || stored === 'zh') return stored
  return getBrowserLocale()
}

// Context 类型
interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

// 创建 Context
const I18nContext = createContext<I18nContextType | null>(null)

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

// Hook
export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

