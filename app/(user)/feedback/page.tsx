'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import FeedbackTabs from '@/components/feedback/FeedbackTabs';
import SubmitFeedback from '@/components/feedback/SubmitFeedback';
import MyFeedback from '@/components/feedback/MyFeedback';
import HotFeedback from '@/components/feedback/HotFeedback';
import Announcements from '@/components/feedback/Announcements';
import Statistics from '@/components/feedback/Statistics';
import FAQ from '@/components/feedback/FAQ';
import SuccessModal from '@/components/feedback/SuccessModal';

type TabType = 'submit' | 'my' | 'hot' | 'announce' | 'stats' | 'faq';

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState<TabType>('submit');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleFeedbackSubmit = (id: string) => {
    setTrackingId(id);
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const handleViewMyFeedback = () => {
    setShowSuccessModal(false);
    setActiveTab('my');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 pt-6 pb-20">
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-xf-accent font-bold mb-1">
            反馈中心
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

      <div className="bg-linear-to-br from-white to-xf-light border border-xf-bg/80 rounded-2xl p-5 lg:p-6">
        <FeedbackTabs activeTab={activeTab} onTabChange={handleTabChange} />
        
        <div className="mt-4">
          {activeTab === 'submit' && (
            <SubmitFeedback onSubmit={handleFeedbackSubmit} />
          )}
          {activeTab === 'my' && <MyFeedback />}
          {activeTab === 'hot' && <HotFeedback />}
          {activeTab === 'announce' && <Announcements />}
          {activeTab === 'stats' && <Statistics />}
          {activeTab === 'faq' && <FAQ />}
        </div>
      </div>

      {showSuccessModal && (
        <SuccessModal
          trackingId={trackingId}
          onClose={handleCloseModal}
          onViewMyFeedback={handleViewMyFeedback}
        />
      )}
    </div>
  );
}
