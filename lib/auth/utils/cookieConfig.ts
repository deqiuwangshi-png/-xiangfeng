import type { CookieOptions } from '@supabase/ssr';

/**
 * 获取认证相关 Cookie 的统一配置
 * 
 * @returns Cookie 配置对象
 */
export function getAuthCookieConfig(): CookieOptions {
  return {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7天
  };
}

/**
 * 获取功能相关 Cookie 的统一配置（如浏览量统计）
 * 
 * @param maxAge - 过期时间（秒），默认 24小时
 * @returns Cookie 配置对象
 */
export function getFeatureCookieConfig(maxAge: number = 24 * 60 * 60): CookieOptions {
  return {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const,
    path: '/',
    maxAge,
  };
}
