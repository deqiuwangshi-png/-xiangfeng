'use client';

import { useEffect, useState } from 'react';

interface ArticleContentProps {
  articleId: string;
}

export default function ArticleContent({ articleId }: ArticleContentProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/articles/${articleId}`);
        if (response.ok) {
          const data = await response.json();
          setContent(data.content);
        }
      } catch (error) {
        console.error('Failed to fetch article content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [articleId]);

  if (loading) {
    return <div className="reading-mode">加载中...</div>;
  }

  return (
    <div 
      className="reading-mode"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
