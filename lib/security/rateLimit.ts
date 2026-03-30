/**
 * 速率限制模块
 * 
 * 用于防止暴力破解攻击
 * 基于 Redis 的分布式实现（适合多实例部署）
 * 当 Redis 不可用时回退到内存存储
 */

import Redis from 'ioredis';

// Redis 客户端实例
let redisClient: Redis | null = null;

// 简单的内存存储（作为 Redis 不可用时的回退）
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  maxAttempts: number;      // 最大尝试次数
  windowMs: number;         // 时间窗口（毫秒）
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  maxAttempts: 5,           // 5次尝试
  windowMs: 15 * 60 * 1000, // 15分钟窗口
};

// 初始化 Redis 客户端
function initRedis() {
  if (!redisClient) {
    try {
      redisClient = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: 2,
        retryStrategy: (times: number) => Math.min(times * 50, 2000),
      });

      redisClient.on('error', (err: Error) => {
        console.error('Redis connection error:', err);
        redisClient = null;
      });
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      redisClient = null;
    }
  }
  return redisClient;
}

/**
 * 检查速率限制
 * 
 * @param identifier - 标识符（IP地址或用户ID）
 * @param options - 速率限制选项
 * @returns 是否允许请求
 * 
 * @example
 * const allowed = checkRateLimit('192.168.1.1');
 * if (!allowed) throw new Error('Too many requests');
 */
export async function checkRateLimit(
  identifier: string,
  options: Partial<RateLimitOptions> = {}
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  
  // 尝试使用 Redis
  const redis = initRedis();
  if (redis) {
    try {
      const pipeline = redis.pipeline();
      const ttl = Math.ceil(opts.windowMs / 1000);
      
      // 获取当前计数
      pipeline.get(key);
      // 设置过期时间（如果不存在）
      pipeline.expire(key, ttl);
      
      const pipelineResult = await pipeline.exec();
      const count = pipelineResult && pipelineResult[0] && pipelineResult[0][1] ? pipelineResult[0][1] : null;
      const currentCount = count ? parseInt(count.toString()) : 0;
      
      if (currentCount >= opts.maxAttempts) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: now + opts.windowMs,
        };
      }
      
      // 增加计数
      await redis.incr(key);
      
      return {
        allowed: true,
        remaining: opts.maxAttempts - (currentCount + 1),
        resetTime: now + opts.windowMs,
      };
    } catch (error) {
      console.error('Redis rate limit error:', error);
      redisClient = null;
      // 回退到内存存储
    }
  }
  
  // 内存存储实现（回退方案）
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
  
  // 尝试使用 Redis
  const redis = initRedis();
  if (redis) {
    try {
      await redis.del(key);
      return;
    } catch (error) {
      console.error('Redis reset error:', error);
      redisClient = null;
    }
  }
  
  // 回退到内存存储
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
if (typeof global !== 'undefined') {
  setInterval(cleanupRateLimit, 60 * 60 * 1000);
}
