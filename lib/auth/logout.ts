/**
 * 退出登录核心模块
 * @module lib/auth/logout
 * @description 封装退出登录的纯JavaScript逻辑，不依赖React
 */

/**
 * 退出登录结果接口
 * @interface LogoutResult
 * @property {boolean} success - 是否退出成功
 * @property {string} [error] - 错误信息（如果失败）
 */
export interface LogoutResult {
  success: boolean
  error?: string
}

/**
 * 退出登录核心函数
 * @description 调用服务端API清除httpOnly Cookie，然后调用客户端Supabase清除会话状态
 * @returns {Promise<LogoutResult>} 退出结果
 * @throws {Error} 当网络请求失败时抛出错误
 * 
 * @example
 * // 基础用法
 * const result = await logout()
 * if (result.success) {
 *   console.log('退出成功')
 * } else {
 *   console.error('退出失败:', result.error)
 * }
 */
export async function logout(): Promise<LogoutResult> {
  try {
    // 1. 调用服务端API清除httpOnly Cookie
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      console.error('Server logout failed:', response.statusText)
    }

    // 2. 动态导入Supabase客户端（避免服务端渲染问题）
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    // 3. 调用客户端signOut清除本地状态
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Client logout error:', error.message)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Logout failed:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : '未知错误',
    }
  }
}

/**
 * 退出登录并跳转
 * @description 执行退出登录后跳转到指定页面
 * @param {string} [redirectTo='/login'] - 跳转目标路径
 * @returns {Promise<LogoutResult>} 退出结果
 * 
 * @example
 * // 退出后跳转到首页
 * await logoutAndRedirect('/')
 */
export async function logoutAndRedirect(redirectTo: string = '/login'): Promise<LogoutResult> {
  const result = await logout()
  
  if (result.success) {
    // 使用window.location.href强制刷新页面，确保中间件重新检查会话
    window.location.href = redirectTo
  }
  
  return result
}
