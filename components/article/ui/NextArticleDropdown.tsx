'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { SuggestedArticle } from '@/lib/articles/queries';

interface NextArticleDropdownProps {
  nextArticle: SuggestedArticle | null;
  randomArticle: SuggestedArticle | null;
}

function formatDate(date: string | null): string {
  if (!date) return '';
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return '';
  return value.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
}

function ArticleItem({
  label,
  article,
  onPrefetch,
}: {
  label: string;
  article: SuggestedArticle | null;
  onPrefetch: (href: string) => void;
}) {
  if (!article) {
    return (
      <div className="rounded-lg border border-dashed border-xf-bg/80 bg-xf-bg/20 px-4 py-3">
        <p className="text-xs text-xf-medium mb-1">{label}</p>
        <p className="text-sm font-medium text-xf-medium">暂无更多文章</p>
        <p className="mt-1 text-xs text-xf-medium">稍后再来看看新的内容</p>
      </div>
    );
  }

  const href = `/article/${article.id}`;

  return (
    <Link
      href={href}
      onMouseEnter={() => onPrefetch(href)}
      onFocus={() => onPrefetch(href)}
      className="block rounded-lg border border-xf-bg/60 bg-white px-4 py-3 transition-colors hover:border-xf-primary/40 hover:bg-xf-bg/30"
    >
      <p className="text-xs text-xf-medium mb-1">{label}</p>
      <p className="text-sm font-medium text-xf-dark line-clamp-2">{article.title}</p>
      <p className="mt-1 text-xs text-xf-medium">
        {article.authorName} · {article.readTime} 分钟
        {article.publishedAt ? ` · ${formatDate(article.publishedAt)}` : ''}
      </p>
    </Link>
  );
}

export default function NextArticleDropdown({
  nextArticle,
  randomArticle,
}: NextArticleDropdownProps) {
  const router = useRouter();

  return (
    <section className="max-w-[840px] mx-auto px-4 sm:px-6 mt-5 mb-10">
      <details className="group rounded-xl border border-xf-bg/60 bg-white overflow-hidden">
        <summary className="list-none cursor-pointer select-none px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-xf-dark">继续阅读</span>
          <span className="text-xs text-xf-medium group-open:hidden">展开</span>
          <span className="text-xs text-xf-medium hidden group-open:inline">收起</span>
        </summary>
        <div className="border-t border-xf-bg/50 p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <ArticleItem
            label="下一篇文章"
            article={nextArticle}
            onPrefetch={(href) => router.prefetch(href)}
          />
          <ArticleItem
            label="随机看看"
            article={randomArticle}
            onPrefetch={(href) => router.prefetch(href)}
          />
        </div>
      </details>
    </section>
  );
}
