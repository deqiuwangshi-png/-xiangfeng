/**
 * 认证状态检查 API
 * @module app/api/auth/route
 * @description 用于前端检查用户是否已登录
 */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/server';

/**
 * GET /api/auth
 * 检查当前用户是否已认证
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    const noStore = { 'Cache-Control': 'private, no-store, max-age=0' } as const;

    if (!user) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
        },
        { status: 200, headers: noStore }
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
      { status: 200, headers: noStore }
    );
  } catch (error) {
    console.error('[api/auth] 认证检查失败', {
      name: error instanceof Error ? error.name : 'UNKNOWN',
    });
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        error: '检查认证状态失败',
      },
      { status: 500, headers: { 'Cache-Control': 'private, no-store, max-age=0' } }
    );
  }
}
