/**
 * 客户端限流 - 极简版
 */

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * 检查客户端限流
 */
export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: maxAttempts - record.count };
}

/**
 * 重置限流计数
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}
