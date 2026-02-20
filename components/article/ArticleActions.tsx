'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, Share, Bookmark, Link as LinkIcon } from 'lucide-react';

interface ArticleActionsProps {
  articleId: string;
}

export default function ArticleActions({ articleId }: ArticleActionsProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(367);
  const [bookmarked, setBookmarked] = useState(false);
  const [shared, setShared] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [commentCount] = useState(42);

  const handleLike = async () => {
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

  const handleBookmark = async () => {
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
        className={`douyin-action-btn ${liked ? 'liked' : ''}`}
        onClick={handleLike}
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
        className={`douyin-action-btn ${bookmarked ? 'bookmarked' : ''}`}
        onClick={handleBookmark}
      >
        <Bookmark className="douyin-icon" />
        <span className="douyin-count">收藏</span>
      </div>
    </div>
  );
}
