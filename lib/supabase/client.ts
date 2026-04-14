'use client'

/**
 * 简化版 Supabase 浏览器客户端
 * @module lib/supabase/client
 */

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * 创建 Supabase 浏览器客户端
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey)
}
