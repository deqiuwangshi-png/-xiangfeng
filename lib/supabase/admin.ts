/**
 * @fileoverview Supabase 管理员客户端
 * @module lib/supabase/admin
 * @description 使用 Service Role Key 创建具有管理员权限的 Supabase 客户端
 *
 * @安全警告 ⚠️
 * - 此文件只能在服务端使用（Server Components / Server Actions / API Routes）
 * - Service Role Key 拥有绕过 RLS 的权限，绝对不能暴露到客户端
 * - 导入此文件的客户端代码会导致编译错误
 *
 * @权限说明
 * - 可以执行：删除用户、绕过 RLS、查看所有数据
 * - 禁用自动刷新令牌和会话持久化
 */

import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

/**
 * 服务端环境检测
 * @description 确保此函数只在服务端执行
 * @throws {Error} 如果在客户端环境调用
 */
async function assertServerEnvironment(): Promise<void> {
  try {
    // 尝试访问服务端专用 API
    await headers()
  } catch {
    throw new Error(
      '[Security Error] createAdminClient() 只能在服务端使用。' +
      '请勿在客户端组件中导入此文件。'
    )
  }
}

/**
 * 创建 Supabase 管理员客户端
 *
 * @description 使用 Service Role Key 创建具有管理员权限的客户端
 * @returns Supabase 管理员客户端实例
 * @throws {Error} 如果环境变量未配置或在客户端调用
 *
 * @安全要求
 * - 只能在 Server Components、Server Actions、API Routes 中使用
 * - 绝对不能在 Client Components 中使用
 *
 * @使用场景
 * - 删除用户账户
 * - 批量数据操作
 * - 需要绕过 RLS 的管理员操作
 *
 * @示例
 * ```typescript
 * 'use server'
 * import { createAdminClient } from '@/lib/supabase/admin'
 *
 * export async function deleteUser(userId: string) {
 *   const admin = createAdminClient()
 *   await admin.auth.admin.deleteUser(userId)
 * }
 * ```
 */
export async function createAdminClient() {
  // 确保在服务端环境
  await assertServerEnvironment()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      '缺少 Supabase 环境变量: ' +
      [!supabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL', !serviceRoleKey && 'SUPABASE_SERVICE_ROLE_KEY']
        .filter(Boolean)
        .join(', ')
    )
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      // 禁用自动刷新令牌，管理员操作不需要会话管理
      autoRefreshToken: false,
      // 禁用会话持久化，每次操作都是独立的
      persistSession: false,
    },
  })
}

/**
 * 管理员客户端类型
 * @description 导出类型供其他模块使用
 */
export type AdminClient = Awaited<ReturnType<typeof createAdminClient>>
