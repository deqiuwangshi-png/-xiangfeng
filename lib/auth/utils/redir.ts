/**
 * 重定向路径安全工具
 *
 * 用于清洗用户提供的重定向路径，防止开放重定向到外部站点。
 */

const DEFAULT_PATH = '/home';

/**
 * 清洗并返回安全的站内重定向路径
 *
 * @param value - 原始路径值（可能来自 query 或表单）
 * @param fallback - 默认回退路径
 * @returns {string} 安全的站内重定向路径
 *
 * @安全说明
 * - 禁止带协议的外部链接 (http://, https://)
 * - 禁止协议相对路径 (//example.com)
 * - 禁止反斜杠绕过 (\/example.com, /\\example.com)
 * - 禁止 @ 符号绕过 (user@example.com)
 * - 禁止 URL 编码绕过 (%2F%2Fexample.com)
 * - 只允许以 / 开头的站内相对路径
 * - 只允许字母、数字、连字符、下划线、斜杠、问号、等号、&、# 等安全字符
 */
export function sanitizeRedirect(value: unknown, fallback: string = DEFAULT_PATH): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  // 解码 URL 编码，防止 %2F%2F 等绕过
  let decoded: string;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    // 解码失败，可能是恶意构造
    return fallback;
  }

  const lower = decoded.toLowerCase();

  // 禁止带协议的外部链接
  if (
    lower.startsWith('http://') ||
    lower.startsWith('https://')
  ) {
    return fallback;
  }

  // 禁止协议相对路径 (//example.com)
  if (lower.startsWith('//')) {
    return fallback;
  }

  // 禁止反斜杠绕过 (\example.com 或 /\example.com)
  if (decoded.includes('\\')) {
    return fallback;
  }

  // 禁止 @ 符号（用于 user@host 绕过）
  if (decoded.includes('@')) {
    return fallback;
  }

  // 禁止冒号（用于 javascript:, data: 等协议）
  if (decoded.includes(':')) {
    return fallback;
  }

  // 禁止空格和控制字符
  if (/[\x00-\x1f\x7f]/.test(decoded)) {
    return fallback;
  }

  // 只允许以 / 开头的站内路径
  if (!decoded.startsWith('/')) {
    return fallback;
  }

  // 最终验证：只允许安全的 URL 字符
  // 允许: / ? = & # - _ . ~ 字母 数字
  if (!/^[\/a-zA-Z0-9\?=&\#\-_\.~]+$/.test(decoded)) {
    return fallback;
  }

  return decoded;
}
