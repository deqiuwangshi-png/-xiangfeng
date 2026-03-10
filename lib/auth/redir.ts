/**
 * 重定向路径安全工具
 *
 * 用于清洗用户提供的重定向路径，防止开放重定向到外部站点。
 */

const DEFAULT_PATH = '/home';

/**
 * 清洗并返回安全的站内重定向路径
 * @param value 原始路径值（可能来自 query 或表单）
 * @param fallback 默认回退路径
 */
export function sanitizeRedirect(value: unknown, fallback: string = DEFAULT_PATH): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  // 禁止带协议或协议相对的外部链接
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('//')
  ) {
    return fallback;
  }

  // 只允许以 / 开头的站内路径
  if (!trimmed.startsWith('/')) {
    return fallback;
  }

  return trimmed;
}

