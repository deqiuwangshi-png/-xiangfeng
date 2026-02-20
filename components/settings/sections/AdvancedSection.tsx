'use client'

import { SettingsSection } from '../SettingsSection'
import { SettingItem } from '../SettingItem'
import { ToggleSwitch } from '../ToggleSwitch'
import { DangerZone } from '../DangerZone'

/**
 * 高级设置区块（Client Component）
 * 
 * 作用: 显示高级设置相关选项和危险区域
 * 
 * @returns {JSX.Element} 高级设置区块
 * 
 * 使用说明:
 *   显示高级设置选项
 *   显示危险操作区域
 *   处理高级设置交互
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

export function AdvancedSection() {
  return (
    <SettingsSection id="settings-advanced-section" title="高级设置">
      <div className="space-y-8">
        <SettingItem
          label="开发者选项"
          description="显示开发者工具和选项"
          control={<ToggleSwitch checked={false} onChange={() => {}} />}
        />

        <SettingItem
          label="清除缓存"
          description="清除本地缓存数据"
          controlType="button"
          control={
            <button className="w-full px-4 py-3 bg-white border border-xf-bg/60 hover:bg-xf-light text-xf-primary rounded-xl font-medium transition-all">
              清除缓存
            </button>
          }
        />

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

        <DangerZone title="危险区域">
          <div className="space-y-8">
            <SettingItem
              label="停用账户"
              description="暂时停用你的账户，可以随时恢复"
              controlType="button"
              control={
                <button className="w-full px-4 py-3 bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-all">
                  停用账户
                </button>
              }
            />

            <SettingItem
              label="删除账户"
              description="永久删除你的账户和所有数据，无法恢复"
              controlType="button"
              control={
                <button className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all">
                  删除账户
                </button>
              }
            />
          </div>
        </DangerZone>
      </div>
    </SettingsSection>
  )
}
