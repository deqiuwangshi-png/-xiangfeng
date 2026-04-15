'use client'

import { useState } from 'react'

interface RewardsTabsProps {
  subscriptionContent: React.ReactNode
  pointsContent: React.ReactNode
}

type TabKey = 'subscription' | 'points'

export function RewardsTabs({ subscriptionContent, pointsContent }: RewardsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('subscription')

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 border-b border-xf-surface/30">
        <button
          type="button"
          onClick={() => setActiveTab('subscription')}
          className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'subscription'
              ? 'text-xf-primary bg-xf-primary/10'
              : 'text-xf-medium hover:text-xf-dark hover:bg-xf-light'
          }`}
        >
          订阅管理
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('points')}
          className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'points'
              ? 'text-xf-primary bg-xf-primary/10'
              : 'text-xf-medium hover:text-xf-dark hover:bg-xf-light'
          }`}
        >
          积分明细
        </button>
      </div>

      <div className="pt-4">
        {activeTab === 'subscription' ? subscriptionContent : pointsContent}
      </div>
    </section>
  )
}

