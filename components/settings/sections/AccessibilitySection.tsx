'use client'

import { SettingsSection } from '../SettingsSection'
import { SettingItem } from '../SettingItem'
import { ToggleSwitch } from '../ToggleSwitch'

/**
 * 无障碍访问设置区块（Client Component）
 * 
 * 作用: 显示无障碍访问设置相关选项
 * 
 * @returns {JSX.Element} 无障碍访问设置区块
 * 
 * 使用说明:
 *   显示无障碍访问设置选项
 *   处理无障碍访问设置交互
 * 
 * 架构说明:
 *   - 使用'use client'指令
 *   - 使用Server Actions进行数据修改
 * 
 * 样式说明:
 *   - 严格遵循HTML原型文件样式
 *   - 使用Tailwind CSS v4语法
 *   - 像素级还原原型设计
 * 
 * 更新时间: 2026-02-20
 */

export function AccessibilitySection() {
  return (
    <SettingsSection id="settings-accessibility-section" title="无障碍访问">
      <div className="space-y-8">
        <SettingItem
          label="减少动画"
          description="减少界面动画效果"
          control={<ToggleSwitch checked={false} onChange={() => {}} />}
        />

        <SettingItem
          label="高对比度模式"
          description="增强界面元素之间的对比度"
          control={<ToggleSwitch checked={false} onChange={() => {}} />}
        />

        <SettingItem
          label="屏幕阅读器优化"
          description="优化界面元素供屏幕阅读器使用"
          control={<ToggleSwitch checked={true} onChange={() => {}} />}
        />

        <SettingItem
          label="键盘导航快捷键"
          description="查看支持的键盘快捷键"
          controlType="button"
          control={
            <button className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all">
              查看快捷键
            </button>
          }
        />
      </div>
    </SettingsSection>
  )
}
