/**
 * API工具函数
 * 提供统一的API请求处理
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 通用的API请求函数
 * @param {string} endpoint - API端点
 * @param {RequestInit} options - 请求选项
 * @returns {Promise<ApiResponse<T>>} API响应
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    // 检查响应是否为JSON格式
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON解析错误:', jsonError);
        return {
          error: '网络错误，请重试',
          message: '响应格式错误，无法解析JSON',
        };
      }
    } else {
      // 非JSON响应，返回错误
      return {
        error: '网络错误，请重试',
        message: `响应格式错误，预期JSON格式，但收到${contentType || '未知格式'}`,
      };
    }

    if (!response.ok) {
      return {
        error: data.error || '请求失败',
        message: data.message || '未知错误',
      };
    }

    return { data, message: data.message };
  } catch (error) {
    console.error('API请求错误:', error);
    return {
      error: '网络错误，请重试',
      message: error instanceof Error ? error.message : '未知错误',
    };
  }
}

/**
 * GET请求
 * @param {string} endpoint - API端点
 * @param {Record<string, string>} params - 查询参数
 * @returns {Promise<ApiResponse<T>>} API响应
 */
export async function get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
  const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
  return apiRequest<T>(url, { method: 'GET' });
}

/**
 * POST请求
 * @param {string} endpoint - API端点
 * @param {Record<string, unknown>} data - 请求数据
 * @returns {Promise<ApiResponse<T>>} API响应
 */
export async function post<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT请求
 * @param {string} endpoint - API端点
 * @param {Record<string, unknown>} data - 请求数据
 * @returns {Promise<ApiResponse<T>>} API响应
 */
export async function put<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE请求
 * @param {string} endpoint - API端点
 * @returns {Promise<ApiResponse<T>>} API响应
 */
export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

/**
 * 格式化错误消息
 * @param {unknown} error - 错误对象
 * @returns {string} 格式化后的错误消息
 */
export function formatError(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error && typeof error === 'object' && 'error' in error) {
    return String((error as { error: unknown }).error);
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  
  return '未知错误';
}

/**
 * 验证响应数据
 * @param {unknown} data - 响应数据
 * @param {string[]} requiredFields - 必需字段
 * @returns {boolean} 是否有效
 */
export function validateResponseData(data: unknown, requiredFields: string[]): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  return requiredFields.every(field => {
    const value = (data as Record<string, unknown>)[field];
    return value !== undefined && value !== null && value !== '';
  });
}