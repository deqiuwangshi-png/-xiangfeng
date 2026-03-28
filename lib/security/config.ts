/**
 * 安全配置管理
 * @module lib/security/config
 * @description 集中管理安全相关的配置和最佳实践
 */

/**
 * 安全配置常量
 */
export const SECURITY_CONFIG = {
  // 密码策略
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: true,
  },

  // 速率限制
  RATE_LIMIT: {
    // 登录尝试限制
    LOGIN: {
      MAX_ATTEMPTS: 5,
      WINDOW_MS: 15 * 60 * 1000, // 15分钟
    },
    // 注册尝试限制
    REGISTER: {
      MAX_ATTEMPTS: 3,
      WINDOW_MS: 60 * 60 * 1000, // 1小时
    },
    // 发布文章限制
    PUBLISH: {
      MAX_ATTEMPTS_HOURLY: 10,
      MAX_ATTEMPTS_MINUTE: 2,
      WINDOW_MS_HOURLY: 60 * 60 * 1000, // 1小时
      WINDOW_MS_MINUTE: 60 * 1000, // 1分钟
    },
    // 签到限制
    SIGNIN: {
      MAX_ATTEMPTS: 1,
      WINDOW_MS: 60 * 60 * 1000, // 1小时
    },
    // 任务更新限制
    TASK_UPDATE: {
      MAX_ATTEMPTS: 5,
      WINDOW_MS: 60 * 1000, // 1分钟
    },
    // 任务领取限制
    TASK_CLAIM: {
      MAX_ATTEMPTS: 3,
      WINDOW_MS: 60 * 1000, // 1分钟
    },
  },

  // 内容安全
  CONTENT: {
    // 敏感词过滤级别
    SENSITIVE_WORDS_LEVEL: 'strict' as const,
    // 文章标题长度限制
    TITLE_MAX_LENGTH: 100,
    // 文章内容长度限制
    CONTENT_MAX_LENGTH: 50000,
    // 允许的HTML标签
    ALLOWED_HTML_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr', 'a', 'img',
    ],
  },

  // 媒体安全
  MEDIA: {
    // 最大文件大小（5MB）
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    // 允许的文件类型
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    // 文件名最大长度
    MAX_FILENAME_LENGTH: 255,
  },

  // 令牌安全
  TOKEN: {
    // Nonce 过期时间（5分钟）
    NONCE_EXPIRY: 5 * 60 * 1000,
    // JWT 过期时间（7天）
    JWT_EXPIRY: 7 * 24 * 60 * 60 * 1000,
  },

  // 会话安全
  SESSION: {
    // 会话过期时间（30天）
    EXPIRY: 30 * 24 * 60 * 60 * 1000,
    // 记住我过期时间（90天）
    REMEMBER_EXPIRY: 90 * 24 * 60 * 60 * 1000,
  },

  // 日志安全
  LOG: {
    // 是否记录详细日志
    DETAILED: process.env.NODE_ENV !== 'production',
    // 敏感信息脱敏
    MASK_SENSITIVE: true,
  },
};

/**
 * 安全最佳实践
 */
export const SECURITY_BEST_PRACTICES = {
  // 输入验证
  INPUT_VALIDATION: {
    // 始终验证所有用户输入
    VALIDATE_ALL_INPUTS: true,
    // 使用参数化查询防止SQL注入
    USE_PARAMETERIZED_QUERIES: true,
    // 对所有输出进行HTML转义
    ESCAPE_HTML_OUTPUT: true,
  },

  // 认证与授权
  AUTHENTICATION: {
    // 使用HTTPS传输凭证
    USE_HTTPS: true,
    // 实现密码复杂度要求
    ENFORCE_PASSWORD_COMPLEXITY: true,
    // 限制登录尝试次数
    LIMIT_LOGIN_ATTEMPTS: true,
    // 实现会话超时
    SESSION_TIMEOUT: true,
  },

  // 数据保护
  DATA_PROTECTION: {
    // 加密存储敏感数据
    ENCRYPT_SENSITIVE_DATA: true,
    // 定期备份数据
    REGULAR_BACKUPS: true,
    // 实现数据访问控制
    ACCESS_CONTROL: true,
  },

  // 服务器安全
  SERVER_SECURITY: {
    // 最小权限原则
    LEAST_PRIVILEGE: true,
    // 定期更新依赖
    REGULAR_UPDATES: true,
    // 安全日志记录
    SECURITY_LOGGING: true,
  },
};

/**
 * 安全头配置
 */
export const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

/**
 * 检查安全配置是否符合最佳实践
 * @returns 检查结果
 */
export function checkSecurityConfig(): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // 检查密码策略
  if (SECURITY_CONFIG.PASSWORD.MIN_LENGTH < 8) {
    issues.push('密码最小长度应至少为8位');
  }

  // 检查速率限制
  if (SECURITY_CONFIG.RATE_LIMIT.LOGIN.MAX_ATTEMPTS > 10) {
    issues.push('登录尝试限制应不超过10次');
  }

  // 检查内容安全
  if (SECURITY_CONFIG.CONTENT.TITLE_MAX_LENGTH > 200) {
    issues.push('文章标题长度限制应不超过200字符');
  }

  // 检查媒体安全
  if (SECURITY_CONFIG.MEDIA.MAX_FILE_SIZE > 10 * 1024 * 1024) {
    issues.push('文件大小限制应不超过10MB');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
