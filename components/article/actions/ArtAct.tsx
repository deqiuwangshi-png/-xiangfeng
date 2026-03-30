'use client';

/**
 * 文章操作按钮组件
 *
 * @module components/article/ArtAct
 * @description 提供文章点赞、评论、分享、收藏功能
 */

import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Sparkles } from '@/components/icons';
import type { ArtActProps } from '@/types';
import { toggleArticleLike } from '@/lib/articles/actions/like';
import { toggleArticleBookmark } from '@/lib/articles/actions/bookmark';
import { RwMd } from '../rw/RwMd';
import { AuthorAvatar } from '../ui/AuthorAvatar';
import { MoreActions } from './MoreActions';
import { useArticleToast } from '@/hooks/article/useArticleToast';

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
  console.log('[点赞] ArtAct 渲染:', { articleId, initialLikeCount, initialLiked, currentUser: !!currentUser });

  {/* 使用 ref 标记是否已经用初始值初始化过 */}
  const isFirstRenderRef = useRef(true);

  {/* 状态 */}
  const [liked, setLiked] = useState(() => initialLiked);
  const [likeCount, setLikeCount] = useState(() => initialLikeCount);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(() => initialBookmarked);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [commentCount] = useState(() => initialCommentCount);
  const { showSuccess, showError, showNetworkError, showAuthRequired } = useArticleToast();

  {/* 只在真正的首次渲染时初始化，后续 props 变化不重置状态（除非文章ID变化） */}
  useEffect(() => {
    if (isFirstRenderRef.current) {
      console.log('[点赞] 首次渲染，初始化状态');
      setLiked(initialLiked);
      setLikeCount(initialLikeCount);
      setBookmarked(initialBookmarked);
      isFirstRenderRef.current = false;
    }
    {/* eslint-disable-next-line react-hooks/exhaustive-deps */}
  }, [articleId]); // 只有文章ID变化时才重新初始化

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
   * 2. 立即更新UI（乐观更新）
   * 3. 发送请求
   * 4. 成功时只同步状态，保持乐观更新的数字（避免触发器延迟问题）
   * 5. 失败时回滚
   */
  const handleLike = async () => {
    console.log('[点赞] handleLike 被调用，当前状态:', { liked, likeCount });

    if (!checkAuth()) return;

    const previousLiked = liked;
    const previousLikeCount = likeCount;

    const newLiked = !previousLiked;
    const newLikeCount = newLiked ? previousLikeCount + 1 : Math.max(0, previousLikeCount - 1);

    console.log('[点赞] 乐观更新:', { previousLiked, previousLikeCount, newLiked, newLikeCount });

    {/* 乐观更新：立即更新UI */}
    setLiked(newLiked);
    setLikeCount(newLikeCount);
    setIsLikeLoading(true);

    try {
      console.log('[点赞] 调用 Server Action:', articleId);
      const result = await toggleArticleLike(articleId);
      console.log('[点赞] Server Action 返回:', result);

      if (result.success) {
        console.log('[点赞] 操作成功，同步状态:', result.liked, '服务器点赞数:', result.likes);
        {/* 只同步状态，确保红心状态正确 */}
        setLiked(result.liked);
        {/* 打印服务器返回的点赞数用于验证数据库是否更新 */}
        console.log('[点赞] 数据库实际点赞数量:', result.likes);
      } else {
        console.log('[点赞] 操作失败，回滚状态:', result.error);
        {/* 失败时回滚 */}
        setLiked(previousLiked);
        setLikeCount(previousLikeCount);
        showError(result.error || '操作失败', '请稍后重试');
      }
    } catch (err) {
      console.error('[点赞] 发生异常:', err);
      {/* 异常时回滚 */}
      setLiked(previousLiked);
      setLikeCount(previousLikeCount);
      showNetworkError();
    } finally {
      setIsLikeLoading(false);
      console.log('[点赞] 操作完成，loading 状态重置');
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
    } catch {
      setBookmarked(previousBookmarked)
      showNetworkError()
    } finally {
      setIsBookmarkLoading(false)
    }
  }

  /**
   * 打开评论面板
   * 使用自定义事件触发，避免直接操作DOM
   */
  const handleCommentsClick = () => {
    window.dispatchEvent(new CustomEvent('open-comments-panel'));
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

      {/* 鼓励/打赏按钮 - 仅登录用户可见 */}
      {currentUser && (
        <div
          className="douyin-action-btn reward-btn"
          onClick={() => setShowRewardModal(true)}
          title="鼓励作者"
        >
          <Sparkles className="douyin-icon" />
          <span className="douyin-count">鼓励</span>
        </div>
      )}

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

      {/* 更多操作（分享、收藏、举报） - 仅登录用户可见 */}
      {currentUser && (
        <MoreActions
          articleId={articleId}
          authorId={authorId}
          currentUser={currentUser}
          initialBookmarked={bookmarked}
          onBookmark={handleBookmark}
          isBookmarkLoading={isBookmarkLoading}
        />
      )}

      {/* 打赏弹窗 - 仅登录用户可显示 */}
      {showRewardModal && currentUser && (
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
