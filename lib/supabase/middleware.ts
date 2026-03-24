import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { sanitizeRedirect } from '@/lib/auth/redir'

/**
 * 受保护的路由列表 - 需要登录才能访问
 */
const PROTECTED_ROUTES = [
  '/home',
  '/publish',
  '/drafts',
  '/inbox',
  '/profile',
  '/settings',
  '/feedback',
  '/updates',
  '/rewards',
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
 * 性能优化：
 * - 快速路径：公开路由跳过用户验证
 * - 延迟加载：安全头部仅在需要时设置
 * - 缓存优化：减少不必要的Cookie操作
 *
 * 安全特性：
 * - Cookie 安全属性（HttpOnly, Secure, SameSite）
 * - 刷新令牌轮换
 * - 路由访问控制
 */
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isProtectedRoute = isMatchingRoute(path, PROTECTED_ROUTES)
  const isAuthRoute = isMatchingRoute(path, AUTH_ROUTES)

  {/* 快速路径：公开路由不需要会话验证，直接返回 */}
  const isPublicRoute = !isProtectedRoute && !isAuthRoute
  if (isPublicRoute) {
    return NextResponse.next({
      request: { headers: request.headers },
    })
  }

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
        {/* 批量设置Cookie，减少响应对象重建 */}
        const secureOptions: CookieOptions = {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        }

        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set({
            name,
            value,
            ...options,
            ...secureOptions,
          })
        })

        supabaseResponse = NextResponse.next({
          request: { headers: request.headers },
        })

        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
            ...secureOptions,
          })
        })
      },
    },
  })

  {/* 获取当前用户 - 仅对需要验证的路由执行 */}
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  // 常见的“本地残留 refresh token”错误：用户未登录/已清库/切换项目后会出现。
  // 这类错误不影响路由保护逻辑（当作未登录处理即可），避免在开发期刷屏。
  const isIgnorableAuthError =
    userError?.message === 'Auth session missing!'
    // supabase-js 会把 code 挂在 error 对象上（不同版本字段可能不完全一致）
    || (userError as unknown as { code?: string } | null | undefined)?.code === 'refresh_token_not_found'

  if (userError && !isIgnorableAuthError) {
    console.error('Auth error in middleware:', userError.message)
  }

  {/* 路由保护逻辑 */}
  if (user && isAuthRoute) {
    {/* 已登录用户访问认证页面，重定向到首页或安全路径 */}
    const redirectParam = request.nextUrl.searchParams.get('redirect')
    let targetPath = sanitizeRedirect(redirectParam, '/home')

    if (isMatchingRoute(targetPath, AUTH_ROUTES)) {
      targetPath = '/home'
    }

    return NextResponse.redirect(new URL(targetPath, request.url))
  }

  if (!user && isProtectedRoute) {
    {/* 未登录用户访问受保护路由，重定向到登录页 */}
    const loginUrl = new URL('/login', request.url)
    const redirectPathWithSearch = `${path}${request.nextUrl.search}`
    loginUrl.searchParams.set('redirect', redirectPathWithSearch)
    return NextResponse.redirect(loginUrl)
  }

  {/* 安全头部 - 仅对受保护路由设置，减少开销 */}
  if (isProtectedRoute) {
    supabaseResponse.headers.set('X-Frame-Options', 'DENY')
    supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
    supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  }

  return supabaseResponse
}
