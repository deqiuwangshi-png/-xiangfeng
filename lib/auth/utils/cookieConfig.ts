import type { CookieOptions } from '@supabase/ssr';

/**
 * 获取 Cookie 配置
 * @param maxAge - 过期时间（秒），默认7天
 * @returns Cookie 配置对象
 */
export function getCookieConfig(maxAge: number = 7 * 24 * 60 * 60): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  };
}
