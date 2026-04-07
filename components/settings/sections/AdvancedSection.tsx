'use client'

import {
  SettingsSection,
  SettingItem,
  DangerZone,
  DeactivateAccountCard,
  DeleteAccountCard,
} from '@/components/settings'

/**
 * 高级设置区块（Client Component）
 * 
 * 作用: 显示高级设置相关选项和危险区域
 * 
 * @returns {JSX.Element} 高级设置区块
 * 
 * 使用说明:
 *   显示高级设置选项
 *   显示危险操作区域（停用账户、删除账户）
 * 
 * 架构说明:
 *   - 使用'use client'指令
 *   - 删除账户使用 DeleteAccountCard 组件
 * 更新时间: 2026-03-02
 */

export function AdvancedSection() {
  return (
    <SettingsSection id="settings-advanced-section" title="高级设置">
      <div className="space-y-8">
        <SettingItem
          label="重置所有设置"
          description="将所有设置恢复为默认值"
          controlType="button"
          control={
            <button className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all">
              重置设置
            </button>
          }
        />

        {/* 危险操作区域 */}
        <DangerZone title="危险区域">
          <div className="space-y-6">
            {/* 停用账户 */}
            <DeactivateAccountCard />

            {/* 删除账户 */}
            <DeleteAccountCard />
          </div>
        </DangerZone>
      </div>
    </SettingsSection>
  )
}
