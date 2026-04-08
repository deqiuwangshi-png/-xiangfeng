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
 * - 客户端不直接操作 Cookie，由 @supabase/ssr 自动处理
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

  /**
   * 创建浏览器客户端
   * @注意 @supabase/ssr 会自动处理 Cookie 读写，无需自定义配置
   * Cookie 的 HttpOnly/Secure 属性由中间件统一设置
   */
  supabaseInstance = createBrowserClient(supabaseUrl, supabaseKey)

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
