/**
 * 文章内容展示组件
 * 支持阅读模式，包含文章标题、元信息和正文内容
 */

'use client';

import { useEffect, useState } from 'react';

interface ArticleContentProps {
  title: string;
  author: string;
  authorTitle: string;
  readingTime: string;
  content: string;
  fontSizeLevel: number;
  isDarkMode: boolean;
}

export function ArticleContent({ 
  title, 
  author, 
  authorTitle, 
  readingTime, 
  content, 
  fontSizeLevel, 
  isDarkMode 
}: ArticleContentProps) {
  // 根据字体大小级别设置对应的CSS类
  const getFontSizeClass = () => {
    switch (fontSizeLevel) {
      case 0: return 'text-base';
      case 1: return 'text-lg';
      case 2: return 'text-xl';
      default: return 'text-lg';
    }
  };

  return (
    <div className="article-container">
      {/* 文章标题区域 - 匹配HTML草图设计 */}
      <div className="mb-8">
        <h1 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-xf-dark'} mb-4 leading-tight tracking-tight`}>
          {title}
        </h1>
        
        <div className={`article-meta flex items-center gap-4 text-sm ${isDarkMode ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-200'} pb-4 border-b`}>
          <span className="font-medium">{author}</span>
          <span className="text-gray-500">•</span>
          <span>{authorTitle}</span>
          <span className="text-gray-500">•</span>
          <span>{readingTime}</span>
        </div>
      </div>
      
      {/* 文章正文 - 使用HTML草图的阅读模式样式 */}
      <div className={`reading-mode ${getFontSizeClass()} ${isDarkMode ? 'dark-mode' : ''}`} dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
