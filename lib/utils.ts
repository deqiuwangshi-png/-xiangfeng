import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 Tailwind CSS 类名
 * 
 * @function cn
 * @param {...ClassValue} inputs - 类名输入
 * @returns {string} 合并后的类名字符串
 * 
 * @description
 * 使用 clsx 和 tailwind-merge 合并 Tailwind CSS 类名
 * 自动处理类名冲突，确保后面的类名优先级更高
 * 
 * @example
 * cn('px-2 py-1', 'px-4') // 返回 'px-4 py-1'
 * cn('text-red-500', isActive && 'text-blue-500') // 根据条件返回类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
