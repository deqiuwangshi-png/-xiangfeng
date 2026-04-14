'use client'

/**
 * SWR 配置 Provider
 * @module components/providers/SWRProvider
 * @description 全局 SWR 缓存配置，提供统一的缓存策略和错误处理
 *
 * @特性
 * - 统一的缓存配置策略
 * - 全局错误处理
 * - 支持乐观更新
 * - 开发环境调试支持
 */

import { SWRConfig, type SWRConfiguration } from 'swr'

/**
 * 全局 fetcher 函数
 * @description 统一的请求处理，支持错误处理和日志记录
 */
const defaultFetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    const error = new Error(`请求失败: ${response.status}`)
    throw error
  }
  return response.json()
}

/**
 * 全局错误处理
 * @description 统一处理 SWR 请求错误
 */
const handleError = (error: Error, key: string) => {
  // 只在客户端显示错误提示
  if (typeof window !== 'undefined') {
    // 避免重复显示相同的错误
    console.error(`[SWR Error] Key: ${key}`, error)
  }
}

/**
 * SWR 全局配置
 * @constant swrConfig
 * @description 统一的缓存策略配置
 *
 * @缓存策略说明
 * - revalidateOnFocus: false    // 切换标签页不重新获取，减少不必要的请求
 * - revalidateOnReconnect: true // 网络重连时刷新，确保数据最新
 * - dedupingInterval: 600000    // 10分钟去重，减少重复请求
 * - errorRetryCount: 3          // 错误重试3次，提高成功率
 * - errorRetryInterval: 5000    // 重试间隔5秒，避免频繁重试
 * - keepPreviousData: true      // 保持旧数据，避免加载闪烁
 * - revalidateIfStale: false    // 有缓存时不自动重新验证
 */
const swrConfig: SWRConfiguration = {
  /** 数据获取函数 */
  fetcher: defaultFetcher,
  
  /** 切换标签页时不重新获取数据 */
  revalidateOnFocus: false,
  
  /** 网络重连时重新获取数据 */
  revalidateOnReconnect: true,
  
  /** 10分钟内重复请求去重 */
  dedupingInterval: 600000,
  
  /** 错误重试次数 */
  errorRetryCount: 3,
  
  /** 错误重试间隔（毫秒） */
  errorRetryInterval: 5000,
  
  /** 保持旧数据，避免加载闪烁 */
  keepPreviousData: true,
  
  /** 有缓存时不在挂载时重新验证 */
  revalidateIfStale: false,
  
  /** 全局错误处理 */
  onError: handleError,
  
  /** 错误重试条件 */
  shouldRetryOnError: (err) => {
    // 只在网络错误或 5xx 错误时重试
    if (err.status >= 500) return true
    if (err.message?.includes('network')) return true
    return false
  },
}

/**
 * 开发环境配置
 * @description 开发环境添加额外的调试支持
 */
const devConfig: SWRConfiguration = {
  ...swrConfig,
  // 开发环境缩短去重时间，方便调试
  dedupingInterval: 10000, // 10秒
}

/**
 * SWR Provider 组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @returns {JSX.Element} SWR Provider
 */
export function SWRProvider({ children }: { children: React.ReactNode }) {
  // 根据环境选择配置
  const config = process.env.NODE_ENV === 'development' ? devConfig : swrConfig

  return (
    <SWRConfig value={config}>
      {children}
    </SWRConfig>
  )
}

/**
 * 预设配置
 * @description 提供常用的缓存配置预设
 */
export const SWR_PRESETS = {
  /** 
   * 默认配置 
   * 适用于大多数场景
   */
  default: swrConfig,
  
  /** 
   * 短缓存配置 
   * 适用于频繁变化的数据，如积分、通知
   */
  short: {
    ...swrConfig,
    dedupingInterval: 60000, // 1分钟
    revalidateOnFocus: true,
  } as SWRConfiguration,
  
  /** 
   * 长缓存配置 
   * 适用于稳定的数据，如用户配置、商品列表
   */
  long: {
    ...swrConfig,
    dedupingInterval: 600000, // 10分钟
    revalidateOnReconnect: false,
  } as SWRConfiguration,
  
  /** 
   * 禁用自动验证配置 
   * 适用于手动控制的数据，如草稿编辑
   */
  noRevalidate: {
    ...swrConfig,
    revalidateOnMount: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  } as SWRConfiguration,
  
  /**
   * 实时数据配置
   * 适用于需要实时更新的数据，如消息、通知
   */
  realtime: {
    ...swrConfig,
    dedupingInterval: 5000, // 5秒
    revalidateOnFocus: true,
    refreshInterval: 30000, // 30秒轮询
  } as SWRConfiguration,
} as const

export type SWRPreset = keyof typeof SWR_PRESETS

/**
 * 获取预设配置
 * @param preset - 预设名称
 * @returns SWR 配置对象
 */
export function getSWRPreset(preset: SWRPreset): SWRConfiguration {
  return SWR_PRESETS[preset]
}

export default SWRProvider
