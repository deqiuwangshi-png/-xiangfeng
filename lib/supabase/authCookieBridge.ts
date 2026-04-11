import type { NextRequest, NextResponse } from 'next/server'

/** 浏览器端与 Route Handler 共用的认证 Cookie 桥接路径 */
export const SUPABASE_BROWSER_COOKIE_API_PATH = '/api/auth/cookies'

const MAX_COOKIE_NAME_LEN = 256
const MAX_COOKIES_PER_REQUEST = 24

/**
 * 仅允许 Supabase SSR 使用的 Cookie 名（sb-*-auth-token 分片、PKCE code-verifier）
 */
export function isSupabaseAuthCookieName(name: string): boolean {
  if (!name || name.length > MAX_COOKIE_NAME_LEN) return false
  if (/[\r\n\0;]/.test(name)) return false
  if (!name.startsWith('sb-')) return false
  if (name.includes('auth-token')) return true
  if (name.endsWith('-code-verifier')) return true
  return false
}

export function assertSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true
  return origin === new URL(request.url).origin
}

export function mergeResponseCacheHeaders(
  response: NextResponse,
  headers: Record<string, string> | undefined
): void {
  if (!headers) return
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value)
  }
}

export function validateCookieBridgePayload(
  cookies: unknown
): cookies is { name: string; value: string; options?: object }[] {
  if (!Array.isArray(cookies) || cookies.length > MAX_COOKIES_PER_REQUEST) return false
  for (const c of cookies) {
    if (!c || typeof c !== 'object') return false
    const row = c as { name?: unknown; value?: unknown }
    if (typeof row.name !== 'string' || typeof row.value !== 'string') return false
    if (!isSupabaseAuthCookieName(row.name)) return false
  }
  return true
}
