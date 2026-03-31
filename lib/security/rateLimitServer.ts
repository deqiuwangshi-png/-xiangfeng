/**
 * 服务端速率限制 - 极简版
 * 基于内存的简单限流
 */

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  maxAttempts: number;
  windowMs: number;
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
};

/**
 * 检查服务端速率限制
 */
export async function checkServerRateLimit(
  identifier: string,
  options: Partial<RateLimitOptions> = {}
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

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
 * 重置限流计数
 */
export async function resetServerRateLimit(identifier: string): Promise<void> {
  rateLimitStore.delete(`ratelimit:${identifier}`);
}

/**
 * 获取客户端 IP
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return headers.get('x-real-ip') || 'unknown';
}
