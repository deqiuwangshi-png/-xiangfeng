import { createBrowserClient } from '@supabase/ssr'

/**
 * 创建 Supabase 浏览器客户端
 * 
 * @returns Supabase 客户端实例
 * @throws {Error} 如果环境变量未配置
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
