import type { CookieOptions } from '@supabase/ssr';

/**
 * 获取认证相关 Cookie 的统一配置
 *
 * @returns Cookie 配置对象
 *
 * @注意 httpOnly 设置为 false
 * 原因：Supabase 客户端需要在浏览器中读取会话 Cookie 进行认证
 * 安全性由 sameSite: 'strict' 和 secure 属性保障
 */
export function getAuthCookieConfig(): CookieOptions {
  return {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false, // 允许 JavaScript 读取，以便客户端 Supabase 获取会话
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
