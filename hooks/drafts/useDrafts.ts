'use client'

/**
 * @fileoverview 草稿管理 Hook
 * @module hooks/drafts/useDrafts
 * @description 提供草稿列表管理、筛选、分页、批量操作等功能
 *
 * @类型依赖
 * - 类型定义位于: types/drafts.ts
 * - 导入: DraftData, DraftFilter, DraftSelection, ViewMode, UseDraftsReturn
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'

import { DraftService } from '@/lib/drafts/draftService'
import { deleteArticle, updateArticleStatus } from '@/lib/articles/actions/mutate'
import { batchDeleteArticles } from '@/lib/articles/actions/batch'
import { fetchDrafts } from '@/lib/articles/actions/query'
import { useDraftsToast } from './useDraftsToast'

import type { DraftData, DraftFilter, DraftSelection, ViewMode, UseDraftsReturn } from '@/types/drafts'

/** SWR 缓存 Key */
const DRAFTS_CACHE_KEY = 'drafts/list'

/** localStorage Key for view mode */
const VIEW_MODE_STORAGE_KEY = 'drafts/viewMode'

/**
 * useDrafts Hook
 *
 * @param initialArticles - 初始文章列表
 * @param itemsPerPage - 每页显示数量，默认6
 * @returns 草稿管理相关的状态和方法
 */
export function useDrafts(
  initialArticles: DraftData[],
  itemsPerPage = 6
): UseDraftsReturn {
  const router = useRouter()
  const isMountedRef = useRef(true)

  // 使用统一的 toast 提示 hook
  const {
    showDeleteSuccess,
    showDeleteError,
    showBatchDeletePartialSuccess,
    showBatchSuccess,
    showBatchAllFailed,
    showBatchPartialSuccess,
    showNoDraftsToClear,
  } = useDraftsToast()

  // 组件卸载时设置标记
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // 使用 SWR 缓存草稿列表
  const {
    data: drafts = [],
    mutate: mutateDrafts,
    isLoading: isSWRLoading,
  } = useSWR(
    DRAFTS_CACHE_KEY,
    fetchDrafts,
    {
      fallbackData: initialArticles,
      revalidateOnMount: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      // 注意：不设置 dedupingInterval 为 Infinity，以允许乐观更新正常工作
      keepPreviousData: true,
    }
  )

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [activeFilter, setActiveFilter] = useState<DraftFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewModeState] = useState<ViewMode>('grid')
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 从 localStorage 读取视图模式
   */
  useEffect(() => {
    try {
      const savedViewMode = localStorage.getItem(VIEW_MODE_STORAGE_KEY)
      if (savedViewMode === 'grid' || savedViewMode === 'list') {
        setViewModeState(savedViewMode)
      }
    } catch {
      // localStorage 不可用时的静默处理
    }
  }, [])

  /**
   * 设置视图模式并持久化到 localStorage
   *
   * @param {ViewMode} mode - 视图模式
   */
  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode)
    try {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode)
    } catch {
      // localStorage 不可用时的静默处理
    }
  }, [])

  // 筛选和搜索后的数据
  const filteredDrafts = useMemo(() => {
    return DraftService.filterDrafts(drafts, activeFilter, searchQuery)
  }, [drafts, activeFilter, searchQuery])

  // 分页数据
  const paginatedDrafts = useMemo(() => {
    return DraftService.getPaginatedDrafts(filteredDrafts, currentPage, itemsPerPage)
  }, [filteredDrafts, currentPage, itemsPerPage])

  const totalPages = useMemo(
    () => DraftService.getTotalPages(filteredDrafts, itemsPerPage),
    [filteredDrafts, itemsPerPage]
  )

  // 选择状态
  const selection: DraftSelection = useMemo(
    () => ({
      selectedIds,
      isAllSelected: DraftService.isAllSelected(paginatedDrafts, selectedIds),
      isPartiallySelected: DraftService.isPartiallySelected(paginatedDrafts, selectedIds),
    }),
    [selectedIds, paginatedDrafts]
  )

  /**
   * 重置分页和选择
   */
  const resetPageAndSelection = useCallback(() => {
    setCurrentPage(1)
    setSelectedIds(new Set())
  }, [])

  /**
   * 处理筛选变化
   */
  const handleFilterChange = useCallback(
    (filter: DraftFilter) => {
      setActiveFilter(filter)
      resetPageAndSelection()
    },
    [resetPageAndSelection]
  )

  /**
   * 处理搜索
   */
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      resetPageAndSelection()
    },
    [resetPageAndSelection]
  )

  /**
   * 处理分页变化
   */
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
      setSelectedIds(new Set())
    },
    []
  )

  /**
   * 处理选择单个草稿
   */
  const handleSelectDraft = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  /**
   * 处理全选/取消全选
   */
  const handleSelectAll = useCallback(() => {
    if (selection.isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedDrafts.map((d) => d.id)))
    }
  }, [selection.isAllSelected, paginatedDrafts])

  /**
   * 处理编辑草稿
   */
  const handleEditDraft = useCallback(
    (id: string) => {
      router.push(`/publish?edit=${id}`)
    },
    [router]
  )

  /**
   * 校准分页状态
   * @description 删除数据后，如果当前页超出新的总页数，则自动回退到最后一页
   * @param remainingDrafts - 删除后的剩余草稿列表（用于立即计算，避免依赖滞后）
   */
  const calibratePage = useCallback((remainingDrafts: DraftData[]) => {
    const newTotalPages = DraftService.getTotalPages(remainingDrafts, itemsPerPage)
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    } else if (newTotalPages === 0) {
      setCurrentPage(1)
    }
  }, [currentPage, itemsPerPage])

  /**
   * 执行删除草稿的核心逻辑（安全增强版）
   *
   * @param ids - 要删除的文章ID数组
   * @param shouldRefresh - 是否刷新页面
   *
   * @security
   * - 单条删除：使用传统deleteArticle
   * - 批量删除：使用batchDeleteArticles进行批量验证
   * - 防止越权删除他人文章
   */
  const executeDeleteDrafts = useCallback(
    async (ids: string[], shouldRefresh = false) => {
      if (ids.length === 0) return

      setIsLoading(true)

      // ========== 乐观更新：立即更新 UI，让用户立即看到效果 ==========
      const remainingDrafts = DraftService.removeDrafts(drafts, new Set(ids))
      const previousDrafts = [...drafts] // 保存原始数据用于回滚

      // 立即更新本地数据
      mutateDrafts(remainingDrafts, { revalidate: false })
      setSelectedIds((prev) => {
        const newSet = new Set(prev)
        ids.forEach((id) => newSet.delete(id))
        return newSet
      })
      // 删除后校准分页状态
      calibratePage(remainingDrafts)

      try {
        if (ids.length === 1) {
          // 单条删除：使用原有方法
          await deleteArticle(ids[0])

          if (!shouldRefresh) {
            showDeleteSuccess()
          }
        } else {
          // 批量删除：使用安全增强版，批量验证所有权
          const result = await batchDeleteArticles(ids)

          // 显示批量删除结果提示
          if (result.successCount === ids.length) {
            showDeleteSuccess({ message: `成功删除 ${result.successCount} 篇草稿` })
          } else if (result.successCount > 0) {
            // 部分成功：需要重新获取数据以同步实际状态
            showBatchDeletePartialSuccess(result.successCount, result.failedCount)
            await mutateDrafts()
          } else {
            // 全部失败：回滚到原始数据
            showDeleteError('删除失败，请检查权限或稍后重试')
            mutateDrafts(previousDrafts, { revalidate: false })
          }
        }
      } catch (error) {
        console.error('删除草稿失败:', error)
        showDeleteError(error instanceof Error ? error : undefined)
        // 出错时回滚到原始数据
        mutateDrafts(previousDrafts, { revalidate: false })
      } finally {
        setIsLoading(false)
      }
    },
    [drafts, mutateDrafts, calibratePage, showDeleteSuccess, showDeleteError, showBatchDeletePartialSuccess]
  )

  /**
   * 批量更新文章状态
   * @param status - 目标状态
   * @param successMessage - 成功提示消息
   */
  const executeBatchStatusUpdate = useCallback(
    async (status: 'published' | 'archived', successMessage: string) => {
      if (selectedIds.size === 0) return

      setIsLoading(true)
      const ids = Array.from(selectedIds)
      const totalCount = ids.length

      try {
        // 并行执行所有更新
        const results = await Promise.allSettled(
          ids.map((id) => updateArticleStatus(id, status))
        )

        const successCount = results.filter((r) => r.status === 'fulfilled').length
        const failedCount = totalCount - successCount

        if (isMountedRef.current) {
          if (successCount === totalCount) {
            // 全部成功
            showBatchSuccess(successMessage, successCount)
            // 刷新数据
            await mutateDrafts()
            setSelectedIds(new Set())
          } else if (successCount === 0) {
            // 全部失败
            showBatchAllFailed()
          } else {
            // 部分成功
            showBatchPartialSuccess(successCount, failedCount)
            // 刷新数据
            await mutateDrafts()
            setSelectedIds(new Set())
          }
        }
      } catch (error) {
        console.error('批量更新状态失败:', error)
        showBatchAllFailed()
      } finally {
        setIsLoading(false)
      }
    },
    [selectedIds, mutateDrafts, showBatchSuccess, showBatchAllFailed, showBatchPartialSuccess]
  )

  /**
   * 批量发布草稿
   */
  const handleBatchPublish = useCallback(() => {
    return executeBatchStatusUpdate('published', '发布成功')
  }, [executeBatchStatusUpdate])

  /**
   * 批量归档草稿
   */
  const handleBatchArchive = useCallback(() => {
    return executeBatchStatusUpdate('archived', '归档成功')
  }, [executeBatchStatusUpdate])

  /**
   * 处理取消选择
   */
  const handleCancelSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  /**
   * 处理清空所有草稿
   *
   * @description 只删除状态为 draft 的草稿，已发布/归档的文章不受影响
   */
  const handleClearAllDrafts = useCallback(async () => {
    const draftArticles = drafts.filter((d) => d.status === 'draft')
    if (draftArticles.length === 0 && isMountedRef.current) {
      showNoDraftsToClear()
      return
    }

    await executeDeleteDrafts(draftArticles.map((d) => d.id))
  }, [drafts, executeDeleteDrafts, showNoDraftsToClear])

  return {
    drafts,
    filteredDrafts,
    paginatedDrafts,
    totalPages,
    selectedIds,
    selection,
    activeFilter,
    searchQuery,
    currentPage,
    viewMode,
    isLoading: isLoading || isSWRLoading,
    setActiveFilter: handleFilterChange,
    setSearchQuery: handleSearch,
    setCurrentPage: handlePageChange,
    setViewMode,
    handleSelectDraft,
    handleSelectAll,
    handleEditDraft,
    executeDeleteDrafts,
    handleBatchPublish,
    handleBatchArchive,
    handleCancelSelection,
    handleClearAllDrafts,
  }
}
