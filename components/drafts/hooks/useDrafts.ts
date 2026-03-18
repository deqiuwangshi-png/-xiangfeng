'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import useSWR from 'swr'
import { DraftService, Article } from '@/lib/drafts/draftService'
import { deleteArticle, updateArticleStatus, batchDeleteArticles } from '@/lib/articles/actions/crud'
import { fetchDrafts } from '@/lib/articles/actions/query'
import type { DraftData, DraftFilter, DraftSelection } from '@/types/drafts'

/** SWR 缓存 Key */
const DRAFTS_CACHE_KEY = 'drafts/list'

/**
 * useDrafts Hook 返回值接口
 */
export interface UseDraftsReturn {
  drafts: DraftData[]
  filteredDrafts: DraftData[]
  paginatedDrafts: DraftData[]
  totalPages: number
  selectedIds: Set<string>
  selection: DraftSelection
  activeFilter: DraftFilter
  searchQuery: string
  currentPage: number
  isLoading: boolean
  setActiveFilter: (filter: DraftFilter) => void
  setSearchQuery: (query: string) => void
  setCurrentPage: (page: number) => void
  handleSelectDraft: (id: string) => void
  handleSelectAll: () => void
  handleEditDraft: (id: string) => void
  executeDeleteDrafts: (ids: string[], shouldRefresh?: boolean) => Promise<void>
  handleBatchPublish: () => Promise<void>
  handleBatchArchive: () => Promise<void>
  handleCancelSelection: () => void
  handleClearAllDrafts: () => Promise<void>
}

/**
 * useDrafts Hook
 *
 * @param initialArticles - 初始文章列表
 * @param itemsPerPage - 每页显示数量，默认6
 * @returns 草稿管理相关的状态和方法
 */
export function useDrafts(
  initialArticles: Article[],
  itemsPerPage = 6
): UseDraftsReturn {
  const router = useRouter()

  // 使用 SWR 缓存草稿列表
  const {
    data: drafts = [],
    mutate: mutateDrafts,
    isLoading: isSWRLoading,
  } = useSWR(
    DRAFTS_CACHE_KEY,
    fetchDrafts,
    {
      fallbackData: initialArticles.map(DraftService.convertToDraftData),
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: Infinity, // 页面级别缓存，不重复获取
      keepPreviousData: true,
    }
  )

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [activeFilter, setActiveFilter] = useState<DraftFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

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
   */
  const calibratePage = useCallback(() => {
    const newTotalPages = DraftService.getTotalPages(filteredDrafts, itemsPerPage)
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    } else if (newTotalPages === 0) {
      setCurrentPage(1)
    }
  }, [filteredDrafts, currentPage, itemsPerPage])

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
      try {
        if (ids.length === 1) {
          // 单条删除：使用原有方法
          await deleteArticle(ids[0])

          mutateDrafts(
            (prev) => DraftService.removeDrafts(prev || [], new Set(ids)),
            { revalidate: false }
          )
          setSelectedIds((prev) => {
            const newSet = new Set(prev)
            ids.forEach((id) => newSet.delete(id))
            return newSet
          })
        } else {
          // 批量删除：使用安全增强版，批量验证所有权
          const result = await batchDeleteArticles(ids)

          // 根据返回的统计信息处理
          // 失败情况已在下方toast提示中处理

          // 批量删除接口不返回具体ID列表，需要重新获取数据
          // 使用乐观更新：假设传入的ID都成功删除
          mutateDrafts(
            (prev) => DraftService.removeDrafts(prev || [], new Set(ids)),
            { revalidate: true } // 重新验证以确保数据一致
          )
          setSelectedIds((prev) => {
            const newSet = new Set(prev)
            ids.forEach((id) => newSet.delete(id))
            return newSet
          })

          // 显示结果提示
          if (result.failedCount > 0) {
            toast.warning(`成功删除 ${result.deletedCount} 篇，${result.failedCount} 篇删除失败`)
            setIsLoading(false)
            return
          }
        }

        if (shouldRefresh) {
          router.refresh()
        }

        {/* 删除后校准分页状态，防止页码越界 */}
        calibratePage()

        toast.success('删除成功')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '删除失败')
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [router, mutateDrafts, calibratePage]
  )



  /**
   * 执行批量状态更新
   *
   * @description 并行执行所有状态更新，提升性能
   * @param status - 目标状态
   * @param successMessage - 成功提示消息
   *
   * @优化说明
   * - 使用 Promise.allSettled 并行执行，避免串行等待
   * - 成功和失败分别统计，部分失败不影响其他操作
   * - 只更新成功的项目状态，失败的项目保持原状态
   */
  const executeBatchStatusUpdate = useCallback(
    async (status: 'published' | 'archived', successMessage: string) => {
      if (selectedIds.size === 0) return

      setIsLoading(true)
      const idsArray = Array.from(selectedIds)

      try {
        // 并行执行所有状态更新
        const results = await Promise.allSettled(
          idsArray.map((id) => updateArticleStatus(id, status))
        )

        // 统计成功和失败
        const successIds: string[] = []
        const failedIds: string[] = []

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successIds.push(idsArray[index])
          } else {
            failedIds.push(idsArray[index])
          }
        })

        // 更新本地状态（只更新成功的）
        if (successIds.length > 0) {
          mutateDrafts(
            (prev) => DraftService.updateDraftsStatus(prev || [], new Set(successIds), status),
            { revalidate: false }
          )
        }

        // 从选中列表中移除已成功的
        setSelectedIds((prev) => {
          const newSet = new Set(prev)
          successIds.forEach((id) => newSet.delete(id))
          return newSet
        })

        // 显示结果提示
        if (failedIds.length === 0) {
          toast.success(successMessage)
        } else if (successIds.length === 0) {
          toast.error('所有操作失败，请重试')
        } else {
          toast.warning(`成功 ${successIds.length} 篇，失败 ${failedIds.length} 篇`)
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '操作失败')
      } finally {
        setIsLoading(false)
      }
    },
    [selectedIds, mutateDrafts]
  )

  /**
   * 处理批量发布
   */
  const handleBatchPublish = useCallback(() => {
    return executeBatchStatusUpdate('published', '发布成功')
  }, [executeBatchStatusUpdate])

  /**
   * 处理批量归档
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
    if (draftArticles.length === 0) {
      toast.info('没有可清空的草稿')
      return
    }

    await executeDeleteDrafts(draftArticles.map((d) => d.id))
  }, [drafts, executeDeleteDrafts])

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
    isLoading: isLoading || isSWRLoading,
    setActiveFilter: handleFilterChange,
    setSearchQuery: handleSearch,
    setCurrentPage: handlePageChange,
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
