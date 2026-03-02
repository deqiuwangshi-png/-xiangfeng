/* eslint-disable @next/next/no-img-element */
'use client';

/**
 * CommentPanel - 评论面板组件
 * 
 * 作用: 显示文章评论列表，支持发表评论
 * 
 * 优化点:
 * - 接收 initialComments 初始数据，减少白屏时间
 * - 接收 currentUser 用于判断登录状态和权限
 * - 支持乐观更新新评论
 * 
 * @returns {JSX.Element} 评论面板组件
 */

import { useState, useRef } from 'react';
import { X, Heart, CornerUpLeft, Send, MessageCircle } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

/**
 * 评论数据接口
 */
interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  created_at: string;
  likes: number;
  liked: boolean;
  replies?: Comment[];
}

/**
 * CommentPanel Props 接口
 */
interface CommentPanelProps {
  articleId: string;
  initialComments: Comment[];
  currentUser: User | null;
}

/**
 * 评论面板组件
 * 
 * @function CommentPanel
 * @param {CommentPanelProps} props - 组件属性
 * @returns {JSX.Element} 评论面板组件
 * 
 * @description
 * 提供评论功能的完整实现：
 * - 显示评论列表（使用初始数据）
 * - 支持发表评论（乐观更新）
 * - 支持点赞评论
 * - 响应式设计
 */
export default function CommentPanel({ 
  articleId, 
  initialComments,
  currentUser 
}: CommentPanelProps) {
  // ✅ 使用初始数据，无需 loading 状态
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const commentCount = comments.length;

  /**
   * 关闭评论面板
   */
  const handleClose = () => {
    const commentPanel = document.querySelector('.comments-panel') as HTMLElement;
    const overlay = document.querySelector('.comments-overlay') as HTMLElement;
    
    if (commentPanel && overlay) {
      commentPanel.classList.remove('active');
      overlay.classList.remove('active');
      document.body.classList.remove('comments-open', 'no-scroll');
    }
  };

  /**
   * 提交评论
   * 
   * @param e - 表单提交事件
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || sending || !currentUser) return;

    setSending(true);

    try {
      const response = await fetch('/api/articles/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          content: newComment,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // ✅ 乐观更新：立即显示新评论
        setComments(prev => [{
          ...data.comment,
          author: {
            id: currentUser.id,
            name: currentUser.user_metadata?.username || '用户',
            avatar: currentUser.user_metadata?.avatar_url,
          },
          liked: false,
        }, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSending(false);
    }
  };

  /**
   * 点赞/取消点赞评论
   * 
   * @param commentId - 评论ID
   */
  const handleLike = async (commentId: string) => {
    if (!currentUser) return;

    try {
      const response = await fetch('/api/articles/comment/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      });

      if (response.ok) {
        setComments(prev =>
          prev.map(comment =>
            comment.id === commentId
              ? {
                  ...comment,
                  liked: !comment.liked,
                  likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  /**
   * 获取用户名称首字母
   * 
   * @param name - 用户名称
   * @returns 首字母
   */
  const getInitials = (name: string) => {
    return name.slice(0, 2);
  };

  /**
   * 格式化时间显示
   * 
   * @param dateString - ISO 格式日期字符串
   * @returns 格式化后的时间文本
   */
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return '刚刚';
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
    return `${Math.floor(diff / 86400)}天前`;
  };

  return (
    <>
      <div className="comments-overlay" onClick={handleClose} />
      
      <div className="comments-panel">
        <div className="comments-header">
          <div className="comments-title">
            <span>评论</span>
            <span className="comments-count">{commentCount}</span>
          </div>
          <div className="close-comments" onClick={handleClose}>
            <X className="w-5 h-5" />
          </div>
        </div>

        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>还没有评论，快来发表第一条吧！</p>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar">
                  {comment.author.avatar ? (
                    <img 
                      src={comment.author.avatar} 
                      alt={comment.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(comment.author.name)
                  )}
                </div>
                
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author.name}</span>
                    <span className="comment-time">{formatTime(comment.created_at)}</span>
                  </div>
                  
                  <p className="comment-text">{comment.content}</p>
                  
                  <div className="comment-actions">
                    <div 
                      className={`comment-action ${comment.liked ? 'liked' : ''}`}
                      onClick={() => handleLike(comment.id)}
                    >
                      <Heart 
                        className={`w-4 h-4 ${comment.liked ? 'fill-current' : ''}`}
                      />
                      <span>{comment.likes}</span>
                    </div>
                    
                    <div className="comment-action">
                      <CornerUpLeft className="w-4 h-4" />
                      <span>回复</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <form className="comment-input-area" onSubmit={handleSubmit}>
          <div className="comment-input-wrapper">
            <textarea
              ref={textareaRef}
              className="comment-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={currentUser ? "写下你的评论..." : "请先登录后评论"}
              rows={1}
              maxLength={500}
              disabled={!currentUser}
            />
            <button 
              type="submit" 
              className="send-comment-btn"
              disabled={!newComment.trim() || sending || !currentUser}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="comment-char-count">
            {newComment.length}/500
          </div>
        </form>
      </div>
    </>
  );
}
