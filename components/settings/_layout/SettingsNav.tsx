'use client'

import { User, Lock, Bell, Palette, Filter, Settings2 } from '@/components/icons'

/**
 * 设置导航组件（Client Component）
 * 
 * 作用: 显示设置导航菜单并处理导航项点击
 * 
 * @param {string} activeTab - 当前激活的标签页ID
 * @param {function} onTabChange - 标签页切换回调函数
 * @returns {JSX.Element} 设置导航组件
 * 
 * 使用说明:
 *   显示设置导航菜单
 *   处理导航项点击
 *   管理激活状态
 * 
 * 架构说明:
 *   - 使用'use client'指令
 *   - 接收当前激活的标签页
 *   - 触发标签页切换事件
 * 更新时间: 2026-02-20
 */

interface SettingsNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

/**
 * 导航项配置
 * 
 * @constant navItems
 * @description 定义设置导航菜单项
 */
const navItems = [
  { id: 'account', label: '账户设置', icon: User },
  { id: 'privacy', label: '隐私与安全', icon: Lock },
  { id: 'notifications', label: '通知', icon: Bell },
  { id: 'appearance', label: '外观与主题', icon: Palette },
  { id: 'content', label: '内容偏好', icon: Filter },
  { id: 'advanced', label: '高级设置', icon: Settings2 },
]

export function SettingsNav({ activeTab, onTabChange }: SettingsNavProps) {
  return (
    <div className="card-bg rounded-2xl p-6 sticky top-8">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          const Icon = item.icon

          return (
            <div
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`settings-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="settings-nav-icon" />
              <span>{item.label}</span>
            </div>
          )
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-xf-bg/40">
        <div className="text-center">
          <div className="text-xs text-xf-primary font-medium mb-2">
            相逢版本
          </div>
          <div className="text-sm text-xf-accent font-bold">
            V2.3.1
          </div>
        </div>
      </div>
    </div>
  )
}
