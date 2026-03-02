import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * 退出登录 API
 * POST /api/auth/logout
 */
export async function POST() {
  const supabase = await createClient()

  // 执行退出登录
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error.message)
  }

  // 重定向到登录页
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'), {
    status: 302,
  })
}

/**
 * 也支持 GET 请求（用于直接访问链接退出）
 * GET /api/auth/logout
 */
export async function GET() {
  return POST()
}
