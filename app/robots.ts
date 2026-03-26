import { MetadataRoute } from 'next'

/**
 * Robots.txt 配置
 *
 * @returns {MetadataRoute.Robots} Robots 配置
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 *
 * @安全说明
 * - 不在 robots.txt 中暴露敏感路径
 * - 所有私有路径通过服务端鉴权保护（middleware.ts + 页面级保护）
 * - robots.txt 的 Disallow 只是建议，不能作为安全措施
 * - 暴露敏感路径会给攻击者提供精确的攻击目标
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xiangfeng.site'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 注意：不在这里列出敏感路径
      // 所有需要保护的路径都应通过服务端鉴权实现
      // 参见: middleware.ts 和页面级的认证保护
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
