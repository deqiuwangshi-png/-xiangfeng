import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense, cache } from 'react';
import Link from 'next/link';
import { Home } from '@/components/icons';
import {
  ArticleHeader,
  ProtectedArticleContent,
  ArticlePaywall,
  ArtAct,
  CommentPanel,
  ReadingProgress,
  CommentSkeleton,
  ViewTracker,
} from '@/components/article';
import { getCurrentUser } from '@/lib/auth/server';
import { getArticleDetailById, getArticleCommentsPaginated } from '@/lib/articles/queries';
import type { ArticlePageProps } from '@/types';

export type { ArticlePageProps } from '@/types';

export const revalidate = 6000;

/**
 * @安全优化 S1: userId 由服务端内部获取，不依赖客户端传入
 */
const getCachedArticle = cache(async (id: string) => {
  return getArticleDetailById(id);
});


const getCachedComments = cache(async (articleId: string, page: number, limit: number) => {
  return getArticleCommentsPaginated(articleId, page, limit);
});

/**
 * 生成页面元数据
 * @param {ArticlePageProps} params - 页面参数
 * @returns {Promise<Metadata>} 页面元数据
 */
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getCachedArticle(id);

  if (!article) {
    return {
      title: '文章未找到 | 相逢',
      description: '抱歉，您访问的文章不存在或已被删除。',
    };
  }

  return {
    title: `${article.title} | 相逢`,
    description: article.summary?.slice(0, 160) || article.title,
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
      
      <nav className="nav-minimal" aria-label="文章导航">
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
          
          {/* 根据用户状态显示完整内容或预览墙 */}
          {user ? (
            /* 已登录用户：显示完整内容 */
            <ProtectedArticleContent
              content={article.content}
              protectionEnabled={true}
              protectionMessage="文章内容受保护，禁止复制"
            />
          ) : (
            /* 匿名用户：显示预览墙（嵌入式渐变引导，智能文案） */
            <ArticlePaywall
              content={article.content}
              articleTitle={article.title}
              tags={article.tags}
            />
          )}
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
