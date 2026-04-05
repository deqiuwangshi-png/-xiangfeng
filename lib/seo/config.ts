/**
 * SEO核心配置文件
 * @description 全站SEO信息的唯一数据源，避免重复定义
 * @author 相逢团队
 * @since 2025-04-05
 */

import { Metadata } from 'next';

/**
 * 站点基础配置
 * @description 站点名称、URL等核心信息
 */
export const SITE_CONFIG = {
  /** 站点名称 */
  name: '相逢',

  /** 站点URL，优先从环境变量获取 */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xiangfeng.site',

  /** 站点域名（不含协议） */
  domain: 'xiangfeng.site',

  /** 作者信息 */
  author: '相逢团队',
} as const;

/**
 * 标题配置
 * @description 统一标题模板，确保格式一致
 */
export const TITLE_CONFIG = {
  /** 默认首页标题 */
  default: '相逢 - 致敬全球思考者',

  /** 标题模板：页面标题 | 站点名称 */
  template: '%s | 相逢',

  /** 登录/认证页面标题 */
  auth: '登录注册 | 相逢',

  /** 法律页面标题模板 */
  legal: (pageName: string) => `${pageName} | 相逢`,
} as const;

/**
 * 描述配置
 * @description 各页面类型的描述文案
 */
export const DESCRIPTION_CONFIG = {
  /** 默认描述 */
  default: '相逢是一个连接全球思考者的知识社区，专注于长文创作与深度阅读。',

  /** 首页描述 */
  home: '浏览相逢社区最新发布的深度文章，探索深度思考、独立观点、知识分享。',

  /** 法律页面描述 */
  legal: '连接全球思考者，打破认知边界，构建属于你的思维网络与知识经济生态。',

  /** 认证页面描述 */
  auth: '相逢 - 致敬全球思考者，不止相遇，更是改变',

  /** 隐私政策描述 */
  privacy: '欢迎使用相逢！我们深知个人信息对您的重要性，并庄严承诺保护您的隐私和安全。',

  /** 服务条款描述 */
  terms: '欢迎使用相逢平台！请仔细阅读本服务条款，这些条款规定了您使用相逢服务（包括网站、移动应用及相关服务）的权利和义务。',

  /** 文章页面描述模板 */
  article: (summary: string) => summary?.slice(0, 160) || '深度文章阅读',
} as const;

/**
 * 关键词配置
 * @description 分层关键词策略，不同页面类型使用不同关键词组合
 */
export const KEYWORDS_CONFIG = {
  /** 全局通用关键词 */
  global: ['知识社区', '深度思考', '长文创作', '深度阅读', '内容创作', '全球思考者'],

  /** 首页关键词 */
  home: ['深度文章', '独立思考', '知识分享', '原创内容'],

  /** 文章页面关键词 */
  article: ['深度阅读', '原创内容', '知识分享', '思维体系'],

  /** 用户页面关键词 */
  profile: ['创作者', '知识博主', '思想领袖', '内容创作者'],

  /** 法律页面关键词 */
  legal: ['隐私政策', '服务条款', '用户协议'],

  /** 认证页面关键词 */
  auth: ['登录', '注册', '账号', '用户认证'],
} as const;

/**
 * OpenGraph默认配置
 * @description 社交媒体分享默认配置
 */
export const OG_CONFIG = {
  /** 页面类型 */
  type: 'website' as const,

  /** 语言区域 */
  locale: 'zh_CN' as const,

  /** 默认OG图片 */
  image: '/og-image.svg',

  /** 图片尺寸 */
  imageWidth: 1200,
  imageHeight: 630,
} as const;

/**
 * Robots默认配置
 * @description 搜索引擎爬虫配置
 */
export const ROBOTS_CONFIG = {
  /** 允许索引 */
  index: true,

  /** 允许跟踪链接 */
  follow: true,

  /** GoogleBot特殊配置 */
  googleBot: {
    index: true,
    follow: true,
  },
} as const;

/**
 * 导出便捷变量
 * @description 简化导入使用
 */
export const siteName = SITE_CONFIG.name;
export const siteUrl = SITE_CONFIG.url;
export const siteDomain = SITE_CONFIG.domain;
export const siteAuthor = SITE_CONFIG.author;

/**
 * 默认Metadata对象
 * @description 可直接用于根layout的完整配置
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: TITLE_CONFIG.default,
    template: TITLE_CONFIG.template,
  },
  description: DESCRIPTION_CONFIG.default,
  keywords: [...KEYWORDS_CONFIG.global],
  authors: [{ name: siteAuthor }],

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { rel: 'icon', url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },

  openGraph: {
    type: OG_CONFIG.type,
    locale: OG_CONFIG.locale,
    siteName: siteName,
    images: [{
      url: OG_CONFIG.image,
      width: OG_CONFIG.imageWidth,
      height: OG_CONFIG.imageHeight,
    }],
  },

  robots: ROBOTS_CONFIG,

  twitter: {
    card: 'summary_large_image',
    title: TITLE_CONFIG.default,
    description: DESCRIPTION_CONFIG.default,
    images: [OG_CONFIG.image],
  },

  alternates: {
    canonical: '/',
  },
};

/**
 * WebManifest配置
 * @description 用于site.webmanifest的同步配置
 */
export const WEBMANIFEST_CONFIG = {
  name: `${SITE_CONFIG.name} - 致敬全球思考者`,
  short_name: SITE_CONFIG.name,
  description: DESCRIPTION_CONFIG.default,
  start_url: '/',
  display: 'standalone' as const,
  background_color: '#ffffff',
  theme_color: '#3A3C6E',
  orientation: 'portrait-primary' as const,
  scope: '/',
  lang: 'zh-CN',
  dir: 'ltr' as const,
  categories: ['social', 'education', 'productivity'] as const,
};
