'use client'

/**
 * @fileoverview Supabase 浏览器客户端
 * @module lib/supabase/client
 * @description 用于 Client Components 的 Supabase 客户端
 *
 * @架构说明
 * - 单例模式，确保全局只有一个客户端实例
 * - 自动从 Cookie 读取会话（由 @supabase/ssr 内部处理）
 * - 与 AuthProvider 配合实现状态同步
 *
 * @统一认证 2026-04-06
 * - 客户端通过此客户端监听 onAuthStateChange
 * - 服务端状态通过 AuthProvider 水合
 * - 中间件统一刷新会话并写入 Cookie
 * - 通过 /api/auth/cookies 桥接读写 Cookie，由服务端合并 HttpOnly/Secure（@supabase/ssr 官方推荐模式）
 */

import { createBrowserClient, type CookieOptions } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_BROWSER_COOKIE_API_PATH } from '@/lib/supabase/authCookieBridge'

// 全局单例实例
let supabaseInstance: SupabaseClient | null = null

/**
 * 创建 Supabase 浏览器客户端（单例模式）
 *
 * @description 用于 Client Components 的 Supabase 客户端
 * @returns Supabase 浏览器客户端实例
 * @throws {Error} 如果环境变量未配置
 *
 * @特性
 * - 单例模式，确保全局只有一个客户端实例
 * - 自动从 Cookie 读取会话
 * - 支持 Realtime 订阅
 * - 支持 onAuthStateChange 监听
 *
 * @使用场景
 * - Client Components
 * - 浏览器端交互
 * - 需要监听认证状态变化的场景
 *
 * @示例
 * ```typescript
 * 'use client';
 * import { createClient } from '@/lib/supabase/client';
 *
 * export function UserProfile() {
 *   const supabase = createClient();
 *
 *   useEffect(() => {
 *     const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
 *       console.log('Auth state changed:', event);
 *     });
 *     return () => subscription.unsubscribe();
 *   }, []);
 * }
 * ```
 */
export function createClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      '缺少 Supabase 环境变量: ' +
      [!supabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL', !supabaseKey && 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
        .filter(Boolean)
        .join(', ')
    )
  }

  // 构建期 / RSC：禁止走 Cookie 桥接 fetch，否则静态页生成会被迫变为动态路由
  if (typeof window === 'undefined') {
    return createBrowserClient(supabaseUrl, supabaseKey)
  }

  if (supabaseInstance) {
    return supabaseInstance
  }

  /**
   * Cookie 桥接：避免在浏览器使用 document.cookie，写入由 Route Handler 统一加安全属性；
   * setAll 第二参数为 Supabase 要求的防 CDN 缓存头（@supabase/ssr ≥0.10）。
   */
  let cookieGetInFlight: Promise<{ name: string; value: string }[]> | null = null
  supabaseInstance = createBrowserClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: async () => {
        try {
          if (!cookieGetInFlight) {
            cookieGetInFlight = fetch(SUPABASE_BROWSER_COOKIE_API_PATH, {
              method: 'GET',
              credentials: 'include',
              cache: 'no-store',
            })
              .then(async (res) => {
                if (!res.ok) return []
                const data = (await res.json()) as { cookies?: { name: string; value: string }[] }
                return data.cookies ?? []
              })
              .finally(() => {
                cookieGetInFlight = null
              })
          }
          return cookieGetInFlight
        } catch {
          return []
        }
      },
      setAll: async (cookiesToSet, cacheHeaders) => {
        try {
          await fetch(SUPABASE_BROWSER_COOKIE_API_PATH, {
            method: 'POST',
            credentials: 'include',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cookies: cookiesToSet, headers: cacheHeaders }),
          })
        } catch {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[supabase/client] Cookie 桥接 POST 失败')
          }
        }
      },
    },
    // 与 cookieConfig 一致：默认 Secure + lax；明文本地调试需同时在 .env 设置
    // COOKIE_ALLOW_INSECURE_LOCAL=1 与 NEXT_PUBLIC_COOKIE_ALLOW_INSECURE_LOCAL=1
    cookieOptions: {
      path: '/',
      sameSite: 'lax',
      secure:
        process.env.NODE_ENV === 'production'
          ? true
          : process.env.NEXT_PUBLIC_COOKIE_ALLOW_INSECURE_LOCAL === '1'
            ? typeof window !== 'undefined' && window.location.protocol === 'https:'
            : true,
    } satisfies CookieOptions,
  })

  return supabaseInstance
}

/**
 * 浏览器客户端类型
 * @description 导出类型供其他模块使用
 */
export type SupabaseBrowserClient = ReturnType<typeof createClient>
