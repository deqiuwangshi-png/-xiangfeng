/**
 * Metadata生成工具函数
 * @description 提供统一的Metadata生成函数，确保SEO配置一致性
 * @author 相逢团队
 * @since 2025-04-05
 */

import { Metadata } from 'next';
import {
  SITE_CONFIG,
  TITLE_CONFIG,
  DESCRIPTION_CONFIG,
  KEYWORDS_CONFIG,
  OG_CONFIG,
  ROBOTS_CONFIG,
  siteName,
  siteUrl,
} from './config';

/**
 * 页面SEO配置选项
 * @interface PageSEOOptions
 */
interface PageSEOOptions {
  /** 页面标题（不含站点名） */
  title?: string;

  /** 页面描述 */
  description?: string;

  /** 页面关键词（会与全局关键词合并） */
  keywords?: string[];

  /** 页面类型关键词组 */
  pageType?: 'home' | 'article' | 'profile' | 'legal' | 'auth';

  /** OG图片路径（相对于站点根目录） */
  ogImage?: string;

  /** 是否禁止搜索引擎索引 */
  noIndex?: boolean;

  /** 规范链接 */
  canonical?: string;

  /** 自定义OG标题（默认使用页面标题） */
  ogTitle?: string;

  /** 自定义OG描述（默认使用页面描述） */
  ogDescription?: string;
}

/**
 * 生成页面Metadata
 * @param options - SEO配置选项
 * @returns Metadata对象
 * @example
 * // 基础使用
 * export const metadata = createMetadata({ title: '隐私政策' });
 *
 * // 完整使用
 * export const metadata = createMetadata({
 *   title: '文章标题',
 *   description: '文章摘要',
 *   pageType: 'article',
 *   ogImage: '/uploads/article-cover.jpg',
 * });
 */
export function createMetadata(options: PageSEOOptions = {}): Metadata {
  const {
    title,
    description,
    keywords = [],
    pageType,
    ogImage,
    noIndex = false,
    canonical,
    ogTitle,
    ogDescription,
  } = options;

  // 构建标题
  const pageTitle = title
    ? `${title} | ${siteName}`
    : TITLE_CONFIG.default;

  // 获取描述
  const pageDescription = description || DESCRIPTION_CONFIG.default;

  // 合并关键词
  const typeKeywords = pageType ? KEYWORDS_CONFIG[pageType] : [];
  const mergedKeywords = [...KEYWORDS_CONFIG.global, ...typeKeywords, ...keywords];

  // 去重
  const uniqueKeywords = [...new Set(mergedKeywords)];

  // 构建OG图片
  const ogImages = ogImage
    ? [{
        url: ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`,
        width: OG_CONFIG.imageWidth,
        height: OG_CONFIG.imageHeight,
      }]
    : [{
        url: `${siteUrl}${OG_CONFIG.image}`,
        width: OG_CONFIG.imageWidth,
        height: OG_CONFIG.imageHeight,
      }];

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: uniqueKeywords,

    openGraph: {
      type: OG_CONFIG.type,
      locale: OG_CONFIG.locale,
      siteName: siteName,
      title: ogTitle || pageTitle,
      description: ogDescription || pageDescription,
      images: ogImages,
    },

    twitter: {
      card: 'summary_large_image',
      title: ogTitle || pageTitle,
      description: ogDescription || pageDescription,
      images: ogImages.map(img => img.url),
    },

    robots: noIndex
      ? { index: false, follow: false }
      : ROBOTS_CONFIG,

    alternates: canonical
      ? { canonical }
      : undefined,
  };
}

/**
 * 生成文章页面Metadata
 * @param article - 文章数据
 * @returns Metadata对象
 * @example
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const article = await getArticle(params.id);
 *   return createArticleMetadata({
 *     title: article.title,
 *     summary: article.summary,
 *     coverImage: article.cover_image,
 *   });
 * }
 */
export function createArticleMetadata(article: {
  title: string;
  summary?: string;
  coverImage?: string;
}): Metadata {
  return createMetadata({
    title: article.title,
    description: DESCRIPTION_CONFIG.article(article.summary || article.title),
    pageType: 'article',
    ogImage: article.coverImage,
  });
}

/**
 * 生成法律页面Metadata
 * @param pageName - 页面名称（如'隐私政策'、'服务条款'）
 * @param description - 页面描述（可选，使用默认描述）
 * @returns Metadata对象
 */
export function createLegalMetadata(
  pageName: string,
  description?: string
): Metadata {
  const desc = description || DESCRIPTION_CONFIG.legal;

  return createMetadata({
    title: pageName,
    description: desc,
    pageType: 'legal',
  });
}

/**
 * 生成认证页面Metadata
 * @param pageName - 页面名称（如'登录'、'注册'）
 * @returns Metadata对象
 */
export function createAuthMetadata(pageName?: string): Metadata {
  return createMetadata({
    title: pageName || '登录注册',
    description: DESCRIPTION_CONFIG.auth,
    pageType: 'auth',
  });
}

/**
 * 生成首页Metadata
 * @returns Metadata对象
 */
export function createHomeMetadata(): Metadata {
  return createMetadata({
    title: '首页 - 发现深度文章',
    description: DESCRIPTION_CONFIG.home,
    pageType: 'home',
  });
}

/**
 * 生成用户资料页面Metadata
 * @param username - 用户名
 * @param bio - 用户简介
 * @returns Metadata对象
 */
export function createProfileMetadata(
  username: string,
  bio?: string
): Metadata {
  return createMetadata({
    title: `${username}的个人主页`,
    description: bio || `${username}的主页 - 相逢创作者`,
    pageType: 'profile',
  });
}

/**
 * 生成结构化数据（JSON-LD）
 * @description 用于SEO页面的结构化数据
 */
export function createStructuredData() {
  return {
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      description: DESCRIPTION_CONFIG.default,
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },

    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteName,
      description: DESCRIPTION_CONFIG.default,
      url: siteUrl,
      sameAs: [],
    },
  };
}
