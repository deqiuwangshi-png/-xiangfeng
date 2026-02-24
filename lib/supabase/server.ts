import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * 创建 Supabase 服务端客户端
 * 
 * @returns Supabase 服务端客户端实例
 * @throws {Error} 如果环境变量未配置
 */
export async function createClient() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // `setAll` 方法从 Server Component 调用。
          // 如果有中间件刷新用户会话，可以忽略此错误。
        }
      },
    },
  })
}
