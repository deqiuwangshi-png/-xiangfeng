import type { CookieOptions } from '@supabase/ssr';

const ONE_HOUR_SECONDS = 60 * 60;
const DEFAULT_MAX_AGE_SECONDS = 24 * ONE_HOUR_SECONDS;
/** Supabase 会话 Cookie 建议最长存活（秒），实际写入仍会受 @supabase/ssr 内部默认值影响，二次在 setAll 中收敛） */
export const SESSION_MAX_AGE_SECONDS = 12 * ONE_HOUR_SECONDS;

/**
 * 是否应对 Cookie 设置 Secure（HTTPS）。
 * - 生产环境默认 true
 * - 本地 HTTP 下为 false（否则浏览器不收纳 Cookie）；可用环境变量强制与 HTTPS 开发环境对齐
 * - 浏览器在 https:// 页面可配合 `getBrowserSupabaseCookieOptions()` 再打开
 */
export function resolveSecureCookieFlag(opts?: { requestTlsTerminatedAsHttps?: boolean }): boolean {
  if (process.env.NODE_ENV === 'production') return true;
  if (process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true') return true;
  if (process.env.COOKIE_SECURE === 'true') return true;
  if (opts?.requestTlsTerminatedAsHttps === true) return true;
  return false;
}

type CookieProfile = 'session' | 'marker';

interface CookieConfigInput {
  maxAge?: number;
  path?: string;
  profile?: CookieProfile;
  sameSite?: CookieOptions['sameSite'];
}

/**
 * 获取 Cookie 配置
 * @param input - 配置参数（支持 maxAge/path/profile）
 * @returns Cookie 配置对象
 */
export function getCookieConfig(input: number | CookieConfigInput = {}): CookieOptions {
  const normalized = typeof input === 'number' ? { maxAge: input } : input;
  const profile = normalized.profile ?? 'session';
  const defaultHttpOnly = profile === 'session';
  const defaultMaxAge = profile === 'session' ? SESSION_MAX_AGE_SECONDS : DEFAULT_MAX_AGE_SECONDS;
  const maxAge = Math.max(60, normalized.maxAge ?? defaultMaxAge);

  return {
    httpOnly: defaultHttpOnly,
    secure: resolveSecureCookieFlag(),
    sameSite: normalized.sameSite ?? 'lax',
    path: normalized.path ?? '/',
    maxAge,
  };
}

/**
 * Supabase 会话 Cookie 强化策略：
 * - 统一 Secure / HttpOnly / SameSite
 * - 控制最长有效期，避免长期暴露
 */
export function getSupabaseSessionCookieConfig(
  name: string,
  options: CookieOptions = {},
  secureCtx?: { requestTlsTerminatedAsHttps?: boolean }
): CookieOptions {
  const base = getCookieConfig({
    profile: 'session',
    maxAge: options.maxAge,
    path: options.path ?? '/',
    sameSite: options.sameSite,
  });

  const merged: CookieOptions = {
    ...options,
    ...base,
  };

  // sb-* 为敏感会话：强制 HttpOnly；Secure 与 TLS/环境对齐（覆盖 Supabase 默认 httpOnly:false）
  if (name.startsWith('sb-')) {
    merged.httpOnly = true;
    merged.secure = resolveSecureCookieFlag(secureCtx);
    merged.maxAge = Math.min(merged.maxAge ?? SESSION_MAX_AGE_SECONDS, SESSION_MAX_AGE_SECONDS);
  }

  return merged;
}

/**
 * 传给 `createServerClient(..., { cookieOptions })`，供 `applyServerStorage` 合并默认项时带上 HttpOnly。
 */
export function getSupabaseServerCookieOptions(ctx?: {
  requestTlsTerminatedAsHttps?: boolean
}): CookieOptions {
  return {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: resolveSecureCookieFlag(ctx),
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

/**
 * 浏览器端：`document.cookie` 无法设置 HttpOnly；在此收敛 Secure / SameSite / 存活时间。
 * 会话是否 HttpOnly 由服务端 Middleware + Server Action 的 Set-Cookie 覆盖刷新。
 */
export function getBrowserSupabaseCookieOptions(): CookieOptions {
  const pageIsHttps =
    typeof window !== 'undefined' && typeof window.location !== 'undefined' && window.location.protocol === 'https:';

  return {
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
    secure: resolveSecureCookieFlag() || pageIsHttps,
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
