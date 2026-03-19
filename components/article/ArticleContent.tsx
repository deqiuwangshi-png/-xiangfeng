import { useMemo } from 'react';
import { sanitizeRichText } from '@/lib/utils/purify';
import type { ArticleContentProps } from '@/types';

/**
 * ArticleContent - 文章内容展示组件
 * @function ArticleContent
 * @param {ArticleContentProps} props - 组件属性
 * @param {string} props.content - 文章原始 HTML 内容
 * @returns {JSX.Element} 净化后的文章内容
 * @description
 * 安全渲染文章内容，使用 useMemo 缓存净化结果避免重复计算
 * @性能优化 P1: 使用 useMemo 缓存 sanitizeRichText 结果
 * - 避免父组件状态更新时重复净化相同内容
 * - 减少长文章的重复正则处理开销
 */
export default function ArticleContent({ content }: ArticleContentProps) {
  /**
   * 缓存净化后的 HTML 内容
   * @依赖 content - 只在内容变化时重新净化
   */
  const sanitizedContent = useMemo(() => {
    return sanitizeRichText(content);
  }, [content]);

  return (
    <div
      className="reading-mode"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
