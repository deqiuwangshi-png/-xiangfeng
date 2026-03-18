/**
 * 服务端速率限制模块
 * @module lib/security/rateLimitServer
 * @description 基于内存的服务端限流，用于Server Actions
 *
 * @安全修复 S-03: 支持组合限流（IP+邮箱），防止恶意锁账号
 * @安全修复 S-04: 添加分布式部署警告，建议使用 Redis
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
 * @param identifier - 标识符（邮箱或IP或组合）
 * @param options - 限流选项
 * @returns 限流结果
 *
 * @安全说明
 * - 单实例内存存储，分布式部署需改用 Redis
 * - 建议使用组合标识符（如 `${ip}:${email}`）防止恶意锁账号
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

/**
 * 获取客户端 IP 地址
 * @param headers - 请求头
 * @returns IP 地址
 */
export function getClientIp(headers: Headers): string {
  // 优先从 X-Forwarded-For 获取（经过代理时）
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // 其次从 X-Real-IP 获取
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // 兜底返回未知
  return 'unknown';
}
