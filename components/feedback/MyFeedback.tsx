'use client';

import { MessageSquare, CheckCircle, Clock, ChevronRight } from 'lucide-react';

type FeedbackStatus = 'new' | 'review' | 'resolved' | 'closed';

interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  date: string;
  status: FeedbackStatus;
  statusText: string;
  replies?: number;
  fixed?: boolean;
}

const feedbackItems: FeedbackItem[] = [
  {
    id: '1',
    title: '界面优化建议：增加夜间模式',
    description: '建议在设置中增加夜间模式选项，便于夜间阅读，减少视觉疲劳...',
    date: '2023-10-15',
    status: 'review',
    statusText: '审核中',
    replies: 1,
  },
  {
    id: '2',
    title: '文章编辑器功能异常',
    description: '在文章编辑器中插入图片时，有时会丢失格式...',
    date: '2023-10-10',
    status: 'resolved',
    statusText: '已解决',
    fixed: true,
  },
  {
    id: '3',
    title: '建议增加文章导出功能',
    description: '希望能够将文章导出为PDF或Markdown格式，便于备份和分享...',
    date: '2023-10-05',
    status: 'new',
    statusText: '新提交',
  },
];

const statusStyles: Record<FeedbackStatus, string> = {
  new: 'bg-xf-success/10 text-xf-success',
  review: 'bg-xf-warning/10 text-xf-warning',
  resolved: 'bg-xf-info/10 text-xf-info',
  closed: 'bg-xf-medium/10 text-xf-medium',
};

export default function MyFeedback() {
  return (
    <div className="space-y-4">
      {feedbackItems.map((item) => (
        <div
          key={item.id}
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
      ))}
      <div className="mt-4 pt-3 border-t border-xf-bg/40 text-center">
        <a
          href="#"
          className="text-sm font-medium text-xf-primary hover:text-xf-accent transition-colors"
        >
          查看全部记录 <ChevronRight className="w-4 h-4 inline" />
        </a>
      </div>
    </div>
  );
}
