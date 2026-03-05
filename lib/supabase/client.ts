import { createBrowserClient } from '@supabase/ssr'

/**
 * 创建 Supabase 浏览器客户端
 * 
 * @returns Supabase 客户端实例
 * @throws {Error} 如果环境变量未配置
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
