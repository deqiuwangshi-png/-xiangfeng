'use client';

import { MessageSquare, User, Loader2 } from '@/components/icons';
import type { Reply } from '@/types/feedback';

interface FeedbackReplyListProps {
  replies: Reply[];
  isLoading: boolean;
}

/**
 * 反馈评论列表组件
 * 展示评论列表和加载状态
 *
 * @param replies 评论列表
 * @param isLoading 是否加载中
 */
export default function FeedbackReplyList({ replies, isLoading }: FeedbackReplyListProps) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-xf-dark mb-3 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        回复 ({replies.length})
        {isLoading && (
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
      {replies.length === 0 && !isLoading && (
        <div className="text-center py-8 text-xf-medium">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">暂无回复，请耐心等待</p>
        </div>
      )}
    </div>
  );
}
