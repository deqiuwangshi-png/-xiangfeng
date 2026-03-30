'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Link2, Github, CheckCircle2, Circle } from '@/components/icons'
import { IconBox, PrimaryButton } from '@/components/ui'
import {
  getLinkedAccounts,
  linkAccount,
  unlinkAccount,
} from '@/lib/settings/actions/linkedAccounts'
import type { OAuthProvider, LinkedAccountItem } from '@/types/user/settings'

/**
 * 管理关联账号表单组件
 *
 * 作用: 允许用户管理第三方账号关联
 *
 * @param {function} onCancel - 取消回调函数
 * @param {function} onSave - 保存成功回调函数
 * @returns {JSX.Element} 管理关联账号表单组件
 *
 * 使用说明:
 *   - 查看已关联账号
 *   - 绑定/解绑第三方账号
 * 更新时间: 2026-03-24
 */

interface LinkedAccountsFormProps {
  onCancel: () => void
  onSave: () => void
}

interface AccountItem extends LinkedAccountItem {
  icon: React.ReactNode
}

/**
 * 获取提供商图标
 *
 * @param provider - 提供商ID
 * @returns 图标组件
 */
function getProviderIcon(provider: string): React.ReactNode {
  switch (provider) {
    case 'github':
      return <Github className="w-6 h-6" />
    case 'google':
      return <Link2 className="w-6 h-6" />
    default:
      return <Link2 className="w-6 h-6" />
  }
}

export function LinkedAccountsForm({ onCancel, onSave }: LinkedAccountsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [accounts, setAccounts] = useState<AccountItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const searchParams = useSearchParams()

  /**
   * 检查URL参数中的回调状态
   */
  useEffect(() => {
    const linked = searchParams.get('linked')
    const linkError = searchParams.get('link_error')

    if (linked === 'success') {
      setSuccessMessage('账号绑定成功！')
      // 清除URL参数
      const url = new URL(window.location.href)
      url.searchParams.delete('linked')
      window.history.replaceState({}, '', url.toString())
    } else if (linkError) {
      setError('账号绑定失败，请稍后重试')
      // 清除URL参数
      const url = new URL(window.location.href)
      url.searchParams.delete('link_error')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  /**
   * 加载关联账号列表
   */
  const loadAccounts = useCallback(async () => {
    setIsInitialLoading(true)
    setError(null)

    try {
      const result = await getLinkedAccounts()

      if (result.success && result.accounts) {
        // 为每个账号添加图标
        const accountsWithIcons: AccountItem[] = result.accounts.map(
          (account) => ({
            ...account,
            icon: getProviderIcon(account.provider),
          })
        )
        setAccounts(accountsWithIcons)
      } else {
        setError(result.error || '获取关联账号失败')
      }
    } catch (err) {
      console.error('加载关联账号失败:', err)
      setError('加载失败，请稍后重试')
    } finally {
      setIsInitialLoading(false)
    }
  }, [])

  /**
   * 组件挂载时加载数据
   */
  useEffect(() => {
    loadAccounts()
  }, [loadAccounts])

  /**
   * 处理绑定账号
   *
   * @param provider - 提供商ID
   */
  const handleLinkAccount = async (provider: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await linkAccount(provider as OAuthProvider)

      if (result.success && result.url) {
        // 跳转到授权页面
        window.location.href = result.url
      } else {
        setError(result.error || '绑定失败')
      }
    } catch (err) {
      console.error('绑定账号失败:', err)
      setError('绑定失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 处理解绑账号
   *
   * @param provider - 提供商ID
   */
  const handleUnlinkAccount = async (provider: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await unlinkAccount(provider as OAuthProvider)

      if (result.success) {
        // 更新本地状态
        setAccounts((prev) =>
          prev.map((account) =>
            account.provider === provider
              ? { ...account, isConnected: false, email: undefined }
              : account
          )
        )
      } else {
        setError(result.error || '解绑失败')
      }
    } catch (err) {
      console.error('解绑账号失败:', err)
      setError('解绑失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 处理完成
   */
  const handleDone = () => {
    onSave()
  }

  const connectedCount = accounts.filter((a) => a.isConnected).length

  /**
   * 加载状态
   */
  if (isInitialLoading) {
    return (
      <div className="fade-in-up">
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 text-xf-primary hover:text-xf-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">返回账户设置</span>
          </button>
          <header className="text-right">
            <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1">
              关联账号
            </h1>
          </header>
        </div>
        <div className="card-bg rounded-2xl p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in-up">
      {/* 返回按钮和标题区域 */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xf-primary hover:text-xf-accent transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">返回账户设置</span>
        </button>

        {/* 页面标题 - 靠右对齐 */}
        <header className="text-right">
          <h1 className="text-3xl font-serif text-xf-accent font-bold text-layer-1">
            关联账号
          </h1>
          <p className="text-xf-primary mt-2 font-medium">
            管理你的第三方账号绑定
          </p>
        </header>
      </div>

      {/* 成功提示 */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
          {successMessage}
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* 已关联数量提示 */}
      <div className="card-bg rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3">
          <IconBox>
            <Link2 className="w-5 h-5" />
          </IconBox>
          <div>
            <p className="text-sm text-xf-medium">已关联账号</p>
            <p className="font-medium text-xf-dark">
              {connectedCount} 个账号已绑定
            </p>
          </div>
        </div>
      </div>

      {/* 账号列表 */}
      <div className="card-bg rounded-2xl p-8 space-y-6">
        <h2 className="text-lg font-bold text-xf-dark text-layer-1">
          可关联的账号
        </h2>

        <div className="space-y-4">
          {accounts.map((account, index) => (
            <div
              key={`${account.provider}-${index}`}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-xf-bg/60"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-xf-light rounded-xl flex items-center justify-center text-xf-primary">
                  {account.icon}
                </div>
                <div>
                  <p className="font-medium text-xf-dark">{account.providerName}</p>
                  {account.isConnected && account.email && (
                    <p className="text-sm text-xf-medium">{account.email}</p>
                  )}
                  {!account.isConnected && (
                    <p className="text-sm text-xf-medium">未绑定</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {account.isConnected ? (
                  <>
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      已绑定
                    </span>
                    <button
                      onClick={() => handleUnlinkAccount(account.provider)}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      解绑
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1 text-sm text-xf-medium">
                      <Circle className="w-4 h-4" />
                      未绑定
                    </span>
                    <PrimaryButton
                      onClick={() => handleLinkAccount(account.provider)}
                      disabled={isLoading}
                      className="px-4! py-2! text-sm! rounded-lg! shadow-sm!"
                    >
                      绑定
                    </PrimaryButton>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 说明文字 */}
      <div className="mt-6 text-sm text-xf-medium">
        <p>
          关联第三方账号后，你可以使用这些账号快速登录。我们只会获取你的公开信息，不会访问你的隐私数据。
        </p>
      </div>

      {/* 完成按钮 */}
      <div className="mt-8">
        <PrimaryButton fullWidth onClick={handleDone}>
          完成
        </PrimaryButton>
      </div>
    </div>
  )
}
