/**
 * 飞书多维表格配置
 * 用于反馈数据同步
 */

/**
 * 飞书应用配置
 * 从环境变量读取敏感信息
 */
export const FEISHU_CONFIG = {
  /** 应用 ID */
  APP_ID: process.env.FEISHU_APP_ID || '',
  /** 应用密钥 */
  APP_SECRET: process.env.FEISHU_APP_SECRET || '',
  /** 多维表格 Base ID */
  BASE_ID: 'X3hVw8dUTilgKQkACsCcOcaEnsg',
  /** 表格 ID */
  TABLE_ID: 'tblpWzxXOfwlZMHr',
  /** API 基础地址 */
  API_BASE: 'https://open.feishu.cn/open-apis',
} as const;

/**
 * 字段映射配置
 * 系统字段名 -> 飞书多维表格字段名
 */
export const FIELD_MAPPING = {
  /** 反馈类型 */
  TYPE: '反馈类型',
  /** 标题 */
  TITLE: '标题',
  /** 描述 */
  DESCRIPTION: '描述',
  /** 联系方式 */
  CONTACT: '联系方式',
  /** 状态 */
  STATUS: '状态',
  /** 提交时间 */
  CREATED_AT: '提交时间',
  /** 附件 */
  ATTACHMENTS: '附件',
  /** 追踪ID */
  TRACKING_ID: '追踪ID',
} as const;

/**
 * 反馈类型映射
 * 系统类型 -> 飞书单选选项
 */
export const TYPE_MAPPING: Record<string, string> = {
  bug: 'Bug反馈',
  suggestion: '功能改进',
  ui: '界面优化',
  other: '其他',
};

/**
 * 状态映射
 * 系统状态 -> 飞书单选选项
 */
export const STATUS_MAPPING: Record<string, string> = {
  pending: '待处理',
  processing: '处理中',
  completed: '已完成',
};
