'use server';

import { uploadFileToFeishu } from '@/lib/feishu/api';
import { requireAuth } from '@/lib/auth/core/permissions';
import type { UploadedFile } from '@/types/user/feedback';

/**
 * 单个文件上传结果
 */
interface UploadResult {
  fileId: string;
  success: boolean;
  fileToken?: string;
  error?: string;
}

/**
 * 上传单个附件到飞书多维表格
 * 使用飞书 Drive API 上传文件
 *
 * @param formData 包含文件的 FormData
 * @returns 上传结果，包含 file_token
 */
export async function uploadFeedbackAttachment(formData: FormData) {
  try {
    // 验证用户身份
    await requireAuth();
    
    const file = formData.get('file') as File;

    if (!file) {
      return {
        success: false,
        error: '未找到文件',
      };
    }

    // 验证文件大小 (10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: '文件大小超过10MB限制',
      };
    }

    // 验证文件类型 - 仅允许图片格式
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return {
        success: false,
        error: '仅支持图片格式(PNG, JPG, JPEG, GIF, WEBP)',
      };
    }

    // 验证 MIME 类型与扩展名匹配（防止修改扩展名绕过）
    const allowedMimeTypes: Record<string, string[]> = {
      '.png': ['image/png'],
      '.jpg': ['image/jpeg'],
      '.jpeg': ['image/jpeg'],
      '.gif': ['image/gif'],
      '.webp': ['image/webp'],
    };

    const expectedMimeTypes = allowedMimeTypes[fileExtension];
    if (!expectedMimeTypes?.includes(file.type)) {
      return {
        success: false,
        error: '文件类型与扩展名不匹配',
      };
    }

    // 上传到飞书
    const result = await uploadFileToFeishu(file);

    if (!result.success) {
      return {
        success: false,
        error: result.error || '文件上传失败',
      };
    }

    return {
      success: true,
      fileToken: result.fileToken,
      fileName: file.name,
      fileSize: file.size,
    };
  } catch (error) {
    console.error('上传附件失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '上传失败',
    };
  }
}

/**
 * 批量上传反馈附件到飞书
 * @性能优化 P-04: 使用 Promise.all 并行上传，提升多附件上传速度
 * 在提交反馈时调用，避免提前上传浪费资源
 *
 * @param files 待上传文件列表
 * @returns 每个文件的上传结果
 */
export async function uploadFeedbackFiles(
  files: Pick<UploadedFile, 'id' | 'file'>[]
): Promise<UploadResult[]> {
  /**
   * @性能优化 P-04: 并行上传所有文件
   * - 使用 Promise.all 替代 for...of 串行执行
   * - 多附件场景下总耗时从 O(n) 降至 O(1)
   * - 单文件失败不影响其他文件上传
   */
  const uploadPromises = files.map(async (fileItem) => {
    try {
      const formData = new FormData();
      formData.append('file', fileItem.file);

      const result = await uploadFeedbackAttachment(formData);

      if (result.success && result.fileToken) {
        return {
          fileId: fileItem.id,
          success: true,
          fileToken: result.fileToken,
        } as UploadResult;
      } else {
        return {
          fileId: fileItem.id,
          success: false,
          error: result.error || '上传失败',
        } as UploadResult;
      }
    } catch (error) {
      console.error(`上传文件 ${fileItem.file.name} 失败:`, error);
      return {
        fileId: fileItem.id,
        success: false,
        error: error instanceof Error ? error.message : '上传失败',
      } as UploadResult;
    }
  });

  // 并行执行所有上传任务
  return Promise.all(uploadPromises);
}
