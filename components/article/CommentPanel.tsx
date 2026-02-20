'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Heart, CornerUpLeft, Send, MessageCircle } from 'lucide-react';

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  liked: boolean;
  replies?: Comment[];
}

interface CommentPanelProps {
  articleId: string;
}

export default function CommentPanel({ articleId }: CommentPanelProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [sending, setSending] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/articles/${articleId}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments);
          setCommentCount(data.total);
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [articleId]);

  const handleClose = () => {
    const commentPanel = document.querySelector('.comments-panel') as HTMLElement;
    const overlay = document.querySelector('.comments-overlay') as HTMLElement;
    
    if (commentPanel && overlay) {
      commentPanel.classList.remove('active');
      overlay.classList.remove('active');
      document.body.classList.remove('comments-open', 'no-scroll');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || sending) return;

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
        setComments(prev => [data.comment, ...prev]);
        setCommentCount(prev => prev + 1);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSending(false);
    }
  };

  const handleLike = async (commentId: string) => {
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

  const getInitials = (name: string) => {
    return name.slice(0, 2);
  };

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
          {loading ? (
            <div className="text-center text-gray-500 py-8">加载中...</div>
          ) : comments.length === 0 ? (
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
                    <span className="comment-time">{formatTime(comment.createdAt)}</span>
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
              placeholder="写下你的评论..."
              rows={1}
              maxLength={500}
            />
            <button 
              type="submit" 
              className="send-comment-btn"
              disabled={!newComment.trim() || sending}
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