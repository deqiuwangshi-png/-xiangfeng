'use client';

import { Filter } from 'lucide-react';

type TabType = 'submit' | 'my' | 'hot' | 'announce' | 'stats' | 'faq';

interface FeedbackTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'submit' as TabType, label: '提交反馈' },
  { id: 'my' as TabType, label: '我的反馈' },
  { id: 'hot' as TabType, label: '热门反馈' },
  { id: 'announce' as TabType, label: '公告' },
  { id: 'stats' as TabType, label: '统计洞察' },
  { id: 'faq' as TabType, label: '常见问题' },
];

export default function FeedbackTabs({ activeTab, onTabChange }: FeedbackTabsProps) {
  return (
    <div className="flex items-center border-b border-xf-bg/40 pb-3 mb-4 flex-wrap gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`tab-btn text-sm px-4 py-1.5 rounded-full transition-all ${
            activeTab === tab.id
              ? 'text-xf-accent font-medium bg-xf-primary/5'
              : 'text-xf-primary hover:bg-xf-bg/30'
          }`}
        >
          {tab.label}
        </button>
      ))}
      <div className="flex-1 text-right">
        <Filter className="w-4 h-4 inline text-xf-primary cursor-pointer" />
      </div>
    </div>
  );
}
