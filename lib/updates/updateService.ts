/**
 * 更新日志服务类
 * 
 * 作用: 封装更新日志的数据操作逻辑
 * 
 * @exports UpdateService
 * 
 * 使用说明:
 *   用于更新日志页面的数据处理
 *   包含筛选、搜索等功能
 * 
 * 核心方法:
 *   - filterByType: 按类型筛选更新
 *   - searchUpdates: 搜索更新内容
 *   - getLatestVersion: 获取最新版本
 * 
 * 更新时间: 2026-02-19
 */

import { UpdateType, MonthlyUpdate, VersionInfo, FilterType } from '@/types/user/updates'

/**
 * 更新日志服务类
 * 
 * @class UpdateService
 * @description 封装更新日志的数据操作逻辑
 * 
 * @methods
 *   - filterByType: 按类型筛选更新
 *   - searchUpdates: 搜索更新内容
 *   - getLatestVersion: 获取最新版本
 */
export class UpdateService {
  /**
   * 按类型筛选更新
   * 
   * @static
   * @param {MonthlyUpdate[]} updates - 所有更新数据
   * @param {FilterType} type - 筛选类型
   * @returns {MonthlyUpdate[]} 筛选后的更新数据
   * 
   * @description
   * 根据筛选类型过滤更新日志：
   * - 'all': 返回所有更新
   * - 'new': 仅返回新功能
   * - 'improved': 仅返回改进优化
   * - 'fixed': 仅返回问题修复
   * 
   * @example
   * const filtered = UpdateService.filterByType(updates, 'new')
   */
  static filterByType(
    updates: MonthlyUpdate[],
    type: FilterType
  ): MonthlyUpdate[] {
    if (type === 'all') {
      return updates
    }
    
    return updates.map(update => ({
      ...update,
      versions: update.versions
        .map(version => ({
          ...version,
          updates: version.updates.filter(item => item.type === type)
        }))
        .filter(version => version.updates.length > 0)
    })).filter(update => update.versions.length > 0)
  }

  /**
   * 搜索更新内容
   * 
   * @static
   * @param {MonthlyUpdate[]} updates - 所有更新数据
   * @param {string} query - 搜索关键词
   * @returns {MonthlyUpdate[]} 搜索结果
   * 
   * @description
   * 根据关键词搜索更新日志：
   * - 搜索版本标题
   * - 搜索更新描述
   * - 不区分大小写
   * 
   * @example
   * const results = UpdateService.searchUpdates(updates, 'AI')
   */
  static searchUpdates(
    updates: MonthlyUpdate[],
    query: string
  ): MonthlyUpdate[] {
    if (!query.trim()) {
      return updates
    }
    
    const lowerQuery = query.toLowerCase()
    
    return updates.map(update => ({
      ...update,
      versions: update.versions
        .map(version => ({
          ...version,
          updates: version.updates.filter(item =>
            item.description.toLowerCase().includes(lowerQuery) ||
            version.title.toLowerCase().includes(lowerQuery)
          )
        }))
        .filter(version => version.updates.length > 0)
    })).filter(update => update.versions.length > 0)
  }

  /**
   * 获取最新版本
   * 
   * @static
   * @param {MonthlyUpdate[]} updates - 所有更新数据
   * @returns {VersionInfo | null} 最新版本信息
   * 
   * @description
   * 返回最新的版本信息：
   * - 按年份和月份排序
   * - 返回第一个版本的第一个版本
   * - 如果没有数据，返回 null
   * 
   * @example
   * const latest = UpdateService.getLatestVersion(updates)
   */
  static getLatestVersion(
    updates: MonthlyUpdate[]
  ): VersionInfo | null {
    if (updates.length === 0) {
      return null
    }
    
    if (updates[0].versions.length === 0) {
      return null
    }
    
    return updates[0].versions[0]
  }

  /**
   * 检查版本是否包含指定类型
   * 
   * @static
   * @param {VersionInfo} version - 版本信息
   * @param {UpdateType} type - 更新类型
   * @returns {boolean} 是否包含指定类型
   * 
   * @description
   * 检查版本是否包含指定类型的更新
   * 
   * @example
   * const hasNew = UpdateService.hasUpdateType(version, UpdateType.NEW)
   */
  static hasUpdateType(
    version: VersionInfo,
    type: UpdateType
  ): boolean {
    return version.categories.includes(type)
  }
}
