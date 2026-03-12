'use client'

/**
 * 举报弹窗组件
 * @module components/article/ReportMdl
 * @description 文章举报弹窗（空壳实现）
 */

import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

/**
 * 举报类型配置
 */
const REPORT_TYPES = [
  { id: 'plagiarism', label: '抄袭', desc: '文章内容涉嫌抄袭他人作品' },
  { id: 'illegal', label: '违规内容', desc: '涉及色情、暴力、政治敏感等' },
  { id: 'fake', label: '虚假信息', desc: '传播虚假新闻或误导性信息' },
  { id: 'infringement', label: '侵权', desc: '侵犯他人知识产权或隐私' },
  { id: 'other', label: '其他', desc: '其他违规行为' },
]

/**
 * ReportMdl Props 接口
 */
interface ReportMdlProps {
  /** 文章ID */
  articleId: string
  /** 作者ID */
  authorId: string
  /** 关闭回调 */
  onClose: () => void
}

/**
 * 举报弹窗组件
 *
 * @param {ReportMdlProps} props - 组件属性
 * @returns {JSX.Element} 举报弹窗组件
 *
 * @description
 * 【空壳实现】举报功能弹窗
 *
 * 后续功能：
 * - 选择举报类型
 * - 填写举报原因
 * - 提交举报请求
 * - 显示提交结果
 */
export function ReportMdl({ articleId, authorId, onClose }: ReportMdlProps) {
  const [selectedType, setSelectedType] = useState('')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * 处理提交举报
   *
   * 【空壳实现】后续接入真实API
   */
  const handleSubmit = async () => {
    if (!selectedType) {
      toast.error('请选择举报类型')
      return
    }

    setIsSubmitting(true)

    // 【待实现】调用举报API
    console.log('举报提交:', {
      articleId,
      authorId,
      type: selectedType,
      reason,
    })

    // 模拟提交延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    toast.info('举报功能开发中', {
      description: '敬请期待后续版本！',
    })
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* 关闭按钮 */}
        <button
          className="absolute top-4 right-4 text-xf-medium hover:text-xf-dark transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* 标题 */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-rose-100 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h3 className="text-xl font-bold text-xf-dark">举报内容</h3>
          <p className="text-sm text-xf-medium mt-1">
            请选择合适的举报类型，我们将尽快处理
          </p>
        </div>

        {/* 举报类型选择 */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-xf-dark">
            举报类型 <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {REPORT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedType === type.id
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-xf-bg hover:border-rose-200'
                }`}
              >
                <div className="font-medium text-sm text-xf-dark">
                  {type.label}
                </div>
                <div className="text-xs text-xf-medium mt-0.5 line-clamp-1">
                  {type.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 举报原因 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-xf-dark mb-2">
            详细说明 <span className="text-xf-medium">（可选）</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="请简要描述举报原因，有助于我们更快处理..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-xf-bg focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none text-sm"
          />
        </div>

        {/* 提示信息 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
          <p className="text-xs text-amber-700">
            <strong>注意：</strong>恶意举报将被扣除50积分。举报成功可获得100积分奖励。
          </p>
        </div>

        {/* 提交按钮 */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedType}
          className="w-full py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '提交中...' : '提交举报'}
        </button>
      </div>
    </div>
  )
}
