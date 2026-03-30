'use client';

/**
 * 受保护的文章内容组件
 * @module components/article/ProtectedArticleContent
 * @description 集成内容保护的文章内容展示组件
 *
 * @特性
 * - 包装文章内容
 * - 应用防复制保护
 * - 支持配置开关
 * - 可通过环境变量控制
 *
 * @性能优化 P1: 使用 useMemo 缓存 sanitizeRichText 结果
 * - 避免父组件状态更新时重复净化相同内容
 * - 减少长文章的重复正则处理开销
 */

import { useRef, useMemo } from 'react';
import { useContentProtection } from '@/hooks/article/useContentProtection';
import { sanitizeRichText } from '@/lib/utils/purify';
import {
  ENABLE_CONTENT_PROTECTION,
  CONTENT_PROTECTION_CONFIG,
} from '@/constants/contentProtection';
import type { ArticleContentProps } from '@/types';

/**
 * 受保护的文章内容组件属性
 * @interface ProtectedArticleContentProps
 */
interface ProtectedArticleContentProps extends ArticleContentProps {
  /** 是否启用内容保护（覆盖全局配置） */
  protectionEnabled?: boolean;
  /** 保护提示信息 */
  protectionMessage?: string;
}

/**
 * 受保护的文章内容组件
 *
 * @param {ProtectedArticleContentProps} props - 组件属性
 * @returns {JSX.Element} 受保护的文章内容
 *
 * @example
 * // 使用全局配置
 * <ProtectedArticleContent content={article.content} />
 *
 * // 强制启用/禁用
 * <ProtectedArticleContent
 *   content={article.content}
 *   protectionEnabled={false}
 * />
 */
export function ProtectedArticleContent({
  content,
  protectionEnabled = ENABLE_CONTENT_PROTECTION,
  protectionMessage = CONTENT_PROTECTION_CONFIG.message,
}: ProtectedArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useContentProtection(contentRef, {
    enabled: protectionEnabled,
    excludeSelectors: [...CONTENT_PROTECTION_CONFIG.excludeSelectors],
    message: protectionMessage,
  });

  /**
   * 缓存净化后的 HTML 内容
   * @依赖 content - 只在内容变化时重新净化
   */
  const sanitizedContent = useMemo(() => {
    return sanitizeRichText(content);
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="article-content article-content-reader content-protection"
      data-protection-enabled={protectionEnabled}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}

export default ProtectedArticleContent;
