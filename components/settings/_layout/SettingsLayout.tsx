'use client'

import { useState, createContext, useContext } from 'react'
import { SettingsNav } from './SettingsNav'
import { AccountSection } from '../account/AccountSection'
import { PrivacySection } from '../sections/PrivacySection'
import { NotificationsSection } from '../sections/NotificationsSection'
import { AppearanceSection } from '../sections/AppearanceSection'
import { ContentSection } from '../content/ContentSection'
import { AdvancedSection } from '../sections/AdvancedSection'
import { UserData, ContentSettings } from '@/types/settings'

/**
 * 设置页面上下文
 * 用于在设置页面各组件间共享数据，避免重复请求
 */
interface SettingsContextType {
  userData: UserData | null
  contentSettings: ContentSettings
}

const SettingsContext = createContext<SettingsContextType | null>(null)

/**
 * 使用设置上下文的 Hook
 * @returns 设置上下文数据
 * @throws 如果在 Provider 外使用则抛出错误
 */
export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings 必须在 SettingsProvider 内使用')
  }
  return context
}

interface SettingsLayoutProps {
  userData: UserData | null
  contentSettings?: ContentSettings
}

/**
 * 设置页面布局组件（Client Component）
 * 
 * 作用: 管理设置页面的布局和标签页切换
 * 
 * @returns {JSX.Element} 设置页面布局
 * 
 * 使用说明:
 *   管理设置页面的整体布局
 *   处理标签页切换
 *   管理设置状态
 * 
 * 架构说明:
 *   - 使用'use client'指令
 *   - 不直接访问数据库
 *   - 使用Server Actions进行数据修改
 *   - 使用客户端hooks（useState, useEffect）
 *   - 接收来自Server Component的数据
 * 
 * @state
 * - activeTab: 当前激活的标签页ID
 * 
 * 更新时间: 2026-03-02
 */

export function SettingsLayout({ userData, contentSettings }: SettingsLayoutProps) {
  const [activeTab, setActiveTab] = useState('account')

  /**
   * 处理标签页切换
   *
   * @function handleTabChange
   * @param {string} tabId - 标签页ID
   * @returns {void}
   *
   * @description
   * 更新当前激活的标签页状态
   */
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  {/* 上下文数据 - 服务端获取的数据通过 Context 共享给子组件 */}
  const contextValue: SettingsContextType = {
    userData,
    contentSettings: contentSettings || { content_language: 'zh-CN' },
  }

  return (
    <SettingsContext.Provider value={contextValue}>
      <div>
        {/* 桌面端标题 - 移动端在page.tsx中显示 */}
        <header className="hidden lg:block mb-10">
          <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1">
            设置
          </h1>
          <p className="text-xf-primary mt-2 font-medium">
            个性化配置你的相逢体验
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* 桌面端左侧导航 - 移动端使用汉堡菜单 */}
          <div className="hidden lg:block lg:col-span-1">
            <SettingsNav activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          <div className="lg:col-span-4">
            {activeTab === 'account' && <AccountSection userData={userData} />}
            {activeTab === 'privacy' && <PrivacySection />}
            {activeTab === 'notifications' && <NotificationsSection />}
            {activeTab === 'appearance' && <AppearanceSection />}
            {activeTab === 'content' && <ContentSection />}
            {activeTab === 'advanced' && <AdvancedSection />}
          </div>
        </div>
      </div>
    </SettingsContext.Provider>
  )
}
