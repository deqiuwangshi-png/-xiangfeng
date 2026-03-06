'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, MessageSquare, Calendar, Tag, User, Send, Loader2 } from 'lucide-react';
import { getFeedbackReplies, submitReply } from '@/lib/feedback/feedbackActions';

type FeedbackStatus = 'pending' | 'processing' | 'completed';

interface Reply {
  id: string;
  author: string;
  content: string;
  date: string;
  isOfficial?: boolean;
}

interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  date: string;
  status: FeedbackStatus;
  statusText: string;
  replies?: number;
  fixed?: boolean;
  replyList?: Reply[];
  pageId: string;
}

interface FeedbackDetailModalProps {
  feedback: FeedbackItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusStyles: Record<FeedbackStatus, string> = {
  pending: 'bg-xf-warning/10 text-xf-warning',
  processing: 'bg-xf-info/10 text-xf-info',
  completed: 'bg-xf-success/10 text-xf-success',
};

const statusLabels: Record<FeedbackStatus, string> = {
  pending: '待处理',
  processing: '处理中',
  completed: '已处理',
};

/**
 * 反馈详情弹窗组件
 * 展示反馈的详细信息和回复列表，支持添加评论
 *
 * @param feedback 反馈数据
 * @param isOpen 是否打开
 * @param onClose 关闭回调
 */
export default function FeedbackDetailModal({
  feedback,
  isOpen,
  onClose,
}: FeedbackDetailModalProps) {
  const [replies, setReplies] = useState<Reply[]>(feedback?.replyList || []);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /**
   * 加载评论列表
   */
  const loadReplies = useCallback(async () => {
    if (!feedback?.pageId) return;

    setIsLoadingReplies(true);
    try {
      const result = await getFeedbackReplies(feedback.pageId);
      if (result.success && result.data) {
        setReplies(result.data);
      }
    } catch (error) {
      console.error('加载评论失败:', error);
    } finally {
      setIsLoadingReplies(false);
    }
  }, [feedback?.pageId]);

  /**
   * 提交评论
   */
  const handleSubmitReply = async () => {
    if (!feedback?.pageId || !replyContent.trim()) return;

    setSubmitError('');
    setIsSubmitting(true);

    try {
      const result = await submitReply(feedback.pageId, replyContent);
      if (result.success && result.data) {
        setReplies((prev) => [...prev, result.data]);
        setReplyContent('');
      } else {
        setSubmitError(result.error || '提交失败');
      }
    } catch (error) {
      setSubmitError('提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 处理ESC键关闭
   */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      {/* 打开弹窗时加载评论 */}
      loadReplies();
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, loadReplies]);

  /**
   * 反馈数据变化时更新评论列表
   */
  useEffect(() => {
    if (feedback?.replyList) {
      setReplies(feedback.replyList);
    } else {
      setReplies([]);
    }
  }, [feedback?.replyList]);

  if (!isOpen || !feedback) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-elevated overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-5 border-b border-xf-bg/40">
          <h2 className="text-lg font-semibold text-xf-dark">反馈详情</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-xf-light rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-xf-primary" />
          </button>
        </div>

        {/* 内容区 */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* 反馈信息 */}
          <div className="p-5">
            {/* 标题和状态 */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="text-xl font-medium text-xf-dark leading-tight">
                {feedback.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${statusStyles[feedback.status]}`}
              >
                {feedback.statusText || statusLabels[feedback.status]}
              </span>
            </div>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-xf-primary mb-5">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {feedback.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                追踪ID: {feedback.id}
              </span>
            </div>

            {/* 详细描述 */}
            <div className="bg-xf-light/50 rounded-xl p-4 mb-6">
              <h4 className="text-sm font-medium text-xf-dark mb-2">详细描述</h4>
              <p className="text-sm text-xf-primary leading-relaxed whitespace-pre-wrap">
                {feedback.description}
              </p>
            </div>

            {/* 回复列表 */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-xf-dark mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                回复 ({replies.length})
                {isLoadingReplies && (
                  <Loader2 className="w-4 h-4 animate-spin text-xf-primary" />
                )}
              </h4>

              {/* 评论列表 */}
              {replies.length > 0 && (
                <div className="space-y-3 mb-4">
                  {replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-4 rounded-xl ${
                        reply.isOfficial
                          ? 'bg-xf-accent/5 border border-xf-accent/20'
                          : 'bg-xf-light/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-xf-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-xf-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-xf-dark">
                            {reply.author}
                            {reply.isOfficial && (
                              <span className="ml-2 px-2 py-0.5 text-xs bg-xf-accent text-white rounded-full">
                                官方
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-xf-medium">{reply.date}</div>
                        </div>
                      </div>
                      <p className="text-sm text-xf-primary leading-relaxed pl-10">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* 无回复提示 */}
              {replies.length === 0 && !isLoadingReplies && (
                <div className="text-center py-8 text-xf-medium">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">暂无回复，请耐心等待</p>
                </div>
              )}

              {/* 添加评论输入框 */}
              <div className="mt-4 pt-4 border-t border-xf-bg/40">
                <h5 className="text-sm font-medium text-xf-dark mb-2">添加回复</h5>
                <div className="space-y-3">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="输入您的回复..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-xf-bg/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-xf-primary/20 focus:border-xf-primary resize-none text-sm"
                    disabled={isSubmitting}
                  />
                  {submitError && (
                    <p className="text-sm text-xf-error">{submitError}</p>
                  )}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmitReply}
                      disabled={!replyContent.trim() || isSubmitting}
                      className="flex items-center gap-2 px-4 py-2 bg-xf-accent text-white text-sm font-medium rounded-lg hover:bg-xf-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          提交中...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          发送回复
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部关闭按钮 */}
        <div className="p-4 border-t border-xf-bg/40 bg-xf-light/30">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-xf-accent text-white font-medium rounded-xl hover:bg-xf-accent/90 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
