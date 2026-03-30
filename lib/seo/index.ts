/**
 * SEO 工具库统一导出
 * @module lib/seo
 * @description 提供完整的 SEO 解决方案，包括配置、Metadata 生成、结构化数据
 */

// 配置导出
export {
  SITE_CONFIG,
  TITLE_TEMPLATES,
  DEFAULT_SEO,
  PAGE_SEO_STRATEGIES,
  ROUTE_TO_PAGE_TYPE,
  getPageType,
  getPageSeoStrategy,
  generateCanonicalUrl,
  generateTitle,
  truncateDescription,
  generateKeywordsString,
  generateOgImageUrl,
  type PageType,
} from './config';

// Metadata 生成器导出
export {
  generateMetadata,
  generateArticleMetadata,
  generateProfileMetadata,
  generateAdminMetadata,
  generateAuthMetadata,
  generateHomeMetadata,
  generateListMetadata,
  generateMarketingMetadata,
  generateLegalMetadata,
  type BaseMetadataOptions,
  type ArticleMetadataOptions,
  type ProfileMetadataOptions,
} from './metadata';

// 结构化数据导出
export {
  generateWebsiteSchema,
  generateArticleSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateProfileSchema,
  generateFAQSchema,
  generateProductSchema,
  toJsonLd,
  generatePageSchemas,
  type WebsiteSchema,
  type ArticleSchema,
  type OrganizationSchema,
  type BreadcrumbSchema,
  type ProfileSchema,
  type FAQSchema,
} from './schema';
