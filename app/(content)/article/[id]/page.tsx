import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense, cache } from 'react';
import Link from 'next/link';
import { Home } from '@/components/icons';
import { ProtectedArticleContent } from '@/components/article/ProtectedArticleContent';
import { ArticlePaywall } from '@/components/article/ArticlePaywall';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArtAct from '@/components/article/ArtAct';
import { CommentPanel } from '@/components/article/comments';
import ReadingProgress from '@/components/article/ReadingProgress';
import CommentSkeleton from '@/components/article/_skeletons/CommentSkeleton';
import { ViewTracker } from '@/components/article/ViewTracker';
import { ArticleStructuredData, BreadcrumbStructuredData } from '@/components/seo';
import { getCurrentUser } from '@/lib/supabase/user';
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
 * 生成页面元数据（SEO）
 * 使用缓存避免重复查询
 * @param {ArticlePageProps} params - 页面参数
 * @returns {Promise<Metadata>} 页面元数据
 * @description 针对文章详情页进行全面SEO优化，包括结构化数据和社交分享
 */
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;

  // 使用缓存获取文章数据
  const article = await getCachedArticle(id);

  if (!article) {
    return {
      title: '文章未找到 | 相逢',
      description: '抱歉，您访问的文章不存在或已被删除。',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xiangfeng.site';
  const siteName = '相逢 Xiangfeng';
  const articleUrl = `${siteUrl}/article/${id}`;
  
  // 构建SEO优化的描述（限制在160字符以内）
  const seoDescription = article.summary 
    ? article.summary.slice(0, 160) + (article.summary.length > 160 ? '...' : '')
    : `${article.title} - 深度思考者的原创文章，在相逢发现更多优质内容。`;
  
  // 构建关键词
  const keywords = [
    ...(article.tags || []),
    '深度文章',
    '原创内容',
    '知识分享',
    '深度思考',
    '相逢',
    article.author.name,
  ].filter(Boolean).join(', ');

  return {
    title: `${article.title} | ${siteName}`,
    description: seoDescription,
    keywords: keywords,
    authors: [{ name: article.author.name, url: `${siteUrl}/profile/${article.author_id}` }],
    creator: article.author.name,
    publisher: siteName,
    
    /**
     * 规范链接
     */
    alternates: {
      canonical: articleUrl,
      languages: {
        'zh-CN': articleUrl,
      },
    },
    
    /**
     * Open Graph - 文章类型
     */
    openGraph: {
      title: article.title,
      description: seoDescription,
      type: 'article',
      url: articleUrl,
      siteName: siteName,
      locale: 'zh_CN',
      publishedTime: article.publishedAt,
      modifiedTime: article.updated_at || article.publishedAt,
      authors: [`${siteUrl}/profile/${article.author_id}`],
      section: article.tags?.[0] || '深度文章',
      tags: article.tags || [],
      images: [
        {
          url: `${siteUrl}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: article.title,
          type: 'image/svg+xml',
        },
      ],
    },
    
    /**
     * Twitter Card
     */
    twitter: {
      card: 'summary_large_image',
      site: '@xiangfeng',
      creator: '@xiangfeng',
      title: article.title,
      description: seoDescription,
      images: [`${siteUrl}/og-image.svg`],
    },
    
    /**
     * 机器人控制
     */
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    
    /**
     * 其他元数据
     */
    category: article.tags?.[0] || '深度文章',
    classification: article.tags?.join(',') || '深度文章,知识分享',
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xiangfeng.site';
  const articleUrl = `${siteUrl}/article/${articleId}`;
  const authorUrl = `${siteUrl}/profile/${article.author_id}`;
  
  // 计算文章字数
  const wordCount = article.content 
    ? article.content.replace(/<[^>]*>/g, '').length 
    : 0;

  return (
    <>
      {/* 结构化数据 - Schema.org Article */}
      <ArticleStructuredData
        title={article.title}
        description={article.summary || ''}
        url={articleUrl}
        authorName={article.author.name}
        authorUrl={authorUrl}
        publishedAt={article.publishedAt}
        modifiedAt={article.updated_at}
        tags={article.tags}
        wordCount={wordCount}
      />
      
      {/* 面包屑导航结构化数据 */}
      <BreadcrumbStructuredData
        items={[
          { name: '首页', url: siteUrl },
          { name: '文章', url: `${siteUrl}/home` },
          { name: article.title, url: articleUrl },
        ]}
      />
      
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
