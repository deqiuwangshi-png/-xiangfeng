import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * 受保护的路由列表 - 需要登录才能访问
 */
const PROTECTED_ROUTES = [
  '/home',
  '/publish',
  '/drafts',
  '/inbox',
  // '/article', // 移除 - 公开文章允许匿名访问
  '/profile',   // 个人主页需要登录
  '/settings',
  '/earnings',
  '/feedback',
  '/updates',
]

/**
 * 认证相关路由列表 - 未登录用户才能访问
 */
const AUTH_ROUTES = ['/login', '/register', '/forgot-password']

/**
 * 检查路径是否匹配路由列表
 */
function isMatchingRoute(path: string, routes: string[]): boolean {
  return routes.some(route => path === route || path.startsWith(`${route}/`))
}

/**
 * 更新用户会话并实现路由保护
 *
 * @param request - Next.js 请求对象
 * @returns Next.js 响应对象
 * 
 * 安全特性：
 * - Cookie 安全属性（HttpOnly, Secure, SameSite）
 * - 刷新令牌轮换
 * - 路由访问控制
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables')
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          // 🔐 安全加固：添加 Cookie 安全属性
          const secureOptions: CookieOptions = {
            ...options,
            httpOnly: true,           // 防止 XSS 窃取 Cookie
            secure: process.env.NODE_ENV === 'production', // 生产环境强制 HTTPS
            sameSite: 'lax',          // 防止 CSRF 攻击
          };
          
          request.cookies.set({
            name,
            value,
            ...secureOptions,
          })
        })
        supabaseResponse = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        cookiesToSet.forEach(({ name, value, options }) => {
          // 🔐 安全加固：添加 Cookie 安全属性到响应
          const secureOptions: CookieOptions = {
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          };
          
          supabaseResponse.cookies.set({
            name,
            value,
            ...secureOptions,
          })
        })
      },
    },
  })

  // 获取当前用户
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError) {
    // 静默处理会话缺失错误（如用户已删除账户）
    if (userError.message !== 'Auth session missing!') {
      console.error('Auth error in middleware:', userError.message)
    }
  }

  const path = request.nextUrl.pathname

  // 1. 已登录用户访问认证页面，重定向到首页
  if (user && isMatchingRoute(path, AUTH_ROUTES)) {
    const redirectUrl = request.nextUrl.searchParams.get('redirect')
    const targetUrl = redirectUrl && !isMatchingRoute(redirectUrl, AUTH_ROUTES)
      ? redirectUrl
      : '/home'
    return NextResponse.redirect(new URL(targetUrl, request.url))
  }

  // 2. 未登录用户访问受保护路由，重定向到登录页
  if (!user && isMatchingRoute(path, PROTECTED_ROUTES)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  // 3. 🔐 安全加固：添加安全响应头部
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  supabaseResponse.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self'; connect-src 'self' https://*.supabase.co;"
  )
  // 移除 X-XSS-Protection（现代浏览器已弃用，使用 CSP 替代）

  return supabaseResponse
}
