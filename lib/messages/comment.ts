/**
 * 评论相关消息常量
 * @module lib/messages/comment
 * @description 评论发布、编辑、删除相关的提示消息
 */

/**
 * 评论操作错误消息
 */
export const COMMENT_ERROR_MESSAGES = {
  /** 获取评论失败 */
  FETCH_ERROR: '获取评论失败',
  /** 评论不存在 */
  NOT_FOUND: '评论不存在或已被删除',
  /** 发布评论失败 */
  CREATE_ERROR: '发布评论失败',
  /** 更新评论失败 */
  UPDATE_ERROR: '更新评论失败',
  /** 删除评论失败 */
  DELETE_ERROR: '删除评论失败',
  /** 无权限操作 */
  NO_PERMISSION: '无权限操作此评论',
  /** 内容不能为空 */
  EMPTY_CONTENT: '评论内容不能为空',
  /** 内容过长 */
  CONTENT_TOO_LONG: '评论内容过长',
  /** 回复失败 */
  REPLY_ERROR: '回复失败',
  /** 请求过于频繁 */
  RATE_LIMITED: '评论过于频繁，请稍后再试',
  /** 无效的评论ID */
  INVALID_ID: '无效的评论ID',
} as const;

/**
 * 评论操作成功消息
 */
export const COMMENT_SUCCESS_MESSAGES = {
  /** 发布成功 */
  CREATE_SUCCESS: '评论发布成功',
  /** 更新成功 */
  UPDATE_SUCCESS: '评论更新成功',
  /** 删除成功 */
  DELETE_SUCCESS: '评论已删除',
  /** 回复成功 */
  REPLY_SUCCESS: '回复成功',
} as const;

/**
 * 评论提示消息
 */
export const COMMENT_INFO_MESSAGES = {
  /** 正在回复 */
  REPLYING_TO: '正在回复：{username}',
  /** 编辑中 */
  EDITING: '编辑评论',
  /** 字数统计 */
  WORD_COUNT: '{current}/{max} 字',
  /** 评论占位符 */
  PLACEHOLDER: '写下你的评论...',
  /** 回复占位符 */
  REPLY_PLACEHOLDER: '写下你的回复...',
} as const;

/**
 * 评论互动相关消息
 */
export const COMMENT_INTERACTION_MESSAGES = {
  /** 点赞成功 */
  LIKE_SUCCESS: '点赞成功',
  /** 取消点赞成功 */
  UNLIKE_SUCCESS: '取消点赞成功',
  /** 点赞失败 */
  LIKE_ERROR: '点赞失败',
  /** 取消点赞失败 */
  UNLIKE_ERROR: '取消点赞失败',
  /** 举报成功 */
  REPORT_SUCCESS: '举报已提交',
  /** 举报失败 */
  REPORT_ERROR: '举报提交失败',
} as const;

/**
 * 评论列表相关消息
 */
export const COMMENT_LIST_MESSAGES = {
  /** 加载更多 */
  LOAD_MORE: '加载更多评论',
  /** 没有更多 */
  NO_MORE: '没有更多评论了',
  /** 暂无评论 */
  EMPTY: '暂无评论，来发表第一条评论吧',
  /** 排序方式-最新 */
  SORT_NEWEST: '最新',
  /** 排序方式-最热 */
  SORT_HOT: '最热',
} as const;
