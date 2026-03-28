/**
 * 标签页切换组件 - 极简风格
 * @module components/profile/ProfileTabs
 * @description 提供极简风格的标签页切换
 */

'use client'

import { useProfileTabs, TabType } from './ProfileTabsContext'

interface Tab {
  id: TabType
  label: string
}

interface ProfileTabsProps {
  /** 是否为自己主页（影响标签文本） */
  isOwnProfile?: boolean
}

/**
 * 标签页切换组件 - 极简风格
 * @description
 * 改进点：
 * - 采用极简设计，不抢夺内容视觉焦点
 * - 使用文字颜色和下划线区分状态
 * - 减少间距，让内容区更快露出
 * - 支持自己/他人主页的不同标签文本
 */
export function ProfileTabs({ isOwnProfile = true }: ProfileTabsProps) {
  const { activeTab, setActiveTab } = useProfileTabs()

  const tabs: Tab[] = [
    { id: 'content', label: isOwnProfile ? '我的内容' : '他的内容' },
    { id: 'thought', label: '思想轨迹' },
  ]

  return (
    <div className="flex gap-6 sm:gap-8 mb-4 border-b border-xf-bg/60">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative pb-3 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'text-xf-accent'
              : 'text-xf-medium hover:text-xf-dark'
          }`}
        >
          {tab.label}
          {/* 激活状态指示器 - 细线下划线 */}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-xf-accent rounded-full" />
          )}
        </button>
      ))}
    </div>
  )
}
