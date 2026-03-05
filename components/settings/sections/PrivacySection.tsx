'use client'

import { SettingsSection } from '../_layout/SettingsSection'
import { SettingItem } from '../_layout/SettingItem'

/**
 * 隐私与安全设置区块（Client Component）
 * 
 * 作用: 显示隐私与安全设置相关选项
 * 
 * @returns {JSX.Element} 隐私与安全设置区块
 * 
 * 使用说明:
 *   显示隐私与安全设置选项
 *   处理隐私与安全设置交互
 * 
 * 架构说明:
 *   - 使用'use client'指令
 *   - 使用Server Actions进行数据修改
 * 更新时间: 2026-02-22
 */

export function PrivacySection() {
  return (
    <SettingsSection id="settings-privacy-section" title="隐私与安全">
      <div className="space-y-8">
        <SettingItem
          label="个人资料可见性"
          description="谁可以看到你的个人资料和活动"
          controlType="select"
          control={
            <select className="w-full px-4 py-3 bg-white border border-xf-bg/60 focus:border-xf-primary outline-none rounded-xl">
              <option value="public">所有人可见</option>
              <option value="community">仅社区成员可见</option>
              <option value="followers">仅关注者可见</option>
              <option value="private">仅自己可见</option>
            </select>
          }
        />
        <SettingItem
          label="允许私信"
          description="谁可以向你发送私信"
          controlType="select"
          control={
            <select className="w-full px-4 py-3 bg-white border border-xf-bg/60 focus:border-xf-primary outline-none rounded-xl">
              <option value="everyone">所有人</option>
              <option value="followers">仅关注者</option>
              <option value="mutuals">互相关注</option>
              <option value="none">不允许</option>
            </select>
          }
        />
        <SettingItem
          label="登录历史"
          description="查看最近的登录活动"
          controlType="button"
          control={
            <button className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all">
              查看登录历史
            </button>
          }
        />
      </div>
    </SettingsSection>
  )
}
