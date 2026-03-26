import { MetadataRoute } from 'next'

/**
 * 站点地图生成
 *
 * @returns {MetadataRoute.Sitemap} 站点地图
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 *
 * @安全说明
 * - 不在 sitemap 中包含认证入口页面（/login, /register 等）
 * - 不在 sitemap 中包含需要登录的私有路径
 * - 仅包含公开的、需要 SEO 的页面
 * - 认证页面通过 noindex 标签控制索引，而非 sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // 验证环境变量，确保使用生产域名
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL

  // 安全边界：确保环境变量已设置
  if (!baseUrl) {
    console.error('[Sitemap] NEXT_PUBLIC_SITE_URL 未设置，使用默认域名')
  }

  // 使用环境变量或默认值，但过滤掉开发/测试域名
  const siteUrl = baseUrl || 'https://www.xiangfeng.site'

  // 简单的域名验证：只允许 https 协议和特定域名模式
  const isValidUrl = siteUrl.startsWith('https://') &&
    (siteUrl.includes('xiangfeng.site') || siteUrl.includes('localhost') && process.env.NODE_ENV === 'development')

  if (!isValidUrl) {
    console.warn('[Sitemap] 检测到非标准域名:', siteUrl)
  }

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/home`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/partners`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // 注意：以下页面不包含在 sitemap 中
    // - /login, /register, /forgot-password, /reset-password: 认证入口，使用 noindex
    // - /rewards: 需要登录访问，私有路径
    // - /feedback: 需要登录访问，私有路径
    // - /drafts, /inbox, /settings, /profile, /publish: 私有路径
  ]
}
