/**
 * 用户相关消息常量
 * @module lib/messages/user
 * @description 用户信息、关注、个人资料相关的提示消息
 */

/**
 * 用户资料相关消息
 */
export const PROFILE_MESSAGES = {
  // 错误
  FETCH_ERROR: '获取用户信息失败',
  UPDATE_ERROR: '更新资料失败',
  AVATAR_UPLOAD_ERROR: '头像上传失败',
  USERNAME_TAKEN: '该用户名已被使用',
  // 成功
  UPDATE_SUCCESS: '资料更新成功',
  AVATAR_UPLOAD_SUCCESS: '头像上传成功',
} as const;

/**
 * 关注相关消息
 */
export const FOLLOW_MESSAGES = {
  // 错误
  FOLLOW_ERROR: '关注失败',
  UNFOLLOW_ERROR: '取消关注失败',
  FETCH_FOLLOWERS_ERROR: '获取粉丝列表失败',
  FETCH_FOLLOWING_ERROR: '获取关注列表失败',
  GET_STATUS_ERROR: '获取关注状态失败',
  SELF_FOLLOW: '不能关注自己',
  ALREADY_FOLLOWING: '已经关注该用户',
  NOT_FOLLOWING: '未关注该用户',
  // 成功
  FOLLOW_SUCCESS: '关注成功',
  UNFOLLOW_SUCCESS: '取消关注成功',
} as const;

/**
 * 用户设置相关消息
 */
export const USER_SETTINGS_MESSAGES = {
  // 错误
  UPDATE_ERROR: '设置更新失败',
  EMAIL_UPDATE_ERROR: '邮箱更新失败',
  PASSWORD_UPDATE_ERROR: '密码更新失败',
  LINK_ACCOUNT_ERROR: '绑定账号失败',
  UNLINK_ACCOUNT_ERROR: '解绑账号失败',
  // 成功
  UPDATE_SUCCESS: '设置已更新',
  EMAIL_UPDATE_SUCCESS: '邮箱更新成功',
  PASSWORD_UPDATE_SUCCESS: '密码已更新',
  LINK_ACCOUNT_SUCCESS: '账号绑定成功',
  UNLINK_ACCOUNT_SUCCESS: '账号解绑成功',
} as const;

/**
 * 用户搜索相关消息
 */
export const USER_SEARCH_MESSAGES = {
  // 错误
  SEARCH_ERROR: '搜索用户失败',
  // 提示
  NO_RESULTS: '未找到相关用户',
  PLACEHOLDER: '搜索用户...',
} as const;
