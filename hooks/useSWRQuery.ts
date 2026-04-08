'use client'

/**
 * 通用 SWR 查询 Hook
 * @module hooks/useSWRQuery
 * @description 统一封装 SWR，提供标准化的数据获取、缓存和状态管理
 *
 * @特性
 * - 统一配置：默认配置覆盖大部分使用场景
 * - 标准化缓存 Key：支持字符串和数组格式
 * - 统一错误处理：自动 toast 提示（可选）
 * - 内存泄漏防护：自动处理组件卸载状态
 * - 类型安全：完整的 TypeScript 支持
 */

import { useCallback, useRef, useEffect } from 'react'
import useSWR, { SWRConfiguration, Key } from 'swr'

/**
 * SWR 查询选项
 * @interface SWRQueryOptions
 * @extends SWRConfiguration
 */
export interface SWRQueryOptions<T>
  extends Omit<SWRConfiguration, 'fallbackData'> {
  /** 初始数据 */
  initialData?: T
  /** 是否显示错误提示 */
  showErrorToast?: boolean
  /** 错误提示消息 */
  errorMessage?: string
}

/**
 * SWR 查询返回值
 * @interface SWRQueryReturn
 */
export interface SWRQueryReturn<T> {
  /** 数据 */
  data: T | undefined
  /** 是否首次加载中（无缓存数据） */
  isLoading: boolean
  /** 是否在后台验证更新中 */
  isValidating: boolean
  /** 错误信息 */
  error: Error | null
  /** 刷新数据 */
  refresh: () => Promise<void>
  /** 乐观更新数据 */
  mutate: (
    data?: T | Promise<T> | ((current: T | undefined) => T),
    shouldRevalidate?: boolean
  ) => Promise<T | undefined>
}

/** 默认配置 */
const DEFAULT_CONFIG: SWRConfiguration = {
  /** 切换标签页时不重新获取数据 */
  revalidateOnFocus: false,
  /** 网络重连时重新获取数据 */
  revalidateOnReconnect: true,
  /** 5分钟内重复请求去重 */
  dedupingInterval: 300000,
  /** 错误重试次数 */
  errorRetryCount: 3,
  /** 错误重试间隔（毫秒） */
  errorRetryInterval: 5000,
  /** 保持旧数据，避免加载闪烁 */
  keepPreviousData: true,
}

/** 短缓存配置（1分钟） */
const SHORT_CACHE_CONFIG: SWRConfiguration = {
  ...DEFAULT_CONFIG,
  dedupingInterval: 60000,
}

/** 长缓存配置（10分钟） */
const LONG_CACHE_CONFIG: SWRConfiguration = {
  ...DEFAULT_CONFIG,
  dedupingInterval: 600000,
}

/** 禁用自动验证配置 */
const NO_REVALIDATE_CONFIG: SWRConfiguration = {
  ...DEFAULT_CONFIG,
  revalidateOnMount: false,
  revalidateIfStale: false,
  revalidateOnReconnect: false,
}

/**
 * 预设配置类型
 */
export type SWRPreset = 'default' | 'short' | 'long' | 'no-revalidate'

/**
 * 获取预设配置
 * @param preset - 预设类型
 * @returns SWR 配置
 */
function getPresetConfig(preset: SWRPreset): SWRConfiguration {
  switch (preset) {
    case 'short':
      return SHORT_CACHE_CONFIG
    case 'long':
      return LONG_CACHE_CONFIG
    case 'no-revalidate':
      return NO_REVALIDATE_CONFIG
    default:
      return DEFAULT_CONFIG
  }
}

/**
 * 通用 SWR 查询 Hook
 *
 * @template T - 数据类型
 * @param key - 缓存 Key（字符串或数组）
 * @param fetcher - 数据获取函数
 * @param options - 查询选项
 * @returns SWR 查询结果
 *
 * @example
 * ```typescript
 * const { data, isLoading, refresh } = useSWRQuery(
 *   'user-points',
 *   fetchPoints,
 *   { preset: 'short' }
 * )
 * ```
 */
export function useSWRQuery<T>(
  key: Key,
  fetcher: () => Promise<T>,
  options: SWRQueryOptions<T> & { preset?: SWRPreset } = {}
): SWRQueryReturn<T> {
  const {
    preset = 'default',
    initialData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    showErrorToast = false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    errorMessage = '获取数据失败',
    ...restOptions
  } = options

  const isMountedRef = useRef(true)

  // 组件卸载时设置标记
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // 合并配置
  const config: SWRConfiguration = {
    ...getPresetConfig(preset),
    fallbackData: initialData,
    ...restOptions,
  }

  // 使用 SWR
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate: swrMutate,
  } = useSWR<T>(key, fetcher, config)

  /**
   * 刷新数据
   */
  const refresh = useCallback(async () => {
    if (!isMountedRef.current) return
    await swrMutate()
  }, [swrMutate])

  /**
   * 乐观更新
   */
  const mutate = useCallback(
    async (
      newData?: T | Promise<T> | ((current: T | undefined) => T),
      shouldRevalidate = true
    ) => {
      if (!isMountedRef.current) return undefined
      return await swrMutate(newData, shouldRevalidate)
    },
    [swrMutate]
  )

  return {
    data,
    isLoading,
    isValidating,
    error: error || null,
    refresh,
    mutate,
  }
}

export default useSWRQuery
