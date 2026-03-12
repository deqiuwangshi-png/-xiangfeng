import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * 创建带 STM 的 Supabase 客户端
 * 
 * @returns Supabase 服务端客户端实例
 * @throws {Error} 如果环境变量未配置
 */
export async function createSTMClient() {
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
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, {
              ...options,
              // SMTP 会话设置
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            })
          )
        } catch {
          // 忽略 Server Component 调用错误
        }
      },
    },
  })
}
