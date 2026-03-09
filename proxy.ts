import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Next.js 代理
 * 用于处理 Supabase 会话更新
 * 
 * @param request - Next.js 请求对象
 * @returns Next.js 响应对象
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

/**
 * 配置代理匹配路径
 * @description 精简匹配范围，减少不必要的代理执行
 * 排除静态资源、API路由、源码映射等
 */
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (网站图标)
     * - public 文件夹中的文件
     * - API 路由 (不需要会话验证)
     * - 源码映射文件 (.map)
     * - CSS/JS 文件
     */
    '/((?!_next/static|_next/image|api/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|map)$).*)',
  ],
}
