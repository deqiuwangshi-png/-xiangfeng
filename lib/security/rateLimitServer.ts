/**
 * 服务端速率限制模块
 * @module lib/security/rateLimitServer
 * @description 基于内存的服务端限流，用于Server Actions
 */

// 简单的内存存储
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  maxAttempts: number;
  windowMs: number;
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15分钟
};

/**
 * 检查服务端速率限制
 * @param identifier - 标识符（邮箱或IP）
 * @param options - 限流选项
 * @returns 限流结果
 */
export function checkServerRateLimit(
  identifier: string,
  options: Partial<RateLimitOptions> = {}
): { allowed: boolean; remaining: number; resetTime: number } {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const now = Date.now();
  const key = `server:ratelimit:${identifier}`;

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + opts.windowMs,
    });
    return {
      allowed: true,
      remaining: opts.maxAttempts - 1,
      resetTime: now + opts.windowMs,
    };
  }

  if (record.count >= opts.maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    remaining: opts.maxAttempts - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * 重置服务端限流
 * @param identifier - 标识符
 */
export function resetServerRateLimit(identifier: string): void {
  rateLimitStore.delete(`server:ratelimit:${identifier}`);
}
