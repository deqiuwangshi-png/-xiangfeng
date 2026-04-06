'use client'

/**
 * @fileoverview Supabase 浏览器客户端
 * @module lib/supabase/client
 * @description 用于 Client Components 的 Supabase 客户端
 *
 * @架构说明
 * - 单例模式，确保全局只有一个客户端实例
 * - 自动从 Cookie 读取会话
 * - 与 AuthProvider 配合实现状态同步
 *
 * @统一认证 2026-04-06
 * - 客户端通过此客户端监听 onAuthStateChange
 * - 服务端状态通过 AuthProvider 水合
 * - 中间件统一刷新会话并写入 Cookie
 */

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

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
  // 如果已有实例，直接返回
  if (supabaseInstance) {
    return supabaseInstance
  }

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

  // 创建新实例
  supabaseInstance = createBrowserClient(supabaseUrl, supabaseKey, {
    cookies: {
      /**
       * 获取所有 Cookie
       * @description 从 document.cookie 读取所有 Cookie
       */
      getAll() {
        return document.cookie.split(';').map((cookie) => {
          const [name, ...rest] = cookie.trim().split('=')
          return { name, value: rest.join('=') }
        })
      },
      /**
       * 设置所有 Cookie
       * @description 将 Cookie 写入浏览器
       */
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          let cookieString = `${name}=${value}`

          if (options) {
            if (options.path) cookieString += `; Path=${options.path}`
            if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`
            if (options.domain) cookieString += `; Domain=${options.domain}`
            if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`
            if (options.secure) cookieString += '; Secure'
            if (options.httpOnly) cookieString += '; HttpOnly'
          }

          document.cookie = cookieString
        })
      },
    },
  })

  return supabaseInstance
}

/**
 * 全局 Supabase 客户端实例
 * @description 用于需要直接使用全局实例的场景，避免重复创建客户端
 *
 * @使用场景
 * - 不需要在 useEffect 中创建客户端的场景
 * - 需要直接访问 Supabase 的工具函数
 *
 * @示例
 * ```typescript
 * import { supabase } from '@/lib/supabase/client';
 *
 * async function fetchArticles() {
 *   const { data } = await supabase.from('articles').select('*');
 *   return data;
 * }
 * ```
 */
export const supabase = createClient()

/**
 * 浏览器客户端类型
 * @description 导出类型供其他模块使用
 */
export type SupabaseBrowserClient = ReturnType<typeof createClient>
