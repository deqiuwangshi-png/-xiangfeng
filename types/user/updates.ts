/**
 * 更新日志类型定义
 * 
 * 作用: 定义更新日志相关的所有类型
 * 
 * @exports UpdateType, VersionType, UpdateItem, VersionInfo, MonthlyUpdate
 * 
 * 使用说明:
 *   用于更新日志页面的类型安全
 *   包含更新类型、版本类型、更新条目等
 * 
 * 更新时间: 2026-02-19
 */

/**
 * 更新类型枚举
 * 
 * @enum UpdateType
 * @description 定义更新条目的类型
 */
export enum UpdateType {
  /** 新功能 */
  NEW = 'new',
  /** 改进优化 */
  IMPROVED = 'improved',
  /** 问题修复 */
  FIXED = 'fixed'
}

/**
 * 版本类型枚举
 * 
 * @enum VersionType
 * @description 定义版本号的类型
 */
export enum VersionType {
  /** 主版本（重大更新） */
  MAJOR = 'major',
  /** 次版本（新功能） */
  MINOR = 'minor',
  /** 补丁版本（修复） */
  PATCH = 'patch'
}

/**
 * 更新条目接口
 * 
 * @interface UpdateItem
 * @description 单个更新条目的数据结构
 */
export interface UpdateItem {
  /** 更新类型 */
  type: UpdateType
  /** 更新描述 */
  description: string
}

/**
 * 版本信息接口
 * 
 * @interface VersionInfo
 * @description 单个版本的信息
 */
export interface VersionInfo {
  /** 版本号（如 V2.5.0） */
  version: string
  /** 版本标题 */
  title: string
  /** 发布日期 */
  date: string
  /** 版本类型 */
  versionType: VersionType
  /** 更新条目列表 */
  updates: UpdateItem[]
  /** 数据分类（用于筛选） */
  categories: UpdateType[]
}

/**
 * 月度更新接口
 * 
 * @interface MonthlyUpdate
 * @description 单个月份的更新信息
 */
export interface MonthlyUpdate {
  /** 年份 */
  year: number
  /** 月份 */
  month: number
  /** 版本列表 */
  versions: VersionInfo[]
}

/**
 * 筛选类型
 * 
 * @type FilterType
 * @description 筛选按钮的类型
 */
export type FilterType = 'all' | UpdateType
