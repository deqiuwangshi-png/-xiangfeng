/**
 * 侧边弹出式评论面板组件
 * 包含评论列表和评论发布功能
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Send, Heart, Reply } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likeCount: number;
  isLiked: boolean;
}

interface CommentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialCommentCount: number;
}

export function CommentsPanel({ isOpen, onClose, initialCommentCount }: CommentsPanelProps) {
  // 直接初始化评论数据，避免useEffect导致的Hydration不匹配
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: '张三',
      avatar: '',
      content: '非常有深度的文章，让我对深度思考有了新的理解。',
      timestamp: '2小时前',
      likeCount: 5,
      isLiked: false
    },
    {
      id: '2',
      author: '李四',
      avatar: '',
      content: '第一性原理思维确实是解决复杂问题的有效方法。',
      timestamp: '5小时前',
      likeCount: 3,
      isLiked: false
    },
    {
      id: '3',
      author: '王五',
      avatar: '',
      content: '文章结构清晰，案例丰富，很受启发。',
      timestamp: '1天前',
      likeCount: 8,
      isLiked: true
    }
  ]);
  
  const [commentInput, setCommentInput] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // 点赞动画处理
  const handleLikeAnimation = (commentId: string) => {
    setLikedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // 加载更多评论
  const loadMoreComments = () => {
    if (isLoadingMore || !hasMoreComments) return;
    
    setIsLoadingMore(true);
    
    // 模拟API请求
    setTimeout(() => {
      // 生成模拟评论
      const newComments: Comment[] = [
        {
          id: Date.now().toString(),
          author: '新用户' + Math.floor(Math.random() * 1000),
          avatar: '',
          content: '这是一条加载更多的评论，用于测试分页功能。',
          timestamp: '3小时前',
          likeCount: Math.floor(Math.random() * 20),
          isLiked: false
        },
        {
          id: (Date.now() + 1).toString(),
          author: '新用户' + Math.floor(Math.random() * 1000),
          avatar: '',
          content: '感谢分享，让我受益匪浅。',
          timestamp: '4小时前',
          likeCount: Math.floor(Math.random() * 20),
          isLiked: false
        }
      ];
      
      setComments(prev => [...prev, ...newComments]);
      setIsLoadingMore(false);
      
      // 模拟没有更多评论的情况
      if (comments.length + newComments.length >= 10) {
        setHasMoreComments(false);
      }
    }, 1000);
  };

  // 移除useEffect初始化，直接在useState中设置评论数据

  // 滚动到底部
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  // 点击遮罩层关闭评论面板
  const handleOverlayClick = () => {
    onClose();
  };

  // 处理评论输入
  const handleCommentInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCommentInput(value);
    setCharCount(value.length);
  };

  // 发送评论
  const sendComment = () => {
    if (!commentInput.trim() || charCount > 500) return;

    setIsSubmitting(true);
    
    // 模拟API请求
    setTimeout(() => {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: '当前用户',
        avatar: 'https://ui-avatars.com/api/?name=当前用户&background=6A5B8A&color=fff',
        content: commentInput.trim(),
        timestamp: '刚刚',
        likeCount: 0,
        isLiked: false
      };
      
      setComments(prev => [...prev, newComment]);
      setCommentInput('');
      setCharCount(0);
      setIsSubmitting(false);
    }, 500);
  };

  // 切换点赞状态
  const toggleLikeComment = (commentId: string) => {
    // 触发点赞动画
    handleLikeAnimation(commentId);
    
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likeCount: comment.isLiked ? comment.likeCount - 1 : comment.likeCount + 1
        };
      }
      return comment;
    }));
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendComment();
    }
  };

  return (
    <>
      {/* 遮罩层 */}
      <div 
        className={`comments-overlay ${isOpen ? 'active' : ''}`} 
        id="commentsOverlay" 
        onClick={handleOverlayClick}
      ></div>
      
      {/* 评论面板 */}
      <div 
        className={`comments-panel ${isOpen ? 'active' : ''}`} 
        id="commentsPanel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="comments-header">
          <div className="comments-title">
            <span>评论</span>
            <span className="comments-count" id="commentsCount">{initialCommentCount}</span>
          </div>
          <div className="close-comments" onClick={onClose}>
            <X className="w-5 h-5" />
          </div>
        </div>
        
        <div className="comments-list" id="commentsList">
          {comments.length > 0 ? (
            <>
              {comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-avatar">
                    {/* 使用渐变色背景替代图片 */}
                    <span className="text-white font-weight-600 text-1.1rem">
                      {comment.author.charAt(0)}
                    </span>
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-time">{comment.timestamp}</span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                    <div className="comment-actions">
                      <div 
                        className={`comment-action ${comment.isLiked ? 'liked' : ''} ${likedIds.has(comment.id) ? 'liked-animating' : ''}`} 
                        onClick={() => toggleLikeComment(comment.id)}
                      >
                        <Heart 
                          className="comment-action-icon" 
                          fill={comment.isLiked ? '#FF2442' : 'none'} 
                        />
                        <span>{comment.likeCount}</span>
                      </div>
                      <div className="comment-action">
                        <Reply className="comment-action-icon" />
                        <span>回复</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 加载更多评论 */}
              {hasMoreComments && (
                <div className="load-more-comments" onClick={loadMoreComments}>
                  {isLoadingMore ? '加载中...' : '加载更多评论'}
                </div>
              )}
              
              <div ref={commentsEndRef} />
            </>
          ) : (
            <div className="comments-empty">
              <MessageCircle className="comments-empty-icon" />
              <p className="mt-2">还没有评论，快来抢沙发吧！</p>
            </div>
          )}
        </div>
        
        <div className="comment-input-area">
          <div className="comment-input-wrapper">
            <textarea 
              className="comment-input" 
              id="commentInput" 
              placeholder="写下你的评论..." 
              rows={1}
              maxLength={500}
              value={commentInput}
              onChange={handleCommentInput}
              onKeyDown={handleKeyDown}
            ></textarea>
            <span 
              className={`comment-char-count ${charCount > 450 ? 'warning' : ''} ${charCount > 500 ? 'error' : ''}`} 
              id="charCount"
            >
              {charCount}/500
            </span>
            <button 
              className={`send-comment-btn ${isSubmitting ? 'debouncing' : ''}`} 
              id="sendCommentBtn" 
              onClick={sendComment} 
              disabled={!commentInput.trim() || isSubmitting || charCount > 500}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
