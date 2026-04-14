import { DraftData, DraftStatus, DraftFilter } from '@/types/drafts'

/**
 * 草稿服务类
 *
 * @class DraftService
 * @description
 * 提供草稿数据的筛选、搜索、分页等纯数据处理功能
 *
 * @methods
 * - filterDraftsByStatus: 根据状态筛选草稿
 * - searchDraftsByQuery: 根据搜索查询筛选草稿
 * - filterDrafts: 综合筛选和搜索
 * - getPaginatedDrafts: 分页获取草稿
 * - getTotalPages: 计算总页数
 * - updateDraftsStatus: 批量更新草稿状态
 * - removeDrafts: 批量删除草稿
 */
export class DraftService {
  /**
   * 根据状态筛选草稿
   *
   * @param drafts - 草稿列表
   * @param filter - 筛选器
   * @returns 筛选后的草稿列表
   */
  static filterDraftsByStatus(drafts: DraftData[], filter: DraftFilter): DraftData[] {
    if (filter === 'all') return drafts
    return drafts.filter((draft) => draft.status === filter)
  }

  /**
   * 根据搜索查询筛选草稿
   *
   * @param drafts - 草稿列表
   * @param query - 搜索查询
   * @returns 搜索后的草稿列表
   */
  static searchDraftsByQuery(drafts: DraftData[], query: string): DraftData[] {
    if (!query) return drafts

    const lowerQuery = query.toLowerCase()
    return drafts.filter(
      (draft) =>
        draft.title.toLowerCase().includes(lowerQuery) ||
        draft.summary.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * 综合筛选和搜索
   *
   * @param drafts - 草稿列表
   * @param filter - 筛选器
   * @param query - 搜索查询
   * @returns 筛选和搜索后的草稿列表
   * @note 组合 filterDraftsByStatus 和 searchDraftsByQuery
   */
  static filterDrafts(
    drafts: DraftData[],
    filter: DraftFilter,
    query: string
  ): DraftData[] {
    return this.searchDraftsByQuery(
      this.filterDraftsByStatus(drafts, filter),
      query
    )
  }

  /**
   * 分页获取草稿
   *
   * @param drafts - 草稿列表
   * @param currentPage - 当前页码
   * @param itemsPerPage - 每页数量
   * @returns 当前页的草稿列表
   */
  static getPaginatedDrafts(
    drafts: DraftData[],
    currentPage: number,
    itemsPerPage: number
  ): DraftData[] {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return drafts.slice(startIndex, endIndex)
  }

  /**
   * 计算总页数
   *
   * @param drafts - 草稿列表
   * @param itemsPerPage - 每页数量
   * @returns 总页数
   */
  static getTotalPages(drafts: DraftData[], itemsPerPage: number): number {
    return Math.ceil(drafts.length / itemsPerPage)
  }

  /**
   * 批量更新草稿状态
   *
   * @param drafts - 草稿列表
   * @param ids - 要更新的草稿ID集合
   * @param status - 新状态
   * @returns 更新后的草稿列表
   */
  static updateDraftsStatus(
    drafts: DraftData[],
    ids: Set<string>,
    status: DraftStatus
  ): DraftData[] {
    return drafts.map((draft) =>
      ids.has(draft.id) ? { ...draft, status } : draft
    )
  }

  /**
   * 批量删除草稿
   *
   * @param drafts - 草稿列表
   * @param ids - 要删除的草稿ID集合
   * @returns 删除后的草稿列表
   */
  static removeDrafts(drafts: DraftData[], ids: Set<string>): DraftData[] {
    return drafts.filter((draft) => !ids.has(draft.id))
  }

  /**
   * 检查是否全选
   *
   * @param drafts - 草稿列表
   * @param selectedIds - 选中的草稿ID集合
   * @returns 是否全选
   */
  static isAllSelected(drafts: DraftData[], selectedIds: Set<string>): boolean {
    return drafts.length > 0 && drafts.every((draft) => selectedIds.has(draft.id))
  }

  /**
   * 检查是否部分选中
   *
   * @param drafts - 草稿列表
   * @param selectedIds - 选中的草稿ID集合
   * @returns 是否部分选中
   */
  static isPartiallySelected(drafts: DraftData[], selectedIds: Set<string>): boolean {
    const selectedCount = drafts.filter((draft) => selectedIds.has(draft.id)).length
    return selectedCount > 0 && selectedCount < drafts.length
  }
}
