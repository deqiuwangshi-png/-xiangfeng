import { getMockArticle } from './mockArticles';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  publishedAt: string;
  readTime: number;
  tags: string[];
  coverImage?: string;
  likes: number;
  comments: number;
}

/**
 * 是否使用模拟数据
 * @description 开发环境默认使用模拟数据，生产环境使用真实API
 */
const USE_MOCK_DATA = process.env.NODE_ENV === 'development';

export async function fetchArticle(articleId: string): Promise<Article | null> {
  if (USE_MOCK_DATA) {
    return getMockArticle(articleId);
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch article:', error);
    return null;
  }
}

export async function fetchArticleContent(articleId: string): Promise<string> {
  if (USE_MOCK_DATA) {
    const article = getMockArticle(articleId);
    return article?.content || '';
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}/content`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch article content');
    }
    
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Failed to fetch article content:', error);
    return '';
  }
}

export async function fetchArticleComments(articleId: string) {
  if (USE_MOCK_DATA) {
    const article = getMockArticle(articleId);
    return {
      comments: [
        {
          id: '1',
          articleId: articleId,
          author: {
            id: 'user-5',
            name: '张三',
            avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=zhangsan&backgroundColor=E1E4EA',
          },
          content: '这篇文章非常有启发性！特别是关于第一性原理的部分，让我对思考方法有了新的认识。',
          createdAt: '2024-01-16T08:30:00Z',
          likes: 12,
          replies: [
            {
              id: '1-1',
              author: {
                id: 'user-6',
                name: '山中答问',
                avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=author1&backgroundColor=E1E4EA',
              },
              content: '感谢你的反馈！很高兴这篇文章对你有帮助。',
              createdAt: '2024-01-16T09:15:00Z',
              likes: 3,
            },
          ],
        },
        {
          id: '2',
          articleId: articleId,
          author: {
            id: 'user-7',
            name: '李四',
            avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=lisi&backgroundColor=E1E4EA',
          },
          content: '请问在实际应用中，如何平衡第一性原理和经验知识？',
          createdAt: '2024-01-16T10:45:00Z',
          likes: 8,
          replies: [],
        },
        {
          id: '3',
          articleId: articleId,
          author: {
            id: 'user-8',
            name: '王五',
            avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=wangwu&backgroundColor=E1E4EA',
          },
          content: '期待看到更多关于认知科学的内容！',
          createdAt: '2024-01-16T14:20:00Z',
          likes: 5,
          replies: [],
        },
      ],
      total: article?.comments || 0,
    };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}/comments`, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return { comments: [], total: 0 };
  }
}
