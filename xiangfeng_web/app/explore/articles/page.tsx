/**
 * 公开文章列表页
 * 展示所有公开可访问的文章，支持分页和搜索
 */

'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Search, Filter, Calendar, BookOpen, Loader2 } from 'lucide-react';

// 导入API工具函数
import { get, formatError } from '@/lib/api';

// 定义文章类型
interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorTitle: string;
  readingTime: string;
  publishDate: string;
  category: string;
  imageUrl?: string;
  likeCount: number;
  commentCount: number;
}

// 定义API响应类型
interface ArticlesApiResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
}

export default function ArticlesPage() {
  // 状态管理
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalArticles, setTotalArticles] = useState(0);

  // 分页配置
  const articlesPerPage = 8;
  const totalPages = Math.ceil(totalArticles / articlesPerPage);

  // 分类列表
  const categories = Array.from(new Set(articles.map(article => article.category)));

  // 获取文章列表
  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 构建查询参数
      const params = {
        page: currentPage.toString(),
        limit: articlesPerPage.toString(),
        search: searchTerm,
        category: filterCategory || '',
      };

      // 移除空参数
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== '')
      );

      // 调用API获取文章列表
      const response = await get<ArticlesApiResponse>('/articles', filteredParams);

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setArticles(response.data.articles || []);
        setTotalArticles(response.data.total || 0);
      }
    } catch (err) {
      setError(formatError(err));
      console.error('获取文章列表失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载和参数变化时重新加载
  useEffect(() => {
    fetchArticles();
  }, [currentPage, searchTerm, filterCategory]);

  // 处理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // 处理文章点击
  const handleArticleClick = (id: string) => {
    window.location.href = `/explore/articles/${id}`;
  };

  // 处理页面变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* 页面头部 */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo和标题 */}
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
              深度阅读
            </h1>
          </div>

          {/* 搜索和筛选 */}
          <div className="flex items-center space-x-3">
            {/* 搜索表单 */}
            <form 
              onSubmit={handleSearchSubmit} 
              className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-64' : 'w-40'}`}
            >
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="搜索文章..."
                  className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* 筛选按钮 */}
            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 页面标题和描述 */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            精选文章
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            探索深度思考的世界，发现有价值的观点和洞察
          </p>
        </div>

        {/* 分类筛选 */}
        <div className="flex justify-center mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${!filterCategory ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => setFilterCategory('')}
            >
              全部
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filterCategory === category ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                onClick={() => setFilterCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 text-center">
            <p className="text-red-600 dark:text-red-400 font-medium">
              {error}
            </p>
            <button
              className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              onClick={() => fetchArticles()}
            >
              重试
            </button>
          </div>
        )}

        {/* 加载状态 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-12 w-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
            <span className="ml-3 text-gray-600 dark:text-gray-400 text-lg">加载中...</span>
          </div>
        ) : (
          /* 文章列表 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {articles.map(article => (
              <article
                key={article.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-700"
                onClick={() => handleArticleClick(article.id)}
              >
                <div className="p-6">
                  {/* 分类标签 */}
                  <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-medium mb-3">
                    {article.category}
                  </div>
                  
                  {/* 标题 */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  {/* 摘要 */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  {/* 元信息 */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        <span>{article.author}</span>
                      </div>
                      <span>{article.readingTime}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <ArrowRight className="h-4 w-4 mr-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 无结果提示 */}
        {!isLoading && articles.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              没有找到匹配的文章
            </p>
            <button
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('');
                setCurrentPage(1);
              }}
            >
              重置筛选条件
            </button>
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && !isLoading && (
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                上一页
              </button>
              
              {/* 页码范围计算 */}
              {(() => {
                const startPage = Math.max(1, currentPage - 2);
                const endPage = Math.min(totalPages, startPage + 4);
                const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
                
                return (
                  <>
                    {/* 显示第一页 */}
                    {startPage > 1 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className="px-4 py-2 rounded-md text-sm font-medium transition-all bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          1
                        </button>
                        {startPage > 2 && <span className="px-2 py-2 text-gray-500 dark:text-gray-400">...</span>}
                      </>
                    )}
                    
                    {/* 显示当前页码范围 */}
                    {pages.map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currentPage === page ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    {/* 显示最后一页 */}
                    {endPage < totalPages && (
                      <>
                        {endPage < totalPages - 1 && <span className="px-2 py-2 text-gray-500 dark:text-gray-400">...</span>}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="px-4 py-2 rounded-md text-sm font-medium transition-all bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </>
                );
              })()}
              
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
            <p>© 2024 深度阅读. 保留所有权利.</p>
            <p className="mt-2">探索深度思考的世界</p>
          </div>
        </div>
      </footer>
    </div>
  );
}