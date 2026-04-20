import { SITE_CONFIG } from './config'

/**
 * 官网首页绝对 URL（营销落地页根路径），与 NEXT_PUBLIC_SITE_URL 一致。
 * 用于退出登录、注销后整页跳转，避免停留在应用内页。
 */
export function getMarketingHomeUrl(): string {
  return new URL('/', SITE_CONFIG.url).href
}
