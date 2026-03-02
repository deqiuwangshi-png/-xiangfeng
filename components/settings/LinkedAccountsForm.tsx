'use client'

import { useState } from 'react'
import { ArrowLeft, Link2, Github, MessageCircle, CheckCircle2, Circle } from 'lucide-react'
import { IconBox, PrimaryButton } from '@/components/ui'

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
 *
 * 架构说明:
 *   - 使用'use client'指令
 *   - 纯展示组件，不处理路由
 * 更新时间: 2026-03-02
 */

interface LinkedAccountsFormProps {
  onCancel: () => void
  onSave: () => void
}

interface AccountItem {
  id: string
  name: string
  icon: React.ReactNode
  connected: boolean
  email?: string
}

export function LinkedAccountsForm({ onCancel, onSave }: LinkedAccountsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [accounts, setAccounts] = useState<AccountItem[]>([
    {
      id: 'github',
      name: 'GitHub',
      icon: <Github className="w-6 h-6" />,
      connected: true,
      email: 'felix@github.com',
    },
    {
      id: 'wechat',
      name: '微信',
      icon: <MessageCircle className="w-6 h-6" />,
      connected: false,
    },
  ])

  /**
   * 处理绑定/解绑账号
   *
   * @param accountId - 账号ID
   */
  const handleToggleConnection = async (accountId: string) => {
    setIsLoading(true)
    try {
      // TODO: 调用API进行绑定/解绑
      await new Promise(resolve => setTimeout(resolve, 500))

      setAccounts(prev =>
        prev.map(account =>
          account.id === accountId
            ? { ...account, connected: !account.connected }
            : account
        )
      )
    } catch (error) {
      console.error('操作失败:', error)
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

  const connectedCount = accounts.filter(a => a.connected).length

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

      {/* 已关联数量提示 */}
      <div className="card-bg rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3">
          <IconBox>
            <Link2 className="w-5 h-5" />
          </IconBox>
          <div>
            <p className="text-sm text-xf-medium">已关联账号</p>
            <p className="font-medium text-xf-dark">{connectedCount} 个账号已绑定</p>
          </div>
        </div>
      </div>

      {/* 账号列表 */}
      <div className="card-bg rounded-2xl p-8 space-y-6">
        <h2 className="text-lg font-bold text-xf-dark text-layer-1">
          可关联的账号
        </h2>

        <div className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-xf-bg/60"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-xf-light rounded-xl flex items-center justify-center text-xf-primary">
                  {account.icon}
                </div>
                <div>
                  <p className="font-medium text-xf-dark">{account.name}</p>
                  {account.connected && account.email && (
                    <p className="text-sm text-xf-medium">{account.email}</p>
                  )}
                  {!account.connected && (
                    <p className="text-sm text-xf-medium">未绑定</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {account.connected ? (
                  <>
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      已绑定
                    </span>
                    <button
                      onClick={() => handleToggleConnection(account.id)}
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
                      onClick={() => handleToggleConnection(account.id)}
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
