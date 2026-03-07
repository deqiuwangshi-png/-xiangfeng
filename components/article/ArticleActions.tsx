'use client';

/**
 * ArticleActions - 文章操作按钮组件
 *
 * 作用: 提供文章点赞、评论、分享、收藏功能
 *
 * 优化点:
 * - 接收 currentUser 用于判断登录状态
 * - 未登录时提示登录
 * - 使用 Server Actions 替代 API Routes
 *
 * @returns {JSX.Element} 文章操作按钮组件
 */

import { useState } from 'react';
import { Heart, MessageCircle, Share2, Share, Bookmark, Link as LinkIcon } from '@/components/icons';
import { X } from '@/components/icons';
import type { User } from '@supabase/supabase-js';
import { toggleArticleLike } from '@/lib/articles/actions/like';
import { toggleArticleBookmark } from '@/lib/articles/actions/bookmark';

/**
 * ArticleActions Props 接口
 */
interface ArticleActionsProps {
  articleId: string;
  currentUser: User | null;
  initialLikeCount?: number;
  initialCommentCount?: number;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
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
export default function ArticleActions({ 
  articleId, 
  currentUser,
  initialLikeCount = 0,
  initialCommentCount = 0,
  initialLiked = false,
  initialBookmarked = false,
}: ArticleActionsProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [shared, setShared] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [commentCount] = useState(initialCommentCount);

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
   * 使用 Server Action 替代 API Route
   */
  const handleLike = async () => {
    if (!checkAuth()) return;

    // 设置加载状态，防止重复点击
    setIsLikeLoading(true);

    try {
      const result = await toggleArticleLike(articleId);

      if (result.success) {
        // 使用服务器返回的最新数据（数据库是单一真理源）
        setLiked(result.liked);
        setLikeCount(result.likes);
      } else {
        alert(result.error || '操作失败，请重试');
      }
    } catch (error) {
      console.error('Failed to like article:', error);
      alert('网络错误，请检查网络连接');
    } finally {
      setIsLikeLoading(false);
    }
  };

  /**
   * 处理收藏
   * 使用 Server Action 替代 API Route，保持乐观更新
   */
  const handleBookmark = async () => {
    if (!checkAuth()) return;

    // 保存当前状态（用于失败回滚）
    const previousBookmarked = bookmarked;

    // 乐观更新：立即更新 UI
    setBookmarked(!bookmarked);

    try {
      const result = await toggleArticleBookmark(articleId);

      if (result.success) {
        // 使用服务器返回的最新数据
        setBookmarked(result.favorited);
      } else {
        // 请求失败，回滚状态
        setBookmarked(previousBookmarked);
        alert(result.error || '操作失败，请重试');
      }
    } catch (error) {
      // 网络错误，回滚状态
      setBookmarked(previousBookmarked);
      console.error('Failed to bookmark article:', error);
      alert('网络错误，请检查网络连接');
    }
  };

  /**
   * 处理分享
   *
   * @param platform - 分享平台
   */
  const handleShare = (platform: string) => {
    const url = window.location.href;

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 500);
        break;
    }
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
        className={`douyin-action-btn ${liked ? 'liked' : ''} ${!currentUser || isLikeLoading ? 'opacity-50' : ''}`}
        onClick={!isLikeLoading ? handleLike : undefined}
        title={currentUser ? (isLikeLoading ? '处理中...' : '点赞') : '请先登录'}
      >
        <Heart className={`douyin-icon ${isLikeLoading ? 'animate-pulse' : ''}`} />
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

      {/* 分享按钮 */}
      <div className="share-menu-container">
        <div
          className={`douyin-action-btn ${shared ? 'shared' : ''}`}
          onClick={() => setShowShareMenu(true)}
        >
          <Share2 className="douyin-icon" />
          <span className="douyin-count">分享</span>
        </div>

        {/* 分享弹窗 */}
        {showShareMenu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 遮罩层 - 仅视觉，不响应点击 */}
            <div className="absolute inset-0 bg-black/50" />

            {/* 弹窗内容 */}
            <div className="relative bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl">
              {/* 关闭按钮 */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={() => setShowShareMenu(false)}
              >
                <X className="w-5 h-5" />
              </button>

              {/* 标题 */}
              <h3 className="text-lg font-medium text-center text-gray-900 mb-6">
                分享到
              </h3>

              {/* 分享选项 */}
              <div className="flex justify-center gap-8">
                {/* 微信 - 占位禁用 */}
                <div className="flex flex-col items-center gap-2 opacity-40 cursor-not-allowed">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-sm text-gray-600">微信好友</span>
                </div>

                {/* 微博 - 占位禁用 */}
                <div className="flex flex-col items-center gap-2 opacity-40 cursor-not-allowed">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Share className="w-6 h-6 text-red-500" />
                  </div>
                  <span className="text-sm text-gray-600">微博</span>
                </div>

                {/* 复制链接 - 可用 */}
                <button
                  className="flex flex-col items-center gap-2 hover:opacity-80 transition"
                  onClick={() => {
                    handleShare('copy')
                    setShowShareMenu(false)
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <LinkIcon className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-sm text-gray-600">复制链接</span>
                </button>
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
