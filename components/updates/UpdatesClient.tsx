/**
 * 更新日志客户端组件
 * 
 * 作用: 处理更新日志页面的客户端交互逻辑
 * 
 * @returns {JSX.Element} 更新日志客户端组件
 * 
 * 使用说明:
 *   用于处理更新日志页面的客户端交互
 *   支持按类型筛选和关键词搜索
 *   严格遵循更新日志.html原型文件样式
 * 
 * 页面结构:
 *   - 头部：标题、描述、当前版本卡片
 *   - 筛选按钮：全部更新、新功能、改进优化、问题修复
 *   - 更新日志内容：按月份分组的版本卡片
 * 
 * 样式特点（严格遵循原型）:
 *   - 主容器：max-w-4xl mx-auto px-4 py-8
 *   - 头部区域：mb-10
 *   - 图标容器：w-10 h-10 rounded-lg bg-xf-accent
 *   - 页面标题：text-2xl font-serif font-bold text-xf-accent
 *   - 当前版本卡片：bg-white rounded-xl p-5 border border-xf-light
 *   - 筛选按钮区域：mb-6
 *   - 筛选按钮：px-4 py-2 rounded-lg text-sm font-medium
 *   - 月份标题：flex items-center gap-3 mb-4
 *   - 版本卡片：bg-white rounded-xl p-5 border border-xf-light mb-5
 * 
 * 更新时间: 2026-02-20
 */

'use client'

import { GitMerge } from 'lucide-react'
import { useUpdates } from '@/hooks/useUpdates'
import { UpdateService } from '@/lib/updates/updateService'
import { LATEST_VERSION } from '@/constants/updates'
import { FilterButton, VersionCard, MonthHeader } from '@/components/updates'
import { UpdateType } from '@/types/updates'
import { MonthlyUpdate } from '@/types/updates'

/**
 * 更新日志客户端组件
 * 
 * @function UpdatesClient
 * @param {Object} props - 组件属性
 * @param {MonthlyUpdate[]} props.initialUpdates - 初始更新数据
 * @param {string} props.latestVersion - 最新版本号
 * @returns {JSX.Element} 更新日志客户端组件
 * 
 * @description
 * 显示产品的更新日志，包含：
 * - 头部：标题、描述、当前版本卡片
 * - 筛选按钮：全部更新、新功能、改进优化、问题修复
 * - 更新日志内容：按月份分组的版本卡片
 * 
 * @features
 * - 按类型筛选更新
 * - 按关键词搜索更新
 * - 显示最新版本
 * - 按月份分组显示
 * 
 * @styles
 * 严格遵循更新日志.html原型文件样式
 */
export function UpdatesClient({ initialUpdates, latestVersion }: { initialUpdates: MonthlyUpdate[], latestVersion: string }) {
  const { updates, filteredUpdates, activeFilter, handleFilterChange } = useUpdates(initialUpdates)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 头部 */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-xf-accent flex items-center justify-center">
            <GitMerge className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-xf-accent">更新日志</h1>
            <p className="text-xf-medium">了解相逢的最新功能、改进和问题修复</p>
          </div>
        </div>
        
        {/* 当前版本卡片 */}
        <div className="bg-white rounded-xl p-5 border border-xf-light">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-xf-dark mb-1">当前版本</h3>
              <p className="text-xf-medium">相逢 <span className="font-bold text-xf-accent">{LATEST_VERSION}</span></p>
            </div>
            <div className="px-4 py-2 bg-xf-accent/10 text-xf-accent rounded-lg text-sm font-medium">
              最新稳定版
            </div>
          </div>
        </div>
      </div>

      {/* 筛选按钮 */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <FilterButton
            type="all"
            label="全部更新"
            isActive={activeFilter === 'all'}
            onClick={handleFilterChange}
          />
          <FilterButton
            type={UpdateType.NEW}
            label="新功能"
            isActive={activeFilter === UpdateType.NEW}
            onClick={handleFilterChange}
          />
          <FilterButton
            type={UpdateType.IMPROVED}
            label="改进优化"
            isActive={activeFilter === UpdateType.IMPROVED}
            onClick={handleFilterChange}
          />
          <FilterButton
            type={UpdateType.FIXED}
            label="问题修复"
            isActive={activeFilter === UpdateType.FIXED}
            onClick={handleFilterChange}
          />
        </div>
      </div>

      {/* 更新日志内容 */}
      <div className="space-y-6">
        {filteredUpdates.map((update, index) => (
          <div key={`${update.year}-${update.month}`}>
            <MonthHeader
              year={update.year}
              month={update.month}
              isFirst={index === 0}
            />
            
            {update.versions.map((version, vIndex) => (
              <VersionCard key={vIndex} version={version} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
