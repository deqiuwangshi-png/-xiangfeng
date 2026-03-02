'use client'

import { SettingsSection } from '../SettingsSection'
import { SettingItem } from '../SettingItem'
import { ToggleSwitch } from '../ToggleSwitch'
import { ColorPreview } from '../ColorPreview'
import { useState } from 'react'
import { updateAppearanceSettings } from '@/app/(user)/settings/actions'

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
              <div className="flex flex-col items-center">
                <ColorPreview
                  color="white"
                  isActive={selectedTheme === 'light'}
                  onClick={() => setSelectedTheme('light')}
                />
                <span className="text-xs mt-2 text-xf-dark">浅色</span>
              </div>
              <div className="flex flex-col items-center">
                <ColorPreview
                  color="#25263D"
                  isActive={selectedTheme === 'dark'}
                  onClick={() => setSelectedTheme('dark')}
                />
                <span className="text-xs mt-2 text-xf-dark">深色</span>
              </div>
              <div className="flex flex-col items-center">
                <ColorPreview
                  color="linear-gradient(to bottom right, white, rgba(37, 38, 61, 0.2))"
                  isActive={selectedTheme === 'auto'}
                  onClick={() => setSelectedTheme('auto')}
                />
                <span className="text-xs mt-2 text-xf-dark">自动</span>
              </div>
            </div>
          }
        />

        <SettingItem
          label="主题颜色"
          description="选择主色调"
          control={
            <div className="flex flex-wrap gap-3">
              <ColorPreview
                color="#6A5B8A"
                isActive={selectedColor === '#6A5B8A'}
                onClick={() => setSelectedColor('#6A5B8A')}
              />
              <ColorPreview
                color="#3A3C6E"
                isActive={selectedColor === '#3A3C6E'}
                onClick={() => setSelectedColor('#3A3C6E')}
              />
              <ColorPreview
                color="#4A6FA5"
                isActive={selectedColor === '#4A6FA5'}
                onClick={() => setSelectedColor('#4A6FA5')}
              />
              <ColorPreview
                color="#4CAF50"
                isActive={selectedColor === '#4CAF50'}
                onClick={() => setSelectedColor('#4CAF50')}
              />
              <ColorPreview
                color="#FF9800"
                isActive={selectedColor === '#FF9800'}
                onClick={() => setSelectedColor('#FF9800')}
              />
              <ColorPreview
                color="#9C27B0"
                isActive={selectedColor === '#9C27B0'}
                onClick={() => setSelectedColor('#9C27B0')}
              />
            </div>
          }
        />

        <SettingItem
          label="字体大小"
          description="调整界面字体大小"
          controlType="select"
          control={
            <select className="w-full px-4 py-3 bg-white border border-xf-bg/60 focus:border-xf-primary outline-none rounded-xl" defaultValue="medium">
              <option value="small">较小</option>
              <option value="medium">中等</option>
              <option value="large">较大</option>
              <option value="xlarge">最大</option>
            </select>
          }
        />

        <SettingItem
          label="文章密度"
          description="控制文章列表的间距"
          controlType="select"
          control={
            <select className="w-full px-4 py-3 bg-white border border-xf-bg/60 focus:border-xf-primary outline-none rounded-xl">
              <option value="compact">紧凑</option>
              <option value="normal">标准</option>
              <option value="comfortable">宽松</option>
            </select>
          }
        />
      </div>
    </SettingsSection>
  )
}
