'use server';

import { getAccessToken } from './auth';
import type { ApiResponse } from './types';

/**
 * HTTP 请求方法类型
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * 飞书 API 请求选项
 */
interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

/**
 * 飞书 API 客户端
 * 统一处理认证和请求
 */

/**
 * 发送飞书 API 请求
 *
 * @param endpoint API 端点路径（不包含基础URL）
 * @param options 请求选项
 * @returns API 响应数据
 * @throws 请求失败时抛出错误
 */
export async function feishuRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {}, skipAuth = false } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  {/* 添加认证头 */}
  if (!skipAuth) {
    const token = await getAccessToken();
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`飞书API请求失败: ${response.status} ${JSON.stringify(errorData)}`);
  }

  const result: ApiResponse<T> = await response.json();

  if (result.code !== 0) {
    throw new Error(`飞书API错误: ${result.msg}`);
  }

  return result;
}

/**
 * 发送飞书 API 请求（带 FormData）
 * 用于文件上传等场景
 *
 * @param endpoint API 端点路径
 * @param formData FormData 对象
 * @returns API 响应数据
 * @throws 请求失败时抛出错误
 */
export async function feishuRequestWithFormData<T>(
  endpoint: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  const token = await getAccessToken();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`飞书API请求失败: ${response.status} ${JSON.stringify(errorData)}`);
  }

  const result: ApiResponse<T> = await response.json();

  if (result.code !== 0) {
    throw new Error(`飞书API错误: ${result.msg}`);
  }

  return result;
}
