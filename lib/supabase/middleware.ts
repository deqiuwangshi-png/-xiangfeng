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
  '/article',
  '/profile',
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
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set({
            name,
            value,
            ...options,
          })
        })
        supabaseResponse = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        })
      },
    },
  })

  // 获取当前用户
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError) {
    console.error('Auth error in middleware:', userError.message)
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

  return supabaseResponse
}
