/**
 * 抖音风格垂直功能栏组件
 * 包含点赞、评论、分享、收藏功能
 */

'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { ShareMenu } from './ShareMenu';

interface DouyinSidebarProps {
  likeCount: number;
  commentCount: number;
  onToggleComments: () => void;
}

export function DouyinSidebar({ likeCount, commentCount, onToggleComments }: DouyinSidebarProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setCurrentLikeCount(isLiked ? currentLikeCount - 1 : currentLikeCount + 1);
    // 这里可以添加点赞API调用
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // 这里可以添加收藏API调用
  };

  const toggleShareMenu = () => {
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  return (
    <div className="douyin-sidebar" id="douyinSidebar">
      {/* 点赞按钮 */}
      <div 
        className={`douyin-action-btn ${isLiked ? 'liked active' : ''}`} 
        id="douyinLikeBtn" 
        onClick={toggleLike}
      >
        <Heart className="douyin-icon" fill={isLiked ? '#FF2442' : 'none'} />
        <span className="douyin-count" id="douyinLikeCount">{currentLikeCount}</span>
      </div>
      
      {/* 评论按钮 */}
      <div 
        className="douyin-action-btn comments-btn" 
        onClick={onToggleComments}
      >
        <MessageCircle className="douyin-icon" />
        <span className="douyin-count" id="douyinCommentCount">{commentCount}</span>
      </div>
      
      {/* 分享按钮和菜单容器 */}
      <div className="share-menu-container">
        <div 
          className={`douyin-action-btn ${isShareMenuOpen ? 'shared' : ''}`} 
          id="douyinShareBtn" 
          onClick={toggleShareMenu}
        >
          <Share2 className="douyin-icon" />
          <span className="douyin-count">分享</span>
        </div>
        
        {/* 分享菜单 */}
        <ShareMenu isOpen={isShareMenuOpen} onClose={() => setIsShareMenuOpen(false)} />
      </div>
      
      {/* 收藏按钮 */}
      <div 
        className={`douyin-action-btn ${isBookmarked ? 'bookmarked' : ''}`} 
        id="douyinBookmarkBtn" 
        onClick={toggleBookmark}
      >
        <Bookmark className="douyin-icon" fill={isBookmarked ? '#FF9800' : 'none'} />
        <span className="douyin-count">收藏</span>
      </div>
    </div>
  );
}
