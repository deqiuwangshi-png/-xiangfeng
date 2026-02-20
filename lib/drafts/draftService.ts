import { DraftData, DraftStatus, DraftFilter } from '@/types/drafts'

/**
 * 草稿服务类
 * 
 * @class DraftService
 * @description
 * 提供草稿数据的增删改查、筛选、搜索等功能
 * 
 * @methods
 * - filterDraftsByStatus: 根据状态筛选草稿
 * - searchDraftsByQuery: 根据搜索查询筛选草稿
 * - filterDrafts: 综合筛选和搜索
 * - deleteDraft: 删除单个草稿
 * - deleteDrafts: 批量删除草稿
 * - publishDraft: 发布单个草稿
 * - publishDrafts: 批量发布草稿
 * - archiveDraft: 归档单个草稿
 * - archiveDrafts: 批量归档草稿
 * - getPaginatedDrafts: 分页获取草稿
 * - getTotalPages: 计算总页数
 */
export class DraftService {
  /**
   * 根据状态筛选草稿
   * 
   * @function filterDraftsByStatus
   * @param {DraftData[]} drafts - 草稿列表
   * @param {DraftFilter} filter - 筛选器
   * @returns {DraftData[]} 筛选后的草稿列表
   * 
   * @description
   * 根据草稿状态筛选草稿列表
   * - all: 返回所有草稿
   * - draft: 返回草稿状态的草稿
   * - published: 返回已发布状态的草稿
   * - archived: 返回已归档状态的草稿
   */
  static filterDraftsByStatus(drafts: DraftData[], filter: DraftFilter): DraftData[] {
    if (filter === 'all') return drafts
    return drafts.filter((draft) => draft.status === filter)
  }

  /**
   * 根据搜索查询筛选草稿
   * 
   * @function searchDraftsByQuery
   * @param {DraftData[]} drafts - 草稿列表
   * @param {string} query - 搜索查询
   * @returns {DraftData[]} 搜索后的草稿列表
   * 
   * @description
   * 根据搜索查询筛选草稿列表
   * 搜索范围包括：标题、摘要
   * 搜索不区分大小写
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
   * @function filterDrafts
   * @param {DraftData[]} drafts - 草稿列表
   * @param {DraftFilter} filter - 筛选器
   * @param {string} query - 搜索查询
   * @returns {DraftData[]} 筛选和搜索后的草稿列表
   * 
   * @description
   * 先根据状态筛选，再根据搜索查询筛选
   */
  static filterDrafts(
    drafts: DraftData[],
    filter: DraftFilter,
    query: string
  ): DraftData[] {
    const filteredByStatus = this.filterDraftsByStatus(drafts, filter)
    const filteredByQuery = this.searchDraftsByQuery(filteredByStatus, query)
    return filteredByQuery
  }

  /**
   * 删除单个草稿
   * 
   * @function deleteDraft
   * @param {DraftData[]} drafts - 草稿列表
   * @param {string} id - 草稿ID
   * @returns {DraftData[]} 删除后的草稿列表
   * 
   * @description
   * 从草稿列表中删除指定ID的草稿
   */
  static deleteDraft(drafts: DraftData[], id: string): DraftData[] {
    return drafts.filter((draft) => draft.id !== id)
  }

  /**
   * 批量删除草稿
   * 
   * @function deleteDrafts
   * @param {DraftData[]} drafts - 草稿列表
   * @param {Set<string>} ids - 草稿ID集合
   * @returns {DraftData[]} 删除后的草稿列表
   * 
   * @description
   * 从草稿列表中批量删除指定ID的草稿
   */
  static deleteDrafts(drafts: DraftData[], ids: Set<string>): DraftData[] {
    return drafts.filter((draft) => !ids.has(draft.id))
  }

  /**
   * 发布单个草稿
   * 
   * @function publishDraft
   * @param {DraftData[]} drafts - 草稿列表
   * @param {string} id - 草稿ID
   * @returns {DraftData[]} 发布后的草稿列表
   * 
   * @description
   * 将指定ID的草稿状态改为已发布
   */
  static publishDraft(drafts: DraftData[], id: string): DraftData[] {
    return drafts.map((draft) =>
      draft.id === id ? { ...draft, status: 'published' as DraftStatus } : draft
    )
  }

  /**
   * 批量发布草稿
   * 
   * @function publishDrafts
   * @param {DraftData[]} drafts - 草稿列表
   * @param {Set<string>} ids - 草稿ID集合
   * @returns {DraftData[]} 发布后的草稿列表
   * 
   * @description
   * 批量将指定ID的草稿状态改为已发布
   */
  static publishDrafts(drafts: DraftData[], ids: Set<string>): DraftData[] {
    return drafts.map((draft) =>
      ids.has(draft.id) ? { ...draft, status: 'published' as DraftStatus } : draft
    )
  }

  /**
   * 归档单个草稿
   * 
   * @function archiveDraft
   * @param {DraftData[]} drafts - 草稿列表
   * @param {string} id - 草稿ID
   * @returns {DraftData[]} 归档后的草稿列表
   * 
   * @description
   * 将指定ID的草稿状态改为已归档
   */
  static archiveDraft(drafts: DraftData[], id: string): DraftData[] {
    return drafts.map((draft) =>
      draft.id === id ? { ...draft, status: 'archived' as DraftStatus } : draft
    )
  }

  /**
   * 批量归档草稿
   * 
   * @function archiveDrafts
   * @param {DraftData[]} drafts - 草稿列表
   * @param {Set<string>} ids - 草稿ID集合
   * @returns {DraftData[]} 归档后的草稿列表
   * 
   * @description
   * 批量将指定ID的草稿状态改为已归档
   */
  static archiveDrafts(drafts: DraftData[], ids: Set<string>): DraftData[] {
    return drafts.map((draft) =>
      ids.has(draft.id) ? { ...draft, status: 'archived' as DraftStatus } : draft
    )
  }

  /**
   * 分页获取草稿
   * 
   * @function getPaginatedDrafts
   * @param {DraftData[]} drafts - 草稿列表
   * @param {number} currentPage - 当前页码
   * @param {number} itemsPerPage - 每页数量
   * @returns {DraftData[]} 当前页的草稿列表
   * 
   * @description
   * 根据当前页码和每页数量返回对应的草稿列表
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
   * @function getTotalPages
   * @param {DraftData[]} drafts - 草稿列表
   * @param {number} itemsPerPage - 每页数量
   * @returns {number} 总页数
   * 
   * @description
   * 根据草稿数量和每页数量计算总页数
   */
  static getTotalPages(drafts: DraftData[], itemsPerPage: number): number {
    return Math.ceil(drafts.length / itemsPerPage)
  }

  /**
   * 检查是否全选
   * 
   * @function isAllSelected
   * @param {DraftData[]} drafts - 草稿列表
   * @param {Set<string>} selectedIds - 选中的草稿ID集合
   * @returns {boolean} 是否全选
   * 
   * @description
   * 检查当前页的所有草稿是否都被选中
   */
  static isAllSelected(drafts: DraftData[], selectedIds: Set<string>): boolean {
    return drafts.length > 0 && drafts.every((draft) => selectedIds.has(draft.id))
  }

  /**
   * 检查是否部分选中
   * 
   * @function isPartiallySelected
   * @param {DraftData[]} drafts - 草稿列表
   * @param {Set<string>} selectedIds - 选中的草稿ID集合
   * @returns {boolean} 是否部分选中
   * 
   * @description
   * 检查当前页的草稿是否有部分被选中
   */
  static isPartiallySelected(drafts: DraftData[], selectedIds: Set<string>): boolean {
    const selectedCount = drafts.filter((draft) => selectedIds.has(draft.id)).length
    return selectedCount > 0 && selectedCount < drafts.length
  }
}
