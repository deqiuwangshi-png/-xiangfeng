import { createClient } from '@supabase/supabase-js'

/**
 * 创建用于 Sitemap 的 Supabase 客户端
 * @module lib/supabase/sitemap-client
 * @description 无需 cookie 的服务端客户端，用于静态生成场景
 */

/**
 * 创建 Sitemap 专用客户端
 * @returns {import('@supabase/supabase-js').SupabaseClient} Supabase 客户端
 */
export function createSitemapClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  // 使用普通客户端，不需要 cookie 支持
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
