'use server';

import { FEISHU_CONFIG } from './config';
import { feishuRequestWithFormData } from './client';
import { getBaseId } from './base';
import type { UploadFileResponse } from './types';

/**
 * 上传文件到飞书多维表格
 * 流程：1. 上传文件获取 file_token 2. 返回 file_token 用于关联记录
 *
 * @param file 文件对象
 * @returns 上传结果，包含 file_token
 */
export async function uploadFileToFeishu(
  file: File
): Promise<{ success: boolean; fileToken?: string; error?: string }> {
  try {
    {/* 验证文件有效性 */}
    if (!file || file.size === 0) {
      return {
        success: false,
        error: '文件为空或无效',
      };
    }

    {/* 读取文件内容为 Blob */}
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    // 获取 Base ID 作为 parent_node
    const baseId = await getBaseId();

    // 构建 FormData - 使用飞书云文档素材上传接口
    // 参考飞书文档：https://open.feishu.cn/document/server-docs/docs/drive-v1/media/upload_all
    const formData = new FormData();
    formData.append('file', blob, file.name);
    formData.append('file_name', file.name);
    formData.append('size', String(file.size));
    formData.append('parent_type', 'bitable');
    formData.append('parent_node', baseId);

    // 上传文件到飞书云文档素材接口
    const result = await feishuRequestWithFormData<UploadFileResponse>(
      `${FEISHU_CONFIG.API_BASE}/drive/v1/medias/upload_all`,
      formData
    );

    return {
      success: true,
      fileToken: result.data?.file_token,
    };
  } catch (error) {
    console.error('上传文件到飞书失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}
