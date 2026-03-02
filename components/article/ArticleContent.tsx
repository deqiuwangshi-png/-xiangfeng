/**
 * ArticleContent - 纯展示组件（Server Component）
 * 
 * 作用: 渲染文章内容
 * 
 * 设计原则:
 * - 无需 'use client'，纯 Server Component
 * - 直接接收 content 渲染，无需数据获取
 * - 减少客户端 JS 体积
 * 
 * @returns {JSX.Element} 文章内容组件
 */

interface ArticleContentProps {
  content: string;
}

/**
 * 文章内容组件
 * 
 * @function ArticleContent
 * @param {ArticleContentProps} props - 组件属性
 * @returns {JSX.Element} 文章内容组件
 * 
 * @description
 * 纯展示组件，直接渲染传入的 HTML 内容：
 * - 无需 useEffect，减少渲染时间
 * - 无需额外 HTTP 请求
 * - 支持 dangerouslySetInnerHTML 渲染富文本
 */
export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div 
      className="reading-mode"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
