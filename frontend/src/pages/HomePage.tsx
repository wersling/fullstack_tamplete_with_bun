import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/hooks/useI18n'
import { localeNames, type Locale } from '@/lib/i18n'
import { Server, Zap, Moon, Sun, LogOut, User, Languages } from 'lucide-react'
// 使用 Hono RPC 客户端 - 完整类型安全
import { api, type HealthResponse as ApiStatus } from '@/lib/api-client'

export function HomePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const { locale, setLocale, t } = useI18n()
  
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const fetchData = async () => {
    setLoading(true)
    try {
      // 使用 Hono RPC 客户端 - 类型安全的 API 调用
      const healthRes = await api.health.$get()
      if (healthRes.ok) {
        const healthData = await healthRes.json()
        setApiStatus(healthData)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const toggleLanguage = (newLocale: Locale) => {
    setLocale(newLocale)
    setShowLangMenu(false)
  }

  // 技术栈数据
  const techStackItems = [
    { name: 'Bun', desc: t.home.techStack.bun, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { name: 'Hono', desc: t.home.techStack.hono, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
    { name: 'React', desc: t.home.techStack.react, color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
    { name: 'TypeScript', desc: t.home.techStack.typescript, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { name: 'Tailwind', desc: t.home.techStack.tailwind, color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
    { name: 'Shadcn/ui', desc: t.home.techStack.shadcn, color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
    { name: 'Better Auth', desc: t.home.techStack.betterAuth, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { name: 'Drizzle', desc: t.home.techStack.drizzle, color: 'bg-lime-500/10 text-lime-600 dark:text-lime-400' },
  ]

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 transition-colors duration-300">
      {/* 背景装饰 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-chart-1/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 头部 */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{t.home.title}</h1>
              <p className="text-sm text-muted-foreground">{t.home.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="h-6 w-6 rounded-full" />
                    ) : (
                      <User className="h-3 w-3 text-primary" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  {t.common.logout}
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate('/login')}>
                {t.common.signIn}
              </Button>
            )}
            
            {/* 语言切换按钮 */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="rounded-full"
              >
                <Languages className="h-4 w-4" />
              </Button>
              
              {showLangMenu && (
                <div className="absolute right-0 top-full mt-2 bg-card border rounded-lg shadow-lg py-1 min-w-[120px] z-50">
                  {(Object.keys(localeNames) as Locale[]).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => toggleLanguage(loc)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors ${
                        locale === loc ? 'text-primary font-medium' : ''
                      }`}
                    >
                      {localeNames[loc]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* API 状态卡片 */}
        <Card className="mb-8 border-chart-2/20 bg-gradient-to-r from-chart-2/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-chart-2" />
              <CardTitle className="text-lg">{t.home.apiStatus.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
                {t.home.apiStatus.connecting}
              </div>
            ) : apiStatus ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {t.home.apiStatus.connected}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {t.home.apiStatus.lastChecked}: {new Date(apiStatus.timestamp).toLocaleTimeString()}
                </span>
                <Button variant="ghost" size="sm" onClick={fetchData}>
                  {t.common.refresh}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-destructive">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                {t.home.apiStatus.disconnected}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 认证状态提示 */}
        {!isAuthenticated && (
          <Card className="mb-8 border-chart-4/20 bg-gradient-to-r from-chart-4/5 to-transparent">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{t.home.authPrompt.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t.home.authPrompt.description}
                  </p>
                </div>
                <Button onClick={() => navigate('/login')}>
                  {t.common.signIn}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 技术栈展示 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t.home.techStack.title}</CardTitle>
            <CardDescription>
              {t.home.techStack.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {techStackItems.map((tech) => (
                <div
                  key={tech.name}
                  className={`p-4 rounded-lg ${tech.color} transition-transform hover:scale-105`}
                >
                  <p className="font-semibold">{tech.name}</p>
                  <p className="text-xs opacity-80">{tech.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 页脚 */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>{t.home.footer}</p>
        </footer>
      </div>
    </div>
  )
}
