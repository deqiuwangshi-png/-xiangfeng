/**
 * OAuth 回调处理路由
 * @module app/auth/callback/route
 * @description 处理 GitHub 等第三方 OAuth 登录回调
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET 请求处理 - OAuth 回调
 * @param request Next.js 请求对象
 * @returns 重定向响应
 *
 * @流程
 * 1. 从 URL 获取 code 和 next 参数
 * 2. 使用 Supabase 交换 code 获取 session
 * 3. 重定向到目标页面
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/home';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }

    console.error('OAuth callback error:', error);
  }

  {/* 登录失败，返回登录页并显示错误 */}
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
