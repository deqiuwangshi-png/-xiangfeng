import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

/**
 * 站点地图生成
 *
 * @returns {Promise<MetadataRoute.Sitemap>} 站点地图
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 *
 * @安全说明
 * - 不在 sitemap 中包含认证入口页面（/login, /register 等）
 * - 不在 sitemap 中包含需要登录的私有路径
 * - 仅包含公开的、需要 SEO 的页面
 * - 认证页面通过 noindex 标签控制索引，而非 sitemap
 * @性能优化 动态获取文章列表，确保搜索引擎能索引所有公开文章
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // 基础页面
  const staticPages: MetadataRoute.Sitemap = [
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
      priority: 0.6,
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
  ]

  // 动态获取已发布文章
  let articlePages: MetadataRoute.Sitemap = []
  try {
    const supabase = await createClient()
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, updated_at, title')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(1000) // 限制数量避免请求过大

    if (error) {
      console.error('[Sitemap] 获取文章列表失败:', error)
    } else if (articles) {
      articlePages = articles.map((article) => ({
        url: `${siteUrl}/article/${article.id}`,
        lastModified: new Date(article.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('[Sitemap] 获取文章列表异常:', error)
  }

  // 动态获取活跃用户资料
  let profilePages: MetadataRoute.Sitemap = []
  try {
    const supabase = await createClient()
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, updated_at')
      .order('updated_at', { ascending: false })
      .limit(500)

    if (error) {
      console.error('[Sitemap] 获取用户列表失败:', error)
    } else if (profiles) {
      profilePages = profiles.map((profile) => ({
        url: `${siteUrl}/profile/${profile.id}`,
        lastModified: new Date(profile.updated_at),
        changeFrequency: 'weekly',
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('[Sitemap] 获取用户列表异常:', error)
  }

  // 合并所有页面
  return [...staticPages, ...articlePages, ...profilePages]
}
