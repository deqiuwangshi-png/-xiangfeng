/**
 * 头像 URL 生成工具
 *
 * @module lib/utils/getAvtUrl
 * @description 统一生成 Dicebear micah 风格头像 URL
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
 * 判断是否为 Dicebear 头像 URL
 *
 * @param url - 图片 URL
 * @returns 是否为 Dicebear URL
 */
export function isDicebearUrl(url: string): boolean {
  return url.includes('dicebear.com');
}
