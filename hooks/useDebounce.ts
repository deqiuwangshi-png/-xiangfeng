/**
 * 防抖 Hook
 * @module hooks/useDebounce
 * @description 提供函数防抖功能的通用 Hook，用于限制函数执行频率
 *
 * @特性
 * - 使用 useCallback 缓存防抖函数，避免不必要的重渲染
 * - 使用 useRef 保存定时器引用，确保正确清理
 * - 组件卸载时自动清理定时器，防止内存泄漏
 * - 支持任意参数类型的函数
 *
 * @性能优化
 * - 使用 useCallback 确保返回的函数引用稳定
 * - 延迟时间变化时重置防抖状态
 */

'use client'

import { useCallback, useRef, useEffect } from 'react'

/**
 * useDebounce Hook
 *
 * @description 对传入的函数进行防抖处理，在指定延迟时间内只执行最后一次调用
 *
 * @template T - 被防抖的函数类型
 * @param {T} fn - 需要防抖的原始函数
 * @param {number} delay - 防抖延迟时间（毫秒）
 * @returns {T} 防抖处理后的函数
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  // 使用 useRef 保存定时器 ID，确保在多次渲染间保持稳定引用
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 组件卸载时清理定时器，防止内存泄漏
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  // 使用 useCallback 缓存防抖函数，避免每次渲染都创建新函数
  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      // 清除之前的定时器
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      // 设置新的定时器
      timerRef.current = setTimeout(() => {
        fn(...args)
      }, delay)
    },
    [fn, delay] // 依赖项：当原始函数或延迟时间变化时重新创建防抖函数
  )

  return debouncedFn as T
}

export default useDebounce
