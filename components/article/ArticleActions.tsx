'use client';

/**
 * ArticleActions - 文章操作按钮组件
 * 
 * 作用: 提供文章点赞、评论、分享、收藏功能
 * 
 * 优化点:
 * - 接收 currentUser 用于判断登录状态
 * - 未登录时提示登录
 * 
 * @returns {JSX.Element} 文章操作按钮组件
 */

import { useState } from 'react';
import { Heart, MessageCircle, Share2, Share, Bookmark, Link as LinkIcon } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

/**
 * ArticleActions Props 接口
 */
interface ArticleActionsProps {
  articleId: string;
  currentUser: User | null;
}

/**
 * 文章操作按钮组件
 * 
 * @function ArticleActions
 * @param {ArticleActionsProps} props - 组件属性
 * @returns {JSX.Element} 文章操作按钮组件
 * 
 * @description
 * 提供文章交互功能的完整实现：
 * - 点赞/取消点赞
 * - 打开评论面板
 * - 分享文章
 * - 收藏/取消收藏
 * - 根据登录状态启用/禁用功能
 */
export default function ArticleActions({ articleId, currentUser }: ArticleActionsProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(367);
  const [bookmarked, setBookmarked] = useState(false);
  const [shared, setShared] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [commentCount] = useState(42);

  /**
   * 检查用户是否登录
   * 
   * @returns 是否已登录
   */
  const checkAuth = () => {
    if (!currentUser) {
      alert('请先登录');
      return false;
    }
    return true;
  };

  /**
   * 处理点赞
   */
  const handleLike = async () => {
    if (!checkAuth()) return;

    try {
      const response = await fetch('/api/articles/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId }),
      });

      if (response.ok) {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Failed to like article:', error);
    }
  };

  /**
   * 处理收藏
   */
  const handleBookmark = async () => {
    if (!checkAuth()) return;

    try {
      const response = await fetch('/api/articles/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId }),
      });

      if (response.ok) {
        setBookmarked(!bookmarked);
      }
    } catch (error) {
      console.error('Failed to bookmark article:', error);
    }
  };

  /**
   * 处理分享
   * 
   * @param platform - 分享平台
   */
  const handleShare = (platform: string) => {
    setShared(true);
    setShowShareMenu(false);

    const url = window.location.href;

    switch (platform) {
      case 'wechat':
        console.log('Share to WeChat:', url);
        break;
      case 'weibo':
        console.log('Share to Weibo:', url);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }

    setTimeout(() => setShared(false), 500);
  };

  /**
   * 打开评论面板
   */
  const handleCommentsClick = () => {
    const commentPanel = document.querySelector('.comments-panel') as HTMLElement;
    const overlay = document.querySelector('.comments-overlay') as HTMLElement;
    
    if (commentPanel && overlay) {
      commentPanel.classList.add('active');
      overlay.classList.add('active');
      document.body.classList.add('comments-open', 'no-scroll');
    }
  };

  return (
    <div className="douyin-sidebar">
      {/* 点赞按钮 */}
      <div 
        className={`douyin-action-btn ${liked ? 'liked' : ''} ${!currentUser ? 'opacity-50' : ''}`}
        onClick={handleLike}
        title={currentUser ? '点赞' : '请先登录'}
      >
        <Heart className="douyin-icon" />
        <span className="douyin-count">{likeCount}</span>
      </div>

      {/* 评论按钮 */}
      <div 
        className="douyin-action-btn comments-btn"
        onClick={handleCommentsClick}
      >
        <MessageCircle className="douyin-icon" />
        <span className="douyin-count">{commentCount}</span>
      </div>

      {/* 分享按钮和菜单 */}
      <div className="share-menu-container">
        <div 
          className={`douyin-action-btn ${shared ? 'shared' : ''}`}
          onClick={() => setShowShareMenu(!showShareMenu)}
        >
          <Share2 className="douyin-icon" />
          <span className="douyin-count">分享</span>
        </div>

        {showShareMenu && (
          <div className="share-menu active">
            <div className="share-options">
              <div 
                className="share-option"
                onClick={() => handleShare('wechat')}
              >
                <MessageCircle className="share-icon" />
                <span>微信好友</span>
              </div>
              <div 
                className="share-option"
                onClick={() => handleShare('weibo')}
              >
                <Share className="share-icon" />
                <span>微博</span>
              </div>
              <div 
                className="share-option"
                onClick={() => handleShare('copy')}
              >
                <LinkIcon className="share-icon" />
                <span>复制链接</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 收藏按钮 */}
      <div 
        className={`douyin-action-btn ${bookmarked ? 'bookmarked' : ''} ${!currentUser ? 'opacity-50' : ''}`}
        onClick={handleBookmark}
        title={currentUser ? '收藏' : '请先登录'}
      >
        <Bookmark className="douyin-icon" />
        <span className="douyin-count">收藏</span>
      </div>
    </div>
  );
}
