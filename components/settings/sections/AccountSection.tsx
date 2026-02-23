'use client'

import { SettingsSection } from '../SettingsSection'
import { SettingItem } from '../SettingItem'

/**
 * 账户设置区块（Client Component）
 * 
 * 作用: 显示账户设置相关选项
 * 
 * @returns {JSX.Element} 账户设置区块
 * 
 * 使用说明:
 *   显示账户设置选项
 *   处理账户设置交互
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

export function AccountSection() {
  return (
    <SettingsSection id="settings-account-section" title="账户设置">
      <div className="space-y-8">
        <SettingItem
          label="个人资料"
          description="更新你的个人信息和头像"
          controlType="button"
          control={
            <button className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all">
              编辑个人资料
            </button>
          }
        />

        <SettingItem
          label="账号安全"
          description="管理密码和双重验证"
          controlType="button"
          control={
            <button className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all">
              管理安全设置
            </button>
          }
        />

        <SettingItem
          label="邮箱地址"
          description="felix@example.com"
          controlType="button"
          control={
            <button className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all">
              更换邮箱
            </button>
          }
        />

        <SettingItem
          label="关联账号"
          description="管理你的社交媒体关联"
          controlType="button"
          control={
            <button className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all">
              管理关联账号
            </button>
          }
        />

      </div>
    </SettingsSection>
  )
}
