/**
 * 文章相关消息常量
 * @module lib/messages/article
 * @description 文章发布、编辑、浏览相关的提示消息
 */

/**
 * 文章操作错误消息
 */
export const ARTICLE_ERROR_MESSAGES = {
  /** 获取文章失败 */
  FETCH_ERROR: '获取文章失败',
  /** 文章不存在 */
  NOT_FOUND: '文章不存在或已被删除',
  /** 创建文章失败 */
  CREATE_ERROR: '发布文章失败',
  /** 更新文章失败 */
  UPDATE_ERROR: '更新文章失败',
  /** 删除文章失败 */
  DELETE_ERROR: '删除文章失败',
  /** 无权限操作 */
  NO_PERMISSION: '无权限操作此文章',
  /** 内容不能为空 */
  EMPTY_CONTENT: '文章内容不能为空',
  /** 标题不能为空 */
  EMPTY_TITLE: '文章标题不能为空',
  /** 保存草稿失败 */
  SAVE_DRAFT_ERROR: '保存草稿失败',
  /** 发布失败 */
  PUBLISH_ERROR: '发布失败',
} as const;

/**
 * 文章操作成功消息
 */
export const ARTICLE_SUCCESS_MESSAGES = {
  /** 发布成功 */
  CREATE_SUCCESS: '文章发布成功',
  /** 更新成功 */
  UPDATE_SUCCESS: '文章更新成功',
  /** 删除成功 */
  DELETE_SUCCESS: '文章已删除',
  /** 保存草稿成功 */
  SAVE_DRAFT_SUCCESS: '草稿保存成功',
  /** 发布成功 */
  PUBLISH_SUCCESS: '文章发布成功',
  /** 自动保存成功 */
  AUTO_SAVE_SUCCESS: '已自动保存草稿',
} as const;

/**
 * 文章提示消息
 */
export const ARTICLE_INFO_MESSAGES = {
  /** 自动保存中 */
  AUTO_SAVING: '正在自动保存...',
  /** 字数统计 */
  WORD_COUNT: '字数：{count} 字',
  /** 阅读时间 */
  READ_TIME: '阅读约需 {minutes} 分钟',
  /** 最后编辑时间 */
  LAST_EDITED: '最后编辑于 {time}',
} as const;

/**
 * 文章付费相关消息
 */
export const ARTICLE_PAYWALL_MESSAGES = {
  /** 付费内容提示 */
  PREMIUM_CONTENT: '此内容为付费内容',
  /** 购买提示 */
  PURCHASE_PROMPT: '购买后即可阅读全文',
  /** 价格显示 */
  PRICE_DISPLAY: '价格：{price} 积分',
  /** 购买成功 */
  PURCHASE_SUCCESS: '购买成功，现在可以阅读全文了',
  /** 购买失败 */
  PURCHASE_ERROR: '购买失败，请稍后重试',
  /** 余额不足 */
  INSUFFICIENT_BALANCE: '积分余额不足',
} as const;

/**
 * 文章互动相关消息
 */
export const ARTICLE_INTERACTION_MESSAGES = {
  /** 点赞成功 */
  LIKE_SUCCESS: '点赞成功',
  /** 取消点赞成功 */
  UNLIKE_SUCCESS: '取消点赞成功',
  /** 点赞失败 */
  LIKE_ERROR: '点赞失败',
  /** 取消点赞失败 */
  UNLIKE_ERROR: '取消点赞失败',
  /** 收藏成功 */
  BOOKMARK_SUCCESS: '收藏成功',
  /** 取消收藏成功 */
  UNBOOKMARK_SUCCESS: '取消收藏成功',
  /** 收藏失败 */
  BOOKMARK_ERROR: '收藏失败',
  /** 取消收藏失败 */
  UNBOOKMARK_ERROR: '取消收藏失败',
  /** 分享成功 */
  SHARE_SUCCESS: '分享链接已复制',
  /** 举报成功 */
  REPORT_SUCCESS: '举报已提交，我们会尽快处理',
  /** 举报失败 */
  REPORT_ERROR: '举报提交失败，请稍后重试',
} as const;
