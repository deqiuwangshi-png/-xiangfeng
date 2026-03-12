/**
 * 防重放令牌服务
 * @module lib/security/nonce
 * @description 基于内存的一次性令牌，防止重复提交
 */

// 简单内存存储（生产环境建议用 Redis）
const nonceStore = new Map<string, { used: boolean; expires: number }>();

/**
 * 生成令牌
 * @param action - 操作类型
 * @param userId - 用户ID
 * @returns 令牌字符串
 */
export async function genNonce(action: string, userId: string): Promise<string> {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const nonce = `${action}:${userId}:${timestamp}:${random}`;
  
  // 存储令牌，5分钟过期
  nonceStore.set(nonce, {
    used: false,
    expires: timestamp + 5 * 60 * 1000,
  });
  
  return nonce;
}

/**
 * 验证令牌
 * @param nonce - 令牌字符串
 * @returns 是否有效
 */
export async function verNonce(nonce: string): Promise<boolean> {
  const record = nonceStore.get(nonce);
  
  if (!record) return false;
  if (record.used) return false;
  if (Date.now() > record.expires) {
    nonceStore.delete(nonce);
    return false;
  }
  
  // 标记为已使用
  record.used = true;
  nonceStore.set(nonce, record);
  
  return true;
}

/**
 * 清理过期令牌
 */
export function clrNonce(): void {
  const now = Date.now();
  for (const [key, val] of nonceStore.entries()) {
    if (now > val.expires) {
      nonceStore.delete(key);
    }
  }
}

// 每10分钟清理一次
if (typeof global !== 'undefined') {
  setInterval(clrNonce, 10 * 60 * 1000);
}
