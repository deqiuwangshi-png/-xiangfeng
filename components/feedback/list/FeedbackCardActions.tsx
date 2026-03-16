'use client';

import type { ReactNode } from 'react';
import type { FeedbackItem } from '@/types/feedback';

interface FeedbackCardActionsProps {
  item: FeedbackItem;
  onClick: (item: FeedbackItem) => void;
  children: ReactNode;
}

/**
 * 反馈卡片交互组件 - 客户端组件
 * ✅ 处理点击交互
 * ✅ 包裹服务端渲染的内容
 */
export function FeedbackCardActions({ item, onClick, children }: FeedbackCardActionsProps) {
  return (
    <div
      onClick={() => onClick(item)}
      className="feedback-card p-4 bg-xf-light/50 rounded-xl hover:bg-white cursor-pointer transition-colors"
    >
      {children}
    </div>
  );
}
