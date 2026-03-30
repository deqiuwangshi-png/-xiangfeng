/**
 * SEO Metadata 生成器
 * @module lib/seo/metadata
 * @description 动态生成 Next.js Metadata 对象，支持各种页面类型
 */

import type { Metadata } from 'next';
import {
  SITE_CONFIG,
  DEFAULT_SEO,
  getPageSeoStrategy,
  generateCanonicalUrl,
  generateTitle,
  truncateDescription,
  generateOgImageUrl,
  type PageType,
} from './config';
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
import { Twitter } from 'next/dist/lib/metadata/types/twitter-types';

// 本地类型定义
interface OpenGraphConfig {
  type: string;
  locale: string;
  url: string;
  siteName: string;
  title: string;
  description: string;
  images: Array<{
    url: string;
    width: number;
    height: number;
    alt: string;
  }>;
  authors?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

interface TwitterConfig {
  card: string;
  site: string;
  creator: string;
  title: string;
  description: string;
  images: string[];
}

/**
 * 基础 Metadata 配置选项
 */
export interface BaseMetadataOptions {
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  description?: string;
  /** 页面路径 */
  path: string;
  /** 页面类型 */
  pageType?: PageType;
  /** 关键词 */
  keywords?: string[];
  /** OG 图片 */
  ogImage?: string;
  /** 作者名称 */
  author?: string;
  /** 发布时间 */
  publishedAt?: string;
  /** 修改时间 */
  modifiedAt?: string;
  /** 备用语言版本 */
  alternates?: Record<string, string>;
}

/**
 * 文章页面 Metadata 配置
 */
export interface ArticleMetadataOptions extends BaseMetadataOptions {
  /** 文章作者 */
  author: string;
  /** 作者主页 URL */
  authorUrl?: string;
  /** 文章标签 */
  tags?: string[];
  /** 阅读时间（分钟） */
  readingTime?: number;
  /** 文章字数 */
  wordCount?: number;
}

/**
 * 用户主页 Metadata 配置
 */
export interface ProfileMetadataOptions extends BaseMetadataOptions {
  /** 用户头像 */
  avatar?: string;
  /** 文章数量 */
  articleCount?: number;
  /** 粉丝数量 */
  followerCount?: number;
}

/**
 * 生成基础 Metadata
 * @param options - 配置选项
 * @returns Next.js Metadata 对象
 */
export function generateMetadata(options: BaseMetadataOptions): Metadata {
  const {
    title,
    description = DEFAULT_SEO.description,
    path,
    keywords = DEFAULT_SEO.keywords,
    ogImage,
    author = SITE_CONFIG.author,
    alternates,
  } = options;

  const strategy = getPageSeoStrategy(path);
  const canonicalUrl = generateCanonicalUrl(path);
  const truncatedDescription = truncateDescription(description);
  const ogImageUrl = ogImage ? generateOgImageUrl(ogImage) : generateOgImageUrl();

  // 构建 OpenGraph
  const openGraph: OpenGraph = {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: canonicalUrl,
    siteName: SITE_CONFIG.name,
    title: title,
    description: truncatedDescription,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };

  // 构建 Twitter Card
  const twitter: Twitter = {
    card: 'summary_large_image',
    site: DEFAULT_SEO.twitter.site,
    creator: DEFAULT_SEO.twitter.creator,
    title: title,
    description: truncatedDescription,
    images: [ogImageUrl],
  };

  // 构建 alternates
  const alternatesMetadata: Metadata['alternates'] = {
    canonical: canonicalUrl,
  };

  if (alternates) {
    alternatesMetadata.languages = alternates;
  }

  return {
    title: title,
    description: truncatedDescription,
    keywords: [...keywords],
    authors: [{ name: author, url: `${SITE_CONFIG.url}/about` }],
    creator: author,
    publisher: SITE_CONFIG.name,
    metadataBase: new URL(SITE_CONFIG.url),

    // 机器人控制
    robots: {
      index: strategy.indexable,
      follow: strategy.followable,
      nocache: false,
      googleBot: {
        index: strategy.indexable,
        follow: strategy.followable,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph
    openGraph,

    // Twitter Card
    twitter,

    // Alternates
    alternates: alternatesMetadata,

    // 其他元数据
    category: SITE_CONFIG.category,
    classification: SITE_CONFIG.classification,
    referrer: 'origin-when-cross-origin',
    formatDetection: {
      telephone: false,
      date: false,
      address: false,
      email: false,
    },

    // 验证
    verification: {
      google: DEFAULT_SEO.verification.google,
      other: {
        'baidu-site-verification': DEFAULT_SEO.verification.baidu,
        'msvalidate.01': DEFAULT_SEO.verification.bing,
      },
    },
  };
}

/**
 * 生成文章页面 Metadata
 * @param options - 文章配置选项
 * @returns Next.js Metadata 对象
 */
export function generateArticleMetadata(options: ArticleMetadataOptions): Metadata {
  const {
    title,
    description,
    path,
    author,
    authorUrl,
    tags = [],
    publishedAt,
    modifiedAt,
    ogImage,
  } = options;

  const canonicalUrl = generateCanonicalUrl(path);
  const ogImageUrl = ogImage ? generateOgImageUrl(ogImage) : generateOgImageUrl();

  // 文章专用关键词
  const articleKeywords = [
    ...tags,
    '深度文章',
    '知识分享',
    '原创内容',
    '相逢',
    ...DEFAULT_SEO.keywords.slice(0, 5),
  ];

  return {
    title: generateTitle('%s | %s - %s', title, author, SITE_CONFIG.shortName),
    description: truncateDescription(description || DEFAULT_SEO.description),
    keywords: articleKeywords,
    authors: [{ name: author, url: authorUrl || `${SITE_CONFIG.url}/about` }],
    creator: author,
    publisher: SITE_CONFIG.name,
    metadataBase: new URL(SITE_CONFIG.url),

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // 文章专用 OpenGraph
    openGraph: {
      type: 'article',
      locale: SITE_CONFIG.locale,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      title: title,
      description: truncateDescription(description || DEFAULT_SEO.description),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      authors: [author],
      publishedTime: publishedAt,
      modifiedTime: modifiedAt || publishedAt,
      section: tags[0] || '深度文章',
      tags: tags,
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      site: DEFAULT_SEO.twitter.site,
      creator: DEFAULT_SEO.twitter.creator,
      title: title,
      description: truncateDescription(description || DEFAULT_SEO.description),
      images: [ogImageUrl],
    },

    alternates: {
      canonical: canonicalUrl,
    },

    category: 'article',
    classification: tags.join(','),
  };
}

/**
 * 生成用户主页 Metadata
 * @param options - 用户配置选项
 * @returns Next.js Metadata 对象
 */
export function generateProfileMetadata(options: ProfileMetadataOptions): Metadata {
  const {
    title,
    description,
    path,
    avatar,
    articleCount = 0,
    keywords = [],
    ogImage,
  } = options;

  const canonicalUrl = generateCanonicalUrl(path);
  const profileKeywords = [
    title,
    '个人主页',
    '创作者',
    '博主',
    ...keywords,
    '相逢',
  ];

  // 生成描述
  const profileDescription =
    description ||
    `${title} 的个人主页，在相逢发布了 ${articleCount} 篇深度文章。发现更多优质内容创作者。`;

  const ogImageUrl = ogImage || avatar || generateOgImageUrl();

  return {
    title: generateTitle('%s - %s | %s', title, profileDescription.slice(0, 30), SITE_CONFIG.shortName),
    description: truncateDescription(profileDescription),
    keywords: profileKeywords,
    metadataBase: new URL(SITE_CONFIG.url),

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },

    openGraph: {
      type: 'profile',
      locale: SITE_CONFIG.locale,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      title: `${title} - 创作者主页`,
      description: truncateDescription(profileDescription),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} 的个人主页`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      site: DEFAULT_SEO.twitter.site,
      creator: DEFAULT_SEO.twitter.creator,
      title: `${title} - 创作者主页`,
      description: truncateDescription(profileDescription),
      images: [ogImageUrl],
    },

    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * 生成后台页面 Metadata（noindex）
 * @param title - 页面标题
 * @returns Next.js Metadata 对象
 */
export function generateAdminMetadata(title: string): Metadata {
  return {
    title: generateTitle('%s - %s', title, SITE_CONFIG.shortName),
    description: `${SITE_CONFIG.name} ${title}`,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

/**
 * 生成认证页面 Metadata（noindex）
 * @param title - 页面标题
 * @returns Next.js Metadata 对象
 */
export function generateAuthMetadata(title: string): Metadata {
  return {
    title: generateTitle('%s - %s', title, SITE_CONFIG.shortName),
    description: `登录或注册 ${SITE_CONFIG.name} 账号，开启深度创作之旅。`,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

/**
 * 生成首页 Metadata
 * @returns Next.js Metadata 对象
 */
export function generateHomeMetadata(): Metadata {
  return generateMetadata({
    title: `${SITE_CONFIG.name} - 深度思考者社区 | 长文创作与知识分享平台`,
    description: DEFAULT_SEO.description,
    path: '/',
    pageType: 'home',
    keywords: [...DEFAULT_SEO.keywords],
  });
}

/**
 * 生成列表页 Metadata
 * @param title - 页面标题
 * @param description - 页面描述
 * @param path - 页面路径
 * @returns Next.js Metadata 对象
 */
export function generateListMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  return generateMetadata({
    title: generateTitle('%s - %s', title, SITE_CONFIG.shortName),
    description,
    path,
    pageType: 'list',
  });
}

/**
 * 生成营销页 Metadata
 * @param title - 页面标题
 * @param description - 页面描述
 * @param path - 页面路径
 * @returns Next.js Metadata 对象
 */
export function generateMarketingMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  return generateMetadata({
    title: generateTitle('%s - %s', title, SITE_CONFIG.shortName),
    description,
    path,
    pageType: 'marketing',
  });
}

/**
 * 生成法律页面 Metadata
 * @param title - 页面标题
 * @param path - 页面路径
 * @returns Next.js Metadata 对象
 */
export function generateLegalMetadata(title: string, path: string): Metadata {
  return generateMetadata({
    title: generateTitle('%s - %s', title, SITE_CONFIG.shortName),
    description: `${SITE_CONFIG.name} ${title}，了解我们的服务条款和隐私政策。`,
    path,
    pageType: 'legal',
  });
}
