/**
 * 安全配置 - 极简版
 */

export const SECURITY_CONFIG = {
  // 密码策略
  PASSWORD: {
    MIN_LENGTH: 8,
  },
  // 速率限制
  RATE_LIMIT: {
    LOGIN: {
      MAX_ATTEMPTS: 5,
      WINDOW_MS: 15 * 60 * 1000,
    },
    REGISTER: {
      MAX_ATTEMPTS: 3,
      WINDOW_MS: 60 * 60 * 1000,
    },
  },
};
