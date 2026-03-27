/**
 * 认证系统消息常量
 * @module lib/messages/auth
 * @description 统一管理认证相关的提示消息
 */

/**
 * 通用错误消息
 */
export const COMMON_ERRORS = {
  /** 通用错误 */
  DEFAULT: '操作失败，请稍后重试',
  /** 网络连接失败 */
  NETWORK_ERROR: '网络连接失败，请检查网络后重试',
  /** 未知错误 */
  UNKNOWN_ERROR: '操作失败，请稍后重试',
  /** 请求过于频繁 */
  TOO_MANY_REQUESTS: '请求过于频繁，请稍后再试',
  /** 服务器错误 */
  SERVER_ERROR: '服务器响应异常，请检查网络连接或稍后重试',
  /** 权限不足 */
  FORBIDDEN: '您没有权限操作此资源',
  /** 参数错误 */
  INVALID_PARAMS: '请求参数无效',
} as const;

/**
 * 登录相关消息
 */
export const LOGIN_MESSAGES = {
  // 错误
  INVALID_CREDENTIALS: '邮箱或密码错误，请检查后重试',
  EMAIL_NOT_CONFIRMED: '邮箱未验证，请检查邮箱并点击验证链接',
  USER_NOT_FOUND: '该账号不存在，请先注册',
  RATE_LIMITED: '登录尝试次数过多，请 {minutes} 分钟后再试',
  NOT_AUTHENTICATED: '未登录或登录已过期',
  DEFAULT_ERROR: '登录失败，请稍后重试',
  OAUTH_NOT_ENABLED: '{provider} 登录暂未开通',
  OAUTH_ERROR: '登录请求失败，请稍后重试',
  OAUTH_URL_ERROR: '获取授权链接失败',
  // 成功
  SUCCESS: '登录成功',
} as const;

/**
 * 注册相关消息
 */
export const REGISTER_MESSAGES = {
  // 错误
  EMAIL_ALREADY_REGISTERED: '该邮箱已被注册，请直接登录或使用其他邮箱',
  USERNAME_ALREADY_TAKEN: '该用户名已被使用，请更换其他用户名',
  INVALID_EMAIL: '邮箱地址格式不正确，请检查后重试',
  EMAIL_NOT_ALLOWED: '暂不支持该邮箱，请使用 QQ邮箱(@qq.com)、Gmail(@gmail.com) 或 139邮箱(@139.com)',
  PASSWORD_TOO_WEAK: '密码不符合要求，请设置更复杂的密码',
  PASSWORD_MISMATCH: '两次输入的密码不一致',
  TERMS_NOT_ACCEPTED: '请阅读并同意服务条款',
  DEFAULT_ERROR: '注册失败，请稍后重试',
  EMAIL_SEND_FAILED: '验证邮件发送失败，请检查邮箱地址是否正确或稍后重试',
  RATE_LIMITED: '注册尝试次数过多，请1小时后再试',
  // 成功
  SUCCESS: '注册成功，请检查邮箱完成验证',
} as const;

/**
 * 密码重置相关消息
 */
export const RESET_PASSWORD_MESSAGES = {
  // 错误
  USER_NOT_FOUND: '该邮箱未注册，请检查邮箱地址或先注册账号',
  LINK_EXPIRED: '重置链接已过期，请重新申请重置密码',
  SESSION_EXPIRED: '链接已过期，请重新申请',
  RATE_LIMITED: '尝试次数过多，请1小时后再试',
  DEFAULT_ERROR: '重置失败，请稍后重试',
  // 成功
  EMAIL_SENT: '重置密码邮件已发送，请检查邮箱',
  SUCCESS: '密码重置成功，请使用新密码登录',
} as const;

/**
 * 修改密码相关消息（已登录用户）
 */
export const CHANGE_PASSWORD_MESSAGES = {
  // 错误
  NOT_AUTHENTICATED: '未登录或登录已过期',
  RATE_LIMITED: '尝试次数过多，请15分钟后再试',
  DEFAULT_ERROR: '修改密码失败，请稍后重试',
  // 成功
  SUCCESS: '密码修改成功，请使用新密码重新登录',
} as const;

/**
 * 退出登录相关消息
 */
export const LOGOUT_MESSAGES = {
  // 错误
  DEFAULT_ERROR: '退出失败',
  IN_PROGRESS: '正在退出中',
  // 成功
  SUCCESS: '退出成功',
} as const;

/**
 * 登录历史相关消息
 */
export const LOGIN_HISTORY_MESSAGES = {
  // 错误
  NOT_AUTHENTICATED: '未登录',
  FETCH_ERROR: '获取登录历史失败',
} as const;

/**
 * 所有认证错误消息集合
 */
export const AUTH_ERRORS = {
  ...COMMON_ERRORS,
  ...LOGIN_MESSAGES,
  ...REGISTER_MESSAGES,
  ...RESET_PASSWORD_MESSAGES,
} as const;

/**
 * 根据 Supabase 错误消息映射为友好提示
 * @param errorMessage - Supabase 返回的错误消息
 * @param context - 错误上下文（login/register/reset等）
 * @returns 用户友好的错误提示
 */
export function mapSupabaseError(
  errorMessage: string,
  context: 'login' | 'register' | 'forgot-password' | 'reset-password'
): string {
  // 登录相关错误
  if (context === 'login') {
    if (errorMessage.includes('Invalid login credentials')) {
      return LOGIN_MESSAGES.INVALID_CREDENTIALS;
    }
    if (errorMessage.includes('Email not confirmed')) {
      return LOGIN_MESSAGES.EMAIL_NOT_CONFIRMED;
    }
    if (errorMessage.includes('User not found')) {
      return LOGIN_MESSAGES.USER_NOT_FOUND;
    }
  }

  // 注册相关错误
  if (context === 'register') {
    if (errorMessage.includes('User already registered')) {
      return REGISTER_MESSAGES.EMAIL_ALREADY_REGISTERED;
    }
    if (errorMessage.includes('Invalid email')) {
      return REGISTER_MESSAGES.INVALID_EMAIL;
    }
    if (errorMessage.includes('Password')) {
      return REGISTER_MESSAGES.PASSWORD_TOO_WEAK;
    }
  }

  // 忘记密码相关错误
  if (context === 'forgot-password') {
    if (errorMessage.includes('User not found')) {
      return RESET_PASSWORD_MESSAGES.USER_NOT_FOUND;
    }
  }

  // 重置密码相关错误
  if (context === 'reset-password') {
    if (errorMessage.includes('Session expired') || errorMessage.includes('expired')) {
      return RESET_PASSWORD_MESSAGES.LINK_EXPIRED;
    }
    if (errorMessage.includes('Password')) {
      return REGISTER_MESSAGES.PASSWORD_TOO_WEAK;
    }
  }

  // 通用错误
  if (errorMessage.includes('Too many requests')) {
    return COMMON_ERRORS.TOO_MANY_REQUESTS;
  }

  // 服务器响应错误
  if (errorMessage.includes('unexpected') || errorMessage.includes('Unexpected')) {
    return COMMON_ERRORS.SERVER_ERROR;
  }

  return COMMON_ERRORS.UNKNOWN_ERROR;
}
