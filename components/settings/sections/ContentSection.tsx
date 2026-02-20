'use client'

import { SettingsSection } from '../SettingsSection'
import { SettingItem } from '../SettingItem'
import { ToggleSwitch } from '../ToggleSwitch'

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
 * 
 * 样式说明:
 *   - 严格遵循HTML原型文件样式
 *   - 使用Tailwind CSS v4语法
 *   - 像素级还原原型设计
 * 
 * 更新时间: 2026-02-20
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

        <SettingItem
          label="内容过滤"
          description="过滤可能包含敏感内容"
          control={<ToggleSwitch checked={true} onChange={() => {}} />}
        />

        <SettingItem
          label="自动播放媒体"
          description="自动播放视频和音频内容"
          control={<ToggleSwitch checked={false} onChange={() => {}} />}
        />

        <SettingItem
          label="个性化推荐"
          description="基于你的兴趣推荐内容"
          controlType="button"
          control={
            <button className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all">
              管理兴趣标签
            </button>
          }
        />

        <SettingItem
          label="重置兴趣模型"
          description="清除你的兴趣记录，重新开始"
          controlType="button"
          control={
            <button className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all">
              重置兴趣
            </button>
          }
        />
      </div>
    </SettingsSection>
  )
}
