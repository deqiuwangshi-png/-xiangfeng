import { createClient } from '@supabase/supabase-js'

/**
 * 创建 Supabase 管理员客户端
 * 
 * 使用 Service Role Key，拥有管理员权限
 * 可以执行：删除用户、绕过 RLS 等操作
 * 
 * ⚠️ 只能在服务端使用！绝对不能暴露到客户端
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase URL or Service Role Key')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
