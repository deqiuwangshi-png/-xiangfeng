'use client'

/**
 * 账户设置视图状态管理 Hook
 * @module components/settings/account/useAccountView
 * @description 管理账户设置页面的视图状态切换
 */

import { useState, useCallback } from 'react'
import { AccountViewMode } from '@/types/settings'

/**
 * 账户设置视图状态管理
 * @returns 视图状态和操作方法
 */
export function useAccountView() {
  const [viewMode, setViewMode] = useState<AccountViewMode>('list')

  /**
   * 切换到编辑个人资料视图
   */
  const toEditProfile = useCallback(() => {
    setViewMode('editProfile')
  }, [])

  /**
   * 切换到安全设置视图
   */
  const toSecurity = useCallback(() => {
    setViewMode('security')
  }, [])

  /**
   * 切换到更换邮箱视图
   */
  const toChangeEmail = useCallback(() => {
    setViewMode('changeEmail')
  }, [])

  /**
   * 切换到关联账号视图
   */
  const toLinkedAccounts = useCallback(() => {
    setViewMode('linkedAccounts')
  }, [])

  /**
   * 返回列表视图
   */
  const toList = useCallback(() => {
    setViewMode('list')
  }, [])

  return {
    viewMode,
    toEditProfile,
    toSecurity,
    toChangeEmail,
    toLinkedAccounts,
    toList,
  }
}
