/**
 * 反馈模块工具函数
 * 注意：此文件不包含 Server Actions，纯工具函数
 */

/**
 * 生成加密安全的随机字符串
 * @param length - 字符串长度
 * @returns 随机字符串
 */
function generateSecureRandom(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  // 使用 crypto.getRandomValues 获取加密安全的随机数
  if (typeof window !== 'undefined' && window.crypto) {
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
  } else {
    // 降级方案：使用 Math.random（仅用于服务端渲染）
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return result;
}

/**
 * 生成追踪ID
 *
 * @安全增强 P1: 使用加密安全的随机字符串替代可预测的时间戳
 * - 格式: FB-<时间戳Base36>-<16位随机字符串>
 * - 时间戳用于排序和基本唯一性
 * - 16位随机字符串提供 62^16 的熵，几乎不可猜测
 *
 * @returns 追踪ID字符串
 */
export function generateTrackingId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = generateSecureRandom(16);
  return `FB-${timestamp}-${randomPart}`;
}

/**
 * 验证追踪ID格式
 * @param trackingId - 追踪ID
 * @returns 是否有效
 */
export function isValidTrackingId(trackingId: string): boolean {
  if (!trackingId || typeof trackingId !== 'string') return false;
  // 格式: FB-<时间戳Base36>-<16位随机字符串>
  const pattern = /^FB-[A-Z0-9]+-[A-Za-z0-9]{16}$/;
  return pattern.test(trackingId);
}
