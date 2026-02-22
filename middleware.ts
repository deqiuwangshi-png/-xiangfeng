import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Next.js 中间件
 * 用于处理 Supabase 会话更新
 * 
 * @param request - Next.js 请求对象
 * @returns Next.js 响应对象
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

/**
 * 配置中间件匹配路径
 */
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (网站图标)
     * - public 文件夹中的文件
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
