/**
 * 飞书 API 模块统一导出入口
 *
 * 此文件用于导出类型和非 Server Action 的内容
 * Server Actions 请从 api.ts 导入
 *
 * 文件职责：
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

export type { Attachment } from '@/types/user/feedback';

{/* 导出配置 */}
export { FEISHU_CONFIG, FIELD_MAPPING, TYPE_MAPPING, STATUS_MAPPING } from './config';

{/* 导出工具函数（按需使用） */}
export { getAccessToken, clearTokenCache } from './auth';
export { feishuRequest, feishuRequestWithFormData } from './client';
export {
  extractFieldValue,
  extractAttachments,
  convertFeishuRecordToFeedbackItem,
  getFeishuTypeOption,
  getFeishuStatusOption,
  getSystemStatus,
} from './transform';
