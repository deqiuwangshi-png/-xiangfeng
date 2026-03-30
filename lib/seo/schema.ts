/**
 * Schema.org 结构化数据生成器
 * @module lib/seo/schema
 * @description 生成符合 Schema.org 标准的结构化数据，增强搜索结果展示
 */

import { SITE_CONFIG } from './config';

/**
 * 基础结构化数据接口
 */
interface BaseSchema {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

/**
 * 网站结构化数据
 */
export interface WebsiteSchema extends BaseSchema {
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
}

/**
 * 文章结构化数据
 */
export interface ArticleSchema extends BaseSchema {
  '@type': 'Article';
  headline: string;
  description: string;
  url: string;
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
    image?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  keywords?: string;
  articleSection?: string;
  inLanguage: string;
  wordCount?: number;
  image: {
    '@type': 'ImageObject';
    url: string;
    width: number;
    height: number;
  };
}

/**
 * 组织结构化数据
 */
export interface OrganizationSchema extends BaseSchema {
  '@type': 'Organization';
  name: string;
  alternateName?: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    availableLanguage: string[];
  };
}

/**
 * 面包屑导航结构化数据
 */
export interface BreadcrumbSchema extends BaseSchema {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

/**
 * 个人主页结构化数据
 */
export interface ProfileSchema extends BaseSchema {
  '@type': 'ProfilePage';
  mainEntity: {
    '@type': 'Person';
    name: string;
    url: string;
    description?: string;
    image?: string;
    jobTitle?: string;
    worksFor?: {
      '@type': 'Organization';
      name: string;
    };
  };
  about?: {
    '@type': 'Thing';
    name: string;
    description: string;
  };
}

/**
 * FAQ 页面结构化数据
 */
export interface FAQSchema extends BaseSchema {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

/**
 * 生成网站结构化数据
 * @returns WebsiteSchema
 */
export function generateWebsiteSchema(): WebsiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: '相逢是一个连接深度思考者的知识社区，专注于长文创作与深度阅读。',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.svg`,
      },
    },
  };
}

/**
 * 生成文章结构化数据
 * @param params - 文章参数
 * @returns ArticleSchema
 */
export function generateArticleSchema(params: {
  title: string;
  description: string;
  url: string;
  authorName: string;
  authorUrl?: string;
  authorAvatar?: string;
  publishedAt: string;
  modifiedAt?: string;
  tags?: string[];
  wordCount?: number;
  imageUrl?: string;
}): ArticleSchema {
  const {
    title,
    description,
    url,
    authorName,
    authorUrl,
    authorAvatar,
    publishedAt,
    modifiedAt,
    tags = [],
    wordCount,
    imageUrl = `${SITE_CONFIG.url}/og-image.svg`,
  } = params;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorUrl && { url: authorUrl }),
      ...(authorAvatar && { image: authorAvatar }),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.svg`,
      },
    },
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: tags.join(', '),
    articleSection: tags[0] || '深度文章',
    inLanguage: SITE_CONFIG.locale,
    ...(wordCount && { wordCount }),
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    },
  };
}

/**
 * 生成组织结构化数据
 * @returns OrganizationSchema
 */
export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.shortName,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.svg`,
    description: '相逢是一个连接深度思考者的知识社区，专注于长文创作与深度阅读。',
    sameAs: [
      'https://twitter.com/xiangfeng',
      'https://github.com/xiangfeng',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: '客户服务',
      availableLanguage: ['Chinese'],
    },
  };
}

/**
 * 生成面包屑导航结构化数据
 * @param items - 面包屑项数组
 * @returns BreadcrumbSchema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * 生成个人主页结构化数据
 * @param params - 个人主页参数
 * @returns ProfileSchema
 */
export function generateProfileSchema(params: {
  name: string;
  url: string;
  description?: string;
  image?: string;
  jobTitle?: string;
  organization?: string;
  articleCount?: number;
}): ProfileSchema {
  const { name, url, description, image, jobTitle, organization, articleCount } = params;

  const schema: ProfileSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: name,
      url: url,
      ...(description && { description }),
      ...(image && { image }),
      ...(jobTitle && { jobTitle }),
      ...(organization && {
        worksFor: {
          '@type': 'Organization',
          name: organization,
        },
      }),
    },
  };

  if (articleCount !== undefined) {
    schema.about = {
      '@type': 'Thing',
      name: '文章',
      description: `${name} 在相逢发布了 ${articleCount} 篇文章`,
    };
  }

  return schema;
}

/**
 * 生成 FAQ 结构化数据
 * @param faqs - FAQ 数组
 * @returns FAQSchema
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * 生成产品页面结构化数据（用于创作者经济相关页面）
 * @param params - 产品参数
 * @returns 产品结构化数据
 */
export function generateProductSchema(params: {
  name: string;
  description: string;
  image: string;
  url: string;
  brand?: string;
  offers?: {
    price: number;
    priceCurrency: string;
    availability: string;
  };
}): Record<string, unknown> {
  const { name, description, image, url, brand = SITE_CONFIG.name, offers } = params;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: description,
    image: image,
    url: url,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
  };

  if (offers) {
    schema.offers = {
      '@type': 'Offer',
      price: offers.price,
      priceCurrency: offers.priceCurrency,
      availability: offers.availability,
      url: url,
    };
  }

  return schema;
}

/**
 * 将结构化数据转换为 JSON-LD 字符串
 * @param schema - 结构化数据对象
 * @returns JSON-LD 字符串
 */
export function toJsonLd(schema: Record<string, unknown>): string {
  return JSON.stringify(schema);
}

/**
 * 生成完整页面所需的全部结构化数据
 * @param type - 页面类型
 * @param data - 页面数据
 * @returns 结构化数据数组
 */
export function generatePageSchemas(
  type: 'home' | 'article' | 'profile' | 'marketing',
  data?: Record<string, unknown>
): Array<Record<string, unknown>> {
  const schemas: Array<Record<string, unknown>> = [];

  // 所有页面都包含网站和组织结构化数据
  schemas.push(generateWebsiteSchema());
  schemas.push(generateOrganizationSchema());

  switch (type) {
    case 'article':
      if (data) {
        schemas.push(generateArticleSchema(data as Parameters<typeof generateArticleSchema>[0]));
      }
      break;
    case 'profile':
      if (data) {
        schemas.push(generateProfileSchema(data as Parameters<typeof generateProfileSchema>[0]));
      }
      break;
    default:
      break;
  }

  return schemas;
}
