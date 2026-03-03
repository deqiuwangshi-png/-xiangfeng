import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * 退出登录 API
 * POST /api/auth/logout
 * @description 清除服务端httpOnly Cookie和Supabase会话
 * @returns {Promise<NextResponse>} JSON响应，表示退出成功或失败
 */
export async function POST() {
  try {
    const supabase = await createClient()

    // 执行退出登录，清除服务端Cookie
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error.message)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // 返回成功响应
    return NextResponse.json(
      { success: true, message: '退出登录成功' },
      { status: 200 }
    )
  } catch (err) {
    console.error('Logout API error:', err)
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

/**
 * 也支持 GET 请求（用于直接访问链接退出）
 * GET /api/auth/logout
 * @description 直接访问URL退出登录，会重定向到登录页
 * @returns {Promise<NextResponse>} 重定向到登录页
 */
export async function GET() {
  const supabase = await createClient()

  // 执行退出登录
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error.message)
  }

  // 重定向到登录页
  return NextResponse.redirect(
    new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    { status: 302 }
  )
}
