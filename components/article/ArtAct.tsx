'use client';

/**
 * 文章操作按钮组件
 *
 * @module components/article/ArtAct
 * @description 提供文章点赞、评论、分享、收藏功能
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { Heart, MessageCircle, Share2, Share, Bookmark, Link as LinkIcon, Sparkles, X } from '@/components/icons';
import type { User } from '@supabase/supabase-js';
import { toggleArticleLike } from '@/lib/articles/actions/like';
import { toggleArticleBookmark } from '@/lib/articles/actions/bookmark';
import { RwMd } from './rw/RwMd';
import { ReportBtn } from './ReportBtn';

/**
 * ArtAct Props 接口
 */
interface ArtActProps {
  /** 文章ID */
  articleId: string;
  /** 作者ID */
  authorId: string;
  /** 当前用户 */
  currentUser: User | null;
  /** 初始点赞数 */
  initialLikeCount?: number;
  /** 初始评论数 */
  initialCommentCount?: number;
  /** 初始点赞状态 */
  initialLiked?: boolean;
  /** 初始收藏状态 */
  initialBookmarked?: boolean;
}

/**
 * 文章操作按钮组件
 *
 * @param {ArtActProps} props - 组件属性
 * @returns {JSX.Element} 文章操作按钮组件
 */
export default function ArtAct({
  articleId,
  authorId,
  currentUser,
  initialLikeCount = 0,
  initialCommentCount = 0,
  initialLiked = false,
  initialBookmarked = false,
}: ArtActProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [shared, setShared] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [commentCount] = useState(initialCommentCount);

  /**
   * 检查用户是否登录
   *
   * @returns {boolean} 是否已登录
   */
  const checkAuth = () => {
    if (!currentUser) {
      toast.error('请先登录');
      return false;
    }
    return true;
  };

  /**
   * 处理点赞（乐观更新）
   * 1. 先保存当前状态用于回滚
   * 2. 立即更新UI
   * 3. 发送请求
   * 4. 成功时保持乐观更新结果，不覆盖（避免触发器延迟问题）
   * 5. 失败时回滚
   */
  const handleLike = async () => {
    if (!checkAuth()) return;

    const previousLiked = liked;
    const previousLikeCount = likeCount;

    const newLiked = !previousLiked;
    const newLikeCount = newLiked ? previousLikeCount + 1 : Math.max(0, previousLikeCount - 1);

    setLiked(newLiked);
    setLikeCount(newLikeCount);
    setIsLikeLoading(true);

    try {
      const result = await toggleArticleLike(articleId);

      if (!result.success) {
        setLiked(previousLiked);
        setLikeCount(previousLikeCount);
        toast.error(result.error || '操作失败，请重试');
      }
    } catch (error) {
      setLiked(previousLiked);
      setLikeCount(previousLikeCount);
      console.error('Failed to like article:', error);
      toast.error('网络错误，请检查网络连接');
    } finally {
      setIsLikeLoading(false);
    }
  };

  /**
   * 处理收藏
   */
  const handleBookmark = async () => {
    if (!checkAuth()) return;

    const previousBookmarked = bookmarked;
    setBookmarked(!bookmarked);

    try {
      const result = await toggleArticleBookmark(articleId);

      if (result.success) {
        setBookmarked(result.favorited);
      } else {
        setBookmarked(previousBookmarked);
        toast.error(result.error || '操作失败，请重试');
      }
    } catch (error) {
      setBookmarked(previousBookmarked);
      console.error('Failed to bookmark article:', error);
      toast.error('网络错误，请检查网络连接');
    }
  };

  /**
   * 处理分享
   *
   * @param {string} platform - 分享平台
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
      {/* 鼓励/打赏按钮 */}
      <div
        className="douyin-action-btn reward-btn"
        onClick={() => setShowRewardModal(true)}
        title="鼓励作者"
      >
        <Sparkles className="douyin-icon" />
        <span className="douyin-count">鼓励</span>
      </div>

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
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={() => setShowShareMenu(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-6">
                分享到
              </h3>
              <div className="flex justify-center gap-8">
                <div className="flex flex-col items-center gap-2 opacity-40 cursor-not-allowed">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-sm text-gray-600">微信好友</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-40 cursor-not-allowed">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Share className="w-6 h-6 text-red-500" />
                  </div>
                  <span className="text-sm text-gray-600">微博</span>
                </div>
                <button
                  className="flex flex-col items-center gap-2 hover:opacity-80 transition"
                  onClick={() => {
                    handleShare('copy');
                    setShowShareMenu(false);
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

      {/* 举报按钮 */}
      <ReportBtn
        articleId={articleId}
        authorId={authorId}
        currentUser={currentUser}
      />

      {/* 打赏弹窗 */}
      {showRewardModal && (
        <RwMd
          articleId={articleId}
          authorId={authorId}
          onClose={() => setShowRewardModal(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
