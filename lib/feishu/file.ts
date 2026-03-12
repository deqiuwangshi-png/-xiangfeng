'use server';

import { FEISHU_CONFIG } from './config';
import { feishuRequest, feishuRequestWithFormData } from './client';
import type { UploadFileResponse } from './types';
import type { Attachment } from '@/types/feedback';

/**
 * 文件下载URL响应
 */
interface FileDownloadUrlResponse {
  tmp_download_url: string;
  expire_time: number;
}

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

    // 判断文件类型，选择正确的 parent_type
    // 图片类型使用 bitable_image，其他文件使用 bitable_file
    const imageTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    const parentType = imageTypes.includes(file.type) ? 'bitable_image' : 'bitable_file';

    // 构建 FormData
    // parent_node 直接传 BASE_ID（多维表格的 app_token）
    const formData = new FormData();
    formData.append('file', blob, encodeURIComponent(file.name));
    formData.append('file_name', encodeURIComponent(file.name));
    formData.append('parent_type', parentType);
    formData.append('parent_node', FEISHU_CONFIG.BASE_ID);
    formData.append('size', String(file.size));

    // 上传文件到飞书
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

/**
 * 获取飞书文件临时下载URL
 * file_token需要转换为可访问的URL才能在浏览器中下载
 *
 * @param fileToken 飞书文件token
 * @returns 临时下载URL
 */
export async function getFileDownloadUrl(
  fileToken: string
): Promise<{ success: boolean; downloadUrl?: string; error?: string }> {
  try {
    const result = await feishuRequest<FileDownloadUrlResponse>(
      `${FEISHU_CONFIG.API_BASE}/drive/v1/medias/${fileToken}/download_url?extra={"bitablePerm":{"tableId":"${FEISHU_CONFIG.TABLE_ID}"}}`
    );

    return {
      success: true,
      downloadUrl: result.data?.tmp_download_url,
    };
  } catch (error) {
    console.error('获取文件下载URL失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '获取下载链接失败',
    };
  }
}

/**
 * 批量获取附件下载URL
 * 将附件列表中的file_token转换为可访问的URL
 *
 * @param attachments 附件列表
 * @returns 带下载URL的附件列表
 */
export async function getAttachmentUrls(
  attachments: Attachment[]
): Promise<Attachment[]> {
  if (!attachments || attachments.length === 0) {
    return [];
  }

  const results = await Promise.all(
    attachments.map(async (attachment) => {
      if (!attachment.fileToken) {
        return attachment;
      }

      const urlResult = await getFileDownloadUrl(attachment.fileToken);
      if (urlResult.success && urlResult.downloadUrl) {
        return {
          ...attachment,
          url: urlResult.downloadUrl,
        };
      }

      return attachment;
    })
  );

  return results;
}
