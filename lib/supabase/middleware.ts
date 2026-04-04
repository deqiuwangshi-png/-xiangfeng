import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { sanitizeRedirect } from '@/lib/auth/redir'
import { getAuthCookieConfig } from '@/lib/auth/cookieConfig'

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
 * - 中间件仅负责：
 *   1. 刷新 Supabase 会话（Cookie 同步）
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
        const secureOptions: CookieOptions = getAuthCookieConfig()

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

  {/*
    获取当前用户 - 用于会话刷新和登录页重定向

    @统一认证 2026-03-30
    注意：中间件中直接使用 supabase.auth.getUser() 是合理的，因为：
    1. 中间件不能使用 React cache()（服务端组件专用）
    2. 中间件需要直接操作请求/响应对象
    3. 这是认证流程的入口点，其他模块通过 lib/auth/user.ts 统一获取
  */}
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  // 常见的"本地残留 refresh token"错误：用户未登录/已清库/切换项目后会出现。
  // 这类错误不影响路由保护逻辑（当作未登录处理即可），避免在开发期刷屏。
  const isIgnorableAuthError =
    userError?.message === 'Auth session missing!'
    // supabase-js 会把 code 挂在 error 对象上（不同版本字段可能不完全一致）
    || (userError as unknown as { code?: string } | null | undefined)?.code === 'refresh_token_not_found'

  if (userError && !isIgnorableAuthError) {
    console.error('Auth error in middleware:', userError.message)
  }

  {/*
    路由保护逻辑 - 仅处理已登录用户访问登录页的情况

    @统一认证 2026-03-30
    - 未登录用户访问受保护路由的拦截已移至 (main)/layout.tsx
    - 中间件不再处理未登录用户的路由拦截
  */}
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
