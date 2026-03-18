'use server';

/**
 * 飞书 API Server Actions 导出入口
 *
 * 此文件仅导出 Server Actions（异步函数）
 */

import {
  createFeishuFeedback as _createFeishuFeedback,
  updateFeishuFeedbackStatus as _updateFeishuFeedbackStatus,
  queryFeishuFeedbacks as _queryFeishuFeedbacks,
  testFeishuConnection as _testFeishuConnection,
} from './record';

import { uploadFileToFeishu as _uploadFileToFeishu, getFileDownloadUrl as _getFileDownloadUrl, getAttachmentUrls as _getAttachmentUrls } from './file';

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

export async function getFileDownloadUrl(...args: Parameters<typeof _getFileDownloadUrl>) {
  return _getFileDownloadUrl(...args);
}

export async function getAttachmentUrls(...args: Parameters<typeof _getAttachmentUrls>) {
  return _getAttachmentUrls(...args);
}
