'use client'

import { SettingsSection } from '../_layout/SettingsSection'
import { SettingItem } from '../_layout/SettingItem'

/**
 * 内容偏好设置区块（Client Component）
 * 
 * 作用: 显示内容偏好设置相关选项
 * 
 * @returns {JSX.Element} 内容偏好设置区块
 * 
 * 使用说明:
 *   显示内容偏好设置选项
 *   处理内容偏好设置交互
 * 
 * 架构说明:
 *   - 使用'use client'指令
 *   - 使用Server Actions进行数据修改
 * 更新时间: 2026-02-22
 */

export function ContentSection() {
  return (
    <SettingsSection id="settings-content-section" title="内容偏好">
      <div className="space-y-8">
        <SettingItem
          label="内容语言"
          description="优先显示指定语言的内容"
          controlType="select"
          control={
            <select className="w-full px-4 py-3 bg-white border border-xf-bg/60 focus:border-xf-primary outline-none rounded-xl">
              <option value="zh-CN">简体中文</option>
              <option value="zh-TW">繁体中文</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          }
        />

      </div>
    </SettingsSection>
  )
}
