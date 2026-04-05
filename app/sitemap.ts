import { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'
import { createSitemapClient } from '@/lib/supabase/sitemap-client'

/**
 * 站点地图生成
 * @description 使用统一SEO配置中的siteUrl
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // 基础页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/home`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
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
    const supabase = createSitemapClient()
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(1000)

    if (!error && articles) {
      articlePages = articles.map((article) => ({
        url: `${siteUrl}/article/${article.id}`,
        lastModified: new Date(article.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('[Sitemap] 获取文章列表失败:', error)
  }

  // 动态获取用户资料
  let profilePages: MetadataRoute.Sitemap = []
  try {
    const supabase = createSitemapClient()
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, updated_at')
      .order('updated_at', { ascending: false })
      .limit(500)

    if (!error && profiles) {
      profilePages = profiles.map((profile) => ({
        url: `${siteUrl}/profile/${profile.id}`,
        lastModified: new Date(profile.updated_at),
        changeFrequency: 'weekly',
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('[Sitemap] 获取用户列表失败:', error)
  }

  return [...staticPages, ...articlePages, ...profilePages]
}
