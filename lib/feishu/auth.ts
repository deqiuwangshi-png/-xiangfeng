'use server';

import { FEISHU_CONFIG } from './config';

/**
 * 飞书访问令牌缓存
 */
interface TokenCache {
  token: string;
  expireTime: number;
}

let accessTokenCache: TokenCache | null = null;

/**
 * 获取飞书访问令牌
 * 使用应用凭证获取 tenant_access_token
 *
 * @returns 访问令牌
 * @throws 获取失败时抛出错误
 */
export async function getAccessToken(): Promise<string> {
  {/* 检查缓存是否有效（提前5分钟过期） */}
  if (accessTokenCache && accessTokenCache.expireTime > Date.now() + 5 * 60 * 1000) {
    return accessTokenCache.token;
  }

  const response = await fetch(`${FEISHU_CONFIG.API_BASE}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: FEISHU_CONFIG.APP_ID,
      app_secret: FEISHU_CONFIG.APP_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error(`获取飞书访问令牌失败: ${response.status}`);
  }

  const data = await response.json();

  if (data.code !== 0) {
    throw new Error(`飞书API错误: ${data.msg}`);
  }

  {/* 缓存令牌 */}
  accessTokenCache = {
    token: data.tenant_access_token,
    expireTime: Date.now() + data.expire * 1000,
  };

  return data.tenant_access_token;
}


