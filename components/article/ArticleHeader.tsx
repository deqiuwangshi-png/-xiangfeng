import { ArticleWithAuthor } from '@/lib/articles/articleQueries';

/**
 * ArticleHeader Props 接口
 */
interface ArticleHeaderProps {
  article: ArticleWithAuthor;
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{article.title}</h1>
      
      <div className="article-meta">
        <span className="mr-3">{article.author.name} · {article.author.bio || ''}</span>
        <span>约{article.readTime}分钟阅读</span>
      </div>
    </div>
  );
}
