'use client';

import { useState, useCallback, lazy, Suspense } from 'react';
import { ChevronRight, Loader2 } from '@/components/icons';
import FeedbackCard from './FeedbackCard';
import type { FeedbackItem } from '@/types/feedback';

{/* 懒加载弹窗组件，减少列表初始渲染负担 */}
const FeedbackDetailModal = lazy(() => import('../modal/DetailDlg'));

export type { FeedbackItem };

interface MyFeedbackProps {
  feedbackItems: FeedbackItem[];
}

/**
 * 我的反馈组件
 * 展示用户提交的反馈列表，支持点击查看详情
 *
 * @param feedbackItems 反馈数据列表
 */
export default function MyFeedback({ feedbackItems }: MyFeedbackProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * 打开反馈详情弹窗
   *
   * @param feedback 选中的反馈项
   */
  const handleOpenDetail = useCallback((feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  }, []);

  /**
   * 关闭反馈详情弹窗
   */
  const handleCloseDetail = useCallback(() => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  }, []);

  return (
    <div className="space-y-4">
      {feedbackItems.map((item) => (
        <FeedbackCard
          key={item.id}
          item={item}
          onClick={handleOpenDetail}
        />
      ))}
      <div className="mt-4 pt-3 border-t border-xf-bg/40 text-center">
        <a
          href="#"
          className="text-sm font-medium text-xf-primary hover:text-xf-accent transition-colors"
        >
          查看全部记录 <ChevronRight className="w-4 h-4 inline" />
        </a>
      </div>

      {/* 反馈详情弹窗 - 懒加载 */}
      <Suspense
        fallback={
          isModalOpen ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          ) : null
        }
      >
        <FeedbackDetailModal
          feedback={selectedFeedback}
          isOpen={isModalOpen}
          onClose={handleCloseDetail}
        />
      </Suspense>
    </div>
  );
}
