import { getMarketingHomeUrl } from '@/lib/seo/marketingHome'
import { clearClientAuthStorage } from '@/lib/auth/clearClientAuthStorage'

/**
 * 会话结束后的统一客户端收尾：清浏览器端残留存储并整页跳转到官网。
 * @returns 是否已发起跳转（成功时为 true）
 */
export function finalizeSessionEndClientRedirect(result: {
  success: boolean
  redirectTo?: string
}): boolean {
  if (!result.success || typeof window === 'undefined') return false
  clearClientAuthStorage()
  const target = result.redirectTo ?? getMarketingHomeUrl()
  window.location.assign(target)
  return true
}
