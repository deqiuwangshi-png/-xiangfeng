/**
 * 标签页切换组件
 * @module components/profile/ProfileTabs
 * @description 提供标签页切换功能，使用Context管理状态
 */

'use client'

import { useProfileTabs, TabType } from './ProfileTabsContext'

/**
 * 标签页接口
 *
 * @interface Tab
 * @property {TabType} id - 标签页唯一标识
 * @property {string} label - 标签页显示文本
 */
interface Tab {
  id: TabType
  label: string
}

/**
 * 标签页配置
 *
 * @constant tabs
 * @description 定义个人主页标签页
 */
const tabs: Tab[] = [
  { id: 'content', label: '我的内容' },
  { id: 'domain', label: '领域贡献' },
]

/**
 * 标签页切换组件
 *
 * @function ProfileTabs
 * @returns {JSX.Element} 标签页切换组件
 *
 * @description
 * 提供标签页切换功能，包括：
 * - 我的内容标签
 * - 领域贡献标签
 * - 使用Context管理状态
 * - 声明式UI，无DOM操作
 *
 * @state
 * - activeTab: 从Context获取当前激活的标签页ID
 *
 * @layout
 * - 使用 flex 布局
 * - 所有间距完全复制原型数值
 */
export function ProfileTabs() {
  const { activeTab, setActiveTab } = useProfileTabs()

  /**
   * 处理标签页切换
   *
   * @function handleTabClick
   * @param {TabType} tabId - 标签页ID
   * @returns {void}
   *
   * @description
   * 通过Context更新当前激活的标签页状态
   * 触发React重新渲染，条件显示对应内容区域
   */
  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId)
  }

  return (
    <div className="flex gap-4 mb-8 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
