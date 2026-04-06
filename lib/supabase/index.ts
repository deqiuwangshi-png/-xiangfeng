/**
 * @fileoverview Supabase 客户端模块统一导出
 * @module lib/supabase
 * @description 提供项目中所有 Supabase 客户端的统一导出入口
 *
 * @架构说明
 * - 服务端使用: import { createClient } from '@/lib/supabase'
 * - 客户端使用: import { createBrowserClient } from '@/lib/supabase'
 * - 管理员使用: import { createAdminClient } from '@/lib/supabase'
 *
 * @安全分区
 * - 服务端导出: createClient, getCurrentUser, createAdminClient
 * - 客户端导出: createBrowserClient, supabase
 * - 中间件导出: updateSession
 */

// ============================================
// 服务端导出（Server Components / Server Actions）
// ============================================

export { createClient } from './server'
export type { SupabaseServerClient } from './server'

// 用户获取工具（带 React cache）
export {
  getCurrentUser,
  isAuthenticated,
  getCurrentUserId,
  getCurrentUserWithProfile,
  type UserProfile,
} from './user'

// ============================================
// 客户端导出（Client Components）
// ============================================

export { createClient as createBrowserClient, supabase } from './client'
export type { SupabaseBrowserClient } from './client'

// ============================================
// 管理员导出（Server Only - Service Role）
// ============================================

export { createAdminClient } from './admin'
export type { AdminClient } from './admin'

// ============================================
// 中间件导出（Middleware）
// ============================================

export { updateSession } from './middleware'

// ============================================
// 特殊场景导出
// ============================================

// Sitemap 专用客户端（静态生成）
export { createSitemapClient } from './sitemap-client'

// STM 专用客户端
export { createSTMClient } from './stm'
export type { STMClient } from './stm'
