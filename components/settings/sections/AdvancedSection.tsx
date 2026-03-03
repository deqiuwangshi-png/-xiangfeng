'use client'

import { SettingsSection } from '../_layout/SettingsSection'
import { SettingItem } from '../_layout/SettingItem'
import { DangerZone } from '../_danger/DangerZone'
import { DeleteAccountCard } from '../_danger/DeleteAccountCard'

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
            <SettingItem
              label="停用账户"
              description="暂时停用你的账户，可以随时恢复"
              controlType="button"
              control={
                <button 
                  disabled
                  className="w-full px-4 py-3 bg-red-50 border border-red-200 text-red-400 rounded-xl font-medium cursor-not-allowed"
                  title="功能开发中"
                >
                  停用账户
                </button>
              }
            />

            {/* 删除账户 */}
            <DeleteAccountCard />
          </div>
        </DangerZone>
      </div>
    </SettingsSection>
  )
}
