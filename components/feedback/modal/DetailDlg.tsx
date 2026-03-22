'use client';

import { useEffect } from 'react';
import { X } from '@/components/icons';
import { Calendar, Tag, FileText, User } from 'lucide-react';
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
   * 处理ESC键关闭和加载评论
   */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    {/* 保存原始overflow值以便恢复 */}
    const originalOverflow = document.body.style.overflow;

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  /**
   * 打开弹窗时加载评论
   */
  useEffect(() => {
    if (isOpen && feedback?.pageId) {
      loadReplies();
    }
  }, [isOpen, feedback?.pageId, loadReplies]);

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
            {/* 状态 */}
            <div className="flex items-start justify-between gap-4 mb-4">
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
              {feedback.userEmail && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {feedback.userEmail}
                </span>
              )}
            </div>

            {/* 详细描述 */}
            <div className="bg-xf-light/50 rounded-xl p-4 mb-6">
              <h4 className="text-sm font-medium text-xf-dark mb-2">详细描述</h4>
              <p className="text-sm text-xf-primary leading-relaxed whitespace-pre-wrap">
                {feedback.description}
              </p>
            </div>

            {/* 附件列表 */}
            {feedback.attachments && feedback.attachments.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-xf-dark mb-3">附件 ({feedback.attachments.length})</h4>
                <div className="space-y-2">
                  {feedback.attachments.map((attachment, index) => (
                    <a
                      key={`${attachment.name}-${index}`}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white border border-xf-bg/60 rounded-xl hover:border-xf-primary hover:bg-xf-primary/5 transition-colors group"
                    >
                      <FileText className="w-5 h-5 text-xf-primary shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-xf-dark truncate group-hover:text-xf-accent transition-colors">
                          {attachment.name}
                        </div>
                        <div className="text-xs text-xf-primary">点击下载或查看</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

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

      </div>
    </div>
  );
}
