'use client';

/**
 * 反馈页面客户端组件
 * @module components/feedback/FeedbackClient
 * @description 处理反馈页面的客户端交互逻辑
 * @优化说明 从page.tsx提取为独立Client Component，支持页面改为Server Component
 */

import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Loader2 } from '@/components/icons';
import FeedbackTabs from '@/components/feedback/FeedbackTabs';
import Toast from '@/components/feedback/modal/Toast';
import { getFeedbacksByTrackingIds } from '@/lib/feedback/actions';
import { getTrackingIds, addTrackingId } from '@/lib/feedback/storage';
import type { FeedbackItem } from '@/types/user/feedback';

/* 懒加载标签页组件，减少初始加载时间 */
const SubmitFeedback = lazy(() => import('@/components/feedback/SubmitFeedback'));
const MyFeedback = lazy(() => import('@/components/feedback/list/MyFeedback'));
const FAQ = lazy(() => import('@/components/feedback/FAQ'));

/* 标签页内容加载占位符 */
const TabContentSkeleton = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-6 h-6 animate-spin text-xf-primary" />
    <span className="ml-2 text-xf-primary">加载中...</span>
  </div>
);

type TabType = 'submit' | 'my' | 'faq';

/**
 * 反馈页面客户端组件
 * @returns {JSX.Element} 反馈页面客户端组件
 */
export function FeedbackClient() {
  const [activeTab, setActiveTab] = useState<TabType>('submit');
  const [showToast, setShowToast] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 加载反馈列表
   * 从飞书多维表格查询用户的反馈数据
   */
  const loadFeedbacks = useCallback(async () => {
    setIsLoading(true);
    try {
      const trackingIds = getTrackingIds();
      console.log('[页面] trackingIds:', trackingIds);
      if (trackingIds.length > 0) {
        const result = await getFeedbacksByTrackingIds(trackingIds);
        console.log('[页面] 查询结果:', result);
        if (result.success && result.data) {
          setFeedbackItems(result.data);
        } else {
          setFeedbackItems([]);
        }
      } else {
        setFeedbackItems([]);
      }
    } catch (error) {
      console.error('[页面] 加载反馈失败:', error);
      setFeedbackItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setFeedbackItems]);

  /**
   * 切换标签页时加载数据
   */
  useEffect(() => {
    if (activeTab === 'my') {
      loadFeedbacks();
    }
  }, [activeTab, loadFeedbacks]);

  /**
   * 切换标签页
   * @param tab 目标标签页
   */
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  /**
   * 反馈提交成功回调
   * 显示 Toast 提示并预加载反馈列表
   * @param id 追踪ID
   */
  const handleFeedbackSubmit = useCallback((id: string) => {
    setTrackingId(id);
    addTrackingId(id);
    setShowToast(true);
    /**
     * 预加载反馈列表
     * 解决飞书读写延迟问题：提交后立即后台加载，确保切换到"我的反馈"时数据已就绪
     */
    setTimeout(() => {
      loadFeedbacks();
    }, 1500);
  }, [loadFeedbacks]);

  /**
   * 关闭 Toast 提示
   */
  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <div className="bg-linear-to-br from-white to-xf-light border border-xf-bg/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-6">
      <FeedbackTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="mt-4">
        {activeTab === 'submit' && (
          <Suspense fallback={<TabContentSkeleton />}>
            <SubmitFeedback onSubmit={handleFeedbackSubmit} />
          </Suspense>
        )}
        {activeTab === 'my' && (
          <Suspense fallback={<TabContentSkeleton />}>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-xf-primary" />
                <span className="ml-2 text-xf-primary">加载中...</span>
              </div>
            ) : feedbackItems.length > 0 ? (
              <MyFeedback feedbackItems={feedbackItems} />
            ) : (
              <div className="text-center py-12 text-xf-medium">
                <p>暂无反馈记录</p>
                <p className="text-sm mt-1">提交反馈后将在此显示</p>
              </div>
            )}
          </Suspense>
        )}
        {activeTab === 'faq' && (
          <Suspense fallback={<TabContentSkeleton />}>
            <FAQ />
          </Suspense>
        )}
      </div>

      {/* Toast 成功提示 */}
      {showToast && (
        <Toast
          message="反馈提交成功！"
          trackingId={trackingId}
          onClose={handleCloseToast}
          duration={5000}
        />
      )}
    </div>
  );
}
