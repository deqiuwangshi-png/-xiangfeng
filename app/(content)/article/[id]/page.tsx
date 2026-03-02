import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import ArticleContent from '@/components/article/ArticleContent';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArticleActions from '@/components/article/ArticleActions';
import CommentPanel from '@/components/article/CommentPanel';
import ReadingProgress from '@/components/article/ReadingProgress';
import ArticleSkeleton from '@/components/article/ArticleSkeleton';
import CommentSkeleton from '@/components/article/CommentSkeleton';
import { createClient } from '@/lib/supabase/server';
import { getArticleById, getArticleComments } from '@/lib/articles/articleQueries';

interface ArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * 生成页面元数据（SEO）
 */
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  
  // Server 端直接查询数据库
  const supabase = await createClient();
  const { data: article } = await supabase
    .from('articles')
    .select('title, summary, tags, created_at, author_id')
    .eq('id', id)
    .single();

  if (!article) {
    return {
      title: '文章未找到',
    };
  }

  // 获取作者信息
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', article.author_id)
    .single();

  return {
    title: article.title,
    description: article.summary || '',
    keywords: article.tags?.join(', '),
    openGraph: {
      title: article.title,
      description: article.summary || '',
      type: 'article',
      publishedTime: article.created_at,
      authors: [profile?.username || ''],
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
  const [article, comments, { data: { user } }] = await Promise.all([
    getArticleById(articleId),
    getArticleComments(articleId),
    createClient().then(client => client.auth.getUser()),
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
      
      {/* ✅ ArticleActions 接收当前用户 */}
      <ArticleActions 
        articleId={articleId} 
        currentUser={user} 
      />
      
      {/* ✅ CommentPanel 接收初始评论数据 */}
      <Suspense fallback={<CommentSkeleton />}>
        <CommentPanel 
          articleId={articleId} 
          initialComments={comments}
          currentUser={user}
        />
      </Suspense>
    </>
  );
}
