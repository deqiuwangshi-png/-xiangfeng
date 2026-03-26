import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense, cache } from 'react';
import Link from 'next/link';
import { Home } from '@/components/icons';
import ArticleContent from '@/components/article/ArticleContent';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArtAct from '@/components/article/ArtAct';
import { CommentPanel } from '@/components/article/comments';
import ReadingProgress from '@/components/article/ReadingProgress';
import CommentSkeleton from '@/components/article/_skeletons/CommentSkeleton';
import { ViewTracker } from '@/components/article/ViewTracker';
import { getCurrentUser } from '@/lib/supabase/user';
import { getArticleDetailById, getArticleCommentsPaginated } from '@/lib/articles/queries';
import type { ArticlePageProps } from '@/types';

export type { ArticlePageProps } from '@/types';

/**
 * 页面级别缓存配置
 * - revalidate: 6000秒（约100分钟）增量静态再生
 * - 已发布文章不经常变动，适合较长缓存
 */
export const revalidate = 6000;

/**
 * 缓存文章查询
 * 同一请求内多次调用返回缓存结果
 *
 * @安全优化 S1: userId 由服务端内部获取，不依赖客户端传入
 */
const getCachedArticle = cache(async (id: string) => {
  return getArticleDetailById(id);
});

/**
 * 缓存评论查询
 * 同一请求内多次调用返回缓存结果
 *
 * @安全优化 S1: currentUserId 由服务端内部获取，不依赖客户端传入
 * @性能优化 P1: 自动判断当前用户点赞状态
 */
const getCachedComments = cache(async (articleId: string, page: number, limit: number) => {
  return getArticleCommentsPaginated(articleId, page, limit);
});

/**
 * 生成页面元数据（SEO）
 * 使用缓存避免重复查询
 */
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;

  // 使用缓存获取文章数据
  const article = await getCachedArticle(id);

  if (!article) {
    return {
      title: '文章未找到',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xiangfeng.site'
  const articleUrl = `${siteUrl}/article/${id}`

  return {
    title: article.title,
    description: article.summary || '',
    keywords: article.tags?.join(', '),
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.title,
      description: article.summary || '',
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      url: articleUrl,
      images: [
        {
          url: `${siteUrl}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary || '',
      images: [`${siteUrl}/og-image.svg`],
    },
  };
}

/**
 * 文章详情页 - Server Component
 * 所有数据在服务端获取，减少客户端请求
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id: articleId } = await params;

  const user = await getCurrentUser();

  const [article, { comments, totalCount, hasMore }] = await Promise.all([
    getCachedArticle(articleId),
    getCachedComments(articleId, 1, 10),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <>
      {/* 浏览量追踪 - 自动统计访问 */}
      <ViewTracker articleId={articleId} />
      <ReadingProgress />
      
      <nav className="nav-minimal">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* 展示性 LOGO，无点击功能 */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900 hidden sm:block">相逢</span>
          </div>

          <Link href="/home" className="nav-home-btn">
            <Home className="w-4 h-4" />
            <span>返回首页</span>
          </Link>
        </div>
      </nav>
      
      <div className="main-container pt-14">
        <div className="article-container">
          {/* 直接传递完整文章数据 */}
          <ArticleHeader article={article} />
          
          {/* ArticleContent 改为接收 content 直接渲染 */}
          <ArticleContent content={article.content} />
        </div>
      </div>
      
      {/* ArticleActions 接收当前用户和文章统计数据 */}
      <ArtAct
        articleId={articleId}
        authorId={article.author_id}
        authorName={article.author.name}
        authorAvatar={article.author.avatar}
        currentUser={user}
        initialLikeCount={article.likesCount || 0}
        initialCommentCount={totalCount || 0}
        initialLiked={article.isLiked || false}
        initialBookmarked={article.isBookmarked || false}
      />
      
      {/* CommentPanel 接收初始评论数据（分页加载） */}
      <Suspense fallback={<CommentSkeleton />}>
        <CommentPanel
          articleId={articleId}
          initialComments={comments}
          initialTotalCount={totalCount}
          initialHasMore={hasMore}
          currentUser={user}
        />
      </Suspense>
    </>
  );
}
