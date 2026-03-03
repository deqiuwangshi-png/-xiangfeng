'use client'

/**
 * 字符计数组件
 * 
 * 作用: 显示文章内容的字符计数
 * 
 * @param {number} titleLength - 标题字符数
 * @param {number} contentLength - 内容字符数
 * 
 * @returns {JSX.Element} 字符计数组件
 * 
 * 使用说明:
 *   用于编辑器的字符计数显示
 *   显示当前字符数和建议字数
 * 
 * 交互说明:
 *   - 静态显示组件
 *   - 根据字符数显示不同的颜色提示
 * 
 * 依赖:
 *   - react (React组件)
 * 
 * 数据来源: docs/08原型文件设计图/发布.html
 * 
 * 更新时间: 2026-02-19
 */

interface CharacterCounterProps {
  titleLength: number
  contentLength: number
}

/**
 * 字符计数组件
 * 
 * @function CharacterCounter
 * @param {CharacterCounterProps} props - 组件属性
 * @returns {JSX.Element} 字符计数组件
 * 
 * @description
 * 显示文章内容的字符计数，包括：
 * - 当前字符数（标题+内容）
 * - 建议字数提示
 * - 根据字符数显示不同的颜色提示
 * 
 * @props
 * - titleLength: 标题字符数
 * - contentLength: 内容字符数
 */
export function CharacterCounter({ titleLength, contentLength }: CharacterCounterProps) {
  const totalLength = titleLength + contentLength

  const getCounterClass = () => {
    if (totalLength > 20000) return 'text-red-500 font-medium'
    if (totalLength > 15000) return 'text-red-500 font-medium'
    if (totalLength > 10000) return 'text-xf-warning'
    if (totalLength > 5000) return 'text-xf-warning'
    if (totalLength < 500) return 'text-xf-warning'
    return ''
  }

  const getHint = () => {
    if (totalLength === 0) return '建议字数：500-5000字'
    if (totalLength > 20000) return '已超过最大字数限制'
    if (totalLength > 15000) return '接近字数上限'
    if (totalLength > 10000) return '字数较多，建议精简'
    if (totalLength > 5000) return '字数适中'
    if (totalLength < 500) return '内容较短，建议充实'
    return '字数合适'
  }

  return (
    <div className={`text-xf-medium text-sm py-4 px-6 flex items-center justify-between border-t border-xf-light mt-6 ${getCounterClass()}`}>
      <span id="char-count">{totalLength}</span>
      <span>字</span>
      <span className="text-xs opacity-70" id="content-hint">{getHint()}</span>
    </div>
  )
}
