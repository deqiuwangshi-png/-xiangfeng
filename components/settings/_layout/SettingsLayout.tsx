'use client'

import { createContext, useContext, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { SettingsNav } from './SettingsNav'
import { AccountSection } from '../account/AccountSection'
import { PrivacySection } from '../sections/PrivacySection'
import { NotificationsSection } from '../sections/NotificationsSection'
import { AppearanceSection } from '../sections/AppearanceSection'
import { ContentSection } from '../content/ContentSection'
import { AdvancedSection } from '../sections/AdvancedSection'
import { AccountViewMode, UserData, UserSettings } from '@/types/user/settings'

/**
 * 设置页面上下文
 * 用于在设置页面各组件间共享数据，避免重复请求
 */
interface SettingsContextType {
  userData: UserData | null
  userSettings: UserSettings
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
  userSettings: UserSettings
}

{/* 有效的标签页ID列表 */}
const VALID_TABS = ['account', 'privacy', 'notifications', 'appearance', 'content', 'advanced']

{/* 从查询参数获取标签页ID */}
const getTabFromSearchParams = (searchParams: URLSearchParams | null): string => {
  const tab = searchParams?.get('tab')
  return tab && VALID_TABS.includes(tab) ? tab : 'account'
}

const VALID_ACCOUNT_VIEWS: AccountViewMode[] = [
  'list',
  'editProfile',
  'security',
  'changeEmail',
  'linkedAccounts',
]

const getAccountViewFromSearchParams = (
  searchParams: URLSearchParams | null,
  activeTab: string
): AccountViewMode => {
  if (activeTab !== 'account') return 'list'
  const view = searchParams?.get('view')
  return view && VALID_ACCOUNT_VIEWS.includes(view as AccountViewMode)
    ? (view as AccountViewMode)
    : 'list'
}

{/* 内部内容组件 - 配合 Suspense 使用 */}
function SettingsLayoutContent({ userData, userSettings }: SettingsLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  {/* 从 URL 计算当前标签页 - 避免使用 state 导致级联渲染 */}
  const activeTab = getTabFromSearchParams(searchParams)
  const accountView = getAccountViewFromSearchParams(searchParams, activeTab)

  {/* 处理标签页切换 - 直接更新 URL，状态从 URL 计算得出 */}
  const handleTabChange = useCallback((tabId: string) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set('tab', tabId)
    if (tabId !== 'account') {
      params.delete('view')
    } else if (!params.get('view')) {
      params.set('view', 'list')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])

  const handleAccountViewChange = useCallback((view: AccountViewMode) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set('tab', 'account')
    if (view === 'list') {
      params.delete('view')
    } else {
      params.set('view', view)
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])

  {/* 上下文数据 - 服务端获取的数据通过 Context 共享给子组件 */}
  const contextValue: SettingsContextType = {
    userData,
    userSettings,
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
            {/* 使用 hidden 代替条件渲染，避免组件重新挂载，提升性能 */}
            <div className={activeTab === 'account' ? 'block' : 'hidden'}>
              <AccountSection
                userData={userData}
                viewMode={accountView}
                onViewChange={handleAccountViewChange}
              />
            </div>
            <div className={activeTab === 'privacy' ? 'block' : 'hidden'}>
              <PrivacySection />
            </div>
            <div className={activeTab === 'notifications' ? 'block' : 'hidden'}>
              <NotificationsSection />
            </div>
            <div className={activeTab === 'appearance' ? 'block' : 'hidden'}>
              <AppearanceSection />
            </div>
            <div className={activeTab === 'content' ? 'block' : 'hidden'}>
              <ContentSection />
            </div>
            <div className={activeTab === 'advanced' ? 'block' : 'hidden'}>
              <AdvancedSection />
            </div>
          </div>
        </div>
      </div>
    </SettingsContext.Provider>
  )
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
 *   - 使用查询参数 ?tab=xxx 切换标签页
 * 
 * @state
 * - activeTab: 当前激活的标签页ID
 * 
 * 更新时间: 2026-03-25
 */
export function SettingsLayout({ userData, userSettings }: SettingsLayoutProps) {
  return (
    <Suspense fallback={null}>
      <SettingsLayoutContent userData={userData} userSettings={userSettings} />
    </Suspense>
  )
}
