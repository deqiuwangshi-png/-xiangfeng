/**
 * SWR 缓存 Key 集中管理
 * @module lib/cache/keys
 * @description 统一管理所有 SWR 缓存 Key，避免硬编码和重复定义
 *
 * @命名规范
 * - 格式: domain/resource[/identifier]
 * - 使用小写字母和连字符
 * - 层级不超过3层
 * - 动态参数使用函数返回数组
 *
 * @示例
 * - user/profile                    // 静态 Key
 * - user/points/overview            // 多层静态 Key
 * - ['articles', 'detail', id]      // 动态 Key (数组格式)
 */

// ============================================
// 认证相关
// ============================================
export const AUTH_KEYS = {
  /** 当前用户信息 */
  USER: 'auth/user',
  /** 用户资料 */
  PROFILE: 'auth/profile',
} as const

// ============================================
// 用户相关
// ============================================
export const USER_KEYS = {
  /** 用户资料 (按用户ID) */
  profile: (userId: string): (string | number)[] => ['user', 'profile', userId],
  
  /** 积分总览 */
  POINTS_OVERVIEW: 'user/points/overview',
  
  /** 积分流水 */
  pointsTransactions: (limit: number, offset: number): (string | number)[] => 
    ['user', 'points', 'transactions', limit, offset],
  
  /** 兑换记录 */
  exchangeRecords: (limit: number, offset: number): (string | number)[] => 
    ['user', 'exchange', 'records', limit, offset],
  
  /** 用户统计信息 */
  stats: (userId: string): (string | number)[] => ['user', 'stats', userId],
} as const

// ============================================
// 文章相关
// ============================================
export const ARTICLE_KEYS = {
  /** 文章列表 */
  LIST: 'articles/list',
  
  /** 草稿列表 */
  DRAFTS: 'articles/drafts',
  
  /** 文章详情 */
  detail: (id: string): (string | number)[] => ['articles', 'detail', id],
  
  /** 文章点赞状态 */
  likes: (articleId: string): (string | number)[] => ['articles', 'likes', articleId],
  
  /** 文章收藏状态 */
  bookmarks: (articleId: string): (string | number)[] => ['articles', 'bookmarks', articleId],
  
  /** 文章评论 */
  comments: (articleId: string): (string | number)[] => ['articles', 'comments', articleId],
  
  /** 文章浏览量 */
  views: (articleId: string): (string | number)[] => ['articles', 'views', articleId],
} as const

// ============================================
// 奖励系统
// ============================================
export const REWARDS_KEYS = {
  /** 签到状态 */
  SIGNIN_STATUS: 'rewards/signin/status',
  
  /** 签到奖励配置 */
  SIGNIN_CONFIG: 'rewards/signin/config',
  
  /** 任务列表 */
  tasks: (category?: string): (string | number)[] => 
    category ? ['rewards', 'tasks', category] : ['rewards', 'tasks'],
  
  /** 商城商品 */
  shopItems: (category?: string): (string | number)[] => 
    category ? ['rewards', 'shop', category] : ['rewards', 'shop'],
  
  /** 等级信息 */
  LEVEL_INFO: 'rewards/level/info',
} as const

// ============================================
// 消息通知
// ============================================
export const NOTIFICATION_KEYS = {
  /** 通知列表 */
  list: (userId: string): (string | number)[] => ['notifications', 'list', userId],
  
  /** 未读数量 */
  unreadCount: (userId: string): (string | number)[] => ['notifications', 'unread', userId],
} as const

// ============================================
// 设置相关
// ============================================
export const SETTINGS_KEYS = {
  /** 用户设置 */
  USER_SETTINGS: 'settings/user',
  
  /** 通知设置 */
  NOTIFICATIONS: 'settings/notifications',
  
  /** 隐私设置 */
  PRIVACY: 'settings/privacy',
  
  /** 外观设置 */
  APPEARANCE: 'settings/appearance',
} as const

// ============================================
// 反馈相关
// ============================================
export const FEEDBACK_KEYS = {
  /** 反馈列表 */
  LIST: 'feedback/list',
  
  /** 我的反馈 */
  myFeedback: (userId: string): (string | number)[] => ['feedback', 'my', userId],
} as const

// ============================================
// 统一导出
// ============================================
export const CACHE_KEYS = {
  AUTH: AUTH_KEYS,
  USER: USER_KEYS,
  ARTICLE: ARTICLE_KEYS,
  REWARDS: REWARDS_KEYS,
  NOTIFICATION: NOTIFICATION_KEYS,
  SETTINGS: SETTINGS_KEYS,
  FEEDBACK: FEEDBACK_KEYS,
} as const

// 导出兼容旧代码的别名
export const USER_SETTINGS = SETTINGS_KEYS.USER_SETTINGS
export const NOTIFICATIONS = SETTINGS_KEYS.NOTIFICATIONS
export const PRIVACY = SETTINGS_KEYS.PRIVACY
export const APPEARANCE = SETTINGS_KEYS.APPEARANCE

/**
 * 缓存 Key 类型
 * 用于类型约束和自动完成
 */
export type CacheKey = 
  | string 
  | (string | number)[]

/**
 * 获取缓存 Key 的字符串表示 (用于日志等)
 * @param key - 缓存 Key
 * @returns 字符串表示
 */
export function getCacheKeyString(key: CacheKey): string {
  if (typeof key === 'string') {
    return key
  }
  return key.join('/')
}

/**
 * 缓存依赖关系定义
 * 用于自动刷新关联缓存
 */
export const CACHE_DEPENDENCIES: Record<string, string[]> = {
  // 签到成功后刷新积分
  [REWARDS_KEYS.SIGNIN_STATUS]: [USER_KEYS.POINTS_OVERVIEW],
  
  // 兑换成功后刷新积分和兑换记录
  [getCacheKeyString(REWARDS_KEYS.shopItems())]: [
    USER_KEYS.POINTS_OVERVIEW,
    getCacheKeyString(USER_KEYS.exchangeRecords(4, 0)),
  ],
  
  // 发布草稿后刷新文章列表
  [ARTICLE_KEYS.DRAFTS]: [ARTICLE_KEYS.LIST],
}

/**
 * 获取依赖的缓存 Keys
 * @param key - 主缓存 Key
 * @returns 依赖的缓存 Keys 数组
 */
export function getCacheDependencies(key: CacheKey): string[] {
  const keyString = getCacheKeyString(key)
  return CACHE_DEPENDENCIES[keyString] || []
}
