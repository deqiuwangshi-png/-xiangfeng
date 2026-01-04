/**
 * 公开文章详情页
 * 展示单篇文章的详细内容，支持阅读模式和交互功能
 */

'use client';

import { useState, useEffect, use } from 'react';
import { Loader2 } from 'lucide-react';

// 导入API工具函数
import { get, formatError } from '@/lib/api';

// 导入文章组件
import { NavMinimal } from '@/components/article/NavMinimal';
import { ReadingProgress } from '@/components/article/ReadingProgress';
import { DouyinSidebar } from '@/components/article/DouyinSidebar';
import { ArticleContent } from '@/components/article/ArticleContent';
import { CommentsPanel } from '@/components/article/CommentsPanel';

// 定义文章类型
interface Article {
  id: string;
  title: string;
  author: string;
  authorTitle: string;
  readingTime: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 使用use钩子解析params Promise
  const { id } = use(params);
  
  // 状态管理
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0: 标准, 1: 大, 2: 特大
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  // 获取文章详情
  const fetchArticle = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 调用API获取文章详情
      const response = await get<Article>(`/articles/${id}`);

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setArticle(response.data);
      } else {
        throw new Error('文章不存在');
      }
    } catch (err) {
      setError(formatError(err));
      console.error('获取文章详情失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始化加载文章
  useEffect(() => {
    fetchArticle();
  }, [id]);

  // 字体大小调整
  const toggleFontSize = () => {
    setFontSizeLevel(prev => (prev + 1) % 3);
  };

  // 暗色模式切换
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    // 应用暗色模式到文档
    if (!isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // 评论面板切换
  const toggleComments = () => {
    setIsCommentsOpen(prev => !prev);
    // 控制页面滚动
    if (!isCommentsOpen) {
      document.body.classList.add('no-scroll');
      document.body.classList.add('comments-open');
    } else {
      document.body.classList.remove('no-scroll');
      document.body.classList.remove('comments-open');
    }
  };

  // 返回文章列表
  const handleBackToList = () => {
    window.location.href = '/explore/articles';
  };

  // 初始化暗色模式
  useEffect(() => {
    // 检查本地存储中的暗色模式设置
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }

    // 保存暗色模式设置
    return () => {
      localStorage.setItem('darkMode', isDarkMode.toString());
    };
  }, [isDarkMode]);

  return (
    <div className={`antialiased ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* 阅读进度条 */}
      {article && <ReadingProgress />}
      
      {/* 简洁导航栏 */}
      <NavMinimal 
        onToggleFontSize={toggleFontSize} 
        onToggleDarkMode={toggleDarkMode} 
        onClose={handleBackToList} 
      />
      
      {/* 主要内容区域 */}
      <div className="main-container pt-14 pb-6">
        {/* 加载状态 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="h-16 w-16 text-indigo-600 dark:text-indigo-400 animate-spin" />
            <span className="ml-4 text-gray-600 dark:text-gray-400 text-xl">加载文章中...</span>
          </div>
        ) : error ? (
          /* 错误提示 */
          <div className="max-w-3xl mx-auto text-center py-24">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">加载失败</h3>
            <p className="text-red-600 dark:text-red-400 font-medium mb-8">
              {error}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                onClick={() => fetchArticle()}
              >
                重试
              </button>
              <button
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={handleBackToList}
              >
                返回文章列表
              </button>
            </div>
          </div>
        ) : article ? (
          /* 文章内容 */
          <>
            {/* 抖音风格垂直功能栏 */}
            <DouyinSidebar 
              likeCount={article.likeCount || 367} 
              commentCount={article.commentCount || 42} 
              onToggleComments={toggleComments} 
            />
            
            {/* 文章主体 */}
            <ArticleContent 
              title={article.title} 
              author={article.author} 
              authorTitle={article.authorTitle} 
              readingTime={article.readingTime} 
              content={article.content} 
              fontSizeLevel={fontSizeLevel} 
              isDarkMode={isDarkMode} 
            />
          </>
        ) : null}
      </div>
      
      {/* 评论组件 */}
      <CommentsPanel 
        isOpen={isCommentsOpen} 
        onClose={toggleComments} 
        initialCommentCount={article?.commentCount || 42} 
      />
    </div>
  );
}