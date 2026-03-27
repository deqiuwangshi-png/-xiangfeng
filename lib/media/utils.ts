/**
 * 媒体资源工具函数
 * @module lib/media/utils
 * @description 客户端媒体处理工具函数
 */

/**
 * 从文章内容中提取所有图片URL
 *
 * @param content - HTML内容
 * @returns 图片URL列表
 */
export function extractImageUrls(content: string): string[] {
  const urls: string[] = []
  const regex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
  let match

  while ((match = regex.exec(content)) !== null) {
    if (match[1] && !match[1].startsWith('blob:')) {
      urls.push(match[1])
    }
  }

  return [...new Set(urls)] // 去重
}
