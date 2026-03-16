'use client';

/**
 * 文章操作按钮组件
 *
 * @module components/article/ArtAct
 * @description 提供文章点赞、评论、分享、收藏功能
 */

import { useState } from 'react';
import { Heart, MessageCircle, Sparkles } from '@/components/icons';
import type { ArtActProps } from '@/types';
import { toggleArticleLike } from '@/lib/articles/actions/like';
import { toggleArticleBookmark } from '@/lib/articles/actions/bookmark';
import { RwMd } from './rw/RwMd';
import { AuthorAvatar } from './AuthorAvatar';
import { MoreActions } from './MoreActions';
import { useArticleToast } from '@/hooks/useArticleToast';

/**
 * 文章操作按钮组件
 *
 * @param {ArtActProps} props - 组件属性
 * @returns {JSX.Element} 文章操作按钮组件
 */
export default function ArtAct({
  articleId,
  authorId,
  authorName,
  authorAvatar,
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
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [commentCount] = useState(initialCommentCount);
  const { showSuccess, showError, showNetworkError, showAuthRequired } = useArticleToast();

  /**
   * 检查用户是否登录
   *
   * @returns {boolean} 是否已登录
   */
  const checkAuth = () => {
    if (!currentUser) {
      showAuthRequired('进行此操作')
      return false
    }
    return true
  }

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
        showError(result.error || '操作失败', '请稍后重试');
      }
    } catch (error) {
      setLiked(previousLiked);
      setLikeCount(previousLikeCount);
      console.error('Failed to like article:', error);
      showNetworkError();
    } finally {
      setIsLikeLoading(false);
    }
  };

  /**
   * 处理收藏
   */
  const handleBookmark = async () => {
    if (!currentUser) {
      showAuthRequired('收藏文章')
      return
    }

    setIsBookmarkLoading(true)
    const previousBookmarked = bookmarked
    setBookmarked(!bookmarked)

    try {
      const result = await toggleArticleBookmark(articleId)

      if (result.success) {
        setBookmarked(result.favorited)
        showSuccess('收藏', !result.favorited)
      } else {
        setBookmarked(previousBookmarked)
        showError(result.error || '操作失败', '请稍后重试')
      }
    } catch (error) {
      setBookmarked(previousBookmarked)
      console.error('Failed to bookmark article:', error)
      showNetworkError()
    } finally {
      setIsBookmarkLoading(false)
    }
  }

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
      {/* 作者头像+关注按钮 */}
      <AuthorAvatar
        articleId={articleId}
        authorId={authorId}
        authorName={authorName}
        authorAvatar={authorAvatar}
        currentUser={currentUser}
      />

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

      {/* 更多操作（分享、收藏、举报） */}
      <MoreActions
        articleId={articleId}
        authorId={authorId}
        currentUser={currentUser}
        initialBookmarked={bookmarked}
        onBookmark={handleBookmark}
        isBookmarkLoading={isBookmarkLoading}
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
