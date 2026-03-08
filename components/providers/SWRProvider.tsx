'use client'

/**
 * SWR 配置 Provider
 * @module components/providers/SWRProvider
 * @description 全局 SWR 缓存配置，用于福利中心等高频页面
 */

import { SWRConfig } from 'swr'

/**
 * SWR 全局配置
 * @constant swrConfig
 */
const swrConfig = {
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
}

/**
 * SWR Provider 组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @returns {JSX.Element} SWR Provider
 */
export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  )
}
