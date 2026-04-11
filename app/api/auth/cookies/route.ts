/**
 * Supabase 浏览器客户端 Cookie 桥接（受控读写）
 *
 * @description 浏览器不直接写 document.cookie，由服务端合并 HttpOnly/Secure/SameSite。
 * @see https://supabase.com/docs/guides/auth/server-side/creating-a-client
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { CookieOptions } from '@supabase/ssr'
import { getAuthCookieConfig } from '@/lib/auth/utils/cookieConfig'
import {
  assertSameOrigin,
  mergeResponseCacheHeaders,
  validateCookieBridgePayload,
  isSupabaseAuthCookieName,
} from '@/lib/supabase/authCookieBridge'

export async function GET(request: NextRequest) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const store = await cookies()
  const list = store
    .getAll()
    .filter((c) => isSupabaseAuthCookieName(c.name))
    .map((c) => ({ name: c.name, value: c.value ?? '' }))

  return NextResponse.json(
    { cookies: list },
    { headers: { 'Cache-Control': 'private, no-store, max-age=0' } }
  )
}

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const secFetchSite = request.headers.get('sec-fetch-site')
  if (
    secFetchSite &&
    secFetchSite !== 'same-origin' &&
    secFetchSite !== 'same-site'
  ) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let body: { cookies?: unknown; headers?: Record<string, string> }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  if (!validateCookieBridgePayload(body.cookies)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const baseOpts = getAuthCookieConfig(request)
  const res = NextResponse.json({ ok: true })
  mergeResponseCacheHeaders(res, body.headers)
  res.headers.set('Cache-Control', 'private, no-store, max-age=0')

  for (const row of body.cookies) {
    const { name, value, options } = row as {
      name: string
      value: string
      options?: CookieOptions
    }
    res.cookies.set(name, value, {
      ...(options ?? {}),
      ...baseOpts,
    })
  }

  return res
}
