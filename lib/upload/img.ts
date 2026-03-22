'use client'

/**
 * 编辑器图片上传工具
 *
 * @module lib/upload/img
 * @description 处理编辑器内图片的上传、验证和 URL 生成
 *
 * 功能：
 * - 图片文件验证（类型、大小）
 * - 上传到 Supabase Storage
 * - 生成 Public URL
 * - 粘贴上传支持
 */

import { createClient } from '@/lib/supabase/client'

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
export class UploadError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_TYPE' | 'SIZE_EXCEEDED' | 'UPLOAD_FAILED' | 'URL_ERROR'
  ) {
    super(message)
    this.name = 'UploadError'
  }
}

/**
 * 验证图片文件
 *
 * @param file - 待验证的文件
 * @throws {UploadError} 验证失败时抛出错误
 */
function validateImage(file: File): void {
  const allowedTypes: readonly string[] = UPLOAD_CONFIG.allowedTypes
  if (!allowedTypes.includes(file.type)) {
    throw new UploadError(
      `不支持的图片格式，仅支持: ${UPLOAD_CONFIG.allowedTypes.map(t => t.replace('image/', '')).join(', ')}`,
      'INVALID_TYPE'
    )
  }

  if (file.size > UPLOAD_CONFIG.maxSize) {
    throw new UploadError(
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
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop() || 'png'
  return `${UPLOAD_CONFIG.folder}/${timestamp}-${random}.${extension}`
}

/**
 * 上传图片到 Supabase Storage
 *
 * @param file - 图片文件
 * @returns 图片的 Public URL
 * @throws {UploadError} 上传失败时抛出错误
 *
 * @example
 * ```typescript
 * const url = await uploadImage(file)
 * editor.chain().focus().setImage({ src: url }).run()
 * ```
 */
export async function uploadImage(file: File): Promise<string> {
  validateImage(file)

  const supabase = createClient()
  const fileName = generateUniqueFileName(file.name)

  const { error: uploadError } = await supabase.storage
    .from(UPLOAD_CONFIG.bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw new UploadError(
      `上传失败: ${uploadError.message}`,
      'UPLOAD_FAILED'
    )
  }

  const { data: urlData } = supabase.storage
    .from(UPLOAD_CONFIG.bucket)
    .getPublicUrl(fileName)

  if (!urlData?.publicUrl) {
    throw new UploadError('获取图片 URL 失败', 'URL_ERROR')
  }

  return urlData.publicUrl
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

/**
 * 打开文件选择器选择图片
 *
 * @returns 选中的图片文件或 null
 */
export function selectImageFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = UPLOAD_CONFIG.allowedTypes.join(',')
    input.onchange = () => {
      const file = input.files?.[0] || null
      resolve(file)
    }
    input.click()
  })
}
