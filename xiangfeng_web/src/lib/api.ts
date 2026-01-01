/**
 * API工具函数
 * 提供统一的API请求处理
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface ApiResponse<T = any> {
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
    const data = await response.json();

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
 * @param {any} data - 请求数据
 * @returns {Promise<ApiResponse<T>>} API响应
 */
export async function post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT请求
 * @param {string} endpoint - API端点
 * @param {any} data - 请求数据
 * @returns {Promise<ApiResponse<T>>} API响应
 */
export async function put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
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
 * @param {any} error - 错误对象
 * @returns {string} 格式化后的错误消息
 */
export function formatError(error: any): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error?.error) {
    return error.error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return '未知错误';
}

/**
 * 验证响应数据
 * @param {any} data - 响应数据
 * @param {string[]} requiredFields - 必需字段
 * @returns {boolean} 是否有效
 */
export function validateResponseData(data: any, requiredFields: string[]): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  return requiredFields.every(field => {
    const value = data[field];
    return value !== undefined && value !== null && value !== '';
  });
}