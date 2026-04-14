/**
 * 缓存管理模块统一导出
 * @module lib/cache
 * @description 提供 SWR 缓存 Key 管理和相关工具函数
 */

export {
  // 缓存 Key 常量
  CACHE_KEYS,
  AUTH_KEYS,
  USER_KEYS,
  ARTICLE_KEYS,
  REWARDS_KEYS,
  NOTIFICATION_KEYS,
  SETTINGS_KEYS,
  
  // 工具函数
  getCacheKeyString,
  getCacheDependencies,
  CACHE_DEPENDENCIES,
} from './keys'

export type {
  CacheKey,
} from './keys'
