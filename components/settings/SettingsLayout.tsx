'use client'

import { useState } from 'react'
import { SettingsNav } from './SettingsNav'
import { AccountSection } from './sections/AccountSection'
import { PrivacySection } from './sections/PrivacySection'
import { NotificationsSection } from './sections/NotificationsSection'
import { AppearanceSection } from './sections/AppearanceSection'
import { ContentSection } from './sections/ContentSection'
import { AdvancedSection } from './sections/AdvancedSection'

/**
 * 用户数据接口
 */
interface UserData {
  id: string
  email: string
  username: string
  avatar_url: string
  bio: string
  location: string
}

interface SettingsLayoutProps {
  userData: UserData | null
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

export function SettingsLayout({ userData }: SettingsLayoutProps) {
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

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1">
          设置
        </h1>
        <p className="text-xf-primary mt-2 font-medium">
          个性化配置你的相逢体验
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-1">
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
  )
}
