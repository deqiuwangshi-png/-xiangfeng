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
import { fetchArticle } from '@/lib/articles/articleService';

interface ArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await fetchArticle(id);
  
  if (!article) {
    return {
      title: '文章未找到',
    };
  }
  
  const metadata: Metadata = {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags.join(', '),
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  };
  
  if (article.coverImage) {
    if (metadata.openGraph) {
      metadata.openGraph.images = [article.coverImage];
    }
    if (metadata.twitter) {
      metadata.twitter.images = [article.coverImage];
    }
  }
  
  return metadata;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id: articleId } = await params;
  const article = await fetchArticle(articleId);
  
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
          <ArticleHeader article={article} />
          
          <Suspense fallback={<ArticleSkeleton />}>
            <ArticleContent articleId={articleId} />
          </Suspense>
        </div>
      </div>
      
      <ArticleActions articleId={articleId} />
      
      <Suspense fallback={<CommentSkeleton />}>
        <CommentPanel articleId={articleId} />
      </Suspense>
    </>
  );
}
