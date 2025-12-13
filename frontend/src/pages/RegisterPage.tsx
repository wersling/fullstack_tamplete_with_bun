import { Link, redirect, useActionData, Form } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/hooks/useI18n'
import { Loader2, Github, UserPlus } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

// React Router v7 Action - 处理注册表单提交
export async function registerAction({ request }: { request: Request }) {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // 表单验证
    if (password !== confirmPassword) {
        return { error: '两次输入的密码不一致' }
    }

    if (password.length < 8) {
        return { error: '密码至少需要 8 个字符' }
    }

    try {
        const result = await authClient.signUp.email({
            email,
            password,
            name,
        })

        if (result.error) {
            return { error: result.error.message || '注册失败' }
        }

        return redirect('/') // 注册成功，重定向到首页
    } catch {
        return { error: '网络错误，请稍后重试' }
    }
}

export function RegisterPage() {
    const { loginWithGoogle, loginWithGithub, isLoading } = useAuth()
    const { t } = useI18n()
    const actionData = useActionData() as { error?: string } | undefined // 获取 action 返回的数据

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle()
        } catch (error) {
            console.error('Google login failed:', error)
        }
    }

    const handleGithubLogin = async () => {
        try {
            await loginWithGithub()
        } catch (error) {
            console.error('GitHub login failed:', error)
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      {/* 背景装饰 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-chart-3/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-chart-4/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md border-border/50 shadow-2xl backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-chart-2 rounded-xl flex items-center justify-center mb-2">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">{t.register.title}</CardTitle>
          <CardDescription>
            {t.register.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* OAuth 按钮 */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="h-11 gap-2 hover:bg-muted/80"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            
            <Button
              variant="outline"
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="h-11 gap-2 hover:bg-muted/80"
            >
              <Github className="h-5 w-5" />
              GitHub
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
              {t.register.orRegisterWith}
            </span>
          </div>

          {/* 注册表单 - 使用 React Router Form */}
          <Form method="post" className="space-y-4">
            {actionData?.error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                {actionData.error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">{t.register.fullNameLabel}</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={t.register.fullNamePlaceholder}
                required
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t.register.emailLabel}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t.register.emailPlaceholder}
                required
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t.register.passwordLabel}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={t.register.passwordPlaceholder}
                required
                minLength={8}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                {t.register.passwordHint}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.register.confirmPasswordLabel}</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder={t.register.confirmPasswordPlaceholder}
                required
                minLength={8}
                className="h-11"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.register.creatingAccount}
                </>
              ) : (
                t.register.createAccount
              )}
            </Button>
          </Form>

          <p className="text-center text-sm text-muted-foreground">
            {t.register.hasAccount}{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              {t.common.signIn}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
