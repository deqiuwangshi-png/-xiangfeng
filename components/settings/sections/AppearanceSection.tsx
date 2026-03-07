'use client'

import { SettingsSection } from '../_layout/SettingsSection'
import { SettingItem } from '../_layout/SettingItem'
import { ColorPreview } from '../_ui/ColorPreview'
import { useState } from 'react'
import { PRESET_THEME_COLORS, THEME_MODES } from '@/types/settings'

/**
 * 外观与主题设置区块（Client Component）
 *
 * 作用: 显示外观与主题设置相关选项
 *
 * @returns {JSX.Element} 外观与主题设置区块
 *
 * 使用说明:
 *   显示外观与主题设置选项
 *   处理外观与主题设置交互
 *
 * 架构说明:
 *   - 使用'use client'指令
 *   - 使用Server Actions进行数据修改
 * 更新时间: 2026-02-22
 */

export function AppearanceSection() {
  const [selectedTheme, setSelectedTheme] = useState('light')
  const [selectedColor, setSelectedColor] = useState('#6A5B8A')

  return (
    <SettingsSection id="settings-appearance-section" title="外观与主题">
      <div className="space-y-8">
        <SettingItem
          label="主题模式"
          description="选择界面外观"
          control={
            <div className="flex gap-4">
              {THEME_MODES.map((mode) => (
                <div key={mode.value} className="flex flex-col items-center">
                  <ColorPreview
                    color={mode.previewColor}
                    isActive={selectedTheme === mode.value}
                    onClick={() => setSelectedTheme(mode.value)}
                  />
                  <span className="text-xs mt-2 text-xf-dark">{mode.label}</span>
                </div>
              ))}
            </div>
          }
        />

        <SettingItem
          label="主题颜色"
          description="选择主色调"
          control={
            <div className="flex flex-wrap gap-3">
              {PRESET_THEME_COLORS.map((color) => (
                <div key={color.value} className="flex flex-col items-center">
                  <ColorPreview
                    color={color.value}
                    isActive={selectedColor === color.value}
                    onClick={() => setSelectedColor(color.value)}
                  />
                  <span className="text-xs mt-2 text-xf-dark">{color.label}</span>
                </div>
              ))}
            </div>
          }
        />


      </div>
    </SettingsSection>
  )
}
