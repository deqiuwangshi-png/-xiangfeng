'use client'

import { DraftCard } from '@/components/drafts/DraftCard'
import { FilterChips } from '@/components/drafts/FilterChips'
import { SearchBox } from '@/components/drafts/SearchBox'
import { Pagination } from '@/components/drafts/Pagination'
import { BatchActionsBar } from '@/components/drafts/BatchActionsBar'
import { useDrafts } from '@/hooks/useDrafts'
import { mockDrafts, filterOptions } from '@/constants/drafts'

/**
 * 草稿管理页面组件
 * 
 * @function DraftsPage
 * @returns {JSX.Element} 草稿管理页面组件
 * 
 * @description
 * 草稿管理主页面，提供：
 * - 草稿列表展示（单列垂直布局）
 * - 草稿状态筛选（全部、草稿、已发布、已归档）
 * - 草稿搜索（标题和内容）
 * - 草稿选择（单选和批量选择）
 * - 批量操作（删除、发布、归档）
 * - 草稿编辑（点击卡片进入编辑）
 * - 分页导航
 * 
 * @data-source
 * docs/08原型文件设计图/草稿.html
 * 
 * @styles
 * - 顶部栏背景: rgba(255, 255, 255, 0.95)
 * - 顶部栏边框: rgba(229, 231, 235, 0.5)
 * - 标签背景: rgba(106, 91, 138, 0.05)
 * - 标签文字: #6A5B8A
 * - 数量文字: #8C8EA9
 * - 删除按钮文字: #EF4444
 * - 新建按钮背景: #6A5B8A
 * 
 * @interactions
 * - 点击筛选器：切换筛选状态
 * - 输入搜索：实时过滤草稿
 * - 点击卡片：进入编辑模式
 * - 点击选择框：切换选中状态
 * - 点击批量操作：执行批量操作
 * 
 * @architecture
 * - 使用 useDrafts Hook 管理状态和逻辑
 * - 使用 DraftService 处理数据操作
 * - 组件职责单一，便于维护
 * - 逻辑与UI分离
 */
export default function DraftsPage() {
  const {
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
    handleBatchDelete,
    handleBatchPublish,
    handleBatchArchive,
    handleCancelSelection,
    handleClearAllDrafts,
    handleNewDraft,
    handlePageChange,
  } = useDrafts(mockDrafts)

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar relative scroll-smooth">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 左侧：标题 */}
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-xf-primary bg-xf-subtle px-3 py-1.5 rounded-lg">
                草稿管理
              </div>
              <span className="text-sm text-xf-medium ml-2">
                {filteredDrafts.length} 篇草稿
              </span>
            </div>

            {/* 右侧：操作按钮 */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleClearAllDrafts}
                className="text-sm text-xf-danger hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="hidden sm:inline">清空草稿</span>
              </button>
              <button
                onClick={handleNewDraft}
                className="bg-xf-primary text-white px-4 py-1.5 rounded-lg hover:bg-xf-accent transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>新建草稿</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 fade-in">
        {/* 筛选和搜索栏 */}
        <div className="mb-6 slide-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            {/* 筛选器 */}
            <FilterChips
              options={filterOptions}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />

            {/* 搜索框 */}
            <SearchBox
              placeholder="搜索草稿标题或内容..."
              onSearch={handleSearch}
            />
          </div>

          {/* 批量操作提示 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`
                  select-checkbox w-5 h-5 rounded-md border-2
                  flex items-center justify-center cursor-pointer
                  transition-all duration-200
                  ${selection.isAllSelected
                    ? 'bg-xf-primary border-xf-primary'
                    : 'border-gray-300 bg-transparent'
                  }
                `}
                onClick={handleSelectAll}
              >
                {selection.isAllSelected && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
              </div>
              <span className="text-sm text-xf-medium">全选</span>
            </div>
            <div className="text-sm text-xf-medium hidden md:block">
              <span>{selectedIds.size}</span> 篇选中
            </div>
          </div>
        </div>

        {/* 草稿列表 */}
        {paginatedDrafts.length > 0 ? (
          <>
            <div className="space-y-4">
              {paginatedDrafts.map((draft) => (
                <DraftCard
                  key={draft.id}
                  draft={draft}
                  selected={selectedIds.has(draft.id)}
                  onSelect={handleSelectDraft}
                  onEdit={handleEditDraft}
                />
              ))}
            </div>

            {/* 分页器 */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          /* 空状态 */
          <div className="empty-state flex flex-col items-center justify-center py-16 text-center">
            <div className="empty-state-icon w-20 h-20 rounded-full bg-xf-primary/10 flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-xf-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-xf-dark mb-2">暂无草稿</h3>
            <p className="text-xf-medium mb-4">创建你的第一篇草稿，开始记录灵感</p>
          </div>
        )}
      </div>

      {/* 批量操作栏 */}
      <BatchActionsBar
        selectedCount={selectedIds.size}
        visible={selectedIds.size > 0}
        onDelete={handleBatchDelete}
        onPublish={handleBatchPublish}
        onArchive={handleBatchArchive}
        onCancel={handleCancelSelection}
      />
    </div>
  )
}
