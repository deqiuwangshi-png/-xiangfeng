/**
 * 版本卡片组件
 * 
 * 作用: 显示单个版本的更新信息
 * 
 * @param {VersionInfo} version - 版本信息
 * @returns {JSX.Element} 版本卡片组件
 * 更新时间: 2026-02-19
 */

import { VersionInfo } from '@/types/user/updates'
import { VERSION_TAG_COLORS } from '@/constants/updates'
import { UpdateItemComponent } from './UpdateItem'

/**
 * 版本卡片组件
 * 
 * @function VersionCard
 * @param {Object} props - 组件属性
 * @param {VersionInfo} props.version - 版本信息
 * @returns {JSX.Element} 版本卡片组件
 * 
 * @description
 * 显示单个版本的更新信息，包含：
 * - 版本号和日期
 * - 版本标题
 * - 更新条目列表
 * 
 * @styles
 * - 卡片容器：bg-white rounded-xl p-5 border border-xf-light mb-5
 * - 版本标题行：flex items-center justify-between mb-4 pb-3 border-b border-xf-light
 * - 版本标签：px-3 py-1 rounded-lg text-sm font-medium text-white
 * - 版本标签背景：根据版本类型显示不同颜色
 *   - 主版本/次版本：bg-xf-accent
 *   - 补丁版本：bg-xf-primary
 * - 发布日期：text-sm text-xf-medium
 * - 版本标题：font-bold text-lg text-xf-dark mb-4
 * - 更新条目容器：space-y-3
 */
export function VersionCard({ version }: { version: VersionInfo }) {
  const tagColor = VERSION_TAG_COLORS[version.versionType]

  return (
    <div className="bg-white rounded-xl p-5 border border-xf-light mb-5">
      {/* 版本标题行 */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-xf-light">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 ${tagColor} text-white rounded-lg text-sm font-medium`}>
            {version.version}
          </span>
          <span className="text-sm text-xf-medium">{version.date}</span>
        </div>
      </div>
      
      {/* 版本标题 */}
      <h3 className="font-bold text-lg text-xf-dark mb-4">
        {version.title}
      </h3>
      
      {/* 更新条目 */}
      <div className="space-y-3">
        {version.updates.map((item) => (
          <UpdateItemComponent key={`${item.type}-${item.description}`} item={item} />
        ))}
      </div>
    </div>
  )
}
