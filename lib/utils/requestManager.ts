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
