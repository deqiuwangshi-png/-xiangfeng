/**
 * 反馈模块工具函数
 * 注意：此文件不包含 Server Actions，纯工具函数
 */

/**
 * 生成追踪ID
 * 格式: FB-年月日-时间戳后6位-随机3位数字
 * 使用时间和随机数组合降低冲突概率
 *
 * @returns 追踪ID字符串
 */
export function generateTrackingId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  {/* 时间戳后6位（毫秒级精度） */}
  const timeSuffix = String(now.getTime()).slice(-6);
  {/* 3位随机数 */}
  const random = Math.floor(Math.random() * 900 + 100);
  return `FB-${year}${month}${day}-${timeSuffix}-${random}`;
}
