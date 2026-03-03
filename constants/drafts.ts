import { DraftFilter } from '@/types/drafts'

/**
 * 筛选选项配置
 */
export const filterOptions: Array<{ value: DraftFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'draft', label: '草稿' },
  { value: 'published', label: '已发布' },
  { value: 'archived', label: '已归档' },
]

/**
 * 分页配置
 */
export const paginationConfig = {
  itemsPerPage: 6,
}
