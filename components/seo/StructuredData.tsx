'use client';

/**
 * 结构化数据组件 - Schema.org 标记
 * @module components/seo/StructuredData
 * @description 为搜索引擎提供丰富的结构化数据，增强搜索结果展示
 */

import Script from 'next/script';

/**
 * 网站结构化数据
 * @returns {JSX.Element} Website Schema JSON-LD
 */
export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '相逢 Xiangfeng',
    url: 'https://www.xiangfeng.site',
    description: '相逢是一个连接深度思考者的知识社区，专注于长文创作与深度阅读。',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.xiangfeng.site/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: '相逢 Xiangfeng',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.xiangfeng.site/logo.svg',
      },
    },
  };

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * 文章结构化数据
 * @param {Object} props - 组件属性
 * @param {string} props.title - 文章标题
 * @param {string} props.description - 文章描述
 * @param {string} props.url - 文章URL
 * @param {string} props.authorName - 作者名称
 * @param {string} props.authorUrl - 作者主页URL
 * @param {string} props.publishedAt - 发布时间
 * @param {string} props.modifiedAt - 修改时间
 * @param {string[]} props.tags - 文章标签
 * @param {number} props.wordCount - 文章字数
 * @returns {JSX.Element} Article Schema JSON-LD
 */
interface ArticleStructuredDataProps {
  title: string;
  description: string;
  url: string;
  authorName: string;
  authorUrl: string;
  publishedAt: string;
  modifiedAt?: string;
  tags?: string[];
  wordCount?: number;
}

export function ArticleStructuredData({
  title,
  description,
  url,
  authorName,
  authorUrl,
  publishedAt,
  modifiedAt,
  tags = [],
  wordCount,
}: ArticleStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: '相逢 Xiangfeng',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.xiangfeng.site/logo.svg',
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
    inLanguage: 'zh-CN',
    ...(wordCount && { wordCount }),
    image: {
      '@type': 'ImageObject',
      url: 'https://www.xiangfeng.site/og-image.svg',
      width: 1200,
      height: 630,
    },
  };

  return (
    <Script
      id="article-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * 面包屑导航结构化数据
 * @param {Object} props - 组件属性
 * @param {Array<{name: string, url: string}>} props.items - 面包屑项
 * @returns {JSX.Element} BreadcrumbList Schema JSON-LD
 */
interface BreadcrumbStructuredDataProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * 组织结构化数据
 * @returns {JSX.Element} Organization Schema JSON-LD
 */
export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '相逢 Xiangfeng',
    alternateName: '相逢',
    url: 'https://www.xiangfeng.site',
    logo: 'https://www.xiangfeng.site/logo.svg',
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

  return (
    <Script
      id="organization-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * FAQ页面结构化数据
 * @param {Object} props - 组件属性
 * @param {Array<{question: string, answer: string}>} props.faqs - FAQ列表
 * @returns {JSX.Element} FAQPage Schema JSON-LD
 */
interface FAQStructuredDataProps {
  faqs: Array<{ question: string; answer: string }>;
}

export function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  const structuredData = {
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

  return (
    <Script
      id="faq-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * 个人资料结构化数据
 * @param {Object} props - 组件属性
 * @param {string} props.name - 用户名称
 * @param {string} props.url - 个人主页URL
 * @param {string} props.description - 个人简介
 * @param {string} props.image - 头像URL
 * @param {number} props.articleCount - 文章数量
 * @returns {JSX.Element} ProfilePage Schema JSON-LD
 */
interface ProfileStructuredDataProps {
  name: string;
  url: string;
  description?: string;
  image?: string;
  articleCount?: number;
}

export function ProfileStructuredData({
  name,
  url,
  description,
  image,
  articleCount,
}: ProfileStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: name,
      url: url,
      ...(description && { description }),
      ...(image && { image }),
    },
    ...(articleCount !== undefined && {
      about: {
        '@type': 'Thing',
        name: '文章',
        description: `${name} 在相逢发布了 ${articleCount} 篇文章`,
      },
    }),
  };

  return (
    <Script
      id="profile-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
