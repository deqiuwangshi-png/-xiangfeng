interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

interface Article {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  author: Author;
  publishedAt: string;
  readTime: number;
  tags: string[];
  coverImage?: string;
}

interface ArticleHeaderProps {
  article: Article;
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
