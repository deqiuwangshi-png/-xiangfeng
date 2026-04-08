/**
 * @fileoverview STM (Session Token Management) 专用 Supabase 客户端
 * @module lib/supabase/stm
 * @description STM 场景专用的服务端客户端
 *
 * @说明
 * - 此文件是 server.ts 的别名导出，保持向后兼容
 * - STM 场景使用标准的服务端客户端即可
 * - 未来如果需要 STM 特定的配置，可以在此扩展
 *
 * @统一认证 2026-04-06
 * - 复用 server.ts 的实现，避免代码重复
 * - 保持相同的 Cookie 配置和会话管理逻辑
 * @deprecated 直接使用 createClient from '@/lib/supabase/server' 即可
 */

import { createClient as createServerClient } from './server'

/**
 * 创建 STM 专用的 Supabase 客户端
 *
 * @description STM 场景使用标准服务端客户端
 * @returns Supabase 服务端客户端实例
 * @throws {Error} 如果环境变量未配置
 *
 * @使用场景
 * - STM 相关的服务端操作
 * - 需要会话管理的 Server Actions
 * @deprecated 请直接使用 createClient from '@/lib/supabase/server'
 */
export async function createSTMClient() {
  // 直接复用 server.ts 的实现
  return createServerClient()
}

/**
 * STM 客户端类型
 * @description 导出类型供其他模块使用
 * @deprecated 请使用 SupabaseServerClient from '@/lib/supabase/server'
 */
export type STMClient = Awaited<ReturnType<typeof createSTMClient>>
