/**
 * 统一乐观更新 Hook
 * @module hooks/useOptimisticMutation
 * @description 提供标准化的乐观更新、回滚和错误处理能力
 *
 * @特性
 * - 自动乐观更新 UI
 * - 失败自动回滚
 * - 支持关联缓存刷新
 * - 统一的错误处理和提示
 * - 防止重复提交
 * - 完整的 TypeScript 类型支持
 *
 * @使用示例
 * ```typescript
 * const { mutate, isMutating } = useOptimisticMutation({
 *   cacheKey: CACHE_KEYS.ARTICLE.DRAFTS,
 *   mutationFn: deleteDraft,
 *   optimisticUpdater: (drafts, id) => drafts?.filter(d => d.id !== id),
 *   successMessage: '删除成功',
 *   relatedKeys: [CACHE_KEYS.USER.POINTS_OVERVIEW],
 * })
 * ```
 */

'use client'

import { useCallback, useRef, useState } from 'react'
import { useSWRConfig } from 'swr'
import { toast } from 'sonner'
import type { CacheKey } from '@/lib/cache/keys'
import { getCacheKeyString, getCacheDependencies } from '@/lib/cache/keys'

/**
 * 乐观更新选项
 * @interface UseOptimisticMutationOptions
 */
interface UseOptimisticMutationOptions<TData, TVariables> {
  /** 
   * 缓存 Key 
   * 可以是字符串或数组格式
   */
  cacheKey: CacheKey
  
  /** 
   * 更新函数 
   * 执行实际的 API 请求
   */
  mutationFn: (variables: TVariables) => Promise<TData>
  
  /** 
   * 乐观更新函数 
   * 根据当前数据和变量计算乐观更新后的数据
   */
  optimisticUpdater?: (
    currentData: TData | undefined,
    variables: TVariables
  ) => TData | undefined
  
  /** 
   * 成功时刷新的关联缓存 Keys 
   * 会自动刷新依赖的缓存
   */
  relatedKeys?: CacheKey[]
  
  /** 
   * 成功提示消息 
   * 设置为 null 则不显示提示
   */
  successMessage?: string | null
  
  /** 
   * 错误提示消息 
   * 可以是字符串或函数，函数接收错误对象
   */
  errorMessage?: string | ((error: Error) => string)
  
  /** 
   * 是否显示 toast 提示 
   * @default true
   */
  showToast?: boolean
  
  /** 
   * 成功后回调 
   */
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>
  
  /** 
   * 失败后回调 
   */
  onError?: (error: Error, variables: TVariables) => void | Promise<void>
  
  /** 
   * 是否自动刷新关联缓存 
   * @default true
   */
  autoRefreshRelated?: boolean
}

/**
 * 乐观更新返回值
 * @interface UseOptimisticMutationReturn
 */
interface UseOptimisticMutationReturn<TData, TVariables> {
  /** 
   * 执行变更 
   * 返回 Promise，resolve 为成功数据，reject 为错误
   */
  mutate: (variables: TVariables) => Promise<TData>
  
  /** 
   * 是否正在执行 
   */
  isMutating: boolean
  
  /** 
   * 重置状态 
   * 清除 isMutating 状态
   */
  reset: () => void
  
  /**
   * 最后一次错误
   */
  error: Error | null
  
  /**
   * 最后一次成功数据
   */
  data: TData | undefined
}

/**
 * 统一乐观更新 Hook
 * 
 * @template TData - 数据类型
 * @template TVariables - 变量类型
 * @param options - 配置选项
 * @returns 变更控制对象
 * 
 * @example
 * ```typescript
 * // 基本使用
 * const { mutate, isMutating } = useOptimisticMutation({
 *   cacheKey: 'todos',
 *   mutationFn: (text: string) => api.createTodo(text),
 * })
 * 
 * // 带乐观更新
 * const { mutate } = useOptimisticMutation({
 *   cacheKey: CACHE_KEYS.ARTICLE.DRAFTS,
 *   mutationFn: deleteDraft,
 *   optimisticUpdater: (drafts, id) => 
 *     drafts?.filter(d => d.id !== id),
 *   successMessage: '删除成功',
 *   errorMessage: '删除失败，请重试',
 * })
 * ```
 */
export function useOptimisticMutation<TData, TVariables = void>(
  options: UseOptimisticMutationOptions<TData, TVariables>
): UseOptimisticMutationReturn<TData, TVariables> {
  const {
    cacheKey,
    mutationFn,
    optimisticUpdater,
    relatedKeys = [],
    successMessage,
    errorMessage = '操作失败，请稍后重试',
    showToast = true,
    onSuccess,
    onError,
    autoRefreshRelated = true,
  } = options

  const { mutate: swrMutate, cache } = useSWRConfig()
  const isMutatingRef = useRef(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<TData | undefined>(undefined)

  /**
   * 获取完整的关联缓存 Keys
   * 包括手动配置的依赖和自动检测的依赖
   */
  const getAllRelatedKeys = useCallback((): CacheKey[] => {
    const autoDeps = getCacheDependencies(cacheKey)
    const allKeys = [...relatedKeys, ...autoDeps]
    // 去重
    const seen = new Set<string>()
    return allKeys.filter(key => {
      const keyStr = getCacheKeyString(key)
      if (seen.has(keyStr)) return false
      seen.add(keyStr)
      return true
    })
  }, [relatedKeys, cacheKey])

  /**
   * 执行乐观更新
   */
  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      // 防止重复提交
      if (isMutatingRef.current) {
        console.warn('[useOptimisticMutation] Mutation already in progress:', getCacheKeyString(cacheKey))
        throw new Error('操作正在进行中，请稍后再试')
      }

      isMutatingRef.current = true
      setError(null)

      // 保存当前数据用于回滚
      // 注意: SWR 的 cache 使用字符串 key，需要将数组 key 转换
      const cacheKeyStr = getCacheKeyString(cacheKey)
      const currentData = cache.get(cacheKeyStr)

      try {
        // 1. 执行乐观更新
        if (optimisticUpdater) {
          await swrMutate(
            cacheKey,
            (data: TData | undefined) => {
              return optimisticUpdater(data, variables)
            },
            { revalidate: false }
          )
        }

        // 2. 执行实际请求
        const result = await mutationFn(variables)
        setData(result)

        // 3. 重新验证主缓存
        await swrMutate(cacheKey)

        // 4. 刷新关联缓存
        if (autoRefreshRelated) {
          const allRelatedKeys = getAllRelatedKeys()
          for (const key of allRelatedKeys) {
            try {
              await swrMutate(key, undefined, { revalidate: true })
            } catch (err) {
              console.warn('[useOptimisticMutation] Failed to refresh related cache:', getCacheKeyString(key), err)
            }
          }
        }

        // 5. 显示成功提示
        if (showToast && successMessage) {
          toast.success(successMessage)
        }

        // 6. 执行成功回调
        if (onSuccess) {
          await onSuccess(result, variables)
        }

        return result
      } catch (err) {
        // 构建错误对象
        const errorObj = err instanceof Error ? err : new Error(String(err))
        setError(errorObj)

        // 1. 回滚缓存到之前的状态
        if (optimisticUpdater) {
          await swrMutate(cacheKey, currentData, { revalidate: false })
        }

        // 2. 显示错误提示
        if (showToast) {
          const message = typeof errorMessage === 'function' 
            ? errorMessage(errorObj) 
            : errorMessage
          toast.error(message)
        }

        // 3. 执行错误回调
        if (onError) {
          await onError(errorObj, variables)
        }

        // 4. 抛出错误供调用方处理
        throw errorObj
      } finally {
        isMutatingRef.current = false
      }
    },
    [
      cacheKey,
      mutationFn,
      optimisticUpdater,
      getAllRelatedKeys,
      successMessage,
      errorMessage,
      showToast,
      onSuccess,
      onError,
      autoRefreshRelated,
      swrMutate,
      cache,
    ]
  )

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    isMutatingRef.current = false
    setError(null)
    setData(undefined)
  }, [])

  return {
    mutate,
    get isMutating() {
      return isMutatingRef.current
    },
    reset,
    error,
    data,
  }
}

/**
 * 批量乐观更新 Hook
 * 用于需要同时更新多个缓存的场景
 * 
 * @example
 * ```typescript
 * const { mutate, isMutating } = useBatchOptimisticMutation({
 *   operations: [
 *     {
 *       cacheKey: CACHE_KEYS.ARTICLE.DRAFTS,
 *       optimisticUpdater: (drafts, id) => drafts?.filter(d => d.id !== id),
 *     },
 *     {
 *       cacheKey: CACHE_KEYS.USER.POINTS_OVERVIEW,
 *       optimisticUpdater: (points, delta) => ({ ...points, total: points.total + delta }),
 *     },
 *   ],
 *   mutationFn: publishDraft,
 * })
 * ```
 */
export function useBatchOptimisticMutation<TData, TVariables = void>(
  options: {
    operations: Array<{
      cacheKey: CacheKey
      optimisticUpdater?: (currentData: unknown, variables: TVariables) => unknown
    }>
    mutationFn: (variables: TVariables) => Promise<TData>
    successMessage?: string | null
    errorMessage?: string | ((error: Error) => string)
    showToast?: boolean
    onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>
    onError?: (error: Error, variables: TVariables) => void | Promise<void>
  }
): UseOptimisticMutationReturn<TData, TVariables> {
  const {
    operations,
    mutationFn,
    successMessage,
    errorMessage = '操作失败，请稍后重试',
    showToast = true,
    onSuccess,
    onError,
  } = options

  const { mutate: swrMutate, cache } = useSWRConfig()
  const isMutatingRef = useRef(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<TData | undefined>(undefined)

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      if (isMutatingRef.current) {
        throw new Error('操作正在进行中，请稍后再试')
      }

      isMutatingRef.current = true
      setError(null)

      // 保存所有缓存的当前状态
      // 注意: SWR 的 cache 使用字符串 key，需要将数组 key 转换
      const previousStates = operations.map(op => ({
        key: op.cacheKey,
        data: cache.get(getCacheKeyString(op.cacheKey)),
      }))

      try {
        // 1. 执行所有乐观更新
        for (const op of operations) {
          if (op.optimisticUpdater) {
            await swrMutate(
              op.cacheKey,
              (currentData: unknown) => op.optimisticUpdater!(currentData, variables),
              { revalidate: false }
            )
          }
        }

        // 2. 执行实际请求
        const result = await mutationFn(variables)
        setData(result)

        // 3. 重新验证所有缓存
        for (const op of operations) {
          await swrMutate(op.cacheKey)
        }

        // 4. 显示成功提示
        if (showToast && successMessage) {
          toast.success(successMessage)
        }

        // 5. 执行成功回调
        if (onSuccess) {
          await onSuccess(result, variables)
        }

        return result
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err))
        setError(errorObj)

        // 1. 回滚所有缓存
        for (const state of previousStates) {
          await swrMutate(state.key, state.data, { revalidate: false })
        }

        // 2. 显示错误提示
        if (showToast) {
          const message = typeof errorMessage === 'function'
            ? errorMessage(errorObj)
            : errorMessage
          toast.error(message)
        }

        // 3. 执行错误回调
        if (onError) {
          await onError(errorObj, variables)
        }

        throw errorObj
      } finally {
        isMutatingRef.current = false
      }
    },
    [operations, mutationFn, successMessage, errorMessage, showToast, onSuccess, onError, swrMutate, cache]
  )

  const reset = useCallback(() => {
    isMutatingRef.current = false
    setError(null)
    setData(undefined)
  }, [])

  return {
    mutate,
    get isMutating() {
      return isMutatingRef.current
    },
    reset,
    error,
    data,
  }
}

export default useOptimisticMutation
