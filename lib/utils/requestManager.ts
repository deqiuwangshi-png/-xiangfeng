/**
 * 请求管理器
 * @module lib/utils/requestManager
 * @description 管理并发请求，支持请求去重和取消
 */

/**
 * 请求存储
 * @constant pendingRequests
 */
const pendingRequests = new Map<string, AbortController>()

/**
 * 生成请求key
 * @param {string} url - 请求URL
 * @param {object} params - 请求参数
 * @returns {string} 请求key
 */
function generateRequestKey(url: string, params?: object): string {
  return `${url}:${JSON.stringify(params || {})}`
}

/**
 * 创建可取消的请求
 * @param {string} url - 请求URL
 * @param {object} params - 请求参数
 * @returns {AbortController} AbortController实例
 */
export function createCancellableRequest(url: string, params?: object): AbortController {
  const key = generateRequestKey(url, params)
  
  // 取消之前的相同请求
  const existingController = pendingRequests.get(key)
  if (existingController) {
    existingController.abort()
    pendingRequests.delete(key)
  }
  
  // 创建新的控制器
  const controller = new AbortController()
  pendingRequests.set(key, controller)
  
  // 请求完成时清理
  const cleanup = () => {
    pendingRequests.delete(key)
  }
  
  controller.signal.addEventListener('abort', cleanup)
  
  return controller
}

/**
 * 取消所有挂起的请求
 */
export function cancelAllRequests(): void {
  pendingRequests.forEach((controller) => {
    controller.abort()
  })
  pendingRequests.clear()
}

/**
 * 取消指定URL的请求
 * @param {string} url - 请求URL
 * @param {object} params - 请求参数
 */
export function cancelRequest(url: string, params?: object): void {
  const key = generateRequestKey(url, params)
  const controller = pendingRequests.get(key)
  if (controller) {
    controller.abort()
    pendingRequests.delete(key)
  }
}

/**
 * 安全执行异步请求
 * @param {Function} asyncFn - 异步函数
 * @param {AbortSignal} signal - 中止信号
 * @returns {Promise<any>} 请求结果
 */
export async function safeAsyncRequest<T>(asyncFn: () => Promise<T>, signal?: AbortSignal): Promise<T> {
  try {
    // 检查信号是否已中止
    if (signal && signal.aborted) {
      throw new Error('Request aborted')
    }
    
    // 执行异步请求
    const result = await asyncFn()
    
    // 再次检查信号是否已中止
    if (signal && signal.aborted) {
      throw new Error('Request aborted')
    }
    
    return result
  } catch (error) {
    // 处理中止错误
    if (error instanceof Error && error.name === 'AbortError') {
      // 静默处理中止错误，因为这通常是用户主动取消或组件卸载导致的
      throw new Error('Request cancelled')
    }
    throw error
  }
}

/**
 * 检查请求是否已取消
 * @param {AbortSignal} signal - 中止信号
 * @returns {boolean} 是否已取消
 */
export function isRequestCancelled(signal?: AbortSignal): boolean {
  return signal ? signal.aborted : false
}
