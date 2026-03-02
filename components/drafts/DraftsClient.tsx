'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DraftsHeader } from './DraftsHeader'
import { DraftsContent } from './DraftsContent'
import { BatchActionsBar } from './BatchActionsBar'
import { deleteArticle, updateArticleStatus } from '@/lib/articles/articleActions'
import type { DraftData, DraftFilter, DraftSelection } from '@/types/drafts'
import type { FilterOption } from './FilterChips'

/**
 * 数据库文章数据接口
 */
interface Article {
  id: string
  title: string
  content: string
  summary: string | null
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

/**
 * DraftsClient Props 接口
 */
interface DraftsClientProps {
  initialArticles: Article[]
  filterOptions: FilterOption[]
}

/**
 * 将数据库文章转换为草稿数据格式
 */
function convertToDraftData(article: Article): DraftData {
  return {
    id: article.id,
    title: article.title,
    summary: article.summary || article.content.slice(0, 100) + '...',
    status: article.status,
    createdAt: article.created_at,
    updatedAt: article.updated_at,
  }
}

/**
 * DraftsClient 组件
 * 客户端草稿管理组件
 * 
 * @param initialArticles - 初始文章列表
 * @param filterOptions - 筛选选项
 */
export function DraftsClient({ initialArticles, filterOptions }: DraftsClientProps) {
  const router = useRouter()
  // 转换数据格式
  const [drafts, setDrafts] = useState<DraftData[]>(initialArticles.map(convertToDraftData))
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [activeFilter, setActiveFilter] = useState<DraftFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const itemsPerPage = 6

  // 过滤和搜索
  const filteredDrafts = useMemo(() => {
    let result = drafts

    // 状态筛选
    if (activeFilter !== 'all') {
      result = result.filter((d) => d.status === activeFilter)
    }

    // 搜索
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.summary.toLowerCase().includes(query)
      )
    }

    return result
  }, [drafts, activeFilter, searchQuery])

  // 分页
  const paginatedDrafts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredDrafts.slice(start, start + itemsPerPage)
  }, [filteredDrafts, currentPage])

  const totalPages = Math.ceil(filteredDrafts.length / itemsPerPage)

  // 选择状态
  const selection: DraftSelection = useMemo(() => ({
    selectedIds,
    isAllSelected: paginatedDrafts.length > 0 && paginatedDrafts.every((d) => selectedIds.has(d.id)),
    isPartiallySelected: paginatedDrafts.some((d) => selectedIds.has(d.id)) && !paginatedDrafts.every((d) => selectedIds.has(d.id)),
  }), [selectedIds, paginatedDrafts])

  // 处理筛选
  const handleFilterChange = useCallback((filter: DraftFilter) => {
    setActiveFilter(filter)
    setSelectedIds(new Set())
    setCurrentPage(1)
  }, [])

  // 处理搜索
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  // 处理选择
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

  // 全选
  const handleSelectAll = useCallback(() => {
    if (selection.isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedDrafts.map((d) => d.id)))
    }
  }, [selection.isAllSelected, paginatedDrafts])

  // 编辑草稿
  const handleEditDraft = useCallback((id: string) => {
    router.push(`/publish?edit=${id}`)
  }, [router])

  // 单篇删除
  const handleDeleteDraft = useCallback(async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return

    setIsLoading(true)
    try {
      await deleteArticle(id)
      setDrafts((prev) => prev.filter((d) => d.id !== id))
      setSelectedIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
      alert('删除成功')
    } catch (error) {
      alert(error instanceof Error ? error.message : '删除失败')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 批量删除
  const handleBatchDelete = useCallback(async () => {
    if (selectedIds.size === 0) return

    if (!confirm(`确定要删除选中的 ${selectedIds.size} 篇文章吗？`)) return

    setIsLoading(true)
    try {
      // 真实删除
      for (const id of Array.from(selectedIds)) {
        await deleteArticle(id)
      }

      setDrafts((prev) => prev.filter((d) => !selectedIds.has(d.id)))
      setSelectedIds(new Set())
      router.refresh()
      alert('删除成功')
    } catch (error) {
      alert(error instanceof Error ? error.message : '删除失败')
    } finally {
      setIsLoading(false)
    }
  }, [selectedIds, router])

  // 批量发布
  const handleBatchPublish = useCallback(async () => {
    if (selectedIds.size === 0) return

    setIsLoading(true)
    try {
      // 真实更新状态
      for (const id of Array.from(selectedIds)) {
        await updateArticleStatus(id, 'published')
      }

      setDrafts((prev) =>
        prev.map((d) =>
          selectedIds.has(d.id) ? { ...d, status: 'published' as const } : d
        )
      )
      setSelectedIds(new Set())
      alert('发布成功')
    } catch (error) {
      alert(error instanceof Error ? error.message : '发布失败')
    } finally {
      setIsLoading(false)
    }
  }, [selectedIds])

  // 批量归档
  const handleBatchArchive = useCallback(async () => {
    if (selectedIds.size === 0) return

    setIsLoading(true)
    try {
      // 真实更新状态
      for (const id of Array.from(selectedIds)) {
        await updateArticleStatus(id, 'archived')
      }

      setDrafts((prev) =>
        prev.map((d) =>
          selectedIds.has(d.id) ? { ...d, status: 'archived' as const } : d
        )
      )
      setSelectedIds(new Set())
      alert('归档成功')
    } catch (error) {
      alert(error instanceof Error ? error.message : '归档失败')
    } finally {
      setIsLoading(false)
    }
  }, [selectedIds])

  // 取消选择
  const handleCancelSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  // 清空所有草稿
  const handleClearAllDrafts = useCallback(async () => {
    if (!confirm('确定要清空所有草稿吗？此操作不可恢复。')) return

    const draftArticles = drafts.filter((d) => d.status === 'draft')
    if (draftArticles.length === 0) {
      alert('没有可清空的草稿')
      return
    }

    setIsLoading(true)
    try {
      for (const draft of draftArticles) {
        await deleteArticle(draft.id)
      }

      setDrafts((prev) => prev.filter((d) => d.status !== 'draft'))
      alert('清空成功')
    } catch (error) {
      alert(error instanceof Error ? error.message : '清空失败')
    } finally {
      setIsLoading(false)
    }
  }, [drafts])

  // 新建草稿
  const handleNewDraft = useCallback(() => {
    router.push('/publish')
  }, [router])

  // 分页变化
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    setSelectedIds(new Set())
  }, [])

  return (
    <>
      <DraftsHeader
        draftCount={filteredDrafts.length}
        onClearAllDrafts={handleClearAllDrafts}
        onNewDraft={handleNewDraft}
      />

      <DraftsContent
        filterOptions={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        searchPlaceholder="搜索草稿标题或内容..."
        onSearch={handleSearch}
        selectedIds={selectedIds}
        paginatedDrafts={paginatedDrafts}
        selection={selection}
        onSelectDraft={handleSelectDraft}
        onSelectAll={handleSelectAll}
        onEditDraft={handleEditDraft}
        onDeleteDraft={handleDeleteDraft}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <BatchActionsBar
        selectedCount={selectedIds.size}
        visible={selectedIds.size > 0}
        onDelete={handleBatchDelete}
        onPublish={handleBatchPublish}
        onArchive={handleBatchArchive}
        onCancel={handleCancelSelection}
      />

      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-xf-accent mx-auto"></div>
            <p className="text-sm text-xf-primary mt-2">处理中...</p>
          </div>
        </div>
      )}
    </>
  )
}
