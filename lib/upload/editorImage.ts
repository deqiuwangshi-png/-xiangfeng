'use client'

/**
 * 编辑器图片上传工具 - 带即时反馈和状态管理
 *
 * @module lib/upload/editorImage
 * @description 处理编辑器内图片的上传，支持 Blob 预览和 temp 状态追踪
 *
 * 功能：
 * - 立即插入本地 Blob 预览图
 * - 后台上传并替换为真实 URL
 * - 自动创建 media 表 temp 记录
 * - 支持上传进度追踪
 */

import { createClient } from '@/lib/supabase/client'
import { createMediaRecord } from '@/lib/media/actions'
import type { ImageUploadResult } from '@/types/media'

/**
 * 上传配置常量
 */
const UPLOAD_CONFIG = {
  bucket: 'wenjian',
  folder: 'editor',
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const,
}

/**
 * 上传错误类型
 */
export class EditorImageUploadError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_TYPE' | 'SIZE_EXCEEDED' | 'UPLOAD_FAILED' | 'URL_ERROR' | 'RECORD_ERROR'
  ) {
    super(message)
    this.name = 'EditorImageUploadError'
  }
}

/**
 * 验证图片文件
 *
 * @param file - 待验证的文件
 * @throws {EditorImageUploadError} 验证失败时抛出错误
 */
function validateImage(file: File): void {
  const allowedTypes: readonly string[] = UPLOAD_CONFIG.allowedTypes
  if (!allowedTypes.includes(file.type)) {
    throw new EditorImageUploadError(
      `不支持的图片格式，仅支持: ${UPLOAD_CONFIG.allowedTypes.map(t => t.replace('image/', '')).join(', ')}`,
      'INVALID_TYPE'
    )
  }

  if (file.size > UPLOAD_CONFIG.maxSize) {
    throw new EditorImageUploadError(
      `图片大小超过限制，最大允许 ${UPLOAD_CONFIG.maxSize / 1024 / 1024}MB`,
      'SIZE_EXCEEDED'
    )
  }
}

/**
 * 生成唯一文件名
 *
 * @param originalName - 原始文件名
 * @returns 唯一文件名
 */
function generateUniqueFileName(originalName: string): { fileName: string; storagePath: string } {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  // 清理原始文件名，移除路径分隔符和其他特殊字符
  const cleanName = originalName.replace(/[\/\\:\*\?"<>\|]/g, '')
  // 安全地提取扩展名，确保不包含路径分隔符
  const extension = cleanName.split('.').pop() || 'png'
  // 限制扩展名长度，防止恶意扩展名
  const safeExtension = extension.substring(0, 10).toLowerCase()
  const fileName = `${timestamp}-${random}.${safeExtension}`
  return {
    fileName,
    storagePath: `${UPLOAD_CONFIG.folder}/${fileName}`,
  }
}

/**
 * 创建本地 Blob URL
 *
 * @param file - 图片文件
 * @returns Blob URL
 */
export function createBlobUrl(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * 释放 Blob URL
 *
 * @param blobUrl - Blob URL
 */
export function revokeBlobUrl(blobUrl: string): void {
  if (blobUrl.startsWith('blob:')) {
    URL.revokeObjectURL(blobUrl)
  }
}

/**
 * 上传图片到 Supabase Storage 并创建 media 记录
 *
 * @param file - 图片文件
 * @param blobUrl - 本地预览用的 Blob URL（用于识别替换）
 * @returns 上传结果，包含真实 URL 和 storagePath
 * @throws {EditorImageUploadError} 上传失败时抛出错误
 *
 * @example
 * ```typescript
 * const blobUrl = createBlobUrl(file)
 * // 立即插入 blobUrl 到编辑器
 * const result = await uploadEditorImage(file, blobUrl)
 * // 用 result.url 替换 blobUrl
 * ```
 */
export async function uploadEditorImage(
  file: File,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _blobUrl: string
): Promise<ImageUploadResult> {
  validateImage(file)

  const supabase = createClient()
  const { fileName, storagePath } = generateUniqueFileName(file.name)

  // 上传文件到 Storage
  const { error: uploadError } = await supabase.storage
    .from(UPLOAD_CONFIG.bucket)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw new EditorImageUploadError(
      `上传失败: ${uploadError.message}`,
      'UPLOAD_FAILED'
    )
  }

  // 获取 Public URL
  const { data: urlData } = supabase.storage
    .from(UPLOAD_CONFIG.bucket)
    .getPublicUrl(storagePath)

  if (!urlData?.publicUrl) {
    throw new EditorImageUploadError('获取图片 URL 失败', 'URL_ERROR')
  }

  const finalUrl = urlData.publicUrl

  // 创建 media 表记录，状态为 temp
  const recordResult = await createMediaRecord({
    url: finalUrl,
    storage_path: storagePath,
    file_name: fileName,
    file_size: file.size,
    mime_type: file.type,
    status: 'temp',
  })

  if (!recordResult.success) {
    console.error('创建 media 记录失败:', recordResult.error)
    // 记录失败但不中断流程，图片已上传成功
  }

  return {
    url: finalUrl,
    storagePath,
    fileName,
  }
}

/**
 * 从粘贴事件获取图片文件
 *
 * @param event - 粘贴事件
 * @returns 图片文件或 null
 */
export function getImageFromPaste(event: ClipboardEvent): File | null {
  const items = event.clipboardData?.items
  if (!items) return null

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) return file
    }
  }

  return null
}

/**
 * 从拖拽事件获取图片文件
 *
 * @param event - 拖拽事件
 * @returns 图片文件或 null
 */
export function getImageFromDrop(event: DragEvent): File | null {
  const files = event.dataTransfer?.files
  if (!files || files.length === 0) return null

  const file = files[0]
  if (file.type.startsWith('image/')) {
    return file
  }

  return null
}
