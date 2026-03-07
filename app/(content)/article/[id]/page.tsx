import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense, cache } from 'react';
import Link from 'next/link';
import { Home } from '@/components/icons';
import ArticleContent from '@/components/article/ArticleContent';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArticleActions from '@/components/article/ArticleActions';
import { CommentPanel } from '@/components/article/comments';
import ReadingProgress from '@/components/article/ReadingProgress';
import CommentSkeleton from '@/components/article/_skeletons/CommentSkeleton';
import { getCurrentUser } from '@/lib/supabase/user';
import { getArticleById, getArticleCommentsPaginated } from '@/lib/articles/queries';

/**
 * 页面级别缓存配置
 * - revalidate: 60秒增量静态再生
 * - 已发布文章不经常变动，适合缓存
 */
export const revalidate = 60;

/**
 * 缓存文章查询
 * 同一请求内多次调用返回缓存结果
 */
const getCachedArticle = cache(async (id: string) => {
  return getArticleById(id);
});

/**
 * 缓存评论查询
 * 同一请求内多次调用返回缓存结果
 */
const getCachedComments = cache(async (articleId: string, page: number, limit: number) => {
  return getArticleCommentsPaginated(articleId, page, limit);
});

interface ArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

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

  return {
    title: article.title,
    description: article.summary || '',
    keywords: article.tags?.join(', '),
    openGraph: {
      title: article.title,
      description: article.summary || '',
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
  };
}

/**
 * 文章详情页 - Server Component
 * 所有数据在服务端获取，减少客户端请求
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id: articleId } = await params;

  // ✅ 并行获取所有数据（速度快）
  // 使用分页加载评论，首屏只加载前10条
  // 使用缓存函数避免重复查询
  const [article, { comments, totalCount, hasMore }, user] = await Promise.all([
    getCachedArticle(articleId),
    getCachedComments(articleId, 1, 10),
    getCurrentUser(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <>
      <ReadingProgress />
      
      <nav className="nav-minimal">
        <div className="flex items-center w-full max-w-7xl mx-auto">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-linear-gradient(to-br, var(--xf-primary), var(--xf-accent)) flex items-center justify-center text-white font-bold">相</div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">相逢</span>
          </Link>
          
          <Link href="/home" className="nav-home-btn">
            <Home className="w-4 h-4" />
            <span>返回首页</span>
          </Link>
        </div>
      </nav>
      
      <div className="main-container pt-14">
        <div className="article-container">
          {/* ✅ 直接传递完整文章数据 */}
          <ArticleHeader article={article} />
          
          {/* ✅ ArticleContent 改为接收 content 直接渲染 */}
          <ArticleContent content={article.content} />
        </div>
      </div>
      
      {/* ✅ ArticleActions 接收当前用户和文章统计数据 */}
      <ArticleActions 
        articleId={articleId} 
        currentUser={user}
        initialLikeCount={article.likesCount || 0}
        initialCommentCount={totalCount || 0}
        initialLiked={false} // TODO: 从数据库获取当前用户是否点赞
        initialBookmarked={false} // TODO: 从数据库获取当前用户是否收藏
      />
      
      {/* ✅ CommentPanel 接收初始评论数据（分页加载） */}
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
