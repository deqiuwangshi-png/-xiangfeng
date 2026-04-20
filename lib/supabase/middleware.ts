import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { sanitizeRedirect } from '@/lib/auth/utils/redir'
import {
  getCookieConfig,
  getSupabaseServerCookieOptions,
  getSupabaseSessionCookieConfig,
} from '@/lib/auth/utils/cookieConfig'

function isHttpsRequest(request: NextRequest): boolean {
  if (request.nextUrl.protocol === 'https:') return true
  const xf = request.headers.get('x-forwarded-proto')
  if (xf?.split(',')[0]?.trim() === 'https') return true
  return false
}

/**
 * 生产环境：检测到明文 HTTP（常见于反向代理未传 HTTPS）时强制跳转 HTTPS
 */
function redirectToHttpsIfNeeded(request: NextRequest): NextResponse | null {
  if (process.env.NODE_ENV !== 'production') return null
  if (process.env.DISABLE_FORCE_HTTPS_REDIRECT === '1') return null
  if (request.headers.get('x-forwarded-proto') !== 'http') return null

  const u = request.nextUrl.clone()
  u.protocol = 'https:'
  return NextResponse.redirect(u, 308)
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
 * 将当前路径注入请求头，供 Server Layout 等读取（Next 不直接提供 pathname）
 */
function withPathnameHeader(request: NextRequest): Headers {
  const h = new Headers(request.headers)
  h.set('x-pathname', request.nextUrl.pathname)
  return h
}

function nextWithPathname(request: NextRequest) {
  return NextResponse.next({
    request: { headers: withPathnameHeader(request) },
  })
}

/**
 * 更新用户会话
 *
 * @param request - Next.js 请求对象
 * @returns Next.js 响应对象
 *
 * @统一认证 2026-04-08
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
 * - 防止竞态条件的响应对象管理
 */
export async function updateSession(request: NextRequest) {
  const httpsRedirect = redirectToHttpsIfNeeded(request)
  if (httpsRedirect) return httpsRedirect

  const path = request.nextUrl.pathname
  const isAuthRoute = isMatchingRoute(path, AUTH_ROUTES)

  // 创建基础响应对象（附带 x-pathname，供 (main)/layout 等做路由级鉴权）
  let supabaseResponse = nextWithPathname(request)

  // 路由分级：仅认证页面需要中间件级 getUser() 以处理“已登录访问登录页”的重定向
  // 其他路径交由页面层鉴权，减少每请求都触发 getUser() 的强依赖
  if (!isAuthRoute) {
    return supabaseResponse
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Middleware] Missing Supabase environment variables')
    return supabaseResponse
  }

  const requestIsHttps = isHttpsRequest(request)

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookieOptions: getSupabaseServerCookieOptions({
      requestTlsTerminatedAsHttps: requestIsHttps,
    }),
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, cacheHeaders) {
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(
            name,
            value,
            getSupabaseSessionCookieConfig(name, options as CookieOptions, {
              requestTlsTerminatedAsHttps: requestIsHttps,
            })
          )
        })
        if (cacheHeaders) {
          for (const [key, val] of Object.entries(cacheHeaders)) {
            supabaseResponse.headers.set(key, val)
          }
        }
      },
    },
  })

  /**
   * 获取当前用户 - 用于会话刷新和登录页重定向
   * 
   * @关键说明 2026-04-08
   * supabase.auth.getUser() 会自动：
   * 1. 验证 access_token 是否过期
   * 2. 如果过期，使用 refresh_token 获取新的 access_token
   * 3. 将新的令牌写入 Cookie（通过 setAll）
   * 
   * 这是保持用户长期登录的关键！
   */
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  // 处理刷新令牌错误
  if (userError) {
    const errorCode = (userError as unknown as { code?: string })?.code
    const errorMessage = userError.message?.toLowerCase() || ''

    // 刷新令牌过期或无效 - 用户需要重新登录
    if (errorCode === 'refresh_token_not_found' ||
        errorCode === 'refresh_token_expired' ||
        errorMessage.includes('refresh token')) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Middleware] Auth session cleared (invalid or expired refresh)')
      }

      // 清除所有 Supabase 认证 Cookie
      const expireOpts = { ...getCookieConfig(0), maxAge: 0 }
      const cookieNames = request.cookies
        .getAll()
        .map((c) => c.name)
        .filter((name) => name.includes('auth-token') || name.startsWith('sb-'))

      cookieNames.forEach((name) => {
        supabaseResponse.cookies.set(
          name,
          '',
          getSupabaseSessionCookieConfig(name, { ...expireOpts } as CookieOptions, {
            requestTlsTerminatedAsHttps: isHttpsRequest(request),
          })
        )
      })
    }
    // 会话缺失 - 用户未登录（正常情况）
    else if (errorMessage.includes('auth session missing')) {
      // 正常情况，无需处理
    }
    // 其他错误
    else {
      console.error('[Middleware] Auth error', { code: errorCode ?? 'unknown' })
    }
  }

  /**
   * 路由保护逻辑 - 仅处理已登录用户访问登录页的情况
   * 
   * @统一认证 2026-04-08
   * - 未登录用户访问受保护路由的拦截已移至各 Layout
   * - 中间件不再处理未登录用户的路由拦截
   */
  if (user && isAuthRoute) {
    // 已登录用户访问认证页面，重定向到首页或安全路径
    const redirectParam = request.nextUrl.searchParams.get('redirect')
    let targetPath = sanitizeRedirect(redirectParam, '/home')

    if (isMatchingRoute(targetPath, AUTH_ROUTES)) {
      targetPath = '/home'
    }

    return NextResponse.redirect(new URL(targetPath, request.url))
  }

  return supabaseResponse
}
