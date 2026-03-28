/**
 * 媒体资源类型定义
 * @module types/media
 * @description 管理编辑器图片上传、临时状态追踪
 */

/**
 * 媒体资源状态
 */
export type MediaStatus = 'temp' | 'published' | 'deleted'

/**
 * 媒体资源记录
 */
export interface MediaRecord {
  id: string
  url: string
  storage_path: string
  file_name: string
  file_size: number
  mime_type: string
  user_id: string
  status: MediaStatus
  article_id: string | null
  created_at: string
  updated_at: string
}

/**
 * 创建媒体记录参数
 */
export interface CreateMediaParams {
  url: string
  storage_path: string
  file_name: string
  file_size: number
  mime_type: string
  status: MediaStatus
}

/**
 * 更新媒体状态参数
 */
export interface UpdateMediaStatusParams {
  urls: string[]
  status: MediaStatus
  articleId?: string
}

/**
 * 上传进度状态
 */
export interface UploadProgress {
  blobUrl: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  finalUrl?: string
  error?: string
}

/**
 * 图片上传结果
 */
export interface ImageUploadResult {
  url: string
  storagePath: string
  fileName: string
}
