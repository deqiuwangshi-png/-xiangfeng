/**
 * 服务端速率限制模块
 * @module lib/security/rateLimitServer
 * @description 基于 Redis 的分布式服务端限流，用于Server Actions
 *
 * @安全修复 S-03: 支持组合限流（IP+邮箱），防止恶意锁账号
 * @安全修复 S-04: 实现 Redis 分布式限流，支持多实例部署
 */

import Redis from 'ioredis';

// Redis 客户端实例
let redisClient: Redis | null = null;

// 简单的内存存储（作为 Redis 不可用时的回退）
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  maxAttempts: number;
  windowMs: number;
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15分钟
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
 * 检查服务端速率限制
 * @param identifier - 标识符（邮箱或IP或组合）
 * @param options - 限流选项
 * @returns 限流结果
 *
 * @安全说明
 * - 基于 Redis 的分布式存储，支持多实例部署
 * - 当 Redis 不可用时回退到内存存储
 * - 建议使用组合标识符（如 `${ip}:${email}`）防止恶意锁账号
 */
export async function checkServerRateLimit(
  identifier: string,
  options: Partial<RateLimitOptions> = {}
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const now = Date.now();
  const key = `server:ratelimit:${identifier}`;

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
export async function resetServerRateLimit(identifier: string): Promise<void> {
  const key = `server:ratelimit:${identifier}`;
  
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
