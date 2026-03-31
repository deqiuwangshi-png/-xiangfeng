/**
 * 随机数生成 - 极简版
 */

const nonceStore = new Map<string, string>();

/**
 * 生成随机 nonce
 */
export async function genNonce(context?: string, userId?: string): Promise<string> {
  const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const key = context && userId ? `${context}:${userId}` : 'default';
  nonceStore.set(key, nonce);
  return nonce;
}

/**
 * 验证 nonce
 */
export async function verNonce(nonce: string, context?: string, userId?: string): Promise<boolean> {
  const key = context && userId ? `${context}:${userId}` : 'default';
  const stored = nonceStore.get(key);
  if (stored === nonce) {
    nonceStore.delete(key);
    return true;
  }
  return false;
}
