/**
 * 标签页内容包装组件
 * @module components/profile/ProfileTabContent
 * @description 根据当前激活的标签页条件渲染内容，替代DOM操作
 */

'use client'

import { ReactNode } from 'react'
import { useProfileTabs, TabType } from './ProfileTabsContext'

/**
 * 标签页内容包装器Props
 *
 * @interface ProfileTabContentProps
 * @property {TabType} tab - 此内容对应的标签页ID
 * @property {ReactNode} children - 子组件（可以是服务端组件）
 */
interface ProfileTabContentProps {
  tab: TabType
  children: ReactNode
}

/**
 * 标签页内容包装组件
 *
 * @function ProfileTabContent
 * @param {ProfileTabContentProps} props - 组件属性
 * @returns {JSX.Element | null} 条件渲染的内容或null
 *
 * @description
 * 根据当前激活的标签页条件渲染内容
 * - 当前标签页匹配时显示内容
 * - 不匹配时返回null（不渲染）
 * - 支持包裹服务端组件作为children
 *
 * @example
 * ```tsx
 * <ProfileTabContent tab="content">
 *   <ProfileContent />  // 服务端组件
 * </ProfileTabContent>
 * ```
 */
export function ProfileTabContent({ tab, children }: ProfileTabContentProps) {
  const { activeTab } = useProfileTabs()

  // 当前标签页不匹配，不渲染
  if (activeTab !== tab) {
    return null
  }

  // 匹配，渲染内容
  return <>{children}</>
}
