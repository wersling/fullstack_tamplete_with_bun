import { useState, useEffect } from 'react'
import { useNavigate, useLoaderData } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/hooks/useI18n'
import { localeNames, type Locale } from '@/lib/i18n'
import { 
    Server, Zap, Moon, Sun, LogOut, User, Languages, Github, 
    CheckCircle2, Rocket, Book, Package, Code, Layout, Database,
    Box, FileCode, Palette, Lock, Globe, GitBranch,
    ExternalLink, Sparkles
} from 'lucide-react'
import { api, type HealthResponse as ApiStatus } from '@/lib/api-client'

// React Router v7 Loader - 页面加载时预取数据
export async function homeLoader() {
    try {
        const healthRes = await api.health.$get()
        if (healthRes.ok) {
            const healthData = await healthRes.json()
            return { apiStatus: healthData, error: null }
        }
        return { apiStatus: null, error: 'Failed to fetch health status' }
    } catch (error) {
        console.error('Failed to fetch data:', error)
        return { apiStatus: null, error: 'Network error' }
    }
}

type LoaderData = Awaited<ReturnType<typeof homeLoader>>

export function HomePage() {
    const navigate = useNavigate()
    const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()
    const { locale, setLocale, t } = useI18n()
    const loaderData = useLoaderData() as LoaderData // 从 loader 获取预加载的数据
    
    const [apiStatus, setApiStatus] = useState<ApiStatus | null>(loaderData.apiStatus)
    const [darkMode, setDarkMode] = useState(false)
    const [showLangMenu, setShowLangMenu] = useState(false)

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])

    // 手动刷新数据的函数
    const fetchData = async () => {
        try {
            const healthRes = await api.health.$get()
            if (healthRes.ok) {
                const healthData = await healthRes.json()
                setApiStatus(healthData)
            }
        } catch (error) {
            console.error('Failed to fetch data:', error)
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

    // 特性数据
    const features = [
        { icon: Code, title: t.home.features.aiFriendly.title, desc: t.home.features.aiFriendly.desc },
        { icon: Zap, title: t.home.features.fastBuild.title, desc: t.home.features.fastBuild.desc },
        { icon: CheckCircle2, title: t.home.features.typeSafe.title, desc: t.home.features.typeSafe.desc },
        { icon: Lock, title: t.home.features.multiAuth.title, desc: t.home.features.multiAuth.desc },
        { icon: Globe, title: t.home.features.i18n.title, desc: t.home.features.i18n.desc },
        { icon: GitBranch, title: t.home.features.cicd.title, desc: t.home.features.cicd.desc },
        { icon: Rocket, title: t.home.features.devExp.title, desc: t.home.features.devExp.desc },
    ]

    // 后端技术栈
    const backendTech = [
        { icon: Box, name: 'Bun', desc: t.home.techStack.bun, url: 'https://bun.sh/' },
        { icon: Server, name: 'Hono', desc: t.home.techStack.hono, url: 'https://hono.dev/' },
        { icon: Lock, name: 'Better Auth', desc: t.home.techStack.betterAuth, url: 'https://www.better-auth.com/' },
        { icon: Database, name: 'Drizzle ORM', desc: t.home.techStack.drizzle, url: 'https://orm.drizzle.team/' },
        { icon: Database, name: 'PostgreSQL', desc: t.home.techStack.postgres, url: 'https://www.postgresql.org/' },
    ]

    // 前端技术栈
    const frontendTech = [
        { icon: Package, name: 'Vite', desc: t.home.techStack.vite, url: 'https://vitejs.dev/' },
        { icon: Layout, name: 'React 19', desc: t.home.techStack.react, url: 'https://react.dev/' },
        { icon: FileCode, name: 'React Router v7', desc: t.home.techStack.router, url: 'https://reactrouter.com/' },
        { icon: Palette, name: 'Tailwind CSS v4', desc: t.home.techStack.tailwind, url: 'https://tailwindcss.com/' },
        { icon: Box, name: 'Shadcn/ui', desc: t.home.techStack.shadcn, url: 'https://ui.shadcn.com/' },
        { icon: Sparkles, name: 'Lucide React', desc: t.home.techStack.lucide, url: 'https://lucide.dev/' },
    ]

    // 文档链接
    const docLinks = [
        { title: t.home.docs.quickStart.title, desc: t.home.docs.quickStart.desc, href: 'https://github.com/wersling/fullstack_tamplete_with_bun/blob/main/docs/QUICK_START.md' },
        { title: t.home.docs.structure.title, desc: t.home.docs.structure.desc, href: 'https://github.com/wersling/fullstack_tamplete_with_bun/blob/main/docs/PROJECT_STRUCTURE.md' },
        { title: t.home.docs.commands.title, desc: t.home.docs.commands.desc, href: 'https://github.com/wersling/fullstack_tamplete_with_bun/blob/main/docs/COMMANDS.md' },
        { title: t.home.docs.typeSafety.title, desc: t.home.docs.typeSafety.desc, href: 'https://github.com/wersling/fullstack_tamplete_with_bun/blob/main/docs/TYPE_SAFETY.md' },
        { title: t.home.docs.api.title, desc: t.home.docs.api.desc, href: 'https://github.com/wersling/fullstack_tamplete_with_bun/blob/main/docs/API_REFERENCE.md' },
        { title: t.home.docs.errorHandling.title, desc: t.home.docs.errorHandling.desc, href: 'https://github.com/wersling/fullstack_tamplete_with_bun/blob/main/docs/ERROR_HANDLING.md' },
        { title: t.home.docs.docker.title, desc: t.home.docs.docker.desc, href: 'https://github.com/wersling/fullstack_tamplete_with_bun/blob/main/docker/README.md' },
        { title: t.home.docs.deployment.title, desc: t.home.docs.deployment.desc, href: 'https://github.com/wersling/fullstack_tamplete_with_bun/blob/main/docs/DEPLOYMENT.md' },
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
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-chart-1/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* 头部导航 */}
                <header className="flex items-center justify-between mb-16">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                            <Zap className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">{t.home.title}</h1>
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
                        
                        {/* GitHub 按钮 */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => window.open('https://github.com/wersling/fullstack_tamplete_with_bun', '_blank')}
                            className="rounded-full"
                            title="GitHub Repository"
                        >
                            <Github className="h-4 w-4" />
                        </Button>

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

                {/* Hero 区域 */}
                <section className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                            {locale === 'zh' ? '现代化全栈开发模板' : 'Modern Fullstack Template'}
                        </span>
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {t.home.title}
                    </h1>
                    
                    <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                        {t.home.subtitle}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                        <Button size="lg" onClick={() => navigate('/register')} className="gap-2 shadow-lg">
                            <Rocket className="h-5 w-5" />
                            {t.home.hero.getStarted}
                        </Button>
                        <Button 
                            size="lg" 
                            variant="outline" 
                            onClick={() => window.open('https://github.com/wersling/fullstack_tamplete_with_bun', '_blank')}
                            className="gap-2"
                        >
                            <Github className="h-5 w-5" />
                            {t.home.hero.viewGithub}
                        </Button>
                        <Button 
                            size="lg" 
                            variant="outline"
                            onClick={() => window.open('https://github.com/wersling/fullstack_tamplete_with_bun/tree/main/docs', '_blank')}
                            className="gap-2"
                        >
                            <Book className="h-5 w-5" />
                            {t.home.hero.viewDocs}
                        </Button>
                    </div>

                    {/* Badge 徽章 */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <img src="https://github.com/wersling/fullstack_tamplete_with_bun/workflows/CI%2FCD%20Pipeline/badge.svg" alt="CI Status" />
                        <img src="https://github.com/wersling/fullstack_tamplete_with_bun/workflows/Docker%20Image%20CI/badge.svg" alt="Docker Image" />
                        <img src="https://img.shields.io/github/v/release/wersling/fullstack_tamplete_with_bun" alt="Release" />
                        <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
                    </div>
                </section>

                {/* API 状态卡片 */}
                <Card className="mb-12 border-chart-2/20 bg-gradient-to-r from-chart-2/5 to-transparent">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-chart-2" />
                            <CardTitle className="text-lg">{t.home.apiStatus.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {apiStatus ? (
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

                {/* 特性展示 */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">{t.home.features.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                <CardHeader>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                            <feature.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                                            <CardDescription className="text-sm leading-relaxed">
                                                {feature.desc}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* 技术栈展示 */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">{t.home.techStack.title}</h2>
                    
                    <div className="max-w-3xl mx-auto space-y-8">
                        {/* 后端技术栈 */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Server className="h-5 w-5 text-primary" />
                                {t.home.techStack.backend}
                            </h3>
                            <ul className="space-y-2 text-muted-foreground">
                                {backendTech.map((tech, index) => (
                                    <li key={index} className="flex items-start gap-3 group">
                                        <span className="text-primary mt-1">•</span>
                                        <div>
                                            <a 
                                                href={tech.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                                            >
                                                {tech.name}
                                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                            <span className="text-sm"> - {tech.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 前端技术栈 */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Layout className="h-5 w-5 text-primary" />
                                {t.home.techStack.frontend}
                            </h3>
                            <ul className="space-y-2 text-muted-foreground">
                                {frontendTech.map((tech, index) => (
                                    <li key={index} className="flex items-start gap-3 group">
                                        <span className="text-primary mt-1">•</span>
                                        <div>
                                            <a 
                                                href={tech.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                                            >
                                                {tech.name}
                                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                            <span className="text-sm"> - {tech.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 文档链接 */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">{t.home.docs.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {docLinks.map((doc, index) => (
                            <Card 
                                key={index} 
                                className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary"
                                onClick={() => window.open(doc.href, '_blank')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center justify-between">
                                        <span>{doc.title}</span>
                                        <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        {doc.desc}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* 页脚 */}
                <footer className="mt-16 pt-8 border-t text-center">
                    <p className="text-sm text-muted-foreground mb-4">{t.home.footer}</p>
                    <div className="flex items-center justify-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open('https://github.com/wersling/fullstack_tamplete_with_bun', '_blank')}
                            className="gap-2"
                        >
                            <Github className="h-4 w-4" />
                            GitHub
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open('https://github.com/wersling/fullstack_tamplete_with_bun/blob/main/LICENSE', '_blank')}
                        >
                            MIT License
                        </Button>
                    </div>
                </footer>
            </div>
        </div>
    )
}
