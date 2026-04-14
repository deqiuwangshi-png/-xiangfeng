import type { CookieOptions } from '@supabase/ssr';

/**
 * 全站 Cookie 安全策略（认证 + 功能类）
 *
 * - httpOnly: true（认证与敏感功能 Cookie）
 * - sameSite: lax（统一，兼顾 CSRF 与正常站内导航）
 * - secure: 生产强制 true；开发默认 true（禁止明文传会话，依赖 HTTPS 或浏览器对 localhost 的 Secure 例外）
 * - 仅在本地明文 HTTP 且非 localhost 时需设置 COOKIE_ALLOW_INSECURE_LOCAL=1
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
 */

export const AUTH_COOKIE_SAME_SITE = 'lax' as const;

/** 有请求上下文时用于判断当前连接是否应按「仅 HTTPS」处理 */
export type CookieTransportRequest = {
  headers: Headers;
  nextUrl: URL;
};

/**
 * 显式允许在明文 HTTP 下发送 Cookie（仅用于特殊本地/内网调试）
 */
export function allowInsecureCookieTransport(): boolean {
  return process.env.COOKIE_ALLOW_INSECURE_LOCAL === '1';
}

/**
 * 无 NextRequest 时的 Secure 默认值（Server Actions / 部分 RSC）
 */
export function cookieSecureDefault(): boolean {
  if (process.env.NODE_ENV === 'production') return true;
  return !allowInsecureCookieTransport();
}

/**
 * 结合链路判断 Secure（Proxy / Route Handler）
 * - 生产：恒为 true（禁止明文）
 * - 开发：默认 Secure；仅当显式允许不安全且检测到 http 时为 false
 */
export function cookieSecureForRequest(request: CookieTransportRequest): boolean {
  if (process.env.NODE_ENV === 'production') return true;
  if (!allowInsecureCookieTransport()) return true;

  const forwarded = request.headers.get('x-forwarded-proto');
  if (forwarded === 'https') return true;
  if (forwarded === 'http') return false;

  return request.nextUrl.protocol === 'https:';
}

function baseAuthOptions(secure: boolean): CookieOptions {
  return {
    httpOnly: true,
    secure,
    sameSite: AUTH_COOKIE_SAME_SITE,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}

/**
 * 认证 Cookie 配置
 * @param request 可选；有则按实际链路决定 secure（与中间件一致）
 */
export function getAuthCookieConfig(request?: CookieTransportRequest): CookieOptions {
  const secure = request ? cookieSecureForRequest(request) : cookieSecureDefault();
  return baseAuthOptions(secure);
}

/**
 * @deprecated 与 getAuthCookieConfig 已合并，保留别名避免大范围改动
 */
export function getDevAuthCookieConfig(): CookieOptions {
  return getAuthCookieConfig();
}

/**
 * 功能类 Cookie（如浏览量标记）——与认证相同安全基线
 */
export function getFeatureCookieConfig(maxAge: number = 24 * 60 * 60): CookieOptions {
  return {
    httpOnly: true,
    secure: cookieSecureDefault(),
    sameSite: AUTH_COOKIE_SAME_SITE,
    path: '/',
    maxAge,
  };
}

/**
 * 清除认证 Cookie（maxAge: 0），secure 须与写入时一致
 */
export function getAuthCookieExpireOptions(request?: CookieTransportRequest): CookieOptions {
  return {
    ...getAuthCookieConfig(request),
    maxAge: 0,
  };
}
