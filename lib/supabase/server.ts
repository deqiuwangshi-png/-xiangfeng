import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getAuthCookieConfig } from '@/lib/auth/cookieConfig'

/**
 * 创建 Supabase 服务端客户端
 * 
 * @returns Supabase 服务端客户端实例
 * @throws {Error} 如果环境变量未配置
 */
export async function createClient() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              // 允许客户端获取会话（用于 Realtime 等能力），不强行覆盖 httpOnly
              ...getAuthCookieConfig(),
            })
          })
        } catch {
          // `setAll` 方法从 Server Component 调用。
          // 如果有中间件刷新用户会话，可以忽略此错误。
        }
      },
    },
  })
}
