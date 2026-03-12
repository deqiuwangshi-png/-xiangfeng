'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DraftService, Article } from '@/lib/drafts/draftService'
import { deleteArticle, updateArticleStatus, batchDeleteArticles } from '@/lib/articles/actions/crud'
import type { DraftData, DraftFilter, DraftSelection } from '@/types/drafts'

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

  // 核心状态
  const [drafts, setDrafts] = useState<DraftData[]>(
    initialArticles.map(DraftService.convertToDraftData)
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
        } else {
          // 批量删除：使用安全增强版，批量验证所有权
          const result = await batchDeleteArticles(ids)

          // 处理部分失败的情况
          if (result.unauthorized.length > 0) {
            console.warn(`越权尝试: ${result.unauthorized.length} 篇文章`)
          }

          if (result.notFound.length > 0) {
            console.warn(`未找到: ${result.notFound.length} 篇文章`)
          }

          // 只更新成功删除的
          const actuallyDeleted = result.deleted
          setDrafts((prev) => DraftService.removeDrafts(prev, new Set(actuallyDeleted)))
          setSelectedIds((prev) => {
            const newSet = new Set(prev)
            actuallyDeleted.forEach((id) => newSet.delete(id))
            return newSet
          })

          if (result.unauthorized.length > 0) {
            toast.warning(`成功删除 ${result.deleted.length} 篇，${result.unauthorized.length} 篇无权删除`)
            setIsLoading(false)
            return
          }
        }

        setDrafts((prev) => DraftService.removeDrafts(prev, new Set(ids)))
        setSelectedIds((prev) => {
          const newSet = new Set(prev)
          ids.forEach((id) => newSet.delete(id))
          return newSet
        })

        if (shouldRefresh) {
          router.refresh()
        }

        toast.success('删除成功')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '删除失败')
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )



  /**
   * 执行批量状态更新
   */
  const executeBatchStatusUpdate = useCallback(
    async (status: 'published' | 'archived', successMessage: string) => {
      if (selectedIds.size === 0) return

      setIsLoading(true)
      try {
        for (const id of Array.from(selectedIds)) {
          await updateArticleStatus(id, status)
        }

        setDrafts((prev) => DraftService.updateDraftsStatus(prev, selectedIds, status))
        setSelectedIds(new Set())
        toast.success(successMessage)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '操作失败')
      } finally {
        setIsLoading(false)
      }
    },
    [selectedIds]
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
    isLoading,
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
