'use client'

import { useState, createContext, useContext, useEffect } from 'react'
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

/**
 * 有效的标签页ID列表
 * @constant VALID_TABS
 */
const VALID_TABS = ['account', 'privacy', 'notifications', 'appearance', 'content', 'advanced']

/**
 * 从URL hash获取标签页ID
 * @function getTabFromHash
 * @returns {string} 标签页ID
 */
const getTabFromHash = (): string => {
  if (typeof window === 'undefined') return 'account'
  const hash = window.location.hash.replace('#', '')
  return VALID_TABS.includes(hash) ? hash : 'account'
}

export function SettingsLayout({ userData, contentSettings }: SettingsLayoutProps) {
  // 使用函数式初始值，避免在渲染阶段同步调用setState
  const [activeTab, setActiveTab] = useState(() => getTabFromHash())

  /**
   * 处理标签页切换
   *
   * @function handleTabChange
   * @param {string} tabId - 标签页ID
   * @returns {void}
   *
   * @description
   * 更新当前激活的标签页状态，并同步更新URL hash
   */
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    // 同步更新URL hash，支持通过锚点链接直接访问特定标签页
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${tabId}`)
    }
  }

  /**
   * 监听URL hash变化，实现锚点链接支持
   * 当用户通过 /settings#privacy 等方式访问时，自动切换到对应标签页
   */
  useEffect(() => {
    /**
     * 处理hashchange事件
     */
    const handleHashChange = () => {
      const newTab = getTabFromHash()
      setActiveTab(newTab)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* 桌面端左侧导航 - 移动端使用汉堡菜单 */}
          <div className="hidden lg:block lg:col-span-3">
            <SettingsNav activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          <div className="lg:col-span-9 max-w-3xl">
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
