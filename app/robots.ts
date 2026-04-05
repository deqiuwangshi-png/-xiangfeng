import { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'

/**
 * Robots.txt 配置 - SEO优化与安全加固
 * @description 使用统一SEO配置中的siteUrl
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 *
 * @安全说明 - 重要！
 * - ⚠️ 不在 robots.txt 中暴露敏感路径（如 /auth/, /verify, /admin/ 等）
 * - 攻击者会首先检查 robots.txt 来发现潜在的攻击目标
 * - 列出敏感路径相当于告诉攻击者："这里有入口，快来尝试"
 * - 所有需要保护的路径应通过服务端鉴权实现（middleware.ts + 页面级保护）
 * - robots.txt 的 Disallow 只是建议，不能作为安全措施
 * - 最佳实践：让敏感路径"隐身"而非"禁止"
 *
 * @SEO优化
 * - 仅排除技术性路径（/_next/）和API路径（/api/）
 * - 不设置 crawlDelay，让搜索引擎自行调整频率
 * - 保持配置简洁，避免暴露网站结构信息
 */
export default function robots(): MetadataRoute.Robots {

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
      ],
      // 不设置 crawlDelay，Googlebot会忽略此指令
      // Bing和百度支持，但现代服务器通常不需要限制
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
