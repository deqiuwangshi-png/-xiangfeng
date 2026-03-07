'use server';

/**
 * 飞书 API 模块统一导出入口
 *
 * 此文件作为向后兼容的入口，所有功能已从单一文件拆分为多个职责单一的文件：
 * - types.ts: 类型定义
 * - auth.ts: 访问令牌管理
 * - client.ts: HTTP 客户端封装
 * - transform.ts: 数据转换逻辑
 * - record.ts: 记录 CRUD 操作
 * - file.ts: 文件上传
 * - config.ts: 配置常量
 */

{/* 导出类型 */}
export type {
  FeishuFeedbackData,
  FeishuRecord,
  FeedbackItem,
  ApiResponse,
  CreateRecordResponse,
  QueryRecordsResponse,
  TableInfoResponse,
  UploadFileResponse,
} from './types';

{/* 导出业务函数 */}
export {
  createFeishuFeedback,
  updateFeishuFeedbackStatus,
  queryFeishuFeedbacks,
  testFeishuConnection,
} from './record';

export { uploadFileToFeishu } from './file';

{/* 导出工具函数（按需使用） */}
export { getAccessToken, clearTokenCache } from './auth';
export { feishuRequest, feishuRequestWithFormData } from './client';
export {
  extractFieldValue,
  convertFeishuRecordToFeedbackItem,
  getFeishuTypeOption,
  getFeishuStatusOption,
  getSystemStatus,
} from './transform';

{/* 导出配置（按需使用） */}
export { FEISHU_CONFIG, FIELD_MAPPING, TYPE_MAPPING, STATUS_MAPPING } from './config';
