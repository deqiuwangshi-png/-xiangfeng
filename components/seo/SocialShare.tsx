'use client';

/**
 * 社交分享组件
 * @module components/seo/SocialShare
 * @description 提供多平台社交分享功能，增强内容传播
 */

import { useState, useCallback } from 'react';
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Link2, 
  Check,
  MessageCircle,
  Send
} from 'lucide-react';

/**
 * 分享平台配置
 */
const SHARE_PLATFORMS = {
  twitter: {
    name: 'Twitter',
    icon: Twitter,
    color: 'hover:bg-[#1DA1F2] hover:text-white',
    getUrl: (url: string, title: string) => 
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'hover:bg-[#4267B2] hover:text-white',
    getUrl: (url: string) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'hover:bg-[#0077b5] hover:text-white',
    getUrl: (url: string, title: string) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  weibo: {
    name: '微博',
    icon: MessageCircle,
    color: 'hover:bg-[#E6162D] hover:text-white',
    getUrl: (url: string, title: string) => 
      `http://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  telegram: {
    name: 'Telegram',
    icon: Send,
    color: 'hover:bg-[#0088cc] hover:text-white',
    getUrl: (url: string, title: string) => 
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
};

/**
 * 社交分享按钮属性
 */
interface SocialShareProps {
  /** 分享链接 */
  url: string;
  /** 分享标题 */
  title: string;
  /** 分享描述 */
  description?: string;
  /** 自定义样式类名 */
  className?: string;
  /** 按钮大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否显示复制链接 */
  showCopyLink?: boolean;
  /** 要显示的平台 */
  platforms?: Array<keyof typeof SHARE_PLATFORMS>;
}

/**
 * 社交分享组件
 * @param {SocialShareProps} props - 组件属性
 * @returns {JSX.Element} 社交分享按钮组
 */
export function SocialShare({
  url,
  title,
  description,
  className = '',
  size = 'md',
  showCopyLink = true,
  platforms = ['twitter', 'weibo', 'telegram'],
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * 复制链接到剪贴板
   */
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  /**
   * 打开分享窗口
   */
  const openShareWindow = useCallback((platformUrl: string) => {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      platformUrl,
      'share',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
    );
  }, []);

  /**
   * 尺寸样式映射
   */
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 主分享按钮 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          ${sizeClasses[size]}
          rounded-full bg-xf-light text-xf-dark
          hover:bg-xf-primary hover:text-white
          transition-all duration-200
          flex items-center justify-center
          focus:outline-none focus:ring-2 focus:ring-xf-primary/50
        `}
        aria-label="分享"
        aria-expanded={isExpanded}
      >
        <Share2 className={iconSizes[size]} />
      </button>

      {/* 展开的平台按钮 */}
      <div 
        className={`
          flex items-center gap-2
          transition-all duration-300 ease-out
          ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}
        `}
      >
        {platforms.map((platformKey) => {
          const platform = SHARE_PLATFORMS[platformKey];
          const Icon = platform.icon;
          
          return (
            <button
              key={platformKey}
              onClick={() => openShareWindow(platform.getUrl(url, title))}
              className={`
                ${sizeClasses[size]}
                rounded-full bg-white border border-xf-bg
                text-xf-medium
                ${platform.color}
                transition-all duration-200
                flex items-center justify-center
                focus:outline-none focus:ring-2 focus:ring-xf-primary/50
              `}
              aria-label={`分享到${platform.name}`}
              title={`分享到${platform.name}`}
            >
              <Icon className={iconSizes[size]} />
            </button>
          );
        })}

        {/* 复制链接按钮 */}
        {showCopyLink && (
          <button
            onClick={copyToClipboard}
            className={`
              ${sizeClasses[size]}
              rounded-full bg-white border border-xf-bg
              text-xf-medium
              hover:bg-xf-accent hover:text-white
              transition-all duration-200
              flex items-center justify-center
              focus:outline-none focus:ring-2 focus:ring-xf-primary/50
            `}
            aria-label={copied ? '链接已复制' : '复制链接'}
            title={copied ? '链接已复制' : '复制链接'}
          >
            {copied ? (
              <Check className={`${iconSizes[size]} text-green-500`} />
            ) : (
              <Link2 className={iconSizes[size]} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * 内联社交分享组件 - 适合嵌入文章底部
 */
interface InlineSocialShareProps {
  url: string;
  title: string;
  className?: string;
}

export function InlineSocialShare({ url, title, className = '' }: InlineSocialShareProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  }, [url]);

  const openShareWindow = useCallback((platformUrl: string) => {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      platformUrl,
      'share',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
    );
  }, []);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm text-xf-medium">分享到：</span>
      
      <button
        onClick={() => openShareWindow(SHARE_PLATFORMS.twitter.getUrl(url, title))}
        className="p-2 rounded-lg bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-colors"
        aria-label="分享到Twitter"
      >
        <Twitter className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => openShareWindow(SHARE_PLATFORMS.weibo.getUrl(url, title))}
        className="p-2 rounded-lg bg-[#E6162D]/10 text-[#E6162D] hover:bg-[#E6162D] hover:text-white transition-colors"
        aria-label="分享到微博"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => openShareWindow(SHARE_PLATFORMS.telegram.getUrl(url, title))}
        className="p-2 rounded-lg bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc] hover:text-white transition-colors"
        aria-label="分享到Telegram"
      >
        <Send className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-xf-bg mx-2" />
      
      <button
        onClick={copyToClipboard}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-xf-light text-xf-medium hover:bg-xf-primary hover:text-white transition-colors text-sm"
        aria-label={copied ? '链接已复制' : '复制链接'}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span>已复制</span>
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4" />
            <span>复制链接</span>
          </>
        )}
      </button>
    </div>
  );
}
