'use client';

import { MessageSquare, CheckCircle, Clock } from '@/components/icons';
import type { FeedbackItem, FeedbackStatus } from '@/types/feedback';

interface FeedbackCardProps {
  item: FeedbackItem;
  onClick: (item: FeedbackItem) => void;
}

const statusStyles: Record<FeedbackStatus, string> = {
  pending: 'bg-xf-warning/10 text-xf-warning',
  processing: 'bg-xf-info/10 text-xf-info',
  completed: 'bg-xf-success/10 text-xf-success',
};

/**
 * 反馈卡片组件
 * 展示单个反馈的摘要信息
 *
 * @param item 反馈数据
 * @param onClick 点击回调
 */
export default function FeedbackCard({ item, onClick }: FeedbackCardProps) {
  return (
    <div
      onClick={() => onClick(item)}
      className="feedback-card p-4 bg-xf-light/50 rounded-xl hover:bg-white cursor-pointer transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-xf-dark text-base">{item.title}</h3>
        <span className={`status-badge px-3 py-1 rounded-full text-xs font-semibold shrink-0 ml-2 ${statusStyles[item.status]}`}>
          {item.statusText}
        </span>
      </div>
      <p className="text-sm text-xf-primary mb-3 line-clamp-2">{item.description}</p>
      <div className="flex justify-between text-xs text-xf-medium">
        <span>{item.date}</span>
        {item.replies && (
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {item.replies} 条回复
          </span>
        )}
        {item.fixed && (
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-xf-success" />
            已修复
          </span>
        )}
        {!item.replies && !item.fixed && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            等待处理
          </span>
        )}
      </div>
    </div>
  );
}
