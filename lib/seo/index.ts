/**
 * SEO模块统一导出
 * @description 简化导入路径，统一从 @/lib/seo 导入
 * @example
 * import { createMetadata, SITE_CONFIG, siteUrl } from '@/lib/seo';
 */

// 配置导出
export {
  SITE_CONFIG,
  TITLE_CONFIG,
  DESCRIPTION_CONFIG,
  KEYWORDS_CONFIG,
  OG_CONFIG,
  ROBOTS_CONFIG,
  WEBMANIFEST_CONFIG,
  defaultMetadata,
  siteName,
  siteUrl,
  siteDomain,
  siteAuthor,
} from './config';

// 工具函数导出
export {
  createMetadata,
  createArticleMetadata,
  createLegalMetadata,
  createAuthMetadata,
  createHomeMetadata,
  createProfileMetadata,
  createStructuredData,
} from './metadata';

// 类型导出
export type { Metadata } from 'next';
