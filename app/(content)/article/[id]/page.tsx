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
import '@/styles/article.css';

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

function buildSafePreviewContent(content: string, maxLength: number = 1200): string {
  // 保留HTML标签，只截断文本内容
  let currentLength = 0;
  let result = '';
  let inTag = false;
  let tagBuffer = '';
  let textBuffer = '';
  const tagStack: string[] = [];

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    // 处理标签
    if (char === '<') {
      // 先处理累积的文本
      if (textBuffer) {
        const remaining = maxLength - currentLength;
        if (remaining <= 0) break;

        if (textBuffer.length <= remaining) {
          result += textBuffer;
          currentLength += textBuffer.length;
        } else {
          // 需要截断文本
          let truncatedText = textBuffer.slice(0, remaining);

          // 在语义边界截断（句号、逗号）
          const lastPeriod = truncatedText.lastIndexOf('。');
          const lastComma = truncatedText.lastIndexOf('，');
          const boundaryIndex = Math.max(lastPeriod, lastComma);

          if (boundaryIndex > remaining * 0.5) {
            truncatedText = truncatedText.slice(0, boundaryIndex + 1);
          }

          result += truncatedText;
          currentLength += truncatedText.length;

          // 关闭所有未闭合的标签
          while (tagStack.length > 0) {
            const tag = tagStack.pop();
            if (tag && !tag.includes('/')) {
              result += `</${tag}>`;
            }
          }
          break;
        }
        textBuffer = '';
      }

      inTag = true;
      tagBuffer = char;
      continue;
    }

    if (inTag) {
      tagBuffer += char;

      if (char === '>') {
        inTag = false;
        result += tagBuffer;

        // 处理标签栈
        const tagMatch = tagBuffer.match(/<\/?([a-z0-9]+)[^>]*>/i);
        if (tagMatch) {
          const tagName = tagMatch[1].toLowerCase();
          if (tagBuffer.startsWith('</')) {
            // 结束标签
            const lastIndex = tagStack.lastIndexOf(tagName);
            if (lastIndex !== -1) {
              tagStack.splice(lastIndex, 1);
            }
          } else if (!tagBuffer.endsWith('/>') && !tagBuffer.includes('br')) {
            // 开始标签（非自闭合）
            tagStack.push(tagName);
          }
        }

        tagBuffer = '';
      }
      continue;
    }

    // 累积文本
    textBuffer += char;
  }

  // 处理剩余的文本
  if (textBuffer && currentLength < maxLength) {
    const remaining = maxLength - currentLength;
    result += textBuffer.slice(0, remaining);
  }

  // 关闭所有未闭合的标签
  while (tagStack.length > 0) {
    const tag = tagStack.pop();
    if (tag && !tag.includes('/')) {
      result += `</${tag}>`;
    }
  }

  return result;
}

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
              previewContent={buildSafePreviewContent(article.content)}
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
