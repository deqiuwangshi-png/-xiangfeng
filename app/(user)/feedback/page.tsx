'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { HelpCircle, Loader2 } from 'lucide-react';
import FeedbackTabs from '@/components/feedback/FeedbackTabs';
import SubmitFeedback from '@/components/feedback/SubmitFeedback';
import MyFeedback, { FeedbackItem } from '@/components/feedback/MyFeedback';
import HotFeedback from '@/components/feedback/HotFeedback';
import Statistics from '@/components/feedback/Statistics';
import FAQ from '@/components/feedback/FAQ';
import Toast from '@/components/feedback/Toast';
import { getFeedbacksByTrackingIds } from '@/lib/feedback/feedbackActions';
import { getTrackingIds, addTrackingId } from '@/lib/feedback/storage';

type TabType = 'submit' | 'my' | 'hot' | 'stats' | 'faq';

/**
 * 反馈页面
 * 包含提交反馈、我的反馈、热门反馈、统计和FAQ五个标签页
 */
export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState<TabType>('submit');
  const [showToast, setShowToast] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  {/* 用于取消正在进行的请求 */}
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 加载反馈列表
   * 从 Notion 查询用户的反馈数据
   */
  const loadFeedbacks = useCallback(async () => {
    {/* 取消之前的请求 */}
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    {/* 创建新的 AbortController */}
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    try {
      const trackingIds = getTrackingIds();
      if (trackingIds.length > 0) {
        const result = await getFeedbacksByTrackingIds(trackingIds);
        {/* 如果请求被取消，不更新状态 */}
        if (controller.signal.aborted) return;

        if (result.success && result.data) {
          setFeedbackItems(result.data);
        }
      } else {
        setFeedbackItems([]);
      }
    } catch (error) {
      {/* 忽略取消错误 */}
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('加载反馈失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 切换标签页时加载数据
   */
  useEffect(() => {
    if (activeTab === 'my') {
      loadFeedbacks();
    }

    {/* 组件卸载时取消请求 */}
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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
   * 显示 Toast 提示并自动切换到"我的反馈"标签
   * @param id 追踪ID
   */
  const handleFeedbackSubmit = (id: string) => {
    setTrackingId(id);
    addTrackingId(id);
    setShowToast(true);
    {/* 3秒后自动切换到"我的反馈"标签 */}
    setTimeout(() => {
      setActiveTab('my');
    }, 2000);
  };

  /**
   * 关闭 Toast 提示
   */
  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 pt-6 pb-20">
      {/* 页面标题 */}
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-xf-accent font-bold mb-1">
            产品反馈
          </h1>
          <p className="text-xf-primary text-base">
            帮助我们一起打磨产品
          </p>
        </div>
        <button className="text-sm text-xf-primary hover:text-xf-accent flex items-center gap-1">
          <HelpCircle className="w-4 h-4" />
          反馈前搜索
        </button>
      </div>

      {/* 主内容区 */}
      <div className="bg-linear-to-br from-white to-xf-light border border-xf-bg/80 rounded-2xl p-5 lg:p-6">
        <FeedbackTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="mt-4">
          {activeTab === 'submit' && (
            <SubmitFeedback onSubmit={handleFeedbackSubmit} />
          )}
          {activeTab === 'my' && (
            <>
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
            </>
          )}
          {activeTab === 'hot' && <HotFeedback />}
          {activeTab === 'stats' && <Statistics />}
          {activeTab === 'faq' && <FAQ />}
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
