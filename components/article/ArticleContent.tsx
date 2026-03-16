import { sanitizeRichText } from '@/lib/utils/purify';
import type { ArticleContentProps } from '@/types';

/**
 * ArticleContent - 纯展示组件（Server Component）
 * 作用: 安全渲染文章内容
 * @returns {JSX.Element} 文章内容组件
 */

/**
 * 文章内容组件
 * @function ArticleContent
 * @param {ArticleContentProps} props - 组件属性
 * @returns {JSX.Element} 文章内容组件
 * @description
 */
export default function ArticleContent({ content }: ArticleContentProps) {
  {/* 净化 HTML 内容，防止 XSS 攻击 - 使用 DOMPurify */}
  const sanitizedContent = sanitizeRichText(content);

  return (
    <div
      className="reading-mode"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
