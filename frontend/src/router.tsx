import { createBrowserRouter, redirect } from 'react-router-dom'
import { HomePage, homeLoader } from '@/pages/HomePage'
import { LoginPage, loginAction } from '@/pages/LoginPage'
import { RegisterPage, registerAction } from '@/pages/RegisterPage'

// React Router v7 路由配置
export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
        loader: homeLoader, // 页面加载时的数据获取
    },
    {
        path: '/login',
        element: <LoginPage />,
        action: loginAction, // 表单提交处理
    },
    {
        path: '/register',
        element: <RegisterPage />,
        action: registerAction, // 表单提交处理
    },
    {
        path: '*',
        loader: () => redirect('/'), // 404 重定向到首页
    },
])

