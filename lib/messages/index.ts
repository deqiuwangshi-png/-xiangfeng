/**
 * 消息常量统一导出
 * @module lib/messages
 * @description 全局消息常量的统一入口
 *
 * @example
 * // 使用示例
 * import { AUTH_MESSAGES, COMMON_MESSAGES } from '@/lib/messages';
 *
 * // 认证相关
 * toast.error(AUTH_MESSAGES.LOGIN.INVALID_CREDENTIALS);
 *
 * // 通用消息
 * toast.success(COMMON_MESSAGES.SUCCESS.DEFAULT);
 */

// 认证相关消息
export {
  COMMON_ERRORS,
  LOGIN_MESSAGES,
  REGISTER_MESSAGES,
  RESET_PASSWORD_MESSAGES,
  CHANGE_PASSWORD_MESSAGES,
  LOGOUT_MESSAGES,
  LOGIN_HISTORY_MESSAGES,
  AUTH_ERRORS,
  mapSupabaseError,
} from './auth';

// 通用消息
export {
  LOADING_MESSAGES,
  SUCCESS_MESSAGES,
  CONFIRM_MESSAGES,
  VALIDATION_MESSAGES,
  EMPTY_MESSAGES,
} from './common';

// 文章相关消息
export {
  ARTICLE_ERROR_MESSAGES,
  ARTICLE_SUCCESS_MESSAGES,
  ARTICLE_INFO_MESSAGES,
  ARTICLE_PAYWALL_MESSAGES,
  ARTICLE_INTERACTION_MESSAGES,
} from './article';

// 用户相关消息
export {
  PROFILE_MESSAGES,
  FOLLOW_MESSAGES,
  USER_SETTINGS_MESSAGES,
  USER_SEARCH_MESSAGES,
} from './user';

// 评论相关消息
export {
  COMMENT_ERROR_MESSAGES,
  COMMENT_SUCCESS_MESSAGES,
  COMMENT_INFO_MESSAGES,
  COMMENT_INTERACTION_MESSAGES,
  COMMENT_LIST_MESSAGES,
} from './comment';

// 为了向后兼容，保留旧的导出名称
// 建议新项目直接使用上面的具体常量

/** @deprecated 使用 LOGIN_MESSAGES 替代 */
export { LOGIN_MESSAGES as LOGIN_ERRORS } from './auth';
/** @deprecated 使用 REGISTER_MESSAGES 替代 */
export { REGISTER_MESSAGES as REGISTER_ERRORS } from './auth';
/** @deprecated 使用 RESET_PASSWORD_MESSAGES 替代 */
export { RESET_PASSWORD_MESSAGES as RESET_PASSWORD_ERRORS } from './auth';
/** @deprecated 使用 CHANGE_PASSWORD_MESSAGES 替代 */
export { CHANGE_PASSWORD_MESSAGES as CHANGE_PASSWORD_ERRORS } from './auth';
/** @deprecated 使用 LOGIN_HISTORY_MESSAGES 替代 */
export { LOGIN_HISTORY_MESSAGES as LOGIN_HISTORY_ERRORS } from './auth';
