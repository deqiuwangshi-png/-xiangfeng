import type { ArticleHeaderProps } from '@/types';

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

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{article.title}</h1>

      <div className="article-meta">
        <span className="mr-3">{article.author.name} · {article.author.bio || ''}</span>
        <span className="mr-3">{formatPublishTime(article.publishedAt || article.created_at)}</span>
        <span>约{article.readTime}分钟阅读</span>
      </div>
    </div>
  );
}
