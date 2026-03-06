'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import FeedbackCard from './FeedbackCard';
import FeedbackDetailModal from '../modal/DetailDlg';
import type { FeedbackItem } from '@/types/feedback';

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
  const handleOpenDetail = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  /**
   * 关闭反馈详情弹窗
   */
  const handleCloseDetail = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

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

      {/* 反馈详情弹窗 */}
      <FeedbackDetailModal
        feedback={selectedFeedback}
        isOpen={isModalOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
