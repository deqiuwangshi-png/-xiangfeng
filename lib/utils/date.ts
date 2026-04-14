/**
 * 日期工具函数
 * 
 * 提供日期格式化和计算相关的工具函数
 
 */

/**
 * 将日期转换为相对时间描述
 * 
 * @param date - 日期字符串或Date对象
 * @returns 相对时间描述（如：2天前、5小时前）
 * 
 * @example
 * formatDistanceToNow('2026-03-03T10:00:00Z') // '2天前'
 */
export function formatDistanceToNow(date: string | Date): string {
  const now = new Date()
  const targetDate = typeof date === 'string' ? new Date(date) : date
  
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)
  
  // 小于1分钟
  if (diffInSeconds < 60) {
    return '刚刚'
  }
  
  // 小于1小时
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  }
  
  // 小于24小时
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}小时前`
  }
  
  // 小于30天
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays}天前`
  }
  
  // 小于12个月
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}个月前`
  }
  
  // 大于1年
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears}年前`
}

/**
 * 格式化日期为本地字符串
 * 
 * @param date - 日期字符串或Date对象
 * @param options - 格式化选项
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  return targetDate.toLocaleDateString('zh-CN', options)
}

/**
 * 格式化日期为ISO格式 (yyyy-MM-dd)
 * 
 * @param date - 日期字符串或Date对象
 * @returns ISO格式日期字符串
 * 
 * @example
 * formatDateISO('2026-03-03T10:00:00Z') // '2026-03-03'
 */
export function formatDateISO(date: string | Date): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  const day = String(targetDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 格式化日期为点分隔格式 (yyyy.MM.dd)
 * 
 * @param date - 日期字符串或Date对象
 * @returns 点分隔格式日期字符串
 * 
 * @example
 * formatDateDot('2026-03-03T10:00:00Z') // '2026.03.03'
 */
export function formatDateDot(date: string | Date): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  return targetDate.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).replace(/\//g, '.')
}

/**
 * 格式化日期为短格式 (M月d日)
 * 
 * @param date - 日期字符串或Date对象
 * @returns 短格式日期字符串
 * 
 * @example
 * formatDateShort('2026-03-03T10:00:00Z') // '3月3日'
 */
export function formatDateShort(date: string | Date): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  return targetDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

/**
 * 格式化日期时间
 * 
 * @param date - 日期字符串或Date对象
 * @returns 日期时间字符串
 * 
 * @example
 * formatDateTime('2026-03-03T10:00:00Z') // '2026/03/03 10:00'
 */
export function formatDateTime(date: string | Date): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  return targetDate.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
