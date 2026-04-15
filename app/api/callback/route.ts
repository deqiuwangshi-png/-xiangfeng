/**
 * OAuth 回调处理路由
 * @module app/auth/callback/route
 * @description 处理 GitHub 等第三方 OAuth 登录回调和账号绑定回调
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncIdentitiesToDatabase } from '@/lib/settings/actions/linkedAccounts';
import { sanitizeRedirect } from '@/lib/auth/utils/redir';

/**
 * GET 请求处理 - OAuth 回调
 * @param request Next.js 请求对象
 * @returns 重定向响应
 *
 * @流程
 * 1. 从 URL 获取 code、next 和 linked 参数
 * 2. 使用 Supabase 交换 code 获取 session
 * 3. 如果是绑定流程，同步身份信息到数据库
 * 4. 重定向到目标页面
 */
/**
 * 默认重定向路径
 */
const DEFAULT_REDIRECT = '/home';

/**
 * GET 请求处理 - OAuth 回调
 *
 * @安全说明
 * - 使用 sanitizeRedirect 清洗 next 参数，防止开放重定向攻击
 * - 禁止跳转到外部域名，只允许站内路径
 *
 * @param request Next.js 请求对象
 * @returns 重定向响应
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextRaw = searchParams.get('next') ?? DEFAULT_REDIRECT;
  const next = sanitizeRedirect(nextRaw, DEFAULT_REDIRECT);
  const isLinkedFlow = searchParams.get('linked') === 'true';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // OAuth登录/绑定时，同步身份信息到数据库
      // 确保user_identities表中有记录，设置页面才能正确显示
      const syncResult = await syncIdentitiesToDatabase();
      if (!syncResult.success) {
        console.error('同步身份信息失败:', syncResult.error);
        // 同步失败也继续跳转，但如果是绑定流程则带上错误标记
        if (isLinkedFlow) {
          const redirectUrl = new URL(next, origin);
          redirectUrl.searchParams.set('link_error', 'sync_failed');
          return NextResponse.redirect(redirectUrl.toString());
        }
      }

      // 如果是账号绑定流程，带上成功标记
      if (isLinkedFlow) {
        const redirectUrl = new URL(next, origin);
        redirectUrl.searchParams.set('linked', 'success');
        return NextResponse.redirect(redirectUrl.toString());
      }

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
