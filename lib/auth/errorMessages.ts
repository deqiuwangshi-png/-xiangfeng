/**
 * 认证系统错误消息常量
 * @module lib/auth/errorMessages
 * @description 统一管理认证相关的错误提示消息
 */

/**
 * 通用错误消息
 */
export const COMMON_ERRORS = {
  /** 网络连接失败 */
  NETWORK_ERROR: '网络连接失败，请检查网络后重试',
  /** 未知错误 */
  UNKNOWN_ERROR: '操作失败，请稍后重试',
  /** 请求过于频繁 */
  TOO_MANY_REQUESTS: '请求过于频繁，请稍后再试',
} as const;

/**
 * 登录相关错误消息
 */
export const LOGIN_ERRORS = {
  /** 邮箱或密码错误 */
  INVALID_CREDENTIALS: '邮箱或密码错误，请检查后重试',
  /** 邮箱未验证 */
  EMAIL_NOT_CONFIRMED: '邮箱未验证，请检查邮箱并点击验证链接',
  /** 用户不存在 */
  USER_NOT_FOUND: '该账号不存在，请先注册',
  /** 登录尝试次数过多 */
  RATE_LIMITED: '登录尝试次数过多，请 {minutes} 分钟后再试',
} as const;

/**
 * 注册相关错误消息
 */
export const REGISTER_ERRORS = {
  /** 邮箱已被注册 */
  EMAIL_ALREADY_REGISTERED: '该邮箱已被注册，请直接登录或使用其他邮箱',
  /** 用户名已被使用 */
  USERNAME_ALREADY_TAKEN: '该用户名已被使用，请更换其他用户名',
  /** 邮箱格式不正确 */
  INVALID_EMAIL: '邮箱地址格式不正确，请检查后重试',
  /** 密码不符合要求 */
  PASSWORD_TOO_WEAK: '密码不符合要求，请设置更复杂的密码',
  /** 两次密码不一致 */
  PASSWORD_MISMATCH: '两次输入的密码不一致',
  /** 未同意服务条款 */
  TERMS_NOT_ACCEPTED: '请阅读并同意服务条款',
} as const;

/**
 * 密码重置相关错误消息
 */
export const RESET_PASSWORD_ERRORS = {
  /** 用户不存在 */
  USER_NOT_FOUND: '该邮箱未注册，请检查邮箱地址或先注册账号',
  /** 重置链接已过期 */
  LINK_EXPIRED: '重置链接已过期，请重新申请重置密码',
  /** 重置邮件已发送 */
  EMAIL_SENT: '重置密码邮件已发送，请检查邮箱',
  /** 密码重置成功 */
  SUCCESS: '密码重置成功',
} as const;

/**
 * 所有认证错误消息集合
 */
export const AUTH_ERRORS = {
  ...COMMON_ERRORS,
  ...LOGIN_ERRORS,
  ...REGISTER_ERRORS,
  ...RESET_PASSWORD_ERRORS,
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
      return LOGIN_ERRORS.INVALID_CREDENTIALS;
    }
    if (errorMessage.includes('Email not confirmed')) {
      return LOGIN_ERRORS.EMAIL_NOT_CONFIRMED;
    }
    if (errorMessage.includes('User not found')) {
      return LOGIN_ERRORS.USER_NOT_FOUND;
    }
  }

  // 注册相关错误
  if (context === 'register') {
    if (errorMessage.includes('User already registered')) {
      return REGISTER_ERRORS.EMAIL_ALREADY_REGISTERED;
    }
    if (errorMessage.includes('Invalid email')) {
      return REGISTER_ERRORS.INVALID_EMAIL;
    }
    if (errorMessage.includes('Password')) {
      return REGISTER_ERRORS.PASSWORD_TOO_WEAK;
    }
  }

  // 忘记密码相关错误
  if (context === 'forgot-password') {
    if (errorMessage.includes('User not found')) {
      return RESET_PASSWORD_ERRORS.USER_NOT_FOUND;
    }
  }

  // 重置密码相关错误
  if (context === 'reset-password') {
    if (errorMessage.includes('Session expired') || errorMessage.includes('expired')) {
      return RESET_PASSWORD_ERRORS.LINK_EXPIRED;
    }
    if (errorMessage.includes('Password')) {
      return REGISTER_ERRORS.PASSWORD_TOO_WEAK;
    }
  }

  // 通用错误
  if (errorMessage.includes('Too many requests')) {
    return COMMON_ERRORS.TOO_MANY_REQUESTS;
  }

  return COMMON_ERRORS.UNKNOWN_ERROR;
}
