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
 */

import { useRef } from 'react';
import { useContentProtection } from '@/hooks/useContentProtection';
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

  // 应用内容保护
  useContentProtection(contentRef, {
    enabled: protectionEnabled,
    excludeSelectors: [...CONTENT_PROTECTION_CONFIG.excludeSelectors],
    message: protectionMessage,
  });

  // 净化HTML内容
  const sanitizedContent = sanitizeRichText(content);

  return (
    <div
      ref={contentRef}
      className="reading-mode content-protection"
      data-protection-enabled={protectionEnabled}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}

export default ProtectedArticleContent;
