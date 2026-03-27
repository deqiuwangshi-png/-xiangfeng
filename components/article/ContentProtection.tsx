'use client';

/**
 * 内容保护组件
 * @module components/article/ContentProtection
 * @description 文章内容的防复制保护包装组件
 *
 * @特性
 * - 包装文章内容区域
 * - 应用防复制保护
 * - 支持配置开关
 * - 排除评论区等交互区域
 */

import { useRef, ReactNode } from 'react';
import { useContentProtection } from '@/hooks/useContentProtection';

/**
 * 内容保护组件属性
 * @interface ContentProtectionProps
 */
interface ContentProtectionProps {
  /** 子内容 */
  children: ReactNode;
  /** 是否启用保护 */
  enabled?: boolean;
  /** 排除的选择器 */
  excludeSelectors?: string[];
  /** 自定义提示信息 */
  message?: string;
  /** 额外的CSS类名 */
  className?: string;
}

/**
 * 内容保护组件
 *
 * @param {ContentProtectionProps} props - 组件属性
 * @returns {JSX.Element} 受保护的内容区域
 *
 * @example
 * <ContentProtection enabled={true} excludeSelectors={['.comment-section']}>
 *   <article>文章内容</article>
 * </ContentProtection>
 */
export function ContentProtection({
  children,
  enabled = true,
  excludeSelectors = ['.comment-section', '.article-actions', '.share-buttons'],
  message = '文章内容受保护，禁止复制',
  className = '',
}: ContentProtectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useContentProtection(contentRef, {
    enabled,
    excludeSelectors,
    message,
  });

  return (
    <div
      ref={contentRef}
      className={`content-protection ${className}`}
      data-protection-enabled={enabled}
    >
      {children}
    </div>
  );
}

export default ContentProtection;
