/**
 * 月份标题组件
 * 
 * 作用: 显示月份标题
 * 
 * @param {number} year - 年份
 * @param {number} month - 月份
 * @param {boolean} isFirst - 是否为第一个月份
 * @returns {JSX.Element} 月份标题组件
 * 更新时间: 2026-02-19
 */

/**
 * 月份标题组件
 * 
 * @function MonthHeader
 * @param {Object} props - 组件属性
 * @param {number} props.year - 年份
 * @param {number} props.month - 月份
 * @param {boolean} props.isFirst - 是否为第一个月份
 * @returns {JSX.Element} 月份标题组件
 * 
 * @description
 * 显示月份分组标题，包含指示点和标题文本
 * 
 * @styles
 * - 容器：flex items-center gap-3 mb-4
 * - 指示点：w-2 h-2 rounded-full
 * - 指示点颜色：第一个月份为 bg-xf-accent，其他为 bg-xf-primary
 * - 标题：text-xl font-bold text-xf-accent
 * - 标题格式：YYYY年MM月
 */
export function MonthHeader({
  year,
  month,
  isFirst = false
}: {
  year: number
  month: number
  isFirst?: boolean
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-2 h-2 rounded-full ${isFirst ? 'bg-xf-accent' : 'bg-xf-primary'}`} />
      <h2 className="text-xl font-bold text-xf-accent">
        {year}年{month}月
      </h2>
    </div>
  )
}
