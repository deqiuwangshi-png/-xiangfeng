'use server'

import { cookies } from 'next/headers'

/**
 * 移除 Supabase SSR 写入的 `sb-*` 会话 Cookie（含分片），避免 signOut 后残留。
 */
export async function clearSupabaseSessionCookies(): Promise<void> {
  const store = await cookies()
  for (const { name } of store.getAll()) {
    if (!name.startsWith('sb-')) continue
    try {
      store.delete(name)
    } catch {
      try {
        store.set(name, '', { path: '/', maxAge: 0 })
      } catch {
        /* noop：部分运行环境下无法改写 Cookie */
      }
    }
  }
}
