/**
 * 等级标志组件 - 数字徽章样式
 * @module components/user/LevelBadge
 * @description 显示用户等级徽章 Lv.x，水平排列在用户名旁
 */

/**
 * 等级颜色配置 - 根据12级体系分级显示
 * 1-3级（新手期）：灰色系
 * 4-6级（成长期）：绿色/青色系
 * 7-9级（进阶期）：紫色/粉色系
 * 10-12级（大师期）：橙/金色系
 */
const LEVEL_STYLES: Record<number, { bg: string; text: string; border: string }> = {
  // 新手期
  1: { bg: 'bg-stone-100', text: 'text-stone-600', border: 'border-stone-300' },
  2: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' },
  3: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  // 成长期
  4: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  5: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
  6: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
  // 进阶期
  7: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
  8: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  9: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  // 大师期
  10: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  11: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  12: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300' },
}

/**
 * 等级名称映射
 */
const LEVEL_NAMES: Record<number, string> = {
  1: '边界旅人',
  2: '渡口行者',
  3: '跨界渡客',
  4: '脉络测绘师',
  5: '深度潜航员',
  6: '联结建筑师',
  7: '迷雾破译者',
  8: '范式探险家',
  9: '认知策展人',
  10: '思想炼金师',
  11: '边界重塑者',
  12: '改变发生者',
}

interface LevelBadgeProps {
  /** 用户等级 1-12 */
  level: number
  /** 是否显示等级名称 */
  showName?: boolean
  /** 尺寸：sm(小) / md(中) / lg(大) */
  size?: 'sm' | 'md' | 'lg'
  /** 额外的CSS类名 */
  className?: string
}

/**
 * 尺寸配置映射
 */
const SIZE_CONFIG = {
  sm: { text: 'text-[10px]', px: 'px-1.5', py: 'py-0', height: 'h-4' },
  md: { text: 'text-xs', px: 'px-2', py: 'py-0.5', height: 'h-5' },
  lg: { text: 'text-sm', px: 'px-2.5', py: 'py-0.5', height: 'h-6' },
} as const

/**
 * 等级徽章组件
 * @param {LevelBadgeProps} props - 组件属性
 * @returns {JSX.Element} 等级徽章组件
 *
 * @example
 * <LevelBadge level={5} />
 *
 * @example
 * <LevelBadge level={8} showName size="lg" />
 */
export function LevelBadge({
  level,
  showName = false,
  size = 'md',
  className = '',
}: LevelBadgeProps) {
  // 确保等级在有效范围内
  const validLevel = Math.max(1, Math.min(12, level))
  const styles = LEVEL_STYLES[validLevel]
  const levelName = LEVEL_NAMES[validLevel]
  const sizeConfig = SIZE_CONFIG[size]

  return (
    <span
      className={`
        inline-flex items-center gap-1
        ${sizeConfig.text} ${sizeConfig.px} ${sizeConfig.py} ${sizeConfig.height}
        ${styles.bg} ${styles.text} ${styles.border}
        border rounded-md font-medium
        whitespace-nowrap
        ${className}
      `}
      title={`${levelName} (Lv.${validLevel})`}
    >
      <span className="opacity-75">Lv.</span>
      <span className="font-bold">{validLevel}</span>
      {showName && (
        <span className="ml-1 opacity-90 hidden sm:inline">{levelName}</span>
      )}
    </span>
  )
}
