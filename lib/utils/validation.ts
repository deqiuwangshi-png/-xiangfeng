/**
 * 验证工具函数
 * @module lib/utils/validation
 * @description 提供各种数据验证工具函数
 */

/**
 * UUID 正则表达式
 * 匹配标准 UUID 格式：8-4-4-4-12 的十六进制格式
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * 验证字符串是否为有效的 UUID 格式
 * @param {string} value - 要验证的字符串
 * @returns {boolean} 是否为有效的 UUID
 * @example
 * isValidUUID('550e8400-e29b-41d4-a716-446655440000') // true
 * isValidUUID('invalid-uuid') // false
 */
export function isValidUUID(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }
  return UUID_REGEX.test(value)
}
