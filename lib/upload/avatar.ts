'use client'

/**
 * 头像上传工具
 *
 * @module lib/upload/avatar
 * @description 处理用户头像的上传、验证和 URL 生成
 *
 * 功能：
 * - 头像文件验证（类型、大小）
 * - 上传到 Supabase Storage (touxiang bucket)
 * - 生成 Public URL
 * - 压缩/裁剪支持（未来扩展）
 */

import { createClient } from '@/lib/supabase/client'

/**
 * 上传配置常量
 */
const UPLOAD_CONFIG = {
  bucket: 'touxiang',
  maxSize: 2 * 1024 * 1024, // 2MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
}

/**
 * 图片文件 Magic Bytes 签名
 * 用于验证文件实际内容，防止 MIME 类型伪造
 *
 * @安全增强 S-02: 文件内容验证
 * - JPEG: FF D8 FF
 * - PNG: 89 50 4E 47
 * - WebP: 52 49 46 46 (RIFF header)
 */
const IMAGE_MAGIC_BYTES: Record<string, number[]> = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
}

/**
 * 上传错误类型
 */
export class AvatarUploadError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_TYPE' | 'SIZE_EXCEEDED' | 'UPLOAD_FAILED' | 'URL_ERROR' | 'INVALID_CONTENT'
  ) {
    super(message)
    this.name = 'AvatarUploadError'
  }
}

/**
 * 验证文件 Magic Bytes（文件签名）
 * 防止 MIME 类型伪造攻击
 *
 * @param file - 待验证的文件
 * @param expectedType - 期望的 MIME 类型
 * @returns 是否验证通过
 *
 * @安全增强 S-02: 深度文件内容验证
 * - 读取文件头字节
 * - 与标准 Magic Bytes 比对
 * - 防止伪装成图片的恶意文件
 */
async function validateMagicBytes(file: File, expectedType: string): Promise<boolean> {
  const magicBytes = IMAGE_MAGIC_BYTES[expectedType]
  if (!magicBytes) return false

  try {
    const buffer = await file.slice(0, magicBytes.length).arrayBuffer()
    const bytes = new Uint8Array(buffer)

    for (let i = 0; i < magicBytes.length; i++) {
      if (bytes[i] !== magicBytes[i]) {
        return false
      }
    }
    return true
  } catch {
    return false
  }
}

/**
 * 验证头像文件
 *
 * @param file - 待验证的文件
 * @throws {AvatarUploadError} 验证失败时抛出错误
 */
async function validateAvatar(file: File): Promise<void> {
  const allowedTypes: readonly string[] = UPLOAD_CONFIG.allowedTypes
  if (!allowedTypes.includes(file.type)) {
    throw new AvatarUploadError(
      `不支持的图片格式，仅支持: ${UPLOAD_CONFIG.allowedTypes.map(t => t.replace('image/', '')).join(', ')}`,
      'INVALID_TYPE'
    )
  }

  if (file.size > UPLOAD_CONFIG.maxSize) {
    throw new AvatarUploadError(
      `图片大小超过限制，最大允许 ${UPLOAD_CONFIG.maxSize / 1024 / 1024}MB`,
      'SIZE_EXCEEDED'
    )
  }

  /**
   * @安全增强 S-02: 验证文件实际内容
   * - 检查文件头 Magic Bytes
   * - 防止 MIME 类型伪造
   * - 阻止伪装成图片的可执行文件
   */
  const isValidContent = await validateMagicBytes(file, file.type)
  if (!isValidContent) {
    throw new AvatarUploadError(
      '文件内容异常，请上传有效的图片文件',
      'INVALID_CONTENT'
    )
  }
}

/**
 * 生成唯一文件名
 *
 * @param userId - 用户ID
 * @param mimeType - MIME 类型
 * @returns 唯一文件名
 *
 * @安全增强 S-03: 安全的扩展名生成
 * - 不使用用户提供的文件名
 * - 根据 MIME 类型确定扩展名
 * - 防止双扩展名攻击（如 shell.php.jpg）
 */
function generateAvatarFileName(userId: string, mimeType: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)

  // 根据 MIME 类型确定安全扩展名
  const extensionMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }

  const safeExtension = extensionMap[mimeType] || 'bin'

  // 使用用户ID作为文件夹，方便管理
  return `${userId}/${timestamp}-${random}.${safeExtension}`
}

/**
 * 上传头像到 Supabase Storage
 *
 * @param file - 头像文件
 * @param userId - 用户ID
 * @returns 头像的 Public URL
 * @throws {AvatarUploadError} 上传失败时抛出错误
 *
 * @example
 * ```typescript
 * const avatarUrl = await uploadAvatar(file, user.id)
 * await updateProfile({ avatar_url: avatarUrl })
 * ```
 */
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  await validateAvatar(file)

  const supabase = createClient()
  const fileName = generateAvatarFileName(userId, file.type)

  // 上传文件
  const { error: uploadError } = await supabase.storage
    .from(UPLOAD_CONFIG.bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true, // 允许覆盖，方便用户更新头像
    })

  if (uploadError) {
    console.error('头像上传失败:', uploadError)
    throw new AvatarUploadError('头像上传失败，请稍后重试', 'UPLOAD_FAILED')
  }

  // 获取 Public URL
  const { data: urlData } = supabase.storage
    .from(UPLOAD_CONFIG.bucket)
    .getPublicUrl(fileName)

  if (!urlData?.publicUrl) {
    throw new AvatarUploadError('获取头像链接失败', 'URL_ERROR')
  }

  return urlData.publicUrl
}

/**
 * 删除用户旧头像
 *
 * @param avatarUrl - 旧头像URL
 * @returns 是否删除成功
 */
export async function deleteOldAvatar(avatarUrl: string | null): Promise<boolean> {
  if (!avatarUrl) return true

  // 只删除本存储桶的文件
  if (!avatarUrl.includes(UPLOAD_CONFIG.bucket)) return true

  try {
    const supabase = createClient()

    // 从URL中提取文件路径
    const url = new URL(avatarUrl)
    const pathMatch = url.pathname.match(new RegExp(`${UPLOAD_CONFIG.bucket}/(.+)`))

    if (!pathMatch?.[1]) return true

    const filePath = pathMatch[1]

    const { error } = await supabase.storage
      .from(UPLOAD_CONFIG.bucket)
      .remove([filePath])

    if (error) {
      console.error('删除旧头像失败:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('删除旧头像出错:', err)
    return false
  }
}
