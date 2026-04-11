/**
 * 认证状态检查 API
 * @module app/api/auth/route
 * @description 用于前端检查用户是否已登录
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/auth
 * 检查当前用户是否已认证
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.app_metadata?.role || 'authenticated',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('认证检查失败:', error);
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        error: '检查认证状态失败',
      },
      { status: 500 }
    );
  }
}
