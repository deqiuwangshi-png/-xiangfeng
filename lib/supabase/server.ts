import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseServerCookieOptions, getSupabaseSessionCookieConfig } from '@/lib/auth/utils/cookieConfig'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * 创建 Supabase 服务端客户端
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseKey, {
    cookieOptions: getSupabaseServerCookieOptions(),
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: object }[]
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, getSupabaseSessionCookieConfig(name, options as CookieOptions))
          })
        } catch {
          // Server Component 中设置 Cookie 可能会失败，这是正常的
        }
      },
    },
  })
}
