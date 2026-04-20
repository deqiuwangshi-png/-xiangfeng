/**
 * 清除浏览器中 Supabase 客户端可能残留的 localStorage / sessionStorage（与 sb-* Cookie 配套）。
 * 仅在浏览器中调用。
 */
export function clearClientAuthStorage(): void {
  if (typeof window === 'undefined') return
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key && (key.startsWith('sb-') || key.startsWith('supabase.'))) {
        localStorage.removeItem(key)
      }
    }
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith('sb-')) {
        sessionStorage.removeItem(key)
      }
    }
  } catch {
    /* ignore quota / privacy mode */
  }
}
