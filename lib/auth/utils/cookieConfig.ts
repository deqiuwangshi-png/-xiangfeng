import type { CookieOptions } from '@supabase/ssr';

/**
 * 获取认证相关 Cookie 的统一配置
 *
 * @returns Cookie 配置对象
 *
 * @安全说明
 * - httpOnly: true - 防止 XSS 攻击窃取 Cookie
 * - secure: true - 仅 HTTPS 传输
 * - sameSite: 'lax' - 防止 CSRF 攻击，同时允许标签页切换后的正常访问
 * - maxAge: 7天 - 合理的会话过期时间
 *
 * @重要提示
 * 启用 httpOnly 后，客户端 JavaScript 无法读取认证 Cookie，
 * 这是安全的设计。客户端应通过 Server Actions 或 API 路由
 * 获取需要的用户信息。
 *
 * @修复 2026-04-08 将 sameSite 从 'strict' 改为 'lax'
 * - 'strict' 在浏览器标签页切换后可能导致 Cookie 读取问题
 * - 'lax' 在保持 CSRF 防护的同时提供更好的用户体验
 * - 参考: https://web.dev/samesite-cookies-explained/
 */
export function getAuthCookieConfig(): CookieOptions {
  // 计算7天后的过期时间
  const expires = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);

  return {
    secure: true, // 强制 HTTPS，生产环境必须启用
    httpOnly: true, // 禁止 JavaScript 读取，防止 XSS
    sameSite: 'lax' as const, // 宽松同源策略，避免标签页切换问题
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7天（秒）
    expires, // 明确过期时间，确保浏览器正确处理
  };
}

/**
 * 开发环境 Cookie 配置
 *
 * @警告 仅用于本地开发，生产环境必须使用 getAuthCookieConfig
 * @returns Cookie 配置对象
 *
 * @使用场景
 * - 本地 HTTP 开发环境
 * - 需要调试 Cookie 的场景
 */
export function getDevAuthCookieConfig(): CookieOptions {
  // 计算7天后的过期时间
  const expires = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);

  return {
    secure: false, // 开发环境允许 HTTP
    httpOnly: true, // 仍然启用 HttpOnly 进行测试
    sameSite: 'lax' as const, // 开发环境使用 lax 便于调试
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7天（秒）
    expires, // 明确过期时间
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

/**
 * 获取当前环境的认证 Cookie 配置
 *
 * @returns 根据环境返回合适的配置
 */
export function getCurrentAuthCookieConfig(): CookieOptions {
  const isDev = process.env.NODE_ENV === 'development';
  const isLocalhost = typeof window !== 'undefined'
    ? window.location.hostname === 'localhost'
    : false;

  // 本地开发环境使用宽松配置
  if (isDev && isLocalhost) {
    return getDevAuthCookieConfig();
  }

  return getAuthCookieConfig();
}
