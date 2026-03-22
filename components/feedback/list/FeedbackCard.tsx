import { MessageSquare, CheckCircle, Clock, Paperclip } from '@/components/icons';
import type { FeedbackItem, FeedbackStatus } from '@/types/feedback';
import { FeedbackCardActions } from './FeedbackCardActions';

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
 * 反馈卡片内容组件 - 服务端组件
 * ✅ 纯展示，服务端渲染
 * ✅ 样式和状态渲染在服务端完成
 */
function FeedbackCardContent({ item }: { item: FeedbackItem }) {
  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <span className={`status-badge px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${statusStyles[item.status]}`}>
          {item.statusText}
        </span>
      </div>
      <p className="text-sm text-xf-primary mb-3 line-clamp-3">{item.description}</p>
      <div className="flex justify-between text-xs text-xf-medium">
        <span>{item.date}</span>
        <div className="flex items-center gap-3">
          {item.attachments && item.attachments.length > 0 && (
            <span className="flex items-center gap-1 text-xf-primary">
              <Paperclip className="w-3 h-3" />
              {item.attachments.length} 个附件
            </span>
          )}
          {item.replies ? (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {item.replies} 条回复
            </span>
          ) : item.fixed ? (
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-xf-success" />
              已修复
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              等待处理
            </span>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * 反馈卡片组件 - 服务端组件 + 客户端交互
 * ✅ 内容在服务端渲染
 * ✅ 点击交互由客户端组件处理
 *
 * @param item 反馈数据
 * @param onClick 点击回调
 */
export default function FeedbackCard({ item, onClick }: FeedbackCardProps) {
  return (
    <FeedbackCardActions item={item} onClick={onClick}>
      <FeedbackCardContent item={item} />
    </FeedbackCardActions>
  );
}
