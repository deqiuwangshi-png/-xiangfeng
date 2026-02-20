/**
 * 更新日志 Hook
 * 
 * 作用: 管理更新日志页面的状态和操作
 * 
 * @exports useUpdates
 * 
 * 使用说明:
 *   用于更新日志页面的状态管理
 *   包含筛选、搜索等功能
 * 
 * @returns
 *   - updates: 所有更新数据
 *   - filteredUpdates: 筛选后的更新数据
 *   - activeFilter: 当前激活的筛选类型
 *   - searchQuery: 搜索关键词
 *   - handleFilterChange: 处理筛选变化
 *   - handleSearchChange: 处理搜索变化
 * 
 * 更新时间: 2026-02-19
 */

'use client'

import { useState, useMemo } from 'react'
import { UpdateService } from '@/lib/updates/updateService'
import { MonthlyUpdate, FilterType } from '@/types/updates'

/**
 * 更新日志 Hook
 * 
 * @function useUpdates
 * @param {MonthlyUpdate[]} initialUpdates - 初始更新数据（从服务器端传入）
 * @returns {Object} 更新日志状态和操作函数
 * 
 * @description
 * 管理更新日志页面的所有状态和操作：
 * - 所有更新数据（从服务器端传入）
 * - 筛选后的更新数据
 * - 当前激活的筛选类型
 * - 搜索关键词
 * - 筛选和搜索操作
 * 
 * @state
 * - updates: 所有更新数据（从服务器端传入）
 * - activeFilter: 当前激活的筛选类型
 * - searchQuery: 搜索关键词
 * 
 * @computed
 * - filteredUpdates: 筛选和搜索后的更新数据
 * 
 * @methods
 * - handleFilterChange: 处理筛选类型变化
 * - handleSearchChange: 处理搜索关键词变化
 */
export function useUpdates(initialUpdates: MonthlyUpdate[] = []) {
  /** 所有更新数据 */
  const [updates] = useState<MonthlyUpdate[]>(initialUpdates)
  
  /** 当前激活的筛选类型 */
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  
  /** 搜索关键词 */
  const [searchQuery, setSearchQuery] = useState<string>('')

  /**
   * 筛选和搜索后的更新数据
   * 
   * @constant filteredUpdates
   * @description
   * 使用 useMemo 缓存计算结果：
   * 1. 先按类型筛选
   * 2. 再按关键词搜索
   */
  const filteredUpdates = useMemo(() => {
    // 先按类型筛选
    const typeFiltered = UpdateService.filterByType(updates, activeFilter)
    
    // 再按关键词搜索
    return UpdateService.searchUpdates(typeFiltered, searchQuery)
  }, [updates, activeFilter, searchQuery])

  /**
   * 处理筛选类型变化
   * 
   * @function handleFilterChange
   * @param {FilterType} type - 筛选类型
   * @returns {void}
   * 
   * @description
   * 更新当前激活的筛选类型
   * 
   * @example
   * handleFilterChange('new')
   */
  const handleFilterChange = (type: FilterType) => {
    setActiveFilter(type)
  }

  /**
   * 处理搜索关键词变化
   * 
   * @function handleSearchChange
   * @param {string} query - 搜索关键词
   * @returns {void}
   * 
   * @description
   * 更新搜索关键词
   * 
   * @example
   * handleSearchChange('AI')
   */
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  return {
    /** 所有更新数据 */
    updates,
    /** 筛选和搜索后的更新数据 */
    filteredUpdates,
    /** 当前激活的筛选类型 */
    activeFilter,
    /** 搜索关键词 */
    searchQuery,
    /** 处理筛选类型变化 */
    handleFilterChange,
    /** 处理搜索关键词变化 */
    handleSearchChange
  }
}
