'use server'

/**
 * 头像上传 Server Actions
 * @module lib/upload/actions
 * @description 服务端安全的头像上传操作
 *
 * @安全说明
 * - 使用服务端客户端，自动携带认证信息
 * - 验证用户身份和权限
 * - 所有文件验证在服务端执行
 */

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { AuthResult } from '@/types'

const IS_DEV = process.env.NODE_ENV !== 'production'

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
 */
const IMAGE_MAGIC_BYTES: Record<string, number[]> = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
}

function maskUserId(userId?: string): string {
  if (!userId) return 'unknown'
  if (userId.length <= 8) return '***'
  return `${userId.slice(0, 4)}***${userId.slice(-4)}`
}

function maskFileName(fileName?: string): string {
  if (!fileName) return 'unknown'
  const lastDot = fileName.lastIndexOf('.')
  const ext = lastDot >= 0 ? fileName.slice(lastDot + 1).toLowerCase() : 'unknown'
  return `file.${ext}`
}

function debugLog(event: string, payload: Record<string, unknown>): void {
  if (!IS_DEV) return
  console.log(`[avatar-upload][${event}]`, payload)
}

/**
 * 验证文件 Magic Bytes
 * @param buffer - 文件缓冲区
 * @param expectedType - 期望的 MIME 类型
 * @returns 是否验证通过
 */
function validateMagicBytes(buffer: Buffer, expectedType: string): boolean {
  const magicBytes = IMAGE_MAGIC_BYTES[expectedType]
  if (!magicBytes) return false

  for (let i = 0; i < magicBytes.length; i++) {
    if (buffer[i] !== magicBytes[i]) {
      return false
    }
  }
  return true
}

/**
 * 验证头像文件
 * @param file - 文件对象
 * @throws 验证失败时抛出错误
 */
async function validateAvatarFile(file: File): Promise<void> {
  // 验证文件类型
  const allowedTypes: readonly string[] = UPLOAD_CONFIG.allowedTypes
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `不支持的图片格式，仅支持: ${UPLOAD_CONFIG.allowedTypes.map(t => t.replace('image/', '')).join(', ')}`
    )
  }

  // 验证文件大小
  if (file.size > UPLOAD_CONFIG.maxSize) {
    throw new Error(`图片大小超过限制，最大允许 ${UPLOAD_CONFIG.maxSize / 1024 / 1024}MB`)
  }

  // 验证文件内容（Magic Bytes）
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const isValidContent = validateMagicBytes(buffer, file.type)
  if (!isValidContent) {
    throw new Error('文件内容异常，请上传有效的图片文件')
  }
}

/**
 * 生成唯一文件名
 * @param userId - 用户ID
 * @param mimeType - MIME 类型
 * @returns 唯一文件名
 */
function generateAvatarFileName(userId: string, mimeType: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)

  const extensionMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }

  const safeExtension = extensionMap[mimeType] || 'bin'
  return `${userId}/${timestamp}-${random}.${safeExtension}`
}

/**
 * 上传头像（Server Action）
 *
 * @param formData - 包含文件的表单数据
 * @returns 上传结果
 *
 * @安全特性
 * - 使用服务端客户端，自动携带认证 Cookie
 * - 验证当前登录用户身份
 * - 文件验证在服务端执行
 * - 自动刷新缓存
 */
export async function uploadAvatarAction(formData: FormData): Promise<AuthResult & { url?: string }> {
  const traceId = `avatar-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  try {
    // 获取当前用户（服务端自动携带认证信息）
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[avatar-upload][auth-failed]', {
        traceId,
        authError,
        hasUser: !!user,
      })
      return { success: false, error: '用户未登录或会话已过期' }
    }

    // 使用管理员客户端执行 Storage 操作，避免服务端会话上下文抖动导致的 RLS 误拒绝
    // 安全边界：已通过上面的用户鉴权，且文件路径强绑定 user.id
    const admin = await createAdminClient()

    // 获取文件
    const file = formData.get('file') as File
    if (!file) {
      console.error('[avatar-upload][no-file]', { traceId, userId: maskUserId(user.id) })
      return { success: false, error: '未找到上传的文件' }
    }

    debugLog('start', {
      traceId,
      userId: maskUserId(user.id),
      fileName: maskFileName(file.name),
      fileType: file.type,
      fileSize: file.size,
    })

    // 验证文件
    await validateAvatarFile(file)

    // 生成文件名
    const fileName = generateAvatarFileName(user.id, file.type)
    debugLog('path-generated', {
      traceId,
      userId: maskUserId(user.id),
      fileName: maskFileName(fileName),
      firstFolder: fileName.split('/')[0],
    })

    // 转换为 Buffer 上传
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 上传到 Storage
    const { error: uploadError } = await admin.storage
      .from(UPLOAD_CONFIG.bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) {
      console.error('[avatar-upload][storage-upload-failed]', {
        traceId,
        userId: maskUserId(user.id),
        fileName: maskFileName(fileName),
        bucket: UPLOAD_CONFIG.bucket,
        uploadError,
      })
      return { success: false, error: '头像上传失败，请稍后重试' }
    }

    // 获取 Public URL
    const { data: urlData } = admin.storage
      .from(UPLOAD_CONFIG.bucket)
      .getPublicUrl(fileName)

    if (!urlData?.publicUrl) {
      console.error('[avatar-upload][no-public-url]', {
        traceId,
        userId: maskUserId(user.id),
        fileName: maskFileName(fileName),
      })
      return { success: false, error: '获取头像链接失败' }
    }

    debugLog('success', {
      traceId,
      userId: maskUserId(user.id),
      fileName: maskFileName(fileName),
      hasPublicUrl: !!urlData.publicUrl,
    })

    // 刷新缓存
    revalidatePath('/settings')

    return { success: true, url: urlData.publicUrl }
  } catch (err) {
    console.error('[avatar-upload][exception]', {
      traceId,
      error: err,
    })
    const message = err instanceof Error ? err.message : '上传失败'
    return { success: false, error: message }
  }
}


/**
 * 删除旧头像（Server Action）
 *
 * @param avatarUrl - 旧头像 URL
 * @returns 是否删除成功
 */
export async function deleteAvatarAction(avatarUrl: string): Promise<boolean> {
  try {
    if (!avatarUrl || !avatarUrl.includes(UPLOAD_CONFIG.bucket)) {
      return true
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return false
    }

    // 从 URL 中提取文件路径
    const url = new URL(avatarUrl)
    const pathMatch = url.pathname.match(new RegExp(`${UPLOAD_CONFIG.bucket}/(.+)`))

    if (!pathMatch?.[1]) return true

    const filePath = pathMatch[1]

    // 仅允许删除当前用户目录下的头像文件
    const ownerFolder = filePath.split('/')[0]
    if (ownerFolder !== user.id) {
      return false
    }

    const admin = await createAdminClient()

    const { error } = await admin.storage
      .from(UPLOAD_CONFIG.bucket)
      .remove([filePath])

    if (error) {
      console.error('删除头像失败:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('删除头像出错:', err)
    return false
  }
}
