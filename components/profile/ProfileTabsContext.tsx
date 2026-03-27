/**
 * 标签页状态管理Context
 * @module components/profile/ProfileTabsContext
 * @description 提供标签页切换的状态管理，替代DOM操作
 */

'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

/**
 * 标签页类型
 */
export type TabType = 'content' | 'domain' | 'thought'

/**
 * Context值类型
 */
interface ProfileTabsContextValue {
  /** 当前激活的标签页 */
  activeTab: TabType
  /** 切换标签页 */
  setActiveTab: (tab: TabType) => void
}

/**
 * 标签页Context
 */
const ProfileTabsContext = createContext<ProfileTabsContextValue | undefined>(
  undefined
)

/**
 * 标签页Provider Props
 */
interface ProfileTabsProviderProps {
  children: ReactNode
  defaultTab?: TabType
}

/**
 * 标签页状态Provider
 *
 * @function ProfileTabsProvider
 * @param {ProfileTabsProviderProps} props - 组件属性
 * @returns {JSX.Element} Provider组件
 *
 * @description
 * 提供标签页状态管理，包裹需要访问标签页状态的组件
 *
 * @example
 * ```tsx
 * <ProfileTabsProvider defaultTab="content">
 *   <ProfileTabs />
 *   <ProfileContentWrapper />
 * </ProfileTabsProvider>
 * ```
 */
export function ProfileTabsProvider({
  children,
  defaultTab = 'content',
}: ProfileTabsProviderProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab)

  return (
    <ProfileTabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ProfileTabsContext.Provider>
  )
}

/**
 * 使用标签页Context的Hook
 *
 * @function useProfileTabs
 * @returns {ProfileTabsContextValue} 标签页状态和方法
 * @throws {Error} 如果在Provider外部使用会抛出错误
 *
 * @description
 * 在组件中访问标签页状态的Hook
 *
 * @example
 * ```tsx
 * const { activeTab, setActiveTab } = useProfileTabs()
 * ```
 */
export function useProfileTabs(): ProfileTabsContextValue {
  const context = useContext(ProfileTabsContext)

  if (context === undefined) {
    throw new Error('useProfileTabs must be used within a ProfileTabsProvider')
  }

  return context
}
