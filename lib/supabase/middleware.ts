import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { sanitizeRedirect } from '@/lib/auth/utils/redir'
import { getAuthCookieConfig, getDevAuthCookieConfig } from '@/lib/auth/utils/cookieConfig'

/**
 * 获取当前环境的 Cookie 配置
 * @description 统一中间件和服务端的配置逻辑
 */
function getMiddlewareCookieConfig(): CookieOptions {
  const isDev = process.env.NODE_ENV === 'development'
  return isDev ? getDevAuthCookieConfig() : getAuthCookieConfig()
}

/**
 * 认证相关路由列表 - 已登录用户访问时重定向
 */
const AUTH_ROUTES = ['/login', '/register', '/forgot-password']

/**
 * 检查路径是否匹配路由列表
 */
function isMatchingRoute(path: string, routes: string[]): boolean {
  return routes.some(route => path === route || path.startsWith(`${route}/`))
}

/**
 * 更新用户会话
 *
 * @param request - Next.js 请求对象
 * @returns Next.js 响应对象
 *
 * @统一认证 2026-03-30
 * - 中间件负责：
 *   1. 刷新 Supabase 会话（Cookie 同步）- 关键！每次请求都刷新
 *   2. 已登录用户访问登录页时重定向
 * - 不再负责：
 *   1. 未登录用户的路由拦截（已移至 Layout 层）
 *   2. 安全头部设置（由页面层控制）
 *
 * @性能优化：
 * - 公开路由跳过用户验证
 * - 减少不必要的 Cookie 操作
 *
 * @安全特性：
 * - Cookie 安全属性（HttpOnly, Secure, SameSite）
 * - 刷新令牌轮换
 * - 每次请求自动刷新 access_token
 */
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isAuthRoute = isMatchingRoute(path, AUTH_ROUTES)

  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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
        {/* 使用统一的配置函数，确保与服务端一致 */}
        const secureOptions = getMiddlewareCookieConfig()

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

  {
    /*
    获取当前用户 - 用于会话刷新和登录页重定向
    
    @关键说明 2026-04-08
    supabase.auth.getUser() 会自动：
    1. 验证 access_token 是否过期
    2. 如果过期，使用 refresh_token 获取新的 access_token
    3. 将新的令牌写入 Cookie（通过 setAll）
    
    这是保持用户长期登录的关键！
    */
  }
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  // 处理刷新令牌错误
  if (userError) {
    const errorCode = (userError as unknown as { code?: string })?.code

    // 刷新令牌过期或无效 - 用户需要重新登录
    if (errorCode === 'refresh_token_not_found' ||
        errorCode === 'refresh_token_expired' ||
        userError.message?.includes('refresh token')) {
      console.log('[Middleware] Refresh token expired, clearing cookies')

      // 清除所有 Supabase 认证 Cookie，避免客户端显示虚假登录状态
      const cookieNames = request.cookies.getAll()
        .map(c => c.name)
        .filter(name => name.includes('auth-token'))

      cookieNames.forEach(name => {
        supabaseResponse.cookies.set({
          name,
          value: '',
          maxAge: 0,
          path: '/',
        })
      })
    }
    // 会话缺失 - 用户未登录
    else if (userError.message === 'Auth session missing!') {
      // 正常情况，未登录用户
    }
    // 其他错误
    else {
      console.error('Auth error in middleware:', userError.message, { code: errorCode })
    }
  }

  {
    /*
    路由保护逻辑 - 仅处理已登录用户访问登录页的情况

    @统一认证 2026-03-30
    - 未登录用户访问受保护路由的拦截已移至 (main)/layout.tsx
    - 中间件不再处理未登录用户的路由拦截
    */
  }
  if (user && isAuthRoute) {
    {/* 已登录用户访问认证页面，重定向到首页或安全路径 */}
    const redirectParam = request.nextUrl.searchParams.get('redirect')
    let targetPath = sanitizeRedirect(redirectParam, '/home')

    if (isMatchingRoute(targetPath, AUTH_ROUTES)) {
      targetPath = '/home'
    }

    return NextResponse.redirect(new URL(targetPath, request.url))
  }

  return supabaseResponse
}
