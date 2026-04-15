/**
 * 全局消息常量
 * @module lib/messages
 * @description 统一管理应用中的所有提示消息
 */

// ==================== 通用消息 ====================
export const COMMON_ERRORS = {
  DEFAULT: '操作失败，请稍后重试',
  NETWORK_ERROR: '网络连接失败，请检查网络后重试',
  UNKNOWN_ERROR: '操作失败，请稍后重试',
  TOO_MANY_REQUESTS: '请求过于频繁，请稍后再试',
  SERVER_ERROR: '服务器响应异常，请检查网络连接或稍后重试',
  FORBIDDEN: '您没有权限操作此资源',
  INVALID_PARAMS: '请求参数无效',
} as const;

export const SUCCESS_MESSAGES = {
  DEFAULT: '操作成功',
  SAVED: '保存成功',
  SUBMITTED: '提交成功',
  UPLOADED: '上传成功',
  DELETED: '删除成功',
  UPDATED: '更新成功',
  COPIED: '复制成功',
} as const;

export const LOADING_MESSAGES = {
  DEFAULT: '加载中...',
  SAVING: '保存中...',
  SUBMITTING: '提交中...',
  UPLOADING: '上传中...',
} as const;

// ==================== 认证消息 ====================
export const LOGIN_MESSAGES = {
  INVALID_CREDENTIALS: '邮箱或密码错误，请检查后重试',
  EMAIL_NOT_CONFIRMED: '邮箱未验证，请检查邮箱并点击验证链接',
  USER_NOT_FOUND: '该账号不存在，请先注册',
  RATE_LIMITED: '登录尝试次数过多，请 {minutes} 分钟后再试',
  NOT_AUTHENTICATED: '未登录或登录已过期',
  DEFAULT_ERROR: '登录失败，请稍后重试',
  OAUTH_NOT_ENABLED: '{provider} 登录暂未开通',
  OAUTH_ERROR: '登录请求失败，请稍后重试',
  OAUTH_URL_ERROR: '获取授权链接失败',
  SUCCESS: '登录成功',
} as const;

export const REGISTER_MESSAGES = {
  EMAIL_ALREADY_REGISTERED: '该邮箱已被注册，请直接登录或使用其他邮箱',
  USERNAME_ALREADY_TAKEN: '该用户名已被使用，请更换其他用户名',
  EMAIL_NOT_ALLOWED: '暂不支持该邮箱，请使用 QQ邮箱(@qq.com)、Gmail(@gmail.com) 或 139邮箱(@139.com)',
  PASSWORD_TOO_WEAK: '密码不符合要求，请设置更复杂的密码',
  PASSWORD_MISMATCH: '两次输入的密码不一致',
  RATE_LIMITED: '注册尝试次数过多，请1小时后再试',
  DEFAULT_ERROR: '注册失败，请稍后重试',
  SUCCESS: '注册成功，请检查邮箱完成验证',
} as const;

export const RESET_PASSWORD_MESSAGES = {
  USER_NOT_FOUND: '该邮箱未注册，请检查邮箱地址或先注册账号',
  LINK_EXPIRED: '重置链接已过期，请重新申请重置密码',
  SESSION_EXPIRED: '链接已过期，请重新申请',
  RATE_LIMITED: '尝试次数过多，请1小时后再试',
  DEFAULT_ERROR: '重置失败，请稍后重试',
  EMAIL_SENT: '重置密码邮件已发送，请检查邮箱',
  SUCCESS: '密码重置成功，请使用新密码登录',
} as const;

export const CHANGE_PASSWORD_MESSAGES = {
  NOT_AUTHENTICATED: '未登录或登录已过期',
  RATE_LIMITED: '尝试次数过多，请15分钟后再试',
  DEFAULT_ERROR: '修改密码失败，请稍后重试',
  SUCCESS: '密码修改成功，请使用新密码重新登录',
} as const;

export const LOGOUT_MESSAGES = {
  DEFAULT_ERROR: '退出失败',
  SUCCESS: '退出成功',
} as const;

export const LOGIN_HISTORY_MESSAGES = {
  NOT_AUTHENTICATED: '未登录',
  FETCH_ERROR: '获取登录历史失败',
} as const;

// ==================== 文章消息 ====================
export const ARTICLE_MESSAGES = {
  FETCH_ERROR: '获取文章失败',
  NOT_FOUND: '文章不存在或已被删除',
  CREATE_ERROR: '发布文章失败',
  UPDATE_ERROR: '更新文章失败',
  DELETE_ERROR: '删除文章失败',
  NO_PERMISSION: '无权限操作此文章',
  EMPTY_CONTENT: '文章内容不能为空',
  EMPTY_TITLE: '文章标题不能为空',
  CREATE_SUCCESS: '文章发布成功',
  UPDATE_SUCCESS: '文章更新成功',
  DELETE_SUCCESS: '文章已删除',
} as const;

// 向后兼容
export const ARTICLE_ERROR_MESSAGES = {
  ...ARTICLE_MESSAGES,
  SAVE_DRAFT_ERROR: '保存草稿失败',
  PUBLISH_ERROR: '发布失败',
} as const;

export const ARTICLE_SUCCESS_MESSAGES = {
  CREATE_SUCCESS: '文章发布成功',
  UPDATE_SUCCESS: '文章更新成功',
  DELETE_SUCCESS: '文章已删除',
  SAVE_DRAFT_SUCCESS: '草稿保存成功',
  PUBLISH_SUCCESS: '文章发布成功',
  AUTO_SAVE_SUCCESS: '已自动保存草稿',
} as const;

export const ARTICLE_INTERACTION_MESSAGES = {
  LIKE_SUCCESS: '点赞成功',
  UNLIKE_SUCCESS: '取消点赞成功',
  LIKE_ERROR: '点赞失败',
  UNLIKE_ERROR: '取消点赞失败',
  BOOKMARK_SUCCESS: '收藏成功',
  UNBOOKMARK_SUCCESS: '取消收藏成功',
  BOOKMARK_ERROR: '收藏失败',
  UNBOOKMARK_ERROR: '取消收藏失败',
} as const;

// ==================== 评论消息 ====================
export const COMMENT_MESSAGES = {
  FETCH_ERROR: '获取评论失败',
  NOT_FOUND: '评论不存在或已被删除',
  CREATE_ERROR: '发布评论失败',
  UPDATE_ERROR: '更新评论失败',
  DELETE_ERROR: '删除评论失败',
  NO_PERMISSION: '无权限操作此评论',
  EMPTY_CONTENT: '评论内容不能为空',
  CREATE_SUCCESS: '评论发布成功',
  UPDATE_SUCCESS: '评论更新成功',
  DELETE_SUCCESS: '评论已删除',
} as const;

// 向后兼容
export const COMMENT_ERROR_MESSAGES = {
  ...COMMENT_MESSAGES,
  CONTENT_TOO_LONG: '评论内容过长',
  REPLY_ERROR: '回复失败',
  RATE_LIMITED: '评论过于频繁，请稍后再试',
  INVALID_ID: '无效的评论ID',
} as const;

export const COMMENT_SUCCESS_MESSAGES = {
  CREATE_SUCCESS: '评论发布成功',
  UPDATE_SUCCESS: '评论更新成功',
  DELETE_SUCCESS: '评论已删除',
  REPLY_SUCCESS: '回复成功',
} as const;

export const COMMENT_INTERACTION_MESSAGES = {
  LIKE_SUCCESS: '点赞成功',
  UNLIKE_SUCCESS: '取消点赞成功',
  LIKE_ERROR: '点赞失败',
  UNLIKE_ERROR: '取消点赞失败',
  REPORT_SUCCESS: '举报已提交',
  REPORT_ERROR: '举报提交失败',
} as const;

// ==================== 用户消息 ====================
export const PROFILE_MESSAGES = {
  FETCH_ERROR: '获取用户信息失败',
  UPDATE_ERROR: '更新资料失败',
  AVATAR_UPLOAD_ERROR: '头像上传失败',
  USERNAME_TAKEN: '该用户名已被使用',
  UPDATE_SUCCESS: '资料更新成功',
  AVATAR_UPLOAD_SUCCESS: '头像上传成功',
} as const;

export const FOLLOW_MESSAGES = {
  FOLLOW_ERROR: '关注失败',
  UNFOLLOW_ERROR: '取消关注失败',
  FETCH_FOLLOWERS_ERROR: '获取粉丝列表失败',
  FETCH_FOLLOWING_ERROR: '获取关注列表失败',
  GET_STATUS_ERROR: '获取关注状态失败',
  SELF_FOLLOW: '不能关注自己',
  ALREADY_FOLLOWING: '已经关注该用户',
  NOT_FOLLOWING: '未关注该用户',
  FOLLOW_SUCCESS: '关注成功',
  UNFOLLOW_SUCCESS: '取消关注成功',
} as const;

export const USER_SETTINGS_MESSAGES = {
  UPDATE_ERROR: '设置更新失败',
  EMAIL_UPDATE_ERROR: '邮箱更新失败',
  PASSWORD_UPDATE_ERROR: '密码更新失败',
  LINK_ACCOUNT_ERROR: '绑定账号失败',
  UNLINK_ACCOUNT_ERROR: '解绑账号失败',
  UPDATE_SUCCESS: '设置已更新',
  EMAIL_UPDATE_SUCCESS: '邮箱更新成功',
  PASSWORD_UPDATE_SUCCESS: '密码已更新',
  LINK_ACCOUNT_SUCCESS: '账号绑定成功',
  UNLINK_ACCOUNT_SUCCESS: '账号解绑成功',
} as const;

export const USER_SEARCH_MESSAGES = {
  SEARCH_ERROR: '搜索用户失败',
  NO_RESULTS: '未找到相关用户',
  PLACEHOLDER: '搜索用户...',
} as const;

// ==================== 表单验证消息 ====================
export const VALIDATION_MESSAGES = {
  REQUIRED: '此项为必填项',
  INVALID_EMAIL: '请输入有效的邮箱地址',
  PASSWORD_MIN_LENGTH: '密码至少需要8位',
  PASSWORD_MISMATCH: '两次输入的密码不一致',
  USERNAME_LENGTH: '用户名长度应在2-20个字符之间',
  INVALID_CHARS: '包含无效字符',
  FILE_TOO_LARGE: '文件大小超过限制',
  UNSUPPORTED_FORMAT: '不支持的文件格式',
  TOO_LONG: '内容过长',
  TOO_MANY: '数量过多',
  INVALID_FORMAT: '格式无效',
} as const;

// ==================== 空状态消息 ====================
export const EMPTY_MESSAGES = {
  DEFAULT: '暂无内容',
  NO_SEARCH_RESULTS: '未找到相关结果',
  NO_NOTIFICATIONS: '暂无通知',
  NO_MESSAGES: '暂无消息',
  NO_BOOKMARKS: '暂无收藏',
  NO_FOLLOWING: '暂无关注',
  NO_FOLLOWERS: '暂无粉丝',
  NO_ARTICLES: '暂无文章',
  NO_COMMENTS: '暂无评论',
} as const;

// ==================== 确认消息 ====================
export const CONFIRM_MESSAGES = {
  DELETE: '确定要删除吗？此操作不可撤销',
  BATCH_DELETE: '确定要删除选中的 {count} 项吗？此操作不可撤销',
  CANCEL: '确定要取消吗？未保存的内容将丢失',
  LEAVE: '页面有未保存的更改，确定要离开吗？',
  LOGOUT: '确定要退出登录吗？',
  UNFOLLOW: '确定要取消关注吗？',
} as const;

// ==================== 文章付费消息 ====================
export const ARTICLE_PAYWALL_MESSAGES = {
  PREMIUM_CONTENT: '此内容为付费内容',
  PURCHASE_PROMPT: '购买后即可阅读全文',
  PRICE_DISPLAY: '价格：{price} 积分',
  PURCHASE_SUCCESS: '购买成功，现在可以阅读全文了',
  PURCHASE_ERROR: '购买失败，请稍后重试',
  INSUFFICIENT_BALANCE: '积分余额不足',
} as const;

// ==================== 评论列表消息 ====================
export const COMMENT_LIST_MESSAGES = {
  LOAD_MORE: '加载更多评论',
  NO_MORE: '没有更多评论了',
  EMPTY: '暂无评论，来发表第一条评论吧',
  SORT_NEWEST: '最新',
  SORT_HOT: '最热',
} as const;

// ==================== 错误映射 ====================
export function mapSupabaseError(
  errorMessage: string,
  context: 'login' | 'register' | 'forgot-password' | 'reset-password'
): string {
  if (context === 'login') {
    if (errorMessage.includes('Invalid login credentials')) return LOGIN_MESSAGES.INVALID_CREDENTIALS;
    if (errorMessage.includes('Email not confirmed')) return LOGIN_MESSAGES.EMAIL_NOT_CONFIRMED;
    if (errorMessage.includes('User not found')) return LOGIN_MESSAGES.USER_NOT_FOUND;
  }

  if (context === 'register') {
    if (errorMessage.includes('User already registered')) return REGISTER_MESSAGES.EMAIL_ALREADY_REGISTERED;
    if (errorMessage.includes('Password')) return REGISTER_MESSAGES.PASSWORD_TOO_WEAK;
  }

  if (context === 'forgot-password') {
    if (errorMessage.includes('User not found')) return RESET_PASSWORD_MESSAGES.USER_NOT_FOUND;
  }

  if (context === 'reset-password') {
    if (errorMessage.includes('expired')) return RESET_PASSWORD_MESSAGES.LINK_EXPIRED;
  }

  if (errorMessage.includes('Too many requests')) return COMMON_ERRORS.TOO_MANY_REQUESTS;

  return COMMON_ERRORS.UNKNOWN_ERROR;
}

// 向后兼容导出
export const AUTH_ERRORS = {
  ...COMMON_ERRORS,
  ...LOGIN_MESSAGES,
  ...REGISTER_MESSAGES,
  ...RESET_PASSWORD_MESSAGES,
} as const;
