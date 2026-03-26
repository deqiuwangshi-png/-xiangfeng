'use client';

/**
 * ArticleHeader - 文章头部组件
 * @module components/article/ArticleHeader
 * @description 显示文章标题、作者、发布时间和浏览量
 *
 * @安全特性
 * - 所有用户生成的内容（作者名）都经过 escapeHtml 转义
 * - 防止 XSS 攻击，确保恶意脚本不会被执行
 */

import { useMemo } from 'react';
import { escapeHtml } from '@/lib/utils/purify';
import { Eye } from '@/components/icons';
import { useArticleViewCount } from '@/hooks/useArticleView';
import type { ArticleWithAuthor } from '@/types';

/**
 * ArticleHeader 组件 Props
 */
interface ArticleHeaderProps {
  /** 文章数据 */
  article: ArticleWithAuthor;
}

/**
 * 格式化发布时间
 * @param {string} dateStr - ISO日期字符串
 * @returns {string} 格式化后的时间字符串
 */
function formatPublishTime(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // 判断时间段
  let period = '';
  const h = date.getHours();
  if (h >= 0 && h < 6) {
    period = '凌晨';
  } else if (h >= 6 && h < 12) {
    period = '上午';
  } else if (h >= 12 && h < 14) {
    period = '中午';
  } else if (h >= 14 && h < 18) {
    period = '下午';
  } else {
    period = '晚上';
  }

  return `${year}.${month}.${day} ${period}${hours}：${minutes}分`;
}

/**
 * 文章头部组件
 *
 * @param {ArticleHeaderProps} props - 组件属性
 * @returns {JSX.Element} 文章头部
 */
export default function ArticleHeader({ article }: ArticleHeaderProps) {
  // 对作者名称进行 HTML 转义，防止 XSS
  const safeAuthorName = useMemo(() => escapeHtml(article.author.name), [article.author.name]);

  // 使用 hook 获取实时浏览量
  const { viewCount } = useArticleViewCount({
    articleId: article.id,
    initialCount: article.viewsCount || 0,
  });

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{article.title}</h1>

      <div className="article-meta">
        <span className="mr-3">{safeAuthorName}</span>
        <span className="mr-3">{formatPublishTime(article.publishedAt || article.created_at)}</span>
        <span className="mr-3">约{article.readTime}分钟阅读</span>
        {/* 浏览量 - 支持实时更新 */}
        <span className="flex items-center gap-1" data-testid="view-count">
          <Eye className="w-3 h-3" />
          {viewCount}
        </span>
      </div>
    </div>
  );
}
