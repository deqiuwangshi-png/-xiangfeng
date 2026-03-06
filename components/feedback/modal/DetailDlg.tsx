'use client';

import { useEffect } from 'react';
import { X, Calendar, Tag } from 'lucide-react';
import { useFeedbackReplies } from '../hooks/useFeedbackReplies';
import ReplyList from '../reply/ReplyList';
import ReplyForm from '../reply/ReplyForm';
import type { FeedbackItem, FeedbackStatus } from '@/types/feedback';

interface DetailDlgProps {
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
 * 展示反馈详情和评论交互
 *
 * @param feedback 反馈数据
 * @param isOpen 是否打开
 * @param onClose 关闭回调
 */
export default function FeedbackDetailModal({
  feedback,
  isOpen,
  onClose,
}: DetailDlgProps) {
  const {
    replies,
    isLoading,
    isSubmitting,
    submitError,
    loadReplies,
    submitNewReply,
  } = useFeedbackReplies({ pageId: feedback?.pageId || '' });

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

            {/* 评论列表 */}
            <ReplyList replies={replies} isLoading={isLoading} />

            {/* 评论表单 */}
            <ReplyForm
              onSubmit={submitNewReply}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
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
