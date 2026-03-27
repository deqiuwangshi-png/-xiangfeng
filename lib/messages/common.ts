/**
 * 通用消息常量
 * @module lib/messages/common
 * @description 全局通用的提示消息
 */

/**
 * 加载状态消息
 */
export const LOADING_MESSAGES = {
  /** 通用加载 */
  DEFAULT: '加载中...',
  /** 保存中 */
  SAVING: '保存中...',
  /** 提交中 */
  SUBMITTING: '提交中...',
  /** 上传中 */
  UPLOADING: '上传中...',
  /** 处理中 */
  PROCESSING: '处理中...',
  /** 验证中 */
  VERIFYING: '验证中...',
  /** 登录中 */
  LOGGING_IN: '登录中...',
  /** 注册中 */
  REGISTERING: '注册中...',
  /** 发送中 */
  SENDING: '发送中...',
  /** 删除中 */
  DELETING: '删除中...',
} as const;

/**
 * 成功消息
 */
export const SUCCESS_MESSAGES = {
  /** 通用成功 */
  DEFAULT: '操作成功',
  /** 保存成功 */
  SAVED: '保存成功',
  /** 提交成功 */
  SUBMITTED: '提交成功',
  /** 上传成功 */
  UPLOADED: '上传成功',
  /** 删除成功 */
  DELETED: '删除成功',
  /** 更新成功 */
  UPDATED: '更新成功',
  /** 发送成功 */
  SENT: '发送成功',
  /** 复制成功 */
  COPIED: '复制成功',
  /** 关注成功 */
  FOLLOWED: '关注成功',
  /** 取消关注成功 */
  UNFOLLOWED: '取消关注成功',
  /** 点赞成功 */
  LIKED: '点赞成功',
  /** 取消点赞成功 */
  UNLIKED: '取消点赞成功',
  /** 收藏成功 */
  BOOKMARKED: '收藏成功',
  /** 取消收藏成功 */
  UNBOOKMARKED: '取消收藏成功',
} as const;

/**
 * 通用错误消息（简化版）
 */
export const COMMON_ERRORS = {
  /** 通用错误 */
  DEFAULT: '操作失败，请稍后重试',
  /** 网络错误 */
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
 * 确认对话框消息
 */
export const CONFIRM_MESSAGES = {
  /** 删除确认 */
  DELETE: '确定要删除吗？此操作不可撤销',
  /** 批量删除确认 */
  BATCH_DELETE: '确定要删除选中的 {count} 项吗？此操作不可撤销',
  /** 取消确认 */
  CANCEL: '确定要取消吗？未保存的内容将丢失',
  /** 离开确认 */
  LEAVE: '页面有未保存的更改，确定要离开吗？',
  /** 退出登录确认 */
  LOGOUT: '确定要退出登录吗？',
  /** 取消关注确认 */
  UNFOLLOW: '确定要取消关注吗？',
} as const;

/**
 * 表单验证消息
 */
export const VALIDATION_MESSAGES = {
  /** 必填字段 */
  REQUIRED: '此项为必填项',
  /** 邮箱格式 */
  INVALID_EMAIL: '请输入有效的邮箱地址',
  /** 密码长度 */
  PASSWORD_MIN_LENGTH: '密码至少需要8位',
  /** 密码不匹配 */
  PASSWORD_MISMATCH: '两次输入的密码不一致',
  /** 用户名长度 */
  USERNAME_LENGTH: '用户名长度应在2-20个字符之间',
  /** 无效字符 */
  INVALID_CHARS: '包含无效字符',
  /** 文件过大 */
  FILE_TOO_LARGE: '文件大小超过限制',
  /** 不支持的格式 */
  UNSUPPORTED_FORMAT: '不支持的文件格式',
  /** 内容过长 */
  TOO_LONG: '内容过长',
  /** 数量过多 */
  TOO_MANY: '数量过多',
  /** 格式无效 */
  INVALID_FORMAT: '格式无效',
} as const;

/**
 * 空状态消息
 */
export const EMPTY_MESSAGES = {
  /** 通用空状态 */
  DEFAULT: '暂无内容',
  /** 无搜索结果 */
  NO_SEARCH_RESULTS: '未找到相关结果',
  /** 无通知 */
  NO_NOTIFICATIONS: '暂无通知',
  /** 无消息 */
  NO_MESSAGES: '暂无消息',
  /** 无收藏 */
  NO_BOOKMARKS: '暂无收藏',
  /** 无关注 */
  NO_FOLLOWING: '暂无关注',
  /** 无粉丝 */
  NO_FOLLOWERS: '暂无粉丝',
  /** 无文章 */
  NO_ARTICLES: '暂无文章',
  /** 无评论 */
  NO_COMMENTS: '暂无评论',
} as const;
