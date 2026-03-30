/**
 * 客户端速率限制模块
 * 
 * 用于防止暴力破解攻击
 * 基于内存存储的客户端实现
 * 不依赖 Redis，纯浏览器环境兼容
 */

// 简单的内存存储
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  maxAttempts: number;      // 最大尝试次数
  windowMs: number;         // 时间窗口（毫秒）
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  maxAttempts: 5,           // 5次尝试
  windowMs: 15 * 60 * 1000, // 15分钟窗口
};

/**
 * 检查速率限制
 * 
 * @param identifier - 标识符（设备ID或其他唯一标识）
 * @param options - 速率限制选项
 * @returns 是否允许请求
 * 
 * @example
 * const allowed = checkRateLimit('device_123');
 * if (!allowed) throw new Error('Too many requests');
 */
export async function checkRateLimit(
  identifier: string,
  options: Partial<RateLimitOptions> = {}
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  
  // 内存存储实现
  const record = rateLimitStore.get(key);
  
  // 如果没有记录或已过期，创建新记录
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
  
  // 检查是否超过限制
  if (record.count >= opts.maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }
  
  // 增加计数
  record.count++;
  rateLimitStore.set(key, record);
  
  return {
    allowed: true,
    remaining: opts.maxAttempts - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * 重置速率限制（用于测试或用户解封）
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  const key = `ratelimit:${identifier}`;
  rateLimitStore.delete(key);
}

/**
 * 清理过期的速率限制记录
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// 每小时清理一次过期记录
if (typeof window !== 'undefined') {
  setInterval(cleanupRateLimit, 60 * 60 * 1000);
}