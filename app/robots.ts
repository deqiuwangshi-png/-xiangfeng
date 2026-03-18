import { MetadataRoute } from 'next'

/**
 * Robots.txt 配置
 * @returns {MetadataRoute.Robots} Robots 配置
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xiangfeng.site'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/drafts/',
        '/inbox/',
        '/settings/',
        '/profile/',
        '/publish/',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
