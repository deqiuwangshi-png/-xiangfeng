'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DraftData, DraftFilter, DraftSelection } from '@/types/drafts'
import { DraftService } from '@/lib/drafts/draftService'

/**
 * 草稿管理Hook
 * 
 * @function useDrafts
 * @param {DraftData[]} initialDrafts - 初始草稿数据
 * @returns {Object} 草稿管理状态和操作方法
 * 
 * @description
 * 提供草稿管理的完整状态和操作方法
 * 
 * @returns
 * - drafts: 草稿数据列表
 * - selectedIds: 选中的草稿ID集合
 * - activeFilter: 当前激活的筛选器
 * - searchQuery: 搜索查询字符串
 * - currentPage: 当前页码
 * - filteredDrafts: 过滤后的草稿列表
 * - paginatedDrafts: 当前页的草稿列表
 * - totalPages: 总页数
 * - selection: 选择状态对象
 * - handleFilterChange: 处理筛选器变化
 * - handleSearch: 处理搜索
 * - handleSelectDraft: 处理草稿选择
 * - handleSelectAll: 处理全选
 * - handleEditDraft: 处理草稿编辑
 * - handleDeleteDraft: 处理草稿删除
 * - handleBatchDelete: 处理批量删除
 * - handleBatchPublish: 处理批量发布
 * - handleBatchArchive: 处理批量归档
 * - handleCancelSelection: 处理取消选择
 * - handleClearAllDrafts: 处理清空草稿
 * - handleNewDraft: 处理新建草稿
 * - handlePageChange: 处理页码变化
 */
export function useDrafts(initialDrafts: DraftData[]) {
  const router = useRouter()

  const [drafts, setDrafts] = useState<DraftData[]>(initialDrafts)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [activeFilter, setActiveFilter] = useState<DraftFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 6

  /**
   * 过滤后的草稿列表
   * 
   * @useMemo
   * @description
   * 根据当前筛选器和搜索查询过滤草稿
   */
  const filteredDrafts = useMemo(() => {
    return DraftService.filterDrafts(drafts, activeFilter, searchQuery)
  }, [drafts, activeFilter, searchQuery])

  /**
   * 当前页的草稿列表
   * 
   * @useMemo
   * @description
   * 根据当前页码和过滤后的草稿列表分页
   */
  const paginatedDrafts = useMemo(() => {
    return DraftService.getPaginatedDrafts(filteredDrafts, currentPage, itemsPerPage)
  }, [filteredDrafts, currentPage])

  /**
   * 总页数
   * 
   * @useMemo
   * @description
   * 根据过滤后的草稿数量计算总页数
   */
  const totalPages = useMemo(() => {
    return DraftService.getTotalPages(filteredDrafts, itemsPerPage)
  }, [filteredDrafts])

  /**
   * 选择状态对象
   * 
   * @useMemo
   * @description
   * 包含选中ID集合、是否全选、是否部分选中
   */
  const selection: DraftSelection = useMemo(() => {
    return {
      selectedIds,
      isAllSelected: DraftService.isAllSelected(paginatedDrafts, selectedIds),
      isPartiallySelected: DraftService.isPartiallySelected(paginatedDrafts, selectedIds),
    }
  }, [paginatedDrafts, selectedIds])

  /**
   * 重置页码
   * 
   * @useEffect
   * @description
   * 当筛选器或搜索查询变化时，重置到第一页
   */
  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilter, searchQuery])

  /**
   * 处理筛选器变化
   * 
   * @function handleFilterChange
   * @param {DraftFilter} filter - 筛选值
   * @returns {void}
   * 
   * @description
   * 切换筛选器并重置到第一页
   */
  const handleFilterChange = useCallback((filter: DraftFilter) => {
    setActiveFilter(filter)
    setSelectedIds(new Set())
  }, [])

  /**
   * 处理搜索
   * 
   * @function handleSearch
   * @param {string} query - 搜索查询
   * @returns {void}
   * 
   * @description
   * 更新搜索查询并重置到第一页
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  /**
   * 处理草稿选择
   * 
   * @function handleSelectDraft
   * @param {string} id - 草稿ID
   * @returns {void}
   * 
   * @description
   * 切换草稿的选中状态
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
   * 处理全选
   * 
   * @function handleSelectAll
   * @returns {void}
   * 
   * @description
   * 切换全选状态
   */
  const handleSelectAll = useCallback(() => {
    if (selection.isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedDrafts.map((d) => d.id)))
    }
  }, [selection.isAllSelected, paginatedDrafts])

  /**
   * 处理草稿编辑
   * 
   * @function handleEditDraft
   * @param {string} id - 草稿ID
   * @returns {void}
   * 
   * @description
   * 跳转到草稿编辑页面
   */
  const handleEditDraft = useCallback((id: string) => {
    router.push(`/drafts/${id}`)
  }, [router])

  /**
   * 处理草稿删除
   * 
   * @function handleDeleteDraft
   * @param {string} id - 草稿ID
   * @returns {void}
   * 
   * @description
   * 删除单个草稿
   */
  const handleDeleteDraft = useCallback((id: string) => {
    if (confirm('确定要删除这篇草稿吗？')) {
      setDrafts((prev) => DraftService.deleteDraft(prev, id))
      setSelectedIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }, [])

  /**
   * 处理批量删除
   * 
   * @function handleBatchDelete
   * @returns {void}
   * 
   * @description
   * 批量删除选中的草稿
   */
  const handleBatchDelete = useCallback(() => {
    if (selectedIds.size === 0) return

    if (confirm(`确定要删除选中的 ${selectedIds.size} 篇草稿吗？`)) {
      setDrafts((prev) => DraftService.deleteDrafts(prev, selectedIds))
      setSelectedIds(new Set())
    }
  }, [selectedIds])

  /**
   * 处理批量发布
   * 
   * @function handleBatchPublish
   * @returns {void}
   * 
   * @description
   * 批量发布选中的草稿
   */
  const handleBatchPublish = useCallback(() => {
    if (selectedIds.size === 0) return

    setDrafts((prev) => DraftService.publishDrafts(prev, selectedIds))
    setSelectedIds(new Set())
  }, [selectedIds])

  /**
   * 处理批量归档
   * 
   * @function handleBatchArchive
   * @returns {void}
   * 
   * @description
   * 批量归档选中的草稿
   */
  const handleBatchArchive = useCallback(() => {
    if (selectedIds.size === 0) return

    setDrafts((prev) => DraftService.archiveDrafts(prev, selectedIds))
    setSelectedIds(new Set())
  }, [selectedIds])

  /**
   * 处理取消选择
   * 
   * @function handleCancelSelection
   * @returns {void}
   * 
   * @description
   * 取消所有选择
   */
  const handleCancelSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  /**
   * 处理清空草稿
   * 
   * @function handleClearAllDrafts
   * @returns {void}
   * 
   * @description
   * 清空所有草稿
   */
  const handleClearAllDrafts = useCallback(() => {
    if (confirm('确定要清空所有草稿吗？此操作不可恢复。')) {
      setDrafts([])
      setSelectedIds(new Set())
    }
  }, [])

  /**
   * 处理新建草稿
   * 
   * @function handleNewDraft
   * @returns {void}
   * 
   * @description
   * 跳转到新建草稿页面
   */
  const handleNewDraft = useCallback(() => {
    router.push('/publish')
  }, [router])

  /**
   * 处理页码变化
   * 
   * @function handlePageChange
   * @param {number} page - 页码
   * @returns {void}
   * 
   * @description
   * 切换到指定页码
   */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  return {
    drafts,
    selectedIds,
    activeFilter,
    searchQuery,
    currentPage,
    filteredDrafts,
    paginatedDrafts,
    totalPages,
    selection,
    handleFilterChange,
    handleSearch,
    handleSelectDraft,
    handleSelectAll,
    handleEditDraft,
    handleDeleteDraft,
    handleBatchDelete,
    handleBatchPublish,
    handleBatchArchive,
    handleCancelSelection,
    handleClearAllDrafts,
    handleNewDraft,
    handlePageChange,
  }
}
