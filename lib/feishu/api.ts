'use server';

/**
 * 飞书 API Server Actions 导出入口
 *
 * 此文件仅导出 Server Actions（异步函数）
 * 类型和其他导出请从 index.ts 导入
 *
 * 使用示例：
 * ```typescript
 * // Server Actions
 * import { createFeishuFeedback, uploadFileToFeishu } from '@/lib/feishu/api';
 *
 * // 类型和工具函数
 * import type { FeishuFeedbackData } from '@/lib/feishu/index';
 * import { FEISHU_CONFIG } from '@/lib/feishu/index';
 * ```
 */

import {
  createFeishuFeedback as _createFeishuFeedback,
  updateFeishuFeedbackStatus as _updateFeishuFeedbackStatus,
  queryFeishuFeedbacks as _queryFeishuFeedbacks,
  testFeishuConnection as _testFeishuConnection,
} from './record';

import { uploadFileToFeishu as _uploadFileToFeishu } from './file';

{/* 导出业务函数 - 包装为 Server Actions */}
export async function createFeishuFeedback(...args: Parameters<typeof _createFeishuFeedback>) {
  return _createFeishuFeedback(...args);
}

export async function updateFeishuFeedbackStatus(...args: Parameters<typeof _updateFeishuFeedbackStatus>) {
  return _updateFeishuFeedbackStatus(...args);
}

export async function queryFeishuFeedbacks(...args: Parameters<typeof _queryFeishuFeedbacks>) {
  return _queryFeishuFeedbacks(...args);
}

export async function testFeishuConnection(...args: Parameters<typeof _testFeishuConnection>) {
  return _testFeishuConnection(...args);
}

export async function uploadFileToFeishu(...args: Parameters<typeof _uploadFileToFeishu>) {
  return _uploadFileToFeishu(...args);
}
