/**
 * 头像 URL 生成工具
 *
 * @module lib/utils/getAvtUrl
 * @description 统一生成 Dicebear micah 风格头像 URL，确保全站头像一致性
 */

/**
 * Dicebear 背景色
 */
const AVATAR_BG_COLOR = 'B6CAD7';

/**
 * 生成用户头像 URL
 *
 * @param seed - 种子值（用户ID或用户名）
 * @returns Dicebear micah 风格头像 URL
 *
 * @example
 * getAvtUrl('user-123') // 'https://api.dicebear.com/7.x/micah/svg?seed=user-123&backgroundColor=B6CAD7'
 */
export function getAvtUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${AVATAR_BG_COLOR}`;
}

/**
 * 获取用户头像 URL（统一入口）
 *
 * @description
 * 全站统一使用此函数获取用户头像，确保一致性：
 * 1. 如果用户已设置头像(avatarUrl存在)，返回该头像
 * 2. 如果未设置头像，使用 userId 生成默认 Dicebear 头像
 *
 * @param userId - 用户ID（必填，用于生成默认头像）
 * @param avatarUrl - 用户已设置的头像URL（可选）
 * @returns 最终使用的头像 URL
 *
 * @example
 * // 用户已设置头像
 * getUserAvatarUrl('user-123', 'https://example.com/avatar.jpg')
 * // 返回: 'https://example.com/avatar.jpg'
 *
 * @example
 * // 用户未设置头像
 * getUserAvatarUrl('user-123', null)
 * // 返回: 'https://api.dicebear.com/7.x/micah/svg?seed=user-123&backgroundColor=B6CAD7'
 */
export function getUserAvatarUrl(userId: string, avatarUrl?: string | null): string {
  {/* 如果用户已设置头像，直接使用 */}
  if (avatarUrl && avatarUrl.trim().length > 0) {
    return avatarUrl;
  }

  {/* 未设置头像时，使用 userId 生成默认头像，确保同一用户始终显示同一头像 */}
  return getAvtUrl(userId);
}

/**
 * 判断是否为 Dicebear 头像 URL
 *
 * @param url - 图片 URL
 * @returns 是否为 Dicebear URL
 */
export function isDicebearUrl(url: string): boolean {
  return url.includes('dicebear.com');
}

/**
 * 判断是否为默认生成的 Dicebear 头像
 *
 * @param url - 头像 URL
 * @param userId - 用户ID
 * @returns 是否是根据该 userId 生成的默认头像
 */
export function isDefaultAvatar(url: string, userId: string): boolean {
  if (!isDicebearUrl(url)) {
    return false;
  }
  const expectedUrl = getAvtUrl(userId);
  return url === expectedUrl;
}
