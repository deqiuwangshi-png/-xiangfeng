/**
 * 社交分享工具函数
 * @module lib/seo/social
 * @description 生成社交分享链接、优化分享卡片内容
 */

import { SITE_CONFIG, truncateDescription, generateOgImageUrl } from './config';

/**
 * 分享平台配置
 */
export const SHARE_PLATFORMS = {
  /** Twitter */
  twitter: {
    name: 'Twitter',
    icon: 'twitter',
    color: '#1DA1F2',
    /** 生成分享 URL */
    getShareUrl: (url: string, title: string, via?: string) => {
      const params = new URLSearchParams({
        url,
        text: title,
        ...(via && { via }),
      });
      return `https://twitter.com/intent/tweet?${params.toString()}`;
    },
  },
  /** Facebook */
  facebook: {
    name: 'Facebook',
    icon: 'facebook',
    color: '#4267B2',
    getShareUrl: (url: string) => {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    },
  },
  /** LinkedIn */
  linkedin: {
    name: 'LinkedIn',
    icon: 'linkedin',
    color: '#0077b5',
    getShareUrl: (url: string, title: string, summary?: string) => {
      const params = new URLSearchParams({
        url,
        title,
        ...(summary && { summary }),
      });
      return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
    },
  },
  /** 微博 */
  weibo: {
    name: '微博',
    icon: 'weibo',
    color: '#E6162D',
    getShareUrl: (url: string, title: string, pic?: string) => {
      const params = new URLSearchParams({
        url,
        title,
        ...(pic && { pic }),
      });
      return `http://service.weibo.com/share/share.php?${params.toString()}`;
    },
  },
  /** Telegram */
  telegram: {
    name: 'Telegram',
    icon: 'telegram',
    color: '#0088cc',
    getShareUrl: (url: string, text: string) => {
      return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    },
  },
  /** WhatsApp */
  whatsapp: {
    name: 'WhatsApp',
    icon: 'whatsapp',
    color: '#25D366',
    getShareUrl: (url: string, text: string) => {
      return `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
    },
  },
  /** 微信（生成二维码） */
  wechat: {
    name: '微信',
    icon: 'wechat',
    color: '#07C160',
    /** 生成分享 URL */
    getShareUrl: (url: string) => url,
    /** 生成微信分享二维码 URL */
    getQrcodeUrl: (url: string, size: number = 200) => {
      // 使用 Google Chart API 生成二维码
      return `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(url)}`;
    },
  },
  /** 复制链接 */
  copy: {
    name: '复制链接',
    icon: 'link',
    color: '#6B7280',
    getShareUrl: () => '',
  },
} as const;

/** 分享平台类型 */
export type SharePlatform = keyof typeof SHARE_PLATFORMS;

/**
 * 分享数据配置
 */
export interface ShareData {
  /** 分享标题 */
  title: string;
  /** 分享描述 */
  description?: string;
  /** 分享链接 */
  url: string;
  /** 分享图片 */
  image?: string;
  /** 来源标识 */
  via?: string;
  /** 标签 */
  hashtags?: string[];
}

/**
 * 生成分享链接
 * @param platform - 分享平台
 * @param data - 分享数据
 * @returns 分享 URL
 */
export function generateShareUrl(platform: SharePlatform, data: ShareData): string {
  const { title, url, description, image, via } = data;

  switch (platform) {
    case 'twitter':
      return SHARE_PLATFORMS.twitter.getShareUrl(url, title, via);
    case 'facebook':
      return SHARE_PLATFORMS.facebook.getShareUrl(url);
    case 'linkedin':
      return SHARE_PLATFORMS.linkedin.getShareUrl(url, title, description);
    case 'weibo':
      return SHARE_PLATFORMS.weibo.getShareUrl(url, title, image);
    case 'telegram':
      return SHARE_PLATFORMS.telegram.getShareUrl(url, title);
    case 'whatsapp':
      return SHARE_PLATFORMS.whatsapp.getShareUrl(url, title);
    case 'wechat':
      return SHARE_PLATFORMS.wechat.getShareUrl(url);
    case 'copy':
      return url;
    default:
      return url;
  }
}

/**
 * 生成所有平台的分享链接
 * @param data - 分享数据
 * @returns 各平台分享链接映射
 */
export function generateAllShareUrls(
  data: ShareData
): Record<Exclude<SharePlatform, 'copy' | 'wechat'>, string> {
  const platforms: Exclude<SharePlatform, 'copy' | 'wechat'>[] = [
    'twitter',
    'facebook',
    'linkedin',
    'weibo',
    'telegram',
    'whatsapp',
  ];

  return platforms.reduce(
    (acc, platform) => {
      acc[platform] = generateShareUrl(platform, data);
      return acc;
    },
    {} as Record<Exclude<SharePlatform, 'copy' | 'wechat'>, string>
  );
}

/**
 * 复制链接到剪贴板
 * @param url - 要复制的链接
 * @returns Promise<boolean> 是否复制成功
 */
export async function copyToClipboard(url: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }

    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    return successful;
  } catch {
    return false;
  }
}

/**
 * 打开分享窗口
 * @param url - 分享 URL
 * @param width - 窗口宽度
 * @param height - 窗口高度
 */
export function openShareWindow(
  url: string,
  width: number = 600,
  height: number = 400
): void {
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  window.open(
    url,
    'share',
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
  );
}

/**
 * 生成社交分享卡片数据（OG/Twitter Card）
 * @param params - 卡片参数
 * @returns 社交卡片数据
 */
export function generateSocialCard(params: {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedAt?: string;
  modifiedAt?: string;
  tags?: string[];
}) {
  const {
    title,
    description = SITE_CONFIG.name,
    image,
    url = SITE_CONFIG.url,
    type = 'website',
    author,
    publishedAt,
    modifiedAt,
    tags = [],
  } = params;

  const truncatedDescription = truncateDescription(description, 200);
  const ogImageUrl = image ? generateOgImageUrl(image) : generateOgImageUrl();

  return {
    // Open Graph
    og: {
      type,
      locale: SITE_CONFIG.locale,
      url,
      siteName: SITE_CONFIG.name,
      title,
      description: truncatedDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && {
        article: {
          author,
          publishedTime: publishedAt,
          modifiedTime: modifiedAt,
          section: tags[0],
          tags,
        },
      }),
    },
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      site: '@xiangfeng',
      creator: '@xiangfeng',
      title,
      description: truncatedDescription,
      images: [ogImageUrl],
    },
  };
}

/**
 * 生成文章分享数据
 * @param article - 文章数据
 * @returns 分享数据
 */
export function generateArticleShareData(article: {
  title: string;
  description?: string;
  id: string;
  authorName: string;
  image?: string;
}): ShareData {
  const { title, description, id, authorName, image } = article;

  return {
    title: `${title} | ${authorName}`,
    description: description || `阅读 ${authorName} 的深度文章`,
    url: `${SITE_CONFIG.url}/article/${id}`,
    image: image || generateOgImageUrl(),
    via: 'xiangfeng',
    hashtags: ['相逢', '深度阅读', '知识分享'],
  };
}

/**
 * 生成用户主页分享数据
 * @param profile - 用户数据
 * @returns 分享数据
 */
export function generateProfileShareData(profile: {
  name: string;
  id: string;
  description?: string;
  avatar?: string;
  articleCount?: number;
}): ShareData {
  const { name, id, description, avatar, articleCount = 0 } = profile;

  return {
    title: `${name} 的个人主页`,
    description:
      description || `${name} 在相逢发布了 ${articleCount} 篇深度文章`,
    url: `${SITE_CONFIG.url}/profile/${id}`,
    image: avatar,
    via: 'xiangfeng',
    hashtags: ['相逢', '创作者', '知识分享'],
  };
}

/**
 * 生成动态 OG 图片 URL
 * @description 使用 Vercel OG Image 或其他服务生成动态图片
 * @param params - 图片参数
 * @returns 动态图片 URL
 */
export function generateDynamicOgImageUrl(params: {
  title: string;
  author?: string;
  avatar?: string;
  type?: 'article' | 'profile' | 'default';
}): string {
  const { title, author, avatar, type = 'default' } = params;

  // 使用 Vercel OG Image API
  const searchParams = new URLSearchParams();
  searchParams.set('title', title);
  if (author) searchParams.set('author', author);
  if (avatar) searchParams.set('avatar', avatar);
  searchParams.set('type', type);

  return `${SITE_CONFIG.url}/api/og?${searchParams.toString()}`;
}

/**
 * 检测是否支持原生分享
 * @returns boolean
 */
export function isNativeShareSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

/**
 * 使用原生 Web Share API 分享
 * @param data - 分享数据
 * @returns Promise<void>
 */
export async function nativeShare(data: ShareData): Promise<void> {
  if (!isNativeShareSupported()) {
    throw new Error('Native share is not supported');
  }

  await navigator.share({
    title: data.title,
    text: data.description,
    url: data.url,
  });
}

/**
 * 生成分享统计事件数据
 * @param platform - 分享平台
 * @param contentType - 内容类型
 * @param contentId - 内容 ID
 * @returns 统计事件数据
 */
export function generateShareEvent(
  platform: SharePlatform,
  contentType: 'article' | 'profile' | 'page',
  contentId: string
) {
  return {
    event: 'share',
    platform,
    contentType,
    contentId,
    timestamp: new Date().toISOString(),
  };
}
