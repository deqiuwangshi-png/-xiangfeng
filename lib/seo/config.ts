/**
 * SEO 全局配置
 * @module lib/seo/config
 * @description 全站统一的 SEO 配置规范，参考字节系产品标准
 */

/**
 * 站点基础信息配置
 */
export const SITE_CONFIG = {
  /** 站点名称 */
  name: '相逢 Xiangfeng',
  /** 站点简称 */
  shortName: '相逢',
  /** 站点域名 */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xiangfeng.site',
  /** 默认语言 */
  locale: 'zh-CN',
  /** 备用语言 */
  alternateLocales: ['en-US'],
  /** 默认作者 */
  author: 'Xiangfeng Team',
  /** 版权信息 */
  copyright: `© ${new Date().getFullYear()} 相逢 Xiangfeng. All rights reserved.`,
  /** 站点分类 */
  category: 'technology',
  /** 站点分类详细 */
  classification: '知识社区,内容创作,社交网络,深度阅读',
} as const;

/**
 * 标题模板配置
 * @description 统一全站标题格式，确保品牌一致性
 */
export const TITLE_TEMPLATES = {
  /** 默认标题模板 */
  default: `%s | ${SITE_CONFIG.name}`,
  /** 首页标题 */
  home: `${SITE_CONFIG.name} - 深度思考者社区 | 长文创作与知识分享平台`,
  /** 文章详情页模板 */
  article: `%s | %s - ${SITE_CONFIG.shortName}`,
  /** 用户主页模板 */
  profile: `%s - %s | ${SITE_CONFIG.shortName}`,
  /** 列表页模板 */
  list: `%s - ${SITE_CONFIG.shortName}`,
  /** 功能页模板 */
  feature: `%s - ${SITE_CONFIG.shortName}`,
  /** 后台页面模板（noindex） */
  admin: `%s - ${SITE_CONFIG.shortName}`,
} as const;

/**
 * 默认 SEO 配置
 * @description 全站统一的默认 SEO 值
 */
export const DEFAULT_SEO = {
  /** 默认描述 */
  description: '相逢是一个连接深度思考者的知识社区，专注于长文创作与深度阅读。打破认知边界，构建思维网络与知识经济生态，让深度内容回归本真。',
  /** 默认关键词 */
  keywords: [
    '知识社区',
    '深度思考',
    '长文创作',
    '深度阅读',
    '认知网络',
    '创作者经济',
    '内容创作',
    '知识分享',
    '优质内容',
    '独立思考',
  ],
  /** 默认 OG 图片 */
  ogImage: {
    url: '/og-image.svg',
    width: 1200,
    height: 630,
    alt: '相逢 Xiangfeng - 深度思考者社区与知识分享平台',
    type: 'image/svg+xml',
  },
  /** Twitter 账号 */
  twitter: {
    site: '@xiangfeng',
    creator: '@xiangfeng',
  },
  /** 搜索引擎验证 */
  verification: {
    google: 'OnmNwulVS1xwiFr3pKL54p_0qTpoHRsi63cLm9cC8i4',
    baidu: 'codeva-example',
    bing: '2C8C448F5364105CE31A05CCB3994092',
  },
} as const;

/**
 * 页面类型定义
 * @description 定义不同页面的 SEO 处理策略
 */
export type PageType =
  | 'home'           // 首页
  | 'article'        // 文章详情
  | 'profile'        // 用户主页
  | 'list'           // 列表页
  | 'feature'        // 功能页
  | 'marketing'      // 营销页
  | 'legal'          // 法律页面
  | 'auth'           // 认证页面（noindex）
  | 'admin'          // 后台页面（noindex）
  | 'error';         // 错误页面

/**
 * 页面 SEO 策略配置
 * @description 针对不同页面类型的 SEO 策略
 */
export const PAGE_SEO_STRATEGIES: Record<PageType, {
  /** 是否允许索引 */
  indexable: boolean;
  /** 是否允许跟踪链接 */
  followable: boolean;
  /** 优先级（0-1） */
  priority: number;
  /** 更新频率 */
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  /** 是否包含在 sitemap */
  includeInSitemap: boolean;
  /** 标题模板 */
  titleTemplate: string;
}> = {
  home: {
    indexable: true,
    followable: true,
    priority: 1.0,
    changeFrequency: 'daily',
    includeInSitemap: true,
    titleTemplate: TITLE_TEMPLATES.home,
  },
  article: {
    indexable: true,
    followable: true,
    priority: 0.8,
    changeFrequency: 'weekly',
    includeInSitemap: true,
    titleTemplate: TITLE_TEMPLATES.article,
  },
  profile: {
    indexable: true,
    followable: true,
    priority: 0.6,
    changeFrequency: 'weekly',
    includeInSitemap: true,
    titleTemplate: TITLE_TEMPLATES.profile,
  },
  list: {
    indexable: true,
    followable: true,
    priority: 0.7,
    changeFrequency: 'daily',
    includeInSitemap: true,
    titleTemplate: TITLE_TEMPLATES.list,
  },
  feature: {
    indexable: true,
    followable: true,
    priority: 0.5,
    changeFrequency: 'monthly',
    includeInSitemap: true,
    titleTemplate: TITLE_TEMPLATES.feature,
  },
  marketing: {
    indexable: true,
    followable: true,
    priority: 0.6,
    changeFrequency: 'monthly',
    includeInSitemap: true,
    titleTemplate: TITLE_TEMPLATES.default,
  },
  legal: {
    indexable: true,
    followable: true,
    priority: 0.3,
    changeFrequency: 'yearly',
    includeInSitemap: true,
    titleTemplate: TITLE_TEMPLATES.default,
  },
  auth: {
    indexable: false,
    followable: false,
    priority: 0,
    changeFrequency: 'never',
    includeInSitemap: false,
    titleTemplate: TITLE_TEMPLATES.admin,
  },
  admin: {
    indexable: false,
    followable: false,
    priority: 0,
    changeFrequency: 'never',
    includeInSitemap: false,
    titleTemplate: TITLE_TEMPLATES.admin,
  },
  error: {
    indexable: false,
    followable: false,
    priority: 0,
    changeFrequency: 'never',
    includeInSitemap: false,
    titleTemplate: TITLE_TEMPLATES.default,
  },
} as const;

/**
 * 路由到页面类型映射
 * @description 根据路由路径判断页面类型
 */
export const ROUTE_TO_PAGE_TYPE: Record<string, PageType> = {
  '/': 'home',
  '/home': 'list',
  '/article': 'article',
  '/profile': 'profile',
  '/about': 'marketing',
  '/partners': 'marketing',
  '/privacy': 'legal',
  '/terms': 'legal',
  '/login': 'auth',
  '/register': 'auth',
  '/forgot-password': 'auth',
  '/reset-password': 'auth',
  '/drafts': 'admin',
  '/publish': 'admin',
  '/settings': 'admin',
  '/inbox': 'admin',
  '/rewards': 'feature',
  '/feedback': 'feature',
  '/updates': 'feature',
} as const;

/**
 * 获取页面类型
 * @param pathname - 页面路径
 * @returns 页面类型
 */
export function getPageType(pathname: string): PageType {
  // 精确匹配
  if (ROUTE_TO_PAGE_TYPE[pathname]) {
    return ROUTE_TO_PAGE_TYPE[pathname];
  }

  // 前缀匹配
  if (pathname.startsWith('/article/')) return 'article';
  if (pathname.startsWith('/profile/')) return 'profile';
  if (pathname.startsWith('/login')) return 'auth';
  if (pathname.startsWith('/register')) return 'auth';
  if (pathname.startsWith('/forgot-password')) return 'auth';
  if (pathname.startsWith('/reset-password')) return 'auth';
  if (pathname.startsWith('/drafts')) return 'admin';
  if (pathname.startsWith('/publish')) return 'admin';
  if (pathname.startsWith('/settings')) return 'admin';
  if (pathname.startsWith('/inbox')) return 'admin';
  if (pathname.startsWith('/rewards')) return 'feature';

  // 默认返回 feature 类型
  return 'feature';
}

/**
 * 获取页面 SEO 策略
 * @param pathname - 页面路径
 * @returns SEO 策略配置
 */
export function getPageSeoStrategy(pathname: string) {
  const pageType = getPageType(pathname);
  return PAGE_SEO_STRATEGIES[pageType];
}

/**
 * 生成规范 URL
 * @param path - 页面路径
 * @returns 完整规范 URL
 */
export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
}

/**
 * 生成标题
 * @param template - 标题模板
 * @param values - 模板值
 * @returns 格式化标题
 */
export function generateTitle(template: string, ...values: string[]): string {
  return values.reduce((acc, val) => {
    return acc.replace(`%s`, val);
  }, template);
}

/**
 * 截断描述文本
 * @param description - 原始描述
 * @param maxLength - 最大长度（默认 160）
 * @returns 截断后的描述
 */
export function truncateDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

/**
 * 生成关键词字符串
 * @param keywords - 关键词数组
 * @returns 逗号分隔的关键词字符串
 */
export function generateKeywordsString(keywords: string[]): string {
  return keywords.join(', ');
}

/**
 * 生成 OG 图片 URL
 * @param path - 图片路径
 * @returns 完整 OG 图片 URL
 */
export function generateOgImageUrl(path: string = DEFAULT_SEO.ogImage.url): string {
  if (path.startsWith('http')) return path;
  return `${SITE_CONFIG.url}${path.startsWith('/') ? '' : '/'}${path}`;
}
