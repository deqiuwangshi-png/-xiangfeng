'use client'

/**
 * 举报弹窗组件
 * @module components/article/ReportMdl
 * @description 文章举报弹窗（空壳实现）
 */

import { useState } from 'react'
import { X, Flag } from 'lucide-react'
import type { ReportMdlProps } from '@/types'
import { useArticleToast } from '@/hooks/article/useArticleToast'

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
export function ReportMdl({ articleId: _articleId, authorId: _authorId, onClose }: ReportMdlProps) {
  void _articleId
  void _authorId
  const [selectedType, setSelectedType] = useState('')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showError, showInfo } = useArticleToast()

  /**
   * 处理提交举报
   *
   * 后续接入真实API
   */
  const handleSubmit = async () => {
    if (!selectedType) {
      showError('请选择举报类型')
      return
    }

    setIsSubmitting(true)

    // 【待实现】调用举报API
    // 模拟提交延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    showInfo('举报功能开发中', '敬请期待后续版本！')
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
        {/* 关闭按钮 */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* 标题 */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
            <Flag className="w-6 h-6 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">举报内容</h3>
          <p className="text-sm text-gray-500 mt-1">
            请选择合适的举报类型，我们将尽快处理
          </p>
        </div>

        {/* 举报类型选择 */}
        <div className="space-y-3 mb-4">
          <label className="block text-sm font-medium text-gray-700">
            举报类型 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {REPORT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-3 rounded-lg border text-left ${
                  selectedType === type.id
                    ? 'border-[#84709B] bg-[#84709B]/5'
                    : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                }`}
              >
                <div className={`font-medium text-sm ${
                  selectedType === type.id ? 'text-[#84709B]' : 'text-gray-700'
                }`}>
                  {type.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {type.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 举报原因 */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            详细说明 <span className="text-gray-400">（可选）</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="请简要描述举报原因，有助于我们更快处理..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#84709B] focus:ring-1 focus:ring-[#84709B]/20 resize-y text-sm min-h-[100px]"
          />
        </div>

        {/* 提示信息 */}
        <div className="bg-gray-50 rounded-lg p-3 mb-5">
          <p className="text-xs text-gray-600">
            <span className="text-amber-600 font-medium">注意：</span>请确保举报内容真实有效，恶意举报将受到处理。
          </p>
        </div>

        {/* 提交按钮 */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedType}
          className={`w-full py-3 rounded-lg font-medium ${
            selectedType
              ? 'bg-[#84709B] text-white hover:bg-[#6b5a7d]'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? '提交中...' : '提交举报'}
        </button>
      </div>
    </div>
  )
}
