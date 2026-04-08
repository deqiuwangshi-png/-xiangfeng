/**
 * 认证工具函数统一导出
 * @module lib/auth/utils
 * @description 认证相关工具函数的集中导出入口
 *
 * @使用场景
 * - Cookie 配置管理
 * - 重定向安全校验
 * - 邮箱验证等辅助功能
 */

// ==================== Cookie 配置 ====================
export {
  getAuthCookieConfig,
  getDevAuthCookieConfig,
  getFeatureCookieConfig,
  getCurrentAuthCookieConfig,
} from './cookieConfig';

// ==================== 重定向工具 ====================
export {
  sanitizeRedirect,
} from './redir';

// ==================== 辅助函数 ====================
export {
  ALLOWED_EMAIL_DOMAINS,
  isAllowedEmail,
  getAllowedEmailHint,
  validatePasswordMatch,
} from './helpers';
