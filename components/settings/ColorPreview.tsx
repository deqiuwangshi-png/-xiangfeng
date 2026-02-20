'use client'

/**
 * 颜色预览组件（Client Component）
 * 
 * 作用: 显示颜色预览并处理颜色选择
 * 
 * @param {string} color - 颜色值
 * @param {boolean} isActive - 颜色是否激活
 * @param {function} onClick - 颜色点击回调函数
 * @returns {JSX.Element} 颜色预览组件
 * 
 * 使用说明:
 *   显示颜色预览
 *   处理颜色选择
 *   调用Server Action更新主题颜色
 * 
 * 架构说明:
 *   - 使用'use client'指令
 *   - 接收颜色值和激活状态
 *   - 使用Server Action更新数据
 * 
 * 样式说明:
 *   - 严格遵循HTML原型文件样式
 *   - 使用Tailwind CSS v4语法
 *   - 像素级还原原型设计
 * 
 * 更新时间: 2026-02-20
 */

interface ColorPreviewProps {
  color: string
  isActive: boolean
  onClick: () => void
}

export function ColorPreview({ color, isActive, onClick }: ColorPreviewProps) {
  return (
    <div
      onClick={onClick}
      className={`color-preview ${isActive ? 'active' : ''}`}
      style={{ backgroundColor: color }}
    />
  )
}
