/**
 * 应用常量配置
 * 定义项目中使用的所有常量
 */

// 应用基本信息
export const APP_INFO = {
  NAME: '向风',
  DESCRIPTION: '连接创作者，分享知识，激发灵感',
  VERSION: '1.0.0',
  URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://xiangfeng.com',
  API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
} as const;

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// 文件上传配置
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain', 'application/msword'],
  MAX_AVATAR_SIZE: 2 * 1024 * 1024, // 2MB
} as const;

// 用户配置
export const USER = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 2,
  MAX_USERNAME_LENGTH: 20,
  MAX_BIO_LENGTH: 500,
  MAX_WEBSITE_LENGTH: 200,
  MAX_LOCATION_LENGTH: 100,
} as const;

// 文章配置
export const ARTICLE = {
  MIN_TITLE_LENGTH: 1,
  MAX_TITLE_LENGTH: 200,
  MIN_CONTENT_LENGTH: 10,
  MAX_CONTENT_LENGTH: 50000,
  MIN_EXCERPT_LENGTH: 10,
  MAX_EXCERPT_LENGTH: 500,
  MAX_TAGS_COUNT: 10,
  MAX_TAG_LENGTH: 50,
} as const;

// 讨论配置
export const DISCUSSION = {
  MIN_TITLE_LENGTH: 1,
  MAX_TITLE_LENGTH: 200,
  MIN_CONTENT_LENGTH: 10,
  MAX_CONTENT_LENGTH: 10000,
  MAX_TAGS_COUNT: 8,
  MAX_TAG_LENGTH: 30,
  CATEGORIES: [
    '技术讨论',
    '创作技巧',
    '行业动态',
    '学习交流',
    '项目展示',
    '求助问答',
    '意见建议',
    '其他'
  ],
} as const;

// 评论配置
export const COMMENT = {
  MIN_CONTENT_LENGTH: 1,
  MAX_CONTENT_LENGTH: 1000,
  MAX_NESTING_LEVEL: 3,
} as const;

// 缓存配置
export const CACHE = {
  STATIC_RESOURCE_MAX_AGE: 60 * 60 * 24 * 30, // 30 days
  API_RESPONSE_MAX_AGE: 60 * 5, // 5 minutes
  USER_SESSION_MAX_AGE: 60 * 60 * 24 * 7, // 7 days
} as const;

// 正则表达式
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  USERNAME: /^[a-zA-Z0-9_-]{2,20}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
  PHONE: /^1[3-9]\d{9}$/,
} as const;

// 时间配置
export const TIME = {
  DEBOUNCE_DELAY: 300, // 防抖延迟（毫秒）
  LOADING_DELAY: 200, // 加载延迟（毫秒）
  TOAST_DURATION: 3000, // Toast显示时长（毫秒）
  MODAL_ANIMATION_DURATION: 200, // 模态框动画时长（毫秒）
  AUTO_SAVE_INTERVAL: 30000, // 自动保存间隔（毫秒）
} as const;

// 主题配置
export const THEME = {
  COLORS: {
    PRIMARY: '#3B82F6',
    SECONDARY: '#8B5CF6',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#06B6D4',
  },
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络错误，请检查网络连接',
  SERVER_ERROR: '服务器错误，请稍后重试',
  UNAUTHORIZED: '未授权，请重新登录',
  FORBIDDEN: '权限不足',
  NOT_FOUND: '请求的资源不存在',
  VALIDATION_ERROR: '输入数据验证失败',
  RATE_LIMIT: '请求过于频繁，请稍后重试',
  UNKNOWN_ERROR: '未知错误，请稍后重试',
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登录成功',
  REGISTER_SUCCESS: '注册成功',
  LOGOUT_SUCCESS: '登出成功',
  UPDATE_SUCCESS: '更新成功',
  DELETE_SUCCESS: '删除成功',
  SAVE_SUCCESS: '保存成功',
  PUBLISH_SUCCESS: '发布成功',
  SEND_SUCCESS: '发送成功',
} as const;

// 路由配置
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ARTICLES: '/articles',
  DISCUSSIONS: '/discussions',
  PROFILE: '/profile',
  EDITOR: '/editor',
  ABOUT: '/about',
  SERVICES: '/services',
  COMMUNITY: '/community',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const;