import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getAuthCookieConfig, getDevAuthCookieConfig } from '@/lib/auth/utils/cookieConfig'

/**
 * @fileoverview Supabase 服务端客户端
 * @module lib/supabase/server
 * @description 用于 Server Components 和 Server Actions 的 Supabase 客户端
 *
 * @架构说明
 * - 服务端获取当前用户的唯一入口
 * - 自动处理 Cookie 读写和会话刷新
 * - 与 middleware.ts 配合实现统一会话管理
 *
 * @统一认证 2026-04-06
 * - 服务端通过此客户端获取用户
 * - 客户端通过 authStore 同步 Supabase 状态
 * - 中间件统一刷新会话并写入 Cookie
 */

/**
 * 创建 Supabase 服务端客户端
 *
 * @description 用于 Server Components 和 Server Actions 的客户端
 * @returns Supabase 服务端客户端实例
 * @throws {Error} 如果环境变量未配置
 *
 * @使用场景
 * - Server Components
 * - Server Actions
 * - API Routes
 *
 * @示例
 * ```typescript
 * // app/page.tsx (Server Component)
 * import { createClient } from '@/lib/supabase/server';
 *
 * export default async function Page() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('articles').select('*');
 *   return <div>{data.map(...)}</div>;
 * }
 * ```
 *
 * @示例
 * ```typescript
 * // lib/auth/actions/login.ts (Server Action)
 * 'use server';
 * import { createClient } from '@/lib/supabase/server';
 *
 * export async function login(formData: FormData) {
 *   const supabase = await createClient();
 *   const { data, error } = await supabase.auth.signInWithPassword({...});
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies()
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

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      /**
       * 获取所有 Cookie
       * @description 从请求中读取所有 Cookie
       */
      getAll() {
        return cookieStore.getAll()
      },
      /**
       * 设置所有 Cookie
       * @description 将 Cookie 写入响应
       * @注意 从 Server Component 调用时可能会抛出错误，这是正常的
       * @统一配置 使用与中间件相同的配置逻辑
       */
      setAll(cookiesToSet) {
        try {
          // 统一使用与中间件相同的配置函数
          const isDev = process.env.NODE_ENV === 'development'
          const cookieOptions = isDev ? getDevAuthCookieConfig() : getAuthCookieConfig()

          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              // 应用统一的 Cookie 安全配置
              ...cookieOptions,
            })
          })
        } catch {
          // `setAll` 方法从 Server Component 调用时可能会抛出错误
          // 这是正常的，因为 Server Component 不能直接设置 Cookie
          // 中间件会在响应时统一刷新会话
        }
      },
    },
    // 全局配置：增加超时和重试
    global: {
      fetch: (url: RequestInfo | URL, init?: RequestInit) => {
        // 设置 10 秒超时
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        return fetch(url, {
          ...init,
          signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId))
      },
    },
  })
}

/**
 * 服务端客户端类型
 * @description 导出类型供其他模块使用
 */
export type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>
