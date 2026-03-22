'use client';

import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { HelpCircle, Loader2 } from '@/components/icons';
import FeedbackTabs from '@/components/feedback/FeedbackTabs';
import Toast from '@/components/feedback/modal/Toast';
import { getFeedbacksByTrackingIds } from '@/lib/feedback/actions';
import { getTrackingIds, addTrackingId } from '@/lib/feedback/storage';
import type { FeedbackItem } from '@/types/feedback';

{/* 懒加载标签页组件，减少初始加载时间 */}
const SubmitFeedback = lazy(() => import('@/components/feedback/SubmitFeedback'));
const MyFeedback = lazy(() => import('@/components/feedback/list/MyFeedback'));
const FAQ = lazy(() => import('@/components/feedback/FAQ'));

{/* 标签页内容加载占位符 */}
const TabContentSkeleton = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-6 h-6 animate-spin text-xf-primary" />
    <span className="ml-2 text-xf-primary">加载中...</span>
  </div>
);

type TabType = 'submit' | 'my' | 'faq';

/**
 * 反馈页面
 * 包含提交反馈、我的反馈、统计和FAQ四个标签页
 */
export default function FeedbackPage() {
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
    <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-8 pt-4 sm:pt-6 pb-20">
      {/* 页面标题 */}
      <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-xf-accent font-bold mb-1">
            反馈帮助
          </h1>
          <p className="text-sm sm:text-base text-xf-primary">
            帮助我们一起打磨产品
          </p>
        </div>
        <button
          onClick={() => handleTabChange('faq')}
          className="text-xs sm:text-sm text-xf-primary hover:text-xf-accent flex items-center gap-1 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          反馈前搜索
        </button>
      </div>

      {/* 主内容区 */}
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
